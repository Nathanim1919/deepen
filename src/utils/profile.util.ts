// Util function to check user has gemini API key

import { getUserProfileInfo } from "../api/account.api";

export const doesUserHasApiKey = async (): Promise<boolean> => {
  const data = await getUserProfileInfo();
  return data.externalServices.gemini.hasApiKey;
};
