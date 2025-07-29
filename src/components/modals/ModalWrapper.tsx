import { motion } from "framer-motion";

export const ModalWrapper: React.FC<{ children: React.ReactNode, closeModal:()=> void }> = ({ children, closeModal }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/7 dark:bg-black/70 backdrop-blur-xl z-1000 flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <motion.div 
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.98 }}
        transition={{ 
          type: "spring", 
          damping: 25,
          stiffness: 300
        }}
        className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-gray-300 dark:border-[#2c2c2e] shadow-2xl shadow-black/10 dark:shadow-black/50 max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );