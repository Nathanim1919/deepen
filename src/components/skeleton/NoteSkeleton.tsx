import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const shimmer =
  "bg-gradient-to-r from-[#bab6b6] dark:from-[#211f1f] via-gray-300 dark:via-gray-700 to-gray-400 dark:to-gray-800 bg-[length:400%_100%] animate-pulse";

export const NoteSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg p-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Icon + title skeleton */}
          <div className="flex items-center gap-2 mb-2">
            <div className={clsx("w-4 h-4 rounded", shimmer)} />
            <div className={clsx("h-4 rounded w-1/3", shimmer)} />
          </div>

          {/* Favicon and site name */}
          <div className="flex items-center gap-2 mb-2">
            <div className={clsx("w-3 h-3 rounded", shimmer)} />
            <div className={clsx("w-1/4 h-3 rounded", shimmer)} />
          </div>

          {/* Description lines */}
          <div className={clsx("h-3 rounded w-full mb-1", shimmer)} />
          <div className={clsx("h-3 rounded w-5/6 mb-2", shimmer)} />

          {/* Time & Date metadata */}
          <div className="flex justify-between items-center">
            <div className={clsx("h-3 w-1/6 rounded", shimmer)} />
            <div className={clsx("h-3 w-1/4 rounded", shimmer)} />
          </div>
        </div>

        {/* Bookmark icon */}
        <div className={clsx("w-5 h-5 ml-3 rounded-md", shimmer)} />
      </div>
    </motion.div>
  );
};

export const NoteListSkeleton: React.FC = () => {
  return (
    <div className="px-2 py-3 space-y-2">
      {Array.from({ length: 6 }).map((_, idx) => (
        <NoteSkeleton key={idx} />
      ))}
    </div>
  );
};
