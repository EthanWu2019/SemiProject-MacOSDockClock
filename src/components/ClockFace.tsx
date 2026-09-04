import { useEffect, useRef, useState } from "react";
import type { ClockSettings, Theme, FontPreset } from "../types";
import { FlipDigit } from "./FlipDigit";

interface Props {
  now: Date;
  settings: ClockSettings;
  theme: Theme;
  font: FontPreset;
}

const WEEKDAYS_FULL  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const WEEKDAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS_SHORT   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const pad = (n: number) => String(n).padStart(2, "0");

function isoWeek(d: Date): number {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  return 1 + Math.round(((t.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
}

export function ClockFace({ now, settings, theme, font }: Props) {
  const hours24 = now.getHours();
  const mins    = now.getMinutes();
  const secs    = now.getSeconds();
  const isPM    = hours24 >= 12;

  let displayHours: string;
  let showAmPm: boolean;
  if (settings.hourFmt === 24) {
    displayHours = pad(hours24);
    showAmPm = false;
  } else {
    displayHours = pad(hours24 % 12 || 12);
    showAmPm = settings.showAmPm;
  }

  const hh1 = displayHours[0];
  const hh2 = displayHours[1];
  const mm1 = pad(mins)[0];
  const mm2 = pad(mins)[1];
  const ss1 = pad(secs)[0];
  const ss2 = pad(secs)[1];

  // ---- sizing ----
  // Anchor the time string's HEIGHT to a fixed fraction of viewport height.
  // This way, switching between 12h/24h or toggling seconds/AM-PM doesn't
  // change per-digit size — only the *width* of the line changes. That's the
  // modern-clock design rule (Apple Watch, Linear, etc.) and prevents the
  // "数字突变 / 贴在一起" glitch.
  const [digitSize, setDigitSize] = useState(120);

  useEffect(() => {
    const recompute = () => {
      const h = window.innerHeight;
      const w = window.innerWidth;
      // Time block occupies ~70% of height. digitSize = font-size in px;
      // line-height ~ 0.9, so the visual height is roughly digitSize * 0.9.
      const fromHeight = h * 0.70 / 0.9;
      const fromWidth = w * 0.85 / 7.5; // safety bound for very wide aspects
      const target = Math.min(fromHeight, fromWidth) * (settings.size / 100);
      setDigitSize(Math.max(36, Math.min(target, 600)));
    };
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [settings.size]);

  const wd = now.getDay();
  const m = now.getMonth();
  const d = now.getDate();
  const y = now.getFullYear();
  const tzOff = -now.getTimezoneOffset() / 60;
  const tzStr = "GMT" + (tzOff >= 0 ? "+" : "") + tzOff;
  const week = isoWeek(now);

  const textShadow = theme.fontIsLight
    ? "0 1px 16px rgba(0,0,0,0.18)"
    : undefined;

  // Two real dots, vertical-centered. The dots align with the optical center
  // of the digit. Spacing between dots is small (about 1/3 digit) so they
  // read as a colon, not two random periods.
  // Two real dots, vertically centered on the digit's optical center.
// Using absolute positioning so the dot positions are identical regardless
// of font's baseline quirks (different fonts place the colon at different
// heights — the only stable reference is the digit's vertical midpoint).
const renderColon = (key: string, scale: number, color: string) => {
    const dotSize = digitSize * 0.08 * scale;
    const dotGap  = digitSize * 0.10 * scale;
    const totalH  = dotSize * 2 + dotGap;
    const marginX = digitSize * 0.10;
    // container height = digit line-height, dots centered within
    return (
      <span
        key={key}
        aria-hidden
        style={{
          display: "inline-block",
          position: "relative",
          width: dotSize + marginX,
          height: "100%",
          verticalAlign: "middle",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: `calc(50% - ${totalH / 2}px)`,
            left: marginX / 2,
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            background: color,
            display: "block",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: `calc(50% + ${dotGap / 2}px)`,
            left: marginX / 2,
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            background: color,
            display: "block",
          }}
        />
      </span>
    );
  };

  // Info row visibility
  const showAnyInfo =
    settings.weekdayMode !== "off" ||
    settings.showDate ||
    settings.showMeta;

  const weekdayText =
    settings.weekdayMode === "full"  ? WEEKDAYS_FULL[wd] :
    settings.weekdayMode === "short" ? WEEKDAYS_SHORT[wd] :
    "";

  // Gap between digit groups (between HH and MM, between MM and SS).
  // The colon dot-span takes ~0.30 size; we want some breathing room around it.
  const groupGap = digitSize * 0.10;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6vh 6vw",
        boxSizing: "border-box",
        textAlign: "center",
        color: theme.text,
      }}
    >
      {/* --- TIME (the hero) --- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "nowrap",
          gap: groupGap,
          color: theme.text,
          lineHeight: 0.9,
        }}
      >
        <FlipDigit value={hh1} color={theme.text} size={digitSize} weight={font.weight} tracking={font.tracking} fontStack={font.stack} textShadow={textShadow} />
        <FlipDigit value={hh2} color={theme.text} size={digitSize} weight={font.weight} tracking={font.tracking} fontStack={font.stack} textShadow={textShadow} />
        {renderColon("c-main", 1, theme.text)}
        <FlipDigit value={mm1} color={theme.text} size={digitSize} weight={font.weight} tracking={font.tracking} fontStack={font.stack} textShadow={textShadow} />
        <FlipDigit value={mm2} color={theme.text} size={digitSize} weight={font.weight} tracking={font.tracking} fontStack={font.stack} textShadow={textShadow} />
        {settings.showSeconds && (
          <>
            {renderColon("c-sec", 0.5, theme.muted)}
            <FlipDigit
              value={ss1}
              color={theme.muted}
              size={digitSize * 0.5}
              weight={font.weight}
              tracking={font.tracking}
              fontStack={font.stack}
              textShadow={textShadow}
            />
            <FlipDigit
              value={ss2}
              color={theme.muted}
              size={digitSize * 0.5}
              weight={font.weight}
              tracking={font.tracking}
              fontStack={font.stack}
              textShadow={textShadow}
            />
          </>
        )}
        {showAmPm && (
          <span
            style={{
              marginLeft: digitSize * 0.18,
              fontSize: digitSize * 0.24,
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: theme.muted,
              fontFamily: font.stack,
              lineHeight: 1,
              alignSelf: "center",
              textShadow,
            }}
          >
            {isPM ? "PM" : "AM"}
          </span>
        )}
      </div>

      {/* --- INFO ROW (compact, single line, well below time) --- */}
      {showAnyInfo && (
        <div
          style={{
            marginTop: digitSize * 0.45,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.9em",
            fontSize: Math.max(11, digitSize * 0.10),
            fontWeight: 500,
            letterSpacing: "0.20em",
            textTransform: "uppercase",
            color: theme.muted,
            fontFamily: font.stack,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            textShadow,
          }}
        >
          {settings.weekdayMode !== "off" && <span>{weekdayText}</span>}
          {settings.weekdayMode !== "off" && settings.showDate && (
            <span style={{ opacity: 0.4 }}>·</span>
          )}
          {settings.showDate && (
            <span>
              {MONTHS_SHORT[m]} {d}, {y}
            </span>
          )}
          {settings.showMeta && (settings.weekdayMode !== "off" || settings.showDate) && (
            <span style={{ opacity: 0.4 }}>·</span>
          )}
          {settings.showMeta && (
            <>
              <span>{tzStr}</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>Week {week}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}