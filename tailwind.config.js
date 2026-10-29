/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        electro: {
          bg: '#070d19',
          card: '#0c162c',
          panel: '#101d3b',
          border: '#1e325c',
          blue: '#0ea5e9',
          cyan: '#00f0ff',
          teal: '#14b8a6',
          purple: '#8b5cf6',
          green: '#10b981',
          emerald: '#059669',
          red: '#ef4444',
          amber: '#f59e0b',
          slate: '#64748b',
          light: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace', 'Consolas'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.45)',
        'neon-green': '0 0 20px rgba(16, 185, 129, 0.45)',
        'neon-red': '0 0 20px rgba(239, 68, 68, 0.45)',
        'card-glow': '0 0 30px rgba(14, 165, 233, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 240, 255, 0.7)' },
        }
      }
    },
  },
  plugins: [],
}
