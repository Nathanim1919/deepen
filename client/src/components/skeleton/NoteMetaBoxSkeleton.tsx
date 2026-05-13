import React from "react";
import { motion } from "framer-motion";

export const NoteMetaBoxSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl mt-6 p-5 bg-white/70 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 shadow-sm"
    >
      <div className="flex flex-wrap gap-6">
        {[...Array(4)].map((_, i) => (
          <MetaItemSkeleton key={i} delay={i * 0.1} />
        ))}
      </div>
    </motion.div>
  );
};

const MetaItemSkeleton: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center gap-3"
    >
      <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 animate-pulse" />
      
      <div className="flex flex-col gap-1.5">
        <div className="w-12 h-3 rounded-full bg-zinc-100 dark:bg-zinc-800/50 animate-pulse" />
        <div className="w-16 h-4 rounded-full bg-zinc-200/80 dark:bg-zinc-700/50 animate-pulse" />
      </div>
    </motion.div>
  );
};