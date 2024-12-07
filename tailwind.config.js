/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all React components
    "./public/index.html", // Scan the public folder
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Custom primary color
        secondary: '#F59E0B', // Custom secondary color
        background: '#F3F4F6', // Light background color
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], // Custom font
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        128: '32rem', // Custom spacing value
        144: '36rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Form plugin
    require('@tailwindcss/typography'), // Typography plugin
  ],
};
