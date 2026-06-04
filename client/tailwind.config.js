/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0b1726',
        muted: '#6b7280',
        line: '#e6e9ef',
        paper: '#fbfbfd',
        surface: '#ffffff',
        primary: '#0f1724',
        accent: '#3b82f6',
        // Pastel quartet for KPI and accents
        'pastel-blue': '#E6F0FF',
        'pastel-orange': '#FFF4E6',
        'pastel-green': '#ECFDF5',
        'pastel-red': '#FFF1F2',
        // stronger accent colors
        'accent-2': '#fb923c',
        'accent-3': '#34d399',
        glass: 'rgba(255,255,255,0.72)',
        success: '#16a34a',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'Consolas', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '6px',
        DEFAULT: '12px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(12, 18, 30, 0.08)',
        elevated: '0 12px 40px rgba(12, 18, 30, 0.12)'
      },
    },
  },
  plugins: [],
}