/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Arrivio Brand Palette (Nested for robust class generation)
        arrivio: {
          green: '#2C3E30',
          beige: '#EAE8E4',
          accent: '#CAA472',
          dark: '#1a261d',
        },

        // Identity Colors
        charcoal: '#2B2B2B',
        forestGreen: '#2F5D50',
        warmSand: '#EDE6DA',
        softWhite: '#FAFAF8',
        earthBrown: '#5A4634',
        mutedGold: '#C6A45E',
        adminGreen: '#243B33',
      },
      fontFamily: {
        // Arrivio Font Stack
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        heading: ['IBM Plex Sans', 'sans-serif'],

        // Aliases for clarity
        arrivioSans: ['Inter', 'sans-serif'],
        arrivioSerif: ['Playfair Display', 'serif'],
        arrivioHeading: ['IBM Plex Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
