
export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F68E22',
          50: '#FFF4E6',
          100: '#FFE4C2',
          200: '#FFD09A',
          300: '#FFBA6E',
          400: '#F9A445',
          500: '#F68E22',
          600: '#E07A10',
          700: '#B8630D',
          800: '#8F4D0A',
          900: '#663707',
        },
        secondary: {
          DEFAULT: '#349FD5',
          50: '#EBF5FB',
          100: '#D0E9F6',
          200: '#A3D4ED',
          300: '#6DBDE3',
          400: '#349FD5',
          500: '#2A86B8',
          600: '#216C96',
          700: '#195374',
          800: '#113A52',
          900: '#092130',
        },
        accent: {
          DEFAULT: '#FFD200',
          50: '#FFF9DB',
          100: '#FFF3B8',
          200: '#FFE970',
          300: '#FFDF29',
          400: '#FFD200',
          500: '#D4AF00',
          600: '#AA8C00',
        },
        alert: {
          DEFAULT: '#EC3A29',
          50: '#FEF0EE',
          100: '#FCDBD7',
          200: '#F9AFA6',
          300: '#F37E72',
          400: '#EC3A29',
          500: '#D02A1A',
          600: '#A82115',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
}
