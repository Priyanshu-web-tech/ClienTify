/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      'pale-white': '#f3f4ee',
      'white': '#ffffff',
      'dark': '#1c1c1c',
      "red": "#ff0000",
      "warn": "#ffc107",
      "black":"#000000",
      "gray":"#808080",
      "green":"#008000",
    },keyframes: {
      'fade-in-down': {
        '0%': {
          opacity: '0',
          transform: 'translateY(-20px)'
        },
        '100%': {
          opacity: '1',
          transform: 'translateY(0)'
        },
      },
      'fade-in-up': {
        '0%': {
          opacity: '0',
          transform: 'translateY(20px)'
        },
        '100%': {
          opacity: '1',
          transform: 'translateY(0)'
        },
      },
      'bounce': {
        '0%, 100%': {
          transform: 'translateY(-5%)',
          animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
        },
        '50%': {
          transform: 'translateY(0)',
          animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
        },
      }
    },
    animation: {
      'fade-in-down': 'fade-in-down 0.5s ease-out',
      'fade-in-up': 'fade-in-up 0.5s ease-out',
      'bounce': 'bounce 1s infinite',
    },
  
  },
  plugins: [],
}

