import { AIResponse } from "../types";
import { Request } from "express";
// import { validate as uuidValidate } from 'uuid';
import { rateLimit } from "express-rate-limit";
import { User } from "better-auth/types";
import { searchSimilar } from "./vectorStore";
import { logger } from "../../common/utils/logger";
import { openRouter, sendMessage } from "../../common/config/openRouter";
import { Prompt } from "../prompts/summaryPrompts";
import { Message } from "@openrouter/sdk/esm/models";

// Type definitions
export interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

// Constants and configuration
const DEFAULT_MODEL = "openrouter/auto";
const MAX_CONVERSATION_LENGTH = 30; // Max messages in conversation
const MAX_INPUT_LENGTH = 10000; // Characters
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100;

export interface ConversationRequest {
  captureId: string;
  messages: ConversationMessage[];
  model?: string;
}

// AI configuration (for future use)
// const AI_CONFIG = {
//   MAX_RETRIES: 2,
//   REQUEST_TIMEOUT: 30000,
// };

// Main function to process content
export const processContent = async (
  content: string,
  _userId: string, // Reserved for future use (user-specific models, tracking, etc.)
  existingSummary?: string,
  modelId: string = DEFAULT_MODEL,
): Promise<AIResponse> => {
  try {
    if (!content || content.trim().length < 100) {
      return {
        success: false,
        error: "Content must be at least 100 characters long.",
      };
    }

    const cleanText = removeBoilerplate(content);

    const summaryResult = await generateSummary(
      cleanText,
      existingSummary,
      modelId,
    );

    // Parse tags from the JSON block at the end of the summary
    let tags: string[] = [];
    let cleanSummary = summaryResult;

    const jsonMatch = summaryResult.match(
      /```json\s*\n?\s*(\{[\s\S]*?"tags"\s*:[\s\S]*?\})\s*\n?\s*```\s*$/
    );
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (Array.isArray(parsed.tags)) {
          tags = parsed.tags
            .filter((t: unknown) => typeof t === "string")
            .map((t: string) => t.toLowerCase().trim())
            .filter((t: string) => t.length > 0)
            .slice(0, 10);
        }
      } catch {
        logger.warn("Failed to parse tags from AI response");
      }
      cleanSummary = summaryResult
        .replace(/```json\s*\n?\s*\{[\s\S]*?"tags"\s*:[\s\S]*?\}\s*\n?\s*```\s*$/, "")
        .trim();
    }

    return {
      success: true,
      data: {
        summary: cleanSummary,
        tags,
      },
    };
  } catch (error) {
    return handleAIError(error);
  }
};

// Generate summary using OpenRouter
export const generateSummary = async (
  text: string,
  existingSummary: string = "",
  modelId: string = DEFAULT_MODEL,
): Promise<string> => {
  try {
    logger.info("Generating summary with OpenRouter", { 
      modelId, 
      textLength: text.length,
      hasApiKey: !!process.env.OPENROUTER_API_KEY 
    });

    const prompt = Prompt.generateSummary(text, existingSummary);

    const response = await openRouter.chat.send({
      model: modelId,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates concise, informative summaries.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const summaryText = response.choices[0]?.message?.content;
    if (!summaryText || typeof summaryText !== 'string') {
      logger.warn("No summary text found in OpenRouter response", { response });
      return "";
    }
    return summaryText;
  } catch (error: any) {
    logger.error("Failed to generate summary via OpenRouter", { 
      error: error?.message || error,
      status: error?.status,
      modelId,
    });
    throw error;
  }
};

// Utility to clean content (HTML → plain text)
const removeBoilerplate = (html: string): string => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// General error handler
const handleAIError = (error: any): AIResponse => {
  logger.error("AI Processing Error:", { error });

  if (error.name === "AbortError") {
    return {
      success: false,
      error: "Request timed out",
    };
  }

  if (error.message && error.message.includes("429")) {
    return {
      success: false,
      error: "API rate limit exceeded",
      retryAfter: 60000,
    };
  }

  return {
    success: false,
    error: `AI processing failed: ${error.message || "Unknown error"}.`,
  };
};

// Rate limiter middleware
export const conversationRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});

