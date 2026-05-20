/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'rgb(var(--color-card) / <alpha-value>)',
          border: 'rgb(var(--color-card-border) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          foreground: 'rgb(var(--color-primary-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
          foreground: 'rgb(var(--color-secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--color-muted) / <alpha-value>)',
          foreground: 'rgb(var(--color-muted-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--color-destructive) / <alpha-value>)',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: 'rgb(var(--color-success) / <alpha-value>)',
          foreground: '#ffffff',
          light: '#d1fae5',
        },
        warning: {
          DEFAULT: 'rgb(var(--color-warning) / <alpha-value>)',
          foreground: '#ffffff',
          light: '#fef3c7',
        },
        info: {
          DEFAULT: 'rgb(var(--color-info) / <alpha-value>)',
          foreground: '#ffffff',
          light: '#dbeafe',
        },
        border: 'rgb(var(--color-border) / <alpha-value>)',
        input: 'rgb(var(--color-input) / <alpha-value>)',
        ring: 'rgb(var(--color-ring) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter_400Regular', 'Inter', 'system-ui', 'sans-serif'],
        'sans-medium': ['Inter_500Medium', 'Inter', 'system-ui', 'sans-serif'],
        'sans-semibold': ['Inter_600SemiBold', 'Inter', 'system-ui', 'sans-serif'],
        'sans-bold': ['Inter_700Bold', 'Inter', 'system-ui', 'sans-serif'],
        'sans-extrabold': ['Inter_800ExtraBold', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrainsMono_400Regular', 'JetBrains Mono', 'monospace'],
        'mono-bold': ['JetBrainsMono_700Bold', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      maxWidth: {
        container: '1200px',
        wizard: '600px',
      },
    },
  },
  plugins: [],
};
