import React from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useFolderContext } from "../../context/FolderContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaFolder, FaFolderPlus } from "react-icons/fa6";

const FoldersPanel: React.FC = () => {
  const { folders, loadingStates, setSelectedFolder, setOpenNewFolderForm } = useFolderContext();
  const router = useRouter();


  return (
    <div className="h-full flex flex-col">
      {/* Header - Apple-style with subtle gradient */}
      <div className="sticky top-0 z-10 px-5 py-3 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-medium text-black dark:text-gray-400 tracking-wider uppercase">
            COLLECTIONS
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenNewFolderForm(true)}
            className="p-1.5 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
            aria-label="Create new collection"
          >
            <FaFolderPlus className="text-[16px]" />
          </motion.button>
        </div>
      </div>


      {/* Content */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {loadingStates.fetch ? (
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              className="mb-4 text-gray-500"
            >
              <FaFolder className="text-[24px]" />
            </motion.div>
            <p className="text-[13px] text-gray-500">Loading collections...</p>
          </div>
        ) : folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="p-4 mb-4 rounded-full bg-gray-200 dark:bg-gray-800/50 text-gray-500">
              <FaFolder className="text-[24px]" />
            </div>
            <p className="text-[13px] text-gray-500 mb-4 max-w-[180px]">
              No collections found
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOpenNewFolderForm(true)}
              className="px-4 py-1.5 text-[13px] font-medium rounded bg-blue-500 text-white hover:bg-blue-400 transition-colors"
            >
              New Collection
            </motion.button>
          </div>
        ) : (
          <motion.ul className="space-y-[2px]">
            <AnimatePresence>
              {folders.map((folder) => {
                const isActive = router.state.location.pathname.includes(
                  folder._id
                );
                return (
                  <motion.li
                    key={folder._id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={`/in/collections/${folder._id}`}
                      onClick={() => setSelectedFolder(folder)}
                      className={`relative flex  items-center justify-between px-3 py-2 rounded-[6px] transition-colors ${
                        isActive ? "bg-blue-500/10" : "hover:bg-gray-200 hover:dark:bg-gray-700/30"
                      }`}
                      activeOptions={{ exact: true }}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FaFolder
                          className={`flex-shrink-0 text-[16px] ${
                            isActive ? "text-blue-500" : "text-[#4eff8f]"
                          }`}
                        />
                        <span
                          className={`truncate text-[13px] ${
                            isActive ? "text-black dark:text-white" : "text-black/60 dark:text-gray-300"
                          }`}
                        >
                          {folder.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] px-[6px] py-[2px] rounded-full ${
                            isActive
                              ? "dark:bg-blue-500/20 text-blue-400"
                              : "dark:bg-gray-700/50 text-gray-400"
                          }`}
                        >
                          {folder.captures.length > 0
                            ? folder.captures.length
                            : 0}
                        </span>
                      </div>
                    </Link>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </div>
  );
};

export default FoldersPanel;
