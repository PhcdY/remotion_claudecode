import React from "react";
import { colors, fontSize as FS, fontText, halo } from "./theme";

// ---------- Hàm scale chung: toạ độ toán -> pixel ----------

export type Scale = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  width: number;
  height: number;
  x: (v: number) => number;
  y: (v: number) => number;
  /** pixel trên 1 đơn vị */
  sx: number;
  sy: number;
};

export const makeScale = (o: {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  width: number;
  height: number;
}): Scale => {
  const sx = o.width / (o.xMax - o.xMin);
  const sy = o.height / (o.yMax - o.yMin);
  return {
    ...o,
    sx,
    sy,
    x: (v) => (v - o.xMin) * sx,
    y: (v) => o.height - (v - o.yMin) * sy,
  };
};

/** Số thập phân kiểu Việt Nam: 4.01 -> "4,01" */
export const fmt = (v: number, digits = 2) => {
  // chỉ bỏ số 0 thừa SAU dấu thập phân (100 với digits = 0 vẫn là "100")
  const s = digits > 0 ? v.toFixed(digits).replace(/\.?0+$/, "") : v.toFixed(0);
  return (s === "-0" ? "0" : s).replace(".", ",");
};

// ---------- Khung chứa: SVG + lớp HTML (cho nhãn KaTeX) ----------

export const Plot: React.FC<{
  scale: Scale;
  left: number;
  top: number;
  children?: React.ReactNode;
  overlay?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ scale, left, top, children, overlay, style }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: scale.width,
      height: scale.height,
      ...style,
    }}
  >
    <svg
      width={scale.width}
      height={scale.height}
      style={{ position: "absolute", inset: 0, overflow: "visible" }}
    >
      {children}
    </svg>
    {overlay}
  </div>
);

/** Nhãn HTML (có thể chứa KaTeX) đặt tại toạ độ toán; anchor theo phần trăm. */
export const PlotLabel: React.FC<{
  scale: Scale;
  x: number;
  y: number;
  dx?: number;
  dy?: number;
  anchor?: "center" | "left" | "right" | "top" | "bottom";
  color?: string;
  size?: number;
  opacity?: number;
  children: React.ReactNode;
}> = ({ scale, x, y, dx = 0, dy = 0, anchor = "center", color = colors.text, size = FS.label, opacity = 1, children }) => {
  const tr = {
    center: "-50% -50%",
    left: "0% -50%",
    right: "-100% -50%",
    top: "-50% 0%",
    bottom: "-50% -100%",
  }[anchor];
  return (
    <div
      data-text="label"
      style={{
        position: "absolute",
        left: scale.x(x) + dx,
        top: scale.y(y) + dy,
        translate: tr,
        whiteSpace: "nowrap",
        fontFamily: fontText,
        fontWeight: 600,
        fontSize: size,
        color,
        opacity,
        textShadow: halo(),
      }}
    >
      {children}
    </div>
  );
};

// ---------- Trục toạ độ ----------

