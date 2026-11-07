import React from "react";
import { Card } from "../../components/Card";
import { AutoLabelItem, AutoLabels, Rect, axesObstacles, curveObstacles, textObstacle } from "../../components/labels";
import { MathText, Tex } from "../../components/MathText";
import { Tag, col, lerp } from "../../components/parts";
import { Axes, EndArrow, FunctionPlot, Plot, Point, Segment, makeScale } from "../../components/plot";
import { role } from "../../components/roles";
import { colors, fontText, halo, tint } from "../../components/theme";

// ---------------- Mô hình ----------------
/** Ví dụ xuyên suốt: lon 330 ml (= 330 cm³), bán kính r (cm), chiều cao h = 330/(πr²). */
export const V = 330;
export const hOf = (r: number) => V / (Math.PI * r * r);
/** Diện tích vỏ lon có nắp: S(r) = 2πr² + 660/r */
export const S_ = (r: number) => 2 * Math.PI * r * r + (2 * V) / r;
export const ends = (r: number) => 2 * Math.PI * r * r;
/** S'(r) = 4πr − 660/r² */
export const dS = (r: number) => 4 * Math.PI * r - (2 * V) / (r * r);
export const body = (r: number) => (2 * V) / r;
/** điểm thấp nhất: r = ∛(330/2π) ≈ 3,745 */
export const R_OPT = Math.cbrt(V / (2 * Math.PI));
/** cốc không nắp: r = h = ∛(330/π) ≈ 4,718 */
export const R_CUP = Math.cbrt(V / Math.PI);
/** lon thật vẽ theo tỉ lệ cao ≈ 1,85 lần bề ngang, vẫn 330 cm³ */
export const R_REAL = 3.05;

/** Màu theo vai trò, giữ nguyên nghĩa suốt video. */
export const K = {
  main: role.main,
  focus: role.focus,
  up: role.up,
  down: role.down,
  warn: role.warn,
  body: role.pairA, // thân lon
  ends: role.pairB, // nắp + đáy
  dim: role.dim,
};
const METAL = "#E9EEF8";
const WATER = "#9CC3F7";

// ---------------- Lon (SVG, toạ độ trang) ----------------
type CanProps = {
  cx: number;
  base: number;
  /** px trên 1 cm */
  k: number;
  r: number;
  h?: number;
  o?: number;
  bodyHi?: number;
  endsHi?: number;
  /** có nắp (lon) hay để hở (cốc) */
  lid?: boolean;
  water?: number;
  dashed?: boolean;
  stroke?: string;
  /** nắp, đáy vẽ dày (lon thật, b12) */
  thick?: number;
  shell?: number;
};

export const canGeom = (cx: number, base: number, k: number, r: number, h = hOf(r)) => {
  const rx = r * k;
  const H = h * k;
  const ry = Math.max(6, rx * 0.2);
  return { rx, ry, H, top: base - H, cx, base };
};

export const Can: React.FC<CanProps> = ({ cx, base, k, r, h, o = 1, bodyHi = 0, endsHi = 0, lid = true, water = 0, dashed = false, stroke = K.main, thick = 0, shell = 0 }) => {
  if (o <= 0) return null;
  const { rx, ry, top } = canGeom(cx, base, k, r, h);
  const dash = dashed ? "14 10" : undefined;
  const sw = 5;
  const bodyPath = `M${cx - rx},${top} L${cx - rx},${base} A${rx},${ry} 0 0 0 ${cx + rx},${base} L${cx + rx},${top} Z`;
  const bodyStroke = bodyHi > 0.5 ? K.body : stroke;
  const endStroke = endsHi > 0.5 || thick > 0 ? K.ends : stroke;
  const endW = sw + thick * 8;
  return (
    <g opacity={o}>
      <path d={bodyPath} fill={dashed ? "none" : METAL} />
      {water > 0 ? <path d={bodyPath} fill={tint(WATER, 0.55 * water)} /> : null}
      {shell > 0 ? <path d={bodyPath} fill={tint(K.focus, 0.12 * shell)} /> : null}
      {bodyHi > 0 ? <path d={bodyPath} fill={tint(K.body, 0.32 * bodyHi)} /> : null}
      <line x1={cx - rx} y1={top} x2={cx - rx} y2={base} stroke={bodyStroke} strokeWidth={sw} strokeDasharray={dash} />
      <line x1={cx + rx} y1={top} x2={cx + rx} y2={base} stroke={bodyStroke} strokeWidth={sw} strokeDasharray={dash} />
      {/* đáy: nửa elip phía trước */}
      <path d={`M${cx - rx},${base} A${rx},${ry} 0 0 0 ${cx + rx},${base}`} fill="none" stroke={endStroke} strokeWidth={endsHi > 0.5 ? endW + 2 : endW} strokeDasharray={dash} />
      {/* nắp (hoặc miệng cốc) */}
      <ellipse
        cx={cx}
        cy={top}
        rx={rx}
        ry={ry}
        fill={dashed ? "none" : lid ? (endsHi > 0 ? tint(K.ends, 0.1 + 0.3 * endsHi) : "#F7F9FD") : "#CBD4E6"}
        stroke={lid ? endStroke : bodyStroke}
        strokeWidth={lid ? endW : sw}
        strokeDasharray={dash}
      />
      {lid && !dashed ? <ellipse cx={cx} cy={top} rx={rx * 0.72} ry={ry * 0.72} fill="none" stroke={tint(stroke, 0.35)} strokeWidth={2} /> : null}
    </g>
  );
};

