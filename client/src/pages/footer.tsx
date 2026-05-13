import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { FaXTwitter, FaGithub, FaDiscord } from "react-icons/fa6";

export const Footer = () => {
  return (
    <footer className="relative w-full bg-white dark:bg-black overflow-hidden pt-24 pb-12 border-t border-gray-100 dark:border-white/5">
      {/* Subtle warm gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-violet-50/40 via-transparent to-transparent dark:from-violet-900/5 dark:via-transparent dark:to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center">
        {/* Main Content Area */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                Ready to think{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-rose-400">
                  differently?
                </span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md text-lg leading-relaxed">
                Start organizing your knowledge today. Free to use, no credit card required.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                to="/register"
                className="relative overflow-hidden group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white dark:text-gray-900 bg-gray-900 dark:bg-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] before:opacity-60 before:pointer-events-none"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
            </motion.div>
          </div>

          <div className="hidden md:flex justify-end gap-16 text-sm text-gray-500 dark:text-gray-400">
            <ul className="space-y-3.5">
              <li className="font-semibold text-gray-900 dark:text-white tracking-wider uppercase text-xs">
                Platform
              </li>
              <li>
                <a href="/pricing" className="hover:text-violet-500 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/faqs" className="hover:text-violet-500 transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
            <ul className="space-y-3.5">
              <li className="font-semibold text-gray-900 dark:text-white tracking-wider uppercase text-xs">
                Legal
              </li>
              <li>
                <a href="/privacy" className="hover:text-violet-500 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/feedback" className="hover:text-violet-500 transition-colors">
                  Feedback
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Cinematic Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="relative w-full select-none"
        >
          <h1 className="text-[18vw] leading-[0.8] font-black text-center tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-transparent dark:from-white/15 dark:to-transparent pointer-events-none">
            DEEPEN
          </h1>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-black to-transparent" />
        </motion.div>

        {/* Footer Bottom */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 py-8 border-t border-gray-100 dark:border-white/5 mt-[-4vw] relative z-20">
          <p className="text-xs text-gray-400 dark:text-zinc-600">
            &copy; {new Date().getFullYear()} Deepen Labs Inc.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              aria-label="Twitter"
            >
              <FaXTwitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              aria-label="Discord"
            >
              <FaDiscord className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
