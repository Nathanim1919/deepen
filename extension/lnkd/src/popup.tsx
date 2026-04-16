import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useState } from "react"

import { authClient } from "./auth/auth-client"
import { capturePageData } from "./lib/capturePageData"

import "tailwindcss/tailwind.css"
import "./style.css"

// ─── Types ───────────────────────────────────────────────────

type CaptureState =
  | { status: "idle" }
  | { status: "waiting" }
  | { status: "extracting" }
  | { status: "saving" }
  | { status: "success" }
  | { status: "duplicate" }
  | { status: "error"; message: string }

type AuthState = "loading" | "authenticated" | "unauthenticated"

interface TabInfo {
  title: string
  url: string
  favIconUrl: string
  domain: string
}

interface CaptureItem {
  _id: string
  title: string
  url: string
  metadata?: { favicon?: string; capturedAt?: string }
}

// ─── Helpers ─────────────────────────────────────────────────

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return ""
  }
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str
  return str.slice(0, max - 1) + "\u2026"
}

const API_URL = process.env.PLASMO_PUBLIC_API_URL
const APP_URL = process.env.PLASMO_PUBLIC_APP_URL

// ─── Animation ──────────────────────────────────────────────

const spring = { type: "spring" as const, stiffness: 500, damping: 35, mass: 0.8 }

const fade = {
  initial: { opacity: 0, y: 6, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -4, filter: "blur(4px)" },
  transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
}

// ─── Logo Mark ──────────────────────────────────────────────

function LogoMark() {
  return (
    <div className="plasmo-relative plasmo-w-[30px] plasmo-h-[30px] plasmo-flex plasmo-items-center plasmo-justify-center">
      {/* Glow behind logo */}
      <div className="plasmo-absolute plasmo-inset-0 plasmo-rounded-[8px] plasmo-bg-accent-primary/20 plasmo-blur-[6px]" />
      <div className="plasmo-relative plasmo-w-full plasmo-h-full plasmo-rounded-[8px] plasmo-bg-gradient-to-br plasmo-from-accent-primary plasmo-to-accent-secondary plasmo-flex plasmo-items-center plasmo-justify-center">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
    </div>
  )
}

// ─── Page Card ──────────────────────────────────────────────

