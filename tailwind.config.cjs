/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // blue-600
          light: "#dbeafe", // blue-100
          dark: "#1d4ed8" // blue-700
        }
      }
    }
  },
  plugins: []
};

