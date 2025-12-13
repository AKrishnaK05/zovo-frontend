// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: '#071823',
        panel: '#0b2430',
        accent1: '#7c3aed',
        accent2: '#06b6d4',
        'zovo-blue': '#007AFF', // Primary Accent
        'zovo-dark': '#1A1A1A', // Secondary Accent / Text
        'zovo-white': '#FFFFFF', // Background Base
        'zovo-gray': '#E0E0E0', // Subtle Detail
        'zovo-green': '#4CD964', // Alert/Success
      },
      boxShadow: {
        'soft-lg': '0 10px 30px rgba(2,6,12,0.6)'
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif']
      },
      // ✅ Add cursor utilities
      cursor: {
        'default': 'default',
        'pointer': 'pointer',
        'text': 'text',
        'not-allowed': 'not-allowed',
      }
    }
  },
  plugins: [],
  // ✅ Disable default cursor hover behavior
  corePlugins: {
    cursor: true,
  }
};