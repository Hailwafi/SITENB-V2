/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGray: '#343232', // Menambahkan warna custom dengan nama 'customWarna'
        customBlue: '#444BED', // Menambahkan warna custom dengan nama 'customWarna'
        customOrange: '#F89A2B', // Menambahkan warna custom dengan nama 'customWarna'
        customRed: '#A02334', // Menambahkan warna custom dengan nama 'customWarna'
        customYellow: '#F9FE14', // Menambahkan warna custom dengan nama 'customWarna'
        customYellow2: '#F4C726', // Menambahkan warna custom dengan nama 'customWarna'
        customGreen: '#0DC842', // Menambahkan warna custom dengan nama 'customWarna'
        customAbu: '#49454F', // Menambahkan warna custom dengan nama 'customWarna'
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
