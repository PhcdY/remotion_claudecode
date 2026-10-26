import React from "react";
import { useCurrentFrame } from "remotion";
import { Card } from "../../components/Card";
import { AutoLabelItem, AutoLabels, Rect, segmentObstacles, textObstacle } from "../../components/labels";
import { MathText, Tex } from "../../components/MathText";
import { Tag } from "../../components/parts";
import { role } from "../../components/roles";
import { colors, tint } from "../../components/theme";

// ---------------- Toạ độ ----------------
// Cảnh 2: bản đồ nhìn từ trên, lưới ô vuông (1 ô = 0,4 km), bắc ở phía trên.
// Toạ độ theo ô: A = (0; 0) trên tim đường băng; mọi điểm đổi sang px qua gx/gy (không hardcode px).
export const CELL = 62;
const OY = 830;
/** gốc A khi có thẻ công thức bên phải (lưới dịch trái) và khi chưa có (lưới giữa khung) */
export const OX_LEFT = 680;
export const OX_CENTER = 960;
export const gy = (y: number) => OY - y * CELL;
const GRID = { x0: -8, x1: 8, y0: -0.5, y1: 11.2 };

/** Góc lệch của mũi máy bay: tan α = 0,8 / 4 → α ≈ 11,3°. */
export const ALPHA = (Math.atan(0.8 / 4) * 180) / Math.PI;

/** Màu theo vai trò, một màu một nghĩa suốt video. */
export const K = {
  own: role.main, // chặng máy bay tự bay
  wind: role.pairA, // gió (và vectơ đối của gió, nét đứt)
  sum: role.focus, // tổng, hiệu: kết quả đang nói tới
  target: role.pairB, // chặng cần đi (dọc đường băng)
  warn: role.warn, // bẫy 4,8 km
  dim: role.dim,
};

// ---------------- Máy bay (nhìn từ trên, mũi hướng lên khi rot = 0) ----------------
export const Plane: React.FC<{ cx: number; cy: number; size: number; rot: number; o?: number }> = ({ cx, cy, size, rot, o = 1 }) =>
  o <= 0 ? null : (
    <svg
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      style={{ position: "absolute", left: cx - size / 2, top: cy - size / 2, rotate: `${rot}deg`, opacity: o, overflow: "visible" }}
    >
      <polygon points="-48,6 -6,-10 6,-10 48,6 48,13 6,4 -6,4 -48,13" fill="#7C86A6" />
      <polygon points="-18,38 -4,30 4,30 18,38 18,44 -18,44" fill="#7C86A6" />
      <ellipse cx={0} cy={0} rx={7.5} ry={47} fill="#5E6785" />
      <ellipse cx={0} cy={-36} rx={4} ry={6} fill="#C9D3EA" />
    </svg>
  );

// ---------------- Mũi tên ----------------
export type Arr = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  c: string;
  o: number;
  /** phần đã vẽ, 0 → 1 */
  t?: number;
  dash?: boolean;
  glow?: number;
  w?: number;
  /** đang trượt: không làm vật cản cho nhãn (nhãn khỏi nhảy chỗ theo nó) */
  moving?: boolean;
};

/** Mũi tên theo toạ độ px. */
const ArrowPx: React.FC<{ a: Arr; x1: number; y1: number; x2: number; y2: number }> = ({ a, x1, y1, x2, y2 }) => {
  const t = a.t ?? 1;
  if (a.o <= 0 || t <= 0) return null;
  const ex = x1 + (x2 - x1) * t;
  const ey = y1 + (y2 - y1) * t;
  const len = Math.hypot(ex - x1, ey - y1);
  if (len < 2) return null;
  const ux = (ex - x1) / len;
  const uy = (ey - y1) / len;
  const w = a.w ?? 7;
  const hl = Math.min(30, len * 0.6);
  const hw = hl * 0.62;
  const bx = ex - ux * hl;
  const by = ey - uy * hl;
  const head = `${ex},${ey} ${bx - uy * hw},${by + ux * hw} ${bx + uy * hw},${by - ux * hw}`;
  const g = a.glow ?? 0;
  return (
    <g opacity={a.o}>
      {g > 0 ? <line x1={x1} y1={y1} x2={bx} y2={by} stroke={a.c} strokeOpacity={0.22 * g} strokeWidth={w + 18} strokeLinecap="round" /> : null}
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={a.c} strokeWidth={w} strokeLinecap="round" strokeDasharray={a.dash ? "16 12" : undefined} />
      <polygon points={head} fill={a.c} />
    </g>
  );
};

