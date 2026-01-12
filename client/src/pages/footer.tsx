import { motion } from "framer-motion";
import { useState } from "react";
import { api } from "../api";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export const Footer = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || isLoading) return;
      
      setIsLoading(true);
  
      await api
        .post("/waitlist/join", { email })
        .then((res) => {
          setSubmitted(true);
          toast.success(res.data.message || "You're on the list");
        })
        .catch((error) => {
          console.error("Error joining waitlist:", error);
          toast.error("Please check your email and try again");
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

  return (
    <footer className="relative w-full bg-white dark:bg-black overflow-hidden pt-24 pb-12 border-t border-gray-100 dark:border-white/5">
      {/* Cinematic Spotlight Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50/50 via-transparent to-transparent dark:from-blue-900/10 dark:via-transparent dark:to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center">
        
        {/* Main Content Area */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                >
                    <h1 className="serif text-7xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        Stay ahead of the curve.
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md text-lg leading-relaxed">
                        Join the waitlist to get early access to our advanced content analysis tools. Organising the web has never been this powerful.
                    </p>
                </motion.div>

                <motion.form 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2 max-w-md relative group"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur-sm"></div>
                    <div className="relative flex w-full bg-white dark:bg-white/5 rounded-xl p-1.5 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                        <input 
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            disabled={submitted || isLoading}
                            type="email" 
                            placeholder="enter your email..."
                            className="flex-1 bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 text-sm px-4 focus:outline-none focus:ring-0"
                        />
                        <button
                            type="submit"
                            disabled={submitted || isLoading}
                            className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading ? "Joining..." : submitted ? "Joined" : "Join Waitlist"}
                            {!isLoading && !submitted && <ArrowRight size={14} />}
                        </button>
                    </div>
                </motion.form>
            </div>

            <div className="hidden md:flex justify-end gap-12 text-sm text-gray-500 dark:text-gray-400">
                <ul className="space-y-4">
                    <li className="font-semibold text-gray-900 dark:text-white tracking-wider uppercase text-xs">Platform</li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors">Extensions</a></li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors">Changelog</a></li>
                </ul>
                <ul className="space-y-4">
                    <li className="font-semibold text-gray-900 dark:text-white tracking-wider uppercase text-xs">Legal</li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy</a></li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors">Terms</a></li>
                </ul>
            </div>
        </div>

        {/* MASSIVE CINEMATIC TEXT */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="relative w-full select-none"
        >
            <h1 className="text-[18vw] leading-[0.8] font-black text-center tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-transparent dark:from-white/20 dark:to-transparent pointer-events-none">
                DEEPEN
            </h1>
            
            {/* Overlay gradient to fade bottom of text into background */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-black to-transparent" />
        </motion.div>

        {/* Footer Bottom Bar */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 py-8 border-t border-gray-100 dark:border-white/5 mt-[-4vw] relative z-20">
            <p className="text-xs text-gray-400 dark:text-zinc-600">
                © {new Date().getFullYear()} Deepen Labs Inc.
            </p>
            <div className="flex gap-6">
                {/* Social icons could go here */}
            </div>
        </div>

      </div>
    </footer>
  );
};
