import { QdrantClient } from "@qdrant/js-client-rest";
import { logger } from "../../common/utils/logger";

const QDRANT_CLOUD_URL = process.env.QDRANT_CLOUD_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

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

// Test connection on startup
(async () => {
  try {
    const collections = await qdrant.getCollections();
    logger.info(`[Qdrant] ✅ Connected successfully. Collections: ${collections.collections.map(c => c.name).join(", ") || "none"}`);
  } catch (error) {
    logger.error(`[Qdrant] ❌ Connection failed:`, error instanceof Error ? error.message : error);
  }
})();

export { qdrant };
