import type { FontPreset } from "./types";

export const FONTS: FontPreset[] = [
  // system fonts (no network, instant)
  { id: "sf",            name: "SF Pro",          stack: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", system-ui, sans-serif', weight: 200, tracking: "-0.04em" },
  { id: "sf-bold",       name: "SF Pro Bold",     stack: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", system-ui, sans-serif', weight: 700, tracking: "-0.045em" },
  { id: "mono",          name: "SF Mono",         stack: '"SF Mono", "Menlo", "Monaco", "Consolas", ui-monospace, monospace', weight: 300, tracking: "-0.02em" },
  { id: "helvetica",     name: "Helvetica Neue",  stack: '"Helvetica Neue", "Helvetica", "Arial", sans-serif', weight: 100, tracking: "-0.05em" },
  { id: "ny",            name: "New York",        stack: '"New York", "Times New Roman", Georgia, serif', weight: 400, tracking: "-0.015em" },
  { id: "ny-italic",     name: "NY Italic",       stack: '"New York", "Times New Roman", Georgia, serif', weight: 400, tracking: "-0.015em" },
  { id: "rounded",       name: "SF Rounded",      stack: '"SF Pro Rounded", -apple-system, "SF Pro Display", system-ui, sans-serif', weight: 500, tracking: "-0.03em" },
  { id: "condensed",     name: "Helvetica Cond.", stack: '"Helvetica Neue Condensed", "Arial Narrow", sans-serif', weight: 200, tracking: "-0.01em" },
  { id: "futura",        name: "Futura",          stack: '"Futura", "Avenir Next", "Avenir", "Trebuchet MS", sans-serif', weight: 300, tracking: "-0.03em" },
  { id: "avenir",        name: "Avenir Next",     stack: '"Avenir Next", "Avenir", "Helvetica Neue", sans-serif', weight: 300, tracking: "-0.04em" },
  { id: "optima",        name: "Optima",          stack: '"Optima", "Avenir Next", "Avenir", sans-serif', weight: 400, tracking: "-0.015em" },
  { id: "didot",         name: "Didot",           stack: '"Didot", "Bodoni 72", "Bodoni MT", "Times New Roman", serif', weight: 400, tracking: "-0.015em" },
  { id: "avenir-heavy",  name: "Avenir Heavy",    stack: '"Avenir Next Heavy", "Avenir Black", "Helvetica Neue", sans-serif', weight: 900, tracking: "-0.04em" },
  // web fonts (Google Fonts CDN, loaded on demand; if blocked, fall back to system)
  { id: "inter",         name: "Inter",           stack: '"Inter", "SF Pro Display", system-ui, sans-serif', weight: 800, tracking: "-0.05em" },
  { id: "space-grotesk", name: "Space Grotesk",   stack: '"Space Grotesk", "Inter", system-ui, sans-serif', weight: 600, tracking: "-0.03em" },
  { id: "ibm-plex",      name: "IBM Plex Mono",   stack: '"IBM Plex Mono", "SF Mono", ui-monospace, monospace', weight: 500, tracking: "-0.02em" },
];

// Web font URLs — only loaded when the user picks one.
export const WEB_FONTS: Record<string, string> = {
  inter:         "https://fonts.googleapis.com/css2?family=Inter:wght@800;900&display=swap",
  "space-grotesk":"https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap",
  "ibm-plex":    "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap",
};
