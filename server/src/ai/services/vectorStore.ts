import { TaskType } from "@google/generative-ai";
import { qdrant } from "../clients/qdrant";
import { chunkText } from "../../common/utils/chunkText";
import { generateGeminiEmbeddingsWithFetch } from "../../common/utils/embedding";
import { logger } from "../../common/utils/logger";
import { QdrantClient } from "@qdrant/js-client-rest";
import { withRetry } from "../../common/utils/withRetry";
import { v4 as uuidv4 } from "uuid";
const VECTOR_SIZE = 768; // text-embedding-004 output dimensions

/**
 * Indexes the provided text by chunking it and generating embeddings for each chunk.
 * @param text The text content to index.
 * @param docId The unique identifier for the document.
 * @param userId The ID of the user who owns the document.
 * @param userApiKey The API key for the user's Gemini account.
 */

export async function indexText({
  text,
  docId,
  userId,
  userApiKey,
}: {
  text: string;
  docId: string;
  userId: string;
  userApiKey: string;
}) {
  const traceId = `[VectorStore] [${docId}]`;
  
  logger.info(`${traceId} 📥 Starting indexText...`);
  logger.info(`${traceId} Text length: ${text.length} characters`);
  logger.info(`${traceId} User ID: ${userId}`);
  logger.info(`${traceId} API Key: ${userApiKey ? "***" + userApiKey.slice(-4) : "NOT PROVIDED"}`);
  
  const chunks = chunkText(text);
  logger.info(`${traceId} 📦 Text chunked into ${chunks.length} chunks`);

  interface QdrantPointPayload {
    [key: string]: string | number;
    text: string;
    user_id: string;
    doc_id: string;
    chunk_index: number;
    created_at: string;
  }

  interface QdrantPoint {
    id: string;
    vector: number[];
    payload: QdrantPointPayload;
  }

  const points: QdrantPoint[] = [];

  logger.info(`${traceId} 🔄 Generating embeddings for ${chunks.length} chunks...`);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    logger.info(`${traceId} 🧬 Generating embedding for chunk ${i + 1}/${chunks.length} (${chunk.length} chars)`);
    
    const embedding = await generateGeminiEmbeddingsWithFetch(
      chunk,
      userApiKey,
      "RETRIEVAL_DOCUMENT" as TaskType.RETRIEVAL_DOCUMENT,
      3,
      2000,
    );

    if (embedding !== null) {
      // Validate embedding
      if (!Array.isArray(embedding) || embedding.length !== VECTOR_SIZE) {
        logger.error(
          `${traceId} ❌ Invalid embedding for chunk ${i}: Expected ${VECTOR_SIZE} dimensions, got ${embedding.length}`,
        );
        continue;
      }

      const pointId = uuidv4();
      points.push({
        id: pointId,
        vector: embedding,
        payload: {
          text: chunk,
          user_id: userId,
          doc_id: docId,
          chunk_index: i,
          created_at: new Date().toISOString(),
        },
      });

      logger.info(`${traceId} ✅ Chunk ${i + 1} embedded successfully (point ID: ${pointId.slice(0, 8)}...)`);
    } else {
      logger.warn(
        `${traceId} ⚠️ Failed to generate embedding for chunk ${i + 1}`,
      );
    }
  }

  if (points.length === 0) {
    logger.warn(`${traceId} ⚠️ No valid points to upsert - aborting`);
    return;
  }

  logger.info(`${traceId} 📊 Summary: ${points.length}/${chunks.length} chunks successfully embedded`);

  // Ensure collection exists
  logger.info(`${traceId} 🗄️ Ensuring 'documents' collection exists...`);
  await ensureCollection(qdrant, "documents");

  // Upsert with retry
  logger.info(`${traceId} 📤 Upserting ${points.length} points to Qdrant...`);
  
  await withRetry(
    async () => {
      try {
        const result = await qdrant.upsert("documents", { points });
        
        logger.info(`${traceId} ✅ Qdrant upsert response:`, {
          status: result.status,
          operation_id: result.operation_id,
        });

        // Verification: Count points for this document
        const countResult = await qdrant.count("documents", {
          filter: {
            must: [
              { key: "doc_id", match: { value: docId } },
              { key: "user_id", match: { value: userId } },
            ],
          },
          exact: true,
        });

        logger.info(`${traceId} 🔍 VERIFICATION: Found ${countResult.count} points in Qdrant for this document`);
        
        if (countResult.count === 0) {
          logger.error(`${traceId} ❌ VERIFICATION FAILED: No points found after upsert!`);
        } else if (countResult.count < points.length) {
          logger.warn(`${traceId} ⚠️ VERIFICATION WARNING: Expected ${points.length} points, found ${countResult.count}`);
        } else {
          logger.info(`${traceId} ✅ VERIFICATION SUCCESS: All ${points.length} points saved to vector DB`);
        }
        
      } catch (error) {
        const err = error as Error & { status?: number; response?: { data: unknown }; cause?: unknown };
        logger.error(`${traceId} ❌ Upsert failed:`, {
          message: err.message,
          stack: err.stack,
          status: err.status,
          response: err.response
            ? JSON.stringify(err.response.data, null, 2)
            : null,
          cause: err.cause,
          points: points.length,
        });
        throw error;
      }
    },
    3,
    2000,
  );
  
  logger.info(`${traceId} ✅ indexText completed successfully`);
}

