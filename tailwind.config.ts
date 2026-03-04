import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "surface-base": "#111111",
        "surface-card": "var(--card)",
        "card-border": "var(--card-border)",
        "text-secondary": "var(--text-secondary)",
        "brand-sage": "var(--accent)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        error: "var(--error)",
        "status-upcoming": "var(--status-upcoming)",
        "status-active": "var(--status-active)",
        "status-completed": "var(--status-completed)",
      },
    },
  },
  plugins: [],
};
export default config;
