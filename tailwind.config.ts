import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#181818',
        'editor': '#1E1E1E',
        'hover-dark': '#353535',
        'accent': '#5576CC',
        'border-panel': '#2B2B2B',
        'border-input': '#474747',
        'input': '#2A2A2A',
        'control-active': '#737373',
        'control-disable': '#4D4D4D',
        'text-normal': '#cccccc',
        'text-unfocused': '#6A6A6A',
        'text-changed': '#D3C194',
        'text-error': '#F47D6F',
        'text-string-1': '#A1C281',
        'text-string-2': '#4B9091',
        'selection-color': '#4160A3',
        'line-number': '#717680',
        'notif-bg': '#252526'
      },
      animation: {
        'fly-duck': 'fly-duck 2s linear forwards',
        'gradient-text': 'rainbow 1s linear infinite',
        'loading-bar': 'loading 2s ease-in-out infinite',
        'fade-out': 'fade-out 1.5s linear forwards',
        'border-glow': 'border-glow 2s linear forwards',
        'push-right': 'push-right 1.5s ease-in',
        'push-left': 'push-left 1.5s ease-in'
      },
      keyframes: {
        'push-right': {
          '0%, 100%': {
            transform: 'translateX(0px)'
          },
          '90%': {
            transform: 'translateX(3px)'
          }
        },
        'push-left': {
          '0%, 100%': {
            transform: 'translateX(0px)'
          },
          '90%': {
            transform: 'translateX(-3px)'
          }
        },
        'border-glow': {
          '50%': {
            'box-shadow': '0px 0px 10px #5576CC'
          },
          '0%, 100%': {
            'box-shadow': '0px 0px 0px #5576CC00'
          }
        },
        'fly-duck': {
          '0%': {
            bottom: '0',
            right: '-50%',
          },
          '100%': {
            bottom: '100%',
            right: '150%',
          }
        },
        rainbow: {
          '0%, 100%': {
            'background-position-x': '0%'
          },
          '50%': {
            'background-position-x': '100%'
          }
        },
        loading: {
          '0%': { width: '0%', marginLeft: '0%' },
          '50%': { width: '100%', marginLeft: '0%' },
          '100%': { width: '0%', marginLeft: '100%' },
        },
        'fade-out': {
          '20%, 80%': {
            'opacity': '1',
          },
          '0%, 19%, 100%': {
            'opacity': '0',
          },
        }
      },
      backgroundImage: {
        'highlight-gradient': 'linear-gradient(to right, #B868E7, #7AD3E9)',
        'loading-screen': 'radial-gradient(#121f3e, #181818)',
        'me': 'url("/pictures/me.webp")'
      }
    },
    fontFamily: {
      'text': 'Melno',
      'ide': 'RutanTrial',
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

export default config
