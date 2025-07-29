import { Link, useParams } from "@tanstack/react-router";
import { FaHashtag } from "react-icons/fa";
import NotesList from "./NotesList";
import { FiChevronRight } from "react-icons/fi";

export const SourceNotes = () => {
  const { sourceId } = useParams({ strict: false });

  return (
    <div>
      <div className="flex items-center px-4 py-3 rounded-t-lg border-b border-gray-200 dark:border-gray-900">
        <div className="text-green-400 rounded-full flex items-center gap-1 py-1 px-2">
        <Link
         to={'/in/sources'}
         className="text-sm hover:underline font-medium hover:opacity-64 text-black/70 dark:text-gray-300 flex items-center">
          <FaHashtag className="text-purple-400" />
          Source
        </Link>
         <FiChevronRight className="text-gray-400 dark:text-gray-500/70 flex-shrink-0" />
        <span className="text-sm font-bold flex items-center">
          <FaHashtag className="text-xs" />
          {sourceId && sourceId.length > 15
            ? sourceId.slice(0, 15) + "..."
            : sourceId}{" "}
        </span>
        </div>
      </div>
      <NotesList filter="source" sourceId={sourceId} />
    </div>
  );
};