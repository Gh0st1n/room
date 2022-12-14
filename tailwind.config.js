/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': {'max':'499px'}, //extra sm
      'sm': '500px',
      // => @media (min-width: 500px) { ... }

      'md': '1003px',
      // => @media (min-width: 1003px) { ... }

      'lg': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
    extend: {
      width: {
        '88px': '88px'
      },
      spacing: {
        '12px':'12px',
        '24px':'24px',
      }
    },
  },
  plugins: [],
}
