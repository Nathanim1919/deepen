import React from "react";

export const NoteSummarySkeleton: React.FC = () => {
  return (
    <div className="space-y-8 mt-6 text-sm text-gray-400">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-gray-300 dark:bg-blue-500/20 animate-pulse" />
        <div className="h-4 w-24 rounded bg-gradient-to-r from-gray-200/10 via-gray-200/20 to-gray-200/10 animate-pulse" />
      </div>

      {/* Overview */}
      <div className="space-y-3">
        <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-200/10 animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-200/10 animate-pulse" />
        <div className="h-4 w-1/3 rounded bg-gray-300 dark:bg-gray-200/10 animate-pulse" />
      </div>

      {/* Key Points */}
      <ul className="space-y-3 pl-4">
        {[...Array(3)].map((_, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="h-2.5 w-2.5 mt-1 rounded-full bg-gray-300 dark:bg-blue-500/30 animate-pulse" />
            <div className="space-y-1 w-full">
              <div className="h-4 w-full rounded bg-gray-300 dark:bg-gray-200/10 animate-pulse" />
              {i % 2 === 0 && (
                <div className="h-3 w-3/4 rounded bg-gray-300 dark:bg-gray-200/5 animate-pulse" />
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Related Questions */}
      <div className="pt-4 border-t border-gray-800/10 space-y-2">
        <div className="h-4 w-1/3 rounded bg-gray-300 dark:bg-gray-200/10 animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-6 rounded-md bg-gray-300 dark:bg-gray-200/5 animate-pulse"
              style={{ width: `${30 + i * 15}%` }}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 flex justify-end items-center gap-1 text-xs">
        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        <span>AI summarizing...</span>
      </div>
    </div>
  );
};
