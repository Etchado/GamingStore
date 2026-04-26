/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Electric Blue #0056b3
        primary: {
          50:  '#e6f0fa',
          100: '#cce1f5',
          200: '#99c3eb',
          300: '#66a5e1',
          400: '#3387d7',
          500: '#0069cc',
          600: '#0056b3',  // ← main
          700: '#004494',
          800: '#003375',
          900: '#002256',
        },
        // Emerald Green #28a745
        success: {
          50:  '#e9f7ed',
          100: '#d3efdb',
          200: '#a7dfb7',
          300: '#7acf93',
          400: '#4ebf6f',
          500: '#33b35a',
          600: '#28a745',  // ← main
          700: '#1e8035',
          800: '#145a25',
          900: '#0a3315',
        },
        surface: '#f8fafc',
        ink:     '#1a202c',
        muted:   '#718096',
        border:  '#e0e0e0',  // as specified
        'border-light': '#f0f0f0',
      },
      boxShadow: {
        card:        '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover':'0 10px 30px rgba(0,86,179,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        nav:         '0 1px 0 #e0e0e0',
        input:       '0 0 0 3px rgba(0,86,179,0.12)',
      },
      spacing: {
        // explicit 8pt aliases for clarity
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px  — navbar height
        '26': '6.5rem',   // 104px — two-row navbar
        '25': '6.25rem',  // 100px — single-row navbar + announcement bar (64+36)
        '35': '8.75rem',  // 140px — two-row navbar + announcement bar (104+36)
      },
    },
  },
  plugins: [],
}
