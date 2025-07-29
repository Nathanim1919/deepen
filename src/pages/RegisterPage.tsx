import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import { authClient } from "../lib/auth-client";
import { toast } from "sonner";

export const RegisterPage = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await authClient.signUp.email({
        ...formData,
        callbackURL: "https://deepen.live/in",
        // callbackURL: "http://localhost:5173/in",
        
      });
      setFormData({ name: "", email: "", password: "" });
      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      toast.success("Registration successful! Redirecting...");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      setFormData({ name: "", email: "", password: "" });
      // Optionally log the error for debugging
      console.error("Registration failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "https://deepen.live/in",
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
          toast.success("your request is on a process ...");
        },
        onSuccess: () => {
          toast.success("successfully loggedIn ...");
          setLoading(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setLoading(false);
        },
      },
    });
  };

  const handleGithubSignIn = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "https://deepen.live/in",
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          toast.success("Registration successful! Redirecting...");
          setLoading(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setLoading(false);
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f7] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium dark textured background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)] opacity-20" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(40,151,255,0.03)_0%,_transparent_50%)]" />

      {/* Back button with refined animation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="absolute top-6 left-6"
      >
        <Link
          to="/"
          className="text-[#2997ff] hover:text-[#64b5ff] transition-colors flex items-center gap-1.5 group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </motion.div>

      {/* Elevated registration card with glass morphism effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="w-full max-w-md"
      >
        <div className="bg-[#161618]/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-[#2c2c2e]/50 overflow-hidden">
          {/* Sophisticated header with subtle gradient */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#ffffff] to-[#a1a1a6]">
              Create Account
            </h1>
            <p className="text-[#aeaeb2]/80 text-sm">Join our community</p>
          </motion.div>

          {/* Registration Form */}
          <form onSubmit={handleRegistration} className="space-y-4">
            {/* Name Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <label className="block text-xs font-medium text-[#aeaeb2]/80 mb-2 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#636366]/80 w-4 h-4" />
                <input
                  type="text"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#2c2c2e]/70 rounded-lg focus:ring-2 focus:ring-[#0071e3]/50 focus:outline-none border border-[#3a3a3c]/50 hover:border-[#3a3a3c] transition-all text-sm placeholder-[#636366]/50"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <label className="block text-xs font-medium text-[#aeaeb2]/80 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#636366]/80 w-4 h-4" />
                <input
                  type="email"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#2c2c2e]/70 rounded-lg focus:ring-2 focus:ring-[#0071e3]/50 focus:outline-none border border-[#3a3a3c]/50 hover:border-[#3a3a3c] transition-all text-sm placeholder-[#636366]/50"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <label className="block text-xs font-medium text-[#aeaeb2]/80 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#636366]/80 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-9 pr-10 py-2.5 bg-[#2c2c2e]/70 rounded-lg focus:ring-2 focus:ring-[#0071e3]/50 focus:outline-none border border-[#3a3a3c]/50 hover:border-[#3a3a3c] transition-all text-sm placeholder-[#636366]/50"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#636366]/80 hover:text-[#aeaeb2] transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-[#636366]/60">
                Use 8+ characters with a mix of letters, numbers & symbols
              </p>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="pt-2"
            >
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg ${
                  loading
                    ? "bg-[#0071e3]/70 cursor-not-allowed"
                    : "bg-[#0071e3] hover:bg-[#2997ff] cursor-pointer"
                } transition-all flex justify-center items-center gap-2 relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {loading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <span className="font-medium text-sm tracking-wide">Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          </form>

          {/* Social login buttons - side by side */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-3 mt-6"
          >
            <motion.button
              onClick={handleGoogleSignIn}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl ${
                loading
                  ? "bg-[#2c2c2e] cursor-not-allowed"
                  : "bg-[#2c2c2e] hover:bg-[#3a3a3c] cursor-pointer"
              } transition-all relative overflow-hidden border border-[#3a3a3c]/50`}
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity" />
              <FcGoogle className="text-lg" />
              <span className="text-sm font-medium">Google</span>
            </motion.button>

            <motion.button
              onClick={handleGithubSignIn}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl ${
                loading
                  ? "bg-[#2c2c2e] cursor-not-allowed"
                  : "bg-[#2c2c2e] hover:bg-[#3a3a3c] cursor-pointer"
              } transition-all relative overflow-hidden border border-[#3a3a3c]/50`}
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity" />
              <FaGithub className="text-lg text-[#f5f5f7]" />
              <span className="text-sm font-medium">GitHub</span>
            </motion.button>
          </motion.div>

          {/* Refined divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center my-6"
          >
            <div className="flex-1 border-t border-[#2c2c2e]/50"></div>
            <span className="px-3 text-[#636366]/70 text-xs font-medium">ALREADY REGISTERED?</span>
            <div className="flex-1 border-t border-[#2c2c2e]/50"></div>
          </motion.div>

          {/* Login link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Link
              to="/login"
              className={`block w-full text-center py-2.5 px-6 rounded-lg font-medium text-sm text-[#2997ff] border border-[#3a3a3c]/50 hover:bg-[#2c2c2e]/50 transition-colors ${
                loading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              Sign in to your account
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};