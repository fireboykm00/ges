/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#ffffff",
        surface: "#fafafa",
        border: "#e5e5e5",
        text: "#111111",
        muted: "#666666",
        accent: "#000000",
        hover: "#f5f5f5",
      },
      borderRadius: { lg: "0.5rem" },
      boxShadow: { soft: "0 1px 3px rgba(0,0,0,0.05)" },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
