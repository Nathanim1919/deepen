// src/pages/Waitlist.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { api } from "../api";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-hidden relative">
      {/* Subtle texture background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(125,125,125,0.05)_0%,transparent_70%)]">
        <div className="absolute inset-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMCAwaDYwdjYwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTMwIDMwTTIwIDMwYTAgMTAgMTAgMSAwIDIwIDBhMCAxMCAxMCAxIDAgLTIwIDBaIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC4yIiBzdHJva2UtZGFzaGFycmF5PSIxLDEiLz48L3N2Zz4=')]" />
        </div>
      </div>

      {/* Ambient lighting */}
      <div className="fixed -left-1/4 -top-1/4 w-[50%] h-[50%] rounded-full bg-violet-900/5 blur-[100px]" />
      <div className="fixed -right-1/4 -bottom-1/4 w-[50%] h-[50%] rounded-full bg-indigo-900/5 blur-[100px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-24 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md mx-auto text-center"
        >
          {/* Brand mark - subtle yet distinctive */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/10">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-white"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  d="M12 2L3 12L12 22L21 12L12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  d="M12 22L12 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-light tracking-tight text-gray-50">
              Deepen
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-medium tracking-tight text-gray-50 mb-4">
              The next dimension of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-300">
                AI understanding
              </span>
            </h2>
            <p className="text-gray-400/90 leading-relaxed">
              Join our waitlist to be among the first to experience contextual
              intelligence that truly comprehends.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-full"
              >
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-5 py-4 bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-lg focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/10 outline-none transition-all duration-300 placeholder:text-gray-500 text-gray-200 text-center"
                  />
                  <div className="absolute inset-0 rounded-lg pointer-events-none border border-white/5 mix-blend-overlay" />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-4 rounded-lg font-medium bg-gray-50 text-gray-900 transition-all duration-300 hover:bg-white disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="block w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full"
                      />
                      <span>Securing your spot</span>
                    </>
                  ) : (
                    "Join the waitlist"
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-6 bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-lg"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-violet-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-50 mb-2">
                    Welcome aboard
                  </h3>
                  <p className="text-gray-400 text-center">
                    We've saved your spot. You'll hear from us soon.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-24 text-xs text-gray-500 flex flex-col items-center gap-1"
          >
            <span>© {new Date().getFullYear()} Deepen AI</span>
            <span className="opacity-50">Contextual intelligence redefined</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Waitlist;