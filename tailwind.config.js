// tailwind.config.js
import typography from '@tailwindcss/typography'; // CERTIFIQUE-SE QUE ESTA LINHA DE IMPORTAÇÃO ESTÁ PRESENTE E CORRETA

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0eefe',
          200: '#bae0fd',
          300: '#7dccfc',
          400: '#36b3f9',
          500: '#0d96ea',
          600: '#0279c8',
          700: '#0262a3',
          800: '#065386',
          900: '#0a4570',
          950: '#072c4b',
        },
        secondary: {
          50: '#f3f8f9',
          100: '#dff1f9',
          200: '#c2e5f5',
          300: '#93d4ee',
          400: '#5ab9e3',
          500: '#349ed8',
          600: '#207fc6',
          700: '#1c68b0',
          800: '#1c5690',
          900: '#1c4977',
          950: '#142e4a',
        },
        java: { // Mantendo sua paleta de cores personalizada
          50: '#f2f7fd',
          100: '#e5eefb',
          200: '#d0e0f7',
          300: '#b0cbf1',
          400: '#8aafe8',
          500: '#6a8fde',
          600: '#4f6fd0',
          700: '#4159bd',
          800: '#36499a',
          900: '#304079',
          950: '#1f264a',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        dark: { // Paleta dark
          50: '#f6f6f7',
          100: '#e0e2e4',
          200: '#c1c5c9',
          300: '#9ca2a9',
          400: '#797f88',
          500: '#60666f',
          600: '#4c5159',
          700: '#3f444b',
          800: '#282c32', // Ajustado para um cinza mais escuro para base de texto dark
          900: '#1e2125', // Ajustado
          950: '#121416', // Fundo principal do dark mode
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'inner-lg': 'inset 0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      // Adicionando configuração para o plugin de tipografia (opcional, mas recomendado)
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.dark.800'), // Cor base do texto no modo claro
            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
            'h1, h2, h3, h4, h5, h6': {
                color: theme('colors.dark.900'),
            },
            // ... outras customizações para o modo claro
          },
        },
        invert: { // Estilos para o dark mode (quando a classe 'dark' está no html/body)
          css: {
            color: theme('colors.dark.200'), // Cor base do texto no modo escuro
             a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300'),
              },
            },
            'h1, h2, h3, h4, h5, h6': {
                color: theme('colors.white'),
            },
            // ... outras customizações para o modo escuro
          },
        },
      }),
    },
  },
  plugins: [
    typography, // Use a variável importada
  ],
};