import { motion } from "framer-motion";
import { BsStars } from "react-icons/bs"; // better visual fit for “smart/intelligent assistant”

export default function EmptyChat() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full relative px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Glowing gradient background ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-60 h-60 rounded-full bg-gradient-to-br from-[#0a84ff40] to-[#34a85330] blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      />

      {/* Apple-style icon with soft container */}
      <motion.div
        className="p-5 mb-6 rounded-2xl bg-gradient-to-b from-[#f9f9fa] to-[#e5e5ea] dark:from-[#2c2c2e] dark:to-[#1c1c1e] shadow-md border border-white/10 dark:border-white/5 backdrop-blur-lg"
        initial={{ scale: 0.85, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{
          delay: 0.1,
          duration: 0.5,
          type: "spring",
          damping: 12,
          stiffness: 120,
        }}
      >
        <BsStars className="text-4xl text-[#0071e3] dark:text-[#0a84ff]" />
      </motion.div>

      {/* Heading */}
      <motion.h3
        className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        Start a Conversation
      </motion.h3>

      {/* Subtext */}
      <motion.p
        className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-sm text-center leading-relaxed tracking-tight"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        Ask me anything or try one of the prompts below to get started.
      </motion.p>
    </motion.div>
  );
}
