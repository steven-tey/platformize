module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'twitter-blue': 'rgb(29,161,242)'
      },
      height: {
        '250': '250px',
        '350': '350px',
        '700': '700px',
      },
      transitionProperty: {
        height: 'height'
      },
      zIndex: {
        '-1': '-1',
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
