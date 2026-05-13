import { useEffect, useState } from "react";
import { useBrainStore, type OpenRouterModel } from "../../../stores/brain-store";
import { useSettingsStore, AUTO_MODEL_ID, getAvailableModels, isModelFree } from "../../../stores/settings-store";
import { Bot, Check, Zap, Search } from "lucide-react";

type ModelsPickerProps = {
    // Optional: for settings page to set default model instead of conversation model
    mode?: "conversation" | "default";
    onSelect?: (model: OpenRouterModel | null) => void;
};

export const ModelsPicker = ({ mode = "conversation", onSelect }: ModelsPickerProps) => {
    const { modelList, selectedModel, setSelectedModel, getModelList } = useBrainStore();
    const { defaultModelId, setDefaultModelId, isPro } = useSettingsStore();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getModelList();
    }, []);

    // Get available models based on subscription
    const availableModels = getAvailableModels(modelList, isPro);

    // Filter models by search query
    const filteredModels = availableModels.filter(
        (model) =>
            model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            model.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Determine which model is currently active based on mode
    const activeModelId = mode === "default" 
        ? defaultModelId 
        : (selectedModel?.id || defaultModelId);

    const handleSelectModel = (model: OpenRouterModel | null, modelId: string) => {
        if (mode === "default") {
            setDefaultModelId(modelId);
        } else {
            if (model) {
                setSelectedModel(model);
            }
        }
        onSelect?.(model);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Search Input */}
            <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 p-3 border-b border-gray-100 dark:border-zinc-800">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search models..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-transparent focus:bg-white dark:focus:bg-zinc-800 focus:border-gray-200 dark:focus:border-zinc-700 text-gray-900 dark:text-gray-100 text-sm transition-all outline-none placeholder:text-gray-400"
                    />
                </div>
            </div>

            <div className="flex-1 p-2 space-y-0.5">
                {/* Auto Option - Only for Pro users */}
                {isPro && (
                    <button
                        className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all group ${
                            activeModelId === AUTO_MODEL_ID 
                                ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        }`}
                        onClick={() => handleSelectModel({ id: AUTO_MODEL_ID, name: "Auto (Fastest)" } as OpenRouterModel, AUTO_MODEL_ID)}
                    >
                        <div className="shrink-0">
                            {activeModelId === AUTO_MODEL_ID ? (
                                <Check className="size-4" />
                            ) : (
                                <Zap className="size-4 text-amber-500" />
                            )}
                        </div>
                        <div className="flex-1 flex items-center gap-2 overflow-hidden">
                            <span className="truncate font-medium">Auto (Fastest)</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                Recommended
                            </span>
                        </div>
                    </button>
                )}

                {/* Model List */}
                {filteredModels.map((model) => {
                    const isSelected = activeModelId === model.id;
                    return (
                        <button
                            key={model.id}
                            className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all group ${
                                isSelected
                                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                            }`}
                            onClick={() => handleSelectModel(model, model.id)}
                        >
                            <div className={`shrink-0 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500"}`}>
                                {isSelected ? (
                                    <Check className="size-4" />
                                ) : (
                                    <Bot className="size-4" />
                                )}
                            </div>
                            
                            <div className="flex-1 flex items-center gap-2 min-w-0">
                                <span className="truncate font-medium">{model.name || model.id}</span>
                                {isModelFree(model.pricing) && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400">
                                        Free
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}

                {filteredModels.length === 0 && (
                    <div className="px-4 py-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No models found</p>
                    </div>
                )}
            </div>
        </div>
    );
};
