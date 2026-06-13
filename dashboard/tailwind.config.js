/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        wacom: {
          DEFAULT: '#0097d8',
          50: '#f0f9fe',
          100: '#e0f2fd',
          200: '#bce4fa',
          300: '#83cff6',
          400: '#42b4ee',
          500: '#189ce4',
          600: '#007bb4',
          700: '#026291',
          800: '#065278',
          900: '#0a4463',
          950: '#072b42',
        },
        zinc: {
          900: '#18181b',
          950: '#09090b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(0, 151, 216, 0.4)',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}