/** Vạch kích thước: chiều cao (bên phải lon), bề ngang (dưới lon), bán kính (trên nắp) + ký hiệu r, h. */
export const CanDims: React.FC<{
  cx: number;
  base: number;
  k: number;
  r: number;
  h?: number;
  hBar?: number;
  wBar?: number;
  rBar?: number;
  /** ký hiệu r, h cạnh vạch */
  sym?: number;
  hColor?: string;
  wColor?: string;
}> = ({ cx, base, k, r, h, hBar = 0, wBar = 0, rBar = 0, sym = 0, hColor = colors.text, wColor = colors.text }) => {
  const { rx, ry, top } = canGeom(cx, base, k, r, h);
  const hx = cx + rx + 34;
  const wy = base + ry + 26;
  const tick = 12;
  const symFont = { fontFamily: "KaTeX_Math, serif", fontStyle: "italic", fontSize: 44, paintOrder: "stroke", stroke: colors.bg, strokeWidth: 7 } as const;
  return (
    <g>
      {hBar > 0 ? (
        <g opacity={hBar} stroke={hColor} strokeWidth={4} strokeLinecap="round">
          <line x1={hx} y1={top} x2={hx} y2={base} />
          <line x1={hx - tick} y1={top} x2={hx + tick} y2={top} />
          <line x1={hx - tick} y1={base} x2={hx + tick} y2={base} />
          {sym > 0 ? (
            <text data-text="sym" x={hx + 18} y={(top + base) / 2 + 14} fill={hColor} opacity={sym} {...symFont} strokeWidth={7}>
              h
            </text>
          ) : null}
        </g>
      ) : null}
      {wBar > 0 ? (
        <g opacity={wBar} stroke={wColor} strokeWidth={4} strokeLinecap="round">
          <line x1={cx - rx} y1={wy} x2={cx + rx} y2={wy} />
          <line x1={cx - rx} y1={wy - tick} x2={cx - rx} y2={wy + tick} />
          <line x1={cx + rx} y1={wy - tick} x2={cx + rx} y2={wy + tick} />
        </g>
      ) : null}
      {rBar > 0 ? (
        <g opacity={rBar}>
          <circle cx={cx} cy={top} r={6} fill={colors.text} />
          <line x1={cx} y1={top} x2={cx + rx} y2={top} stroke={colors.text} strokeWidth={4} strokeDasharray="10 8" />
          {sym > 0 ? (
            <text data-text="sym" x={cx + rx * 0.62} y={top - ry - 20} textAnchor="middle" fill={colors.text} opacity={sym} {...symFont}>
              r
            </text>
          ) : null}
        </g>
      ) : null}
    </g>
  );
};

/** Vật cản (px) cho nhãn quanh một lon. */
const canObstacle = (cx: number, base: number, k: number, r: number, h?: number): Rect => {
  const { rx, ry, top } = canGeom(cx, base, k, r, h);
  return { x: cx - rx - 8, y: top - ry - 8, w: 2 * rx + 16, h: base - top + 2 * ry + 16 };
};

const Layer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    {children}
  </svg>
);

/** Một dòng công thức trong thẻ. */
const Row: React.FC<{ tex: string; o: number; size?: number; y?: number; color?: string; bg?: string; name?: string }> = ({ tex, o, size = 56, y = 0, color, bg, name = "formula" }) =>
  o <= 0 ? null : (
    <div
      data-text={name}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
        fontSize: size,
        color: color ?? colors.text,
        opacity: o,
      }}
    >
      <span style={{ background: bg, borderRadius: 12, padding: "0 10px" }}>
        <Tex tex={tex} />
      </span>
    </div>
  );

// ======================= CẢNH 1 — sân khấu lon =======================
export type St1 = {
  canX: number;
  r: number;
  shrink: number;
  water: number;
  ghost: number;
  side: number;
  sideHi: [number, number, number];
  hBar: number;
  wBar: number;
  rBar: number;
  sym: number;
  bodyHi: number;
  endsHi: number;
  shell: number;
  legend: number;
  ml: number;
  mlLock: number;
  // nhãn
  tRatio: number;
  tShort: number;
  tR2: number;
  tR7: number;
  tModel: number;
  tShell: number;
  tUnits: number;
  tEnds: number;
  tBody: number;
  tRH: number;
  tRHStep: number;
  // thẻ công thức
  panel: number;
  rowS: number;
  rowSStep: number; // 0: S = 2πr² + 2πrh, 1: S(r) = 2πr² + 660/r
  rhHi: number;
  hHi: number;
  rowV: number;
  rowVStep: number; // 0: V = πr²h = 330, 1: h = 330/(πr²)
  note330: number;
  work: number;
  workStep: number; // 0: 2πr·330/(πr²), 1: gạch, 2: 660/r
  workNote: number;
};

