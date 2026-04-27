import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cv-bg': 'var(--cv-bg)',
        'cv-surface': 'var(--cv-surface)',
        'cv-ink': 'var(--cv-ink)',
        'cv-ink-soft': 'var(--cv-ink-soft)',
        'cv-ink-muted': 'var(--cv-ink-muted)',
        'cv-accent': 'var(--cv-accent)',
        'cv-accent-ink': 'var(--cv-accent-ink)',
        'cv-accent-soft': 'var(--cv-accent-soft)',
        'cv-gold': 'var(--cv-gold)',
        'cv-gold-soft': 'var(--cv-gold-soft)',
        'cv-chip-bg': 'var(--cv-chip-bg)',
        'cv-chip-ink': 'var(--cv-chip-ink)',
        'cv-sale-bg': 'var(--cv-sale-bg)',
        'cv-sale-ink': 'var(--cv-sale-ink)',
        'cv-hero-bg': 'var(--cv-hero-bg)',
        'cv-hero-ink': 'var(--cv-hero-ink)',
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        cvPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
        cvFade: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'cv-pulse': 'cvPulse 1.4s ease-in-out infinite',
        'cv-fade': 'cvFade 0.28s ease both',
      },
    },
  },
  plugins: [],
}

export default config