// ---------------- Thẻ công thức ----------------
const CARD_X = 1220;
const CARD_W = 600;

const FormulaCard: React.FC<{ top: number; o: number; rows: { tex: string; o?: number }[]; size?: number; minH?: number }> = ({ top, o, rows, size = 46, minH }) =>
  o <= 0 ? null : (
    <Card style={{ left: CARD_X, top, width: CARD_W, minHeight: minH, padding: "20px 24px", opacity: o, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {rows.map((r, i) =>
        (r.o ?? 1) > 0 ? (
          <div key={i} data-text="formula" style={{ fontSize: size, opacity: r.o ?? 1, whiteSpace: "nowrap" }}>
            <Tex tex={r.tex} />
          </div>
        ) : null,
      )}
    </Card>
  );

/** Thẻ đổi nội dung tại chỗ (crossfade giữa các bước); khung giữ theo bước cao nhất. */
const StepCard: React.FC<{ top: number; o: number; steps: string[]; step: number; size?: number; h: number }> = ({ top, o, steps, step, size = 46, h }) => {
  if (o <= 0) return null;
  const st = Math.min(Math.max(step, 0), steps.length - 1);
  const lo = Math.floor(st);
  return (
    <Card style={{ left: CARD_X, top, width: CARD_W, height: h, opacity: o }}>
      {steps.map((s, i) => {
        const k = i === lo ? 1 - (st - lo) : i === lo + 1 ? st - lo : 0;
        return k > 0 ? (
          <div
            key={i}
            data-text="formula"
            style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size, opacity: k }}
          >
            <Tex tex={s} />
          </div>
        ) : null;
      })}
    </Card>
  );
};

export const col = (c: string, on: number, t: string) => (on > 0.05 ? `\\textcolor{${c}}{${t}}` : t);

// ---------------- CẢNH 1: máy bay hạ cánh ----------------
export type St1 = {
  rot: number;
  wind: number;
  windTxt: number;
  own: number;
  ownT: number;
  windArr: number;
  tri: number;
  tanTxt: number;
  arc: number;
  angTxt: number;
};
export const st1Zero: St1 = { rot: 0, wind: 0, windTxt: 0, own: 0, ownT: 0, windArr: 0, tri: 0, tanTxt: 0, arc: 0, angTxt: 0 };

const P1 = { cx: 960, cy: 640, size: 300 };
const RW = { cx: 960, w: 250 };
const OWN_LEN = 420;

