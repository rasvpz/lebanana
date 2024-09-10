module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      scrollbar: {
        DEFAULT: {
          track: 'transparent',
          thumb: 'bg-blue-500', // Set the thumb color here
          size: '2px',
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }), // This is important
  ],
}