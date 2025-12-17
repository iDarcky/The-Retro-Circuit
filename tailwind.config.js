/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          dark: '#0f0f1b',
          grid: '#2a2a40',
          neon: '#00ff9d',
          pink: '#ff00ff',
          blue: '#00ffff',
        }
      },
      fontFamily: {
        'pixel': ['var(--font-press-start)', 'cursive'],
        'mono': ['var(--font-mono)', 'monospace']
      }
    },
  },
  plugins: [],
}
