import { Link, useMatchRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/manifesto", label: "Manifesto" },
  { path: "/faqs", label: "FAQs" },
  { path: "/feedback", label: "Feedback" },
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const matchRoute = useMatchRoute();

  const isActive = (path: string) => matchRoute({ to: path, fuzzy: false });

  return (
    <header className="w-full bg-[#000000] relative z-1000">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-xl font-light"
        >
          <Link to="/" className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">
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
                    active ? "text-white" : "text-gray-400 hover:text-gray-200"
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

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            to="/login"
            className="text-sm text-gray-300 hover:text-white transition"
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
         {/* <motion.button
          onClick={() => window.location.href = "/waitlist"}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors shadow-lg hover:shadow-blue-500/20"
                        >
                          Join Waitlist
                        </motion.button> */}

        {/* Mobile Menu Toggle */}
        <motion.button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-400 hover:text-white"
          whileTap={{ scale: 0.9 }}
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </motion.button>
      </div>

      {/* Mobile Drawer */}
   
    </header>
  );
};


{/* <AnimatePresence>
{mobileOpen && (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ type: "spring", stiffness: 260, damping: 24 }}
    className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-[#050505] z-40 backdrop-blur-xl"
  >
    <div className="px-6 py-6 space-y-5">
      {/* {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => setMobileOpen(false)}
          className={`block text-base font-medium ${
            isActive(item.path)
              ? "text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {item.label}
        </Link>
      ))} */}
      {/* <div className="pt-6 space-y-4">
        <Link
          to="/login"
          onClick={() => setMobileOpen(false)}
          className="block text-sm text-gray-300 hover:text-white"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          onClick={() => setMobileOpen(false)}
          className="block w-full text-center text-sm text-white bg-blue-600 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </div> 
    </div>
       <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors shadow-lg hover:shadow-blue-500/20"
                >
                  Join Waitlist
                </motion.button>
  </motion.div>
)}
</AnimatePresence>
<motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors shadow-lg hover:shadow-blue-500/20"
                >
                  Join Waitlist
                </motion.button> */}

                