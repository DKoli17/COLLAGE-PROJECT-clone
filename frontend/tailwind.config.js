module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        neutral: {
          DEFAULT: "hsl(var(--neutral))",
          foreground: "hsl(var(--neutral-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
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
        gray: {
          50: "hsl(210, 20%, 98%)",
          100: "hsl(210, 16%, 94%)",
          200: "hsl(210, 14%, 89%)",
          300: "hsl(210, 12%, 80%)",
          400: "hsl(210, 10%, 65%)",
          500: "hsl(210, 9%, 50%)",
          600: "hsl(210, 10%, 38%)",
          700: "hsl(210, 15%, 28%)",
          800: "hsl(210, 18%, 20%)",
          900: "hsl(210, 20%, 14%)",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ['"Fira Code"', "monospace"],
      },
      fontSize: {
        h1: "2.488rem",
        h2: "1.866rem",
        h3: "1.4rem",
        body: "1rem",
        small: "0.875rem",
      },
      lineHeight: {
        body: "1.5",
        heading: "1.2",
      },
      letterSpacing: {
        heading: "-0.025em",
      },
      spacing: {
        '4': '1rem',
        '8': '2rem',
        '12': '3rem',
        '16': '4rem',
        '24': '6rem',
        '32': '8rem',
        '48': '12rem',
        '64': '16rem',
      },
      backgroundImage: {
        'gradient-1': 'linear-gradient(135deg, hsl(210, 80%, 50%), hsl(156, 65%, 45%))',
        'gradient-2': 'linear-gradient(180deg, hsl(210, 75%, 35%), hsl(210, 70%, 25%))',
        'button-border-gradient': 'linear-gradient(90deg, hsl(210, 80%, 50%), hsl(210, 70%, 35%))',
        'student-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'vendor-gradient': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'admin-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        'hero-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
