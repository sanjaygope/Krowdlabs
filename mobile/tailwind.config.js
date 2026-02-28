/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#2E75B6',
        success: '#34A853',
        warning: '#FBBC04',
        error: '#EA4335',
        background: '#F5F5F5',
        textMain: '#212121',
        textSecondary: '#757575',
      }
    },
  },
  plugins: [],
}
