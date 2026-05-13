import { Link, useMatchRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { useUIStore } from "../stores/ui-store";
import { Moon, Sun } from "lucide-react";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/pricing", label: "Pricing" },
  { path: "/faqs", label: "FAQs" },
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const matchRoute = useMatchRoute();
  const { theme, toggleTheme } = useUIStore();

  const isActive = (path: string) => matchRoute({ to: path, fuzzy: false });

  return (
    <header className="w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-xl font-semibold"
        >
          <Link to="/" className="flex items-center gap-1.5 text-gray-900 dark:text-white">
            <span className="text-2xl">✦</span>
            <span>Deepen</span>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 relative">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm font-medium tracking-wide px-3.5 py-1.5 rounded-lg transition-all duration-200 ${
                  active
                    ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="w-4.5 h-4.5" />
            ) : (
              <Moon className="w-4.5 h-4.5" />
            )}
          </button>

          <div className="h-5 w-px bg-gray-200 dark:bg-white/10" />

          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="relative overflow-hidden px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 bg-gray-900 dark:bg-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200 before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] before:opacity-60 before:pointer-events-none"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white p-1"
            whileTap={{ scale: 0.9 }}
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-100 dark:border-white/5 bg-white dark:bg-black overflow-hidden"
          >
            <div className="px-6 py-6 space-y-6">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`text-base font-medium px-3 py-2.5 rounded-lg transition-all ${
                        active
                          ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-gray-100 dark:border-white/5 space-y-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-base font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="relative overflow-hidden block w-full text-center text-sm font-semibold text-white dark:text-gray-900 bg-gray-900 dark:bg-white py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] before:opacity-60 before:pointer-events-none"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