export const S1_0: St1 = {
  canX: 960,
  r: R_REAL,
  shrink: 1,
  water: 0,
  ghost: 0,
  side: 0,
  sideHi: [0, 0, 0],
  hBar: 0,
  wBar: 0,
  rBar: 0,
  sym: 0,
  bodyHi: 0,
  endsHi: 0,
  shell: 0,
  legend: 0,
  ml: 0,
  mlLock: 0,
  tRatio: 0,
  tShort: 0,
  tR2: 0,
  tR7: 0,
  tModel: 0,
  tShell: 0,
  tUnits: 0,
  tEnds: 0,
  tBody: 0,
  tRH: 0,
  tRHStep: 0,
  panel: 0,
  rowS: 0,
  rowSStep: 0,
  rhHi: 0,
  hHi: 0,
  rowV: 0,
  rowVStep: 0,
  note330: 0,
  work: 0,
  workStep: 0,
  workNote: 0,
};

const K1 = 26;
const BASE1 = 850;
const P1 = { left: 900, top: 170, width: 930, height: 590 };

const cross = (a: number, b: number, t: number) => [a * (1 - t), b * t];

export const Scene1: React.FC<{ st: St1 }> = ({ st }) => {
  const k = K1 * st.shrink;
  const r = st.r;
  const h = hOf(r);
  const cx = st.canX;
  const g = canGeom(cx, BASE1, k, r, h);
  const gFull = canGeom(cx, BASE1, K1, R_REAL);
  // công thức S, tô từng cụm
  const rr = st.rhHi > 0.5 ? col(K.focus, "r") : "r";
  const hh = st.rhHi > 0.5 || st.hHi > 0.5 ? col(K.focus, "h") : "h";
  const bPart = col(K.body, `2\\pi ${rr} ${hh}`);
  const sTex0 = `S = ${col(K.ends, `2\\pi ${rr}^2`)} + ${bPart}`;
  const sTex1 = `S(r) = ${col(K.ends, "2\\pi r^2")} + ${col(K.body, "\\dfrac{660}{r}")}`;
  const [s0, s1] = cross(st.rowS, st.rowS, st.rowSStep);
  const [v0, v1] = cross(st.rowV, st.rowV, st.rowVStep);
  const hFrac = st.hHi > 0.5 ? `${col(K.focus, "h")} = \\dfrac{330}{\\pi r^2}` : "h = \\dfrac{330}{\\pi r^2}";
  const ws = Math.round(st.workStep);
  const workTex = [
    `${col(K.body, "2\\pi r \\cdot \\dfrac{330}{\\pi r^2}")}`,
    `${col(K.body, "2\\cancel{\\pi} \\cancel{r} \\cdot \\dfrac{330}{\\cancel{\\pi}\\, r \\cancel{r}}")}`,
    `2 \\cdot 330 = 660 \\;\\Rightarrow\\; ${col(K.body, "\\dfrac{660}{r}")}`,
  ][Math.min(2, Math.max(0, ws))];

  const labels: AutoLabelItem[] = [
    { id: "legBody", phases: ["b03"], x: g.cx - g.rx, y: (g.top + BASE1) / 2, text: "thân", color: K.body, opacity: st.legend * st.bodyHi, prefer: ["w"], anchor: "region" },
    { id: "legEnds", phases: ["b03"], x: g.cx + g.rx, y: g.top, text: "nắp, đáy", color: K.ends, opacity: st.legend * st.endsHi, prefer: ["e", "ne"], anchor: "region" },
    { id: "ratio", phases: ["b01"], x: g.cx + g.rx + 34, y: (g.top + BASE1) / 2, text: "cao ≈ 2 × bề ngang", opacity: st.tRatio, prefer: ["e"], anchor: "region" },
    { id: "short", phases: ["b02"], x: gFull.cx + gFull.rx, y: gFull.top + 60, text: "không đủ 330 ml", color: K.warn, opacity: st.tShort, prefer: ["e"], anchor: "region" },
    { id: "r2", phases: ["b03"], x: g.cx, y: g.top - g.ry, text: "$r = 2$ cm → cao ≈ 26 cm", opacity: st.tR2, prefer: ["e", "ne"] },
    { id: "r7", phases: ["b03"], x: g.cx, y: g.top - g.ry, text: "$r = 7$ cm → cao ≈ 2,1 cm", opacity: st.tR7, prefer: ["n"] },
    { id: "model", phases: ["b04"], x: g.cx, y: BASE1 + g.ry, text: "mô hình: vỏ dày đều", color: colors.brandBlue, opacity: st.tModel, prefer: ["s"], anchor: "region" },
    { id: "shell", phases: ["b04"], x: g.cx - g.rx, y: (g.top + BASE1) / 2, text: "ít nhôm ⇔ diện tích vỏ $S$ nhỏ", opacity: st.tShell, prefer: ["w"], anchor: "region" },
    { id: "units", phases: ["b04"], x: g.cx + g.rx + 34, y: (g.top + BASE1) / 2, text: "$r$, $h$ tính bằng cm", opacity: st.tUnits, prefer: ["e"], anchor: "region" },
    { id: "ends", phases: ["b04"], x: g.cx - g.rx, y: g.top, text: "$2\\pi r^2$", color: K.ends, opacity: st.tEnds, prefer: ["w", "nw"] },
    { id: "body", phases: ["b04"], x: g.cx - g.rx, y: (g.top + BASE1) / 2 + 40, text: "$2\\pi r h$", color: K.body, opacity: st.tBody, prefer: ["w"], anchor: "region" },
    {
      id: "rh",
      phases: ["b05"],
      x: g.cx,
      y: g.top - g.ry,
      text: "",
      steps: ["$r = 3$ ⇒ $h \\approx 11{,}7$", "$r = 4$ ⇒ $h \\approx 6{,}6$"],
      step: st.tRHStep,
      color: K.focus,
      opacity: st.tRH,
      prefer: ["n", "ne"],
    },
  ];
  const obst: Rect[] = [canObstacle(cx, BASE1, k, r, h)];
  if (st.panel > 0) obst.push(textObstacle(P1.left, P1.top, P1.width, P1.height));
  if (st.ghost > 0) obst.push(canObstacle(cx, BASE1, K1, R_REAL));
  // vạch chiều cao + ký hiệu r, h (vẽ trong SVG, không qua AutoLabels)
  if (st.hBar > 0) obst.push({ x: g.cx + g.rx + 20, y: g.top, w: st.sym > 0 ? 80 : 28, h: BASE1 - g.top });
  if (st.sym > 0) obst.push(textObstacle(g.cx + g.rx * 0.62 - 22, g.top - g.ry - 66, 44, 54));

  return (
    <>
      <Layer>
        {/* hai lon so sánh mờ hai bên (b01) */}
        <Can cx={470} base={BASE1} k={K1} r={2.4} o={0.45 * st.side + 0.55 * st.side * st.sideHi[0]} />
        <Can cx={1450} base={BASE1} k={K1} r={5.2} o={0.45 * st.side + 0.55 * st.side * st.sideHi[2]} />
        {/* lon gốc nét đứt (b02): phần thiếu */}
        {st.ghost > 0 ? (
          <g opacity={st.ghost}>
            <path
              d={`M${gFull.cx - gFull.rx},${gFull.top} L${gFull.cx - gFull.rx},${BASE1} A${gFull.rx},${gFull.ry} 0 0 0 ${gFull.cx + gFull.rx},${BASE1} L${gFull.cx + gFull.rx},${gFull.top} Z`}
              fill={tint(K.warn, 0.14)}
            />
            <Can cx={cx} base={BASE1} k={K1} r={R_REAL} dashed stroke={K.warn} />
          </g>
        ) : null}
        <Can cx={cx} base={BASE1} k={k} r={r} h={h} water={st.water} bodyHi={st.bodyHi} endsHi={st.endsHi} shell={st.shell} o={1} />
        <CanDims cx={cx} base={BASE1} k={k} r={r} h={h} hBar={st.hBar} wBar={st.wBar} rBar={st.rBar} sym={st.sym} />
      </Layer>
      {/* nhãn 330 ml trên thân lon */}
      {st.ml > 0 ? (
        <div
          data-text="ml"
          style={{
            position: "absolute",
            left: cx,
            top: (g.top + BASE1) / 2,
            translate: "-50% -50%",
            fontFamily: fontText,
            fontWeight: 800,
            fontSize: 40,
            color: colors.text,
            whiteSpace: "nowrap",
            opacity: st.ml,
            padding: "2px 14px",
            borderRadius: 12,
            border: `3px solid ${tint(K.focus, st.mlLock)}`,
            background: tint("#FFFFFF", 0.7 * st.mlLock),
          }}
        >
          330 ml
        </div>
      ) : null}
      <AutoLabels items={labels} obstacles={obst} />
      {st.panel > 0 ? (
        <Card style={{ left: P1.left, top: P1.top, width: P1.width, height: P1.height, opacity: st.panel }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Row tex={sTex0} o={s0} y={36} />
            <Row tex={sTex1} o={s1} y={20} />
            <Row tex="V = \pi r^2 h = 330" o={v0} y={195} />
            <Row tex={hFrac} o={v1} y={180} />
            {st.note330 > 0 ? (
              <div data-text="note" style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontSize: 40, fontWeight: 600, color: colors.muted, opacity: st.note330 }}>
                330 ml = 330 cm³
              </div>
            ) : null}
            <Row tex={workTex} o={st.work} y={345} />
            {st.workNote > 0 ? (
              <div data-text="note" style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", fontSize: 40, fontWeight: 600, color: colors.text, opacity: st.workNote }}>
                <MathText text="$\pi$ và một $r$ triệt tiêu" />
              </div>
            ) : null}
          </div>
        </Card>
      ) : null}
    </>
  );
};

