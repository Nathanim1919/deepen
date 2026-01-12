import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText, ExternalLink } from "lucide-react";
import type { MessageSource } from "../../stores/brain-store";

interface MessageSourcesProps {
  sources: MessageSource[];
}

export const MessageSources = ({ sources }: MessageSourcesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Deduplicate sources by docId (keep highest score)
  const uniqueSources = sources.reduce((acc, source) => {
    const existing = acc.find(s => s.docId === source.docId);
    if (!existing || existing.score < source.score) {
      return [...acc.filter(s => s.docId !== source.docId), source];
    }
    return acc;
  }, [] as MessageSource[]);

  if (uniqueSources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-zinc-800/50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-center w-5 h-5 rounded bg-gray-100 dark:bg-zinc-800 group-hover:bg-gray-200 dark:group-hover:bg-zinc-700 transition-colors">
          <FileText className="w-3 h-3" />
        </div>
        <span>{uniqueSources.length} source{uniqueSources.length > 1 ? 's' : ''} used</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      {/* Sources List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-2">
              {uniqueSources.map((source, index) => (
                <motion.div
                  key={`${source.docId}-${index}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group/source"
                >
                  <a
                    href={`/in/captures/${source.docId}`}
                    target="_target" // should open in new tab
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-900/50 hover:bg-gray-100 dark:hover:bg-zinc-800/50 border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 transition-all"
                  >
                    {/* Score Indicator */}
                    <div className="flex-shrink-0 mt-0.5">
                      <div 
                        className="w-1.5 h-8 rounded-full"
                        style={{
                          background: `linear-gradient(to top, 
                            ${source.score > 0.7 ? '#22c55e' : source.score > 0.5 ? '#eab308' : '#94a3b8'} 0%, 
                            ${source.score > 0.7 ? '#4ade80' : source.score > 0.5 ? '#fde047' : '#cbd5e1'} 100%)`
                        }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">
                          Capture
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-zinc-400 font-mono">
                          {Math.round(source.score * 100)}% match
                        </span>
                        <ExternalLink className="w-3 h-3 text-gray-400 dark:text-zinc-500 opacity-0 group-hover/source:opacity-100 transition-opacity" />
                      </div>
                      {source.preview && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-zinc-500 line-clamp-2 leading-relaxed">
                          "{source.preview}"
                        </p>
                      )}
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

