/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        sidebarColor: {
          100: '#414176',
          200: '#000040'
        }
      }
    },
  },
  plugins: [],
  darkMode: 'selector'
};
