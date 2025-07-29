import { motion } from "framer-motion"
import { ModalWrapper } from "./ModalWrapper"
import { FiX } from "react-icons/fi"

export const ExportDataModal: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
    return (
        <ModalWrapper closeModal={closeModal}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Export Data</h2>
            <button onClick={closeModal} className="text-[#aeaeb2] hover:text-white p-1">
              <FiX className="text-xl" />
            </button>
          </div>
          <p className="text-[#aeaeb2] mb-6">
            This will generate a JSON file containing all your account data, including settings and preferences.
          </p>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium flex-1 text-center transition-colors"
            >
              Export Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={closeModal}
              className="px-6 py-3 bg-[#2c2c2e] hover:bg-[#3a3a3c] rounded-xl font-medium flex-1 text-center transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </ModalWrapper>
    )
}