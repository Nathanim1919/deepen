import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const shimmer = "bg-gradient-to-r from-[#bab6b6] dark:from-[#211f1f] via-gray-300 dark:via-gray-700 to-gray-400 dark:to-gray-800 bg-[length:400%_100%] animate-pulse";

export const ChatMessageSkeleton: React.FC<{ isUser?: boolean }> = ({ isUser = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`text-sm w-full font-medium text-black dark:text-white ${isUser ? 'bg-gray-200 dark:bg-[#1a1a1a] text-black dark:text-white' : ''} rounded-2xl p-4 max-w-[70%]`}>
        <div className={clsx("h-4 rounded w-full mb-2", shimmer)} />
        <div className={clsx("h-4 rounded w-5/6 mb-2", shimmer)} />
        <div className={clsx("h-4 rounded w-3/4", shimmer)} />
      </div>
    </motion.div>
  );
};

export const ChatSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 p-4 w-[80%] mx-auto space-y-6 overflow-y-auto max-h-[calc(100vh-100px)]">
      {/* Simulate a conversation with alternating messages */}
      <ChatMessageSkeleton isUser={false} />
      <ChatMessageSkeleton isUser={true} />
      <ChatMessageSkeleton isUser={false} />
      <ChatMessageSkeleton isUser={true} />
      <ChatMessageSkeleton isUser={false} />
      <ChatMessageSkeleton isUser={true} />
    </div>
  );
};
