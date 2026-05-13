// src/pages/Waitlist.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { api } from "../api";
import { toast } from "sonner";
import { ArrowRight, Check, Loader2, MoveLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;
    
    setIsLoading(true);

    await api
      .post("/waitlist/join", { email })
      .then((res) => {
        setSubmitted(true);
        toast.success(res.data.message || "You're on the list");
      })
      .catch((error) => {
        console.error("Error joining waitlist:", error);
        toast.error("Please check your email and try again");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 relative overflow-hidden flex flex-col justify-center">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all text-sm font-medium text-gray-600 dark:text-gray-300"
        >
          <MoveLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Refined Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/40 dark:bg-violet-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          {/* Logo Mark */}
          <div className="w-12 h-12 mx-auto mb-8 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-xl shadow-black/5 dark:shadow-white/5">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-white dark:text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
            Join the movement.
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            Experience the future of knowledge management. <br className="hidden sm:block"/>
            Be the first to know when we launch.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="relative w-full"
            >
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur-sm" />
                <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-xl p-1.5 shadow-sm border border-gray-200 dark:border-white/10 ring-1 ring-gray-900/5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="flex-1 bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 px-4 py-3 focus:outline-none focus:ring-0 text-base"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-lg font-medium text-sm hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Join <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
                No spam. Unsubscribe anytime.
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-2xl p-8 text-center"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                You're on the list!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We'll notify you as soon as early access opens.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex justify-center gap-8"
        >
          {/* Social Proof / Stats placeholder could go here for credibility */}
        </motion.div>
      </div>
      
      {/* Bottom Legal */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-xs text-gray-400 dark:text-zinc-600">
          © {new Date().getFullYear()} Deepen. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Waitlist;
