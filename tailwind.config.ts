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
        
        // NepaliPay semantic colors
        "primary-light": "var(--primary-light)",
        "primary-dark": "var(--primary-dark)",
        "secondary-light": "var(--secondary-light)",
        "secondary-dark": "var(--secondary-dark)",
        "accent-light": "var(--accent-light)",
        "accent-dark": "var(--accent-dark)",
        
        // Design system semantic colors
        'design-primary': '#1A73E8',
        'design-secondary': '#009688',
        'design-background': '#F5F9FF',
        'design-surface': 'rgba(255,255,255,0.12)',
        'design-text-primary': '#1E1E1E',
        'design-text-secondary': '#616161',
        'design-success': '#2E7D32',
        'design-error': '#C62828',
        'design-warning': '#FF8F00',
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-success": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)", backgroundColor: "hsl(var(--success))" },
          "100%": { transform: "scale(1)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)", opacity: "0.8" },
          "70%": { transform: "scale(0.9)", opacity: "0.9" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "glow": {
          "0%, 100%": { "box-shadow": "0 0 5px hsl(var(--primary))" },
          "50%": { "box-shadow": "0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary))" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-slide": "gradient-slide 3s linear infinite",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.2s ease-out",
        "pulse-success": "pulse-success 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-out": "slide-out 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "bounce-in": "bounce-in 0.6s ease-out",
        "pulse-slow": "pulse-slow 2s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
        '4xl': '1920px',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      }
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
