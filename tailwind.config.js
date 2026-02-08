/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Color (Anchor): Forest Green
        forestGreen: '#2F5D50',
        // Secondary Background: Warm Sand / Beige
        warmSand: '#EDE6DA',
        // Main Background: Soft White
        softWhite: '#FAFAF8',
        // Text Body: Charcoal
        charcoal: '#2B2B2B',
        // Sub-headings: Earth Brown
        earthBrown: '#5A4634',
        // Accent: Muted Gold
        mutedGold: '#C6A45E',
        // Business page colors
        arrivioGreen: '#2C3E30',
      },
      fontFamily: {
        // Headings: IBM Plex Sans
        heading: ['IBM Plex Sans', 'sans-serif'],
        // Body: Inter
        body: ['Inter', 'sans-serif'],
        // Business page display font
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
