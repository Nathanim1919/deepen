import { logger } from "../../common/utils/logger";
import { 
  BrainChatConversation, 
  IBrainChatConversation,
  BrainChatContext,
  BrainChatMessage,
  MessageSource
} from "../../common/models/BrainChat";
import { Types } from "mongoose";
import { openRouter, sendMessage } from "../../common/config/openRouter";
import { v4 as uuidv4 } from "uuid";
import { Message } from "@openrouter/sdk/esm/models";
import { ragSearch, RAGSearchResult } from "./vectorStore";
import Collection from "../../common/models/Collection";
import { Capture } from "../../common/models/Capture";
import { UserService } from "../../api/services/user.service";

// Re-export for convenience
export { BrainChatContext, BrainChatMessage, MessageSource };

/**
 * Maximum number of messages to include in conversation history
 * This prevents token overflow and reduces costs while maintaining context
 */
const MAX_CONVERSATION_HISTORY = 10;

/**
 * Deepen's core personality — used as the base system prompt for all brain chat conversations.
 */
const DEEPEN_PERSONALITY = `You are **Deepen** — a smart, friendly AI knowledge assistant that helps users explore, understand, and reason about their saved content. You are part of a "second brain" platform where users capture web pages, articles, PDFs, and other content.

Your personality:
- Friendly, curious, and conversational — like a knowledgeable peer, never robotic
- You reason carefully using the user's saved content as your primary source
- You're honest when you don't know something or can't find it in the user's knowledge base
- You give concise, well-structured answers using markdown formatting
- You proactively suggest follow-up questions or related topics the user might explore

You have access to the user's captured knowledge through semantic search. When context is provided, prioritize it. When no relevant context is found, be transparent about it but still try to be helpful.`;

/**
 * Result from building conversation context - includes both prompt and sources
 */
export interface ContextBuildResult {
  systemPrompt: string;
  sources: MessageSource[];
}


export interface BrainChatStartRequest {
  id: string;
  createdAt: Date;
  modelId: string;
  context: BrainChatContext;
  messages: BrainChatMessage[];
}

/**
 * Brain Chat Service - Handles conversational AI across multiple knowledge sources
 * All AI calls go through OpenRouter for consistent model selection
 */
export class BrainChatService {

  /**
   * Build the context of the conversation by fetching relevant chunks from vector DB
   * 
   * @param context - What sources to search (brain/bookmarks/captures/collections)
   * @param query - The user's question (used for semantic search)
   * @param userId - The user's ID
   * @param userApiKey - Gemini API key for generating query embeddings
   * @returns Object with systemPrompt and sources, or null if no context needed
   */
  static async buildConversationContext(
    context: BrainChatContext,
    query: string,
    userId: string,
    userApiKey: string
  ): Promise<ContextBuildResult | null> {
    const traceId = `[BuildContext]`;
    
    try {
      // Step 1: Determine which document IDs to search
      let documentIds: string[] | undefined = undefined; // undefined = search ALL
      let contextDescription = "";

      if (context.brain.enabled) {
        // Brain mode: search ALL user's content (no documentIds filter)
        documentIds = undefined;
        contextDescription = "your entire knowledge base";
        logger.info(`${traceId} Brain mode - searching all user content`);
      } 
      else if (context.bookmarks.enabled) {
        // Bookmarks mode: get all bookmarked capture IDs first
        const bookmarkedCaptures = await Capture.find({ 
          owner: new Types.ObjectId(userId), 
          bookmarked: true 
        }).select('_id').lean();
        
        documentIds = bookmarkedCaptures.map(c => c._id.toString());
        contextDescription = "your bookmarked items";
        logger.info(`${traceId} Bookmarks mode - found ${documentIds.length} bookmarked captures`);
        
        if (documentIds.length === 0) {
          logger.info(`${traceId} No bookmarked captures found`);
          return null;
        }
      }
      else if (context.collections.ids.length > 0) {
        // Collections mode: get all capture IDs from selected collections
        const collections = await Collection.find({
          _id: { $in: context.collections.ids.map(id => new Types.ObjectId(id)) },
          user: new Types.ObjectId(userId)
        }).select('captures').lean();
        
        // Flatten all capture IDs from all collections
        documentIds = collections
          .flatMap(c => c.captures || [])
          .map(id => id.toString());
        
        contextDescription = "your selected collections";
        logger.info(`${traceId} Collections mode - found ${documentIds.length} captures in ${collections.length} collections`);
        
        if (documentIds.length === 0) {
          logger.info(`${traceId} No captures found in selected collections`);
          return null;
        }
      }
      else if (context.captures.ids.length > 0) {
        // Specific captures mode: use the provided IDs directly
        documentIds = context.captures.ids;
        contextDescription = "your selected captures";
        logger.info(`${traceId} Captures mode - searching ${documentIds.length} specific captures`);
      }
      else {
        // No context selected - return null (AI will answer without context)
        logger.info(`${traceId} No context selected - proceeding without RAG`);
        return null;
      }

      // Step 2: Perform RAG search
      logger.info(`${traceId} 🔍 Searching for relevant chunks...`);
      const searchResults = await ragSearch({
        query,
        userId,
        userApiKey,
        limit: 10, // Get top 10 most relevant chunks
        documentIds,
      });

      if (searchResults.length === 0) {
        logger.info(`${traceId} No relevant chunks found`);
        return null;
      }

      logger.info(`${traceId} ✅ Found ${searchResults.length} relevant chunks`);

      // Step 3: Format the results into a context string
      const formattedContext = this.formatContextForLLM(searchResults, contextDescription);
      
      // Step 4: Convert search results to MessageSource format for tracking
      const sources: MessageSource[] = searchResults.map(r => ({
        docId: r.docId,
        score: r.score,
        chunkIndex: r.chunkIndex,
        preview: r.text.slice(0, 100) + (r.text.length > 100 ? '...' : ''),
      }));

      return {
        systemPrompt: formattedContext,
        sources: sources,
      };

    } catch (error) {
      logger.error(`${traceId} ❌ Error building context:`, error);
      // Don't fail the whole request - just proceed without context
      return null;
    }
  }