function PageCard({ tab }: { tab: TabInfo | null }) {
  if (!tab) {
    return (
      <div className="plasmo-rounded-card plasmo-bg-surface-raised plasmo-p-4">
        <div className="plasmo-flex plasmo-items-center plasmo-gap-3">
          <div className="plasmo-w-9 plasmo-h-9 plasmo-rounded-[10px] plasmo-bg-surface-subtle plasmo-animate-pulse" />
          <div className="plasmo-flex-1 plasmo-space-y-2">
            <div className="plasmo-h-3 plasmo-w-3/4 plasmo-rounded-full plasmo-bg-surface-subtle plasmo-animate-pulse" />
            <div className="plasmo-h-2.5 plasmo-w-1/2 plasmo-rounded-full plasmo-bg-surface-subtle plasmo-animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="plasmo-rounded-card plasmo-bg-surface-raised plasmo-p-4 plasmo-border plasmo-border-white/[0.04]">
      <div className="plasmo-flex plasmo-items-center plasmo-gap-3">
        {tab.favIconUrl ? (
          <img
            src={tab.favIconUrl}
            alt=""
            className="plasmo-w-9 plasmo-h-9 plasmo-rounded-[10px] plasmo-bg-surface-subtle plasmo-p-[5px] plasmo-object-contain plasmo-flex-shrink-0"
          />
        ) : (
          <div className="plasmo-w-9 plasmo-h-9 plasmo-rounded-[10px] plasmo-bg-surface-subtle plasmo-flex plasmo-items-center plasmo-justify-center plasmo-text-ink-faint plasmo-text-xs plasmo-font-semibold plasmo-flex-shrink-0">
            {tab.domain.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="plasmo-min-w-0 plasmo-flex-1">
          <p className="plasmo-text-[13px] plasmo-font-medium plasmo-text-ink-strong plasmo-leading-[1.3] plasmo-truncate plasmo-tracking-[-0.01em]">
            {truncate(tab.title || "Untitled", 55)}
          </p>
          <p className="plasmo-text-[11px] plasmo-text-ink-faint plasmo-mt-[3px] plasmo-truncate plasmo-tracking-[0.01em]">
            {tab.domain}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Status Pill ────────────────────────────────────────────

const STATUS_MAP: Record<
  Exclude<CaptureState["status"], "idle">,
  { label: string; color: string }
> = {
  waiting: { label: "Preparing page\u2026", color: "plasmo-text-ink-muted" },
  extracting: { label: "Reading content\u2026", color: "plasmo-text-accent-secondary" },
  saving: { label: "Saving\u2026", color: "plasmo-text-accent-primary" },
  success: { label: "Saved to library", color: "plasmo-text-success" },
  duplicate: { label: "Already saved", color: "plasmo-text-warning" },
  error: { label: "", color: "plasmo-text-error" },
}

function StatusPill({ state }: { state: CaptureState }) {
  if (state.status === "idle") return null

  const { label, color } = STATUS_MAP[state.status]
  const text = state.status === "error" ? state.message : label
  const isProcessing =
    state.status === "waiting" ||
    state.status === "extracting" ||
    state.status === "saving"

  return (
    <motion.div {...fade} className="plasmo-flex plasmo-justify-center">
      <div
        className={`plasmo-inline-flex plasmo-items-center plasmo-gap-2 plasmo-px-3.5 plasmo-py-[7px] plasmo-rounded-pill plasmo-bg-surface-raised plasmo-border plasmo-border-white/[0.04] ${color}`}>
        {isProcessing && (
          <div className="plasmo-w-3 plasmo-h-3 plasmo-border-[1.5px] plasmo-border-current plasmo-border-t-transparent plasmo-rounded-full spin-smooth" />
        )}
        {state.status === "success" && (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5l3.5 3.5 6.5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        <span className="plasmo-text-[12px] plasmo-font-medium plasmo-tracking-[-0.01em]">
          {text}
        </span>
      </div>
    </motion.div>
  )
}

// ─── Capture Button ─────────────────────────────────────────

function CaptureButton({
  state,
  onClick,
}: {
  state: CaptureState
  onClick: () => void
}) {
  const isActive =
    state.status === "waiting" ||
    state.status === "extracting" ||
    state.status === "saving"
  const isDone = state.status === "success" || state.status === "duplicate"

  const label = isActive
    ? "Capturing\u2026"
    : isDone
      ? "Capture Again"
      : "Capture This Page"

  return (
    <div className="plasmo-relative">
      {/* Glow effect under button */}
      {!isActive && !isDone && (
        <div className="plasmo-absolute plasmo-inset-x-4 plasmo-bottom-0 plasmo-h-8 plasmo-bg-accent-primary/20 plasmo-blur-xl plasmo-rounded-full" />
      )}
      <motion.button
        onClick={onClick}
        disabled={isActive}
        whileHover={!isActive ? { scale: 1.01, y: -1 } : {}}
        whileTap={!isActive ? { scale: 0.985 } : {}}
        transition={spring}
        className={`plasmo-relative plasmo-w-full plasmo-py-[13px] plasmo-rounded-btn plasmo-text-[14px] plasmo-font-semibold plasmo-tracking-[-0.02em] plasmo-transition-all plasmo-duration-300 plasmo-outline-none ${
          isActive
            ? "plasmo-bg-surface-subtle plasmo-text-ink-muted plasmo-cursor-wait"
            : isDone
              ? "plasmo-bg-surface-subtle plasmo-text-ink-muted hover:plasmo-bg-surface-overlay hover:plasmo-text-ink-base"
              : "plasmo-bg-gradient-to-r plasmo-from-accent-primary plasmo-to-accent-secondary plasmo-text-white plasmo-shadow-glow hover:plasmo-shadow-glow-lg"
        }`}>
        <span className="plasmo-relative plasmo-z-10">{label}</span>
      </motion.button>
    </div>
  )
}

// ─── Sign In Button ─────────────────────────────────────────

function SignInButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="plasmo-rounded-card plasmo-bg-surface-raised plasmo-border plasmo-border-white/[0.04] plasmo-p-4 plasmo-text-center">
      <p className="plasmo-text-[12px] plasmo-text-ink-muted plasmo-mb-3">
        Sign in to start capturing
      </p>
      <motion.button
        onClick={() => window.open(`${APP_URL}/login`, "_blank")}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={spring}
        className="plasmo-w-full plasmo-py-[10px] plasmo-rounded-btn plasmo-text-[13px] plasmo-font-semibold plasmo-tracking-[-0.02em] plasmo-bg-gradient-to-r plasmo-from-accent-primary plasmo-to-accent-secondary plasmo-text-white plasmo-shadow-glow">
        Sign In
      </motion.button>
    </motion.div>
  )
}

// ─── Recent Captures ────────────────────────────────────────

function RecentCaptures({
  captures,
  loading,
}: {
  captures: CaptureItem[]
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="plasmo-rounded-card plasmo-bg-surface-raised plasmo-border plasmo-border-white/[0.04] plasmo-p-3 plasmo-space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="plasmo-flex plasmo-items-center plasmo-gap-2.5 plasmo-py-1">
            <div className="plasmo-w-5 plasmo-h-5 plasmo-rounded-[5px] plasmo-bg-surface-subtle plasmo-animate-pulse plasmo-flex-shrink-0" />
            <div className="plasmo-flex-1 plasmo-space-y-1.5">
              <div className="plasmo-h-2.5 plasmo-w-3/4 plasmo-rounded-full plasmo-bg-surface-subtle plasmo-animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (captures.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="plasmo-rounded-card plasmo-bg-surface-raised plasmo-border plasmo-border-white/[0.04] plasmo-p-4 plasmo-text-center">
        <div className="plasmo-text-[20px] plasmo-mb-1.5">&#10024;</div>
        <p className="plasmo-text-[12px] plasmo-text-ink-muted plasmo-leading-[1.5]">
          Capture your very first content<br />and see the magic
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="plasmo-rounded-card plasmo-bg-surface-raised plasmo-border plasmo-border-white/[0.04] plasmo-p-1.5">
      <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-px-2.5 plasmo-pt-1.5 plasmo-pb-1">
        <span className="plasmo-text-[10px] plasmo-font-medium plasmo-uppercase plasmo-tracking-[0.05em] plasmo-text-ink-faint">
          Recent
        </span>
      </div>
      {captures.map((capture, i) => (
        <motion.button
          key={capture._id}
          onClick={() =>
            window.open(`${APP_URL}/in/captures/${capture._id}`, "_blank")
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="plasmo-w-full plasmo-flex plasmo-items-center plasmo-gap-2.5 plasmo-px-2.5 plasmo-py-[7px] plasmo-rounded-[8px] hover:plasmo-bg-white/[0.03] plasmo-transition-colors plasmo-duration-150 plasmo-text-left">
          {capture.metadata?.favicon ? (
            <img
              src={capture.metadata.favicon}
              alt=""
              className="plasmo-w-[18px] plasmo-h-[18px] plasmo-rounded-[4px] plasmo-bg-surface-subtle plasmo-p-[2px] plasmo-object-contain plasmo-flex-shrink-0"
            />
          ) : (
            <div className="plasmo-w-[18px] plasmo-h-[18px] plasmo-rounded-[4px] plasmo-bg-surface-subtle plasmo-flex plasmo-items-center plasmo-justify-center plasmo-text-ink-faint plasmo-text-[8px] plasmo-font-semibold plasmo-flex-shrink-0">
              {getDomain(capture.url).charAt(0).toUpperCase()}
            </div>
          )}
          <span className="plasmo-text-[12px] plasmo-text-ink-base plasmo-truncate plasmo-leading-[1.3]">
            {truncate(capture.title || "Untitled", 45)}
          </span>
        </motion.button>
      ))}
    </motion.div>
  )
}

// ─── Main Popup ─────────────────────────────────────────────

function Popup() {
  const [state, setState] = useState<CaptureState>({ status: "idle" })
  const [tab, setTab] = useState<TabInfo | null>(null)
  const [authState, setAuthState] = useState<AuthState>("loading")
  const [recentCaptures, setRecentCaptures] = useState<CaptureItem[]>([])
  const [capturesLoading, setCapturesLoading] = useState(true)
  const [hadNoCaptures, setHadNoCaptures] = useState(false)

  // Check auth and fetch recent captures
  useEffect(() => {
    ;(async () => {
      try {
        const { data: session } = await authClient.getSession()
        if (session) {
          setAuthState("authenticated")
          fetchRecentCaptures()
        } else {
          setAuthState("unauthenticated")
          setCapturesLoading(false)
        }
      } catch {
        setAuthState("unauthenticated")
        setCapturesLoading(false)
      }
    })()
  }, [])

  async function fetchRecentCaptures() {
    try {
      setCapturesLoading(true)
      const res = await fetch(`${API_URL}/api/v1/captures?limit=3`, {
        credentials: "include",
      })
      if (res.ok) {
        const json = await res.json()
        const captures = Array.isArray(json.data) ? json.data : []
        setRecentCaptures(captures.slice(0, 3))
        if (captures.length === 0) setHadNoCaptures(true)
      }
    } catch {
      // silently fail — captures section just won't show
    } finally {
      setCapturesLoading(false)
    }
  }

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      if (!activeTab?.url) return
      setTab({
        title: activeTab.title || "",
        url: activeTab.url,
        favIconUrl: activeTab.favIconUrl || "",
        domain: getDomain(activeTab.url),
      })
    })
  }, [])

  // Navigate to captures page on first-ever capture success
  useEffect(() => {
    if (state.status === "success" && hadNoCaptures) {
      setHadNoCaptures(false)
      const timer = setTimeout(() => {
        window.open(`${APP_URL}/in/captures`, "_blank")
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [state.status, hadNoCaptures])

  // Refresh captures list after successful capture
  useEffect(() => {
    if (state.status === "success" && authState === "authenticated") {
      fetchRecentCaptures()
    }
  }, [state.status, authState])

  useEffect(() => {
    if (
      state.status === "success" ||
      state.status === "duplicate" ||
      state.status === "error"
    ) {
      const timer = setTimeout(
        () => setState({ status: "idle" }),
        state.status === "error" ? 5000 : 3000
      )
      return () => clearTimeout(timer)
    }
  }, [state.status])

  const handleCapture = useCallback(async () => {
    if (
      state.status !== "idle" &&
      state.status !== "success" &&
      state.status !== "duplicate" &&
      state.status !== "error"
    )
      return

    try {
      const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })
      if (!activeTab?.id) {
        setState({ status: "error", message: "No active tab found" })
        return
      }

      const restricted = [
        "chrome://",
        "about:",
        "chrome-extension://",
        "https://chrome.google.com/",
      ]
      if (restricted.some((p) => activeTab.url?.startsWith(p))) {
        setState({ status: "error", message: "Can\u2019t capture browser pages" })
        return
      }

      setState({ status: "waiting" })

      const response = await capturePageData(activeTab.id!)

      setState({ status: "extracting" })

      setState({ status: "saving" })

      const res = await fetch(`${API_URL}/api/v1/captures/save`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      })

      if (res.status === 409) {
        setState({ status: "duplicate" })
        return
      }

      if (res.status === 401) {
        window.open(`${APP_URL}/login`, "_blank")
        setState({ status: "error", message: "Please sign in first" })
        return
      }

      if (!res.ok) {
        const contentType = res.headers.get("content-type") || ""
        const errData = contentType.includes("json")
          ? await res.json()
          : { message: await res.text() }
        setState({
          status: "error",
          message: errData.message || `Server error (${res.status})`,
        })
        return
      }

      setState({ status: "success" })
    } catch (err: any) {
      console.error("[Deepen] Capture error:", err)
      setState({
        status: "error",
        message: err.message || "Something went wrong",
      })
    }
  }, [state.status])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="plasmo-w-[340px] plasmo-bg-surface-base plasmo-text-ink-base plasmo-overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 120% 80% at 50% 0%, #15141e 0%, #09090b 70%)",
      }}>

      {/* ── Header ── */}
      <div className="plasmo-px-5 plasmo-pt-[18px] plasmo-pb-4 plasmo-flex plasmo-items-center plasmo-justify-between">
        <div className="plasmo-flex plasmo-items-center plasmo-gap-2.5">
          <LogoMark />
          <span className="plasmo-text-[17px] plasmo-font-semibold plasmo-tracking-[-0.03em] plasmo-text-ink-strong">
            Deepen
          </span>
        </div>

        <motion.button
          onClick={() => window.open(`${APP_URL}/in`, "_blank")}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={spring}
          className="plasmo-px-3 plasmo-py-[5px] plasmo-rounded-pill plasmo-text-[11px] plasmo-font-medium plasmo-tracking-[0.02em] plasmo-uppercase plasmo-text-ink-faint hover:plasmo-text-ink-muted plasmo-bg-white/[0.03] hover:plasmo-bg-white/[0.06] plasmo-border plasmo-border-white/[0.05] plasmo-transition-all plasmo-duration-200"
          title="Open your library">
          Library
        </motion.button>
      </div>

      {/* ── Content ── */}
      <div className="plasmo-px-5 plasmo-pb-5 plasmo-space-y-3">
        <PageCard tab={tab} />

        {/* Auth-aware section */}
        {authState === "unauthenticated" ? (
          <SignInButton />
        ) : authState === "authenticated" ? (
          <RecentCaptures captures={recentCaptures} loading={capturesLoading} />
        ) : null}

        <AnimatePresence mode="wait">
          {state.status !== "idle" && (
            <StatusPill key={state.status} state={state} />
          )}
        </AnimatePresence>

        {authState !== "unauthenticated" && (
          <CaptureButton state={state} onClick={handleCapture} />
        )}
      </div>

      {/* ── Footer ── */}
      <div className="plasmo-pb-4 plasmo-pt-1" />
    </motion.div>
  )
}

export default Popup
