/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'baby-blue': '#5fb0e5',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
} 