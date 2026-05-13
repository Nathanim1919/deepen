import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { FeedbackService } from "../api/feedback.api";
import { ArrowRight, Loader2, MoveLeft, MessageSquarePlus, ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    feedback: "",
    name: "",
    profession: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async () => {
    if (!formData.feedback.trim()) {
      toast.error("Please share your feedback first");
      return;
    }

    setIsSubmitting(true);

    try {
      await FeedbackService.submit({
        feedback: formData.feedback,
        ...(formData.name && { name: formData.name }),
        ...(formData.profession && { profession: formData.profession }),
      });

      toast.success("Feedback received. Thank you.");
      
      setFormData({ feedback: "", name: "", profession: "" });
      setShowOptionalFields(false);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-gray-100 relative selection:bg-gray-200 dark:selection:bg-zinc-800 flex flex-col items-center justify-center py-12 px-6">
      
      {/* Navigation */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <Link 
          to="/"
          className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors"
        >
          <div className="p-1.5 rounded-full bg-gray-100 dark:bg-zinc-900 group-hover:bg-gray-200 dark:group-hover:bg-zinc-800 transition-colors">
            <MoveLeft className="w-4 h-4" />
          </div>
          <span>Back to Home</span>
        </Link>
      </nav>

      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiLz48ZyBmaWxsPSIjOTk5IiBmaWxsLW9wYWNpdHk9IjAuMDUiPjxjaXJjbGUgY3g9IjEiIGN5PSIxIiByPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-40 pointer-events-none" />

      <div className="w-full max-w-[480px] relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="w-10 h-10 mb-6 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-800">
            <MessageSquarePlus className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-3">
            Product Feedback
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 leading-relaxed text-lg">
            We read every message. Tell us what's working, what's broken, or what you'd like to see next.
          </p>
        </motion.div>

        {/* Form Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          {/* Main Feedback Input */}
          <div className="group relative">
            <label 
              htmlFor="feedback" 
              className={`absolute left-4 top-4 text-sm transition-all duration-200 pointer-events-none ${
                focusedField === 'feedback' || formData.feedback 
                  ? "text-xs text-gray-400 dark:text-zinc-500 -translate-y-1" 
                  : "text-gray-500 dark:text-zinc-500"
              }`}
            >
              What's on your mind?
            </label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onFocus={() => setFocusedField('feedback')}
              onBlur={() => setFocusedField(null)}
              onChange={handleChange}
              className="w-full min-h-[160px] pt-10 pb-4 px-4 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all resize-none text-base leading-relaxed"
              disabled={isSubmitting}
            />
          </div>

          {/* Optional Fields Accordion */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors group"
            >
              <ChevronDown 
                className={`w-4 h-4 mr-2 transition-transform duration-200 ${showOptionalFields ? "rotate-180" : ""} opacity-70 group-hover:opacity-100`} 
              />
              {showOptionalFields ? "Hide details" : "Add contact details (optional)"}
            </button>

            <AnimatePresence>
              {showOptionalFields && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="relative">
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className="w-full p-3 bg-transparent border-b border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors text-sm"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="relative">
                      <input
                        name="profession"
                        value={formData.profession}
                        onChange={handleChange}
                        placeholder="Profession"
                        className="w-full p-3 bg-transparent border-b border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors text-sm"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-gray-400 dark:text-zinc-600 hidden sm:block">
              Press <kbd className="font-sans px-1 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-500">⌘</kbd> + <kbd className="font-sans px-1 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-500">Enter</kbd> to send
            </p>
            
            <motion.button
              onClick={handleSubmit}
              disabled={!formData.feedback.trim() || isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative overflow-hidden group
                pl-6 pr-5 py-3 rounded-full 
                bg-gray-900 dark:bg-white 
                text-white dark:text-black 
                font-medium text-sm
                flex items-center gap-2 
                transition-all duration-300
                ${(!formData.feedback.trim() || isSubmitting) ? "opacity-50 cursor-not-allowed" : "shadow-lg shadow-gray-900/20 dark:shadow-white/20"}
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending</span>
                </>
              ) : (
                <>
                  <span>Send Feedback</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackForm;
