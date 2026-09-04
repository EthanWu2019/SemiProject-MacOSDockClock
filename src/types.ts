export type ThemeId =
  | "dark"
  | "black"
  | "light"
  | "paper"
  | "standby-warm"
  | "standby-cool"
  | "standby-sunset"
  | "standby-forest"
  | "standby-mono";

export type WeekdayMode = "off" | "full" | "short";
export type FontId =
  | "sf" | "sf-bold" | "mono" | "helvetica" | "ny"
  | "ny-italic" | "rounded" | "condensed" | "futura"
  | "avenir" | "optima" | "didot" | "avenir-heavy"
  | "inter" | "space-grotesk" | "ibm-plex";

export interface FontPreset {
  id: FontId;
  name: string;
  stack: string;
  weight: number;
  tracking: string;
}

export interface ClockSettings {
  font: FontId;
  size: number;          // 50..200 (slider 0..100 maps to fit ratio internally)
  theme: ThemeId;
  hourFmt: 12 | 24;
  weekdayMode: WeekdayMode;
  showDate: boolean;
  showSeconds: boolean;
  showMeta: boolean;
  showAmPm: boolean;
}
