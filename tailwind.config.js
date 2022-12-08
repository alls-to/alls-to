module.exports = {
  mode: 'jit',
  content: [
    './{pages,components}/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      screens: {
      },
      fontFamily: {
        sans: ['Roboto', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, sans-serif']
      },
      colors: {
      }
    }
  },
  // safelist: [...tailwindcssOriginSafelist],
  plugins: [
    require('@tailwindcss/forms')
  ]
}
