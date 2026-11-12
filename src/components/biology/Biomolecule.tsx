import React from "react";
import { Easing, interpolate } from "remotion";
import { Atom } from "../chemistry/Atom";
import { MIN_FONT, fontText } from "../theme";
import { MOLECULE, SUBSTANCE } from "./palette";

/**
 * Phân tử sinh học — cấu trúc thật, giản lược (gói Sinh › 3 › Phân tử có tên).
 * Mọi component ở đây là nhóm SVG (`<g>`): đặt bên trong một <svg> của cảnh, toạ độ là toạ độ của svg đó.
 * Tên chất ("Glucose", "ATP", "$\ce{C6H12O6}$"…) KHÔNG vẽ ở đây: đặt bằng AutoLabels, neo vào điểm lấy từ
 * các hàm *Anchors (dung-video › quy tắc 12). Chữ bên trong phân tử (O, P, A, C, NH₂…) ≥ MIN_FONT.tick.
 *
 *   <svg width={1920} height={1080}>
 *     <GlucoseBreakdown x={700} y={520} progress={p} />
 *     <ATPChain x={1150} y={300} release={r} />
 *   </svg>
 */

/** Trộn màu với trắng (k = 0 giữ nguyên, 1 = trắng) — nền đặc để nét liên kết phía sau không lộ qua. */
export const lighten = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const m = (c: number) => Math.round(c + (255 - c) * k);
  const r = m((n >> 16) & 255);
  const g = m((n >> 8) & 255);
  const b = m(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

const ease = Easing.inOut(Easing.cubic);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const seg = (p: number, a: number, b: number) => ease(clamp01((p - a) / (b - a)));
const font = (s: number, base = 30) => Math.max(MIN_FONT.tick, Math.round(base * s));

/** Chữ trong phân tử (ký hiệu nguyên tố/nhóm). `sub` = chỉ số dưới (vd. "2" của NH₂). */
const Glyph: React.FC<{ x: number; y: number; text: string; size: number; color: string; sub?: string }> = ({ x, y, text, size, color, sub }) => (
  <text
    data-text="tick"
    x={x}
    y={y}
    textAnchor="middle"
    dominantBaseline="central"
    fontFamily={fontText}
    fontSize={size}
    fontWeight={800}
    fill={color}
  >
    {text}
    {sub ? (
      <tspan fontSize={size * 0.68} dy={size * 0.28}>
        {sub}
      </tspan>
    ) : null}
  </text>
);

const BOND = "#475569";

const Bond: React.FC<{ x1: number; y1: number; x2: number; y2: number; s: number; double?: boolean; opacity?: number }> = ({ x1, y1, x2, y2, s, double, opacity = 1 }) => {
  if (!double) return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={BOND} strokeWidth={5 * s} strokeLinecap="round" opacity={opacity} />;
  const L = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = (-(y2 - y1) / L) * 6 * s;
  const ny = ((x2 - x1) / L) * 6 * s;
  return (
    <g opacity={opacity}>
      <line x1={x1 + nx} y1={y1 + ny} x2={x2 + nx} y2={y2 + ny} stroke={BOND} strokeWidth={4 * s} strokeLinecap="round" />
      <line x1={x1 - nx} y1={y1 - ny} x2={x2 - nx} y2={y2 - ny} stroke={BOND} strokeWidth={4 * s} strokeLinecap="round" />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------
// Phân tử nhỏ: O₂, CO₂, H₂O — mô hình que–cầu theo màu CPK (dùng Atom của gói Hóa)
// ---------------------------------------------------------------------------------------------

export type SmallKind = "O2" | "CO2" | "H2O";

/** Toạ độ các nguyên tử (so với tâm phân tử) ở scale s. */
const smallAtoms = (kind: SmallKind, s: number) => {
  const dOC = (30 + 34 + 16) * s;
  const dOO = (30 + 30 + 16) * s;
  const dOH = (30 + 20 + 14) * s;
  if (kind === "O2") return { atoms: [{ el: "O", x: -dOO / 2, y: 0 }, { el: "O", x: dOO / 2, y: 0 }], bonds: [[0, 1, 2]] };
  if (kind === "CO2")
    return { atoms: [{ el: "O", x: -dOC, y: 0 }, { el: "C", x: 0, y: 0 }, { el: "O", x: dOC, y: 0 }], bonds: [[0, 1, 2], [1, 2, 2]] };
  const a = (52 * Math.PI) / 180;
  return {
    atoms: [
      { el: "O", x: 0, y: -dOH * Math.cos(a) * 0.5 },
      { el: "H", x: -dOH * Math.sin(a), y: dOH * Math.cos(a) * 0.5 },
      { el: "H", x: dOH * Math.sin(a), y: dOH * Math.cos(a) * 0.5 },
    ],
    bonds: [[0, 1, 1], [0, 2, 1]],
  };
};

/** Khung bao (rộng, cao) của phân tử nhỏ — để chia bố cục. */
export const smallMoleculeSize = (kind: SmallKind, scale = 1) => {
  const { atoms } = smallAtoms(kind, scale);
  const r = 34 * scale;
  const xs = atoms.map((a) => a.x);
  const ys = atoms.map((a) => a.y);
  return { w: Math.max(...xs) - Math.min(...xs) + 2 * r, h: Math.max(...ys) - Math.min(...ys) + 2 * r };
};

export const SmallMolecule: React.FC<{
  kind: SmallKind;
  x: number;
  y: number;
  scale?: number;
  /** độ quay (độ) */
  rotate?: number;
  opacity?: number;
  /** viền sáng màu của chất (vd. SUBSTANCE.co2) khi đang được nói tới */
  glow?: string;
}> = ({ kind, x, y, scale = 1, rotate = 0, opacity = 1, glow }) => {
  const { atoms, bonds } = smallAtoms(kind, scale);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={opacity}>
      {bonds.map(([i, j, order]) => (
        <Bond key={`${i}-${j}`} x1={atoms[i].x} y1={atoms[i].y} x2={atoms[j].x} y2={atoms[j].y} s={scale} double={order === 2} />
      ))}
      {atoms.map((a, i) => (
        <Atom key={i} element={a.el} x={a.x} y={a.y} scale={scale} glow={glow ?? false} showSymbol={scale >= 0.8} />
      ))}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------
// Glucose: vòng 6 cạnh (5 C + 1 O) + nhánh C6 — đủ 6 carbon thấy được để phân giải ra đúng 6 CO₂
// ---------------------------------------------------------------------------------------------

/** Đỉnh vòng (đỉnh nhọn ở trên): 0 trên, 1 trên-phải (O), 2 dưới-phải, 3 dưới, 4 dưới-trái, 5 trên-trái. */
const hexVertex = (x: number, y: number, r: number, i: number) => {
  const a = ((-90 + 60 * i) * Math.PI) / 180;
  return { x: x + r * Math.cos(a), y: y + r * Math.sin(a) };
};

/** Vị trí 6 carbon của glucose (C1…C6) quanh tâm (x, y), vòng bán kính r. */
export const glucoseCarbons = (x: number, y: number, r = 64) => {
  const c5 = hexVertex(x, y, r, 0);
  return [
    hexVertex(x, y, r, 2), // C1
    hexVertex(x, y, r, 3), // C2
    hexVertex(x, y, r, 4), // C3
    hexVertex(x, y, r, 5), // C4
    c5, // C5
    { x: c5.x - r * 0.62, y: c5.y - r * 0.62 }, // C6 (nhánh CH₂OH)
  ];
};

export const GlucoseRing: React.FC<{
  x: number;
  y: number;
  /** bán kính vòng (px), nên ≥ 56 để chữ O đủ cỡ */
  r?: number;
  color?: string;
  opacity?: number;
  /** độ hiện của nét vòng (0–1) — dùng khi vòng bị bẻ gãy */
  ring?: number;
  /** hiện chấm carbon */
  carbons?: boolean;
}> = ({ x, y, r = 64, color = SUBSTANCE.nutrient, opacity = 1, ring = 1, carbons = true }) => {
  const v = Array.from({ length: 6 }, (_, i) => hexVertex(x, y, r, i));
  const d = v.map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";
  const C = glucoseCarbons(x, y, r);
  const oR = Math.max(24, r * 0.36);
  return (
    <g opacity={opacity}>
      <g opacity={ring}>
        <path d={d} fill={lighten(color, 0.85)} stroke={color} strokeWidth={Math.max(5, r * 0.1)} strokeLinejoin="round" />
        <line x1={C[4].x} y1={C[4].y} x2={C[5].x} y2={C[5].y} stroke={color} strokeWidth={Math.max(5, r * 0.1)} strokeLinecap="round" />
        <circle cx={v[1].x} cy={v[1].y} r={oR} fill="#FFFFFF" stroke={color} strokeWidth={3} />
        <Glyph x={v[1].x} y={v[1].y} text="O" size={font(r / 64)} color="#DC2626" />
      </g>
      {carbons ? C.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={Math.max(8, r * 0.14)} fill={MOLECULE.carbon} />) : null}
    </g>
  );
};

/**
 * Phân giải glucose → 6 CO₂ (kết quả hiện ra TỪ 6 carbon của vòng — dung-video › quy tắc 10).
 * progress: 0–0,3 vòng nguyên; 0,3–0,55 vòng gãy (nét mờ đi, còn 6 carbon); 0,55–1 mỗi carbon bay ra thành một CO₂.
 */
export const GlucoseBreakdown: React.FC<{
  x: number;
  y: number;
  progress: number;
  r?: number;
  /** bán kính vòng các CO₂ sản phẩm quanh tâm */
  spread?: number;
  productScale?: number;
  opacity?: number;
}> = ({ x, y, progress, r = 64, spread, productScale = 0.85, opacity = 1 }) => {
  const C = glucoseCarbons(x, y, r);
  const ring = 1 - seg(progress, 0.3, 0.55);
  const fly = seg(progress, 0.55, 1);
  const targets = glucoseProductAnchors(x, y, r, spread);
  return (
    <g opacity={opacity}>
      <GlucoseRing x={x} y={y} r={r} ring={ring} carbons={fly <= 0} />
      {fly > 0
        ? C.map((c, i) => {
            const t = targets[i];
            const px = interpolate(fly, [0, 1], [c.x, t.x]);
            const py = interpolate(fly, [0, 1], [c.y, t.y]);
            return <SmallMolecule key={i} kind="CO2" x={px} y={py} scale={interpolate(fly, [0, 1], [0.25, productScale])} />;
          })
        : null}
    </g>
  );
};

/** Vị trí 6 CO₂ sau phân giải (để đặt nhãn "$\ce{CO2}$"). */
export const glucoseProductAnchors = (x: number, y: number, r = 64, spread?: number) => {
  const R = spread ?? r * 4.2;
  return Array.from({ length: 6 }, (_, i) => {
    const a = ((-60 + 60 * i) * Math.PI) / 180;
    return { x: x + R * Math.cos(a), y: y + R * 0.72 * Math.sin(a) };
  });
};

// ---------------------------------------------------------------------------------------------
// ATP: adenine – ribose – 3 nhóm phosphate; nhóm cuối tách ra giải phóng năng lượng
// ---------------------------------------------------------------------------------------------

/** Tâm từng phần của ATP. (x, y): mép trái – giữa. release: 0–1 nhóm phosphate cuối tách ra. */
export const atpAnchors = (x: number, y: number, scale = 1, release = 0) => {
  const s = scale;
  const adenine = { x: x + 48 * s, y };
  const ribose = { x: x + 215 * s, y: y + 12 * s };
  const p = [0, 1, 2].map((i) => ({ x: ribose.x + (105 + 82 * i) * s, y: ribose.y }));
  const k = ease(clamp01(release));
  p[2] = { x: p[2].x + 120 * s * k, y: p[2].y + 70 * s * k };
  return { adenine, ribose, phosphates: p, width: p[2].x + 32 * s - x };
};

const regularPolygon = (cx: number, cy: number, r: number, n: number, rot = -90) =>
  Array.from({ length: n }, (_, i) => {
    const a = ((rot + (360 / n) * i) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });

const polyD = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";

export const ATPChain: React.FC<{
  x: number;
  y: number;
  /** nên ≥ 0,95 để chữ trong phân tử đủ cỡ */
  scale?: number;
  /** 0–1: nhóm phosphate cuối tách ra, tia năng lượng bùng ở chỗ đứt */
  release?: number;
  /** phần đang được nói tới sáng lên, phần khác mờ bớt */
  focus?: "adenine" | "ribose" | "phosphate";
  opacity?: number;
}> = ({ x, y, scale = 1, release = 0, focus, opacity = 1 }) => {
  const s = scale;
  const A = atpAnchors(x, y, s, release);
  const P0 = atpAnchors(x, y, s, 0).phosphates;
  const dim = (part: string) => (focus && focus !== part ? 0.35 : 1);
  // adenine: lục giác + ngũ giác ghép cạnh phải
  const hr = 40 * s;
  const hex = regularPolygon(A.adenine.x, A.adenine.y, hr, 6, -90);
  const e1 = hex[1];
  const e2 = hex[2];
  const mid = { x: (e1.x + e2.x) / 2, y: (e1.y + e2.y) / 2 };
  const pr = hr / (2 * Math.sin(Math.PI / 5));
  const pc = { x: mid.x + hr / (2 * Math.tan(Math.PI / 5)), y: mid.y };
  const pent = regularPolygon(pc.x, pc.y, pr, 5, 180);
  const ribose = regularPolygon(A.ribose.x, A.ribose.y, 38 * s, 5, -90);
  const brk = seg(release, 0, 0.35);
  const burst = clamp01(release) > 0 ? Math.sin(Math.PI * clamp01(release / 0.8)) : 0;
  const bx = (P0[1].x + P0[2].x) / 2;
  const by = P0[1].y;
  const pf = font(s);
  return (
    <g opacity={opacity}>
      {/* liên kết phía sau */}
      <g opacity={Math.min(dim("adenine"), dim("ribose"))}>
        <Bond x1={pc.x} y1={pc.y} x2={A.ribose.x} y2={A.ribose.y} s={s} />
      </g>
      <Bond x1={A.ribose.x} y1={A.ribose.y} x2={A.phosphates[0].x} y2={A.phosphates[0].y} s={s} opacity={dim("phosphate")} />
      <Bond x1={A.phosphates[0].x} y1={A.phosphates[0].y} x2={A.phosphates[1].x} y2={A.phosphates[1].y} s={s} opacity={dim("phosphate")} />
      <Bond x1={P0[1].x} y1={P0[1].y} x2={P0[2].x} y2={P0[2].y} s={s} opacity={dim("phosphate") * (1 - brk)} />
      {/* năng lượng bùng ra ở chỗ đứt */}
      {burst > 0
        ? Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4 + Math.PI / 8;
            const r0 = 14 * s;
            const r1 = r0 + 46 * s * burst;
            return (
              <line
                key={i}
                x1={bx + r0 * Math.cos(a)}
                y1={by + r0 * Math.sin(a)}
                x2={bx + r1 * Math.cos(a)}
                y2={by + r1 * Math.sin(a)}
                stroke={MOLECULE.energy}
                strokeWidth={6 * s}
                strokeLinecap="round"
                opacity={burst}
              />
            );
          })
        : null}
      {/* adenine */}
      <g opacity={dim("adenine")}>
        <path d={polyD(pent)} fill={lighten(MOLECULE.adenine, 0.82)} stroke={MOLECULE.adenine} strokeWidth={4 * s} strokeLinejoin="round" />
        <path d={polyD(hex)} fill={lighten(MOLECULE.adenine, 0.82)} stroke={MOLECULE.adenine} strokeWidth={4 * s} strokeLinejoin="round" />
        <Glyph x={A.adenine.x} y={A.adenine.y} text="A" size={pf} color={MOLECULE.adenine} />
      </g>
      {/* ribose */}
      <g opacity={dim("ribose")}>
        <path d={polyD(ribose)} fill={lighten(MOLECULE.ribose, 0.85)} stroke={MOLECULE.ribose} strokeWidth={4 * s} strokeLinejoin="round" />
      </g>
      {/* 3 nhóm phosphate */}
      {A.phosphates.map((p, i) => (
        <g key={i} opacity={dim("phosphate")}>
          <circle cx={p.x} cy={p.y} r={30 * s} fill={lighten(MOLECULE.phosphate, 0.78)} stroke={MOLECULE.phosphate} strokeWidth={4 * s} />
          <Glyph x={p.x} y={p.y} text="P" size={pf} color="#9A3412" />
        </g>
      ))}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------
// Amino acid: C trung tâm với –NH₂, –COOH, –H và gốc R
// ---------------------------------------------------------------------------------------------

export const aminoAcidAnchors = (x: number, y: number, scale = 1) => ({
  carbon: { x, y },
  amine: { x: x - 125 * scale, y },
  carboxyl: { x: x + 140 * scale, y },
  hydrogen: { x, y: y - 92 * scale },
  r: { x, y: y + 102 * scale },
});

export const AminoAcid: React.FC<{
  x: number;
  y: number;
  scale?: number;
  /** màu gốc R — mỗi loại amino acid một màu */
  rColor?: string;
  opacity?: number;
}> = ({ x, y, scale = 1, rColor = MOLECULE.rGroup, opacity = 1 }) => {
  const s = scale;
  const A = aminoAcidAnchors(x, y, s);
  const f = font(s);
  const pill = (c: { x: number; y: number }, w: number, stroke: string) => (
    <rect x={c.x - (w * s) / 2} y={c.y - 30 * s} width={w * s} height={60 * s} rx={30 * s} fill={lighten(stroke, 0.85)} stroke={stroke} strokeWidth={4 * s} />
  );
  return (
    <g opacity={opacity}>
      {[A.amine, A.carboxyl, A.hydrogen, A.r].map((p, i) => (
        <Bond key={i} x1={x} y1={y} x2={p.x} y2={p.y} s={s} />
      ))}
      {pill(A.amine, 104, "#2563EB")}
      <Glyph x={A.amine.x - 4 * s} y={A.amine.y} text="NH" sub="2" size={f} color="#1E40AF" />
      {pill(A.carboxyl, 132, "#DC2626")}
      <Glyph x={A.carboxyl.x} y={A.carboxyl.y} text="COOH" size={f} color="#991B1B" />
      <circle cx={A.hydrogen.x} cy={A.hydrogen.y} r={24 * s} fill="#FFFFFF" stroke="#94A3B8" strokeWidth={4 * s} />
      <Glyph x={A.hydrogen.x} y={A.hydrogen.y} text="H" size={f} color="#1E293B" />
      <circle cx={A.r.x} cy={A.r.y} r={34 * s} fill={lighten(rColor, 0.78)} stroke={rColor} strokeWidth={4 * s} />
      <Glyph x={A.r.x} y={A.r.y} text="R" size={f} color={rColor} />
      <circle cx={x} cy={y} r={32 * s} fill={MOLECULE.carbon} />
      <Glyph x={x} y={y} text="C" size={f} color="#FFFFFF" />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------
// Chuỗi đơn phân: tinh bột (chuỗi vòng glucose), protein (chuỗi amino acid) — split: chuỗi đứt ra thành đơn phân
// ---------------------------------------------------------------------------------------------

const AMINO_COLORS = [MOLECULE.rGroup, "#F59E0B", "#EC4899", "#0EA5E9"];

/** Tâm từng đơn phân. (x, y): mép trái – giữa. */
export const monomerChainAnchors = (x: number, y: number, n = 6, unit = 52, split = 0) => {
  const k = ease(clamp01(split));
  return Array.from({ length: n }, (_, i) => ({
    x: x + unit / 2 + i * (unit * 1.3 + unit * 1.1 * k),
    y: y + Math.sin(i * 2.1 + 0.5) * unit * 0.7 * k,
  }));
};

export const MonomerChain: React.FC<{
  x: number;
  y: number;
  kind: "glucose" | "amino";
  n?: number;
  /** cỡ một đơn phân (px) */
  unit?: number;
  /** 0 = chuỗi liền, 1 = đứt hết thành đơn phân rời */
  split?: number;
  opacity?: number;
}> = ({ x, y, kind, n = 6, unit = 52, split = 0, opacity = 1 }) => {
  const P = monomerChainAnchors(x, y, n, unit, split);
  const bondO = 1 - seg(split, 0, 0.5);
  return (
    <g opacity={opacity}>
      {P.slice(1).map((p, i) => (
        <line key={i} x1={P[i].x} y1={P[i].y} x2={p.x} y2={p.y} stroke={BOND} strokeWidth={5} strokeLinecap="round" opacity={bondO} />
      ))}
      {P.map((p, i) =>
        kind === "glucose" ? (
          <path
            key={i}
            d={polyD(regularPolygon(p.x, p.y, unit / 2, 6, -90))}
            fill={lighten(SUBSTANCE.nutrient, 0.85)}
            stroke={SUBSTANCE.nutrient}
            strokeWidth={4}
            strokeLinejoin="round"
          />
        ) : (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={unit / 2}
            fill={lighten(AMINO_COLORS[i % AMINO_COLORS.length], 0.75)}
            stroke={AMINO_COLORS[i % AMINO_COLORS.length]}
            strokeWidth={4}
          />
        ),
      )}
    </g>
  );
};
