import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enables class-based dark mode (needed for next-themes)
  content: [
    "./src/**/*.{ts,jsx,tsx,mdx}", // adjust this to your folder structure
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
