/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", , "./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sidebarColor: {
          100: "#414176",
          200: "#000040",
        },
      },
    },
  },
  plugins: [],
  darkMode: "selector",
};
