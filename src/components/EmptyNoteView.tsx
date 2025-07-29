import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import type { User } from "better-auth/types";
import type { Capture } from "../types/Capture";
import { authClient } from "../lib/auth-client";
import { CaptureService } from "../api/capture.api";
import debounce from "lodash.debounce";
import { SearchResultCard } from "./cards/searchResultCard";

const EmptyNoteView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [authInfo, setAuthInfo] = useState<User>();
  const [loading, setLoading] = useState(false);
  const cache = useRef<Map<string, Capture[]>>(new Map());

  // 🌐 Debounced search handler
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) {
        setCaptures([]);
        return;
      }

      if (cache.current.has(term)) {
        setCaptures(cache.current.get(term)!);
        return;
      }

      try {
        setLoading(true);
        const results = await CaptureService.search(term);
        cache.current.set(term, results);
        setCaptures(results);
      } catch (error) {
        console.error("Error fetching captures:", error);
        setCaptures([]);
      } finally {
        setLoading(false);
      }
    }, 400),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    async function getUserInfo() {
      const auth = await authClient.getSession();
      setAuthInfo(auth?.data?.user);
    }
    getUserInfo();
  }, []);

  const time = new Date().getHours();
  const greeting =
    time < 12 ? "Good morning" : time < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f5f7] flex flex-col items-center px-5 relative overflow-hidden">
      {/* Subtle noise texture */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxmaWx0ZXIgaWQ9Im5vaXNlIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC43IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')]" />
      </div>

      {/* Ultra-subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a]" />

      {/* Content container */}
      <div className="w-full max-w-2xl mt-16 z-10 flex flex-col">
        {/* App branding - minimal Apple-style */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-light tracking-tight text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5f5f7] to-[#f5f5f7]/80 font-medium">
              Deepen
            </span>
          </h1>
        </motion.div>

        {/* Greeting - precise Apple typography */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2.5 mb-1"
        >
          <p className="text-[#86868b] text-[17px]">{greeting},</p>
          <p className="text-[#f5f5f7] text-[17px] font-medium capitalize">
            {authInfo?.name?.split(" ")?.[0]}
          </p>
        </motion.div>

        {/* Prompt - SF Pro display style */}
        <motion.h2
          className="text-[32px] leading-[1.1] font-medium mb-8 max-w-[480px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            backgroundImage: "linear-gradient(to right, #fff, #aaa)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          What would you like to discover?
        </motion.h2>

        {/* Search input - Apple precision */}
        <motion.div
          className="relative w-full mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative flex items-center bg-[#1a1a1a] rounded-[12px] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors duration-200">
            <FiSearch className="absolute left-4 text-[#86868b]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                authInfo
                  ? `Search ${authInfo.name?.split(" ")[0]}'s knowledge...`
                  : "Search your knowledge..."
              }
              className="w-full bg-transparent rounded-[12px] py-[14px] pl-12 pr-4 text-[#f5f5f7] placeholder-[#86868b] focus:outline-none text-[17px] leading-none tracking-tight"
              autoComplete="off"
            />
          </div>
        </motion.div>

        {/* Results */}
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SearchResultCard
              captures={captures}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              loading={loading}
            />
          </motion.div>
        )}
      </div>

      {/* Footer - Apple-style subtle status */}
      <motion.div
        className="fixed bottom-6 text-[#86868b] text-[13px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {captures.length > 0 && (
          <span>{captures.length} {captures.length === 1 ? "result" : "results"}</span>
        )}
      </motion.div>
    </div>
  );
};

export default EmptyNoteView;