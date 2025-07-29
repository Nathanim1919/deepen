import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, Lock, Infinity as InfinityIcon } from "lucide-react";

export const Manifesto = () => {
  const principles = [
    {
      icon: <BrainCircuit className="w-5 h-5 text-blue-400" />,
      title: "Cognitive Harmony",
      description: "We design tools that adapt to your thinking, not the other way around. Technology should feel like an extension of your mind."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-blue-400" />,
      title: "Intentional Simplicity",
      description: "Every pixel serves a purpose. We remove complexity so you can focus on what matters."
    },
    {
      icon: <Lock className="w-5 h-5 text-blue-400" />,
      title: "Radical Privacy",
      description: "Your thoughts belong to you. End-to-end encryption by default, with zero data collection."
    },
    {
      icon: <InfinityIcon className="w-5 h-5 text-blue-400" />,
      title: "Timeless Design",
      description: "We build for permanence in a world of obsolescence. No trends, just enduring utility."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100">
      {/* Subtle texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iODAiIGhlaWdodD0iODAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIG9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')]" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-32">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="mb-8">
            <motion.div 
              className="w-12 h-0.5 bg-blue-400 mx-auto mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight mb-4">
              <span className="bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent">
                Deepen.live
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              A philosophy for tools that deepen thought
            </p>
          </div>
        </motion.div>

        {/* Principles */}
        <div className="space-y-16">
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative"
            >
              <div className="flex items-start gap-6">
                <motion.div
                  className="p-2 rounded-lg bg-blue-400/10 border border-blue-400/20 mt-1"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.15 + 0.2 }}
                >
                  {principle.icon}
                </motion.div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-3 tracking-tight">
                    {principle.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
              {index < principles.length - 1 && (
                <motion.div
                  className="absolute -bottom-8 left-12 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/10 to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.4 + index * 0.15 }}
                  viewport={{ once: true }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-32 pt-12 border-t border-gray-800 text-center"
        >
          <p className="text-sm text-gray-500 tracking-wider mb-6">
            EST. 2025 • SAN FRANCISCO
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow-lg hover:shadow-blue-500/20 transition-all"
          >
            Read the Full Philosophy
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};