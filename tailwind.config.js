module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        '300': '300px',
      },
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms')
  ],
}