// ======================= CẢNH 2 — đồ thị S(r) =======================
export const SC = makeScale({ xMin: 0, xMax: 9.5, yMin: 0, yMax: 650, width: 900, height: 600 });
const PL2 = 170;
const PT2 = 205;
const XT = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const YT = [100, 200, 300, 400, 500, 600];
const R0 = 1.15;
const R1 = 9;
const P2 = { left: 1190, top: 140, width: 640 };
const CAN2 = { cx: 1510, base: 790 };

export type St2 = {
  draw: number;
  p2: number;
  p7: number;
  cEnds: number;
  cBody: number;
  sBold: number;
  trough: number;
  compDim: number;
  // b08
  canO: number;
  canR: number;
  canK: number;
  rowS: number;
  rowMoc: number;
  rPos: number;
  endsPulse: number;
  rowD: number;
  rowEq: number;
  tan: number;
  rLab: number;
  sides: number;
  // b09
  hLab: number;
  wLab: number;
  wBar: number;
  hBar: number;
  box: number;
  h2r: number;
  // b10
  recap: number;
  stepO: [number, number, number, number];
  stepFocus: number;
};

export const S2_0: St2 = {
  draw: 0,
  p2: 0,
  p7: 0,
  cEnds: 0,
  cBody: 0,
  sBold: 0,
  trough: 0,
  compDim: 1,
  canO: 1,
  canR: 4,
  canK: 13,
  rowS: 1,
  rowMoc: 0,
  rPos: 0,
  endsPulse: 0,
  rowD: 0,
  rowEq: 0,
  tan: 0,
  rLab: 0,
  sides: 0,
  hLab: 0,
  wLab: 0,
  wBar: 0,
  hBar: 0,
  box: 0,
  h2r: 0,
  recap: 0,
  stepO: [0, 0, 0, 0],
  stepFocus: 0,
};

