/** @type {import('tailwindcss').Config} */

export default {

  darkMode: "class",

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {

    extend: {

      colors: {

        app: "var(--bg-app)",

        sidebar: "var(--bg-sidebar)",

        header: "var(--bg-header)",

        card: "var(--bg-card)",

        muted: "var(--bg-muted)",

        inset: "var(--bg-inset)",

        line: "var(--border)",

        "line-subtle": "var(--border-subtle)",

        fg: {

          DEFAULT: "var(--text-primary)",

          muted: "var(--text-secondary)",

          subtle: "var(--text-tertiary)",

        },

        douyin: {

          pink: "#FE2C55",

          cyan: "#25F4EE",

          /* legacy aliases → map to tokens where possible */

          dark: "var(--bg-app)",

          card: "var(--bg-card)",

          border: "var(--border)",

          muted: "var(--text-tertiary)",

        },

      },

      fontFamily: {

        sans: [

          "PingFang SC",

          "Microsoft YaHei",

          "system-ui",

          "-apple-system",

          "sans-serif",

        ],

      },

      animation: {

        "fade-in": "fadeIn 0.4s ease-out",

        "slide-up": "slideUp 0.35s ease-out",

      },

      keyframes: {

        fadeIn: {

          "0%": { opacity: "0" },

          "100%": { opacity: "1" },

        },

        slideUp: {

          "0%": { opacity: "0", transform: "translateY(12px)" },

          "100%": { opacity: "1", transform: "translateY(0)" },

        },

      },

    },

  },

  plugins: [],

};