export const Axes: React.FC<{
  scale: Scale;
  xTicks?: number[];
  yTicks?: number[];
  xLabel?: string;
  yLabel?: string;
  grid?: boolean;
  opacity?: number;
  /** số vạch chia không ghi nhãn (vd. bị điểm đánh dấu che) */
  hideXLabels?: number[];
  hideYLabels?: number[];
  /** phía ghi số của trục dọc (mặc định bên trái trục) */
  yTickSide?: "left" | "right";
}> = ({ scale: s, xTicks = [], yTicks = [], xLabel = "x", yLabel = "y", grid = true, opacity = 1, hideXLabels = [], hideYLabels = [], yTickSide = "left" }) => {
  const ox = s.x(Math.min(Math.max(0, s.xMin), s.xMax));
  const oy = s.y(Math.min(Math.max(0, s.yMin), s.yMax));
  const tickFont = {
    fontFamily: fontText,
    fontSize: FS.tick,
    fill: colors.muted,
    stroke: colors.bg,
    strokeWidth: 7,
    paintOrder: "stroke",
    strokeLinejoin: "round",
  } as const;
  return (
    <g opacity={opacity}>
      {grid
        ? [
            ...xTicks.map((t) => (
              <line key={`gx${t}`} x1={s.x(t)} x2={s.x(t)} y1={0} y2={s.height} stroke={colors.grid} strokeWidth={2} />
            )),
            ...yTicks.map((t) => (
              <line key={`gy${t}`} y1={s.y(t)} y2={s.y(t)} x1={0} x2={s.width} stroke={colors.grid} strokeWidth={2} />
            )),
          ]
        : null}
      <line x1={0} x2={s.width + 10} y1={oy} y2={oy} stroke={colors.axis} strokeWidth={3} />
      <line x1={ox} x2={ox} y1={s.height} y2={-10} stroke={colors.axis} strokeWidth={3} />
      <polygon points={`${s.width + 22},${oy} ${s.width + 6},${oy - 8} ${s.width + 6},${oy + 8}`} fill={colors.axis} />
      <polygon points={`${ox},${-22} ${ox - 8},${-6} ${ox + 8},${-6}`} fill={colors.axis} />
      {xTicks.map((t) =>
        t === 0 ? null : (
          <g key={`tx${t}`}>
            <line x1={s.x(t)} x2={s.x(t)} y1={oy - 7} y2={oy + 7} stroke={colors.axis} strokeWidth={3} />
            {hideXLabels.indexOf(t) >= 0 ? null : (
              <text data-text="tick" x={s.x(t)} y={oy + 38} textAnchor="middle" {...tickFont}>
                {fmt(t)}
              </text>
            )}
          </g>
        ),
      )}
      {yTicks.map((t) =>
        t === 0 ? null : (
          <g key={`ty${t}`}>
            <line x1={ox - 7} x2={ox + 7} y1={s.y(t)} y2={s.y(t)} stroke={colors.axis} strokeWidth={3} />
            {hideYLabels.indexOf(t) >= 0 ? null : (
              <text
                data-text="tick"
                x={yTickSide === "left" ? ox - 16 : ox + 16}
                y={s.y(t) + 10}
                textAnchor={yTickSide === "left" ? "end" : "start"}
                {...tickFont}
              >
                {fmt(t)}
              </text>
            )}
          </g>
        ),
      )}
      <text data-text="axis" x={s.width + 30} y={oy + 10} {...tickFont} fill={colors.text} fontStyle="italic" fontSize={32}>
        {xLabel}
      </text>
      <text data-text="axis" x={ox + 16} y={-14} {...tickFont} fill={colors.text} fontStyle="italic" fontSize={32}>
        {yLabel}
      </text>
    </g>
  );
};

// ---------- Đồ thị hàm số ----------

/** Vẽ y = f(x) trên [from, to]; progress 0..1 để vẽ dần từ trái sang phải. */
export const FunctionPlot: React.FC<{
  scale: Scale;
  f: (x: number) => number;
  from?: number;
  to?: number;
  progress?: number;
  color?: string;
  width?: number;
  samples?: number;
  opacity?: number;
}> = ({ scale: s, f, from = s.xMin, to = s.xMax, progress = 1, color = colors.curve, width = 6, samples = 300, opacity = 1 }) => {
  if (progress <= 0) return null;
  const end = from + (to - from) * Math.min(1, progress);
  const margin = (s.yMax - s.yMin) * 0.6;
  let d = "";
  let pen = false;
  for (let i = 0; i <= samples; i++) {
    const x = from + ((end - from) * i) / samples;
    const y = f(x);
    if (!isFinite(y) || y > s.yMax + margin || y < s.yMin - margin) {
      pen = false;
      continue;
    }
    d += `${pen ? "L" : "M"}${s.x(x).toFixed(2)},${s.y(y).toFixed(2)} `;
    pen = true;
  }
  return (
    <g>
      <clipPath id={`clip-${s.width}-${s.height}`}>
        <rect x={-4} y={-4} width={s.width + 8} height={s.height + 8} />
      </clipPath>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        clipPath={`url(#clip-${s.width}-${s.height})`}
      />
    </g>
  );
};

/**
 * Mũi tên ngắn chạy dọc đồ thị f tại x (hướng theo chiều x tăng, hoặc ngược lại khi reverse),
 * lệch ra phía trên đường một khoảng off (px). df: đạo hàm của f.
 */
