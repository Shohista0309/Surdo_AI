/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surdo: {
          forest: '#173F35',
          green: '#2F6B4F',
          sage: '#A9BDA6',
          cream: '#F7F3E9',
          beige: '#E9DDC9',
          brown: '#8A6346',
          cocoa: '#49362B',
          darkest: '#0F2A23',
          lightGreen: '#E3EDE7',
          lightSage: '#EFF4EE',
          sand: '#F2ECE1',
          creamDark: '#EDE5D5',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Fraunces"', '"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(23, 63, 53, 0.06), 0 2px 6px -1px rgba(23, 63, 53, 0.04)',
        'elevated': '0 12px 32px -4px rgba(23, 63, 53, 0.12), 0 4px 12px -2px rgba(23, 63, 53, 0.06)',
      }
    },
  },
  plugins: [],
}
