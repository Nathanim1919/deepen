import { QdrantClient } from "@qdrant/js-client-rest";
import { logger } from "../../common/utils/logger";

const QDRANT_CLOUD_URL = process.env.QDRANT_CLOUD_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const VECTOR_SIZE = 768; // text-embedding-004 output dimensions
const COLLECTION_NAME = "documents";

// Log Qdrant configuration (mask API key)
logger.info(`[Qdrant] Initializing client...`);
logger.info(`[Qdrant] URL: ${QDRANT_CLOUD_URL || "NOT SET"}`);
logger.info(`[Qdrant] API Key: ${QDRANT_API_KEY ? "***" + QDRANT_API_KEY.slice(-4) : "NOT SET"}`);

if (!QDRANT_CLOUD_URL || !QDRANT_API_KEY) {
  logger.error(`[Qdrant] ❌ Missing configuration! QDRANT_CLOUD_URL or QDRANT_API_KEY not set`);
}

const qdrant = new QdrantClient({
  url: QDRANT_CLOUD_URL,
  apiKey: QDRANT_API_KEY,
});

/**
 * Ensure payload indices exist for filtering
 * These are required for Qdrant to efficiently filter on payload fields
 */
async function ensurePayloadIndices(client: QdrantClient, collectionName: string) {
  const indices = [
    { field_name: "user_id", field_schema: "keyword" as const },
    { field_name: "doc_id", field_schema: "keyword" as const },
  ];

  for (const index of indices) {
    try {
      await client.createPayloadIndex(collectionName, index);
      logger.info(`[Qdrant] ✅ Created index on '${index.field_name}'`);
    } catch (error: any) {
      // Index already exists - that's OK, silently continue
      if (error.status === 400 && error.data?.status?.error?.includes("already exists")) {
        logger.debug(`[Qdrant] Index on '${index.field_name}' already exists`);
      } else {
        // Log but don't fail - index might already exist with different error format
        logger.debug(`[Qdrant] Index on '${index.field_name}': ${error.message || "may already exist"}`);
      }
    }
  }
}

/**
 * Ensure the documents collection exists with proper configuration
 */
async function ensureCollectionAndIndices() {
  try {
    // Check if collection exists
    try {
      await qdrant.getCollection(COLLECTION_NAME);
      logger.info(`[Qdrant] Collection '${COLLECTION_NAME}' exists`);
    } catch (error: any) {
      if (error.status === 404) {
        // Create the collection
        logger.info(`[Qdrant] Creating collection '${COLLECTION_NAME}'...`);
        await qdrant.createCollection(COLLECTION_NAME, {
          vectors: {
            size: VECTOR_SIZE,
            distance: "Cosine",
          },
        });
        logger.info(`[Qdrant] ✅ Created collection '${COLLECTION_NAME}'`);
      } else {
        throw error;
      }
    }

    // Ensure indices exist (idempotent)
    await ensurePayloadIndices(qdrant, COLLECTION_NAME);
    
  } catch (error) {
    logger.error(`[Qdrant] ❌ Failed to setup collection:`, error instanceof Error ? error.message : error);
  }
}

// Test connection and setup on startup
(async () => {
  try {
    const collections = await qdrant.getCollections();
    logger.info(`[Qdrant] ✅ Connected successfully. Collections: ${collections.collections.map(c => c.name).join(", ") || "none"}`);
    
    // Ensure collection and indices exist
    await ensureCollectionAndIndices();
  } catch (error) {
    logger.error(`[Qdrant] ❌ Connection failed:`, error instanceof Error ? error.message : error);
  }
})();

export { qdrant };
