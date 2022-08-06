const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        gray: colors.neutral,
        primary: {
          DEFAULT: "#ff914d",
          dark: "#cc743d",
        },
      },
    },
  },
  plugins: [require("ps-scrollbar-tailwind")],
};
