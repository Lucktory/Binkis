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
      },
      colors: {
        surface: {
          base: "#F8F9FA",
          card: "#FFFFFF",
          muted: "#F1F3F5",
        },
        ink: {
          900: "#0B0D0F",
          700: "#2A2F36",
          500: "#5C636E",
          400: "#7A8290",
          300: "#A6ACB6",
          200: "#D6DAE0",
          100: "#E8EBEF",
        },
        accent: {
          DEFAULT: "#0F172A",
          hover: "#1E293B",
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
      },
      borderColor: {
        DEFAULT: "#E8EBEF",
      },
    },
  },
  plugins: [],
};

export default config;
