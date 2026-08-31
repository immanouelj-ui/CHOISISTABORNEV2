import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0D10",
          soft: "#121418",
          raised: "#181B20",
        },
        paper: "#F4F3EF",
        charge: {
          DEFAULT: "#2F6BFF",
          dim: "#1E3E8F",
          bright: "#6E97FF",
        },
        amber: {
          DEFAULT: "#E8A33D",
          dim: "#8C6425",
        },
        fog: "#93949C",
        line: "rgba(244,243,239,0.10)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Manrope", "Arial", "sans-serif"],
        body: ["var(--font-body)", "Inter", "Helvetica", "Arial", "sans-serif"],
      },
      fontSize: {
        "display-1": ["clamp(3rem, 9vw, 9rem)", { lineHeight: "0.94", letterSpacing: "-0.03em" }],
        "display-2": ["clamp(2.25rem, 5.5vw, 4.5rem)", { lineHeight: "0.98", letterSpacing: "-0.025em" }],
        "display-3": ["clamp(1.75rem, 3.2vw, 2.75rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      maxWidth: {
        content: "1440px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
