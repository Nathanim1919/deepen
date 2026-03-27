import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, MoveLeft } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import { authClient } from "../lib/auth-client";
import { getPostAuthCallbackUrl } from "../lib/auth-callback-url";
import { toast } from "sonner";
import ImageForDark from "../assets/img1.png";
import ImageForLight from "../assets/img2.png";
import { useUIStore } from "../stores/ui-store";

const useDarkMode = () => {
  const { theme } = useUIStore();
  return theme === "dark";
}

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const CALLBACK_URL = getPostAuthCallbackUrl();

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
      callbackURL: CALLBACK_URL,
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
      callbackURL: CALLBACK_URL,
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
    <div className="min-h-screen relative grid grid-cols-1 md:grid-cols-[.8fr_1.25fr]">
      <div
        className="h-full w-full relative overflow-hidden hidden md:block
 
      "
      >
  <img
            src={useDarkMode() ? ImageForDark : ImageForLight}
            alt="Background Image"
            className="w-full object-cover  absolute top-[30%] -right-[50%] z-10"
          />
         

        <div className="h-full w-full z-100 grid place-content-end">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="z-1000 cursor-pointer absolute top-4 left-4"
          >
            <Link
              to="/"
              className="dark:text-[#ffffff] text-[#000000] hover:text-[#64b5ff] transition-colors flex items-center gap-1.5 group"
            >
              <span className="text-sm font-medium flex items-center gap-1">
                <MoveLeft/>
              </span>
            </Link>
          </motion.div>
      
         <div className="flex flex-col justify-around h-screen bg-gradient-to-t  dark:from-black from-white to-transparent p-6 absolute bottom-0 left-0 z-100">

          <div className="flex flex-col items-start font-bold relative z-100">
            <motion.h1
              initial={{
                opacity: 0,
                left: -100,
              }}
              animate={{
                left: 0,
                opacity: 100,
              }}
              transition={{
                left: 0,
                duration: 2.5,
              }}
              className="text-6xl relative font-bold text-left leading-tight dark:text-black text-white dark:bg-white bg-black px-2 shadow-2xl"
            >
              Capture
            </motion.h1>
            
            <motion.h1
              initial={{
                opacity: 0,
                left: -100,
              }}
              animate={{
                left: 0,
                opacity: 100,
              }}
              transition={{
                left: 0,
                duration: 2.5,
              }}
              className="text-6xl ml-4 relative font-bold text-left leading-tight text-black dark:text-gray-400"
            >
              Organize
            </motion.h1>
            
            <motion.h1
              initial={{
                opacity: 0,
                top: -100,
              }}
              animate={{
                top: 0,
                opacity: 100,
              }}
              transition={{
                duration: 0.5,
              }}
              className="text-6xl relative font-bold text-left leading-tight  dark:text-black text-white dark:bg-white bg-black px-2 shadow-2xl"
            >
              Understand{" "}
            </motion.h1>
            
            <motion.h1
              initial={{
                opacity: 0,
                right: -100,
              }}
              animate={{
                right: 0,
                opacity: 100,
              }}
              transition={{
                duration: 0.5,
              }}
              className="text-6xl ml-4 relative font-bold text-left leading-tight text-black dark:text-gray-400"
            >
              Instantly.
            </motion.h1>
          </div>
          <div className="grid gap-1">
            <div className="relative flex items-center">
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-full dark:bg-gray-500 bg-gray-200 relative border-2 dark:border-black border-gray-100"></div>
                <div className="w-10 h-10 rounded-full dark:bg-gray-500 bg-gray-200 relative border-2 dark:border-black border-gray-100 -left-5"></div>
                <div className="w-10 h-10 rounded-full dark:bg-gray-500 bg-gray-200 relative border-2 dark:border-black border-gray-100 -left-10"></div>
                 <div className="w-10 h-10 rounded-full dark:bg-gray-500 bg-gray-200 relative border-2 dark:border-black border-gray-100 -left-15"></div>
                <div className="w-10 h-10 rounded-full dark:bg-gray-500 bg-gray-200 relative border-2 dark:border-black border-gray-100 -left-20"></div> 
              </div>
              <h2 className="text-2xl font-bold text-center relative -left-18">
                Join <span className="dark:text-black text-white dark:bg-white bg-black shadow-2xl px-2">100+</span> users
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Be among the first to experience contextual intelligence that
              truly comprehends.
            </p>
          </div>
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
              className="text-center mb-8 grid place-items-center"
            >
              <h1 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r dark:from-[#ffffff] from-[#000000] to-[#a1a1a6]">
                Create Account
              </h1>
              <p className="text-gray-200 font-bold px-2 dark:text-black text-sm bg-black dark:bg-white">Join our community</p>
            </motion.div>

            {/* Registration Form */}
            <form onSubmit={handleRegistration} className="space-y-4">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <label className="block text-xs font-medium darK:text-[#aeaeb2]/80  mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#636366]/80 w-4 h-4" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-4 py-2.5 dark:bg-[#2c2c2e]/70 bg-[#eee] rounded-lg focus:ring-2 focus:ring-[#0071e3]/50 focus:outline-none border border-[#3a3a3c]/50 hover:border-[#3a3a3c] transition-all text-sm placeholder-[#636366]/50"
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
                    className="w-full pl-9 pr-4 py-2.5 dark:bg-[#2c2c2e]/70 bg-[#eee] rounded-lg focus:ring-2 focus:ring-[#0071e3]/50 focus:outline-none border border-[#3a3a3c]/50 hover:border-[#3a3a3c] transition-all text-sm placeholder-[#636366]/50"
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
                    className="w-full pl-9 pr-10 py-2.5 dark:bg-[#2c2c2e]/70 bg-[#eee] rounded-lg focus:ring-2 focus:ring-[#0071e3]/50 focus:outline-none border border-[#3a3a3c]/50 hover:border-[#3a3a3c] transition-all text-sm placeholder-[#636366]/50"
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
                  className={`w-full py-3 px-6 rounded-lg ${loading
                      ? "dark:bg-[#0071e3]/70 bg-[#0071e3]/70 cursor-not-allowed"
                      : "dark:bg-[#0071e3] bg-[#0071e3] hover:bg-[#2997ff] cursor-pointer"
                    } transition-all flex justify-center items-center gap-2 relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 dark:bg-white/10 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl ${loading
                    ? "dark:bg-[#2c2c2e] bg-[#eee] cursor-not-allowed"
                    : "dark:bg-[#2c2c2e] bg-[#eee] dark:hover:bg-[#3a3a3c] hover:bg-[#e8e8ea] cursor-pointer"
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
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl ${loading
                    ? "dark:bg-[#2c2c2e] bg-[#eee] cursor-not-allowed"
                    : "dark:bg-[#2c2c2e] bg-[#eee] dark:hover:bg-[#3a3a3c] hover:bg-[#e8e8ea] cursor-pointer"
                  } transition-all relative overflow-hidden border border-[#3a3a3c]/50`}
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity" />
                <FaGithub className="text-lg dark:text-[#f5f5f7] text-[#000000]" />
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
                className={`block w-full text-center py-2.5 px-6 rounded-lg font-medium text-sm dark:text-[#2997ff] text-[#000000] border border-[#3a3a3c]/50 hover:bg-[#e8e8ea] dark:hover:bg-[#3a3a3c]/50 transition-colors ${loading ? "cursor-not-allowed" : "cursor-pointer"
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
