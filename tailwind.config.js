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
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        warning: 'var(--color-warning)',

        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          card: 'var(--bg-card)',
          glass: 'var(--bg-glass)',
        },

        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },

        border: {
          subtle: 'var(--border-subtle)',
          normal: 'var(--border-normal)',
          strong: 'var(--border-strong)',
        }
      },
      fontFamily: {
        'sans': ['var(--font-sans)', 'sans-serif'],
        'pixel': ['var(--font-press-start)', 'cursive'],
        'mono': ['var(--font-mono)', 'monospace'],
        'tech': ['var(--font-share-tech)', 'monospace']
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        gradientShift: 'gradientShift 15s ease infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      }
    },
  },
  plugins: [],
}
