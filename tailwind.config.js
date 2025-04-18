/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}', // Optional: if you use a `src/` directory
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-animate'), // optional, since you use `tw-animate-css`
  ],
}
