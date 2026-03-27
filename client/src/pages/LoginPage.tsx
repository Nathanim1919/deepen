import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { authClient } from "../lib/auth-client";
import { getPostAuthCallbackUrl } from "../lib/auth-callback-url";
import { toast } from "sonner";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const CALLBACK_URL = getPostAuthCallbackUrl();
  // Disable all interactive elements when loading
  const disableAll = loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await authClient.signIn.email(
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
      if (!disableAll) {
        setLoading(false);
      }
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    if (loading) return;

    setLoading(true);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: CALLBACK_URL,

        fetchOptions: {
          onRequest: () => {
            toast.loading(`Signing in with ${provider}...`);
          },
          onSuccess: () => {
            toast.dismiss();
            toast.success("Successfully logged in");
            setLoading(false); // Keep loading until navigation completes
          },
          onError: (ctx) => {
            toast.dismiss();
            toast.error(ctx.error.message || "Login failed");
            setLoading(false);
          },
        },
      });
    } catch (error) {
      toast.error("Error occurred during social login");
      console.error(`${provider} login failed`, error);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => handleSocialSignIn("google");
  const handleGithubSignIn = () => handleSocialSignIn("github");

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
          className={`text-[#2997ff] hover:text-[#64b5ff] transition-colors flex items-center gap-1.5 group ${
            disableAll ? "pointer-events-none opacity-70" : ""
          }`}
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </motion.div>

      {/* Elevated login card with glass morphism effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl p-8 shadow-2xl overflow-hidden relative">
          {/* Loading overlay */}
          {disableAll && (
            <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
              />
            </div>
          )}

          {/* Sophisticated header with subtle gradient */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#ffffff] to-[#a1a1a6]">
              Welcome Back
            </h1>
            <p className="text-[#aeaeb2]/80 text-sm">Sign in to continue</p>
          </motion.div>

          {/* Social login buttons - side by side */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 mb-6"
          >
            <motion.button
              onClick={handleGoogleSignIn}
              disabled={disableAll}
              whileHover={{ scale: disableAll ? 1 : 1.02 }}
              whileTap={{ scale: disableAll ? 1 : 0.98 }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl ${
                disableAll
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
              disabled={disableAll}
              whileHover={{ scale: disableAll ? 1 : 1.02 }}
              whileTap={{ scale: disableAll ? 1 : 0.98 }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl ${
                disableAll
                  ? "bg-[#2c2c2e] cursor-not-allowed"
                  : "bg-[#2c2c2e] hover:bg-[#3a3a3c] cursor-pointer"
              } transition-all relative overflow-hidden border border-[#3a3a3c]/50`}
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity" />
              <Github className="text-lg text-[#f5f5f7]" />
              <span className="text-sm font-medium">GitHub</span>
            </motion.button>
          </motion.div>

          {/* Refined divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center my-6"
          >
            <div className="flex-1 border-t border-[#2c2c2e]/50"></div>
            <span className="px-3 text-[#636366]/70 text-xs font-medium">
              OR CONTINUE WITH
            </span>
            <div className="flex-1 border-t border-[#2c2c2e]/50"></div>
          </motion.div>

          {/* Premium form with refined animations */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <label className="block text-xs font-medium text-[#aeaeb2]/80 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#636366]/80 w-4 h-4" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-9 pr-4 py-2.5 bg-[#2c2c2e]/70 rounded-lg focus:ring-2 focus:ring-[#0071e3]/50 focus:outline-none border border-[#3a3a3c]/50 hover:border-[#3a3a3c] transition-all text-sm placeholder-[#636366]/50"
                  placeholder="your@email.com"
                  required
                  disabled={disableAll}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, type: "spring" }}
            >
              <label className="block text-xs font-medium text-[#aeaeb2]/80 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#636366]/80 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-9 pr-10 py-2.5 bg-[#2c2c2e]/70 rounded-lg focus:ring-2 focus:ring-[#0071e3]/50 focus:outline-none border border-[#3a3a3c]/50 hover:border-[#3a3a3c] transition-all text-sm placeholder-[#636366]/50"
                  placeholder="••••••••"
                  required
                  disabled={disableAll}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#636366]/80 hover:text-[#aeaeb2] transition-colors"
                  disabled={disableAll}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="pt-1"
            >
              <button
                type="submit"
                disabled={disableAll}
                className={`w-full py-3 px-6 rounded-lg ${
                  disableAll
                    ? "bg-[#0071e3]/70 cursor-not-allowed"
                    : "bg-[#0071e3] hover:bg-[#2997ff] cursor-pointer"
                } transition-all flex justify-center items-center gap-2 relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {disableAll ? (
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
                  <span className="font-medium text-sm tracking-wide">
                    Sign In
                  </span>
                )}
              </button>
            </motion.div>
          </form>

          {/* Minimal footer links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-center text-xs text-[#636366]/80"
          >
            <div className="flex justify-center gap-4">
              <Link
                to="/forgot-password"
                className={`hover:text-[#2997ff] ${
                  disableAll
                    ? "pointer-events-none opacity-70"
                    : "cursor-pointer"
                } transition-colors`}
              >
                Forgot password?
              </Link>
              <Link
                to="/register"
                className={`hover:text-[#2997ff] ${
                  disableAll
                    ? "pointer-events-none opacity-70"
                    : "cursor-pointer"
                } transition-colors`}
              >
                Create account
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