  /**
   * Format RAG search results into a string for the LLM
   * 
   * @param results - Array of search results with text chunks
   * @param description - Human-readable description of the context source
   * @returns Formatted context string
   */
  private static formatContextForLLM(results: RAGSearchResult[], description: string): string {
    // Group chunks by document for better readability
    const chunksByDoc = new Map<string, RAGSearchResult[]>();
    
    for (const result of results) {
      const existing = chunksByDoc.get(result.docId) || [];
      existing.push(result);
      chunksByDoc.set(result.docId, existing);
    }

    // Build the context string
    let contextParts: string[] = [];
    
    for (const [docId, chunks] of chunksByDoc) {
      // Sort chunks by their original position in the document
      chunks.sort((a, b) => a.chunkIndex - b.chunkIndex);
      
      // Join the chunk texts
      const docContent = chunks.map(c => c.text).join("\n\n");
      
      contextParts.push(`--- Source: Document ${docId.slice(-6)} ---\n${docContent}`);
    }

    const allContext = contextParts.join("\n\n");

    return `${DEEPEN_PERSONALITY}

The user is asking questions about ${description}. Below is relevant content retrieved from their saved documents. Use this information to answer their questions accurately. If the answer isn't in the provided context, say so honestly — but you can still reason and offer helpful related insights.

=== RELEVANT CONTEXT ===

${allContext}

=== END OF CONTEXT ===

Answer the user's question based on the context above.`;
  }

  /**
   * Create a new brain chat session with streaming
   * Now includes RAG context building with source tracking!
   * 
   * @param userId - The user's ID
   * @param request - Contains messages, context, modelId
   * @param signal - AbortSignal for cancellation
   * @returns Object with conversation, stream, and sources used
   */
  static async startConversationStreaming(userId: string, request: BrainChatStartRequest, signal?: AbortSignal) {
    try {
      if (request.messages.length === 0) {
        throw new Error('Messages are required to start a conversation');
      }

      // Use provided modelId or default to openrouter/auto
      const modelId = request.modelId || 'openrouter/auto';

      // Get the user's first message (the query for RAG search)
      const userQuery = request.messages.find(m => m.role === 'user')?.content || '';

      // Try to get user's Gemini API key for RAG (optional - RAG requires it)
      const userApiKey = await UserService.getGeminiApiKey(userId);

      // Build the context using RAG search (if API key available and context selected)
      let systemPrompt = DEEPEN_PERSONALITY;
      let sources: MessageSource[] = [];  // Track sources for this response
      
      if (userApiKey && request.context) {
        logger.info(`[StartConversation] Building RAG context for user ${userId.slice(0, 8)}...`);
        
        const ragResult = await this.buildConversationContext(
          request.context,
          userQuery,
          userId,
          userApiKey
        );

        if (ragResult) {
          systemPrompt = ragResult.systemPrompt;
          sources = ragResult.sources;
          logger.info(`[StartConversation] ✅ RAG context built with ${sources.length} sources`);
        } else {
          logger.info(`[StartConversation] No RAG context (user may not have relevant content)`);
        }
      } else {
        logger.info(`[StartConversation] Skipping RAG - ${!userApiKey ? 'no API key' : 'no context selected'}`);
      }

      // Create the conversation document
      const conversation = new BrainChatConversation({
        userId: new Types.ObjectId(userId),
        title: "",
        createdAt: request.createdAt,
        context: request.context,
        modelId,
        messages: request.messages
      });

      // Build the messages array with our RAG-enhanced system prompt
      const messages: Message[] = [
        {
          role: "system",
          content: systemPrompt,
        },
        ...request.messages,
      ];

      const stream = await sendMessage(
        modelId,
        messages,
        signal
      );

      // Return sources so controller can attach them to the assistant message
      return { conversation, stream, sources };
    } catch (error) {
      logger.error('Failed to start conversation streaming', { error, userId });
      throw error;
    }
  }

