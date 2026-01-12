import { AnimatePresence } from "framer-motion";
import { useBrainStore } from "../../stores/brain-store";
import { useStore } from "../../context/StoreContext";
import { FileText, Folders, Brain, Bookmark } from "lucide-react";
import type { UIStore } from "../../stores/types";

export const ContextSummaryBar = () => {
  const { draft, isBrainActive, isBookmarkActive, toggleBrain, toggleBookmark } = useBrainStore();
  const { openContextSelector } = useStore().ui as UIStore;

  // Build active contexts
  const activeContexts = [
    ...Array.from(draft.collections).map(id => ({ id, label: `Collection ${id}`, type: "collection" })),
    ...Array.from(draft.captures).map(id => ({ id, label: `Capture ${id}`, type: "capture" }))
  ];

  const activeCollections = Array.from(draft.collections).map(id => ({ id, label: `Collection ${id}`, type: "collection" }));
  const activeCaptures = Array.from(draft.captures).map(id => ({ id, label: `Capture ${id}`, type: "capture" }));

  if (draft.brainEnabled) activeContexts.unshift({ id: "brain", label: "Brain", type: "brain" });
  if (draft.bookmarksEnabled) activeContexts.unshift({ id: "bookmark", label: "Bookmarks", type: "bookmark" });

  if (activeContexts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 dark:border-[#1b1b1c]">
    <div className="flex gap-2 min-h-10 overflow-x-auto p-2 opacity-60 rounded-md bg-transparent">
      <AnimatePresence
      >
        <div className="flex items-center gap-3">
          {
            isBrainActive() && <div
              onClick={toggleBrain}
              className="w-8 h-8 grid place-items-center cursor-pointer relative gap-1 bg-[#e7e3e3] dark:bg-[#1e1d1d] p-1 rounded-full hover:opacity-65">
              <Brain size={18} className="text-gray-500 shadow-2xl relative z-40" />
            </div>
          }

          {
            isBookmarkActive() && <div
              onClick={toggleBookmark}
              className="w-8 h-8 grid place-items-center cursor-pointer relative gap-1 bg-[#e7e3e3] dark:bg-[#1e1d1d] p-1 rounded-full hover:opacity-65">
              <Bookmark size={18} className="text-gray-500 shadow-2xl relative z-40" />
            </div>
          }

          {activeCollections.length > 0 &&
            <div
              onClick={() => openContextSelector("collections")}

              className="flex  items-center cursor-pointer relative gap-1 bg-[#e7e3e3] dark:bg-[#1e1d1d] px-2 py-1 rounded-full hover:opacity-65">

              <div
                className="relative flex items-center cursor-pointer over:opacity">
                <Folders size={18} className="text-gray-500 shadow-2xl relative z-40" />
              </div>

              <div className="text-sm font-medium text-black dark:text-white relative -left-0">

                {activeCollections.length}+ Collections

              </div>
            </div>
          }
          {activeCaptures.length > 0 &&
            <div
              onClick={() => openContextSelector("captures")}
              className="flex items-center cursor-pointer relative gap-1 bg-[#e7e3e3] dark:bg-[#1e1d1d] px-2 py-1 rounded-full hover:opacity-65">

              <div

                className="relative flex items-center  over:opacity">
                <FileText size={18} className="text-gray-500 shadow-2xl relative z-40" />
              </div>

              <div className="text-sm font-medium text-black dark:text-white relative -left-0">

                {activeCaptures.length}+ Captures

              </div>
            </div>
          }
        </div>
      </AnimatePresence>
      </div>
    </div>
  );
};
