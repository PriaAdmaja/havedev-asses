import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#667080',
        'secodary': '#E0E4EB',
        'btnPrimary': '#1F437A',
        'borderPrimary': '#E8E7E7'
      }
    },
  },
  plugins: [],
}
export default config
