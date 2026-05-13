import { Ellipsis, MessageSquareText, PanelRightOpen, SquarePen } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import type { UIStore } from "../../stores/types";
import { Link } from "@tanstack/react-router";
import { ConversationListSkeleton } from "../skeleton/ConversationListSkeleton";
import { useBrainStore } from "../../stores/brain-store";
import { useEffect, useState } from "react";

const ConversationList: React.FC = () => {
    const { conversationList, conversations, fetchConversations, selectConversation, fetchConversation, activeConversationId } = useBrainStore();
    const [isLoading, setIsLoading] = useState(true);

    const { middlePanelCollapsed, setMiddlePanelCollapsed } = useStore()
        .ui as UIStore;

    useEffect(() => {
        const loadConversations = async () => {
            try {
                await fetchConversations();
            } finally {
                setIsLoading(false);
            }
        };
        loadConversations();
    }, [fetchConversations]);

    if (isLoading) return <ConversationListSkeleton />;



    return (
        <div className="h-full flex flex-col overflow-hidden relative bg-[#faf7f7] dark:bg-[#141416]">
            <div className="flex justify-end items-center px-2 py-2">
                <div className="z-1000 opacity-50 flex items-center justify-center gap-4 rounded-full cursor-pointer hover:bg-transparent text-2xl  dark:text-gray-200 text-[#333]  top-1  right-0">
                    <Link to="/in/brain"
                        className="hover:opacity-45"
                    >
                        <SquarePen size={18} />
                    </Link>

                    <PanelRightOpen size={18}
                        className="hover:opacity-45"
                        onClick={() => setMiddlePanelCollapsed(!middlePanelCollapsed)}
                    />
                </div>
            </div>
            {Object.keys(conversationList).length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center ">
                    <MessageSquareText size={24} className="text-gray-500 dark:text-gray-800"/>
                    <div className="text-gray-500 dark:text-gray-400">No conversations found</div>
                </div>
            ) : (
            <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
                {Object.values(conversationList || {}).map((item) => {
                    const itemId = item._id || item.id;
                    const isActive = activeConversationId === itemId;

                    return (
                        <Link
                        onClick={async () => {
                            // Fetch full conversation if not already loaded
                            if (!conversations[itemId]) {
                                await fetchConversation(itemId);
                            }
                            selectConversation(itemId);
                        }}
                        to={`/in/brain/${itemId}`}
                            key={itemId}
                            className={`group flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer relative ${
                                isActive
                                    ? 'bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-500 text-blue-900 dark:text-blue-100 font-medium shadow-sm'
                                    : 'hover:bg-gray-100/80 dark:hover:bg-zinc-800/80 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <div className="flex-1 min-w-0 pr-3">
                                <h3 className={`text-sm truncate ${
                                    isActive
                                        ? 'text-blue-900 dark:text-blue-100 font-semibold'
                                        : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                                }`}>
                                    {item.title || item.lastMessage?.content?.slice(0, 50) + "..." || "New Conversation"}
                                </h3>
                            </div>
                            <button className={`p-1 rounded transition-all ${
                                isActive
                                    ? 'opacity-100 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300'
                                    : 'opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-400 dark:text-gray-500'
                            }`}>
                                <Ellipsis className="w-4 h-4" />
                            </button>
                        </Link>
                    );
                })}
            </div>
            )}
        </div>
    );
};

export default ConversationList;