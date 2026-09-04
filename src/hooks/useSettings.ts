import { useEffect, useState, useCallback } from "react";
import type { ClockSettings, ThemeId, FontId, WeekdayMode } from "../types";

const KEY = "mac-clock.v3";

const DEFAULTS: ClockSettings = {
  font: "sf",
  size: 100,
  theme: "dark",
  hourFmt: 12,
  weekdayMode: "full",
  showDate: true,
  showSeconds: true,
  showMeta: true,
  showAmPm: true,
};

function load(): ClockSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    // merge in case new fields added since last save
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<ClockSettings>(load);

  const update = useCallback(<K extends keyof ClockSettings>(key: K, value: ClockSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const patch = useCallback((p: Partial<ClockSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...p };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return { settings, update, patch };
}

// --- useNow: returns a Date updated every animation frame (or given interval).
// We tick at 1000ms for the seconds display; flip animations are driven by
// comparing prev/next values via React's key prop, not by RAF.
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

// --- useIdleCursor: hides body cursor after `idleMs` of mouse/keyboard idle.
export function useIdleCursor(idleMs = 1500) {
  useEffect(() => {
    let timer: number | null = null;
    const reset = () => {
      document.body.classList.remove("idle");
      if (timer != null) window.clearTimeout(timer);
      timer = window.setTimeout(() => document.body.classList.add("idle"), idleMs);
    };
    const events = ["mousemove", "touchstart", "pointerdown", "keydown"];
    events.forEach((e) => document.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      events.forEach((e) => document.removeEventListener(e, reset));
      if (timer != null) window.clearTimeout(timer);
    };
  }, [idleMs]);
}
