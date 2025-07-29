import { motion } from "framer-motion";
import { RiGeminiFill } from "react-icons/ri";
import { LLMRenderer } from "../LLMRenderer";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  references?: { id: string; title: string; url: string }[]; // Adjusted type for references
}

export const MessageBubble = ({ role, content }: MessageBubbleProps) => {
  return (
    <motion.div
      className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div
        className={`relative text-md  rounded-2xl text-[14px] p-2 ${
          role === "assistant"
            ? "bg-blue-600/0 rounded-br-none max-w-[95%] text-gray-600 dark:text-gray-400 "
            : "bg-gray-200 dark:bg-[#1e212c] max-w-[80%]  rounded-bl-none border text-black/80 dark:text-[#ffffff] border-gray-300 dark:border-gray-800/50"
        }`}
      >
        {/* Added Gemini icon */}
        {role === "assistant" && content !== "" && (
          <span className="absolute -top-4 w-6 h-6 rounded-full border border-violet-400/30 grid place-items-center -left-4 text-gray-500">
            <RiGeminiFill className="h-4 w-4 text-violet-500" />
          </span>
        )}

        <LLMRenderer markdown={content} />
      </div>
    </motion.div>
  );
};
