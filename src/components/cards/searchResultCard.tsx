import { motion } from "framer-motion";
import type { Capture } from "../../types/Capture";
import { Link } from "@tanstack/react-router";
import { CiCalendarDate } from "react-icons/ci";
import { FiExternalLink } from "react-icons/fi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { Maximize, Shrink, X } from "lucide-react";
import { useState } from "react";

interface SearchResultCardProps {
  captures: Capture[];
  searchTerm: string;
  loading: boolean;
  setSearchTerm: (term: string) => void;
  // toggleBookmark: (id: string) => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  captures,
  searchTerm,
  loading,
  setSearchTerm,
  // toggleBookmark,
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const handleExpandToggle = () => {
    setExpanded((prev) => !prev);
  };

  const className = expanded
  ? "bg-white/5 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] m-auto w-[65%]  h-[90%] backdrop-blur-2xl rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-lg"
  : "bg-white/5 relative -mt-8 backdrop-blur-2xl rounded-2xl overflow-hidden border border-black/10 w-full dark:border-white/10 shadow-lg";

return (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    layout
    transition={{
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
      layout: {
        duration: 0.3,
        ease: [0.34, 1.56, 0.64, 1]
      }
    }}
    className={`${className} z-1000`}
  >
   
      {/* Header */}
      <div className="flex px-4 items-center justify-between border-b border-black/5 dark:border-white/5">
      <div className="px-5 py-3 border-b border-white/5">
        <h3 className="text-sm font-medium dark:text-white/80 text-black/90">
          {loading ? "Searching..." : `Results for "${searchTerm}"`}
        </h3>
        <p className="text-xs dark:text-white/30 text-black/40 mt-0.5">
          {captures.length} knowledge items
        </p>
      </div>
      <div className="flex items-center gap-2 px-4 py-2">
     {expanded?<Shrink 
        className="dark:text-white/30 text-black/30 hover:text-white cursor-pointer"
        size={16}
        onClick={() => {
          handleExpandToggle();
          document.body.style.overflow = ""; // Enable scroll
        }}
     />: <Maximize 
        className="dark:text-white/30 text-black/30 hover:text-white cursor-pointer"
        size={16}
        onClick={() => {
          handleExpandToggle();
        }}
      />}
      <X 
        className="dark:text-white/30 text-black/30 hover:text-white cursor-pointer"
        size={16}
        onClick={() => {
          setSearchTerm("");
        }}
      />
      </div>
      </div>

      {/* Content */}
      <div className={`divide-y dark:divide-white/5 divide-black/5 ${expanded?"":"max-h-[65vh]"} overflow-y-auto`}>
        {loading ? (
          <div className="p-6 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-black/10 dark:border-white/10 border-t-black/30 dark:border-t-white/30 rounded-full animate-spin" />
          </div>
        ) : captures.length > 0 ? (
          captures.map((item) => (
            <motion.div
              key={item._id}
              className="px-5 py-3 transition-colors group hover:bg-white/5"
            >
              <Link to={`/in/captures/${item._id}`} className="block rounded-lg  transition-colors duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {item.metadata.favicon && (
                        <img
                          src={item.metadata.favicon}
                          className="w-3.5 h-3.5 rounded-sm"
                          alt=""
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                      <span className="text-xs dark:text-white/50 text-black/50 truncate">
                        {item.metadata.siteName || "Unknown Source"}
                      </span>
                    </div>
                    <h4 className="dark:text-white/90 text-black text-sm font-medium leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // toggleBookmark(item._id);
                    }}
                    className="ml-2 p-1 dark:text-white/30 text-black/30 hover:text-amber-400 transition-colors"
                    aria-label="Bookmark"
                  >
                    {item.bookmarked ? (
                      <BsBookmarkFill className="text-amber-400" size={14} />
                    ) : (
                      <BsBookmark size={14} />
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs dark:text-white/30 text-black/30 flex items-center gap-1">
                    <CiCalendarDate size={12} />
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <FiExternalLink size={12} className="dark:text-white/30 text-black/30" />
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="p-6 text-center">
            <p className="dark:text-white/50 text-black/50">No results found</p>
            <p className="text-xs dark:text-white/30 text-black/30 mt-1">
              Try different keywords or check your spelling
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
