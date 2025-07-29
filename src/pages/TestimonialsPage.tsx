export const TestimonialsPage = () => {
  const testimonials = [
    {
      quote: "Deepen helped me untangle my thoughts. Now I don't just save ideas, I grow them.",
      author: "@mindarchitect (Cognitive Scientist)",
      highlight: false
    },
    {
      quote: "I've used Notion. I've used Evernote. But Deepen thinks with me, not just for me.",
      author: "Ava R., UX Strategist",
      highlight: true
    },
    {
      quote: "From brainstorming to breakthroughs—Deepen became my second brain.",
      author: "Jae, Startup Founder",
      highlight: false
    },
    {
      quote: "Minimalism with meaning. Deepen lets me focus without friction.",
      author: "anonymous (Digital Minimalist)",
      highlight: false
    },
    {
      quote: "Feels like my thoughts finally have a home. And it's beautiful.",
      author: "Leni, Educator & Coach",
      highlight: true
    },
  ];

  return (
    <section className="min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Material Design typography */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-normal tracking-tight text-white mb-4">
            What People Are Saying
          </h2>
          <div className="w-24 h-1 bg-violet-400 mx-auto mb-6"></div>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Feedback from real minds using Deepen
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className={`rounded-xl p-6 transition-all duration-300 `}
            >
              <div className={`text-5xl mb-4 ${t.highlight ? "text-violet-300" : "text-gray-500"}`}>
                "
              </div>
              <p className="text-lg text-gray-100 mb-6">
                {t.quote}
              </p>
              <p className="text-sm text-gray-400">
                — {t.author}
              </p>
            </div>
          ))}
        </div>

        {/* Material Design footer */}
        <div className="mt-20 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-500 text-sm">
            Want to share your experience? <span className="text-violet-400 hover:text-violet-300 cursor-pointer">Leave feedback</span>
          </p>
        </div>
      </div>
    </section>
  );
};