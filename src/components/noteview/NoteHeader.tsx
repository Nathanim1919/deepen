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
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b grid gap-2  border-gray-800"
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
    </motion.div>
  );
};
