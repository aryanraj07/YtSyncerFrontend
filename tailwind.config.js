/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true, // automatically center containers
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
      },
    },
    extend: {
      colors: {
        neon: "#70fa83",
        darkBg: "#111827",
        darkText: "#f3f4f6",
        violet: "#3b1e59",
        neonOrange: "#ff6a3d",
        neonBlue: "#4da3ff",
      },
      height: {
        navbar: "var(--navbar-height)",
      },
      minHeight: {
        hero: "calc(100svh-var(--navbar-height)-var(--bottom-menu-height)-var(--safe-bottom))",
      },
    },
  },
  darkMode: "class", // enable dark mode via 'dark' class
  plugins: [],
};
