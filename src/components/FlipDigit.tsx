interface Props {
  value: string;
  color: string;
  size: number;
  weight: number;
  tracking: string;
  fontStack: string;
  textShadow?: string;
}

// Pure digit. No box, no rounded corners, no inset highlight, no shadow.
// The digit lives directly on the page background — the way modern iOS /
// Apple Watch clock faces render time. Each glyph flows naturally with the
// user's chosen font weight and tracking.
export function FlipDigit({
  value, color, size, weight, tracking, fontStack, textShadow,
}: Props) {
  return (
    <span
      style={{
        fontSize: size,
        fontWeight: weight,
        letterSpacing: tracking,
        fontFamily: fontStack,
        color,
        lineHeight: 0.9,
        fontVariantNumeric: "tabular-nums",
        textShadow,
        display: "inline-block",
      }}
    >
      {value}
    </span>
  );
}