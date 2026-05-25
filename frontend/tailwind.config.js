/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#090b11',      // Obsidian Black/Blue background
        darkCard: '#11141d',    // Dark Gray/Blue Card
        darkBorder: '#1f2533',  // Subtly lighter border
        accentNeon: '#00f0ff',  // Cyan/Electric Neon Blue
        accentBlue: '#2563eb',  // Deep electric blue
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 240, 255, 0.15)',
        glowHover: '0 0 30px rgba(0, 240, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
