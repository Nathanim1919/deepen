import { logger } from "../../common/utils/logger";
import { BrainChatConversation, IBrainChatConversation } from "../../common/models/BrainChat";
import { Types } from "mongoose";
import { openRouter, sendMessage } from "../../common/config/openRouter";
import { v4 as uuidv4 } from "uuid";
import { Message } from "@openrouter/sdk/esm/models";

export interface BrainChatContext {
  brain: {
    enabled: boolean;
  };
  bookmarks: {
    enabled: boolean;
  };
  captures: {
    ids: string[];
  };
  collections: {
    ids: string[];
  };
}

export interface BrainChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  status: "sent" | "received";
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
   * Create a new brain chat session with streaming
   * @param userIdsendMessage
   * @param request
   * @param signal
   * @returns Object with conversation and stream
   */
  static async startConversationStreaming(userId: string, request: BrainChatStartRequest, signal?: AbortSignal) {
    try {
      if (request.messages.length === 0) {
        throw new Error('Messages are required to start a conversation');
      }

      // Use provided modelId or default to openrouter/auto
      const modelId = request.modelId || 'openrouter/auto';

      const conversation = new BrainChatConversation({
        userId: new Types.ObjectId(userId),
        title: "",
        createdAt: request.createdAt,
        context: request.context,
        modelId, // Save the model used for this conversation
        messages: request.messages
      });

      const messages: Message[] = [
        {
          role: "system",
          content: "You are a helpful assistant that can help with questions about the user's brain chat conversation.",
        },
        ...request.messages,
      ];

      const stream = await sendMessage(
        modelId, // Use dynamic model
        messages,
        signal
      );

      return { conversation, stream };
    } catch (error) {
      logger.error('Failed to start conversation streaming', { error, userId });
      throw error;
    }
  }

  /**
   * Create a new brain chat session
   * @param userId
   * @param request
   * @returns The created brain chat conversation
   */
  static async startConversation(userId: string, request: BrainChatStartRequest) {
    try {
     
      if (request.messages.length === 0) {
        throw new Error('Messages are required to start a conversation');
      }

      // Use provided modelId or default to openrouter/auto
      const modelId = request.modelId || 'openrouter/auto';

      const conversation = new BrainChatConversation({
        userId: new Types.ObjectId(userId),
        title: "new conversation",
        createdAt: request.createdAt,
        context: request.context,
        modelId, // Save the model used
        messages: request.messages
      });

      const askModel = await openRouter.chat.send({
        model: modelId, // Use dynamic model
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that can help with questions about the user's brain chat conversation.",
          },
          ...request.messages,
        ],
      });


      // Add the AI response to the conversation messages
      const aiResponse = askModel.choices[0]?.message?.content;
      if (aiResponse && typeof aiResponse === 'string') {
        conversation.messages.push({
          id: uuidv4() as string,
          role: 'assistant' as const,
          content: aiResponse,
          timestamp: new Date(),
          status: 'received' as const
        } as BrainChatMessage);
      }

      await conversation.save();
      return conversation;
    } catch (error) {
      logger.error('Failed to start conversation', { error, userId });
      throw error;
    }
  }

  /**
   * Send a message to a brain chat conversation
   * @param conversationId
   * @param userId
   * @param content
   * @param modelId - Optional model override (uses conversation's modelId if not provided)
   * @param signal
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

    const messages: Message[] = [
      {
        role: "system",
        content: "You are a helpful assistant that can help with questions about the user's brain chat conversation.",
      },
      ...conversation.messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const stream = await sendMessage(
      effectiveModelId, // Use dynamic model
      messages,
      signal
    );

    // 🚨 DO NOT consume the stream here
    return { conversation, stream };
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
    const res = await openRouter.chat.send({
      model: "openrouter/auto", // Use auto for fast title generation
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that can generate a title for a brain chat conversation based on the conversation history. The title should be a single sentence that captures the essence of the conversation. The title should be no more than 10 words.",
        },
        ...messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      ],
      stream: false, // Non-streaming for title generation
    });

    const content = res.choices[0]?.message?.content;
    return typeof content === 'string' ? content : "New Conversation";
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
