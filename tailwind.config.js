// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Corrigi o caminho (tinha "//*")
  ],
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* Chrome, Safari and Opera */
          "&::-webkit-scrollbar": {
            display: "none",
          },
          /* Firefox */
          "scrollbar-width": "none",
          /* IE and Edge */
          "-ms-overflow-style": "none",
        },
      });
    },
  ],
};
