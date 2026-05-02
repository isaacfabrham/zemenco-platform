import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0F2820",
          teal: "#1D9E75",
          gold: "#B5780A",
          red: "#9B1C1C",
          green: "#1F6B3A",
        },
        bg: {
          surface: "#FAFAFA",
          dark: "#0A0F1C",
          white: "#FFFFFF",
        },
        text: {
          main: "#0A0F1C",
          muted: "#475569",
        }
      },
    },
  },
  plugins: [],
};
export default config;
