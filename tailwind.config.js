/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ground: 'var(--ground)',
        surface: 'var(--surface)',
        raised: 'var(--raised)',
        line: 'var(--border)',
        rule: 'var(--rule)',
        control: 'var(--control)',
        ink: 'var(--text)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        lantern: 'var(--accent)',
        lanternDeep: 'var(--accent-deep)',
        lanternPale: 'var(--pill-positive-bg)',
        correct: 'var(--correct)',
        correctPale: 'var(--correct-bg)',
        correctInk: 'var(--correct-ink)',
        negative: 'var(--negative)',
        negativePale: 'var(--pill-negative-bg)',
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['"Baloo 2"', 'Nunito', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
