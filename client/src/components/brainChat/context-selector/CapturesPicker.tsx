// components/context-selector/CapturesPicker.tsx
import { Check, FileText, Globe, Image as ImageIcon, StickyNote, Loader2 } from "lucide-react"
import { useBrainStore } from "../../../stores/brain-store"
import { useCaptures } from "../../../hooks/useCaptures"

const iconForType = (type: string | undefined, isSelected: boolean) => {
  // Use consistent blue for selection, neutral gray for unselected
  const baseClass = isSelected 
    ? "text-blue-600 dark:text-blue-400" 
    : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400";
  
  // Normalize type
  const normalizedType = type?.toLowerCase() || "web";

  if (normalizedType.includes("pdf")) return <FileText size={18} className={baseClass} />
  if (normalizedType.includes("note")) return <StickyNote size={18} className={baseClass} />
  if (normalizedType.includes("image")) return <ImageIcon size={18} className={baseClass} />
  
  // Default to web/globe
  return <Globe size={18} className={baseClass} />
}

export const CapturesPicker = () => {
  const {
    draft,
    toggleCapture
  } = useBrainStore()

  // Fetch real captures
  const { data: captures, isLoading } = useCaptures("all");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-5 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="flex flex-col p-2 space-y-0.5">
      {captures?.map(capture => {
        // Use capture.id or capture._id
        const captureId = capture.id || capture._id;
        const selected = draft.captures.has(captureId)

        return (
          <button
            key={captureId}
            onClick={() => toggleCapture(captureId)}
            className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all group ${
              selected
                ? "bg-blue-50 dark:bg-blue-500/10 text-blue-900 dark:text-blue-100"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
            }`}
          >
            <div className="shrink-0 transition-colors">
              {iconForType(capture.metadata?.type, selected)}
            </div>
            
            <div className="flex-1 flex flex-col min-w-0">
                <span className={`truncate font-medium ${selected ? "text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-300"}`}>
                {capture.title || "Untitled Capture"}
                </span>
                {/* Optional: Show date or other metadata if desired */}
            </div>

            {selected && (
              <div className="shrink-0 text-blue-600 dark:text-blue-400">
                <Check size={16} />
              </div>
            )}
          </button>
        )
      })}
      
      {(!captures || captures.length === 0) && (
          <div className="px-4 py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No captures found</p>
          </div>
      )}
    </div>
  )
}
