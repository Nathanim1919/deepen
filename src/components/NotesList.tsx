import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useCaptureContext } from "../context/CaptureContext";
import { TbCaptureFilled } from "react-icons/tb";
import { CiBookmark, CiStickyNote } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { NoteListSkeleton } from "./skeleton/NoteSkeleton";
import { IoDocumentsOutline } from "react-icons/io5";
import { FileText, Trash } from "lucide-react";
import { useUI } from "../context/UIContext";

interface NotesListProps {
  filter?: "all" | "bookmarks" | "folder" | "source";
  folderId?: string;
  sourceId?: string;
}

const filterLabels = {
  all: "All Captures",
  bookmarks: "Bookmarks",
} as const;

const filterIcons = {
  all: <TbCaptureFilled className="text-blue-400" />,
  bookmarks: <CiBookmark className="text-amber-400" />,
} as const;

function useIsSmallScreen(breakpoint = 640) {
  const [isSmall, setIsSmall] = useState(() => window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsSmall(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isSmall;
}

const NotesList: React.FC<NotesListProps> = ({
  filter = "all",
  folderId,
  sourceId,
}) => {
  const { captures, fetchCaptures, bookmarkCapture, deleteCapture } =
    useCaptureContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setMiddlePanelCollapsed, setCollapsed } = useUI();

  const location = useLocation();
  const activeCaptureId = location.pathname.split("/").pop();
  const targetId = folderId || sourceId || null;
  const isSmallScreen = useIsSmallScreen();

  const handleCaptureClick = () => {
    if (isSmallScreen) {
      setMiddlePanelCollapsed(true);
      setCollapsed(true);
    }
  };

  useEffect(() => {
    const loadCaptures = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchCaptures(filter, targetId);
      } catch (err) {
        console.error("Error loading notes:", err);
        setError("Could not load notes.");
      } finally {
        setLoading(false);
      }
    };
    loadCaptures();
  }, [filter, targetId, fetchCaptures]);

  const safeCaptures = useMemo(() => {
    if (!Array.isArray(captures)) return [];

    return captures.map((note) => {
      const timestamp = new Date(note.metadata.capturedAt);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      return {
        ...note,
        _id: note._id.toString(),
        title: note?.title || "Untitled Capture",
        description: note.metadata?.description || "",
        timeAgo:
          days > 0
            ? `${days}d`
            : hours > 0
            ? `${hours}h`
            : minutes > 0
            ? `${minutes}m`
            : `${seconds}s`,
      };
    });
  }, [captures]);

  const buildLink = (id: string) => {
    if (filter === "folder" && folderId)
      return `/in/collections/${folderId}/captures/${id}`;
    if (filter === "source" && sourceId)
      return `/in/sources/${sourceId}/captures/${id}`;
    if (filter === "bookmarks") return `/in/bookmarks/captures/${id}`;
    return `/in/captures/${id}`;
  };

  const shouldShowHeader = filter === "all" || filter === "bookmarks";

  if (loading) return <NoteListSkeleton />;
  if (error) return <div className="text-red-400 p-4 text-sm">{error}</div>;
  if (!safeCaptures.length)
    return (
      <div className="flex relative flex-col items-center justify-center h-full text-center px-4">
        <div className="p-4 mb-4 rounded-full bg-gray-200 dark:bg-gray-800/50 text-gray-500">
          <IoDocumentsOutline className="text-[24px]" />
        </div>
        <p className="text-[13px] text-gray-500">No captures found</p>
      </div>
    );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {shouldShowHeader && (
        <div className="px-3 py-3  border-b border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center gap-2">
            {filterIcons[filter]}
            <h3 className="text-sm font-medium text-[#000] dark:text-gray-300">
              {filterLabels[filter]}
            </h3>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2">
        <AnimatePresence>
          {safeCaptures.map((note) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                onClick={handleCaptureClick}
                to={buildLink(note._id)}
                className={`block rounded-lg p-3 transition-all duration-200 ${
                  activeCaptureId === note._id
                    ? "bg-gray-800/50 border-l-2 border-blue-400"
                    : "hover:dark:bg-gray-800/30 hover:bg-gray-200/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {note.metadata.isPdf ? (
                        <FileText
                          className={`flex-shrink-0 text-red-700`}
                          size={16}
                        />
                      ) : (
                        <CiStickyNote
                          className={`flex-shrink-0 ${
                            activeCaptureId === note._id
                              ? "text-blue-400"
                              : "text-gray-500"
                          }`}
                        />
                      )}
                      <h3 className="text-sm font-medium truncate text-[#000] dark:text-gray-300">
                        {note.title}
                      </h3>
                    </div>

                    {note.metadata.favicon && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <img
                          src={note.metadata.favicon}
                          className="w-3 h-3 rounded-sm"
                          alt=""
                        />
                        <span className="text-xs text-gray-500 truncate">
                          {note.metadata.siteName || "Unknown Source"}
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {note.description ||
                        note.ai?.summary?.slice(0, 100) + "..."}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      bookmarkCapture?.(note._id);
                    }}
                    className={`ml-2 cursor-pointer hover:text-amber-400 p-1 rounded-md transition-colors ${
                      note.bookmarked
                        ? "text-amber-400 hover:bg-amber-900/20"
                        : "text-gray-500 hover:bg-gray-700/50 hover:text-gray-300"
                    }`}
                  >
                    <CiBookmark
                      className={`w-4 h-4 transition-transform ${
                        note.bookmarked ? "scale-110" : ""
                      }`}
                    />
                  </button>
                </div>
                <div className="flex w-full items-center justify-between p-1 gap-1 text-xs text-gray-500">
                  <span className="text-xs text-gray-500">{note.timeAgo}</span>
                  <Trash
                    size={16}
                    className="text-gray-800 hover:text-gray-500 cursor-pointer"
                    onClick={() => deleteCapture(note._id)}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotesList;
