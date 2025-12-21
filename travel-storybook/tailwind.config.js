/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#fdfcfb',
          100: '#f9f7f4',
          200: '#f5f1ea',
          300: '#ebe3d5',
          400: '#dfd2bb',
          500: '#d1bc9e',
        },
        pastel: {
          pink: '#ffd1dc',
          blue: '#d4e4f7',
          purple: '#e6d9f5',
          green: '#d4f1e8',
          yellow: '#fef5d4',
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

