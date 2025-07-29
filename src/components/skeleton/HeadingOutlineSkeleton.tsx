import React from "react";

const HeadingOutlineSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl mt-6 bg-gray-200 dark:bg-zinc-950 shadow-md p-4 w-full animate-pulse">
      {/* Header Placeholder */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-32 rounded bg-gray-300 dark:bg-zinc-900" />
        <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-zinc-900" />
      </div>

      {/* Main Rectangle Skeleton */}
      <div className="h-40 rounded-lg bg-gray-300 dark:bg-zinc-900" />

      {/* Footer Placeholder */}
      <div className="mt-4 h-3 w-24 mx-auto rounded bg-gray-300 dark:bg-zinc-900" />
    </div>
  );
};

export default HeadingOutlineSkeleton;
