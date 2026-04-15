/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "media",
  prefix: "plasmo-",
  theme: {
    extend: {
      colors: {
        surface: {
          base: "#09090b",
          raised: "#111113",
          overlay: "#18181b",
          subtle: "#1f1f23",
        },
        accent: {
          primary: "#a78bfa",
          secondary: "#818cf8",
          glow: "rgba(167, 139, 250, 0.15)",
        },
        ink: {
          strong: "#fafafa",
          base: "#e4e4e7",
          muted: "#a1a1aa",
          faint: "#52525b",
        },
        success: "#34d399",
        warning: "#fbbf24",
        error: "#fb7185",
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
        glow: "0 0 20px -4px rgba(167, 139, 250, 0.3)",
        "glow-lg": "0 0 32px -4px rgba(167, 139, 250, 0.4)",
        lift: "0 1px 3px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3)",
      },
    },
  },
}
