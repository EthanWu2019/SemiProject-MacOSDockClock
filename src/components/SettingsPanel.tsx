import { useEffect, useState } from "react";
import type {
  ClockSettings,
  Theme,
  ThemeId,
  FontId,
  WeekdayMode,
} from "../types";
import { FONTS, WEB_FONTS } from "../fonts";

interface Props {
  settings: ClockSettings;
  theme: Theme;
  onUpdate: <K extends keyof ClockSettings>(key: K, value: ClockSettings[K]) => void;
  onRequestFullscreen: () => void;
  isFullscreen: boolean;
}

interface SegProps<T extends string | number> {
  theme: Theme;
  options: { v: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  equal?: boolean;
}

function Seg<T extends string | number>({ theme, options, value, onChange, equal = false }: SegProps<T>) {
  return (
    <div
      style={{
        display: "inline-flex",
        background: theme.bg_panel,
        border: `1px solid ${theme.border}`,
        borderRadius: 999,
        padding: 3,
        gap: 2,
      }}
    >
      {options.map((o) => (
        <button
          key={String(o.v)}
          onClick={() => onChange(o.v)}
          style={{
            background: o.v === value ? theme.accent_panel : "transparent",
            border: 0,
            color: o.v === value ? theme.text : theme.muted,
            padding: equal ? "7px 0" : "6px 12px",
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: "0.02em",
            borderRadius: 999,
            cursor: "pointer",
            fontFamily: "inherit",
            flex: equal ? 1 : "none",
            minWidth: equal ? 0 : undefined,
            textAlign: "center",
            transition: "background 0.18s, color 0.18s",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ on, onChange, theme }: { on: boolean; onChange: () => void; theme: Theme }) {
  return (
    <button
      onClick={onChange}
      aria-pressed={on}
      style={{
        position: "relative",
        width: 38, height: 22,
        background: on ? theme.accent : theme.bg_panel,
        border: `1px solid ${theme.border}`,
        borderRadius: 999,
        cursor: "pointer",
        padding: 0,
        flexShrink: 0,
        transition: "background 0.2s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2, left: 2,
          width: 16, height: 16,
          background: on ? "#fff" : theme.muted,
          borderRadius: "50%",
          transform: on ? "translateX(16px)" : "none",
          transition: "transform 0.2s, background 0.2s",
        }}
      />
    </button>
  );
}

function Row({
  label, children, theme,
}: { label: string; children: React.ReactNode; theme: Theme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
      <span style={{
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: theme.muted,
        fontWeight: 600,
        minWidth: 64,
      }}>
        {label}
      </span>
      {children}
    </div>
  );
}

export function SettingsPanel({ settings, theme, onUpdate, onRequestFullscreen, isFullscreen }: Props) {
  const font = FONTS.find((f) => f.id === settings.font) || FONTS[0];
  const [menuOpen, setMenuOpen] = useState(false);

  // Load Google Font when a web-font id is selected.
  useEffect(() => {
    const url = WEB_FONTS[settings.font];
    if (!url) return;
    let link = document.getElementById("webfont-link") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = "webfont-link";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.href !== url) link.href = url;
  }, [settings.font]);

  // Close font menu when clicking anywhere else
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest(".font-menu-portal")) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        background: theme.bg_panel_strong,
        backdropFilter: "blur(22px) saturate(1.5)",
        WebkitBackdropFilter: "blur(22px) saturate(1.5)",
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
        padding: "14px 16px",
        color: theme.text,
        fontSize: 13,
        display: "flex",
        flexDirection: "column",
        gap: 11,
        minWidth: 290,
        boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      }}
    >
      <Row label="Font" theme={theme}>
        <div className="font-menu-portal" style={{ position: "relative", flex: 1 }}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            style={{
              width: "100%",
              background: theme.bg_panel,
              border: `1px solid ${theme.border}`,
              color: theme.text,
              borderRadius: 10,
              padding: "7px 12px",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: font.stack,
              fontWeight: font.weight,
              letterSpacing: font.tracking,
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {font.name}
            <span style={{ opacity: 0.5, fontSize: 9 }}>{menuOpen ? "▴" : "▾"}</span>
          </button>
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                right: 0,
                background: theme.bg_menu,
                border: `1px solid ${theme.border}`,
                borderRadius: 10,
                padding: 4,
                minWidth: "100%",
                maxHeight: 280,
                overflowY: "auto",
                zIndex: 200,
              }}
            >
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => { onUpdate("font", f.id as FontId); setMenuOpen(false); }}
                  style={{
                    display: "block",
                    width: "100%",
                    background: f.id === settings.font ? theme.accent_panel : "transparent",
                    border: 0,
                    color: theme.text,
                    padding: "6px 10px",
                    fontSize: 13,
                    textAlign: "left",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontFamily: f.stack,
                    fontWeight: f.weight,
                    letterSpacing: f.tracking,
                  }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </Row>

      <Row label="Size" theme={theme}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="range"
            min={50}
            max={200}
            value={settings.size}
            onChange={(e) => onUpdate("size", parseInt(e.target.value, 10))}
            style={{ flex: 1, accentColor: theme.accent, cursor: "pointer" }}
          />
          <span style={{
            fontVariantNumeric: "tabular-nums",
            opacity: 0.55,
            minWidth: 40,
            textAlign: "right",
            fontSize: 12,
          }}>
            {settings.size}%
          </span>
        </div>
      </Row>

      <Row label="Theme" theme={theme}>
        <Seg<ThemeId>
          theme={theme}
          options={[
            { v: "dark", label: "Dark" },
            { v: "black", label: "Black" },
            { v: "light", label: "Light" },
            { v: "paper", label: "Paper" },
          ]}
          value={settings.theme}
          onChange={(v) => onUpdate("theme", v)}
          equal
        />
      </Row>

      <Row label="Time" theme={theme}>
        <Seg<12 | 24>
          theme={theme}
          options={[
            { v: 12, label: "12h" },
            { v: 24, label: "24h" },
          ]}
          value={settings.hourFmt}
          onChange={(v) => onUpdate("hourFmt", v)}
          equal
        />
      </Row>

      <Row label="Weekday" theme={theme}>
        <Seg<WeekdayMode>
          theme={theme}
          options={[
            { v: "off", label: "Off" },
            { v: "short", label: "Sun" },
            { v: "full", label: "SUNDAY" },
          ]}
          value={settings.weekdayMode}
          onChange={(v) => onUpdate("weekdayMode", v)}
        />
      </Row>

      <Row label="AM/PM" theme={theme}>
        <Toggle theme={theme} on={settings.showAmPm} onChange={() => onUpdate("showAmPm", !settings.showAmPm)} />
      </Row>
      <Row label="Date" theme={theme}>
        <Toggle theme={theme} on={settings.showDate} onChange={() => onUpdate("showDate", !settings.showDate)} />
      </Row>
      <Row label="Seconds" theme={theme}>
        <Toggle theme={theme} on={settings.showSeconds} onChange={() => onUpdate("showSeconds", !settings.showSeconds)} />
      </Row>
      <Row label="Meta" theme={theme}>
        <Toggle theme={theme} on={settings.showMeta} onChange={() => onUpdate("showMeta", !settings.showMeta)} />
      </Row>

      <div style={{
        borderTop: `1px solid ${theme.border}`,
        paddingTop: 9,
        marginTop: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <button
          onClick={onRequestFullscreen}
          style={{
            background: theme.bg_panel,
            border: `1px solid ${theme.border}`,
            color: theme.text,
            borderRadius: 10,
            padding: "7px 14px",
            fontSize: 12.5,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
            <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />
          </svg>
          {isFullscreen ? "Exit" : "Fullscreen"}
        </button>
        <span style={{ opacity: 0.4, fontSize: 10, letterSpacing: "0.08em" }}>F · Esc</span>
      </div>
    </div>
  );
}