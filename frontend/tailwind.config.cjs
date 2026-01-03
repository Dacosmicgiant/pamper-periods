module.exports = {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brandPink: '#ff5c9e',
        brandRose: '#ffd1e6',
        brandDeep: '#ff2d7f',
        premium: '#fdf2f8'
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
}
