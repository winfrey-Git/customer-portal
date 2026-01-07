/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          400: '#7b3fe4',
          500: '#6b3cc9',
          600: '#5631b5',
          DEFAULT: '#7b3fe4',
          foreground: '#ffffff',
        },
        // Dashboard background
        dashboard: {
          light: '#f8fafc',
          DEFAULT: '#f1f5f9',
          dark: '#e2e8f0',
        },
        // Color system
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Secondary colors
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          DEFAULT: '#334155',
        },
        // Status colors
        success: { 
          DEFAULT: '#10B981',
          light: '#d1fae5',
          dark: '#047857',
          foreground: '#ffffff',
        },
        warning: { 
          DEFAULT: '#F59E0B',
          light: '#fef3c7',
          dark: '#b45309',
          foreground: '#ffffff',
        },
        error: { 
          DEFAULT: '#EF4444',
          light: '#fee2e2',
          dark: '#b91c1c',
          foreground: '#ffffff',
        },
        info: { 
          DEFAULT: '#3B82F6',
          light: '#dbeafe',
          dark: '#1d4ed8',
          foreground: '#ffffff',
        },
      },
      // Border radius
      borderRadius: {
        none: '0',
        sm: '0.25rem',
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
        // For the accordion
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // Box shadow
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        none: 'none',
      },
      // Animations
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      // Typography
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.sidebar': {
          '@apply bg-white shadow-xl transition-all duration-300 flex flex-col': {},
        },
        '.sidebar-header': {
          '@apply bg-gradient-to-r from-primary-400 to-primary-600 text-white p-4 flex items-center justify-between': {},
        },
        '.nav-link': {
          '@apply flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100': {},
        },
        '.nav-link.active': {
          '@apply bg-purple-100 text-purple-700': {},
        },
        '.top-bar': {
          '@apply bg-gradient-to-r from-primary-400 to-primary-600 text-white shadow': {},
        },
      });
    },
  ],
};