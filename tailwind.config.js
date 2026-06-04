/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a", // fundo escuro da marca
        accent: "#E87040", // laranja/coral Anthropic
        "accent-dark": "#c9552a",
        correct: "#22c55e", // verde do gabarito (alternativa certa)
        wrong: "#ef4444", // vermelho (alternativa errada selecionada)
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
