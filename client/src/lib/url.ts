/**
 * Small URL joining helper utilities.
 *
 * These helpers are intentionally small and dependency-free. They:
 * - Normalize and join URL segments without duplicating slashes.
 * - Preserve protocol (e.g. `https://`) and don't remove the `//` after it.
 * - Allow nullable/undefined segments (they are ignored).
 *
 * Usage:
 *   joinUrl(import.meta.env.VITE_API_BASE_URL, '/api/', '/auth')
 *   -> 'https://example.com/api/auth'
 */

type MaybeString = string | null | undefined;

/**
 * Trim whitespace and remove leading/trailing slashes from a segment.
 * Keeps an empty string if the segment is only slashes/whitespace.
 */
function normalizeSegment(segment: string): string {
  return segment.trim().replace(/^\/+|\/+$/g, "");
}

/**
 * Removes trailing slashes from the first segment while preserving protocol (`https://`).
 */
function normalizeFirstSegmentPreservingProtocol(first: string): string {
  // Keep leading protocol (e.g. 'https://', 'http://', 'file://')
  const protoMatch = first.match(/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//);
  if (protoMatch) {
    const proto = protoMatch[0];
    const rest = first.slice(proto.length).replace(/\/+$/g, "");
    return proto + rest;
  }

  // No protocol: remove leading and trailing slashes
  return normalizeSegment(first);
}

/**
 * Join URL parts ensuring there is exactly one slash between each segment,
 * preserving protocol slashes and not duplicating slashes.
 *
 * Examples:
 *  joinUrl('https://api.example.com/', '/api', 'auth/') -> 'https://api.example.com/api/auth'
 *  joinUrl('/base/', '/a/', '/b') -> 'base/a/b'
 *
 * Ignores null/undefined/empty-string segments.
 */
export function joinUrl(...parts: MaybeString[]): string {
  const filtered = parts
    .filter((p): p is string => typeof p === "string" && p.length > 0)
    .map((p) => p.trim());

  if (filtered.length === 0) return "";

  const [first, ...rest] = filtered;
  const normalizedFirst = normalizeFirstSegmentPreservingProtocol(first);
  const normalizedRest = rest.map(normalizeSegment).filter(Boolean);

  if (normalizedRest.length === 0) {
    return normalizedFirst;
  }

  // If first ends with a slash already (shouldn't after normalization), avoid double slash.
  return [normalizedFirst.replace(/\/+$/g, ""), ...normalizedRest].join("/");
}

/**
 * Ensure the URL ends with exactly one trailing slash.
 * If the input is empty or only whitespace, returns '/'.
 */
export function ensureTrailingSlash(url: MaybeString): string {
  if (!url || url.trim() === "") return "/";
  return url.trim().replace(/\/+$/g, "") + "/";
}

/**
 * Remove trailing slash(es) from a URL (but keep protocol slashes).
 * If the input is empty or only whitespace, returns empty string.
 */
export function removeTrailingSlash(url: MaybeString): string {
  if (!url) return "";
  // Preserve 'https://' etc.
  const protoMatch = url.match(/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//);
  if (protoMatch) {
    const proto = protoMatch[0];
    const rest = url.slice(proto.length).replace(/\/+$/g, "");
    return proto + rest;
  }
  return url.replace(/\/+$/g, "");
}

/**
 * Build an auth base URL from a given API base.
 * If `authBase` is provided, use it. Otherwise derive by appending '/api/auth'.
 * Example:
 *   buildAuthBase('https://example.com/') -> 'https://example.com/api/auth'
 */
export function buildAuthBase(apiBase?: MaybeString, authBase?: MaybeString): string {
  if (authBase && authBase.trim() !== "") {
    return removeTrailingSlash(authBase);
  }
  const base = (apiBase && apiBase.trim() !== "") ? apiBase.trim() : "";
  if (!base) return "/api/auth";
  return joinUrl(base, "api", "auth");
}

export default {
  joinUrl,
  ensureTrailingSlash,
  removeTrailingSlash,
  buildAuthBase,
};
