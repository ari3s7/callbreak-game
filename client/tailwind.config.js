/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0B0E13',
          900: '#11151C',
          800: '#161C25',
          700: '#1A202A',
        },
        tech: {
          border: '#222C38',
          'border-active': 'rgba(0, 213, 255, 0.55)',
        },
        cyan: {
          accent: '#00B8E6',
          bright: '#00D5FF',
        },
        red: {
          accent: '#FF3B4E',
        },
        slate: {
          text: '#F1F5F9',
          muted: '#A5AFBD',
          dim: '#647184',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(0, 213, 255, 0.25)',
        'cyan-sm': '0 0 8px rgba(0, 213, 255, 0.15)',
      },
    },
  },
  plugins: [],
};
