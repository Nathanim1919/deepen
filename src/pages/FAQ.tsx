import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  ChevronDown,
  BrainCircuit,
  Lock,
  Cpu,
  Smartphone,
  Users,
  FileStack,
  RefreshCw,
} from "lucide-react";

export const FAQ = () => {
  const faqs = [
    {
      icon: <BrainCircuit className="w-5 h-5 text-purple-400" />,
      question: "How does Deepen differ from traditional knowledge tools?",
      answer:
        "Deepen forges neural-like links between ideas. Our AI surfaces context-aware insights with end-to-end encrypted sync—seamlessly across devices.",
    },
    {
      icon: <Lock className="w-5 h-5 text-purple-400" />,
      question: "What makes your privacy approach special?",
      answer:
        "Zero-knowledge architecture encrypts your data before it leaves your device. We never hold decryption keys. Not even we can access it.",
    },
    {
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      question: "How does the AI work privately?",
      answer:
        "We prioritize on-device intelligence. When cloud-based tasks are needed, we leverage encrypted computation using homomorphic encryption.",
    },
    {
      icon: <Smartphone className="w-5 h-5 text-purple-400" />,
      question: "Is offline use supported?",
      answer:
        "Yes. Deepen is fully operational offline. All changes sync once reconnected via CRDTs for conflict-free merging.",
    },
    {
      icon: <Users className="w-5 h-5 text-purple-400" />,
      question: "How does team collaboration work?",
      answer:
        "Live collaboration with granular access, presence indicators, and encrypted syncing—designed for creative minds working in flow.",
    },
    {
      icon: <FileStack className="w-5 h-5 text-purple-400" />,
      question: "What file types are supported?",
      answer:
        "Over 200 formats: from docs to 3D files—all integrated with your knowledge graph and searchable contextually.",
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-purple-400" />,
      question: "Update frequency?",
      answer:
        "Biweekly releases—seamless, invisible updates that just work. No migrations, no friction, just progress.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggle = (i: number) => setActiveIndex(activeIndex === i ? null : i);

  return (
    <section className="relative bg-[#0c0c0c] text-white py-28 px-6 sm:px-12 overflow-hidden">
      {/* Soft radial gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-[10%] w-80 h-80 bg-purple-800/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-[5%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 mb-6"
        >
          Frequently Asked Questions
        </motion.h2>
        <p className="text-lg text-gray-400 max-w-xl mx-auto font-light">
          Answers for curious minds, crafted with clarity.
        </p>
      </div>

      {/* FAQ Blocks */}
      <div className="relative z-10 mt-16 space-y-3 max-w-3xl mx-auto">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm hover:border-zinc-700 transition"
          >
            <button
              onClick={() => toggle(i)}
              className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  {faq.icon}
                </div>
                <span className="text-md md:text-lg text-white font-medium">
                  {faq.question}
                </span>
              </div>
              <motion.div
                animate={{ rotate: activeIndex === i ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {activeIndex === i && (
                <motion.div
                  key="answer"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    transition: {
                      type: "spring",
                      damping: 20,
                      stiffness: 200,
                    },
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-6 -mt-2 text-sm md:text-base text-gray-400 leading-relaxed font-light"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-24 text-center text-sm text-gray-500"
      >
        Still have questions?{" "}
        <span className="text-purple-400 underline cursor-pointer hover:text-purple-300 transition">
          Talk to us →
        </span>
      </motion.div>
    </section>
  );
};
