import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-lexend)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        display: ["var(--font-lexend)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["1.75rem", { lineHeight: "2.125rem", letterSpacing: "-0.022em", fontWeight: "600" }],
        "display-lg": ["2rem", { lineHeight: "2.375rem", letterSpacing: "-0.024em", fontWeight: "600" }],
      },
      colors: {
        surface: {
          base: "#FAFAF9",
          card: "#FFFFFF",
          muted: "#F4F4F2",
          subtle: "#F1F1EF",
        },
        ink: {
          950: "#020617",
          900: "#0B0D0F",
          800: "#1A1F26",
          700: "#2A2F36",
          500: "#5C636E",
          400: "#7A8290",
          300: "#A6ACB6",
          200: "#D6DAE0",
          100: "#E8EBEF",
          50: "#F2F4F7",
        },
        accent: {
          DEFAULT: "#0B1220",
          hover: "#1B2333",
        },
        amber: {
          DEFAULT: "#B45309",
          soft: "#FBEFD5",
          ring: "#F59E0B",
        },
        status: {
          available: "#5C636E",
          claimed: "#1B7F4B",
          claimedBg: "#E6F4EC",
          invalid: "#A8201A",
          invalidBg: "#FBEAE9",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(11, 13, 15, 0.04)",
        soft: "0 1px 3px 0 rgba(11, 13, 15, 0.06), 0 1px 2px -1px rgba(11, 13, 15, 0.04)",
        elevated: "0 8px 24px -8px rgba(11, 13, 15, 0.12), 0 2px 4px -2px rgba(11, 13, 15, 0.06)",
        ringAmber: "0 0 0 3px rgba(245, 158, 11, 0.15)",
      },
      borderColor: {
        DEFAULT: "#E8EBEF",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        skeletonPulse: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" },
        },
        toastIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 200ms ease-out",
        fadeIn: "fadeIn 180ms ease-out",
        scaleIn: "scaleIn 160ms ease-out",
        skeletonPulse: "skeletonPulse 1.4s ease-in-out infinite",
        toastIn: "toastIn 180ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
