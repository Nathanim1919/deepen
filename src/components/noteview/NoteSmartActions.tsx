import React, { useState } from "react";
import {
  Sparkles,
  Wand2,
  AlarmClock,
  HelpCircle,
  Layers,
} from "lucide-react";
import clsx from "clsx";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useUI } from "../../context/UIContext";


type Action = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  content: string;
};

export const NoteActionBar = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const {openActionBar, setOpenActionBar} = useUI();

  const actions: Action[] = [
    {
      icon: <Sparkles className="w-4 h-4" />,
      label: "Summarize",
      content: "Welcome to Summarizer",
      onClick: () => {},
    },
    {
      icon: <AlarmClock className="w-4 h-4" />,
      label: "Remind Me Later",
      content: "Set a reminder for this note",
      onClick: () => {},
    },
    {
      icon: <HelpCircle className="w-4 h-4" />,
      label: "Ask a Question",
      content: "Ask something about this content",
      onClick: () => {},
    },
    {
      icon: <Layers className="w-4 h-4" />,
      label: "Cluster with Others",
      content: "Grouping this with related notes...",
      onClick: () => {},
    },
    {
      icon: <Wand2 className="w-4 h-4" />,
      label: "Related captures",
      content: "Discover related notes and ideas",
      onClick: () => {},
    },
  ];

  return (
    <div
      className={clsx(
        "fixed right-0 top-0 z-999 h-full border-l border-gray-800 transition-all duration-300 flex mt-12",
        (activeIndex === null && openActionBar) ? "w-14" : activeIndex !== null ? "w-96" : "w-0",
      )}
    >
      {/* Icon Sidebar */}
      <div className="flex flex-col bg-[#1b1919] h-full items-center p-2 gap-2 w-14">
        {actions.map((action, i) => (
          <div key={i} className="relative flex items-center">
            <button
              onClick={() => setActiveIndex(i === activeIndex ? null : i)}
              className={clsx(
                "flex items-center cursor-pointer peer justify-center p-2 rounded-md transition",
                i === activeIndex
                  ? "text-violet-500 bg-zinc-800"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              {action.icon}
            </button>

            {/* Tooltip */}
            {activeIndex !== i && (
              <div className="absolute right-full mr-2 opacity-0 peer-hover:opacity-100 transition transform translate-y-1/2 bg-zinc-800 text-white text-xs rounded-sm px-2 py-2 whitespace-nowrap">
                {action.label}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Content Panel */}
      {activeIndex !== null && (
        <div className="bg-zinc-900 text-white flex-1 p-4 border-l border-zinc-800">
          <button
            className="absolute cursor-pointer top-4 right-4 text-zinc-400 hover:text-white"
            onClick={() => {setActiveIndex(null); setOpenActionBar?.(false);}}
          >
            <MdKeyboardDoubleArrowRight className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold mb-2 text-violet-400">
            {actions[activeIndex].label}
          </h2>
          <p className="text-sm text-zinc-300">
            {actions[activeIndex].content}
          </p>
        </div>
      )}
    </div>
  );
};
