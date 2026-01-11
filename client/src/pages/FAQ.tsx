import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  BrainCircuit,
  Lock,
  Zap,
  Globe,
  MessageSquare,
  Search,
  Plus
} from "lucide-react";

export const FAQ = () => {
  const faqs = [
    {
      icon: <Globe className="w-5 h-5" />,
      question: "What exactly does Deepen capture?",
      answer:
        "Everything. Articles, PDFs, YouTube videos, tweets, and even your own notes. If it has a URL or text, Deepen can ingest it, process it, and make it part of your searchable knowledge base."
    },
    {
      icon: <BrainCircuit className="w-5 h-5" />,
      question: "Is this just another bookmark manager?",
      answer:
        "No. Bookmarks are static links you forget. Deepen is an active intelligence layer. It reads what you save, understands the context, and uses vector search to resurface relevant information exactly when you need it."
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      question: "How does the 'Brain Chat' work?",
      answer:
        "Unlike generic AI like ChatGPT, Deepen's chat is grounded in *your* data. You can ask, 'What did I read about cognitive load last month?' and it will synthesize an answer citing your specific saved articles and notes."
    },
    {
      icon: <Search className="w-5 h-5" />,
      question: "Can it find things by meaning, not just keywords?",
      answer:
        "Yes. We use advanced vector embeddings (Qdrant) to understand semantic relationships. Searching for 'startup growth' will find articles about 'scaling', 'product-market fit', and 'venture capital' even if those exact words aren't used."
    },
    {
      icon: <Zap className="w-5 h-5" />,
      question: "Do I need to manually organize everything?",
      answer:
        "Only if you want to. Deepen automatically categorizes content, generates summaries, and suggests tags. You can create Collections for specific projects, but the AI makes retrieval effortless regardless of organization."
    },
    {
      icon: <Lock className="w-5 h-5" />,
      question: "Is my data used to train public AI models?",
      answer:
        "Absolutely not. Your personal knowledge graph is yours alone. We use secure, enterprise-grade LLM APIs (like OpenRouter) with strict privacy controls. We do not sell your data or use it to train foundation models."
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggle = (i: number) => setActiveIndex(activeIndex === i ? null : i);

  return (
    <section className="relative bg-white dark:bg-black text-gray-900 dark:text-white py-32 px-6 sm:px-12 overflow-hidden transition-colors duration-300">
      
      {/* Ambient Background - Clean & Subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gray-100/50 dark:bg-zinc-900/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-gray-50/50 dark:bg-zinc-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
            Common Questions
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
            Everything you need to know about building your second brain.
          </p>
        </motion.div>

        {/* FAQ List - Clean Editorial Style */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group border-b border-gray-100 dark:border-zinc-900 last:border-0"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full py-6 flex items-start justify-between text-left gap-6 group-hover:bg-gray-50/50 dark:group-hover:bg-zinc-900/30 transition-colors rounded-xl px-4 -mx-4"
              >
                <div className="flex gap-5">
                  <div className={`mt-1 transition-colors duration-300 ${activeIndex === i ? 'text-blue-600 dark:text-white' : 'text-gray-400 dark:text-zinc-600 group-hover:text-gray-600 dark:group-hover:text-zinc-400'}`}>
                    {faq.icon}
                  </div>
                  <span className={`text-lg md:text-xl font-medium transition-colors duration-200 ${activeIndex === i ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-zinc-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'}`}>
                    {faq.question}
                  </span>
                </div>
                <div className={`mt-1.5 transition-transform duration-300 ${activeIndex === i ? 'rotate-45' : ''}`}>
                  <Plus className={`w-5 h-5 ${activeIndex === i ? 'text-blue-600 dark:text-white' : 'text-gray-300 dark:text-zinc-600'}`} />
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: {
                        type: "spring",
                        damping: 25,
                        stiffness: 200,
                      },
                    }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-[3.25rem] pr-4 pb-8 text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-normal max-w-2xl">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Minimal CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-24 text-center"
        >
          <p className="text-gray-500 dark:text-zinc-500 mb-4">Still wondering?</p>
          <a href="#" className="inline-flex items-center text-gray-900 dark:text-white font-medium border-b border-gray-200 dark:border-zinc-800 pb-0.5 hover:border-gray-900 dark:hover:border-white transition-colors">
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  );
};
