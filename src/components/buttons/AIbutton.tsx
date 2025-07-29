import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { RiGeminiFill } from "react-icons/ri";
import { useCaptureContext } from "../../context/CaptureContext";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

interface AIbuttonProps {
  generateCaptureSummary: (captureId: string) => void;
  hasApiKey: boolean;
  loadingSummary: boolean;
  handleOpenChat: () => void;
}

export const AIbuttons: React.FC<AIbuttonProps> = ({
  generateCaptureSummary,
  hasApiKey,
  loadingSummary,
  handleOpenChat,
}) => {
  const { selectedCapture } = useCaptureContext();
  const navigate = useNavigate();

  const handleGenerateSummary = () => {
    if (hasApiKey) {
      generateCaptureSummary?.(selectedCapture?._id || "");
    } else {
      toast.error("Please add an API key to generate summaries.");
      navigate({ to: "/profile" });
      return;
    }
  };

  return (
    <div className="my-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* 🔮 Generate Summary */}
        <motion.button
          onClick={handleGenerateSummary}
          disabled={loadingSummary}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.985 }}
          className={`
    relative z-0 group inline-flex cursor-pointer items-center justify-center gap-1
    px-5 py-2.5 rounded-md text-sm font-medium tracking-tight
    transition-all duration-300 ease-out
     overflow-hidden select-none
    backdrop-blur-md
    ${
      loadingSummary
        ? "bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-400 cursor-wait"
        : "bg-[linear-gradient(to_right,#43a7ff,#31baff,#95c6fb,#328eff)] dark:bg-[linear-gradient(to_right,#161964,#2a30de,#80beff,#1e3a8a)] text-white"
    }
    ${loadingSummary ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
    focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50
    group-hover:shadow-[0_0_10px_#80beff80]
  `}
          aria-busy={loadingSummary}
          aria-label="Generate AI Summary"
        >
          {/* Shimmer streak */}
          <span className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition duration-700 animate-shimmer rounded-xl pointer-events-none z-0" />

          {/* Animated border light streak */}
          <span className="absolute inset-0 rounded-xl border border-transparent group-hover:border-white/10 transition-all duration-500 pointer-events-none z-0" />

          {/* Subtle inner glow */}
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff11,transparent)] rounded-xl pointer-events-none z-0" />

          {/* Optional pulse aura on loading */}
          {loadingSummary && (
            <span className="absolute w-24 h-24 bg-violet-400/10 blur-2xl rounded-full animate-burst z-0" />
          )}

          <Sparkles className="w-4 h-4 z-10" />
          <span className="z-10">
            {loadingSummary
              ? "Synthesizing Summary…"
              : selectedCapture?.ai.summary
              ? "Regenerate Summary"
              : "Generate Summary"}
          </span>
        </motion.button>

        {/* 🧠 Ask AI */}
        <motion.button
          onClick={handleOpenChat}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.985 }}
          className={`
    relative z-0 group inline-flex cursor-pointer items-center justify-center gap-1
    px-5 py-2.5 rounded-md text-sm font-medium tracking-tight
    transition-all duration-300 ease-out select-none overflow-hidden
    text-white backdrop-blur-md
    bg-[linear-gradient(to_right,#72bdff,#8b5cf6,#69aaff)]
    dark:bg-[linear-gradient(to_right,#4b1ea1,#8b5cf6,#4b1ea1)]
    border border-violet-400/20
    focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50
  `}
          aria-label="Ask AI Assistant"
        >
          {/* Soft shimmer sweep */}
          <span className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer rounded-xl pointer-events-none z-0" />

          {/* Optional pulse aura */}
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff0a,transparent)] rounded-xl pointer-events-none z-0" />

          <RiGeminiFill className="w-4 h-4 z-10" />
          <span className="z-10">Ask</span>
        </motion.button>
      </div>
    </div>
  );
};
