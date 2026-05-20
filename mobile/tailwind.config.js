/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#18181b',
        card: '#ffffff',
        primary: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f4f4f5',
          foreground: '#18181b',
        },
        muted: {
          DEFAULT: '#f4f4f5',
          foreground: '#71717a',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#10b981',
          foreground: '#ffffff',
          light: '#d1fae5',
        },
        warning: {
          DEFAULT: '#f59e0b',
          foreground: '#ffffff',
          light: '#fef3c7',
        },
        info: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
          light: '#dbeafe',
        },
        border: '#e4e4e7',
        input: '#e4e4e7',
        ring: '#2563eb',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
