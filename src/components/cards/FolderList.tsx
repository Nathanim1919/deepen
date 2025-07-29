import { motion, AnimatePresence } from "framer-motion";
import { useFolderContext } from "../../context/FolderContext";
import { FaFolder, FaFolderPlus } from "react-icons/fa";
import { useUI } from "../../context/UIContext";
import { useCaptureContext } from "../../context/CaptureContext";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { RiFolderAddLine } from "react-icons/ri";

export const FolderList: React.FC = () => {
  const { folders, loadingStates, addCaptureToFolder, setOpenNewFolderForm } =
    useFolderContext();
  const { isFolderListOpen, setIsFolderListOpen } = useUI();
  const { selectedCapture } = useCaptureContext();
  const [appendToFolderId, setAppendToFolderId] = useState<string | null>(null);

  const setCaptureFolder = async (folderId: string) => {
    if (!selectedCapture) return;
      setAppendToFolderId(folderId);
      await addCaptureToFolder(folderId, selectedCapture._id)
      setIsFolderListOpen?.(false);

      setAppendToFolderId(null);
  };

  return (
    <AnimatePresence>
      {isFolderListOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-start justify-end p-4 pt-13"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsFolderListOpen?.(false)}
        >
          <motion.div
            className="flex flex-col w-72 bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-400 dark:border-[#262626] shadow-2xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with subtle gradient */}
            <div className="p-4 border-b border-gray-200 dark:border-[#292828] bg-gradient-to-b dark:from-[#1e1e1e] dark:to-[#1a1a1a]">
              <h3 className="font-medium text-[15px] text-black dark:text-gray-200 flex items-center gap-2">
                <RiFolderAddLine className="text-blue-500" />
                <span>Add to Collection</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {selectedCapture?.title
                  ? `"${selectedCapture.title}"`
                  : "Selected item"}
              </p>
            </div>

            {/* Loading state */}
            {loadingStates.fetch ? (
              <motion.div
                className="flex items-center justify-center p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <CgSpinnerTwoAlt className="text-gray-500 w-5 h-5" />
                </motion.div>
              </motion.div>
            ) : folders.length === 0 ? (
              <motion.div
                className="p-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="mx-auto w-10 h-10 rounded-full bg-[#2e2e2e] flex items-center justify-center mb-3">
                  <FaFolder className="text-gray-500" />
                </div>
                <p className="text-sm text-gray-500">
                  No collections available
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Create one to get started
                </p>
              </motion.div>
            ) : (
              <motion.ul
                className="divide-y max-h-[400px] overflow-y-auto divide-[#2a2a2a]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {folders.map((folder, index) => (
                  <motion.li
                    key={folder._id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: index * 0.03,
                        type: "spring",
                        stiffness: 300,
                      },
                    }}
                    whileTap={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    className="px-4 py-2 cursor-pointer active:bg-[#2a2a2a] transition-colors  hover:bg-gray-100 hover:dark:bg-[#212121]"
                    onClick={() => setCaptureFolder(folder._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {loadingStates.append &&
                        appendToFolderId === folder._id ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="flex-shrink-0"
                          >
                            <CgSpinnerTwoAlt className="text-blue-500 w-4 h-4" />
                          </motion.div>
                        ) : (
                          <FaFolder className="text-blue-500/90 flex-shrink-0" />
                        )}
                        <span className="text-sm text-black/60 dark:text-gray-200 truncate">
                          {folder.name.length > 20
                            ? `${folder.name.slice(0, 20)}...`
                            : folder.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 dark:bg-[#2e2e2e] px-2 py-1 rounded-full">
                          {folder.captures.length}
                        </span>
                        <FiChevronRight className="text-gray-500 w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}

            {/* Footer */}
            <motion.div
              className="p-3 flex justify-between items-center border-t border-gray-200 dark:border-[#2e2e2e] dark:bg-[#1a1a1a]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs text-gray-500 text-center">
                {folders.length}{" "}
                {folders.length === 1 ? "collection" : "collections"}
              </p>
              <button
                onClick={() => {
                  setOpenNewFolderForm(true);
                  setIsFolderListOpen?.(false);
                }}
                className="cursor-pointer text-black dark:text-gray-500 hover:text-violet-500"
              >
                <FaFolderPlus />
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
