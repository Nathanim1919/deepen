import { useState, useEffect } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { Brain, ExternalLink } from "lucide-react";
import { MessageBubble } from "../components/Chat/MessageBubble";
import { getSharedConversation } from "../api/brain.api";
import type { Message } from "../stores/brain-store";

type SharedConversationData = {
  title: string;
  messages: Message[];
  createdAt: string;
  sharedAt: string;
};

export const SharedConversation = () => {
  const { shareToken } = useParams({ strict: false });
  const [conversation, setConversation] = useState<SharedConversationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!shareToken) return;

    setIsLoading(true);
    getSharedConversation(shareToken)
      .then((response) => {
        const data = response.data;
        if (!data) {
          setError("Conversation not found");
          return;
        }
        setConversation({
          title: data.title || "Untitled Conversation",
          createdAt: data.createdAt,
          sharedAt: data.sharedAt,
          messages: (data.messages || []).map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            createdAt: msg.timestamp
              ? new Date(msg.timestamp).getTime()
              : Date.now(),
            status: "sent" as const,
            sources: msg.sources,
          })),
        });
      })
      .catch(() => {
        setError("This shared conversation is no longer available.");
      })
      .finally(() => setIsLoading(false));
  }, [shareToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f3f3] dark:bg-[#0c0c0c] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <Brain className="w-6 h-6 animate-pulse" />
          <span>Loading conversation...</span>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen bg-[#f6f3f3] dark:bg-[#0c0c0c] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <Brain className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Conversation not found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {error || "This link may have expired or been revoked."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Go to Deepen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f3f3] dark:bg-[#0c0c0c] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#e2e0e0] dark:border-[#1b1b1c] px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {conversation.title}
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Shared from Deepen
              </p>
            </div>
          </div>
          <Link
            to="/register"
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Try Deepen
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {conversation.messages
            .filter((m) => m.role !== "system")
            .map((item) => (
              <div
                key={item.id}
                className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <MessageBubble
                  role={item.role as "user" | "assistant"}
                  content={item.content}
                  sources={item.sources}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#e2e0e0] dark:border-[#1b1b1c] px-4 py-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">
            This is a shared conversation from Deepen — your AI-powered second brain.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Start your own knowledge base
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
