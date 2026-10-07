import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        base: {
          900: "#080808",
          800: "#0F0F0F",
          700: "#151515",
          600: "#1C1C1C",
          500: "#262626",
        },
        primary: {
          DEFAULT: "#C6F135",
          dark: "#9BC428",
          light: "#DCFF6B",
        },
        secondary: {
          DEFAULT: "#4D7CFE",
          dark: "#3A5FD9",
        },
        muscle: {
          chest: "#FF5C5C",
          chestSoft: "#FF8A8A",
          back: "#4D7CFE",
          backSoft: "#7DA0FF",
          shoulders: "#A855F7",
          biceps: "#38BDF8",
          triceps: "#FB7185",
          legs: "#FBBF24",
          abs: "#34D399",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(198, 241, 53, 0.35)",
        card: "0 8px 30px rgba(0,0,0,0.45)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(198,241,53,0.4)" },
          "50%": { boxShadow: "0 0 0 10px rgba(198,241,53,0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out both",
        pulseGlow: "pulseGlow 2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
