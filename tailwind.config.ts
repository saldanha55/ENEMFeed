import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      colors: {
        matematica: {
          DEFAULT: "#6C8EFF",
          light: "#EEF1FF",
          dark: "#4A6AFF",
        },
        redacao: {
          DEFAULT: "#D67BFF",
          light: "#F8EEFF",
          dark: "#B855E8",
        },
        linguagens: {
          DEFAULT: "#34D399",
          light: "#ECFDF5",
          dark: "#10B981",
        },
        humanas: {
          DEFAULT: "#FFA959",
          light: "#FFF7ED",
          dark: "#F97316",
        },
        surface: {
          50: "#FAF8F5",
          100: "#F4F1EC",
          200: "#E8E4DD",
          800: "#1A1B2E",
          900: "#0E0F1A",
          950: "#070810",
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        "soft-lg": "0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
        glow: "0 0 20px rgba(108,142,255,0.25)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
