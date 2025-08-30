/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"], 
  safeList: ["light"], 
  content: [
    "./index.html",
    "./src/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};