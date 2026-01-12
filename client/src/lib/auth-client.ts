import { createAuthClient } from "better-auth/react";
import { buildAuthBase } from "./url";

const authBase = buildAuthBase(
  import.meta.env.VITE_API_BASE_URL as string,
  import.meta.env.VITE_AUTH_BASE_URL as string,
);

export const authClient = createAuthClient({
  baseURL: authBase,
});
