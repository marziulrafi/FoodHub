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
        primary: {
          50: "#fff5ed",
          100: "#ffe7d5",
          200: "#fbd0b0",
          300: "#f4ac82",
          400: "#e98556",
          500: "#cf582e",
          600: "#b94724",
          700: "#973a20",
          800: "#79321f",
          900: "#632b1d",
        },
      },
    },
  },
  plugins: [],
};

export default config;