export const validateRequest = (
  req: Request,
): { isValid: boolean; error?: string } => {
  if (!req.body) return { isValid: false, error: "Request body is missing" };

  const { captureId, messages } = req.body as ConversationRequest;
  // || !uuidValidate(captureId
  if (!captureId) {
    return { isValid: false, error: "Invalid or missing captureId" };
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return { isValid: false, error: "Messages must be a non-empty array" };
  }

  if (messages.length > MAX_CONVERSATION_LENGTH) {
    return {
      isValid: false,
      error: `Conversation too long. Max ${MAX_CONVERSATION_LENGTH} messages allowed.`,
    };
  }

  for (const msg of messages) {
    if (!msg.role || !["user", "assistant", "system"].includes(msg.role)) {
      return { isValid: false, error: "Invalid message role" };
    }
    // Allow empty strings but validate type and length
    if (
      typeof msg.content !== "string" ||
      msg.content.length > MAX_INPUT_LENGTH
    ) {
      return { isValid: false, error: "Invalid message content" };
    }
  }

  return { isValid: true };
};

export const buildConversationPrompt = (
  userName: string,
  documentSummary: string,
  messages: ConversationMessage[],
  retrievedContext: string,
): string => {
  return Prompt.conversationPrompt(
    userName,
    documentSummary,
    messages,
    retrievedContext,
  );
};

/**
 * Processes a conversation by performing retrieval-augmented generation (RAG)
 * and streaming the response via OpenRouter.
 *
 * @returns An AsyncIterable that yields streaming chunks from OpenRouter
 */
export async function processConversationStream(
  user: User,
  userApiKey: string, // Used for embeddings/retrieval only
  documentSummary: string,
  documentId: string,
  messages: ConversationMessage[],
  modelId: string = DEFAULT_MODEL,
  signal?: AbortSignal,
) {
  try {
    // 1. Perform retrieval based on the user's current question
    const lastUserMessage =
      messages.filter((m) => m.role === "user").slice(-1)[0]?.content || "";
    const cleanUserMessage = lastUserMessage.trim().slice(0, 1000);

    let retrievedContext = "";
    
    try {
      const similarChunks = await searchSimilar({
        query: cleanUserMessage,
        userId: user.id,
        documentId: documentId,
        userApiKey: userApiKey,
      });

      if (similarChunks.length > 0) {
        retrievedContext = similarChunks
          .map((chunk: any) => chunk.payload?.text)
          .filter(Boolean)
          .join("\n---\n");
      } else {
        retrievedContext =
          "No specific relevant information found in this document for your query.";
      }
    } catch (embeddingError) {
      logger.warn("Embedding retrieval failed, proceeding without context", {
        userId: user.id,
        documentId,
        error: embeddingError instanceof Error ? embeddingError.message : String(embeddingError),
      });
      retrievedContext = "Unable to retrieve document context. Answering based on general knowledge.";
    }

    logger.info("INFORMATION RETRIEVED FOR STREAM", {
      userId: user.id,
      documentId: documentId,
    });

    // 2. Build the system prompt with context
    const systemPrompt = buildConversationPrompt(
      user.name,
      documentSummary,
      messages,
      retrievedContext,
    );

    // 3. Build messages array for OpenRouter (filter out empty messages)
    const openRouterMessages: Message[] = [
      { role: "system", content: systemPrompt },
      ...messages
        .filter((m) => m.content && m.content.trim()) // Skip empty messages
        .map((m) => ({ role: m.role, content: m.content })),
    ];

    // 4. Call OpenRouter with streaming
    const stream = await sendMessage(modelId, openRouterMessages, signal);

    return stream;
  } catch (error) {
    logger.error("Conversation stream processing failed", {
      userId: user.id,
      documentId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
