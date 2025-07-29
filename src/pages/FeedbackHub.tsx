import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { FeedbackService } from "../api/feedback.api";
import { ArrowRight, ChevronDown } from "lucide-react";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    feedback: "",
    name: "",
    profession: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async () => {
    if (!formData.feedback.trim()) {
      toast("Please share your feedback", {
        position: "top-center",
        style: {
          background: "rgba(28, 28, 30, 0.92)",
          border: "1px solid rgba(72, 72, 74, 0.6)",
          color: "white",
          fontSize: "14px",
          padding: "12px 20px",
          borderRadius: "12px",
          backdropFilter: "blur(20px)"
        }
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await FeedbackService.submit({
        feedback: formData.feedback,
        ...(formData.name && { name: formData.name }),
        ...(formData.profession && { profession: formData.profession }),
      });

      toast.success("Thank you for your feedback!", {
        position: "top-center",
        style: {
          background: "rgba(28, 28, 30, 0.92)",
          border: "1px solid rgba(48, 209, 88, 0.5)",
          color: "white"
        }
      });
      
      setFormData({ feedback: "", name: "", profession: "" });
      setShowOptionalFields(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message :
        "Couldn't send feedback. Please try again.", {
        position: "top-center",
        style: {
          background: "rgba(28, 28, 30, 0.92)",
          border: "1px solid rgba(255, 59, 48, 0.5)",
          color: "white"
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">
            Share Feedback
          </h1>
          <p className="text-gray-500 text-sm">
            Help us improve Deepen.live
          </p>
        </motion.div>

        {/* Form */}
        <div className="space-y-6">
          {/* Feedback Field */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-2">
              Your thoughts
            </label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              placeholder="What can we improve?"
              className="w-full min-h-[120px] p-4 bg-gray-900/50 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none text-base leading-relaxed transition-colors"
              disabled={isSubmitting}
            />
          </div>

          {/* Optional Fields Toggle */}
          <button
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            className="flex items-center text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${showOptionalFields ? "rotate-180" : ""}`} />
            {showOptionalFields ? "Hide optional fields" : "Add contact details"}
          </button>

          {/* Optional Fields */}
          <AnimatePresence>
            {showOptionalFields && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Name (optional)
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-900/50 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 text-base transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Profession (optional)
                  </label>
                  <input
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-900/50 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 text-base transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <div className="pt-4">
            <motion.button
              onClick={handleSubmit}
              disabled={!formData.feedback.trim() || isSubmitting}
              whileTap={{ scale: 0.96 }}
              className={`w-full py-3.5 rounded-xl bg-blue-500 text-white font-medium flex items-center justify-center gap-2 transition-colors
                ${(!formData.feedback.trim() || isSubmitting) ? "opacity-80" : "hover:bg-blue-600"}`}
            >
              {isSubmitting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Sending...
                </>
              ) : (
                <>
                  Submit Feedback
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-8 text-center"
        >
          <p className="text-xs text-gray-500">
            All feedback is confidential. <a href="#" className="underline hover:text-gray-400">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackForm;