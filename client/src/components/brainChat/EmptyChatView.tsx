import { Bookmark, Bot, Brain, FolderPlus, Plus, ArrowUp, Zap, Command } from "lucide-react";
import type { UIStore } from "../../stores/types";
import { useStore } from "../../context/StoreContext";
import { useNavigate } from "@tanstack/react-router";
import { useBrainStore } from "../../stores/brain-store";
import { useSettingsStore, AUTO_MODEL_ID } from "../../stores/settings-store";
import { ContextSummaryBar } from "./ContextSummaryBar";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { authClient } from "../../lib/auth-client";

export const EmptyChatView = () => {
    const navigate = useNavigate();
    const { middlePanelCollapsed, openContextSelector, showHoverCoach, hideHoverCoach } = useStore().ui as UIStore;
    const { toggleBookmark, toggleBrain, isBrainActive, isBookmarkActive, selectedModel, startConversation } = useBrainStore();
    const { defaultModelId } = useSettingsStore();
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const { data: session } = authClient.useSession();

    // Get display name for the current model
    const getModelDisplayName = () => {
        if (selectedModel?.name) {
            return selectedModel.name.length > 20
                ? selectedModel.name.slice(0, 20) + "..."
                : selectedModel.name;
        }
        if (defaultModelId === AUTO_MODEL_ID) {
            return "Auto";
        }
        return defaultModelId.length > 20
            ? defaultModelId.slice(0, 20) + "..."
            : defaultModelId;
    };

    const isAutoMode = !selectedModel && defaultModelId === AUTO_MODEL_ID;

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [message]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const tempId = `temp-${Date.now()}`;
        navigate({ to: `/in/brain/${tempId}` });

        try {
            await startConversation(message, tempId);
        } catch (error) {
            console.error('Failed to start conversation:', error);
            toast.error('Failed to start conversation');
            navigate({ to: `/in/brain` });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="serif h-full w-full bg-[#f5f2f2] dark:bg-[#0c0c0c] flex flex-col items-center justify-center relative overflow-hidden">



            <div className={`z-10 w-full max-w-2xl px-6 flex flex-col items-center gap-8 transition-all duration-500 ${middlePanelCollapsed ? "scale-105" : "scale-100"}`}>

                {/* Header / Greeting */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-5 mb-2"
                >

                    <h1 className="text-3xl font-medium text-gray-900 dark:text-white tracking-tight">
                    Hello <span className="font-bold capitalize dark:text-[#0effab] text-[#0071e3]">{session?.user?.name?.split(" ")[0]}</span>, how can I help you?
                    </h1>
                </motion.div>

                {/* Main Input Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={`w-full bg-white dark:bg-[#151516] rounded-3xl border transition-all duration-300 shadow-xl shadow-gray-200/40 dark:shadow-black/20 overflow-hidden group
                        ${isFocused
                            ? "border-blue-500/30 ring-4 ring-blue-500/5 dark:ring-blue-500/10"
                            : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
                        }`}
                >
                    <div className="px-1 pt-1">
                        <ContextSummaryBar />
                    </div>

                    <div className="px-5 pt-3 pb-2">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            rows={1}
                            className="w-full bg-transparent border-none focus:ring-0 resize-none text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 leading-relaxed max-h-[200px] overflow-y-auto outline-0"
                            placeholder={`Let's dive into your knowledge...`}
                        />
                    </div>

                    {/* Toolbar */}
                    <div className="px-3 py-3 mt-2 flex items-center justify-between">

                        {/* Left Actions (Context) */}
                        <div className="flex items-center gap-1.5">
                            {/* Attach Button */}
                            <button
                                onClick={() => openContextSelector("captures")}
                                onMouseEnter={(e) => showHoverCoach("captures", e.currentTarget)}
                                onMouseLeave={hideHoverCoach}
                                className="p-2 rounded-xl cursor-pointer text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                title="Add Context"
                            >
                                <Plus size={20} strokeWidth={2} />
                            </button>

                            <div className="h-4 w-px bg-gray-200 dark:bg-zinc-800 mx-1" />

                            {/* Context Toggles */}
                            <div className="flex items-center gap-1 bg-gray-50 dark:bg-zinc-900/50 p-1 rounded-xl border border-transparent dark:border-zinc-800/50">
                                <button
                                    onClick={toggleBrain}
                                    onMouseEnter={(e) => showHoverCoach("brain", e.currentTarget)}
                                    onMouseLeave={hideHoverCoach}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${isBrainActive()
                                            ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
                                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-zinc-800/50"
                                        }`}
                                >
                                    <Brain size={14} />
                                    <span>Brain</span>
                                </button>

                                <button
                                    onClick={() => openContextSelector("collections")}
                                    onMouseEnter={(e) => showHoverCoach("collections", e.currentTarget)}
                                    onMouseLeave={hideHoverCoach}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-gray-200 transition-all cursor-pointer"
                                >
                                    <FolderPlus size={14} />
                                    <span>Collections</span>
                                </button>

                                <button
                                    onClick={toggleBookmark}
                                    onMouseEnter={(e) => showHoverCoach("bookmarks", e.currentTarget)}
                                    onMouseLeave={hideHoverCoach}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${isBookmarkActive()
                                            ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
                                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-zinc-800/50"
                                        }`}
                                >
                                    <Bookmark size={14} />
                                    <span>Bookmarks</span>
                                </button>
                            </div>
                        </div>

                        {/* Right Actions (Model & Send) */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => openContextSelector("models")}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                                <span>{getModelDisplayName()}</span>
                                {isAutoMode ? <Zap size={14} className="text-amber-500" /> : <Bot size={14} className="text-blue-500" />}
                            </button>

                            <button
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                                className={`p-2.5 rounded-full transition-all duration-300 ${message.trim()
                                        ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
                                        : "bg-gray-100 dark:bg-zinc-800 text-gray-300 dark:text-zinc-600 cursor-not-allowed"
                                    }`}
                            >
                                <ArrowUp size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Footer hints */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 dark:text-zinc-600 font-medium"
                >
                    <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-[10px]"><Command size={10} /></span>
                        <span>+</span>
                        <span className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-[10px]">Enter</span>
                        <span className="opacity-70 ml-1">to send</span>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
