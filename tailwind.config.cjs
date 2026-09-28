/** Optional Tailwind CSS v3 adapter. tokens.css remains the source of truth. */
module.exports = {
  content: ["./**/*.{html,js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        graphite: "var(--color-graphite)",
        steel: "var(--color-steel)",
        silver: "var(--color-silver)",
        mist: "var(--color-mist)",
        amber: "var(--color-amber)",
        "amber-hover": "var(--color-amber-hover)",
        "amber-pressed": "var(--color-amber-pressed)",
        signal: "var(--color-signal)",
        "confirmed-text": "var(--color-confirmed-text)",
        "confirmed-bg": "var(--color-confirmed-bg)",
        "caution-text": "var(--color-caution-text)",
        "caution-bg": "var(--color-caution-bg)",
        "error-text": "var(--color-error-text)",
        "error-bg": "var(--color-error-bg)",
      },
      fontFamily: {
        heading: ["Barlow Condensed", "Arial Narrow", "Arial", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["var(--text-display)", { lineHeight: "0.98", fontWeight: "700" }],
        h1: ["var(--text-h1)", { lineHeight: "1.05", fontWeight: "700" }],
        h2: ["var(--text-h2)", { lineHeight: "1.1", fontWeight: "700" }],
        h3: ["var(--text-h3)", { lineHeight: "1.15", fontWeight: "600" }],
        lead: ["var(--text-lead)", { lineHeight: "1.55" }],
        body: ["var(--text-body)", { lineHeight: "1.5" }],
        small: ["var(--text-small)", { lineHeight: "1.45" }],
      },
      borderRadius: {
        control: "var(--radius-control)",
        card: "var(--radius-card)",
      },
      maxWidth: { content: "var(--content-max)" },
      boxShadow: { card: "var(--shadow-card)" },
    },
  },
  plugins: [],
};