export const CurveArrow: React.FC<{
  s: Scale;
  f: (x: number) => number;
  df: (x: number) => number;
  x: number;
  color: string;
  opacity?: number;
  len?: number;
  off?: number;
  reverse?: boolean;
}> = ({ s, f, df, x, color, opacity = 1, len = 64, off = 26, reverse = false }) => {
  if (opacity <= 0) return null;
  const dx = s.sx;
  const dy = -df(x) * s.sy;
  const n = Math.hypot(dx, dy);
  const ux = dx / n;
  const uy = dy / n;
  // pháp tuyến hướng lên trên
  const nx = uy;
  const ny = -ux;
  const sign = ny < 0 ? 1 : -1;
  const cx = s.x(x) + nx * off * sign;
  const cy = s.y(f(x)) + ny * off * sign;
  const d = reverse ? -1 : 1;
  const x1 = cx - (d * ux * len) / 2;
  const y1 = cy - (d * uy * len) / 2;
  const x2 = cx + (d * ux * len) / 2;
  const y2 = cy + (d * uy * len) / 2;
  const hx = -d * ux * 18;
  const hy = -d * uy * 18;
  return (
    <g opacity={opacity} stroke={color} strokeWidth={6} strokeLinecap="round" fill="none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <line x1={x2} y1={y2} x2={x2 + hx - d * uy * 12} y2={y2 + hy + d * ux * 12} />
      <line x1={x2} y1={y2} x2={x2 + hx + d * uy * 12} y2={y2 + hy - d * ux * 12} />
    </g>
  );
};

/** Mũi tên ở đầu một nhánh: đỉnh mũi tên tại (x; fn(x)), hướng theo tiếp tuyến (dir = 1: sang phải, −1: sang trái). */
export const EndArrow: React.FC<{ s: Scale; fn: (x: number) => number; dfn: (x: number) => number; x: number; dir: 1 | -1; color: string; o: number }> = ({
  s,
  fn,
  dfn,
  x,
  dir,
  color,
  o,
}) => {
  if (o <= 0) return null;
  const vx = dir * s.sx;
  const vy = -dir * dfn(x) * s.sy;
  const n = Math.hypot(vx, vy);
  const ux = vx / n;
  const uy = vy / n;
  const tx = s.x(x) + ux * 26;
  const ty = s.y(fn(x)) + uy * 26;
  const L = 34;
  const W = 17;
  const bx = tx - ux * L;
  const by = ty - uy * L;
  return (
    <polygon
      data-mark="arrow"
      points={`${tx},${ty} ${bx - uy * W},${by + ux * W} ${bx + uy * W},${by - ux * W}`}
      fill={color}
      opacity={o}
    />
  );
};

// ---------- Điểm, đoạn, đường thẳng ----------

export const Point: React.FC<{
  scale: Scale;
  x: number;
  y: number;
  r?: number;
  color?: string;
  opacity?: number;
}> = ({ scale: s, x, y, r = 11, color = colors.accent, opacity = 1 }) => (
  <circle data-mark="point" cx={s.x(x)} cy={s.y(y)} r={r} fill={color} stroke={colors.bg} strokeWidth={4} opacity={opacity} />
);

export const Segment: React.FC<{
  scale: Scale;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  opacity?: number;
}> = ({ scale: s, x1, y1, x2, y2, color = colors.text, width = 4, dashed = false, opacity = 1 }) => (
  <line
    x1={s.x(x1)}
    y1={s.y(y1)}
    x2={s.x(x2)}
    y2={s.y(y2)}
    stroke={color}
    strokeWidth={width}
    strokeDasharray={dashed ? "12 10" : undefined}
    strokeLinecap="round"
    opacity={opacity}
  />
);

/**
 * Đường thẳng qua (x0; y0) có hệ số góc m.
 * Mặc định cắt theo khung đồ thị; halfLengthPx > 0 thì vẽ đoạn ngắn có độ dài pixel cố định.
 */
export const TangentLine: React.FC<{
  scale: Scale;
  x0: number;
  y0: number;
  slope: number;
  color?: string;
  width?: number;
  halfLengthPx?: number;
  opacity?: number;
}> = ({ scale: s, x0, y0, slope, color = colors.accent, width = 5, halfLengthPx = 0, opacity = 1 }) => {
  let xa: number;
  let xb: number;
  if (halfLengthPx > 0) {
    // hướng (1, m) đổi sang pixel rồi chuẩn hoá
    const px = s.sx;
    const py = slope * s.sy;
    const len = Math.sqrt(px * px + py * py);
    const dxMath = (halfLengthPx * (px / len)) / s.sx;
    xa = x0 - dxMath;
    xb = x0 + dxMath;
  } else {
    xa = s.xMin;
    xb = s.xMax;
    if (slope !== 0) {
      const u = x0 + (s.yMin - y0) / slope;
      const v = x0 + (s.yMax - y0) / slope;
      xa = Math.max(xa, Math.min(u, v));
      xb = Math.min(xb, Math.max(u, v));
    }
    if (xa >= xb) return null;
  }
  return (
    <Segment
      scale={s}
      x1={xa}
      y1={y0 + slope * (xa - x0)}
      x2={xb}
      y2={y0 + slope * (xb - x0)}
      color={color}
      width={width}
      opacity={opacity}
    />
  );
};
