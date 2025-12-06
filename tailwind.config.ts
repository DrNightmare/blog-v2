import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Softer Theme Colors
        primary: {
          DEFAULT: '#4f46e5', // Indigo-600
          hover: '#4338ca',   // Indigo-700
        },
        surface: '#ffffff',
        'background-soft': '#f8fafc', // Slate-50
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
