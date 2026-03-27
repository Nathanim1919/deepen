import { motion } from "framer-motion";
import { Chrome, Bell } from "lucide-react";
import { useState, useEffect } from "react";

export const TemporaryAccessGuard = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenTemporaryGuard");
    if (!hasSeen) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("hasSeenTemporaryGuard", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 dark:bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
        className="max-w-md w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#222] rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#333] flex items-center justify-center shrink-0 mt-0.5">
              <Chrome className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-[#ededed]">
                Welcome to Deepen
              </h2>
              <p className="text-sm text-gray-500 dark:text-[#a1a1a1] mt-1 leading-relaxed">
                We're thrilled to have you here. Currently, our Chrome Extension is undergoing final review and hasn't been deployed to the web store yet.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-lg p-3.5 ml-14">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-[#ededed]">
              <Bell className="w-4 h-4 text-gray-500 dark:text-[#a1a1a1]" />
              You're on the priority list
            </div>
            <p className="text-xs text-gray-500 dark:text-[#a1a1a1] mt-1.5 leading-relaxed">
              We'll notify you the moment it goes live so you can start capturing knowledge instantly.
            </p>
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm"
            >
              Explore Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

