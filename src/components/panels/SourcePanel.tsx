import React from "react";
import { useSourceContext } from "../../context/sourceContext";
import { Link } from "@tanstack/react-router";
import { MdOutlineLanguage } from "react-icons/md";
import { motion } from "framer-motion";

const SourcePanel: React.FC = () => {
  const { sources, siteNameCounts } = useSourceContext();

  return (
    <div className="h-full flex flex-col">
      {/* Header - Apple-style with subtle gradient */}
      <div className="sticky top-0 z-10 px-5 py-3 border-b border-gray-200 dark:border-zinc-800">
        <h2 className="text-[13px] font-medium text-black dark:text-gray-400 tracking-wider uppercase">
          SOURCES
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {!sources || sources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="p-4 mb-4 rounded-full bg-gray-200 dark:bg-gray-800/50 text-gray-500">
              <MdOutlineLanguage className="text-[24px]" />
            </div>
            <p className="text-[13px] text-gray-500">No sources found</p>
          </div>
        ) : (
          <motion.ul className="space-y-[2px]">
            {sources.map((source: string) => (
              <motion.li
                key={source}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={`/in/sources/${source}`}
                  className="relative flex items-center justify-between px-2 py-2.5 rounded-[6px] hover:bg-gray-300/30 hover:dark:bg-gray-700/30 transition-colors group"
                  activeOptions={{ exact: true }}
                  activeProps={{
                    className: "bg-blue-500/10",
                  }}
                >
                  <div className="flex items-center gap-1 overflow-hidden">
                    <MdOutlineLanguage className="flex-shrink-0 text-blue-500" />
                    <span className="truncate text-[15px] text-black/60 font-bold dark:text-gray-300 group-[.active]:text-white">
                      {source.length > 25
                        ? `${source.slice(0, 25)}...`
                        : source}
                    </span>
                  </div>

                  {siteNameCounts[source] !== undefined && (
                    <span className="text-[13px] px-[6px] py-[2px] rounded-full dark:bg-gray-700/50 text-black/60 font-bold dark:text-gray-400 group-[.active]:bg-blue-500/20 group-[.active]:text-blue-400">
                      {siteNameCounts[source]}
                    </span>
                  )}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
};

export default SourcePanel;
