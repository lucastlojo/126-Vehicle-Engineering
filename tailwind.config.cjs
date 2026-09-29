/** Optional Tailwind v3 adapter. Runtime styling uses tokens.css + src/styles.css. */
module.exports = {
  content: ["./index.html", "./about/**/*.html", "./products/**/*.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {
    colors: {
      canvas: "var(--color-bg)", surface: "var(--color-surface)", raised: "var(--color-raised)",
      ink: "var(--color-text)", muted: "var(--color-muted)", accent: "var(--color-accent)",
      "on-accent": "var(--color-on-accent)", line: "var(--color-line)",
      success: "var(--color-success)", warning: "var(--color-warning)", error: "var(--color-error)"
    },
    fontFamily: { heading: ["Space Grotesk", "Inter", "sans-serif"], body: ["Inter", "sans-serif"], mono: ["JetBrains Mono", "Consolas", "monospace"] },
    fontSize: { display: ["var(--text-display)", { lineHeight: "1.03", letterSpacing: "-.065em" }], h1: ["var(--text-h1)", { lineHeight: "1.08" }], h2: ["var(--text-h2)", { lineHeight: "1.12" }] },
    borderRadius: { control: "var(--radius-control)", card: "var(--radius-card)", panel: "var(--radius-panel)" },
    boxShadow: { card: "var(--shadow-card)", float: "var(--shadow-float)" },
    maxWidth: { content: "var(--content-max)" },
    transitionTimingFunction: { precision: "var(--ease-out)" }
  } },
  plugins: []
};
