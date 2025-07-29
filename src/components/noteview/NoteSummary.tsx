import React from "react";
import { useChat } from "../../context/ChatContext";
import { useUI } from "../../context/UIContext";
import { motion, AnimatePresence } from "framer-motion";
import { LLMRenderer } from "../LLMRenderer";

type NoteSummaryProps = {
  summary: string | null;
  captureId?: string;
};

const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export const NoteSummary: React.FC<NoteSummaryProps> = ({
  summary,
  captureId,
}) => {
  const { addMessage, setUserMessage } = useChat();
  const { setOpenAiChat } = useUI();

  const handleQuestionClick = (question: string) => {
    setOpenAiChat?.(true);
    if (!captureId) return;
    setUserMessage(question);
    addMessage(captureId);
  };

  return (
    <div className="mx-auto overflow-hidden">
      {/* Main Content */}
      <AnimatePresence>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          className="text-base"
        >
          <LLMRenderer
            markdown={summary}
            onQuestionClick={handleQuestionClick}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
