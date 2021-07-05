module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        '250': '250px',
        '350': '350px',
        '700': '700px',
      },
      transitionProperty: {
        height: 'height'
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