export const Scene1: React.FC<{ st: St1 }> = ({ st }) => {
  const fr = useCurrentFrame();
  const a = (ALPHA * Math.PI) / 180;
  const tipX = P1.cx - OWN_LEN * Math.sin(a);
  const tipY = P1.cy - OWN_LEN * Math.cos(a);
  const top = 110;
  const bottom = 920;
  // vạch tim đường băng trôi xuống: máy bay đang tiến lên
  const period = 110;
  const off = (fr * 7) % period;
  const dashes = [];
  for (let y = top - period + off; y < bottom; y += period) dashes.push(y);
  // vệt gió từ trái sang phải
  const streaks = [180, 300, 420, 540, 660, 780, 860].map((y, i) => {
    const span = 1920 + 400;
    const x = ((fr * 13 + i * 337) % span) - 200;
    return { x, y };
  });
  const arcR = 270;
  const arcPath = `M ${P1.cx} ${P1.cy} L ${P1.cx} ${P1.cy - arcR} A ${arcR} ${arcR} 0 0 0 ${P1.cx - arcR * Math.sin(a)} ${P1.cy - arcR * Math.cos(a)} Z`;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={RW.cx - RW.w / 2} y={top} width={RW.w} height={bottom - top} rx={10} fill="#E3E8F3" />
        <line x1={RW.cx - RW.w / 2 + 14} y1={top} x2={RW.cx - RW.w / 2 + 14} y2={bottom} stroke="#FFFFFF" strokeWidth={5} />
        <line x1={RW.cx + RW.w / 2 - 14} y1={top} x2={RW.cx + RW.w / 2 - 14} y2={bottom} stroke="#FFFFFF" strokeWidth={5} />
        {dashes.map((y) => (
          <line key={y} x1={RW.cx} y1={Math.max(top, y)} x2={RW.cx} y2={Math.min(bottom, y + 60)} stroke="#FFFFFF" strokeWidth={7} />
        ))}
        {streaks.map((s, i) => (
          <g key={i} opacity={0.5 * st.wind}>
            <line x1={s.x} y1={s.y} x2={s.x + 140} y2={s.y} stroke={K.wind} strokeWidth={4} strokeLinecap="round" />
            <polygon points={`${s.x + 156},${s.y} ${s.x + 138},${s.y - 9} ${s.x + 138},${s.y + 9}`} fill={K.wind} />
          </g>
        ))}
      </svg>
      <Plane cx={P1.cx} cy={P1.cy} size={P1.size} rot={-st.rot} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {st.tri > 0 ? (
          <polygon points={`${P1.cx},${P1.cy} ${tipX},${tipY} ${P1.cx},${tipY}`} fill={tint(K.sum, 0.08)} stroke={K.sum} strokeOpacity={0.5} strokeDasharray="8 8" strokeWidth={3} opacity={st.tri} />
        ) : null}
        <ArrowPx a={{ x1: 0, y1: 0, x2: 0, y2: 0, c: K.own, o: st.own, t: st.ownT, w: 8 }} x1={P1.cx} y1={P1.cy} x2={tipX} y2={tipY} />
        <ArrowPx a={{ x1: 0, y1: 0, x2: 0, y2: 0, c: K.wind, o: st.windArr, w: 8 }} x1={tipX} y1={tipY} x2={P1.cx} y2={tipY} />
        {st.arc > 0 ? <path d={arcPath} fill={tint(K.sum, 0.28)} stroke={K.sum} strokeWidth={5} strokeLinejoin="round" opacity={st.arc} /> : null}
        {st.arc > 0 ? (
          <line x1={P1.cx} y1={P1.cy} x2={P1.cx} y2={P1.cy - arcR - 40} stroke={K.sum} strokeWidth={4} strokeDasharray="10 8" opacity={st.arc} />
        ) : null}
        {st.own > 0 ? <circle data-mark="tail" cx={P1.cx} cy={P1.cy} r={8} fill={K.own} opacity={st.own} /> : null}
      </svg>
      <Tag x={330} y={226} color={K.wind} weight={700} size={44} opacity={st.windTxt}>
        gió ngang 48 km/h →
      </Tag>
      <Tag x={tipX - 40} y={tipY - 20} anchor="right" color={K.sum} weight={700} size={44} opacity={st.tanTxt}>
        <MathText text={"$\\tan\\alpha=\\dfrac{0{,}8}{4}$"} />
      </Tag>
      <Tag x={P1.cx - arcR * Math.sin(a) - 30} y={P1.cy - arcR * Math.cos(a) - 10} anchor="right" color={K.sum} weight={800} size={60} opacity={st.angTxt}>
        <MathText text={"$\\alpha\\approx 11^{\\circ}$"} />
      </Tag>
    </>
  );
};

