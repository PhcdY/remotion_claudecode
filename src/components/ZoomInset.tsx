import React from "react";
import { FunctionPlot, Point, Scale, fmt, makeScale } from "./plot";
import { colors, fontSize, fontText, halo, shadow, tint } from "./theme";

/** Bước vạch chia "đẹp" (1, 2, 5 × 10^k) cho một khoảng giá trị. */
export const niceStep = (range: number, target = 4) => {
  const raw = range / target;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
};

const decimalsOf = (step: number) => Math.max(0, -Math.floor(Math.log10(step) + 1e-9));

const ticksIn = (a: number, b: number, step: number) => {
  const out: number[] = [];
  for (let v = Math.ceil(a / step) * step; v <= b + 1e-12; v += step) out.push(Math.round(v / step) * step);
  return out;
};

/**
 * Kính lúp: hình gốc giữ nguyên, khung soi trên hình gốc co dần theo z,
 * ô phóng to (kích thước cố định) nối với khung bằng hai đường dẫn, có lưới + số vạch chia.
 * Mọi toạ độ left/top là toạ độ trang (1920×1080).
 */
export const ZoomInset: React.FC<{
  base: Scale;
  baseLeft: number;
  baseTop: number;
  f: (x: number) => number;
  x0: number;
  y0: number;
  z: number;
  left: number;
  top: number;
  width: number;
  height: number;
  opacity?: number;
  /** vẽ thêm trong ô phóng (SVG), nhận scale của ô */
  children?: (s: Scale) => React.ReactNode;
}> = ({ base, baseLeft, baseTop, f, x0, y0, z, left, top, width, height, opacity = 1, children }) => {
  const hx = width / (2 * z * base.sx);
  const hy = height / (2 * z * base.sy);
  const s = makeScale({ xMin: x0 - hx, xMax: x0 + hx, yMin: y0 - hy, yMax: y0 + hy, width, height });

  // khung soi trên hình gốc (toạ độ trang)
  const rx1 = baseLeft + base.x(x0 - hx);
  const rx2 = baseLeft + base.x(x0 + hx);
  const ry1 = baseTop + base.y(y0 + hy);
  const ry2 = baseTop + base.y(y0 - hy);
  const insetRight = left > rx2;

  const xs = niceStep(2 * hx);
  const ys = niceStep(2 * hy);
  const xTicks = ticksIn(s.xMin, s.xMax, xs).filter((v) => s.x(v) > 60 && s.x(v) < width - 30);
  const yTicks = ticksIn(s.yMin, s.yMax, ys).filter((v) => s.y(v) > 30 && s.y(v) < height - 50);
  const tickStyle: React.CSSProperties = {
    position: "absolute",
    fontFamily: fontText,
    fontSize: fontSize.tick,
    color: colors.muted,
    textShadow: halo(colors.panel),
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={rx1} y={ry1} width={rx2 - rx1} height={ry2 - ry1} fill={tint(colors.accent, 0.08)} stroke={colors.accent} strokeWidth={3} />
        {insetRight ? (
          <>
            <line x1={rx2} y1={ry1} x2={left} y2={top} stroke={colors.accent} strokeWidth={2} strokeDasharray="8 8" opacity={0.7} />
            <line x1={rx2} y1={ry2} x2={left} y2={top + height} stroke={colors.accent} strokeWidth={2} strokeDasharray="8 8" opacity={0.7} />
          </>
        ) : (
          <>
            <line x1={rx1} y1={ry1} x2={left + width} y2={top} stroke={colors.accent} strokeWidth={2} strokeDasharray="8 8" opacity={0.7} />
            <line x1={rx1} y1={ry2} x2={left + width} y2={top + height} stroke={colors.accent} strokeWidth={2} strokeDasharray="8 8" opacity={0.7} />
          </>
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width,
          height,
          background: colors.panel,
          border: `3px solid ${colors.accent}`,
          borderRadius: 16,
          boxShadow: shadow,
          overflow: "hidden",
        }}
      >
        <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
          {xTicks.map((v) => (
            <line key={`x${v}`} x1={s.x(v)} x2={s.x(v)} y1={0} y2={height} stroke={colors.grid} strokeWidth={2} />
          ))}
          {yTicks.map((v) => (
            <line key={`y${v}`} y1={s.y(v)} y2={s.y(v)} x1={0} x2={width} stroke={colors.grid} strokeWidth={2} />
          ))}
          <FunctionPlot scale={s} f={f} width={7} />
          {children ? children(s) : null}
          <Point scale={s} x={x0} y={y0} />
        </svg>
        {xTicks.map((v) => (
          <div key={`lx${v}`} data-text="tick" style={{ ...tickStyle, left: s.x(v), bottom: 8, translate: "-50% 0" }}>
            {fmt(v, decimalsOf(xs))}
          </div>
        ))}
        {yTicks.map((v) => (
          <div key={`ly${v}`} data-text="tick" style={{ ...tickStyle, left: 10, top: s.y(v), translate: "0 -50%" }}>
            {fmt(v, decimalsOf(ys))}
          </div>
        ))}
      </div>
      <div
        data-text="label"
        style={{
          position: "absolute",
          left: left + width,
          top: top - 14,
          translate: "-100% -100%",
          fontFamily: fontText,
          fontWeight: 800,
          fontSize: fontSize.label,
          color: colors.accent,
          whiteSpace: "nowrap",
        }}
      >
        phóng to ×{z < 10 ? fmt(z, 1) : Math.round(z)}
      </div>
    </div>
  );
};
