import { api } from ".";

export const resetData = async (): Promise<void> => {
  try {
    await api.post("/account/reset");
    console.log(`✅ Successfully reset data:`);
    return; // Added return statement to indicate completion
  } catch (error) {
    console.error(`❌ Error resetting data:`, error);
    throw error;
  }
};

export const setGeminiApiKey = async (geminiApiKey: string): Promise<void> => {
  try {
    await api.post("/account/setGeminiApiKey", {
      geminiApiKey,
    });
    console.log(`✅ Successfully set Gemini API key:`);
    return; // Added return statement to indicate completion
  } catch (error) {
    console.error(`❌ Error setting Gemini API key:`);
    throw error;
  }
};

export interface IUserProfile {
  userId: string;
  externalServices: {
    gemini: {
      hasApiKey: boolean;
    };
  };
}

export const getUserProfileInfo = async (): Promise<IUserProfile> => {
  try {
    const response = await api.get("/account/profile");
    return response.data.data; // Added return statement to indicate completion
  } catch (error) {
    console.error(`❌ Error retrieving user profile info:`, error);
    throw error;
  }
};
