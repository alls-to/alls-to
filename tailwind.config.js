module.exports = {
  mode: 'jit',
  content: [
    './{pages,components}/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    screens: {
      xs: '440px',
      sm: '720px',
      md: '860px',
      lg: '1000px',
      xl: '1200px',
    },
    extend: {
      fontFamily: {
        sans: ['Poppins', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, sans-serif']
      },
      fontSize: {
        sm: ['14px', '18px'],
        lg: ['20px', '32px'],
        xl: ['28px', '42px']
      },
      colors: {
        primary: '#0B2750',
        red: '#FF3838',
        green: '#00FF00',
        glass: {
          200: 'rgba(11, 39, 80, 0.04)',
          300: 'rgba(11, 39, 80, 0.08)'
        }
      },
      boxShadow: {
        DEFAULT: '0px 2px 6px rgba(0, 0, 0, 0.1)',
        lg: '0px 4px 40px rgba(0, 0, 0, 0.1)'
      }
    }
  },
  // safelist: [...tailwindcssOriginSafelist],
  plugins: [
    require('@tailwindcss/forms')
  ]
}