async function ensureCollection(client: QdrantClient, collectionName: string) {
  try {
    await client.getCollection(collectionName);
    logger.debug(`Collection ${collectionName} exists`);
  } catch (error) {
    if (error.status === 404) {
      logger.info(`Creating collection ${collectionName}`);
      await client.createCollection(collectionName, {
        vectors: {
          size: VECTOR_SIZE,
          distance: "Cosine",
        },
      });
      logger.info(`Created collection ${collectionName}`);
    } else {
      logger.error(`Failed to verify collection ${collectionName}:`, error);
      throw error;
    }
  }
}

/**
 * Deletes a text embedding from the vector store.
 * @param param0 The parameters for deleting the embedding.
 * @param docId The unique identifier for the document.
 * @param userId The ID of the user who owns the document.
 * @returns A promise that resolves when the deletion is complete.
 */
export async function deleteTextEmbedding({
  docId,
  userId,
}: {
  docId: string;
  userId: string;
}) {
  logger.info(`Deleting embedding for docId=${docId}, userId=${userId}`);

  // Ensure collection exists
  await ensureCollection(qdrant, "documents");

  // Delete points by filter
  const result = await qdrant.delete("documents", {
    filter: {
      must: [
        { key: "user_id", match: { value: userId } },
        { key: "doc_id", match: { value: docId } },
      ],
    },
  });

  logger.info(`Deleted embedding for docId=${docId}, userId=${userId}`, {
    status: result.status,
    operationId: result.operation_id,
  });
}

/**
 * Searches for similar documents based on the provided query.
 * @param query The search query string.
 * @param userId The ID of the user making the request.
 * @param userApiKey The API key for the user's Gemini account.
 * @returns A promise that resolves to the search results.
 */

export async function searchSimilar({
  query,
  userId,
  documentId,
  userApiKey,
}: {
  query: string;
  userId: string;
  documentId: string;
  userApiKey: string;
}) {
  const vector = await generateGeminiEmbeddingsWithFetch(
    query,
    userApiKey,
    "RETRIEVAL_QUERY" as TaskType.RETRIEVAL_QUERY,
    3,
    2000,
  );

  if (!vector) {
    throw new Error("Failed to generate vector for the query");
  }

  return await qdrant.search("documents", {
    vector,
    limit: 5,
    filter: {
      must: [
        { key: "user_id", match: { value: userId } },
        { key: "doc_id", match: { value: documentId } },
      ],
    },
  });
}
