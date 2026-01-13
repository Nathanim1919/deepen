import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { motion } from "framer-motion";
import { RiGeminiFill } from "react-icons/ri";
import EmptyChat from "./EmptyChat";
import { useStore } from "../../context/StoreContext";
import type { UIStore } from "../../stores/types";
import { useChatManager } from "../../hooks/useChatManager";

export const ChatView = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading } = useChatManager();
  const { expandAiChat } = useStore().ui as UIStore;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`h-full overflow-hidden ${expandAiChat ? "bg-transparent" : "bg-gray-100 dark:bg-[#1A1A1C]"} flex flex-col`}>
      {/* Message History */}
      {
        messages.length === 0 && !isLoading && (
          <EmptyChat />
        )
      }
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 max-h-full">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            role={msg.role}
            content={msg.content}
          />
        ))}
        <div ref={messagesEndRef} />

        {isLoading && (
          <motion.div
            className="flex items-center justify-center gap-2 py-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Apple-style animated dots */}
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#636366]"
                  animate={{
                    y: [0, -5, 0],
                    opacity: [0.6, 1, 0.6],
                    backgroundColor: [
                      "rgba(99, 99, 102, 0.6)",
                      "rgba(139, 92, 246, 1)",
                      "rgba(99, 99, 102, 0.6)"
                    ]
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>


            {/* Animated Gemini icon */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <RiGeminiFill className="h-5 w-5 text-violet-500" />
            </motion.div>

            <motion.span
              className="text-sm text-[#AEAEB2]"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Thinking...
            </motion.span>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput />
    </div>
  );
};