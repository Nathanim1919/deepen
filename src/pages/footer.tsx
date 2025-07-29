import { motion } from "framer-motion";
import { useState } from "react";
import { api } from "../api";
import { toast } from "sonner";
// import { FiTwitter, FiGithub, FiLinkedin, FiDribbble } from "react-icons/fi";

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
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-[#0A0A0A] text-zinc-400 px-6 lg:px-24 py-16 border-t border-white/5"
    >
      {/* Subtle grid texture */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <h2 className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-violet-600 mb-4">
              Deepen.
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400 mb-6">
              A modern extension for collecting and organizing web content efficiently.
            </p>
            
            {/* Subscription */}
            <div className="flex items-center gap-2">
              <input 
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled={submitted || isLoading}
                type="email" 
                placeholder="Get updates"
                className="bg-white/5 border border-white/10 text-sm rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
              <motion.button
                onClick={handleSubmit}
                disabled={submitted || isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
              >
               {
                isLoading ? "Joining..." : submitted ? "Joined!" : "Join Waitlist"
               }
              </motion.button>
            </div>
          </motion.div>

          {/* Navigation Links */}
          {/* {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Demo", "Extensions"]
            },
            {
              title: "Company",
              links: ["About", "Careers", "Blog", "Contact"]
            },
            {
              title: "Connect",
              links: ["Twitter", "GitHub", "LinkedIn", "Dribbble"]
            }
          ].map((section, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xs font-semibold text-zinc-300 mb-4 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <motion.li
                    key={j}
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a 
                      href="#" 
                      className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      {link === "Twitter" && <FiTwitter size={14} />}
                      {link === "GitHub" && <FiGithub size={14} />}
                      {link === "LinkedIn" && <FiLinkedin size={14} />}
                      {link === "Dribbble" && <FiDribbble size={14} />}
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))} */}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-12"
        />

        {/* "Deepen" Feature Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="relative inline-block">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-violet-500/10 rounded-full blur-xl" />
            
            {/* Main text with gradient */}
            <h2 className="text-6xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 relative">
              DEEPEN
            </h2>
            
            {/* Subtitle */}
            <p className="mt-4 text-sm text-zinc-500 uppercase tracking-wider">
              Advanced content analysis at your fingertips
            </p>
          </div>
        </motion.div>

        {/* Bottom Row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
        >
          <div className="text-zinc-500">
            © {new Date().getFullYear()} deepen. All rights reserved.
          </div>
          
          {/* <div className="flex items-center gap-6">
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">
              Cookies
            </a>
          </div> */}
        </motion.div>
      </div>
    </motion.footer>
  );
};