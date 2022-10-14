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
