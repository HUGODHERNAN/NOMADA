/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        cobalt: {
          DEFAULT: "#1220A6",
          dark: "#0C167A",
          light: "#EEF0FB"
        },
        night: "#0B1F3A",
        summit: {
          DEFAULT: "#F97316",
          hover: "#EA580C",
          light: "#FFF7ED"
        },
        slateink: "#1E293B"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"]
      }
    }
  },
  plugins: []
};
