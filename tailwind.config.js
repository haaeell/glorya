/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        glorya: {
          black: '#080808', dark: '#0D0D0D', card: '#121212', gold: '#D4AF37',
          lightGold: '#E5C56A', champagne: '#F0D98A', cream: '#F8F5ED',
          soft: '#B6B0A4', muted: '#858078'
        }
      },
      fontFamily: { display: ['Cormorant Garamond', 'serif'], sans: ['Inter', 'sans-serif'] },
      boxShadow: { gold: '0 12px 40px rgba(212, 175, 55, .13)' }
    }
  }
};
