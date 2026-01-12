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
        
        logger.info(`${traceId} ✅ Qdrant upsert completed:`, {
          status: result.status,
          operation_id: result.operation_id,
        });
        
      } catch (error) {
        const err = error as Error & { status?: number; response?: { data: unknown }; cause?: unknown };
        logger.error(`${traceId} ❌ Upsert failed:`, {
          message: err.message,
          status: err.status,
          points: points.length,
        });
        throw error;
      }
    },
    3,
    2000,
  );

  // Verification (non-blocking - don't fail if this errors)
  try {
    // Use scroll instead of count for better compatibility
    const scrollResult = await qdrant.scroll("documents", {
      filter: {
        must: [
          { key: "doc_id", match: { value: docId } },
        ],
      },
      limit: 1,
      with_payload: false,
      with_vector: false,
    });

    const foundPoints = scrollResult.points?.length ?? 0;
    if (foundPoints > 0) {
      logger.info(`${traceId} ✅ VERIFICATION: Points found in Qdrant for this document`);
    } else {
      logger.warn(`${traceId} ⚠️ VERIFICATION: Could not confirm points in Qdrant (may take time to index)`);
    }
  } catch (verifyError) {
    // Don't fail the whole operation if verification fails
    logger.debug(`${traceId} ℹ️ Verification skipped (non-critical):`, (verifyError as Error).message);
  }
  
  logger.info(`${traceId} ✅ indexText completed successfully - ${points.length} points saved`);
}

async function ensureCollection(client: QdrantClient, collectionName: string) {
  try {
    await client.getCollection(collectionName);
    logger.debug(`Collection ${collectionName} exists`);
    
    // Ensure payload indices exist (idempotent - safe to call if they already exist)
    await ensurePayloadIndices(client, collectionName);
  } catch (error: any) {
    if (error.status === 404) {
      logger.info(`Creating collection ${collectionName}`);
      await client.createCollection(collectionName, {
        vectors: {
          size: VECTOR_SIZE,
          distance: "Cosine",
        },
      });
      logger.info(`Created collection ${collectionName}`);
      
      // Create payload indices for filtering
      await ensurePayloadIndices(client, collectionName);
    } else {
      logger.error(`Failed to verify collection ${collectionName}:`, error);
      throw error;
    }
  }
}

/**
 * Create payload indices for efficient filtering
 * These are required for Qdrant to filter on payload fields
 */
async function ensurePayloadIndices(client: QdrantClient, collectionName: string) {
  try {
    // Create index on user_id (required for filtering by user)
    await client.createPayloadIndex(collectionName, {
      field_name: "user_id",
      field_schema: "keyword",
    });
    logger.info(`Created payload index on 'user_id' for ${collectionName}`);
  } catch (error: any) {
    // Index might already exist - that's OK
    if (!error.message?.includes('already exists')) {
      logger.debug(`user_id index may already exist: ${error.message}`);
    }
  }

  try {
    // Create index on doc_id (required for filtering by document)
    await client.createPayloadIndex(collectionName, {
      field_name: "doc_id",
      field_schema: "keyword",
    });
    logger.info(`Created payload index on 'doc_id' for ${collectionName}`);
  } catch (error: any) {
    // Index might already exist - that's OK
    if (!error.message?.includes('already exists')) {
      logger.debug(`doc_id index may already exist: ${error.message}`);
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

/**
 * RAG Search Result - what we get back from vector search
 */
export interface RAGSearchResult {
  text: string;        // The chunk text content
  docId: string;       // Which document this chunk came from
  score: number;       // Similarity score (0-1, higher is more similar)
  chunkIndex: number;  // Position of chunk in original document
}

/**
 * Search options for flexible RAG retrieval
 */
export interface RAGSearchOptions {
  query: string;           // The user's question
  userId: string;          // User ID (always required for security)
  userApiKey: string;      // Gemini API key for embedding
  limit?: number;          // Max chunks to return (default: 5)
  documentIds?: string[];  // Optional: limit search to these specific documents
}

/**
 * Flexible RAG search that can search across different scopes
 * 
 * Usage:
 * - Brain mode: pass only userId (searches ALL user's content)
 * - Captures mode: pass documentIds array (searches within those docs)
 * - Collections mode: caller fetches capture IDs first, then passes as documentIds
 * 
 * @param options Search configuration
 * @returns Array of matching chunks with their text and metadata
 */
export async function ragSearch(options: RAGSearchOptions): Promise<RAGSearchResult[]> {
  const { query, userId, userApiKey, limit = 5, documentIds } = options;
  const traceId = `[RAG Search]`;

  logger.info(`${traceId} Starting search for user ${userId.slice(0, 8)}...`);
  logger.info(`${traceId} Query: "${query.slice(0, 50)}..."`);
  logger.info(`${traceId} Scope: ${documentIds ? `${documentIds.length} specific documents` : 'ALL user content'}`);

  // Step 1: Generate embedding for the user's query
  // We use RETRIEVAL_QUERY task type (different from RETRIEVAL_DOCUMENT used for indexing)
  const queryVector = await generateGeminiEmbeddingsWithFetch(
    query,
    userApiKey,
    "RETRIEVAL_QUERY" as TaskType.RETRIEVAL_QUERY,
    3,    // retries
    2000, // delay between retries
  );

  if (!queryVector) {
    logger.error(`${traceId} ❌ Failed to generate query embedding`);
    throw new Error("Failed to generate embedding for the query");
  }

  logger.info(`${traceId} ✅ Query embedding generated (${queryVector.length} dimensions)`);

  // Step 2: Build the Qdrant filter
  // Always filter by user_id for security (users can only search their own content)
  const mustFilters: Array<{ key: string; match: { value: string } } | { key: string; match: { any: string[] } }> = [
    { key: "user_id", match: { value: userId } },
  ];

  // If specific document IDs are provided, add them to the filter
  // This uses Qdrant's "any" matcher - matches if doc_id is in the array
  if (documentIds && documentIds.length > 0) {
    mustFilters.push({
      key: "doc_id",
      match: { any: documentIds },
    });
  }

  // Step 3: Search Qdrant
  logger.info(`${traceId} 🔍 Searching Qdrant with limit=${limit}`);
  
  const searchResults = await qdrant.search("documents", {
    vector: queryVector,
    limit: limit,
    filter: {
      must: mustFilters,
    },
    with_payload: true, // We need the payload to get the text
  });

  logger.info(`${traceId} ✅ Found ${searchResults.length} matching chunks`);

  // Step 4: Transform results into our clean format
  const results: RAGSearchResult[] = searchResults.map((result) => {
    const payload = result.payload as { text: string; doc_id: string; chunk_index: number };
    return {
      text: payload.text,
      docId: payload.doc_id,
      score: result.score,
      chunkIndex: payload.chunk_index,
    };
  });

  return results;
}
