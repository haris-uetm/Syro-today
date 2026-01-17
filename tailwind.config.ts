import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        border: 'var(--border)',
        muted: 'var(--muted)',
        primary: 'var(--primary)',
      },
      fontFamily: {
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

