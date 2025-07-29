import React, { useRef, useState, useEffect } from "react";
import Linkify from "react-linkify";
import { useUI } from "../../context/UIContext";
import { AnimatePresence, motion } from "framer-motion";
import { CiStickyNote } from "react-icons/ci";

type NoteMainTextProps = {
  text: string;
};

export const NoteMainText: React.FC<NoteMainTextProps> = ({ text }) => {
  const { mainContentCollapsed, setMainContentCollapsed } = useUI();
  const contentRef = useRef<HTMLDivElement>(null);
  const [showToggle, setShowToggle] = useState(false);

  const formatted = text
    .split("\n")
    .map(p => p.trim())
    .filter(Boolean);

  useEffect(() => {
    if (contentRef.current && contentRef.current.scrollHeight > 500) {
      setShowToggle(true);
    }
  }, [text]);

  return (
    <div className="relative mt-4 w-full dark:prose-invert">
      <h2 className="text-xl flex items-center gap-1 font-semibold mb-3 text-white/90"><CiStickyNote className="text-amber-500 dark:text-amber-400" />
       Captured Content</h2>

      <motion.div
        animate={{ maxHeight: mainContentCollapsed ? 300 : 9999 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden relative transition-all duration-300"
        ref={contentRef}
      >
        <Linkify
          componentDecorator={(href, text, key) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline transition-colors"
            >
              {text}
            </a>
          )}
        >
          {formatted.map((para, idx) => (
            <p
              key={idx}
              className="mb-4 text-sm leading-[1.75rem] tracking-wide text-neutral-200"
            >
              {para}
            </p>
          ))}
        </Linkify>

        {mainContentCollapsed && (
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#1d1f1d] to-transparent pointer-events-none" />
        )}
      </motion.div>

      <AnimatePresence>
        {showToggle && (
          <motion.button
            onClick={() => setMainContentCollapsed(!mainContentCollapsed)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 px-4 py-1 text-sm text-white/70 bg-zinc-800 hover:bg-zinc-700 rounded-lg mx-auto block transition-all"
          >
            {mainContentCollapsed ? "Show more ↓" : "Show less ↑"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
