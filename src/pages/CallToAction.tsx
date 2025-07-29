// import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
// import { FaChrome } from "react-icons/fa";
// import { FiDownload, FiArrowUpRight } from "react-icons/fi";

export const CallToAction = () => {
  return (
    <motion.section 
      className="relative overflow-hidden -mt-12 md:mt-0 md:py-8 px-6 bg-[#000000]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Apple-style subtle noise texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjAyIiBudW1PY3RhdmVzPSI1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvc3ZnPg==')] opacity-[0.02] pointer-events-none" />
      
      {/* Precise gradient elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] left-[15%] w-[400px] h-[400px] bg-gradient-to-br from-violet-900/5 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-[25%] right-[20%] w-[300px] h-[300px] bg-indigo-900/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        {/* Headline with Apple's typographic precision */}
        <motion.h2 
          className="text-5xl md:text-6xl font-semibold mb-6 leading-[1.1] tracking-tight"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ 
            delay: 0.1,
            type: "spring",
            stiffness: 100,
            damping: 10
          }}
          viewport={{ once: true }}
        >
          <span 
           style={{
            backgroundImage:
              "linear-gradient(90deg, #06d1ff, #efff12, #ffffff)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
          className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            Capture ideas.<br />like never before.
          </span>
        </motion.h2>

        {/* Subtext with perfect line height */}
        <motion.p 
          className="text-xl  text-white/60 mb-10 max-w-lg mx-auto leading-[1.6]"
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ 
            delay: 0.2,
            type: "spring",
            stiffness: 100,
            damping: 10
          }}
          viewport={{ once: true }}
        >
                    Our extension flows with your browsing, making content capture as natural as thought.

        </motion.p>

        {/* Buttons with tactile feel */}
        {/* <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.div 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
              to="#install"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-300 to-violet-400 text-black font-medium px-8 py-3.5 rounded-full hover:bg-white/90 transition-colors duration-300 group"
            >
              <FaChrome className="text-lg text-gray-800 group-hover:text-gray-900 transition-colors" />
              <span>Add to Chrome</span>
              <FiArrowUpRight className="ml-1 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </Link>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
              to="#demo"
              className="flex items-center justify-center gap-2 bg-transparent text-white font-medium px-8 py-3.5 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors duration-300 group"
            >
              <FiDownload className="text-lg text-white/80 group-hover:text-white transition-colors" />
              <span>Watch Demo</span>
            </Link>
          </motion.div>
        </motion.div> */}
         <motion.button
          onClick={() => window.location.href = "/waitlist"}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors shadow-lg hover:shadow-blue-500/20"
                        >
                          Join Waitlist
                        </motion.button>

        {/* Microcopy with perfect tracking */}
        <motion.p 
          className="mt-8 text-sm text-white/40 tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          Free forever • One-click install • Zero tracking
        </motion.p>
      </div>
    </motion.section>
  );
};