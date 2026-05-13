// components/context-selector/CollectionsPicker.tsx
import { Check, Folder, Loader2 } from "lucide-react"
import { useBrainStore } from "../../../stores/brain-store"
import { useFolders } from "../../../hooks/useFolders"

export const CollectionsPicker = () => {
  const {
    draft,
    toggleCollection
  } = useBrainStore()

  // Fetch real folders (collections)
  const { data: folders, isLoading } = useFolders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-5 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="flex flex-col p-2 space-y-0.5">
      {folders?.map(folder => {
        const selected = draft.collections.has(folder._id)

        return (
          <button
            key={folder._id}
            onClick={() => toggleCollection(folder._id)}
            className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all group ${
              selected
                ? "bg-blue-50 dark:bg-blue-500/10 text-blue-900 dark:text-blue-100"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
            }`}
          >
            <div className={`shrink-0 transition-colors ${
              selected 
                ? "text-blue-600 dark:text-blue-400" 
                : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
            }`}>
              <Folder size={18} />
            </div>

            <div className="flex-1 flex flex-col min-w-0">
              <span className={`font-medium truncate ${
                selected ? "text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-300"
              }`}>
                {folder.name}
              </span>
              <span className={`text-xs truncate ${
                selected ? "text-blue-600/70 dark:text-blue-300/60" : "text-gray-500"
              }`}>
                {folder.captures?.length || 0} documents
              </span>
            </div>

            {selected && (
              <div className="shrink-0 text-blue-600 dark:text-blue-400">
                <Check size={16} />
              </div>
            )}
          </button>
        )
      })}

      {(!folders || folders.length === 0) && (
          <div className="px-4 py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No collections found</p>
          </div>
      )}
    </div>
  )
}
