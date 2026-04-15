import dotenv from 'dotenv';

dotenv.config();

// Configuration for AI services
// Note: Main AI calls now go through OpenRouter (see common/config/openRouter.ts)
// This config is kept for embedding-related settings

export const AI_CONFIG = {
  // Embedding model (still uses Gemini for embeddings)
  embeddingModel: 'gemini-embedding-001',
  
  // General settings
  temperature: 0.3,
  maxTokens: 1000,
  maxRetries: 3,
  
  // GCP settings (for embeddings)
  project: process.env.GCP_PROJECT,
  location: process.env.GCP_LOCATION,
  credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
};

// Default model for OpenRouter
export const DEFAULT_OPENROUTER_MODEL = 'openrouter/auto';
