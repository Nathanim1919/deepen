import { useState } from "react";
import { ModalWrapper } from "./ModalWrapper";
import { setGeminiApiKey } from "../../api/account.api";
import { FiX, FiEye, FiEyeOff, FiExternalLink, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from 'sonner';

export const SetApiKeyModal: React.FC<{ 
  closeModal: () => void, 
  existingApiKey?: boolean 
}> = ({
  closeModal,
  existingApiKey
}) => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSettingGeminiApiKey = async () => {
    if (!apiKey && !existingApiKey) {
      toast('API Key Required', {
        description: 'Please enter your Gemini API key to continue',
        icon: 'ℹ️',
      });
      return;
    }
    
    setIsSaving(true);
    try {
      await setGeminiApiKey(apiKey);
      toast.success(existingApiKey ? 'API Key Updated' : 'API Key Saved', {
        description: 'Your Gemini integration is now active',
      });
      closeModal();
    } catch (error) {
      toast.error('Failed to Save Key', {
        description: 'Please check your connection and try again',
      });
      console.error("Error setting Gemini API Key:", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ModalWrapper closeModal={closeModal}>
      <div className="p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-black dark:text-white">Gemini Integration</h2>
          <button 
            onClick={closeModal} 
            className="text-[#aeaeb2] hover:opacity-65 cursor-pointer rounded-full p-1 transition-colors"
          >
            <FiX className="text-lg" />
          </button>
        </div>
        
        {existingApiKey ? (
          <div className="mb-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4 border dark:border-gray-700 border-gray-100">
            <div className="flex items-start gap-3">
              <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="dark:text-white text-black font-medium">API Key Configured</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Your Gemini API key is securely stored. You can update it below if needed.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mb-6">
          <label className="block text-gray-400 mb-2 text-sm font-medium">
            {existingApiKey ? "Update API Key" : "Enter API Key"}
          </label>
          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full dark:bg-gray-800 bg-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 placeholder-gray-500"
              placeholder={existingApiKey ? "Enter new key..." : "sk-...your-api-key"}
            />
            {apiKey && (
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
              >
                {showApiKey ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            )}
          </div>
        </div>
        
        {!existingApiKey && (
          <div className="mb-6 bg-gray-100 dark:bg-gray-800/30 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <h3 className="dark:text-white text-black font-medium text-sm flex items-center gap-2">
              <span className="text-blue-500">i</span>
              Need an API key?
            </h3>
            <p className="text-gray-400 text-xs mt-1 mb-2">
              Get your key from Google AI Studio to enable Gemini features.
            </p>
            <a
              href="https://ai.google.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 text-xs flex items-center gap-1 transition-colors"
            >
              Get API Key <FiExternalLink size={14} />
            </a>
          </div>
        )}
        
        <div className="flex gap-3">
          <motion.button
            onClick={handleSettingGeminiApiKey}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isSaving}
            className={`px-4 py-2.5 cursor-pointer text-white rounded-lg font-medium flex-1 text-center transition-colors ${
              isSaving 
                ? "bg-blue-600/80 cursor-not-allowed" 
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSaving ? (
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : existingApiKey ? (
              "Update"
            ) : (
              "Save"
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={closeModal}
            className="px-4 py-2.5 bg-gray-200 cursor-pointer dark:bg-gray-700 hover:dark:bg-gray-600 hover:bg-gray-100 rounded-lg font-medium flex-1 text-center transition-colors"
          >
            Cancel
          </motion.button>
        </div>
      </div>
    </ModalWrapper>
  )
}