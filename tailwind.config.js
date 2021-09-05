module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'sans': ['"Open Sans"', 'ui-sans-serif', 'system-ui'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}