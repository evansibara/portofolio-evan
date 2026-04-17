/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    /*
      REVISI RESPONSIF:
      Tambah breakpoint `xs` (475px) untuk granularity lebih halus
      di antara HP kecil (<475px) dan HP besar/tablet kecil (>=475px).
      Default tailwind breakpoints: sm=640, md=768, lg=1024, xl=1280, 2xl=1536.
    */
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        /* ink palette — sesuai CSS variables di globals.css */
        ink: {
          50:  "rgb(245 243 239 / <alpha-value>)",
          100: "rgb(235 231 224 / <alpha-value>)",
          200: "rgb(210 204 194 / <alpha-value>)",
          300: "rgb(175 168 156 / <alpha-value>)",
          400: "rgb(140 133 120 / <alpha-value>)",
          900: "rgb(18 17 15 / <alpha-value>)",
        },
        gold: "var(--color-accent)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["FigtreeVariable", "system-ui", "sans-serif"],
        display: ["FigtreeVariable", "Georgia", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      transitionTimingFunction: {
        refined: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      opacity: {
        12: "0.12",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};