import { motion } from "framer-motion"
import { ModalWrapper } from "./ModalWrapper"
import { FiCheck, FiStar, FiX } from "react-icons/fi"

export const UpgradeModal:React.FC<{closeModal:()=> void;setIsSubscribed:(value: boolean)=>void;  isSubscribed: boolean}> = ({
    closeModal,
    isSubscribed,
    setIsSubscribed
}) => {
    return (
        <ModalWrapper closeModal={closeModal}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">
              {isSubscribed ? "Premium Membership" : "Upgrade to Premium"}
            </h2>
            <button onClick={closeModal} className="text-[#aeaeb2] hover:text-white p-1">
              <FiX className="text-xl" />
            </button>
          </div>
          
          {isSubscribed ? (
            <>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 text-amber-400">
                  <FiStar className="text-xl" />
                  <h3 className="font-medium">You're a Premium Member</h3>
                </div>
                <p className="text-[#aeaeb2] mt-2 text-sm">
                  Your subscription renews automatically on January 15, 2031.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-[#2c2c2e] hover:bg-[#3a3a3c] border border-[#3a3a3c] text-red-400 rounded-xl font-medium transition-colors"
              >
                Cancel Subscription
              </motion.button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="bg-[#2c2c2e] border border-[#3a3a3c] rounded-xl p-5">
                  <h3 className="font-medium text-lg mb-2">Basic</h3>
                  <p className="text-[#aeaeb2] text-sm mb-4">Free forever</p>
                  <ul className="text-sm text-[#aeaeb2] space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <FiCheck className="text-green-500 text-xs" />
                      </div>
                      <span>Core features</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <FiCheck className="text-green-500 text-xs" />
                      </div>
                      <span>Limited API calls</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-blue-500/20 text-blue-400 text-xs px-2.5 py-1 rounded-full">
                    POPULAR
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Premium</h3>
                    <p className="text-blue-400 text-sm mb-4">$9.99/month</p>
                  </div>
                  <ul className="text-sm text-[#f5f5f7] space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <FiCheck className="text-green-500 text-xs" />
                      </div>
                      <span>Unlimited API calls</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <FiCheck className="text-green-500 text-xs" />
                      </div>
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <FiCheck className="text-green-500 text-xs" />
                      </div>
                      <span>Advanced analytics</span>
                    </li>
                  </ul>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl font-medium text-white transition-all"
                onClick={() => setIsSubscribed(true)}
              >
                Upgrade Now
              </motion.button>
            </>
          )}
        </div>
      </ModalWrapper>
    )
}