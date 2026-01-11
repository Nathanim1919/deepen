import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Zap, Search, Lock } from "lucide-react";

export const Features: React.FC = () => {
  const manifestoContent = [
    {
      icon: <Zap className="w-5 h-5 text-blue-400" />,
      heading: "Capture Without Friction",
      paragraphs: [
        "Save anything from the web—articles, videos, PDFs—instantly. No clutter, no distractions.",
        "Deepen.live integrates seamlessly into your workflow, so you never lose an idea again."
      ]
    },
    {
      icon: <BrainCircuit className="w-5 h-5 text-blue-400" />,
      heading: "AI That Understands You",
      paragraphs: [
        "Get smart summaries, extract key insights, and ask questions—like having a research assistant on call.",
        "Our AI learns how you think, helping you connect ideas effortlessly."
      ]
    },
    {
      icon: <Search className="w-5 h-5 text-blue-400" />,
      heading: "Organize & Retrieve Instantly",
      paragraphs: [
        "Tag, categorize, and structure knowledge your way—no rigid folders, just fluid thinking.",
        "Find anything in seconds with semantic search that goes beyond keywords."
      ]
    },
    {
      icon: <Lock className="w-5 h-5 text-blue-400" />,
      heading: "Privacy by Design",
      paragraphs: [
        "Your data stays yours. We don’t sell it, mine it, or exploit it.",
        "End-to-end encryption ensures your thoughts remain private."
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-8 bg-white dark:bg-[#000000] text-gray-900 dark:text-white relative overflow-hidden">
      {/* Subtle neural network background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none">
          <path
            d="M200,200 Q400,300 600,200 T800,300 M300,600 Q500,700 700,600 T900,700"
            stroke="currentColor"
            strokeWidth="1"
            className="text-blue-500"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 space-y-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-gray-900 dark:text-white">
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-300 dark:to-blue-500 bg-clip-text text-transparent">
              Deepen.live
            </span>
          </h1>
          <motion.div
            className="h-px w-20 bg-blue-500/50 mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          <p className="text-lg text-gray-600 dark:text-blue-100/80 max-w-md mx-auto">
            The AI-powered second brain for focused thinkers
          </p>
        </motion.div>

        {/* Manifesto Sections */}
        <div className="space-y-12">
          {manifestoContent.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative group"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.2 + 0.1 }}
                  className="p-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 mt-0.5"
                >
                  {section.icon}
                </motion.div>

                <div>
                  <h2 className="text-xl font-medium text-white mb-4 tracking-tight">
                    {section.heading}
                  </h2>

                  <div className="space-y-4 pl-1">
                    {section.paragraphs.map((p, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + index * 0.1 }}
                        viewport={{ once: true }}
                        className="text-base text-blue-100/80 leading-relaxed"
                      >
                        {p}
                      </motion.p>
                    ))}
                  </div>
                </div>
              </div>

              {index < manifestoContent.length - 1 && (
                <motion.div
                  className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.3 + index * 0.2 }}
                  viewport={{ once: true }}
                />
              )}
            </motion.section>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="pt-8 text-center"
        >
          <motion.button
            onClick={() => window.location.href = "/waitlist"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors shadow-lg hover:shadow-blue-500/20"
          >
            Join Waitlist
          </motion.button>
          <p className="mt-4 text-xs text-blue-400/60 tracking-wider">
            Deepen.live • Coming 2025
          </p>
        </motion.div>
      </div>
    </div>
  );
};