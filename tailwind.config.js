/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'color-run': {
          '0%, 100%': { 'border-image-slice': '1', 'border-image-source': 'linear-gradient(to right, #6EE7B7, #3B82F6)' },
          '25%': { 'border-image-source': 'linear-gradient(to right, #3B82F6, #9333EA)' },
          '50%': { 'border-image-source': 'linear-gradient(to right, #9333EA, #EC4899)' },
          '75%': { 'border-image-source': 'linear-gradient(to right, #EC4899, #F97316)' },
        },
      },
      animation: {
        'color-run': 'color-run 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}