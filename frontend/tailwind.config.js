/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores dinámicos que se actualizan via CSS variables
        'primario': 'var(--color-primario)',
        'secundario': 'var(--color-secundario)',
        'acento': 'var(--color-acento)',
      },
    },
  },
  plugins: [],
}