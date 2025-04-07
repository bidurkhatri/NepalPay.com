import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Shadcn UI colors
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
        
        // NepaliPay custom colors
        "primary-light": "var(--primary-light)",
        "primary-dark": "var(--primary-dark)",
        "secondary-light": "var(--secondary-light)",
        "secondary-dark": "var(--secondary-dark)",
        "accent-light": "var(--accent-light)",
        "accent-dark": "var(--accent-dark)",
        danger: {
          DEFAULT: "var(--danger-color)",
          light: "var(--danger-light)",
          dark: "var(--danger-dark)",
        },
        success: {
          DEFAULT: "var(--success-color)",
          light: "var(--success-light)",
          dark: "var(--success-dark)",
        },
        warning: {
          DEFAULT: "var(--warning-color)",
          light: "var(--warning-light)",
          dark: "var(--warning-dark)",
        },
        "background-light": "var(--background-light)",
        "background-dark": "var(--background-dark)",
        text: {
          DEFAULT: "var(--text-color)",
          muted: "var(--text-muted)",
          dimmed: "var(--text-dimmed)",
          disabled: "var(--text-disabled)",
        },
        "border-light": "var(--border-light)",
        "border-dark": "var(--border-dark)",
        glass: {
          DEFAULT: "var(--glass-bg)",
          light: "var(--glass-bg-light)",
          border: "var(--glass-border)",
          shadow: "var(--glass-shadow)",
        },
        "card-alt": "var(--card-bg-alt)",
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
        "gradient-slide": {
          "0%": { "background-position": "100% 0" },
          "100%": { "background-position": "-100% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-slide": "gradient-slide 3s linear infinite",
      },
      transitionDuration: {
        '2000': '2000ms',
      }
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
