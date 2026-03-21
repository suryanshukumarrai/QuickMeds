/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f8ff',
          100: '#dcedff',
          500: '#1787d4',
          700: '#0f4f80',
          900: '#0b2f4a'
        },
        accent: '#f97316'
      }
    }
  },
  plugins: [],
};
