/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3b82f6', // Brand Blue
        'secondary': '#64748b', // Muted Gray
        'success': '#10b981', // Green
        'danger': '#ef4444', // Red
        'background': '#f8fafc', // Light Gray Background for pages
        'surface': '#ffffff', // White for cards and headers
        'text-primary': '#1e293b', // Dark text
        'text-secondary': '#475569', // Lighter text
      }
    },
  },
  plugins: [],
}