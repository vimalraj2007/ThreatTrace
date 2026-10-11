import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // SOC semantic severity colors
        soc: {
          critical: "#ef4444",
          high: "#f97316",
          medium: "#f59e0b",
          low: "#3b82f6",
          normal: "#10b981",
          bg: "#080c14",
          card: "#0f172a",
          panel: "#131c31",
          border: "#1e293b",
          highlight: "#0284c7"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'glow-red': '0 0 15px -3px rgba(239, 68, 68, 0.4)',
        'glow-orange': '0 0 15px -3px rgba(249, 115, 22, 0.4)',
        'glow-blue': '0 0 15px -3px rgba(59, 130, 246, 0.4)',
        'glow-cyan': '0 0 15px -3px rgba(6, 182, 212, 0.4)',
      },
      keyframes: {
        pulseScan: {
          '0%, 100%': { opacity: '1', transform: 'translateY(0%)' },
          '50%': { opacity: '0.4', transform: 'translateY(100%)' }
        },
        radarPulse: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' }
        }
      },
      animation: {
        'radar': 'radarPulse 3s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'pulse-scan': 'pulseScan 2s ease-in-out infinite'
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
