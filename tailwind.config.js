module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'sans': ['"Open Sans"', 'ui-sans-serif', 'system-ui'],
    },
    extend: {
      colors: {
        'github': '#333',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'slide-in-left': {
          '0%': {
            transform: 'translateX(125%)',
          },
          '100%': {
            transform: 'translateX(0%)',
          },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.2s',
        'slide-in-left': 'slide-in-left 0.2s ease-in-out',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}