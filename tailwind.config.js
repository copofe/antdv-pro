/** @type {import('tailwindcss').Config} */
import antdTheme from './themes/antd-theme.json'

export default {
  darkMode: ['class'],

  content: [
    './src/view/**/*.vue',
    './src/view/components/**/*.{ts,tsx}',
    './src/view/styles/*.css',
  ],

  theme: {
    extend: {
      colors: antdTheme,
    },
    data: {
      'flex-center': 'flex items-center justify-center',
      'flex-between': 'flex items-center justify-between',
      'flex-end': 'flex items-end justify-between',
    },

    plugins: [],
  },
}
