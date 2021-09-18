module.exports = {
  purge: ['./*.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        rubik: "'Rubik', sans-serif"
      }
    },
  },
  variants: {
    extend: {
      pointerEvents: ['disabled'],
      opacity: ['disabled']
    },
  },
  plugins: [],
}
