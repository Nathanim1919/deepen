import { task } from "@trigger.dev/sdk/v3";
import { processContent } from "../ai/services/aiService";
import { assignCaptureToCollection } from "../ai/services/categorizationService";
import { Capture } from "../common/models/Capture";
import { connectMongo } from "../common/config/database";

export const aiProcessing = task({
  id: "ai-processing",
  retry: {
    maxAttempts: 3,
    factor: 1.8,
    minTimeoutInMs: 5000,
    maxTimeoutInMs: 30000,
    randomize: true,
  },
  run: async (payload: { captureId: string; userId: string }) => {
    await connectMongo();
    const { captureId, userId } = payload;
    const traceId = `[AI Processing] [${captureId}]`;
    console.log(`${traceId} Starting AI processing...`);

    try {
      const capture = await Capture.findById(captureId);
      if (!capture) {
        console.error(`${traceId} ❌ Capture not found`);
        return;
      }

      const text = capture.content?.clean?.trim();
      if (!text || text.length < 50) {
        console.error(`${traceId} ❌ Text too short for AI processing`);
        return;
      }

      const result = await processContent(text, userId);
      const summary = result?.data?.summary?.trim();
      const tags = result?.data?.tags || [];
      if (!summary || summary.length < 30) {
        console.error(`${traceId} ❌ AI summary too short or empty`);
        return;
      }

      capture.ai = { summary, tags };
      await capture.save();

      console.log(
        `${traceId} ✅ AI processing complete: ${summary.length} chars, ${tags.length} tags`,
      );

      // Auto-assign to collection (non-blocking)
      try {
        const assignment = await assignCaptureToCollection(
          captureId,
          userId,
          capture.title || "",
          tags,
          summary,
        );
        if (assignment) {
          console.log(
            `${traceId} ✅ Auto-assigned to collection "${assignment.collectionName}" (new: ${assignment.isNew})`,
          );
        } else {
          console.log(`${traceId} ⚠️ Could not auto-assign to collection`);
        }
      } catch (categorizationError) {
        const errMsg =
          categorizationError instanceof Error
            ? categorizationError.message
            : String(categorizationError);
        console.error(
          `${traceId} ⚠️ Collection auto-assignment failed (non-blocking): ${errMsg}`,
        );
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`${traceId} ❌ Error processing AI: ${errorMsg}`);
      return;
    }
  },
});
