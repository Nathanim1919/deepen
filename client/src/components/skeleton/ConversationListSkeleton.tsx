import { motion } from "framer-motion";

export const ConversationListSkeleton = () => {
  // Deterministic widths to simulate natural conversation titles
  const widths = ["w-3/4", "w-1/2", "w-[85%]", "w-2/3", "w-[60%]", "w-4/5", "w-1/2", "w-3/4", "w-[70%]", "w-2/3"];

  return (
    <div className="h-full flex flex-col bg-[#faf7f7] dark:bg-[#141416] relative overflow-hidden">
      {/* Header Actions - Minimalist ghostly icons */}
      <div className="flex justify-end items-center px-4 py-3 gap-4">
        <div className="w-4 h-4 rounded bg-gray-200 dark:bg-zinc-800/50" />
        <div className="w-4 h-4 rounded bg-gray-200 dark:bg-zinc-800/50" />
      </div>

      {/* List Content */}
      <div className="flex-1 px-2 space-y-1 pt-1">
        {widths.map((width, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex items-center h-8 px-3 rounded-lg"
          >
            {/* Organic Pulse Effect */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15, // Wave effect
              }}
              className={`h-5 rounded-full bg-gray-200 dark:bg-zinc-800 ${width}`}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
