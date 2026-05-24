/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0F19',
          card: '#161F30',
          border: '#23324E',
          text: '#F3F4F6',
          primary: '#6366F1', // Indigo
          secondary: '#3B82F6', // Blue
          accent: '#10B981', // Emerald
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        varsity: ['Impact', 'Arial Black', 'sans-serif'],
        script: ['Brush Script MT', 'cursive'],
        serif: ['Georgia', 'serif']
      }
    },
  },
  plugins: [],
}
