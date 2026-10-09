/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        earth: "#2b1b0c",
        atmosphere: "#4a90e2",
        ocean: "#1e3a5f",
        land: "#d4c19e",
        night: "#0a0a20",
      },
    },
  },
  plugins: [],
}