// ---------------- CẢNH 2: bản đồ có lưới ----------------
export type Pt = { x: number; y: number; o: number; c?: string; pulse?: number };
export type Lab = { o: number; step?: number };
export type St2 = {
  /** px của gốc A theo chiều ngang */
  ox: number;
  grid: number;
  runway: number;
  arrows: Record<string, Arr>;
  pts: Record<string, Pt>;
  labels: Record<string, Lab>;
  plane: { x: number; y: number; rot: number; o: number };
  fills: Record<string, { pts: [number, number][]; o: number; c: string }>;
  bracket: number;
  rightAngle: number;
  detour: number;
  count: number;
  qmark: number;
  cards: {
    sum: number;
    sumRow2: number;
    hiAB: number;
    hiB: number;
    hiAC: number;
    eq: number;
    eqStep: number;
    eqQ: number;
    def: number;
    rule: number;
    ruleHi: number;
  };
};

export const st2Zero: St2 = {
  ox: OX_CENTER,
  grid: 0,
  runway: 0,
  arrows: {},
  pts: {},
  labels: {},
  plane: { x: 0, y: 0, rot: 0, o: 0 },
  fills: {},
  bracket: 0,
  rightAngle: 0,
  detour: 0,
  count: 0,
  qmark: 0,
  cards: { sum: 0, sumRow2: 0, hiAB: 0, hiB: 0, hiAC: 0, eq: 0, eqStep: 0, eqQ: 0, def: 0, rule: 0, ruleHi: 0 },
};

const mid = (a?: Arr): [number, number] => (a ? [(a.x1 + a.x2) / 2, (a.y1 + a.y2) / 2] : [0, 0]);

/** Mọi nhãn của cảnh 2 (vị trí tính trên tất cả nên không nhảy khi nhãn khác hiện). */
type LabDef = {
  id: string;
  at: (st: St2) => [number, number];
  steps: string[];
  color?: string;
  prefer?: AutoLabelItem["prefer"];
  anchor?: "point" | "region";
  phases: string[];
  size?: number;
};
const LABELS: LabDef[] = [
  { id: "A", at: () => [0, 0], steps: ["$A$"], prefer: ["w", "nw"], phases: ["all"] },
  { id: "speed", at: (s) => [s.plane.x, s.plane.y], steps: ["240 km/h"], color: K.own, prefer: ["e", "ne"], phases: ["b02"] },
  { id: "AB", at: () => [0, 5], steps: ["4 km", "$\\overrightarrow{AB}$"], color: K.own, prefer: ["w", "e"], phases: ["b02", "b03", "b04", "b05", "b06", "b07", "b08"], anchor: "region" },
  { id: "copyEq", at: (s) => mid(s.arrows.copy), steps: ["$=\\overrightarrow{AB}$"], color: K.own, prefer: ["e"], phases: ["b03"], anchor: "region" },
  { id: "B", at: () => [0, 10], steps: ["$B$"], prefer: ["n", "nw"], phases: ["b02", "b03", "b04", "b05", "b06", "b07", "b08"] },
  { id: "windTxt", at: () => [-5, 2], steps: ["48 km/h → 0,8 km mỗi phút"], color: K.wind, prefer: ["n"], phases: ["b04"], anchor: "region" },
  { id: "C", at: () => [2, 10], steps: ["$C$"], prefer: ["ne", "e", "n"], phases: ["b04", "b05", "b06", "b07", "b08"] },
  { id: "dev", at: () => [1, 9.3], steps: ["lệch 0,8 km"], color: K.sum, prefer: ["s", "se"], phases: ["b04"], anchor: "region" },
  { id: "AC", at: () => [1, 5], steps: ["$\\overrightarrow{AC}$"], color: K.sum, prefer: ["e"], phases: ["b05", "b06", "b07"], anchor: "region" },
  { id: "ACq", at: () => [2.3, 6.5], steps: ["$4{,}8$ km?"], color: K.warn, prefer: ["e", "se", "ne"], phases: ["b08"], anchor: "region" },
  { id: "ACr", at: () => [2.3, 6.5], steps: ["$\\sqrt{4^2+0{,}8^2}\\approx 4{,}08$ km"], color: K.sum, prefer: ["e", "se", "ne"], phases: ["b08", "b09"], anchor: "region" },
  { id: "E", at: () => [2, 0], steps: ["$E$"], prefer: ["e", "se"], phases: ["b06", "b07", "b09", "b10", "b11", "b12"] },
  { id: "AE", at: () => [1, 0], steps: ["$\\overrightarrow{AE}$"], color: K.wind, prefer: ["s"], phases: ["b06", "b07", "b09", "b10", "b11", "b12"], anchor: "region" },
  { id: "BCeqAE", at: () => [1, 10], steps: ["$\\overrightarrow{BC}=\\overrightarrow{AE}$"], color: K.wind, prefer: ["n", "ne"], phases: ["b06"], anchor: "region" },
  { id: "hbh", at: () => [0.6, 2.5], steps: ["hình bình hành"], prefer: ["w", "sw"], phases: ["b07"], anchor: "region" },
  { id: "len08", at: () => [1, 10], steps: ["0,8 km"], color: K.wind, prefer: ["n"], phases: ["b08"], anchor: "region" },
  { id: "M", at: () => [0, 10], steps: ["$M$: chỗ cần tới"], color: K.target, prefer: ["ne", "n", "e"], phases: ["b09", "b10", "b11", "b12"] },
  { id: "AM", at: () => [0, 6.8], steps: ["$\\overrightarrow{AM}$"], color: K.target, prefer: ["e"], phases: ["b09", "b10", "b11", "b12"], anchor: "region" },
  { id: "negIll", at: () => [-7, 2.35], steps: ["$-\\overrightarrow{AE}$"], color: K.wind, prefer: ["w", "nw"], phases: ["b10"], anchor: "region" },
  { id: "illEq", at: () => [-6, 1.25], steps: ["$\\overrightarrow{AE}+(-\\overrightarrow{AE})=\\vec{0}$"], prefer: ["s"], phases: ["b10"], anchor: "region" },
  { id: "K", at: () => [-2, 10], steps: ["$K$"], color: K.own, prefer: ["nw", "w", "n"], phases: ["b11", "b12"] },
  { id: "AK", at: () => [-1, 5], steps: ["$\\overrightarrow{AK}$", "$\\overrightarrow{EM}=\\overrightarrow{AK}$"], color: K.own, prefer: ["w"], phases: ["b11", "b12"], anchor: "region" },
  { id: "EM", at: () => [1.5, 2.6], steps: ["$\\overrightarrow{EM}$"], color: K.sum, prefer: ["e"], phases: ["b12"], anchor: "region" },
  { id: "count", at: () => [2, 7.5], steps: ["trái 2, lên 10"], color: K.sum, prefer: ["e"], phases: ["b12"], anchor: "region" },
];

