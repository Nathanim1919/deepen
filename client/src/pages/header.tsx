import { Link, useMatchRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { useUIStore } from "../stores/ui-store";
import { Moon, Sun } from "lucide-react";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/pricing", label: "Pricing" },
  { path: "/manifesto", label: "Manifesto" },
  { path: "/faqs", label: "FAQs" },
  { path: "/feedback", label: "Feedback" },
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const matchRoute = useMatchRoute();
  const { theme, toggleTheme } = useUIStore();

  const isActive = (path: string) => matchRoute({ to: path, fuzzy: false });

  return (
    <header className="w-full bg-white dark:bg-[#000000] relative z-1000 border-b border-gray-100 dark:border-transparent">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-xl font-light"
        >
          <Link to="/" className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-300 dark:to-white">
            Deepen<span className="text-blue-500">.</span>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 relative">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <div key={item.path} className="relative">
                <Link
                  to={item.path}
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    active 
                      ? "text-black dark:text-white" 
                      : "text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  {item.label}
                </Link>
                {active && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-blue-500/70 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Desktop CTA & Theme Toggle */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          
          <div className="h-4 w-px bg-gray-200 dark:bg-white/10 mx-1" />

          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:shadow-[0_0_15px_-3px_rgba(59,130,246,0.4)] transition"
          >
            Get Started
          </Link>
        </div>
        
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          
          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
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
            className="md:hidden border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#000000] overflow-hidden"
          >
            <div className="px-6 py-6 space-y-6">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => {
                   const active = isActive(item.path);
                   return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`text-base font-medium transition-colors ${
                        active 
                          ? "text-black dark:text-white" 
                          : "text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-gray-200"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              
              <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-4">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-base font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center text-sm font-medium text-white bg-blue-600 py-3 rounded-xl hover:bg-blue-700 transition"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
