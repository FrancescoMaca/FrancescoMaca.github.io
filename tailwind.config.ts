import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#222222',
        'gray': '#3F3F3F',
        'light-gray': '#C7C7C7',
        'dark-white': '#D9D9D9',
        'white': '#FAFAFF',
      },
      fontSize: {
        'm': '2rem',
      },
      borderRadius: {
        '4xl': '3rem',
      }
    },
    fontFamily: {
      'text': 'Josefin Sans',
    }
  },
  plugins: [],
}

export default config
