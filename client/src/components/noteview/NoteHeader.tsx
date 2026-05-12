import React from "react";
import { motion } from "framer-motion";

type NoteHeaderProps = {
  title: string;
  collection: {
    id: string;
    name: string;
  };
  isPdf?: boolean;
  description?: string | RegExpMatchArray | null;
  tags?: string[];
  capturedAt?: string;
  url?: string; // Added URL prop
};

export const NoteHeader: React.FC<NoteHeaderProps> = ({
  title,
  description = "",
  url = "",
  tags = [],
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b grid gap-2 border-gray-200  dark:border-gray-800"
    >
      <div className="flex flex-col overflow-hidden">
        <h1 className="md:text-2xl flex gap-2 text-left font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h1>

        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Visit Original Source
          </a>
        ) : (
          "No URL provided"
        )}
      </div>
      {description && (
        <p className="text-gray-700 dark:text-gray-400 mt-1 text-sm">
          {description}
        </p>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};
