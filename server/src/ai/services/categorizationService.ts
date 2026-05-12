import { openRouter } from "../../common/config/openRouter";
import Collection from "../../common/models/Collection";
import { Capture } from "../../common/models/Capture";
import { buildCategorizationPrompt } from "../prompts/categorizationPrompts";
import { logger } from "../../common/utils/logger";

const DEFAULT_MODEL = "openrouter/auto";
const MAX_COLLECTIONS_IN_PROMPT = 30;
const MAX_COLLECTION_NAME_LENGTH = 50;

interface CategorizationResult {
  collectionId: string;
  collectionName: string;
  isNew: boolean;
}

export async function assignCaptureToCollection(
  captureId: string,
  userId: string,
  title: string,
  tags: string[],
  summary: string,
): Promise<CategorizationResult | null> {
  // Skip if capture already has a collection (retry safety)
  const capture = await Capture.findById(captureId).select("collection").lean();
  if (capture?.collection) {
    logger.info("Capture already has a collection, skipping auto-categorization", { captureId });
    return null;
  }

  // Fetch user's existing collections (most recent first, capped)
  const existingCollections = await Collection.find({ user: userId })
    .select("name _id")
    .sort({ updatedAt: -1 })
    .limit(MAX_COLLECTIONS_IN_PROMPT)
    .lean();

  const collectionNames = existingCollections.map((c: { _id: any; name: string }) => c.name);

  // Build prompt and call LLM
  const prompt = buildCategorizationPrompt(
    title,
    tags,
    summary.slice(0, 300),
    collectionNames,
  );

  const response = await openRouter.chat.send({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: "You are a categorization assistant. Reply with only valid JSON.",
      },
      { role: "user", content: prompt },
    ],
  });

  const responseText = response.choices[0]?.message?.content;
  if (!responseText || typeof responseText !== "string") {
    logger.warn("Empty response from categorization LLM", { captureId });
    return null;
  }

  // Parse collection name from response
  const collectionName = parseCollectionName(responseText);
  if (!collectionName) {
    logger.warn("Could not parse collection name from LLM response", {
      captureId,
      responseText,
    });
    return null;
  }

  // Match existing collection (case-insensitive) or create new
  const matched = existingCollections.find(
    (c: { _id: any; name: string }) => c.name.toLowerCase() === collectionName.toLowerCase(),
  );

  let collectionId: string;
  let isNew: boolean;

  if (matched) {
    collectionId = matched._id.toString();
    isNew = false;
  } else {
    // Upsert to avoid race conditions when multiple captures process simultaneously
    const created = await Collection.findOneAndUpdate(
      { user: userId, name: collectionName },
      { $setOnInsert: { user: userId, name: collectionName } },
      { upsert: true, new: true },
    );
    collectionId = created._id.toString();
    isNew = true;
  }

  // Assign capture to collection
  await Promise.all([
    Collection.findByIdAndUpdate(collectionId, {
      $addToSet: { captures: captureId },
    }),
    Capture.findByIdAndUpdate(captureId, {
      collection: collectionId,
    }),
  ]);

  return { collectionId, collectionName: matched?.name || collectionName, isNew };
}

function parseCollectionName(responseText: string): string | null {
  // Try JSON parse first
  try {
    const parsed = JSON.parse(responseText.trim());
    if (typeof parsed.collection === "string" && parsed.collection.trim()) {
      return parsed.collection.trim().slice(0, MAX_COLLECTION_NAME_LENGTH);
    }
  } catch {
    // Fall through to regex
  }

  // Regex fallback: extract from partial JSON or messy response
  const match = responseText.match(/"collection"\s*:\s*"([^"]+)"/);
  if (match?.[1]?.trim()) {
    return match[1].trim().slice(0, MAX_COLLECTION_NAME_LENGTH);
  }

  return null;
}
