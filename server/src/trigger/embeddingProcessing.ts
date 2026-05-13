import { task } from "@trigger.dev/sdk/v3";
import { deleteTextEmbedding, indexText } from "../ai/services/vectorStore";
import { UserService } from "../api/services/user.service";
import { Capture } from "../common/models/Capture";
import { connectMongo } from "../common/config/database";

export enum EmbeddingTaskType {
  INDEX = "INDEX",
  DELETE = "DELETE",
}

export const embeddingProcessing = task({
  id: "embedding-processing",
  retry: {
    maxAttempts: 3,
    factor: 1.8,
    minTimeoutInMs: 5000,
    maxTimeoutInMs: 30000,
    randomize: true,
  },
  run: async (payload: {
    captureId: string;
    userId: string;
    taskType: EmbeddingTaskType;
  }) => {
    await connectMongo();
    const { captureId, userId, taskType } = payload;
    const traceId = `[Embedding Task] [${captureId.slice(0, 8)}...]`;
    
    console.log(`\n${"=".repeat(60)}`);
    console.log(`${traceId} 🚀 EMBEDDING PROCESSING STARTED`);
    console.log(`${"=".repeat(60)}`);
    console.log(`${traceId} 📋 Payload:`, JSON.stringify({ captureId, userId: userId.slice(0, 8) + "...", taskType }, null, 2));

    // Check for API key
    const apiKey = await UserService.getGeminiApiKey(userId);
    if (!apiKey) {
      console.error(`${traceId} ❌ Gemini API key not found for user ${userId.slice(0, 8)}...`);
      console.error(`${traceId} 💡 User needs to add their Gemini API key in profile settings`);
      return { success: false, error: "API_KEY_NOT_FOUND" };
    }
    console.log(`${traceId} ✅ Gemini API key found: ***${apiKey.slice(-4)}`);

    try {
      // Fetch capture
      console.log(`${traceId} 🔍 Fetching capture from database...`);
      const capture = await Capture.findById(captureId);
      
      if (!capture) {
        console.error(`${traceId} ❌ Capture not found in database!`);
        return { success: false, error: "CAPTURE_NOT_FOUND" };
      }
      
      console.log(`${traceId} ✅ Capture found:`, {
        title: capture.title?.slice(0, 50) || "Untitled",
        url: capture.url?.slice(0, 50) || "N/A",
        contentLength: capture.content?.clean?.length || 0,
        processingStatus: capture.processingStatus,
      });

      switch (taskType) {
        case EmbeddingTaskType.INDEX:
          console.log(`${traceId} 📥 [INDEX] Starting embedding process...`);
          
          const text = capture.content?.clean?.trim();
          
          if (!text) {
            console.error(`${traceId} ❌ No text content found in capture`);
            return { success: false, error: "NO_TEXT_CONTENT" };
          }
          
          if (text.length < 50) {
            console.error(`${traceId} ❌ Text too short for embedding (${text.length} chars, minimum 50)`);
            return { success: false, error: "TEXT_TOO_SHORT" };
          }
          
          console.log(`${traceId} 📄 Text to embed: ${text.length} characters`);
          console.log(`${traceId} 📄 Preview: "${text.slice(0, 100)}..."`);

          try {
            await indexText({
              text,
              docId: captureId,
              userId,
              userApiKey: apiKey,
            });
            console.log(`${traceId} ✅ [INDEX] Embedding completed successfully!`);
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.error(`${traceId} ❌ [INDEX] Error:`, errorMsg);
            if (error instanceof Error && error.stack) {
              console.error(`${traceId} Stack:`, error.stack);
            }
            throw error; // Re-throw to trigger retry
          }
          break;

        case EmbeddingTaskType.DELETE:
          console.log(`${traceId} 🗑️ [DELETE] Starting deletion...`);
          try {
            await deleteTextEmbedding({
              docId: captureId,
              userId,
            });
            console.log(`${traceId} ✅ [DELETE] Deletion completed`);
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.error(`${traceId} ❌ [DELETE] Error:`, errorMsg);
            throw error;
          }
          break;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`${traceId} ❌ Error processing embedding:`, errorMsg);
      throw error; // Re-throw to trigger retry
    }
    
    console.log(`${"=".repeat(60)}`);
    console.log(`${traceId} ✅ EMBEDDING PROCESSING COMPLETED`);
    console.log(`${"=".repeat(60)}\n`);
    
    return { success: true, captureId, taskType };
  },
});