const OBST2 = [...curveObstacles(SC, S_, R0, R1), ...axesObstacles(SC, XT, YT)];
const SMIN = S_(R_OPT);

const StepRow: React.FC<{ n: number; label: string; tex: string; o: number; focus: number; dim: boolean; y: number }> = ({ n, label, tex, o, focus, dim, y }) =>
  o <= 0 ? null : (
    <div style={{ position: "absolute", left: 28, right: 20, top: y, opacity: o * (dim ? 0.6 : 1) }}>
      <div data-text="step" style={{ fontSize: 36, fontWeight: 700, color: focus > 0.5 ? K.focus : colors.text, whiteSpace: "nowrap" }}>
        <MathText text={`${n}. ${label}`} />
      </div>
      <div data-text="formula" style={{ fontSize: 44, marginTop: 14 }}>
        <Tex tex={tex} />
      </div>
    </div>
  );

export const Scene2: React.FC<{ st: St2 }> = ({ st }) => {
  const g = canGeom(CAN2.cx, CAN2.base, st.canK, st.canR);
  const labels: AutoLabelItem[] = [
    { id: "p2", x: 2, y: S_(2), text: "$S \\approx 355$", opacity: st.p2, prefer: ["e", "ne"] },
    { id: "p7", x: 7, y: S_(7), text: "$S \\approx 402$", opacity: st.p7, prefer: ["w", "nw"] },
    { id: "ends", x: 6, y: ends(6), text: "nắp + đáy", color: K.ends, opacity: st.cEnds * st.compDim, prefer: ["se", "e"], anchor: "region" },
    { id: "body", x: 2.6, y: body(2.6), text: "thân", color: K.body, opacity: st.cBody * st.compDim, prefer: ["sw", "s"], anchor: "region" },
    { id: "rpos", x: 8.4, y: 0, text: "$r > 0$", color: K.focus, opacity: st.rPos, prefer: ["n", "ne"], anchor: "region" },
    { id: "ropt", x: R_OPT, y: 0, text: "$r \\approx 3{,}74$", color: K.focus, opacity: st.rLab, prefer: ["n"] },
  ];
  const rows = st.recap > 0;
  const stepFocusDim = (i: number) => st.stepFocus > 0.5 && i !== 1;
  return (
    <>
      <Plot scale={SC} left={PL2} top={PT2} overlay={<AutoLabels scale={SC} items={labels} obstacles={OBST2} />}>
        <Axes scale={SC} xTicks={XT} yTicks={YT} xLabel="" yLabel="diện tích vỏ S (cm²)" />
        {/* khoảng r > 0 trên trục */}
        {st.rPos > 0 ? <line x1={SC.x(0)} y1={SC.y(0)} x2={SC.x(9.5)} y2={SC.y(0)} stroke={K.focus} strokeWidth={10} opacity={0.35 * st.rPos} strokeLinecap="round" /> : null}
        {/* hai thành phần */}
        <g opacity={0.6 * st.compDim}>
          <FunctionPlot scale={SC} f={ends} from={0} to={9.6} progress={st.cEnds} color={K.ends} width={4} />
          <FunctionPlot scale={SC} f={body} from={R0} to={9.5} progress={st.cBody} color={K.body} width={4} />
        </g>
        <FunctionPlot scale={SC} f={S_} from={R0} to={R1} progress={st.draw} width={6 + 3 * st.sBold} />
        {/* bên trái đáy: giảm, bên phải: tăng */}
        {st.sides > 0 ? (
          <g opacity={st.sides}>
            <FunctionPlot scale={SC} f={S_} from={R0} to={R_OPT} color={K.down} width={8} />
            <FunctionPlot scale={SC} f={S_} from={R_OPT} to={R1} color={K.up} width={8} />
          </g>
        ) : null}
        {/* hai đầu vọt lên */}
        {st.endsPulse > 0 ? (
          <g opacity={st.endsPulse}>
            <FunctionPlot scale={SC} f={S_} from={R0} to={1.9} color={K.focus} width={11} />
            <FunctionPlot scale={SC} f={S_} from={8} to={R1} color={K.focus} width={11} />
          </g>
        ) : null}
        <EndArrow s={SC} fn={S_} dfn={dS} x={R0} dir={-1} color={K.focus} o={st.endsPulse} />
        <EndArrow s={SC} fn={S_} dfn={dS} x={R1} dir={1} color={K.focus} o={st.endsPulse} />
        {st.trough > 0 ? <ellipse cx={SC.x(R_OPT)} cy={SC.y(SMIN)} rx={110} ry={40} fill={tint(K.focus, 0.22 * st.trough)} /> : null}
        {st.tan > 0 ? (
          <g opacity={st.tan}>
            <Segment scale={SC} x1={R_OPT - 1.1} y1={SMIN} x2={R_OPT + 1.1} y2={SMIN} color={K.focus} width={5} />
            <Segment scale={SC} x1={R_OPT} y1={SMIN} x2={R_OPT} y2={0} color={K.focus} width={3} dashed />
          </g>
        ) : null}
        <Segment scale={SC} x1={2} y1={S_(2)} x2={2} y2={0} color={K.focus} width={3} dashed opacity={st.p2} />
        <Segment scale={SC} x1={7} y1={S_(7)} x2={7} y2={0} color={K.focus} width={3} dashed opacity={st.p7} />
        <Point scale={SC} x={2} y={S_(2)} color={K.focus} opacity={st.p2} />
        <Point scale={SC} x={7} y={S_(7)} color={K.focus} opacity={st.p7} />
        <Point scale={SC} x={R_OPT} y={SMIN} color={K.focus} opacity={Math.max(st.tan, st.recap * st.stepO[3])} />
      </Plot>
      {/* tên trục ngang, dưới các số vạch chia */}
      <Tag x={PL2 + SC.x(4.75)} y={PT2 + SC.height + 60} name="axis" color={colors.text}>
        <MathText text="bán kính $r$ (cm)" />
      </Tag>
      {/* thẻ công thức */}
      <Card style={{ left: P2.left, top: P2.top, width: P2.width, height: rows ? 670 : st.rowEq > 0 || st.rowD > 0 || st.rowMoc > 0 ? 540 : st.h2r > 0 || st.hLab > 0 ? 300 : 150 }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {!rows ? (
            <>
              <Row tex={`S(r) = ${col(K.ends, "2\\pi r^2")} + ${col(K.body, "\\dfrac{660}{r}")}`} o={st.rowS} y={16} size={50} />
              {st.rowMoc > 0 ? (
                <div data-text="note" style={{ position: "absolute", left: 30, right: 30, top: 150, textAlign: "center", fontSize: 38, fontWeight: 700, opacity: st.rowMoc, color: colors.text }}>
                  <MathText text="thấp nhất ở bên trong ⇒ $S' = 0$" />
                </div>
              ) : null}
              <Row tex="S'(r) = 4\pi r - \dfrac{660}{r^2}" o={st.rowD} y={270} size={46} />
              <Row tex="4\pi r = \dfrac{660}{r^2} \;\Rightarrow\; r^3 = \dfrac{165}{\pi}" o={st.rowEq} y={405} size={44} />
              <Row tex="h = \dfrac{330}{\pi \cdot 3{,}74^2} \approx 7{,}5" o={st.hLab} y={160} size={46} color={K.focus} />
            </>
          ) : (
            <>
              <StepRow n={1} label="thứ cần nhỏ nhất" tex="S = 2\pi r^2 + 2\pi r h" o={st.recap * st.stepO[0]} focus={0} dim={stepFocusDim(0)} y={16} />
              <StepRow n={2} label="điều kiện cố định ⇒ một biến" tex="h = \dfrac{330}{\pi r^2}" o={st.recap * st.stepO[1]} focus={st.stepFocus} dim={stepFocusDim(1)} y={160} />
              <StepRow n={3} label="biến chạy trong khoảng nào" tex="r > 0" o={st.recap * st.stepO[2]} focus={0} dim={stepFocusDim(2)} y={355} />
              <StepRow n={4} label="đạo hàm tìm nhỏ nhất" tex="S' = 0 \Rightarrow r \approx 3{,}74" o={st.recap * st.stepO[3]} focus={0} dim={stepFocusDim(3)} y={505} />
            </>
          )}
        </div>
      </Card>
      {/* lon do bán kính điều khiển */}
      <Layer>
        <Can cx={CAN2.cx} base={CAN2.base} k={st.canK} r={st.canR} o={st.canO} />
        {st.canO > 0 ? (
          <g opacity={st.canO}>
            <CanDims cx={CAN2.cx} base={CAN2.base} k={st.canK} r={st.canR} hBar={st.hBar} wBar={st.wBar} />
          </g>
        ) : null}
        {st.box > 0 ? (
          <rect x={g.cx - g.rx - 14} y={g.top - 14} width={2 * g.rx + 28} height={g.base - g.top + 28} fill="none" stroke={K.focus} strokeWidth={4} strokeDasharray="12 10" opacity={st.box * st.canO} />
        ) : null}
      </Layer>
      {st.canO > 0 ? (
        <AutoLabels
          items={[
            { id: "h75", x: g.cx + g.rx + 34, y: (g.top + g.base) / 2, text: "cao ≈ 7,5 cm", opacity: st.canO * st.hBar * (st.hLab > 0 ? 1 : 0), prefer: ["e"], anchor: "region" },
            { id: "w75", x: g.cx, y: g.base + g.ry + 26, text: "ngang ≈ 7,5 cm", opacity: st.canO * st.wLab, prefer: ["s"], anchor: "region" },
            { id: "h2r", x: g.cx - g.rx, y: (g.top + g.base) / 2, text: "$h = 2r$", color: K.focus, opacity: st.canO * st.h2r, prefer: ["w"], anchor: "region" },
          ]}
          obstacles={[canObstacle(CAN2.cx, CAN2.base, st.canK, st.canR), { x: g.cx - g.rx - 20, y: g.top - 20, w: 2 * g.rx + 40, h: g.base - g.top + 40 }, textObstacle(P2.left, P2.top, P2.width, 300)]}
          bounds={{ x: 1100, y: 440, w: 820, h: 560 }}
        />
      ) : null}
    </>
  );
};

// ======================= CẢNH 3 — so sánh lon / cốc / lon thật =======================
const K3 = 40;
const BASE3 = 640;
const CANL = 560;
const CANR = 1360;

export type St3 = {
  canL: number;
  canLBars: number;
  canLBadge: number;
  cup: number;
  cupR: number;
  cupHi: number;
  rowA: number;
  rowAStep: number;
  rowB: number;
  tCup: number;
  tR: number;
  hEq: number;
  // b12
  fade: number;
  real: number;
  realThick: number;
  arrow: number;
  tAns: number;
  tThick: number;
};

export const S3_0: St3 = {
  canL: 1,
  canLBars: 1,
  canLBadge: 1,
  cup: 0,
  cupR: 3.5,
  cupHi: 0,
  rowA: 0,
  rowAStep: 0,
  rowB: 0,
  tCup: 0,
  tR: 0,
  hEq: 0,
  fade: 0,
  real: 0,
  realThick: 0,
  arrow: 0,
  tAns: 0,
  tThick: 0,
};

export const Scene3: React.FC<{ st: St3 }> = ({ st }) => {
  const gL = canGeom(CANL, BASE3, K3, R_OPT);
  // cốc cũng 330 ml: h = 330/(πr²)
  const cupH = hOf(st.cupR);
  const gCup = canGeom(CANR, BASE3, K3, st.cupR, cupH);
  const gR = canGeom(CANR, BASE3, K3, R_REAL);
  const cupO = st.cup * (1 - st.fade);
  const [a0, a1] = cross(st.rowA, st.rowA, st.rowAStep);
  const labels: AutoLabelItem[] = [
    { id: "badge", phases: ["b11"], x: CANL, y: gL.top - gL.ry, text: "lon có nắp", color: colors.muted, opacity: st.canLBadge * (1 - st.fade), prefer: ["n"] },
    { id: "cup", phases: ["b11"], x: CANR - gCup.rx, y: (gCup.top + BASE3) / 2, text: "không nắp, 330 ml", opacity: st.tCup * (1 - st.fade), prefer: ["w", "nw"], anchor: "region" },
    { id: "rcup", phases: ["b11"], x: CANR + gCup.rx / 2, y: gCup.top, text: "$S' = 0$ ⇒ $r \\approx 4{,}72$", color: K.focus, opacity: st.tR * (1 - st.fade), prefer: ["ne", "n"] },
    { id: "hcup", phases: ["b11"], x: CANR + gCup.rx + 34, y: (gCup.top + BASE3) / 2, text: "$h = r$", color: K.focus, opacity: st.hEq * (1 - st.fade), prefer: ["e"], anchor: "region" },
    { id: "hcan", phases: ["b11"], x: CANL + gL.rx + 34, y: (gL.top + BASE3) / 2, text: "$h = 2r$", color: K.focus, opacity: st.hEq * (1 - st.fade), prefer: ["e"], anchor: "region" },
    { id: "ans", phases: ["b12"], x: CANL, y: BASE3 + gL.ry + 26, text: "cao = ngang ≈ 7,5 cm", color: K.focus, opacity: st.tAns, prefer: ["s"], anchor: "region" },
    { id: "real", phases: ["b12"], x: CANR, y: BASE3 + gR.ry + 10, text: "lon thật", color: colors.muted, opacity: st.real, prefer: ["s"], anchor: "region" },
    { id: "thick", phases: ["b12"], x: CANR + gR.rx + 10, y: gR.top + 50, text: "nắp, đáy dày hơn thân", color: K.ends, opacity: st.tThick, prefer: ["e", "ne"] },
  ];
  const obst: Rect[] = [canObstacle(CANL, BASE3, K3, R_OPT)];
  if (cupO > 0) obst.push(canObstacle(CANR, BASE3, K3, st.cupR, cupH));
  if (st.real > 0) obst.push(canObstacle(CANR, BASE3, K3, R_REAL));
  if ((a0 + a1 + st.rowB) * (1 - st.fade) > 0) obst.push(textObstacle(CANR - 330, 700, 660, 220));
  // mũi tên từ lon vuông sang lon thật
  const ax0 = CANL + gL.rx + 60;
  const ax1 = CANR - gR.rx - 40;
  const ay = BASE3 - 150;
  const ap = st.arrow;
  return (
    <>
      <Layer>
        <Can cx={CANL} base={BASE3} k={K3} r={R_OPT} o={st.canL} />
        <CanDims cx={CANL} base={BASE3} k={K3} r={R_OPT} hBar={st.canLBars} rBar={st.canLBars * (1 - st.fade)} wBar={st.tAns} hColor={st.tAns > 0 ? K.focus : colors.text} wColor={K.focus} />
        <Can cx={CANR} base={BASE3} k={K3} r={st.cupR} h={cupH} lid={false} o={cupO} bodyHi={st.cupHi} endsHi={st.cupHi} />
        {cupO > 0 ? (
          <g opacity={cupO}>
            <CanDims cx={CANR} base={BASE3} k={K3} r={st.cupR} h={cupH} hBar={1} rBar={1} hColor={st.hEq > 0.5 ? K.focus : colors.text} />
          </g>
        ) : null}
        <Can cx={CANR} base={BASE3} k={K3} r={R_REAL} o={st.real} thick={st.realThick} endsHi={st.realThick} />
        {ap > 0 ? (
          <g opacity={Math.min(1, ap * 2)}>
            <path d={`M${ax0},${ay} Q${(ax0 + ax1) / 2},${ay - 120} ${lerp(ax0, ax1, Math.min(1, ap))},${ay}`} fill="none" stroke={K.focus} strokeWidth={6} strokeLinecap="round" />
            {ap >= 1 ? <polygon data-mark="arrow" points={`${ax1 + 6},${ay + 6} ${ax1 - 22},${ay - 4} ${ax1 - 6},${ay - 26}`} fill={K.focus} /> : null}
          </g>
        ) : null}
      </Layer>
      <AutoLabels items={labels} obstacles={obst} />
      {/* công thức dưới cốc */}
      <div style={{ position: "absolute", left: CANR - 330, width: 660, top: 700, height: 220, opacity: 1 - st.fade, fontFamily: fontText }}>
        <Row tex={`S = ${col(K.ends, "\\pi r^2")} + ${col(K.body, "2\\pi r h")}`} o={a0} y={0} size={52} />
        <Row tex={`S(r) = ${col(K.ends, "\\pi r^2")} + ${col(K.body, "\\dfrac{660}{r}")}`} o={a1} y={0} size={52} />
        {st.rowB > 0 ? (
          <div data-text="formula" style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontSize: 48, opacity: st.rowB, textShadow: halo() }}>
            <Tex tex="r > 0" />
          </div>
        ) : null}
      </div>
    </>
  );
};
