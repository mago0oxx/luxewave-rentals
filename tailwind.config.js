const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {

      borderWidth: {
        '3': '3px',
      },


      fontFamily: {
        primary: ['"Montserrat Alternates"', ...fontFamily.sans],
        accent: ['"Righteous"', 'cursive'],
      },
      colors: {
        primary: {
          400: '#00E0F3',
          500: '#00c4fd',
        },
        dark: '#333333',
      },
    },
  },
  variants: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 2s infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
