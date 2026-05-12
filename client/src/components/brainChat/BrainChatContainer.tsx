import { Ellipsis, Send, Trash, Square, Link } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useBrainStore } from "../../stores/brain-store";
import { ChatSkeleton } from "../skeleton/ChatSkeleton";
import { MessageBubble } from "../Chat/MessageBubble";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { shareConversation } from "../../api/brain.api";

export const BrainChatContainer = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { conversationId } = useParams({ strict: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { conversations, fetchConversation, sendMessage, selectConversation, deleteConversation } =
    useBrainStore();
  const [message, setMessage] = useState("");
  const conversation = conversations[conversationId || ""];

  // Detect if assistant is currently streaming a response
  const isStreaming = useMemo(() => {
    return conversation?.messages.some(
      (m) => m.role === "assistant" && m.status === "sending"
    ) ?? false;
  }, [conversation?.messages]);

  // Detect if we're waiting for the first AI response (user sent message, no assistant reply yet)
  const isWaitingForResponse = useMemo(() => {
    if (!conversation?.messages.length) return false;
    const hasUserMessage = conversation.messages.some(m => m.role === "user");
    const hasAssistantMessage = conversation.messages.some(m => m.role === "assistant");
    return hasUserMessage && !hasAssistantMessage;
  }, [conversation?.messages]);

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

    const currentMessage = message.trim();
    setMessage(""); // Clear input immediately
    setIsSending(true);
    try {
      await sendMessage(currentMessage);
    } catch (error) {
      console.error("BrainChatContainer: sendMessage failed:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async () => {
    if (!conversationId || conversationId.startsWith("temp-")) return;

    setIsDeleting(true);
    try {
      await deleteConversation(conversationId);
      toast.success("Conversation deleted");
      navigate({ to: "/in/brain" });
    } catch {
      toast.error("Failed to delete conversation");
    }
    setShowOptions(false);
  };

  const handleShare = async () => {
    if (!conversationId || conversationId.startsWith("temp-")) return;
    setIsSharing(true);

    try {
      const response = await shareConversation(conversationId);
      const shareToken = response.data.shareToken;
      const shareUrl = `${window.location.origin}/share/${shareToken}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch {
      toast.error("Failed to share conversation");
    } finally {
      setIsSharing(false);
      setShowOptions(false);
    }
  };


  // Handle direct URL navigation - fetch conversation if not in store
  useEffect(() => {
    if (
      conversationId &&
      !conversation &&
      !isLoading &&
      !isDeleting &&
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
          <div className="flex overflow-hidden flex-col text-black dark:text-white shadow-2xl absolute top-10 right-4 bg-white dark:bg-[#101010] border border-gray-300 dark:border-gray-800 rounded-md z-50">
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] cursor-pointer disabled:opacity-50 text-sm"
            >
              <Link size={16} />
              {isSharing ? "Copying..." : "Copy Share Link"}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer text-red-600 dark:text-red-400 text-sm"
            >
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
            {conversation?.messages.map((item, index) => {
              // Only show follow-up question chips on the last assistant message
              const isLastAssistant =
                item.role === "assistant" &&
                index === conversation.messages.map(m => m.role).lastIndexOf("assistant");

              return (
                <div
                  key={item.id}
                  className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <MessageBubble
                    role={item.role as "user" | "assistant"}
                    content={item.content}
                    sources={item.sources}
                    onQuestionClick={
                      isLastAssistant && !isSending && !isStreaming
                        ? (question: string) => {
                            setMessage(question);
                            // Auto-send after a brief moment so the user sees it
                            setTimeout(() => {
                              setMessage("");
                              setIsSending(true);
                              sendMessage(question)
                                .catch((err) => console.error("Follow-up send failed:", err))
                                .finally(() => setIsSending(false));
                            }, 100);
                          }
                        : undefined
                    }
                  />
                </div>
              );
            })}
            {/* Thinking indicator while waiting for first streaming token */}
            {(isWaitingForResponse || (isSending && !isStreaming)) && (
              <motion.div
                className="flex items-center gap-3 py-4 pl-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
                      animate={{
                        y: [0, -5, 0],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  Thinking...
                </span>
              </motion.div>
            )}
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
          className="w-full h-full resize-none focus:outline-none bg-transparent text-black dark:text-white"
          placeholder="Ask anything..."
          rows={1}
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isSending || isStreaming}
          className=" w-8 h-8 grid place-items-center text-black dark:text-white rounded-full cursor-pointer hover:opacity-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isSending || isStreaming ? (
            <Square size={16} className="text-gray-400" />
          ) : (
            <Send size={22} />
          )}
        </button>
      </div>
    </div>
  );
};
