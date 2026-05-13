import { motion } from "framer-motion";
import { Brain, Zap, Layers, Shield, MoveLeft, Lightbulb, Network } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Manifesto = () => {
  const principles = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Flow State Capture",
      description: "Information capture should never interrupt your thought process. We believe in tools that vanish into your workflow, allowing you to save the web as fast as you can think."
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "Synthesis Over Storage",
      description: "Bookmarks are where ideas go to die. We build systems that actively connect, summarize, and resurface knowledge, turning a static archive into a living second brain."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Augmented, Not Automated",
      description: "AI shouldn't do the thinking for you; it should help you think deeper. Our intelligence layer acts as a sparring partner for your mind, finding patterns you might miss."
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Context is King",
      description: "A link without context is noise. We preserve not just the content, but the 'why' and 'when'—maintaining the cognitive breadcrumbs that lead back to your original insight."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Sovereignty of Thought",
      description: "Your digital memory is an extension of your mind. It must be private, portable, and yours alone. We encrypt by default and never monetize your data."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 relative overflow-hidden transition-colors duration-300">
      
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link 
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100/50 dark:bg-white/5 hover:bg-gray-200/50 dark:hover:bg-white/10 transition-all text-sm font-medium text-gray-600 dark:text-gray-300 backdrop-blur-sm border border-gray-200/50 dark:border-white/5"
        >
          <MoveLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gray-100/40 dark:bg-zinc-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-zinc-100/40 dark:bg-zinc-900/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjwvc3ZnPg==')] opacity-[0.03] text-black dark:text-white" />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-32">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-400 text-xs font-semibold tracking-wider uppercase mb-6 border border-gray-200 dark:border-zinc-800">
            <Lightbulb className="w-3 h-3" />
            <span>Our Philosophy</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 text-gray-900 dark:text-white">
            The Deepen <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-900 dark:from-gray-400 dark:to-white">
              Manifesto.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We are building the operating system for the curious mind. <br className="hidden sm:block" />
            Here are the principles that guide every pixel we place.
          </p>
        </motion.div>

        {/* Principles Timeline */}
        <div className="relative space-y-20 before:absolute before:inset-0 before:ml-[1.5rem] md:before:ml-[50%] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-zinc-800 before:to-transparent">
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`relative flex items-center md:justify-between md:gap-16 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Icon Marker */}
              <div className="absolute left-[1.5rem] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-black border-4 border-gray-50 dark:border-zinc-900 z-10 shadow-lg shadow-gray-200/50 dark:shadow-black/50">
                <div className="w-full h-full rounded-full bg-gray-50 dark:bg-zinc-900 flex items-center justify-center text-gray-900 dark:text-white">
                  {principle.icon}
                </div>
              </div>

              {/* Content Card */}
              <div className={`ml-16 md:ml-0 md:w-[45%] ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                <div className="p-6 md:p-8 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors duration-300 group">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-black dark:group-hover:text-white transition-colors">
                    {principle.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
              
              {/* Spacer for the other side */}
              <div className="hidden md:block md:w-[45%]" />
            </motion.div>
          ))}
        </div>

        {/* Footer Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <div className="inline-block p-px rounded-full bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 dark:from-zinc-800 dark:via-zinc-600 dark:to-zinc-800 mb-8">
            <button 
                onClick={() => window.location.href = "/waitlist"}
                className="px-8 py-3 rounded-full bg-white dark:bg-black text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all duration-300"
            >
              Join the Movement
            </button>
          </div>
          <p className="text-sm text-gray-400 dark:text-zinc-600 tracking-widest uppercase">
            Est. 2026 • San Francisco
          </p>
        </motion.div>
      </div>
    </div>
  );
};
