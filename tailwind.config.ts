import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0A1F44", light: "#132B57", line: "#2C4677" },
        gold: { DEFAULT: "#C9A646", soft: "#E3C878" },
        cream: { DEFAULT: "#F5EFE0", line: "#E2D9C3", border: "#CFC6B0" },
        muted: "#4A5872",
        mist: "#D9D3C4",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        brand: ["var(--font-cinzel)", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
