import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  // baseURL: "https://api.deepen.live/api/auth",
  baseURL: "http://localhost:3000/api/auth", // Uncomment for local development
});
