import type { Config } from 'tailwindcss';

/**
 * Every colour here maps to a CSS variable declared in src/app/globals.css.
 * Nothing in the codebase should hard-code a hex value.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1.5rem', screens: { '2xl': '1200px' } },
    extend: {
      colors: {
        ivory: 'var(--ivory)',
        paper: 'var(--paper)',
        navy: {
          900: 'var(--navy-900)',
          800: 'var(--navy-800)',
          600: 'var(--navy-600)',
        },
        gold: {
          700: 'var(--gold-700)', // gold text on light surfaces — AA compliant
          500: 'var(--gold-500)', // gold on navy, icon strokes, rules
          300: 'var(--gold-300)', // hairlines, focus ring, script
        },
        olive: 'var(--olive)',
        purple: 'var(--purple)',
        ink: { DEFAULT: 'var(--ink)', muted: 'var(--ink-muted)' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        display: ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.02' }],
        title: ['clamp(1.75rem, 3.2vw, 2.5rem)', { lineHeight: '1.15' }],
        script: ['clamp(2.75rem, 6vw, 4.5rem)', { lineHeight: '1' }],
      },
      letterSpacing: { eyebrow: '0.18em' },
      maxWidth: { container: '1200px' },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '0.85' },
        },
      },
      animation: {
        rise: 'rise 0.8s cubic-bezier(0.2, 0.7, 0.3, 1) both',
        twinkle: 'twinkle 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
