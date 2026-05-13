/**
 * Vite environment variable typings for TypeScript.
 *
 * Only variables prefixed with `VITE_` are exposed to the client and should be declared here.
 *
 * NOTE:
 * - Do NOT store secrets (API keys, private tokens, etc.) in client-side env variables.
 * - These values are injected at build time. If you change .env files, restart the dev server.
 */

interface ImportMetaEnv {
  /**
   * Base URL for the backend API.
   * Example: "https://deepen-api.onrender.com/" or "http://localhost:4000/"
   */
  readonly VITE_API_BASE_URL: string;

  /**
   * Optional explicit auth base URL (if different from `${VITE_API_BASE_URL}/api/auth`).
   * Example: "https://deepen-api.onrender.com/api/auth"
   */
  readonly VITE_AUTH_BASE_URL?: string;

  /**
   * Request timeout in milliseconds (string because env vars are strings).
   * Example: "10000"
   */
  readonly VITE_API_TIMEOUT?: string;

  /**
   * Any other VITE_ prefixed variables used by your app can be added here for type safety.
   * Example: readonly VITE_SENTRY_DSN?: string;
   */
  readonly VITE_OTHER?: string;

  /**
   * The current mode (development/production) — provided by Vite.
   */
  readonly MODE?: string;
  readonly DEV?: boolean;
  readonly PROD?: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