export const Scene2: React.FC<{ st: St2; phase: string }> = ({ st, phase }) => {
  const gx = (x: number) => st.ox + x * CELL;
  const arrows = Object.entries(st.arrows);
  // vật cản cho nhãn: mũi tên, chấm, máy bay, chữ cố định, thẻ
  const obst: Rect[] = [];
  for (const [, a] of arrows) {
    if (a.o > 0.05 && (a.t ?? 1) > 0.05 && !a.moving) obst.push(...segmentObstacles(gx(a.x1), gy(a.y1), gx(a.x2), gy(a.y2), 10));
  }
  for (const p of Object.values(st.pts)) if (p.o > 0.05) obst.push({ x: gx(p.x) - 10, y: gy(p.y) - 10, w: 20, h: 20 });
  // máy bay không làm vật cản: nó di chuyển, nhãn sẽ nhảy chỗ theo nó
  obst.push(textObstacle(gx(5.2), gy(0.15), gx(8) - gx(5.2), 50)); // chú giải lưới
  obst.push(textObstacle(gx(6.6), gy(11.1), gx(8) - gx(6.6), 50)); // hướng bắc
  if (st.cards.sum > 0.05) obst.push(textObstacle(CARD_X, 170, CARD_W, 220));
  if (st.cards.eq > 0.05) obst.push(textObstacle(CARD_X, 170, CARD_W, 190));
  if (st.cards.def > 0.05) obst.push(textObstacle(CARD_X, 400, CARD_W, 120));
  if (st.cards.rule > 0.05) obst.push(textObstacle(CARD_X, 560, CARD_W, 120));

  const items: AutoLabelItem[] = LABELS.map((d) => {
    const [x, y] = d.at(st);
    const l = st.labels[d.id];
    return {
      id: d.id,
      x: gx(x),
      y: gy(y),
      text: d.steps[0],
      steps: d.steps.length > 1 ? d.steps : undefined,
      step: l?.step ?? 0,
      color: d.color,
      size: d.size ?? 44,
      weight: 700,
      opacity: d.phases.includes("all") || d.phases.includes(phase) ? (l?.o ?? 0) : 0,
      prefer: d.prefer,
      phases: d.phases.includes("all") ? undefined : d.phases,
      anchor: d.anchor,
    };
  });

  const c = st.cards;
  const sumRow1 = `${col(K.own, c.hiAB, "\\overrightarrow{A" + col(K.sum, c.hiB, "B") + "}")}+\\overrightarrow{${col(K.sum, c.hiB, "B")}C}=${col(K.sum, c.hiAC, "\\overrightarrow{AC}")}`;
  const AE = col(K.wind, 1, "\\overrightarrow{AE}");
  const AM = col(K.target, 1, "\\overrightarrow{AM}");
  const Q = col(K.own, 1, "\\,?\\,");
  const eqSteps = [
    `${Q}+${AE}=${AM}`,
    `\\begin{aligned}&${Q}+${AE}+(-${AE})\\\\ =\\ &${AM}+(-${AE})\\end{aligned}`,
    `\\begin{aligned}&${Q}+\\cancel{${AE}+(-${AE})}\\\\ =\\ &${AM}+(-${AE})\\end{aligned}`,
    `${Q}=${AM}-${AE}`,
    `${col(K.own, 1, "\\overrightarrow{AK}")}=${AM}-${AE}`,
  ];
  const fillsArr = Object.entries(st.fills);
  const ra = 22;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* đường băng */}
        <g opacity={st.runway}>
          <rect x={gx(-0.62)} y={gy(GRID.y1)} width={gx(0.62) - gx(-0.62)} height={gy(GRID.y0) - gy(GRID.y1)} rx={8} fill="#E3E8F3" />
          <line x1={gx(0)} y1={gy(GRID.y1)} x2={gx(0)} y2={gy(GRID.y0)} stroke="#FFFFFF" strokeWidth={5} strokeDasharray="26 22" />
        </g>
        {/* lưới */}
        <g opacity={st.grid}>
          {Array.from({ length: GRID.x1 - GRID.x0 + 1 }, (_, i) => GRID.x0 + i).map((x) => (
            <line key={`v${x}`} x1={gx(x)} y1={gy(GRID.y1)} x2={gx(x)} y2={gy(GRID.y0)} stroke={colors.grid} strokeWidth={2} />
          ))}
          {Array.from({ length: 12 }, (_, i) => i).map((y) => (
            <line key={`h${y}`} x1={gx(GRID.x0)} y1={gy(y)} x2={gx(GRID.x1)} y2={gy(y)} stroke={colors.grid} strokeWidth={2} />
          ))}
        </g>
        {fillsArr.map(([id, f]) =>
          f.o > 0 ? <polygon key={id} points={f.pts.map(([x, y]) => `${gx(x)},${gy(y)}`).join(" ")} fill={f.c} opacity={f.o} /> : null,
        )}
        {st.detour > 0 ? (
          <polyline
            points={`${gx(0)},${gy(0)} ${gx(0)},${gy(10)} ${gx(2)},${gy(10)}`}
            fill="none"
            stroke={K.warn}
            strokeOpacity={0.25 * st.detour}
            strokeWidth={26}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ) : null}
        {st.rightAngle > 0 ? (
          <polyline points={`${gx(0)},${gy(10) + ra} ${gx(0) + ra},${gy(10) + ra} ${gx(0) + ra},${gy(10)}`} fill="none" stroke={colors.muted} strokeWidth={3} opacity={st.rightAngle} />
        ) : null}
        {st.count > 0 ? (
          <polyline
            points={`${gx(2)},${gy(0)} ${gx(2)},${gy(10)} ${gx(0)},${gy(10)}`}
            fill="none"
            stroke={K.sum}
            strokeWidth={4}
            strokeDasharray="6 10"
            opacity={st.count}
          />
        ) : null}
        {st.count > 0
          ? Array.from({ length: 11 }, (_, i) => i).map((i) => (
              <line key={`ct${i}`} x1={gx(2) - 10} y1={gy(i)} x2={gx(2) + 10} y2={gy(i)} stroke={K.sum} strokeWidth={3} opacity={st.count} />
            ))
          : null}
        {st.bracket > 0 ? (
          <g opacity={st.bracket} stroke={K.sum} strokeWidth={4}>
            <line x1={gx(0)} y1={gy(9.45)} x2={gx(2)} y2={gy(9.45)} />
            <line x1={gx(0)} y1={gy(9.3)} x2={gx(0)} y2={gy(9.6)} />
            <line x1={gx(2)} y1={gy(9.3)} x2={gx(2)} y2={gy(9.6)} />
          </g>
        ) : null}
        {arrows.map(([id, a]) => (
          <ArrowPx key={id} a={a} x1={gx(a.x1)} y1={gy(a.y1)} x2={gx(a.x2)} y2={gy(a.y2)} />
        ))}
        {Object.entries(st.pts).map(([id, p]) =>
          p.o > 0 ? (
            <g key={id}>
              {p.pulse ? <circle cx={gx(p.x)} cy={gy(p.y)} r={10 + 16 * p.pulse} fill={p.c ?? colors.text} opacity={0.25 * p.pulse * p.o} /> : null}
              <circle data-mark={id} cx={gx(p.x)} cy={gy(p.y)} r={9} fill={p.c ?? colors.text} stroke="#fff" strokeWidth={3} opacity={p.o} />
            </g>
          ) : null,
        )}
      </svg>
      <Plane cx={gx(st.plane.x)} cy={gy(st.plane.y)} size={140} rot={st.plane.rot} o={st.plane.o} />
      {st.qmark > 0 ? (
        <Tag x={gx(1)} y={gy(4)} color={K.sum} weight={800} size={64} opacity={st.qmark}>
          ?
        </Tag>
      ) : null}
      <Tag x={gx(8)} y={gy(0.1)} anchor="right" color={colors.muted} size={36} opacity={st.grid}>
        1 ô = 0,4 km
      </Tag>
      <Tag x={gx(8)} y={gy(11.05)} anchor="right" color={colors.muted} size={36} weight={700} opacity={st.grid}>
        Bắc ↑
      </Tag>
      <AutoLabels items={items} obstacles={obst} bounds={{ x: 100, y: 120, w: 1720, h: 806 }} />
      <FormulaCard
        top={170}
        o={c.sum}
        rows={[
          { tex: sumRow1 },
          { tex: `${col(K.own, 1, "\\overrightarrow{AB}")}+${col(K.wind, 1, "\\overrightarrow{AE}")}=${col(K.sum, 1, "\\overrightarrow{AC}")}`, o: c.sumRow2 },
        ]}
        minH={c.sumRow2 > 0 ? 210 : undefined}
      />
      <div style={{ opacity: 1 - 0.5 * c.eqQ }}>
        <StepCard top={170} o={c.eq} steps={eqSteps} step={c.eqStep} h={190} />
      </div>
      <FormulaCard top={400} o={c.def} rows={[{ tex: "\\vec{a}-\\vec{b}=\\vec{a}+(-\\vec{b})" }]} />
      <FormulaCard
        top={560}
        o={c.rule}
        rows={[{ tex: `${col(K.target, 1, "\\overrightarrow{AM}")}-${col(K.wind, 1, "\\overrightarrow{AE}")}=${col(K.sum, 1, "\\overrightarrow{EM}")}` }]}
        size={46 + 6 * c.ruleHi}
      />
    </>
  );
};
