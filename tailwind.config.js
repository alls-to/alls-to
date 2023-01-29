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
        xl: ['24px', '36px'],
        '2xl': ['28px', '42px']
      },
      colors: {
        primary: {
          DEFAULT: '#0B2750',
          100: '#e5e9ed'
        },
        red: '#FF3838',
        green: '#08B72F',
        glass: {
          200: 'rgba(11, 39, 80, 0.04)',
          300: 'rgba(11, 39, 80, 0.08)'
        },
        blue: {
          DEFAULT: '#387FD5'
        }
      },
      boxShadow: {
        DEFAULT: '0px 2px 6px rgba(0, 0, 0, 0.1)',
        lg: '0px 4px 10px rgba(0, 0, 0, 0.1)'
      }
    }
  },
  // safelist: [...tailwindcssOriginSafelist],
  plugins: [
    require('@tailwindcss/forms')
  ]
}
