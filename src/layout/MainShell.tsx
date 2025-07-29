// src/layout/MainShell.tsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { VscLoading } from "react-icons/vsc";
import Sidebar from "../components/Sidebar";

import { CaptureProvider } from "../context/CaptureContext";
import { UIProvider } from "../context/UIContext";
import { FolderProvider } from "../context/FolderContext";
import { SourceProvider } from "../context/sourceContext";

import { authClient } from "../lib/auth-client";
import type { Session, User } from "better-auth/types";
import { ChatProvider } from "../context/ChatContext";
import { motion } from "framer-motion";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

export const MainShell = () => {
  const [session, setSession] = useState<{
    session: Session;
    user: User;
  } | null>(null);
  const [error, setError] = useState<{
    code?: string;
    message?: string;
    status: number;
    statusText: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hideSidebar, setHideSidebar] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data, error } = await authClient.getSession();
        if (error) {
          setError(error);
        } else {
          setSession(data);
        }
      } catch (err) {
        console.error("Unexpected error loading session:", err);
        setError(
          err as {
            code?: string;
            message?: string;
            status: number;
            statusText: string;
          }
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (!isLoading && !session) {
      navigate({ to: "/login" });
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return <CenteredLoader message="Loading session..." />;
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-red-500">
        <p>Error loading session: {error.message || "Unknown error"}</p>
      </div>
    );
  }

  if (!session) return null; // wait for redirect

  return (
    <CaptureProvider>
      <UIProvider>
        <ChatProvider>
          <FolderProvider>
            <SourceProvider>
              <div className="h-screen w-screen overflow-hidden">
                <div className="w-8 h-8 m-1 rounded-full grid md:hidden place-items-center fixed z-1000 bottom-0 bg-[#000000]">
                  {hideSidebar ? (
                    <ChevronsRight
                      className="relative z-50 cursor-pointer hover:text-white text-gray-600 md:hidden"
                      onClick={() => setHideSidebar(!hideSidebar)}
                    />
                  ) : (
                    <ChevronsLeft
                      className="relative z-50 cursor-pointer hover:text-white text-gray-600 md:hidden"
                      onClick={() => setHideSidebar(!hideSidebar)}
                    />
                  )}
                </div>
                <div className="h-screen w-screen bg-black text-white grid grid-cols-[0fr_1fr] md:grid-cols-[auto_1fr]">
                  <Sidebar
                    hideSidebar={hideSidebar}
                    setHideSidebar={setHideSidebar}
                    user={{ ...session.user, token: "your-token-value" }}
                  />
                  <main className="overflow-hidden h-full">
                    <Outlet />
                  </main>
                </div>
              </div>
            </SourceProvider>
          </FolderProvider>
        </ChatProvider>
      </UIProvider>
    </CaptureProvider>
  );
};

export const CenteredLoader = ({
  message = "Loading...",
}: {
  message?: string;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
  >
    <motion.div
      initial={{ scale: 0.95, y: 5 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 400 }}
      className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700/50 flex flex-col items-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="text-gray-300"
      >
        <VscLoading className="w-8 h-8" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 text-gray-300 font-medium tracking-tight text-lg"
      >
        {message}
      </motion.p>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "60%" }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="h-0.5 bg-gray-700/50 mt-6 rounded-full overflow-hidden"
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
          className="h-full w-1/2 bg-blue-500/90 rounded-full"
        />
      </motion.div>
    </motion.div>
  </motion.div>
);
