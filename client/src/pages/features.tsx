import React from "react";
import { motion } from "framer-motion";
import Image from "../assets/f1.png";
import Image2 from "../assets/f2.png";
import {
  Search,
  Brain,
  FolderOpen,
  Sparkles,
  MessageSquare,
  FileText,
  Globe,
  Layers,
  Tag,
  Zap,
  ArrowRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const smallFeatures = [
  {
    icon: Globe,
    title: "One-Click Web Capture",
    description:
      "Save any webpage, article, or PDF instantly with the Deepen browser extension. No copy-pasting. Full fidelity content capture.",
  },
  {
    icon: Tag,
    title: "Auto Smart Tagging",
    description:
      "Deepen reads your content and automatically applies relevant tags so you can filter and find things without manual effort.",
  },
  {
    icon: Layers,
    title: "Collections & Folders",
    description:
      "Organize your knowledge into structured folders and nested collections. Drag, nest, and arrange to match your mental model.",
  },
  {
    icon: FileText,
    title: "PDF Support",
    description:
      "Capture and read PDFs right inside Deepen. Highlights, notes, and AI summaries all work seamlessly on PDF documents.",
  },
  {
    icon: Zap,
    title: "Smart Clusters",
    description:
      "Deepen's AI surfaces thematic clusters across your saved content — automatically connecting dots you didn't know existed.",
  },
  {
    icon: MessageSquare,
    title: "Per-Source Chat",
    description:
      "Open any captured source and have a targeted AI conversation about that specific piece of content, like a tutor on demand.",
  },
];

const heroFeatures = [
  {
    tag: "AI-Powered Search",
    title: "Find anything by meaning, not memory.",
    description:
      "Deepen's semantic search understands what you're looking for even when you don't remember the exact words. It reads context, intent, and relevance — returning results that actually make sense.",
    bullets: [
      "Understands synonyms, concepts, and context",
      "Searches across all your saved sources at once",
      "Ranks results by semantic relevance, not just keywords",
    ],
    image: Image,
    icon: Search,
    accent: "from-blue-500 to-cyan-400",
    glow: "bg-blue-500/10",
  },
  {
    tag: "Brain Chat",
    title: "Your knowledge base, as a conversation.",
    description:
      "Ask questions and get answers grounded in your saved content. Deepen's AI synthesizes across everything you've captured — articles, notes, PDFs — and cites its sources.",
    bullets: [
      "Answers drawn from your actual saved content",
      "Cites the exact sources it references",
      "Supports multiple AI models including GPT-4 and Claude",
    ],
    image: Image2,
    icon: Brain,
    accent: "from-violet-500 to-purple-400",
    glow: "bg-violet-500/10",
  },
  {
    tag: "Smart Organizers",
    title: "Organize once. Discover forever.",
    description:
      "Stop manually sorting everything. Deepen watches your growing library and suggests smart folders, clusters related topics, and auto-assigns tags — so organization happens in the background.",
    bullets: [
      "AI-generated smart folders based on topic",
      "Automatic cluster detection across your library",
      "Intelligent tagging with zero manual effort",
    ],
    image: Image,
    icon: Sparkles,
    accent: "from-emerald-500 to-teal-400",
    glow: "bg-emerald-500/10",
  },
  {
    tag: "Collections",
    title: "Build a structured knowledge library.",
    description:
      "Group saved content into meaningful collections for any project, topic, or workflow. Share collections with your team or keep them private — your knowledge, your rules.",
    bullets: [
      "Nest folders for deep hierarchical organization",
      "Attach notes and highlights to any source",
      "Collaborate with teammates on shared collections",
    ],
    image: Image2,
    icon: FolderOpen,
    accent: "from-orange-500 to-amber-400",
    glow: "bg-orange-500/10",
  },
];

export const Features: React.FC = () => {
  return (
    <section className="w-full bg-white dark:bg-[#000000] text-gray-900 dark:text-white overflow-hidden">
      {/* ── Section Header ── */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
        
          <h2 className="text-5xl md:text-7xl font-bold">
            What can you do<br /> with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 dark:from-blue-400 dark:to-violet-400">
              Deepen?
            </span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl  leading-relaxed">
            A modern knowledge platform built around how you actually think.
            Capture the web, organize it with AI, and find answers in seconds.
          </p>
        </motion.div>
        <div className="absolute top-0 right-0 opacity-10">
          {/* brain icon */}
          <Brain className="w-100 h-100 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      {/* ── Small Feature Grid ── */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 dark:bg-white/[0.06]  overflow-hidden border border-gray-300 dark:border-white/[0.06]">
          {smallFeatures.map((feat, i) => (
            <motion.div
              key={feat.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="group cursor-pointer relative hover:bg-white hover:shadow-lg dark:bg-[#0a0a0a] p-7 flex flex-col gap-4 dark:hover:bg-white/[0.03] transition-colors"
            >
              <div className="absolute opacity-15 group-hover:opacity-100 transform rotate-12 group-hover:rotate-0 transition-all duration-300  top-2 right-2 rounded-lg flex items-center justify-center">
                <feat.icon size={80} className=" text-gray-500 dark:text-gray-400 group-hover:text-black-500 dark:group-hover:text-blue-400 transition-colors" />
              </div>
              <div className="mt-10 relative z-10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Hero Feature Showcases ── */}
      <div className="max-w-7xl mx-auto px-6 pb-28 flex flex-col gap-32">
        {heroFeatures.map((feat, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={feat.tag}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`flex flex-col relative ${
                isEven ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-12 lg:gap-16`}
            >
              {/* Text Side */}
              <div className="flex-1 flex flex-col gap-6 min-w-0">
                <div className={`absolute -top-10  opacity-30 text-9xl font-bold text-gray-500 dark:text-gray-400 ${isEven ? "-left-10" : "-right-10"}`}>
                  <h1>0{index + 1}</h1>
                </div>

                <h3 className="text-3xl relative z-10 md:text-4xl font-bold tracking-tight leading-[1.2]">
                  {feat.title}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-md">
                  {feat.description}
                </p>

                <ul className="flex flex-col gap-3">
                  {feat.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <span
                        className={`mt-0.5 w-4 h-4 rounded-full bg-gradient-to-br ${feat.accent} flex-shrink-0 flex items-center justify-center`}
                      >
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <a
                    href="#"
                    className={`inline-flex items-center gap-1.5 text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r ${feat.accent} hover:gap-3 transition-all`}
                  >
                    Learn more{" "}
                    <ArrowRight
                      className={`w-3.5 h-3.5 text-blue-500 dark:text-blue-400`}
                    />
                  </a>
                </div>
              </div>

              {/* Image Side */}
              <div className="flex-1 relative w-full min-w-0">
                {/* Glow */}
                <div
                  className={`absolute -inset-6 ${feat.glow} rounded-3xl blur-2xl -z-10`}
                />
                {/* Card frame */}
                <div className="relative rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden bg-gray-50 dark:bg-[#0d0d0d] shadow-2xl">
                  {/* Toolbar chrome */}
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#111]">
                    <span className="w-3 h-3 rounded-full bg-red-400/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <span className="w-3 h-3 rounded-full bg-green-400/80" />
                    <div className="ml-3 flex-1 max-w-[180px] h-5 rounded-md bg-gray-100 dark:bg-white/[0.05]" />
                  </div>
                  <img
                    src={feat.image}
                    alt={feat.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Bottom Banner ── */}
      <div className="border border-gray-100 dark:border-white/[0.06] bg-gray-100 dark:bg-white/[0.06] relative overflow-hidden
      before:absolute before:w-[400px] before:h-[400px] before:transform before:-top-[10%] before:left-[0%] before:rotate-45 before:translate-y-[-50%] before:content-[''] before:animate-pu before:bg-blue-200 dark:before:bg-violet-600
      after:absolute after:w-[300px] after:h-[300px] after:transform after:top-[30%] after:right-[0%] after:content-[''] after:bg-gradient-to-t after:bg-blue-300 after:rotate-30
      ">
        {/* Floating decorative icons */}
        {[
          { Icon: Brain,        top: "12%",  left: "6%",   size: 36, delay: 0,    rotate: -15 },
          { Icon: FolderOpen,   top: "65%",  left: "3%",   size: 28, delay: 0.15, rotate: 10  },
          { Icon: Globe,        top: "20%",  left: "18%",  size: 22, delay: 0.3,  rotate: 20  },
          { Icon: Search,       top: "75%",  left: "22%",  size: 24, delay: 0.2,  rotate: -8  },
          { Icon: Tag,          top: "10%",  right: "20%", size: 22, delay: 0.25, rotate: 12  },
          { Icon: Layers,       top: "55%",  right: "6%",  size: 32, delay: 0.1,  rotate: -20 },
          { Icon: Sparkles,     top: "78%",  right: "18%", size: 20, delay: 0.35, rotate: 5   },
          { Icon: FileText,     top: "30%",  right: "3%",  size: 26, delay: 0.05, rotate: 15  },
          { Icon: MessageSquare,top: "42%",  left: "10%",  size: 20, delay: 0.4,  rotate: -6  },
          { Icon: Zap,          top: "88%",  right: "28%", size: 18, delay: 0.45, rotate: 8   },
        ].map(({ Icon, top, left, right, size, delay, rotate }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            style={{ top, left, right, rotate: `${rotate}deg` }}
            className="absolute z-100 pointer-events-none text-black dark:text-violet-400"
          >
            <Icon width={size} height={size} strokeWidth={1.2} />
          </motion.div>
        ))}
        <div className="relative z-10 mx-auto px-4 py-20 flex flex-col md:flex-row items-center justify-around gap-8 dark:bg-black/40 backdrop-blur-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <h3 className="text-5xl font-bold mb-3">
              Built for how you actually think.
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
              Deepen replaces scattered bookmarks, notes apps, and browser tabs
              with a single intelligent workspace for your entire web knowledge.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-shrink-0"
          >
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-full hover:shadow-[0_0_24px_-4px_rgba(59,130,246,0.6)] transition-all"
            >
              Start for free <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
