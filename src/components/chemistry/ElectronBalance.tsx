import React from "react";
import { interpolate } from "remotion";
import { MathText } from "../MathText";
import { role } from "../roles";
import { colors, fontText } from "../theme";
import "./mhchem";

/**
 * Cái cân electron: đĩa trái = electron chất khử nhường, đĩa phải = electron chất oxi hoá nhận.
 * Cân chỉ thăng bằng khi hai bên bằng nhau → hình của "tổng electron nhường = tổng electron nhận". Gói Hóa › mục 6.7.
 * Hiện từng đĩa theo lời đọc (`show.give`, `show.take`): đĩa trái hiện trước → cân lệch; đĩa phải hiện → cân thăng bằng.
 *
 * Dùng: <ElectronBalance left={460} top={220} give={6} take={6} giveLabel="$\ce{CO}$ nhường" takeLabel="$\ce{Fe2O3}$ nhận"
 *         show={{ give: fadeIn(fr, L[1]), take: fadeIn(fr, L[2]) }} />
 */
export const ElectronBalance: React.FC<{
  left: number;
  top: number;
  /** rộng toàn cân, mặc định 1000. Cao ≈ 0,62 × width */
  width?: number;
  give: number;
  take: number;
  giveLabel?: string;
  takeLabel?: string;
  show?: { give?: number; take?: number };
  opacity?: number;
}> = ({ left, top, width: W = 1000, give, take, giveLabel = "electron nhường", takeLabel = "electron nhận", show = {}, opacity = 1 }) => {
  const sg = show.give ?? 1;
  const st = show.take ?? 1;
  const diff = give * sg - take * st;
  const tilt = Math.max(-12, Math.min(12, diff * 3)); // độ; dương = trái nặng hơn (trái chìm xuống)
  const rad = (tilt * Math.PI) / 180;
  const H = W * 0.62;
  const px = W / 2;
  const py = H * 0.22;
  const L = W * 0.36;
  const ends = [-1, 1].map((s) => ({ x: px + s * L * Math.cos(rad), y: py - s * L * Math.sin(rad) }));
  const panW = W * 0.26;
  const drop = H * 0.32;
  const level = Math.abs(diff) < 0.01 && sg > 0.99 && st > 0.99;
  const eqO = interpolate(Math.min(sg, st), [0.9, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pan = (side: 0 | 1, n: number, o: number, c: string) => {
    const e = ends[side];
    const cy = e.y + drop;
    const per = Math.min(n, 6);
    const r = Math.min(16, panW / (per * 2.8));
    return (
      <g key={side}>
        <line x1={e.x} y1={e.y} x2={e.x - panW / 2} y2={cy} stroke="#94A3B8" strokeWidth={3} />
        <line x1={e.x} y1={e.y} x2={e.x + panW / 2} y2={cy} stroke="#94A3B8" strokeWidth={3} />
        <path d={`M ${e.x - panW / 2} ${cy} Q ${e.x} ${cy + 46} ${e.x + panW / 2} ${cy}`} fill="#E2E8F0" stroke="#64748B" strokeWidth={3} />
        {Array.from({ length: n }).map((_, i) => {
          const row = Math.floor(i / per);
          const col = i % per;
          const cx = e.x + (col - (per - 1) / 2) * r * 2.6;
          const y = cy - r - 4 - row * r * 2.3;
          return (
            <g key={i} opacity={o}>
              <circle cx={cx} cy={y} r={r} fill={c} />
              <line x1={cx - r * 0.45} y1={y} x2={cx + r * 0.45} y2={y} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
            </g>
          );
        })}
      </g>
    );
  };

  const label = (side: 0 | 1, text: string, n: number, o: number, c: string) => {
    const e = ends[side];
    return (
      <div
        key={side}
        data-text="label"
        style={{ position: "absolute", left: e.x - 260, width: 520, top: e.y + drop + 46, textAlign: "center", fontSize: 40, fontWeight: 700, color: c, opacity: o }}
      >
        <MathText text={`${text} ${n}e`} />
      </div>
    );
  };

  return (
    <div style={{ position: "absolute", left, top, width: W, height: H + 120, fontFamily: fontText, opacity }}>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={`M ${px} ${py} L ${px - W * 0.08} ${H} L ${px + W * 0.08} ${H} Z`} fill="#CBD5E1" />
        <rect x={px - W * 0.16} y={H - 10} width={W * 0.32} height={14} rx={7} fill="#94A3B8" />
        <line x1={ends[0].x} y1={ends[0].y} x2={ends[1].x} y2={ends[1].y} stroke="#475569" strokeWidth={10} strokeLinecap="round" />
        <circle cx={px} cy={py} r={14} fill={level ? role.focus : "#475569"} />
        {pan(0, give, sg, role.pairA)}
        {pan(1, take, st, role.pairB)}
      </svg>
      {label(0, giveLabel, give, sg, role.pairA)}
      {label(1, takeLabel, take, st, role.pairB)}
      <div
        data-text="label"
        style={{ position: "absolute", left: 0, right: 0, top: py - 110, textAlign: "center", fontSize: 54, fontWeight: 800, color: level ? role.focus : colors.warn, opacity: eqO }}
      >
        <MathText text={level ? `${give} = ${take}` : `${give} ≠ ${take}`} />
      </div>
    </div>
  );
};
