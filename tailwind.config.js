/**
 * Tailwind configuration for the analytics dashboard.
 * Includes custom corporate palette and dark mode support.
 */
export default {
  content: ['index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0f172a'
        },
        brand: {
          primary: '#1e293b',
          accent: '#3b82f6',
          soft: '#f8fafc'
        }
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(15, 23, 42, 0.35)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
