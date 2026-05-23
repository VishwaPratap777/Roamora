/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8e8',
          100: '#faedc5',
          200: '#f5d98a',
          300: '#efc04f',
          400: '#e0a82e',
          500: '#c8942a',
          600: '#a07320',
          700: '#7a5518',
          800: '#654615',
          900: '#553b14',
          950: '#311e07',
        },
        dark: {
          50: '#f5f6f8',
          100: '#e0e3ea',
          200: '#c4c9d6',
          300: '#9ba3b8',
          400: '#6d7794',
          500: '#525c79',
          600: '#464e66',
          700: '#3c4255',
          800: '#353a48',
          900: '#1a1d27',
          950: '#0a0e1a',
        },
        accent: {
          gold: '#c8a44e',
          amber: '#f59e0b',
          emerald: '#10b981',
          cyan: '#06b6d4',
          rose: '#f43f5e',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        accent: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(3rem, 6vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'hero-sub': ['clamp(1rem, 1.5vw, 1.25rem)', { lineHeight: '1.6' }],
        'section-title': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-overlay': 'linear-gradient(180deg, rgba(10,14,26,0.6) 0%, rgba(10,14,26,0.1) 40%, rgba(10,14,26,0.05) 60%, rgba(10,14,26,0.5) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.6s ease-out forwards',
        'slide-left': 'slideLeft 0.6s ease-out forwards',
        'slide-right': 'slideRight 0.6s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'scroll-hint': 'scrollHint 2s ease-in-out infinite',
        'fog-drift': 'fogDrift 20s linear infinite',
        'fog-drift-reverse': 'fogDrift 25s linear infinite reverse',
        'cloud-drift': 'cloudDrift 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(200, 164, 78, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(200, 164, 78, 0.6)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        scrollHint: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '1' },
          '50%': { transform: 'translateY(8px)', opacity: '0.5' },
        },
        fogDrift: {
          '0%': { transform: 'translateX(-10%) translateY(0)' },
          '50%': { transform: 'translateX(5%) translateY(-5px)' },
          '100%': { transform: 'translateX(-10%) translateY(0)' },
        },
        cloudDrift: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.18)',
        'glass-xl': '0 24px 64px rgba(0, 0, 0, 0.24)',
        'glow-gold': '0 0 30px rgba(200, 164, 78, 0.3)',
        'glow-gold-lg': '0 0 50px rgba(200, 164, 78, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.15)',
      },
      transitionDuration: {
        '400': '400ms',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
