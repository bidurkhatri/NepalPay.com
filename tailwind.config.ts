import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      colors: {
        // Map our CSS custom properties to Tailwind colors
        primary: {
          DEFAULT: "var(--primary-color)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--secondary-color)",
          light: "var(--secondary-light)",
          dark: "var(--secondary-dark)",
        },
        accent: {
          DEFAULT: "var(--accent-color)",
          light: "var(--accent-light)",
          dark: "var(--accent-dark)",
        },
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
        background: {
          DEFAULT: "var(--background-color)",
          light: "var(--background-light)",
          dark: "var(--background-dark)",
        },
        text: {
          DEFAULT: "var(--text-color)",
          muted: "var(--text-muted)",
          dimmed: "var(--text-dimmed)",
          disabled: "var(--text-disabled)",
        },
        border: {
          DEFAULT: "var(--border-color)",
          light: "var(--border-light)",
          dark: "var(--border-dark)",
        },
        glass: {
          DEFAULT: "var(--glass-bg)",
          light: "var(--glass-bg-light)",
          border: "var(--glass-border)",
          shadow: "var(--glass-shadow)",
        },
        card: {
          DEFAULT: "var(--card-bg)",
          alt: "var(--card-bg-alt)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
