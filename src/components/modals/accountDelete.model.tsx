import { motion } from "framer-motion"
import { ModalWrapper } from "./ModalWrapper"
import { FiTrash2, FiX } from "react-icons/fi"

export const DeleteAccountModal: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
    return (
        <ModalWrapper closeModal={closeModal}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Delete Account</h2>
            <button onClick={closeModal} className="text-[#aeaeb2] hover:text-white p-1">
              <FiX className="text-xl" />
            </button>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 text-red-400">
              <FiTrash2 className="text-xl" />
              <h3 className="font-medium">Permanent Account Deletion</h3>
            </div>
            <p className="text-[#aeaeb2] mt-2 text-sm">
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </p>
          </div>
          <div className="mb-4">
            <label className="flex items-center gap-3 text-[#aeaeb2] text-sm">
              <input 
                type="checkbox" 
                className="rounded bg-[#2c2c2e] border-[#3a3a3c] focus:ring-blue-500 focus:border-blue-500" 
              />
              I understand this action is irreversible
            </label>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-medium flex-1 transition-colors"
            >
              Delete Account
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={closeModal}
              className="px-6 py-3 bg-[#2c2c2e] hover:bg-[#3a3a3c] rounded-xl font-medium flex-1 transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </ModalWrapper>
    )
}