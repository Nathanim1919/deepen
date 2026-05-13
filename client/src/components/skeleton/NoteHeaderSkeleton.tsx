import React from "react";

export const NoteHeaderSkeleton: React.FC = () => {
  return (
    <div className="p-2 py-4 border-gray-300  dark:border-gray-700 animate-pulse relative overflow-hidden">
      <div className="h-6 w-2/3 rounded-lg bg-gray-300 dark:bg-zinc-600/30 mb-2" />
      <div className="grid gap-1">
        <div className="h-4 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700/20" />
        <div className="h-4 w-1/1 rounded-lg bg-zinc-200 dark:bg-zinc-700/20" />
        <div className="h-4 w-1/2 rounded-lg bg-zinc-200 dark:bg-zinc-700/20" />
      </div>

      {/* Subtle shimmer overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-10 animate-pulse" />
    </div>
  );
};
