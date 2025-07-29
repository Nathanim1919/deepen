import { motion } from "framer-motion";

export const ActionButton: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color?: string;
  borderColor?: string;
  hasApiKey?: boolean;
}> = ({
  icon,
  title,
  description,
  onClick,
  color = "bg-[#1313ce]",
  borderColor = "border-[#3a3a3c]",
  hasApiKey,
}) => {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`w-full p-5 rounded-xl bg-white dark:bg-[#171717] border border-gray-300 dark:border-gray-800/50  transition-all text-left group overflow-hidden relative`}
    >
      {/* Hover effect */}
      <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span>
        {hasApiKey && hasApiKey && (
          <span className="text-white w-6 h-6 rounded-full grid place-items-center bg-green-600 absolute top-1 right-2">
            ✓
          </span>
        )}
         {hasApiKey && !hasApiKey && <span className="text-white w-6 h-6 text-[13px] rounded-full grid place-items-center absolute top-1 right-2">
            ⚠️
          </span>}
      </span>
      <div className="flex items-center gap-4 relative z-10">
        <div
          className={`p-3 rounded-xl ${
            color.includes("indigo")
              ? "bg-indigo-500/10"
              : color.includes("amber")
              ? "bg-amber-500/10"
              : color.includes("red")
              ? "bg-red-500/10"
              : "bg-white/5"
          } border dark:border-gray-800/50 border-gray-300`}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-medium dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-[#aeaeb2] mt-1">{description}</p>
        </div>
      </div>
    </motion.button>
  );
};
