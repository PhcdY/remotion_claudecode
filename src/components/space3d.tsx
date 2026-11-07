import React from "react";
import { lerp } from "./parts";

// Hình không gian kiểu SGK: hình chiếu song song, trục sâu xiên `deg` độ, rút ngắn `shrink`.
// Gói Toán › Hình không gian: trục sâu 30° để vectơ chính lệch hướng cạnh xiên đủ xa.
// (video vecto-khong-gian có bản riêng trong scene.tsx, dựng trước khi tách ra đây)

export type V3 = [number, number, number]; // x: sang phải, y: vào sâu, z: lên trên
export type Proj = (v: V3) => [number, number];

export const makeProj = (ox: number, oy: number, k: number, deg = 30, shrink = 0.5): Proj => {
  const dx = shrink * Math.cos((deg * Math.PI) / 180);
  const dy = shrink * Math.sin((deg * Math.PI) / 180);
  return (v) => [ox + k * (v[0] + v[1] * dx), oy - k * (v[2] + v[1] * dy)];
};

export const add3 = (a: V3, b: V3, t = 1): V3 => [a[0] + b[0] * t, a[1] + b[1] * t, a[2] + b[2] * t];
export const mid3 = (a: V3, b: V3): V3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];

/** Đoạn thẳng (px). */
export const Seg: React.FC<{ a: [number, number]; b: [number, number]; color: string; w?: number; o?: number; dash?: boolean }> = ({ a, b, color, w = 4, o = 1, dash }) =>
  o <= 0 ? null : (
    <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={w} strokeOpacity={o} strokeDasharray={dash ? "12 10" : undefined} strokeLinecap="round" />
  );

/** Mũi tên (px) từ a tới a + (b − a)·t, đầu nhọn ở ngọn. */
export const ArrowPx: React.FC<{ a: [number, number]; b: [number, number]; t?: number; color: string; o?: number; w?: number; dash?: boolean; head?: number }> = ({
  a,
  b,
  t = 1,
  color,
  o = 1,
  w = 6,
  dash,
  head = 30,
}) => {
  if (o <= 0 || t <= 0.01) return null;
  const [x1, y1] = a;
  const x2 = lerp(x1, b[0], t);
  const y2 = lerp(y1, b[1], t);
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 1) return null;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const H = Math.min(head, len * 0.5);
  const hx = x2 - ux * H;
  const hy = y2 - uy * H;
  const hw = H * 0.43;
  return (
    <g opacity={o}>
      <line x1={x1} y1={y1} x2={hx + ux * 4} y2={hy + uy * 4} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash ? "14 10" : undefined} />
      <polygon points={`${x2},${y2} ${hx - uy * hw},${hy + ux * hw} ${hx + uy * hw},${hy - ux * hw}`} fill={color} />
    </g>
  );
};

/** Cung góc tại o giữa hai hướng (độ, theo toạ độ màn hình: 0° = sang phải, tăng theo chiều kim đồng hồ). */
export const arcPath = (o: [number, number], r: number, a1: number, a2: number) => {
  const p = (a: number) => [o[0] + r * Math.cos((a * Math.PI) / 180), o[1] + r * Math.sin((a * Math.PI) / 180)];
  let d = a2 - a1;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  const [x1, y1] = p(a1);
  const [x2, y2] = p(a1 + d);
  return `M ${x1} ${y1} A ${r} ${r} 0 0 ${d > 0 ? 1 : 0} ${x2} ${y2}`;
};

/** Góc (độ, toạ độ màn hình) của hướng a → b. */
export const angleOf = (a: [number, number], b: [number, number]) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
