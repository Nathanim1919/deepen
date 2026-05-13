import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "I switched from Notion for bookmarking and it just clicks. Simple, fast, does what I need.",
    author: "Ava R.",
    role: "UX Strategist",
    initials: "AR",
  },
  {
    quote: "Brain Chat is the feature that sold me. I can actually talk to my saved articles.",
    author: "Jae",
    role: "Startup Founder",
    initials: "JK",
  },
  {
    quote: "Finally a tool that doesn't try to do everything. It captures, it organizes, it works.",
    author: "Leni",
    role: "Educator",
    initials: "LT",
  },
];

export const TestimonialsPage = () => {
  return (
    <section className="text-gray-900 dark:text-white py-24 px-6 bg-gray-50/80 dark:bg-white/[0.02]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            What early users are saying
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Feedback from real minds using Deepen
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="rounded-2xl p-6 border border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none hover:border-gray-200 dark:hover:border-white/10 transition-all duration-300 flex flex-col justify-between"
            >
              <p className="text-base text-gray-700 dark:text-gray-200 mb-6 leading-relaxed">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-semibold flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t.author}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Want to share your experience?{" "}
            <a
              href="/feedback"
              className="text-blue-600 dark:text-violet-400 hover:text-blue-500 dark:hover:text-violet-300 font-medium transition-colors"
            >
              Leave feedback
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
