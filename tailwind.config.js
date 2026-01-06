module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./modules/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      colors: {
        brand: {
          orange: "#FF8A00",
          green: "#00C853",
          dark: "#1A1A1A",
        },
        beige: {
          50: "#fef6e4",
          100: "#fff7ed",
        },
      },
      animation: {
        "bounce-slow": "bounce 3s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
