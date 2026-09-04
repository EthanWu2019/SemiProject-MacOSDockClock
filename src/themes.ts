import type { ThemeId } from "./types";

export interface Theme {
  id: ThemeId;
  name: string;
  bg: string;
  text: string;
  muted: string;
  accent: string;
  textSoft: string;
  border: string;
  bg_panel: string;
  bg_panel_strong: string;
  bg_menu: string;
  accent_panel: string;
  fontIsLight?: boolean;
}

// Suffix appended to every theme entry. isLight flips the panel surface so
// contrast stays correct on either bright or dark backgrounds.
function panelFor(isLight: boolean) {
  if (isLight) {
    return {
      border: "rgba(255,255,255,0.22)",
      bg_panel: "rgba(255,255,255,0.10)",
      bg_panel_strong: "rgba(255,255,255,0.14)",
      bg_menu: "rgba(28,28,30,0.95)",
      accent_panel: "rgba(255,255,255,0.24)",
    };
  }
  return {
    border: "rgba(0,0,0,0.10)",
    bg_panel: "rgba(0,0,0,0.04)",
    bg_panel_strong: "rgba(255,255,255,0.86)",
    bg_menu: "rgba(255,255,255,0.96)",
    accent_panel: "rgba(0,0,0,0.10)",
  };
}

export const THEMES: Theme[] = [
  {
    id: "dark",
    name: "Dark",
    bg: "radial-gradient(ellipse 90% 60% at 50% 35%, #1c1828 0%, #0a0a0c 70%)",
    text: "#f5f5f7",
    muted: "rgba(245,245,247,0.55)",
    accent: "#a78bfa",
    textSoft: "rgba(245,245,247,0.78)",
    fontIsLight: true,
    ...panelFor(true),
  },
  {
    id: "black",
    name: "Black",
    bg: "#000000",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.5)",
    accent: "#ffffff",
    textSoft: "rgba(255,255,255,0.85)",
    fontIsLight: true,
    ...panelFor(true),
  },
  {
    id: "light",
    name: "Light",
    bg: "linear-gradient(180deg, #fafafa 0%, #e7e9eb 100%)",
    text: "#14181b",
    muted: "rgba(20,24,27,0.5)",
    accent: "#3b82f6",
    textSoft: "rgba(20,24,27,0.78)",
    ...panelFor(false),
  },
  {
    id: "paper",
    name: "Paper",
    bg: "linear-gradient(180deg, #faf6ec 0%, #ece4d2 100%)",
    text: "#2a2418",
    muted: "rgba(42,36,24,0.55)",
    accent: "#a8551d",
    textSoft: "rgba(42,36,24,0.82)",
    ...panelFor(false),
  },
  {
    id: "standby-warm",
    name: "Sunrise",
    bg: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.72)",
    accent: "#fff4e0",
    textSoft: "rgba(255,255,255,0.92)",
    fontIsLight: true,
    ...panelFor(true),
  },
  {
    id: "standby-cool",
    name: "Aurora",
    bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.75)",
    accent: "#e0f7ff",
    textSoft: "rgba(255,255,255,0.92)",
    fontIsLight: true,
    ...panelFor(true),
  },
  {
    id: "standby-sunset",
    name: "Sunset",
    bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.72)",
    accent: "#fff7d0",
    textSoft: "rgba(255,255,255,0.92)",
    fontIsLight: true,
    ...panelFor(true),
  },
  {
    id: "standby-forest",
    name: "Forest",
    bg: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.7)",
    accent: "#c8f0d0",
    textSoft: "rgba(255,255,255,0.92)",
    fontIsLight: true,
    ...panelFor(true),
  },
  {
    id: "standby-mono",
    name: "Mono",
    bg: "#1a1a1c",
    text: "#fafafa",
    muted: "rgba(250,250,250,0.5)",
    accent: "#fafafa",
    textSoft: "rgba(250,250,250,0.82)",
    fontIsLight: true,
    ...panelFor(true),
  },
];

export function getTheme(id: ThemeId): Theme {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}