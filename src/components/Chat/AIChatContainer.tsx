import { useUI } from "../../context/UIContext";
import { motion, AnimatePresence } from "framer-motion";
import { BsStars } from "react-icons/bs";
import { X, Maximize, ChevronsRightLeft } from "lucide-react";
import { ChatView } from "./ChatView";
import { useChat } from "../../context/ChatContext";

export const AIChatContainer = () => {
  const { openAiChat, setOpenAiChat, expandAiChat, setExpandAiChat } = useUI();

  const { clearMessages } = useChat();

  return (
    <AnimatePresence>
      {openAiChat && (
        <motion.div className="absolute bottom-0 top-0 right-0 left-0 flex flex-col border border-gray-300 dark:border-gray-800/50 bg-white dark:bg-[#161618] backdrop-blur-3xl text-black dark:text-gray-200">
          {/* Header with Apple-style materials */}

          <motion.header
            className="px-5 py-3 border-b border-gray-800/50 flex justify-between items-center"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-2">
              <BsStars
                className="text-violet-500 dark:text-blue-400/90"
                size={18}
              />
              <h1 className="text-sm font-medium tracking-tight dark:text-gray-200">
                AI Assistant
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <motion.div className="flex rounded-full bg-gray-200 dark:bg-[#1a1818]">
                <button
                  className={`px-3 cursor-pointer py-1.5 text-xs dark:text-white dark:bg-gray-700/50 rounded-l-full`}
                >
                  Chat
                </button>
                <button
                  className={`px-3 cursor-pointer py-1.5 text-xs
                     text-gray-400 rounded-r-full`}
                  onClick={() => clearMessages()}
                >
                  Clear
                </button>
              </motion.div>
              <motion.button
                onClick={() => {
                  setExpandAiChat?.(!expandAiChat);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Expand AI Chat"
                className="p-1.5 hidden md:grid place-items-center rounded-full text-gray-400 cursor-pointer hover:text-gray-200"
              >
                {expandAiChat ? (
                  <ChevronsRightLeft size={16} className="h-4 w-4" />
                ) : (
                  <Maximize size={16} />
                )}
              </motion.button>
              <motion.button
                onClick={() => {
                  setExpandAiChat?.(false);
                  setOpenAiChat?.(false);
                }}
                className="p-1.5 rounded-full text-gray-400 cursor-pointer hover:text-gray-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>
            </div>
          </motion.header>

          {/* Dynamic Content Area with subtle parallax effect */}
          <motion.main
            className={`flex-1 ${
              expandAiChat && "w-full md:w-[50%] h-full mx-auto"
            } overflow-hidden`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                // key={activeTab}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -5, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                <ChatView />
              </motion.div>
            </AnimatePresence>
          </motion.main>
        </motion.div>
      )}
    </AnimatePresence>
  );
};