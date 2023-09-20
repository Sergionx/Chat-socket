/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5f2ff",
          100: "#eee7ff",
          200: "#dfd2ff",
          300: "#c8afff",
          400: "#af81ff",
          500: "#984eff",
          600: "#8d2afd",
          700: "#7f18e9",
          800: "#6914c3",
          900: "#5812a0",
          950: "#330867",
        },

        secondary: {
          50: "#f0fdfc",
          100: "#cdfaf6",
          200: "#9bf4ef",
          300: "#61e7e4",
          400: "#30cfd0",
          500: "#18b0b4",
          600: "#108c91",
          700: "#116f74",
          800: "#13575c",
          900: "#14494d",
          950: "#052a2e",
        },
      },
    },
  },
  plugins: [],
};

// Palette https://uicolors.app/edit?sv1=windsor:50-f5f2ff/100-eee7ff/200-dfd2ff/300-c8afff/400-af81ff/500-984eff/600-8d2afd/700-7f18e9/800-6914c3/900-5812a0/950-330867;turquoise:50-f0fdfc/100-cdfaf6/200-9bf4ef/300-61e7e4/400-30cfd0/500-18b0b4/600-108c91/700-116f74/800-13575c/900-14494d/950-052a2e
