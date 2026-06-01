import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#e63946",
          glow: "rgba(230, 57, 70, 0.5)",
          bright: "#ff6b6b",
          dark: "#c1121f",
        },
        surface: {
          black: "#0a1929",
          dark: "#0d1f3c",
          dark2: "#112240",
          card: "rgba(255, 255, 255, 0.04)",
          "card-border": "rgba(255, 255, 255, 0.08)",
          glass: "rgba(255, 255, 255, 0.05)",
          "glass-border": "rgba(255, 255, 255, 0.10)",
        },
        gray: {
          DEFAULT: "#8892a8",
          light: "#a0aec0",
        },
        foreground: "#edf2f7",
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "-apple-system", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        "fade-down": "fadeDown 1s ease forwards",
        "hero-reveal": "heroReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-x": "scaleX 0.8s ease forwards",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        heroReveal: {
          "0%": { opacity: "0", transform: "translateY(60px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        scaleX: {
          "0%": { opacity: "0", transform: "scaleX(0)" },
          "100%": { opacity: "1", transform: "scaleX(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
