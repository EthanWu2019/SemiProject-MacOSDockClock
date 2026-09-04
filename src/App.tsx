import { useEffect, useMemo, useState } from "react";
import { ClockFace } from "./components/ClockFace";
import { SettingsPanel } from "./components/SettingsPanel";
import { useSettings, useNow, useIdleCursor } from "./hooks/useSettings";
import { FONTS } from "./fonts";
import { getTheme } from "./themes";
import type { ThemeId } from "./types";

export default function App() {
  const { settings, update } = useSettings();
  const now = useNow(1000);
  useIdleCursor(1500);

  const theme = getTheme(settings.theme);
  const font = FONTS.find((f) => f.id === settings.font) || FONTS[0];

  // fullscreen detection
  const [isFs, setIsFs] = useState(false);
  useEffect(() => {
    const sync = () => setIsFs(!!(document.fullscreenElement || (document as any).webkitFullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    sync();
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  const toggleFs = () => {
    if (isFs) {
      (document.exitFullscreen || (document as any).webkitExitFullscreen).call(document);
    } else {
      const el = document.documentElement;
      (el.requestFullscreen || (el as any).webkitRequestFullscreen).call(el);
    }
  };

  // F key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) return;
      if (e.key === "f" || e.key === "F") toggleFs();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  // body background driven by theme
  useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.color = theme.text;
    document.body.style.fontFamily = font.stack;
  }, [theme, font]);

  // controls auto-hide: show on mouse move, hide after idle
  const [showControls, setShowControls] = useState(true);
  useEffect(() => {
    let timer: number | null = null;
    const reveal = () => {
      setShowControls(true);
      if (timer != null) window.clearTimeout(timer);
      timer = window.setTimeout(() => setShowControls(false), 2200);
    };
    const events = ["mousemove", "touchstart", "pointerdown"];
    events.forEach((e) => document.addEventListener(e, reveal, { passive: true }));
    reveal();
    return () => {
      events.forEach((e) => document.removeEventListener(e, reveal));
      if (timer != null) window.clearTimeout(timer);
    };
  }, []);

  // click-outside closes font menu
  useEffect(() => {
    const close = () => {
      // SettingsPanel manages its own menu open state via re-render; nothing to do.
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: theme.bg,
        color: theme.text,
        fontFamily: font.stack,
        transition: "background 0.4s, color 0.4s",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <ClockFace now={now} settings={settings} theme={theme} font={font} />

      <div
        style={{
          position: "fixed",
          top: 14, right: 14,
          zIndex: 100,
          opacity: showControls ? 1 : 0,
          pointerEvents: showControls ? "auto" : "none",
          transform: showControls ? "translateY(0)" : "translateY(-6px)",
          transition: "opacity 0.25s, transform 0.25s",
        }}
      >
        <SettingsPanel
          settings={settings}
          theme={theme}
          onUpdate={update}
          onRequestFullscreen={toggleFs}
          isFullscreen={isFs}
        />
      </div>

      {/* initial hint, fades out after a few seconds */}
      <div
        style={{
          position: "fixed",
          bottom: 14, left: "50%",
          transform: "translateX(-50%)",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: theme.muted,
          fontWeight: 500,
          background: theme.bg_panel_strong,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          padding: "6px 12px",
          borderRadius: 999,
          border: `1px solid ${theme.border}`,
          animation: "hintFade 5s forwards",
          pointerEvents: "none",
        }}
      >
        Move mouse · F for fullscreen
      </div>
      <style>{`
        @keyframes hintFade {
          0%   { opacity: 0; }
          10%  { opacity: 0.7; }
          80%  { opacity: 0.7; }
          100% { opacity: 0; visibility: hidden; }
        }
      `}</style>
    </div>
  );
}
