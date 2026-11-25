/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        casiana: {
          red: '#c0392b',
          'red-dark': '#96281b',
          blue: '#2980b9',
          gold: '#f39c12',
        },
      },
    },
  },
  plugins: [],
};
