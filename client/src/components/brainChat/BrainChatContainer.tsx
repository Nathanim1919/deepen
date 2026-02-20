import { Ellipsis, Send, Share, Trash } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useBrainStore } from "../../stores/brain-store";
import { ChatSkeleton } from "../skeleton/ChatSkeleton";
import { MessageBubble } from "../Chat/MessageBubble";
import { toast } from "sonner";

export const BrainChatContainer = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { conversationId } = useParams({ strict: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { conversations, fetchConversation, sendMessage, selectConversation } =
    useBrainStore();
  const [message, setMessage] = useState("");
  const conversation = conversations[conversationId || ""];

  const navigate = useNavigate();

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    console.log(
      "BrainChatContainer: handleSendMessage called with:",
      message.trim(),
    );
    console.log(
      "BrainChatContainer: active conversation ID:",
      useBrainStore.getState().activeConversationId,
    );
    try {
      await sendMessage(message.trim());
      console.log("BrainChatContainer: sendMessage completed");
      setMessage(""); // Clear input after sending
    } catch (error) {
      console.error("BrainChatContainer: sendMessage failed:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Handle direct URL navigation - fetch conversation if not in store
  useEffect(() => {
    if (
      conversationId &&
      !conversation &&
      !isLoading &&
      !conversationId.startsWith("temp-")
    ) {
      setIsLoading(true);
      fetchConversation(conversationId)
        .then((conversation) => {
          if (!conversation) {
            toast.error("Opps! Conversation doesnt seem to exist!");
            navigate({ to: "/in/brain" });
            return;
          }
          selectConversation(conversationId);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [
    conversationId,
    conversation,
    fetchConversation,
    selectConversation,
    isLoading,
  ]);

  // Show loading state while fetching

  // Show not found after loading attempt
  if (!conversation && conversationId && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 dark:text-red-400 mb-2">
            Conversation not found
          </div>
          <div className="text-sm text-gray-400">ID: {conversationId}</div>
        </div>
      </div>
    );
  }
  return (
    <div className=" w-full relative bg-[#f6f3f3] dark:bg-[#101010] flex flex-col h-[calc(100vh-0px)]">
      <div className="flex text-black dark:text-white items-center justify-between px-4 py-2 border-b border-[#e2e0e0] dark:border-[#1b1b1c]">
        <div>
          <h2 className="text-2xl font-bold">Deepen</h2>
        </div>
        <button
          className="cursor-pointer hover:opacity-50"
          onClick={() => setShowOptions(!showOptions)}
        >
          <Ellipsis size={20} />
        </button>
        {showOptions && (
          <div className="flex overflow-hidden flex-col text-black dark:text-white shadow-2xl absolute top-10 right-4 bg-white dark:bg-[#101010] border border-gray-300 dark:border-gray-800 rounded-md">
            <button className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] cursor-pointer">
              <Share size={16} />
              Share
            </button>
            <button className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] cursor-pointer">
              <Trash size={16} />
              Delete
            </button>
          </div>
        )}
      </div>
      <div
        ref={messagesContainerRef}
        className="flex flex-col flex-1 p-4 w-full md:w-[60%] mx-auto space-y-6 overflow-y-auto max-h-[calc(100vh-100px)]"
      >
        {isLoading ? (
          <ChatSkeleton />
        ) : (
          <>
            {conversation?.messages.map((item) => (
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
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <div className="flex shadow-2xl overflow-hidden pl-4 p-3 items-center w-[90%] md:w-[70%] bg-[#f6f3f3] dark:bg-[#101010] mx-auto justify-center rounded-full border mb-4 border-[#e2e0e0] dark:border-[#1b1b1c]">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="w-full h-full resize-none focus:outline-none text-black dark:text-white"
          placeholder="Ask anything..."
          rows={1}
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isSending}
          className=" w-8 h-8 grid place-items-center text-black dark:text-white rounded-full cursor-pointer hover:opacity-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );
};
