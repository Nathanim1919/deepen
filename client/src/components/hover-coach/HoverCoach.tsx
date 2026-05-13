import { motion, AnimatePresence } from "framer-motion"
import { useUIStore } from "../../stores/ui-store"

export const HoverCoach = () => {
  const {
    hoverCoachVisible,
    hoverCoachMode,
    hoverCoachAnchor,
    contextSelectorOpen
  } = useUIStore()

  if (
    !hoverCoachVisible ||
    !hoverCoachMode ||
    !hoverCoachAnchor ||
    contextSelectorOpen
  ) {
    return null
  }

  const style: React.CSSProperties = {
    position: "fixed",
    top: hoverCoachAnchor.bottom + 10,
    left: hoverCoachAnchor.left + (hoverCoachAnchor.width / 2),
    transform: "translateX(-50%)",
    zIndex: 100
  }

  return (
    <AnimatePresence>
      <motion.div
        style={style}
        initial={{ opacity: 0, y: -4, scale: 0.96, x: "-50%" }}
        animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
        exit={{ opacity: 0, scale: 0.98, x: "-50%" }}
        transition={{
          duration: 0.2,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="pointer-events-none"
      >
        <div className="relative flex flex-col items-center">
            {/* Arrow pointing up */}
            <div className="w-3 h-3 bg-white dark:bg-[#1c1c1e] rotate-45 border-t border-l border-gray-200 dark:border-white/10 -mb-1.5 z-0 shadow-sm" />

            {/* Main Card */}
            <div className="relative z-10 w-64 p-4 rounded-xl bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl shadow-xl shadow-black/10 dark:shadow-black/40 border border-gray-200 dark:border-white/10 text-left">
                {hoverCoachMode === "brain" && (
                    <div className="space-y-1.5">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                            Full Knowledge Base
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">
                            Enable AI to recall and synthesize information from your entire memory bank.
                        </p>
                    </div>
                )}

                {hoverCoachMode === "collections" && (
                    <div className="space-y-1.5">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                            Focused Collections
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">
                            Restrict context to specific project folders or curated groups of documents.
                        </p>
                    </div>
                )}

                {hoverCoachMode === "bookmarks" && (
                    <div className="space-y-1.5">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                            Saved Bookmarks
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">
                            Include all your bookmarked URLs and quick saves in the conversation context.
                        </p>
                    </div>
                )}

                {hoverCoachMode === "captures" && (
                    <div className="space-y-1.5">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                            Specific Items
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">
                            Pin individual notes, PDFs, or web captures to discuss them in detail.
                        </p>
                    </div>
                )}
            </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
