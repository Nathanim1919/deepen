import { useState, useRef, useCallback } from "react";
import { FiX, FiUpload, FiFile, FiType } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CaptureService } from "../../api/capture.api";
import { useNavigate } from "@tanstack/react-router";

type Tab = "upload" | "paste";

const ACCEPTED_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "text/plain": "TXT",
};

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export const AddCaptureModal: React.FC<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const validateFile = (f: File): boolean => {
    if (!Object.keys(ACCEPTED_TYPES).includes(f.type)) {
      toast.error("Unsupported file type. Please upload a PDF or TXT file.");
      return false;
    }
    if (f.size > MAX_FILE_SIZE) {
      toast.error("File too large. Maximum size is 20MB.");
      return false;
    }
    return true;
  };

  const handleFileSelect = (f: File) => {
    if (validateFile(f)) setFile(f);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const canSubmit =
    activeTab === "upload" ? !!file : pastedText.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await CaptureService.uploadCapture(
        activeTab === "upload"
          ? { file: file! }
          : { pastedText: pastedText.trim() }
      );
      closeModal();
      toast.success("Capture added");
      navigate({
        to: "/in/captures/$captureId",
        params: { captureId: result.captureId },
      });
    } catch {
      toast.error("Failed to add capture");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 dark:bg-black/60 z-1000 flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <motion.div
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-white dark:bg-[#121214]/95 dark:backdrop-blur-2xl rounded-2xl border border-gray-200 dark:border-white/[0.06] shadow-2xl shadow-black/10 dark:shadow-black/40 w-full max-w-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--stellar-purple-300)]/40 to-transparent" />

        {/* Header */}
        <div className="flex justify-between items-start px-8 pt-7 pb-1">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7] tracking-tight" style={{ fontFamily: "var(--grotesk)" }}>
              Add to your knowledge
            </h2>
            <p className="text-[13px] text-gray-500 dark:text-[var(--stellar-gray-400)] mt-1">
              Upload a file or paste text to capture into your brain
            </p>
          </div>
          <button
            onClick={closeModal}
            className="mt-1 text-gray-400 dark:text-[var(--stellar-gray-400)] hover:text-gray-600 dark:hover:text-white cursor-pointer rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors duration-150"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div className="px-8 pb-7 pt-5">
          {/* Tabs */}
          <div className="relative flex mb-6">
            {/* Track */}
            <div className="absolute inset-0 bg-gray-100 dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.04]" />
            {/* Sliding pill */}
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-white dark:bg-white/[0.08] border border-gray-200 dark:border-white/[0.06] shadow-sm transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                transform: activeTab === "upload" ? "translateX(4px)" : "translateX(calc(100% + 4px))",
              }}
            />
            {([
              { key: "upload" as Tab, label: "Upload File", icon: <FiUpload className="w-3.5 h-3.5" /> },
              { key: "paste" as Tab, label: "Paste Text", icon: <FiType className="w-3.5 h-3.5" /> },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold cursor-pointer transition-colors duration-150 ${
                  activeTab === tab.key
                    ? "text-gray-900 dark:text-[#f5f5f7]"
                    : "text-gray-400 dark:text-[var(--stellar-gray-400)] hover:text-gray-600 dark:hover:text-[var(--stellar-gray-300)]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="mb-6">
            {activeTab === "upload" ? (
              <>
                {!file ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 group border ${
                      isDragging
                        ? "border-[var(--neon-blue-400)] bg-blue-50 dark:bg-[var(--neon-blue-400)]/[0.04]"
                        : "border-dashed border-gray-300 dark:border-white/[0.06] hover:border-[var(--stellar-purple-300)] dark:hover:border-[var(--stellar-purple-300)]/30 bg-gray-50/50 dark:bg-white/[0.015] hover:bg-purple-50/50 dark:hover:bg-white/[0.025]"
                    }`}
                  >
                    {/* Subtle corner glow on hover (dark only) */}
                    <div className="hidden dark:block absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,var(--stellar-purple-300)_0%,transparent_60%)] mix-blend-soft-light" />

                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 border transition-all duration-200 ${
                      isDragging
                        ? "bg-blue-100 dark:bg-[var(--neon-blue-400)]/10 border-blue-300 dark:border-[var(--neon-blue-400)]/20"
                        : "bg-gray-100 dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.06] group-hover:border-[var(--stellar-purple-300)] dark:group-hover:border-[var(--stellar-purple-300)]/30 group-hover:bg-purple-50 dark:group-hover:bg-[var(--stellar-purple-900)]/20"
                    }`}>
                      <FiUpload className={`w-6 h-6 transition-colors duration-200 ${
                        isDragging ? "text-[var(--neon-blue-400)]" : "text-gray-400 dark:text-[var(--stellar-gray-400)] group-hover:text-[var(--stellar-purple-300)]"
                      }`} />
                    </div>

                    <p className="text-sm font-medium text-gray-700 dark:text-[var(--stellar-gray-300)] mb-1">
                      {isDragging ? "Drop it right here" : "Drag and drop your file"}
                    </p>
                    <p className="text-[13px] text-gray-500 dark:text-[var(--stellar-gray-400)] mb-5">
                      or <span className="text-[var(--neon-blue-400)]">browse from your computer</span>
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-500/[0.08] text-red-500 dark:text-red-400/80 text-[11px] font-semibold border border-red-200 dark:border-red-500/10 tracking-wide">
                        PDF
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/[0.08] text-blue-500 dark:text-blue-400/80 text-[11px] font-semibold border border-blue-200 dark:border-blue-500/10 tracking-wide">
                        TXT
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-[var(--stellar-gray-400)] ml-1">up to 20 MB</span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.txt,application/pdf,text/plain"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileSelect(f);
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06]">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 dark:bg-[var(--neon-blue-400)]/[0.08] border border-blue-200 dark:border-[var(--neon-blue-400)]/15">
                      <FiFile className="w-5 h-5 text-blue-500 dark:text-[var(--neon-blue-400)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-[#f5f5f7] truncate">
                        {file.name}
                      </p>
                      <p className="text-[12px] text-gray-500 dark:text-[var(--stellar-gray-400)] mt-0.5">
                        {formatFileSize(file.size)} &middot; {ACCEPTED_TYPES[file.type] || "File"}
                      </p>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="p-1.5 rounded-lg text-gray-400 dark:text-[var(--stellar-gray-400)] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer transition-colors duration-150"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your content here... Articles, notes, research, anything you want to remember."
                  rows={9}
                  autoFocus
                  className="w-full bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl px-5 py-4 text-gray-900 dark:text-[#f5f5f7] focus:outline-none focus:border-[var(--stellar-purple-300)] dark:focus:border-[var(--stellar-purple-300)]/30 focus:ring-1 focus:ring-[var(--stellar-purple-300)]/30 dark:focus:ring-[var(--stellar-purple-300)]/20 transition-all duration-150 placeholder-gray-400 dark:placeholder-[var(--stellar-gray-400)] resize-none text-sm leading-relaxed"
                  style={{ fontFamily: "var(--grotesk)" }}
                />
                <div className="flex justify-between items-center mt-2 px-1">
                  <p className="text-[11px] text-gray-400 dark:text-[var(--stellar-gray-400)]">
                    Articles, notes, or any text you want in your brain
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-[var(--stellar-gray-400)] tabular-nums">
                    {pastedText.length.toLocaleString()} chars
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className={`group relative flex-[2] py-3 rounded-xl font-semibold text-[13px] cursor-pointer overflow-hidden transition-all duration-200 ${
                !canSubmit || isSubmitting
                  ? "bg-gray-100 dark:bg-white/[0.04] text-gray-400 dark:text-[var(--stellar-gray-400)]/50 cursor-not-allowed border border-gray-200 dark:border-white/[0.04]"
                  : "text-white active:scale-[0.98]"
              }`}
              style={
                canSubmit && !isSubmitting
                  ? { background: "linear-gradient(to right, #43a7ff, #31baff, #328eff, #2a30de)", backgroundSize: "200% 100%" }
                  : undefined
              }
            >
              {/* Shimmer overlay */}
              {canSubmit && !isSubmitting && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.1),transparent)] animate-gradient-shift" />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add to Brain"
                )}
              </span>
            </button>
            <button
              onClick={closeModal}
              className="flex-1 py-3 bg-gray-100 dark:bg-white/[0.04] hover:bg-gray-200 dark:hover:bg-white/[0.06] text-gray-600 dark:text-[var(--stellar-gray-400)] border border-gray-200 dark:border-white/[0.04] hover:border-gray-300 dark:hover:border-white/[0.08] rounded-xl font-semibold text-[13px] cursor-pointer transition-all duration-150 active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
