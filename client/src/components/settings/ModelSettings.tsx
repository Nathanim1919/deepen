import { useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, ChevronDown, Crown, Zap } from "lucide-react";
import { useBrainStore } from "../../stores/brain-store";
import { useUIStore } from "../../stores/ui-store";
import {
  useSettingsStore,
  AUTO_MODEL_ID,
  getFreeModels,
  isModelFree,
} from "../../stores/settings-store";

export const ModelSettings = () => {
  const { modelList, getModelList } = useBrainStore();
  const { defaultModelId, isPro } = useSettingsStore();
  const { openContextSelector } = useUIStore();

  useEffect(() => {
    if (modelList.length === 0) {
      getModelList();
    }
  }, [modelList.length, getModelList]);

  const freeModels = getFreeModels(modelList);

  // Get currently selected model info
  const selectedModel =
    defaultModelId === AUTO_MODEL_ID
      ? null
      : modelList.find((m) => m.id === defaultModelId);

  const getDisplayName = () => {
    if (defaultModelId === AUTO_MODEL_ID) {
      return "Auto (Fastest)";
    }
    return selectedModel?.name || defaultModelId;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      className="w-full rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30">
          <Bot className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Default AI Model
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose your preferred model for conversations
          </p>
        </div>
      </div>

      {/* Subscription Badge */}
      <div className="mb-4">
        {isPro ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-xs font-medium">
            <Crown className="w-3 h-3" />
            Pro - All models available
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-500/10 border border-gray-500/30 text-gray-400 text-xs font-medium">
            Free - {freeModels.length} models available
          </span>
        )}
      </div>

      {/* Model Selector Button */}
      <button
        onClick={() => openContextSelector("models-default")}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-100 dark:bg-[#1a1a1b] border border-gray-200 dark:border-gray-800 hover:border-violet-500/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          {defaultModelId === AUTO_MODEL_ID ? (
            <Zap className="w-4 h-4 text-yellow-400" />
          ) : (
            <Bot className="w-4 h-4 text-violet-400" />
          )}
          <span className="text-black dark:text-white font-medium">
            {getDisplayName()}
          </span>
          {selectedModel && isModelFree(selectedModel.pricing) && (
            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
              Free
            </span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {/* Info Text */}
      {!isPro && (
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          💡 Upgrade to Pro for access to premium models like Claude, GPT-4, and
          auto-routing
        </p>
      )}
    </motion.div>
  );
};
