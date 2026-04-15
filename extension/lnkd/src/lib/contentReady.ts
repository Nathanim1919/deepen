/**
 * contentReady.ts
 *
 * Detects when a page's DOM has stabilized after async rendering (SPAs, lazy loading, etc.).
 *
 * How it works:
 * 1. We attach a MutationObserver to document.body
 * 2. Every time the DOM changes, we reset a "quiet" timer
 * 3. When no mutations happen for QUIET_PERIOD_MS, we consider the DOM settled
 * 4. A hard TIMEOUT_MS cap ensures we never wait forever
 *
 * On static sites, the DOM is already stable — the observer sees zero mutations
 * and resolves almost immediately after the quiet period.
 */

// How long the DOM must be "quiet" (no mutations) before we consider it ready
const QUIET_PERIOD_MS = 800

// Absolute max wait time — never block extraction longer than this
const TIMEOUT_MS = 8000

/**
 * Returns a promise that resolves when the page content is likely fully rendered.
 *
 * Safe to call multiple times — each call creates an independent observer.
 */
export function waitForContentReady(): Promise<"settled" | "timeout"> {
  return new Promise((resolve) => {
    let quietTimer: ReturnType<typeof setTimeout>
    let observer: MutationObserver

    // Hard timeout — resolve no matter what after TIMEOUT_MS
    const hardTimeout = setTimeout(() => {
      cleanup()
      console.log(`[Deepen] Content ready: timeout after ${TIMEOUT_MS}ms`)
      resolve("timeout")
    }, TIMEOUT_MS)

    function cleanup() {
      clearTimeout(quietTimer)
      clearTimeout(hardTimeout)
      observer?.disconnect()
    }

    function resetQuietTimer() {
      clearTimeout(quietTimer)
      quietTimer = setTimeout(() => {
        // No mutations for QUIET_PERIOD_MS — DOM is settled
        cleanup()
        console.log("[Deepen] Content ready: DOM settled")
        resolve("settled")
      }, QUIET_PERIOD_MS)
    }

    observer = new MutationObserver((mutations) => {
      // Only care about meaningful mutations — ignore attribute-only changes
      // like style recalculations, class toggles for animations, etc.
      const hasMeaningfulChange = mutations.some(
        (m) =>
          m.type === "childList" &&
          (m.addedNodes.length > 0 || m.removedNodes.length > 0)
      )

      if (hasMeaningfulChange) {
        resetQuietTimer()
      }
    })

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Start the first quiet timer — if the DOM is already stable (static site),
    // this resolves after QUIET_PERIOD_MS with zero mutations seen
    resetQuietTimer()
  })
}
