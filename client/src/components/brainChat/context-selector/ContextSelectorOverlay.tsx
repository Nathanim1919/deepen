// components/context-selector/ContextSelectorOverlay.tsx
import { X } from "lucide-react"
import { useUIStore } from "../../../stores/ui-store"
import { CollectionsPicker } from "./CollectionsPicker"
import { CapturesPicker } from "./CapturesPicker"
import { ModelsPicker } from "./ModelsPicker"

export const ContextSelectorOverlay = () => {
  const {
    contextSelectorOpen,
    contextSelectorMode,
    closeContextSelector
  } = useUIStore()

  if (!contextSelectorOpen || !contextSelectorMode) return null

  // Get display title for header
  const getTitle = () => {
    if (contextSelectorMode === "models-default") return "Select Default Model"
    return contextSelectorMode
  }

  return (
    <div
      className="fixed inset-0 z-1500 flex items-center justify-center bg-black/10 backdrop-blur-sm"
      onClick={closeContextSelector}
    >
      <div
        className="w-[80%] md:w-[60%] max-w-md overflow-hidden rounded-xl bg-[#faf7f7]/50 dark:bg-[#141416]/50 shadow-sm dark:shadow-2xl backdrop-blur-xl border border-gray-100 dark:border-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 px-5 py-4 bg-white dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 capitalize">
            {getTitle()}
          </h2>
          <button
            onClick={closeContextSelector}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto bg-white dark:bg-zinc-900 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-800">
          {contextSelectorMode === "collections" && <CollectionsPicker />}
          {contextSelectorMode === "models" && <ModelsPicker onSelect={closeContextSelector} />}
          {contextSelectorMode === "models-default" && <ModelsPicker mode="default" onSelect={closeContextSelector} />}
          {contextSelectorMode === "captures" && <CapturesPicker />}
        </div>
      </div>
    </div>
  )
}
