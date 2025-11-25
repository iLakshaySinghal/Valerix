/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: "#ff6a00",
          faint: "#ff6a0070"
        }
      }
    },
  },
  plugins: [],
}
