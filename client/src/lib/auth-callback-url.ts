/** Canonical prod frontend (post-login redirect). Listed in server `trustedOrigins`. */
const PROD_AUTH_ORIGIN = "https://deepen.nathanim.dev";

/**
 * Post-auth redirect target. Must use an origin listed in the Better Auth
 * server `trustedOrigins`.
 *
 * Order: `VITE_AUTH_CALLBACK_URL` → `VITE_CLIENT_BASE_URL` → dev: current tab
 * origin → prod: {@link PROD_AUTH_ORIGIN}. Without that, opening the app on
 * e.g. `deepen.live` would send `https://deepen.live/in` as the callback.
 */
export function getPostAuthCallbackUrl(): string {
  const fromEnv =
    (import.meta.env.VITE_AUTH_CALLBACK_URL as string | undefined)?.trim() ||
    (import.meta.env.VITE_CLIENT_BASE_URL as string | undefined)?.trim();
  const fromWindow =
    typeof window !== "undefined" && import.meta.env.DEV
      ? window.location.origin
      : "";
  const base = (
    fromEnv ||
    fromWindow ||
    (import.meta.env.PROD ? PROD_AUTH_ORIGIN : "")
  ).replace(/\/$/, "");
  return base ? `${base}/in` : "/in";
}
