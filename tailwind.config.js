module.exports = {
  mode: 'jit',
  content: [
    './{pages,components}/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      screens: {
        xl: '1200px',
        lg: '1000px',
        md: '860px',
        sm: '720px',
        xs: '440px',
      },
      fontFamily: {
        sans: ['Poppins', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, sans-serif']
      },
      fontSize: {
        lg: ['20px', '32px'],
        xl: ['28px', '42px']
      },
      colors: {
        glass: {
          200: 'rgba(11, 39, 80, 0.04)',
          300: 'rgba(11, 39, 80, 0.08)'
        }
      },
      boxShadow: {
        lg: '0px 4px 40px rgba(0, 0, 0, 0.1)'
      }
    }
  },
  // safelist: [...tailwindcssOriginSafelist],
  plugins: [
    require('@tailwindcss/forms')
  ]
}
