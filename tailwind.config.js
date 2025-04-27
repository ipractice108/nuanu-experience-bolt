/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nuanu: {
          DEFAULT: '#0B4D3F',
          light: '#156E5A',
          dark: '#083B30',
        }
      }
    },
  },
  plugins: [],
};