import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import { FolderService } from "../../api/folder.api";
import { useFolderContext } from "../../context/FolderContext";
import { toast } from "sonner";

interface NewFolderFormCardProps {
  open: boolean;
  onClose: () => void;
}

export const NewFolderFormCard = ({
  open,
  onClose,
}: NewFolderFormCardProps) => {
  const [folderName, setFolderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setFolders } = useFolderContext();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleFolderCreation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!folderName.trim()) {
      toast.warning("Please enter a collection name");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await FolderService.create(folderName);

      // Update to success state
      toast.success("Collection created successfully");

      setFolders((prev) => [...prev, res]);
      setFolderName("");
      onClose();
    } catch (error) {
      console.error("Folder creation failed:", error);

      // Update to error state
      toast.error("Failed to create collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-1000 flex items-center justify-center backdrop-blur-sm p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/10 dark:bg-black/20"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: "spring", damping: 28, stiffness: 400 }}
          className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white dark:bg-[#131313] backdrop-blur-xl p-6 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-black dark:text-white tracking-tight">
              New Collection
            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="dark:text-gray-400 text-gray-600 cursor-pointer hover:text-white p-1 rounded-full transition-colors hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Organize your ideas with a new collection.
          </p>

          {/* Form */}
          <form onSubmit={handleFolderCreation} className="space-y-6">
            <div>
              <label
                htmlFor="folderName"
                className="block text-sm text-gray-700 dark:text-gray-300 mb-2"
              >
                Collection Name
              </label>
              <input
                id="folderName"
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/10 dark:bg-white/10 border border-white/10 text-black  dark:text-white placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g. Programming"
                required
                maxLength={50}
              />
              <p className="text-xs text-gray-500 text-right mt-1">
                {folderName.length}/50
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 cursor-pointer py-2 text-sm text-gray-400 hover:text-white rounded-lg transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !folderName.trim()}
                className={`px-5 cursor-pointer py-2 text-sm font-medium rounded-lg transition shadow ${
                  isSubmitting || !folderName.trim()
                    ? "bg-blue-600/40 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <VscLoading className="inline mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Collection"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
