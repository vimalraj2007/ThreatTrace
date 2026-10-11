import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { bg: "#0c1015", panel: "#131920", raised: "#1a222c", line: "#242f3d", mute: "#8593a6", txt: "#d9dfe7",
      accent: "#5a9bf0", crit: "#e5484d", high: "#ee7d3a", med: "#e2b23a", low: "#4c93e8", ok: "#3fb37f" },
    fontFamily: { sans: ["var(--font-sans)", "system-ui"], mono: ["var(--font-mono)", "monospace"] },
  } },
  plugins: [],
};
export default config;
