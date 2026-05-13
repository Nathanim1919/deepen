import { create } from "zustand";
import { persist } from "zustand/middleware";

// Special model ID for auto-routing (fastest)
export const AUTO_MODEL_ID = "openrouter/auto";

export type SettingsStore = {
  // Subscription status (placeholder for now)
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;

  // Default model preference
  defaultModelId: string;
  setDefaultModelId: (modelId: string) => void;

  // Helper to check if using auto mode
  isAutoMode: () => boolean;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      // Default to pro tier for now (until pricing is implemented)
      // TODO: Change to false when pricing is ready
      isPro: true,
      defaultModelId: AUTO_MODEL_ID,

      setIsPro: (isPro) => set({ isPro }),
      
      setDefaultModelId: (modelId) => set({ defaultModelId: modelId }),

      isAutoMode: () => get().defaultModelId === AUTO_MODEL_ID,
    }),
    {
      name: "deepen-settings",
      partialize: (state) => ({
        isPro: state.isPro,
        defaultModelId: state.defaultModelId,
      }),
    }
  )
);

// Helper function to check if a model is free
// OpenRouter returns pricing as strings or very small numbers
export const isModelFree = (pricing: { prompt: number | string }): boolean => {
  const promptPrice = Number(pricing.prompt);
  return promptPrice === 0 || isNaN(promptPrice);
};

// Helper function to filter free models
export const getFreeModels = <T extends { pricing: { prompt: number | string } }>(
  models: T[]
): T[] => {
  return models.filter((model) => isModelFree(model.pricing));
};

// Helper function to get available models based on subscription
export const getAvailableModels = <T extends { pricing: { prompt: number | string } }>(
  models: T[],
  isPro: boolean
): T[] => {
  if (isPro) {
    return models; // Pro users get all models
  }
  return getFreeModels(models); // Free users only get free models
};

