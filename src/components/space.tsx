import React from "react";
import { lerp } from "./parts";
import { role } from "./roles";
import { tint } from "./theme";

// Nét vẽ cho hình không gian (SVG, toạ độ px): đoạn, mũi tên, điểm, cung góc, dấu góc vuông, máy bay.
// Dùng chung giữa các video hệ trục Oxyz.

export type Pt = [number, number];

export const Seg: React.FC<{
  a: Pt;
  b: Pt;
  color: string;
  w?: number;
  o?: number;
  dash?: string;
  t?: number;
}> = ({ a, b, color, w = 4, o = 1, dash, t = 1 }) =>
  o <= 0 || t <= 0 ? null : (
    <line
      x1={a[0]}
      y1={a[1]}
      x2={lerp(a[0], b[0], t)}
      y2={lerp(a[1], b[1], t)}
      stroke={color}
      strokeWidth={w}
      strokeOpacity={o}
      strokeDasharray={dash}
      strokeLinecap="round"
    />
  );

export const Arrow: React.FC<{
  a: Pt;
  b: Pt;
  t?: number;
  color: string;
  o?: number;
  w?: number;
  dash?: string;
  arrowSize?: number;
}> = ({ a, b, t = 1, color, o = 1, w = 6, dash, arrowSize = 14 }) => {
  if (o <= 0 || t <= 0.02) return null;
  const x2 = lerp(a[0], b[0], t);
  const y2 = lerp(a[1], b[1], t);
  const len = Math.hypot(x2 - a[0], y2 - a[1]);
  if (len < 4) return null;
  const ux = (x2 - a[0]) / len;
  const uy = (y2 - a[1]) / len;
  const H = Math.min(arrowSize * 2.2, len * 0.5);
  const W = arrowSize;
  const hx = x2 - ux * H;
  const hy = y2 - uy * H;
  return (
    <g opacity={o}>
      <line
        x1={a[0]}
        y1={a[1]}
        x2={hx + ux * 3}
        y2={hy + uy * 3}
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
        strokeDasharray={dash}
      />
      <polygon
        points={`${x2},${y2} ${hx - uy * W},${hy + ux * W} ${hx + uy * W},${hy - ux * W}`}
        fill={color}
      />
    </g>
  );
};

export const Dot: React.FC<{
  p: Pt;
  color?: string;
  o?: number;
  r?: number;
  mark?: string;
}> = ({ p, color = role.main, o = 1, r = 10, mark }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      <circle cx={p[0]} cy={p[1]} r={r * 1.8} fill={tint(color, 0.18)} />
      <circle
        cx={p[0]}
        cy={p[1]}
        r={r}
        fill={color}
        stroke="#fff"
        strokeWidth={3}
        data-mark={mark}
      />
    </g>
  );

/** Cung góc tại v giữa hai tia (hướng d1, d2 tính bằng px), bán kính r, quét theo cung nhỏ. */
export const Arc: React.FC<{
  v: Pt;
  d1: Pt;
  d2: Pt;
  r?: number;
  color: string;
  o?: number;
  w?: number;
}> = ({ v, d1, d2, r = 90, color, o = 1, w = 5 }) => {
  if (o <= 0) return null;
  const a1 = Math.atan2(d1[1], d1[0]);
  const a2 = Math.atan2(d2[1], d2[0]);
  let da = a2 - a1;
  while (da > Math.PI) da -= 2 * Math.PI;
  while (da < -Math.PI) da += 2 * Math.PI;
  const p1: Pt = [v[0] + r * Math.cos(a1), v[1] + r * Math.sin(a1)];
  const p2: Pt = [v[0] + r * Math.cos(a2), v[1] + r * Math.sin(a2)];
  return (
    <path
      d={`M ${p1[0]} ${p1[1]} A ${r} ${r} 0 0 ${da > 0 ? 1 : 0} ${p2[0]} ${p2[1]}`}
      fill="none"
      stroke={color}
      strokeWidth={w}
      opacity={o}
      strokeLinecap="round"
    />
  );
};

/** Dấu góc vuông tại v, hai cạnh theo hướng d1, d2 (px). */
export const RightMark: React.FC<{
  v: Pt;
  d1: Pt;
  d2: Pt;
  s?: number;
  color: string;
  o?: number;
}> = ({ v, d1, d2, s = 24, color, o = 1 }) => {
  if (o <= 0) return null;
  const n1 = Math.hypot(d1[0], d1[1]) || 1;
  const n2 = Math.hypot(d2[0], d2[1]) || 1;
  const u1: Pt = [(d1[0] / n1) * s, (d1[1] / n1) * s];
  const u2: Pt = [(d2[0] / n2) * s, (d2[1] / n2) * s];
  return (
    <polyline
      points={`${v[0] + u1[0]},${v[1] + u1[1]} ${v[0] + u1[0] + u2[0]},${v[1] + u1[1] + u2[1]} ${v[0] + u2[0]},${v[1] + u2[1]}`}
      fill="none"
      stroke={color}
      strokeWidth={3}
      opacity={o}
    />
  );
};

/** Icon máy bay chuẩn 9Study: có góc xoay deg, scale s. */
export const Plane: React.FC<{
  x: number;
  y: number;
  deg: number;
  s?: number;
  color: string;
  o?: number;
}> = ({ x, y, deg, s = 1, color, o = 1 }) =>
  o <= 0 ? null : (
    <g transform={`translate(${x},${y}) rotate(${deg}) scale(${s})`} opacity={o} data-mark="plane">
      {/* Vòng hào quang mờ */}
      <circle cx={0} cy={0} r={32} fill={tint(color, 0.15)} />
      {/* Thân cánh máy bay */}
      <polygon points="-70,-8 -90,-42 -66,-42 -44,-8" fill={color} />
      <polygon points="-6,6 -36,46 -14,46 26,6" fill={tint(color, 0.8)} />
      <ellipse cx={0} cy={0} rx={72} ry={14} fill={color} />
      <ellipse cx={36} cy={-3} rx={16} ry={5} fill="#fff" opacity={0.85} />
    </g>
  );
