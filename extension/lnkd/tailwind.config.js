/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "class",
  prefix: "plasmo-",
  theme: {
    extend: {
      colors: {
        surface: {
          base: "var(--surface-base)",
          raised: "var(--surface-raised)",
          overlay: "var(--surface-overlay)",
          subtle: "var(--surface-subtle)",
        },
        accent: {
          primary: "var(--accent-primary)",
          secondary: "var(--accent-secondary)",
          glow: "var(--accent-glow-bg)",
        },
        ink: {
          strong: "var(--ink-strong)",
          base: "var(--ink-base)",
          muted: "var(--ink-muted)",
          faint: "var(--ink-faint)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        line: "var(--border-soft)",
        hover: "var(--hover-overlay)",
        "hover-strong": "var(--hover-overlay-strong)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "14px",
        btn: "11px",
        pill: "100px",
      },
      boxShadow: {
        glow: "var(--glow-shadow)",
        "glow-lg": "var(--glow-shadow-lg)",
        lift: "0 1px 3px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)",
      },
    },
  },
}
