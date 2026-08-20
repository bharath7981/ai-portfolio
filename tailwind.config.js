/** @type {import('tailwindcss').Config} */

// Helper: creates a Tailwind color value that reads from a CSS variable
// and supports the opacity modifier (e.g. bg-ink/80) via color-mix().
// Falls back gracefully when no <alpha-value> is applied.
function cssVar(varName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `color-mix(in srgb, var(${varName}) ${opacityValue * 100}%, transparent)`;
    }
    return `var(${varName})`;
  };
}

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: cssVar("--color-ink"),
        "ink-deep": cssVar("--color-ink-deep"),
        paper: cssVar("--color-paper"),
        fog: cssVar("--color-fog"),
        signal: cssVar("--color-signal"),
        wire: cssVar("--color-wire"),
        line: cssVar("--color-line"),
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
