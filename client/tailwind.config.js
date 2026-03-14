/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Sora", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#eaf6ff",
          100: "#d4edff",
          200: "#abd9ff",
          300: "#7ec3ff",
          400: "#48a3ff",
          500: "#1b80f8",
          600: "#0b66d5",
          700: "#0d53ac",
          800: "#114689",
          900: "#133d72"
        }
      },
      boxShadow: {
        soft: "0 8px 24px rgba(2, 32, 71, 0.14)",
        card: "0 20px 45px rgba(11, 102, 213, 0.16)"
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-300px 0" },
          "100%": { backgroundPosition: "300px 0" }
        }
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 1.8s linear infinite"
      }
    }
  },
  plugins: []
};
