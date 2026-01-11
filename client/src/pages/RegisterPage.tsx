import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
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

  // same CALLBACK_URL logic
  const CALLBACK_URL =
    (import.meta.env.VITE_AUTH_CALLBACK_URL as string) ||
    ((import.meta.env.VITE_CLIENT_BASE_URL as string) ||
      window.location.origin) + "/in";

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authClient.signUp.email(
        {
          ...formData,
          callbackURL: CALLBACK_URL,
        },
        {
          onRequest: () => {
            toast.loading("Signing in...");
          },
          onSuccess: () => {
            toast.dismiss();
            toast.success("Successfully logged in");
            setLoading(false); // Keep loading until navigation completes
          },
          onError: (ctx) => {
            toast.dismiss();
            toast.error(ctx.error.message || "Invalid credentials");
            setLoading(false);
          },
        },
      );
    } catch (error) {
      toast.error("Error occurred while signing in");
      console.error("Login failed", error);
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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[.75fr_1.25fr]">
      {/* Premium dark textured background */}
   

      {/* Back button with refined animation */}
      <div className="h-full w-full relative overflow-hidden
        before:absolute before:w-[30%] before:h-[30%]  before:content-[''] before:bg-[#837663] before:blur-3xl
        after:absolute after:w-[30%] after:h-[30%]  after:content-[''] after:bg-[#474847] after:bottom-0 after:right-0 after:blur-3xl
      ">

      <div className="h-full w-full bg-[#6b6d6a1f] grid grid-rows-3 p-4 relative z-100 backdrop-blur-3xl justify-center items-center">

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="absolute top-6 left-6"
      >
        <Link
          to="/"
          className="text-[#ffffff] hover:text-[#64b5ff] transition-colors flex items-center gap-1.5 group"
        >
          <span className="text-sm font-medium">Back</span>
        </Link>
      </motion.div>
      <div className="flex items-center gap-2 text-4xl justify-center opacity-5">
        
        <h1 className="text-8xl">Deepen</h1>
      </div>
      <div className="text-center w-full grid place-items-center">
        <h1 className="text-4xl font-bold text-left leading-tight">
          Capture.<br /> Organize.<br /> Understand <br /> Instantly.
        </h1>
        
      </div>
      <div className="text-center">
        <div className="relative flex items-center justify-center">
         <div className="flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gray-500 relative border-2 border-black"></div>
          <div className="w-10 h-10 rounded-full bg-gray-500 relative border-2 border-black -left-5"></div>
          <div className="w-10 h-10 rounded-full bg-gray-500 relative border-2 border-black -left-10"></div>
          <div className="w-10 h-10 rounded-full bg-gray-500 relative border-2 border-black -left-15"></div>
          <div className="w-10 h-10 rounded-full bg-gray-500 relative border-2 border-black -left-20"></div>
         </div>
        <h2 className="text-2xl font-bold text-center relative -left-18">Join 1200+ users</h2>
        </div>
        <p className="text-sm text-gray-500">Be among the first to experience contextual intelligence that truly comprehends.</p>
      </div>
      </div>
      </div>

      {/* Elevated registration card with glass morphism effect */}
      <div className="h-full w-full grid place-items-center">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl p-8  overflow-hidden">
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
                    <span className="font-medium text-sm tracking-wide">
                      Create Account
                    </span>
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
            <span className="px-3 text-[#636366]/70 text-xs font-medium">
              ALREADY REGISTERED?
            </span>
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
    </div>
  );
};