  /**
   * Create a new brain chat session (non-streaming version)
   * Now includes RAG context building with source tracking!
   * 
   * @param userId - The user's ID
   * @param request - Contains messages, context, modelId
   * @returns The created brain chat conversation with AI response and sources
   */
  static async startConversation(userId: string, request: BrainChatStartRequest) {
    try {
     
      if (request.messages.length === 0) {
        throw new Error('Messages are required to start a conversation');
      }

      // Use provided modelId or default to openrouter/auto
      const modelId = request.modelId || 'openrouter/auto';

      // Get the user's first message (the query for RAG search)
      const userQuery = request.messages.find(m => m.role === 'user')?.content || '';

      // Try to get user's Gemini API key for RAG
      const userApiKey = await UserService.getGeminiApiKey(userId);

      // Build the context using RAG search
      let systemPrompt = DEEPEN_PERSONALITY;
      let sources: MessageSource[] = [];
      
      if (userApiKey && request.context) {
        const ragResult = await this.buildConversationContext(
          request.context,
          userQuery,
          userId,
          userApiKey
        );

        if (ragResult) {
          systemPrompt = ragResult.systemPrompt;
          sources = ragResult.sources;
        }
      }

      const conversation = new BrainChatConversation({
        userId: new Types.ObjectId(userId),
        title: "new conversation",
        createdAt: request.createdAt,
        context: request.context,
        modelId,
        messages: request.messages
      });

      const askModel = await openRouter.chat.send({
        model: modelId,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...request.messages,
        ],
      });

      // Add the AI response to the conversation messages (with sources)
      const aiResponse = askModel.choices[0]?.message?.content;
      if (aiResponse && typeof aiResponse === 'string') {
        conversation.messages.push({
          id: uuidv4() as string,
          role: 'assistant' as const,
          content: aiResponse,
          timestamp: new Date(),
          status: 'received' as const,
          sources: sources.length > 0 ? sources : undefined,  // Attach sources to message
        } as BrainChatMessage);
      }

      await conversation.save();
      return { conversation, sources };  // Return sources for immediate use
    } catch (error) {
      logger.error('Failed to start conversation', { error, userId });
      throw error;
    }
  }

  /**
   * Send a message to an existing brain chat conversation
   * Now includes fresh RAG context for each message!
   * 
   * @param conversationId - The conversation to continue
   * @param userId - The user's ID
   * @param content - The new message content
   * @param modelId - Optional model override
   * @param signal - AbortSignal for cancellation
   */
  static async sendMessage(
    conversationId: string,
    userId: string,
    content: string,
    modelId?: string,
    signal?: AbortSignal
  ) {
    // Validate conversationId is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(conversationId)) {
      throw new Error(`Invalid conversation ID format: ${conversationId}. Please wait for conversation to be created.`);
    }

    const conversation = await BrainChatConversation.findOne({ _id: new Types.ObjectId(conversationId), userId: new Types.ObjectId(userId) });
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Use provided modelId, or conversation's saved modelId, or default
    const effectiveModelId = modelId || conversation.modelId || 'openrouter/auto';

    // Update conversation's modelId if a new one was provided
    if (modelId && modelId !== conversation.modelId) {
      conversation.modelId = modelId;
    }

    // Add the user message to conversation (will be saved by controller)
    conversation.messages.push({
      id: uuidv4() as string,
      role: 'user' as const,
      content: content,
      timestamp: new Date(),
      status: 'sent' as const
    } as BrainChatMessage);

    // Build fresh RAG context for THIS message
    // This is important - each question might need different relevant chunks!
    let systemPrompt = DEEPEN_PERSONALITY;
    let sources: MessageSource[] = [];  // Track sources for this response
    
    const userApiKey = await UserService.getGeminiApiKey(userId);
    
    if (userApiKey && conversation.context) {
      logger.info(`[SendMessage] Building fresh RAG context for message: "${content.slice(0, 30)}..."`);
      
      const ragResult = await this.buildConversationContext(
        conversation.context as BrainChatContext,
        content,  // Use the NEW message as the query (not old messages)
        userId,
        userApiKey
      );

      if (ragResult) {
        systemPrompt = ragResult.systemPrompt;
        sources = ragResult.sources;
        logger.info(`[SendMessage] ✅ Fresh RAG context built with ${sources.length} sources`);
      }
    }

    // Build messages with fresh system prompt
    // Use sliding window to limit conversation history and prevent token overflow
    const recentMessages = conversation.messages.slice(-MAX_CONVERSATION_HISTORY);
    
    if (conversation.messages.length > MAX_CONVERSATION_HISTORY) {
      logger.info(`[SendMessage] Using sliding window: ${recentMessages.length}/${conversation.messages.length} messages`);
    }
    
    const messages: Message[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      // Include recent conversation history for context continuity
      ...recentMessages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const stream = await sendMessage(
      effectiveModelId,
      messages,
      signal
    );

    // Return sources so controller can attach them to the assistant message
    return { conversation, stream, sources };
  }

  /**
   * List user's brain chat conversations
   * @param userId 
   * @returns List of brain chat conversations
   */
  static async conversationsList(userId: string): Promise<IBrainChatConversation[]> {
    return BrainChatConversation.find({ userId: new Types.ObjectId(userId) }).select('title createdAt lastActivity messages').sort({ lastActivity: -1 }).lean();
  }

  /**
   * Get a brain chat conversation by id and user id
   * @param conversationId 
   * @param userId 
   */
  static async getConversation(conversationId: string, userId: string): Promise<IBrainChatConversation | null> {
    return BrainChatConversation.findOne({ _id: new Types.ObjectId(conversationId), userId: new Types.ObjectId(userId) }).select('title createdAt lastActivity messages').lean();
  }

  /**
   * Delete a brain chat conversation by id and user id
   * @param conversationId 
   * @param userId 
   */
  static async deleteConversation(conversationId: string, userId: string): Promise<void> {
    await BrainChatConversation.deleteOne({ _id: new Types.ObjectId(conversationId), userId: new Types.ObjectId(userId) });
  }


  /**
   * Generate a title for the chat session based on the first message
   * Uses a fast/cheap model since this is just for title generation
   */
  static async generateConversationTitle(messages: BrainChatMessage[]): Promise<string> {
    const MAX_TITLE_LENGTH = 200;
    
    try {
      const res = await openRouter.chat.send({
        model: "openrouter/auto", // Use auto for fast title generation
        messages: [
          {
            role: "system",
            content: "Generate a short, concise title (max 10 words) for this conversation. Return ONLY the title text, nothing else.",
          },
          ...messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        ],
        stream: false, // Non-streaming for title generation
      });

      const content = res.choices[0]?.message?.content;
      
      if (typeof content === 'string' && content.trim()) {
        // Truncate to ensure it fits within the schema limit
        const trimmed = content.trim();
        if (trimmed.length <= MAX_TITLE_LENGTH) {
          return trimmed;
        }
        // Truncate at word boundary if possible
        const truncated = trimmed.slice(0, MAX_TITLE_LENGTH - 3);
        const lastSpace = truncated.lastIndexOf(' ');
        return (lastSpace > 50 ? truncated.slice(0, lastSpace) : truncated) + '...';
      }
      
      return "New Conversation";
    } catch (error) {
      logger.error('Failed to generate conversation title', { error });
      return "New Conversation";
    }
  }

  /**
   * Get chat session history
   */
  static async getChatSession(sessionId: string, userId: string) {
    return BrainChatConversation.findOne({
      _id: new Types.ObjectId(sessionId),
      userId: new Types.ObjectId(userId)
    });
  }

  /**
   * List user's brain chat sessions
   */
  static async listUserSessions(userId: string, limit = 20) {
    return BrainChatConversation.find({
      userId: new Types.ObjectId(userId)
    })
      .select('title contextType createdAt lastActivity messages')
      .sort({ lastActivity: -1 })
      .limit(limit)
      .lean();
  }
}
