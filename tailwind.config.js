/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#070C18',
        panel: '#101A2E',
        chalk: '#F2F5FF',
        live: '#35E6E0',
        anchor: '#F5A524',
        proof: '#8BF08B',
        warn: '#FF6B6B',
      },
      fontFamily: {
        // Heavy geometric-grotesque display face for headings / numeric readouts.
        // System-stack only: no runtime font fetch, works fully offline.
        display: [
          'Century Gothic',
          'Avenir Next',
          'Avenir',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
        // Serif with real math feel, for figure point labels (A, B, O, angle marks)
        // so the on-screen figure matches printed-slide lettering.
        math: [
          '"Cambria Math"',
          'Cambria',
          'STIXGeneral',
          'Georgia',
          '"Times New Roman"',
          'serif',
        ],
      },
      fontFeatureSettings: {
        tabular: '"tnum" 1, "lnum" 1',
      },
    },
  },
  plugins: [],
}
