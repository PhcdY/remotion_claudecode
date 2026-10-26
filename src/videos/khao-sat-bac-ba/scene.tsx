import React from "react";
import { CalcTable } from "../../components/CalcTable";
import { Card } from "../../components/Card";
import { AutoLabelItem, AutoLabels, Rect, axesObstacles, curveObstacles, segmentObstacles } from "../../components/labels";
import { MathText, Tex } from "../../components/MathText";
import { Tag, lerp } from "../../components/parts";
import { Axes, EndArrow, FunctionPlot, Plot, Point, Scale, makeScale } from "../../components/plot";
import { role } from "../../components/roles";
import { colors, fontText, halo, tint } from "../../components/theme";

// ---------------- Hàm của video ----------------
/** Ví dụ xuyên suốt: f(x) = 4x³ − 12x² + 9x + 1 (đỉnh (0,5; 3), đáy (1,5; 1), qua (0; 1), (1; 2), (2; 3)). */
export const f = (x: number) => 4 * x ** 3 - 12 * x ** 2 + 9 * x + 1;
export const df = (x: number) => 12 * x ** 2 - 24 * x + 9;
/** Đồ thị so sánh trong đề thi: g = −f (a < 0, d < 0). */
export const g = (x: number) => -f(x);
export const dg = (x: number) => -df(x);

/** Nghiệm của fn(x) = y trên [a, b] (chia đôi; fn đơn điệu trên đoạn). */
const solve = (fn: (x: number) => number, y: number, a: number, b: number) => {
  let lo = a;
  let hi = b;
  const up = fn(b) > fn(a);
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (fn(m) < y === up) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
};

// Chỗ nhấp nhô giả định (b04): chỉ là hình minh hoạ, không theo công thức.
const BUMP_C = 1.1;
const BUMP_W = 0.1;
const BUMP_H = 0.95;
export const bumpF = (x: number) => f(x) + BUMP_H * Math.exp(-(((x - BUMP_C) / BUMP_W) ** 2));
/** Đáy nhỏ của chỗ nhấp nhô giả định. */
export const DIP_X = (() => {
  let best = 0.9;
  for (let x = 0.9; x <= BUMP_C; x += 0.0005) if (bumpF(x) < bumpF(best)) best = x;
  return best;
})();

/** Màu theo vai trò, giữ nguyên nghĩa suốt video. */
export const K = {
  main: role.main,
  focus: role.focus,
  up: role.up,
  down: role.down,
  warn: role.warn,
  dim: role.dim,
};

export { clamp01, pulse } from "../../components/parts";
import { clamp01 } from "../../components/parts";

// ---------------- Bố cục CẢNH 1 ----------------
const X_MIN = -0.5;
const X_MAX = 2.5;
const PL = 880;
const PW = 900;
const ONE = { top: 215, h: 650 };
const TWO_F = { top: 170, h: 420 };
const TWO_D = { top: 665, h: 230 };
const XT = [0.5, 1, 1.5, 2];
const XT_HIDE = [0.5, 1.5];
const YT = [1, 2, 3, 4];

export const scaleTop = (tier: number): { s: Scale; top: number } => {
  const top = lerp(ONE.top, TWO_F.top, tier);
  const h = lerp(ONE.h, TWO_F.h, tier);
  return { s: makeScale({ xMin: X_MIN, xMax: X_MAX, yMin: lerp(-1, -1.7, tier), yMax: 5, width: PW, height: h }), top };
};
export const scaleBot = makeScale({ xMin: X_MIN, xMax: X_MAX, yMin: -4, yMax: 8, width: PW, height: TWO_D.h });

/** Chỗ đồ thị f ra khỏi khung (y = 5 bên phải, y = −1 bên trái). */
export const X_EXIT_R = solve(f, 5, 1.5, 2.5);
export const X_EXIT_L = solve(f, -1, -0.5, 0.4);

const PIECES: [number, number][] = [
  [X_MIN, 0.5],
  [0.5, 1.5],
  [1.5, X_MAX],
];

/** Đồ thị chia ba khúc theo chiều (lên, xuống, lên), mỗi khúc có màu riêng. */
const Pieces: React.FC<{
  s: Scale;
  fn: (x: number) => number;
  prog: number;
  colors: [string, string, string];
  o: number;
  width?: number;
  dashed?: boolean;
}> = ({ s, fn, prog, colors: cs, o, width = 7 }) => {
  if (o <= 0 || prog <= 0) return null;
  const end = X_MIN + (X_MAX - X_MIN) * prog;
  return (
    <g opacity={o}>
      {PIECES.map(([a, b], i) =>
        end > a ? <FunctionPlot key={i} scale={s} f={fn} from={a} to={Math.min(b, end)} color={cs[i]} width={width} samples={160} /> : null,
      )}
    </g>
  );
};

// ---------------- Trạng thái CẢNH 1 ----------------
export type S1 = Partial<{
  /** 0: một hệ trục lớn; 1: hai tầng f / f' */
  tier: number;
  tableO: number;
  /** độ mờ 5 hàng bảng giá trị: x = 0, 1, 2, 0,5, 1,5 */
  rows: number[];
  /** ba điểm ban đầu */
  pts: number;
  line: number;
  q1: number;
  tick05: number;
  guessUp: number;
  guessDown: number;
  p05: number;
  p15: number;
  /** nhấp sáng đỉnh và đáy */
  peakGlow: number;
  dense: number;
  curve: number;
  curveProg: number;
  /** đường cong mờ (màu dim) — b11 */
  curveDim: number;
  midFocus: number;
  colorMid: number;
  colorOut: number;
  /** ≥ 0: vẽ lại đồ thị có màu từng khúc (b05, b11) */
  redraw: number;
  gapQ: number;
  /** quét sáng dọc đồ thị (b08: liền một nét) */
  sweep: number;
  recall: number;
  fpFormula: number;
  fpGlow: number;
  fp: number;
  fpProg: number;
  zeros: number;
  vlines: number;
  fpMid: number;
  fpOut: number;
  bump: number;
  dip: number;
  dipQ: number;
  dipCross: number;
  proj: number;
  /** nhãn "giả sử có" */
  giaSu: number;
  arrowR: number;
  arrowL: number;
  endFocus: number;
  endQ: number;
  formula: number;
  braceA: number;
  braceB: number;
  braceStep: number;
  ratio: number;
  coefGlow: number;
  aLabel: number;
  restDim: number;
  dGlow: number;
  dLabel: number;
  /** dòng chú giải dạng chung ax³ + bx² + cx + d */
  general: number;
  yInt: number;
  scheme: number;
  /** bước đang sáng trong sơ đồ: 1, 2, 3 (0 = chưa) */
  schemeStep: number;
  dR: number;
  mini: number;
  thang: number;
  /** nhãn hai điểm thêm: 0 f(0,5) = 3 · 1 đỉnh · 2 đỉnh cao 3 */
  extraStep: number;
  extraLabel: number;
  zerosLabel: number;
}>;

const v = (x: number | undefined) => x ?? 0;

export const Scene1: React.FC<{ st: S1 }> = ({ st }) => {
  const tier = v(st.tier);
  const { s: sT, top: tT } = scaleTop(tier);
  const sB = scaleBot;
  const fpO = v(st.fp) * tier;
  const curveColorOut = st.colorOut ? K.up : K.main;
  // ---- nhãn tầng trên ----
  const items: AutoLabelItem[] = [
    { id: "l05", x: 0.5, y: 3, text: ["$f(0{,}5) = 3$", "đỉnh", "đỉnh cao 3"][Math.round(v(st.extraStep))], color: K.focus, size: 44, weight: 700, opacity: v(st.extraLabel), prefer: ["n", "ne", "nw"] },
    { id: "l15", x: 1.5, y: 1, text: ["$f(1{,}5) = 1$", "đáy", "đáy cao 1"][Math.round(v(st.extraStep))], color: K.focus, size: 44, weight: 700, opacity: v(st.extraLabel), prefer: ["s", "se", "sw"] },
    { id: "thang", x: 2.3, y: 3.3, text: "thẳng hàng", color: colors.muted, size: 44, weight: 700, opacity: v(st.thang), prefer: ["nw", "w", "n"], anchor: "region" },
    { id: "giasu", x: BUMP_C + 0.06, y: bumpF(BUMP_C + 0.06), text: "giả sử có", color: K.warn, size: 44, weight: 700, opacity: v(st.giaSu), prefer: ["ne", "e", "n"], anchor: "region" },
    { id: "dipq", x: DIP_X, y: bumpF(DIP_X), text: "$f' = 0$?", color: K.warn, size: 44, weight: 700, opacity: v(st.dipQ), prefer: ["sw", "s", "w"] },
  ];
  const obstT: Rect[] = [...curveObstacles(sT, f, X_MIN, X_MAX), ...axesObstacles(sT, XT, YT)];
  if (v(st.line) > 0.05) obstT.push(...segmentObstacles(sT.x(-0.5), sT.y(0.5), sT.x(2.5), sT.y(3.5)));
  const itemsB: AutoLabelItem[] = [
    { id: "zeros", x: 1, y: 0, text: "$0{,}5$ và $1{,}5$", color: K.focus, size: 44, weight: 700, opacity: v(st.zerosLabel) * fpO, prefer: ["s"], anchor: "region" },
    { id: "fpneg", x: DIP_X, y: df(DIP_X), text: "$f' < 0$", color: K.down, size: 44, weight: 700, opacity: v(st.proj) * fpO, prefer: ["e", "se", "ne"] },
  ];
  const obstB: Rect[] = [...curveObstacles(sB, df, X_MIN, X_MAX), ...axesObstacles(sB, XT, [])];
  // ---- toạ độ trang cho đường nối hai tầng ----
  const pgT = (x: number, y: number) => ({ x: PL + sT.x(x), y: tT + sT.y(y) });
  const pgB = (x: number, y: number) => ({ x: PL + sB.x(x), y: TWO_D.top + sB.y(y) });
  const dense = [] as number[];
  for (let i = 0; i <= 21; i++) dense.push(i / 10);
  const redraw = st.redraw ?? -1;
  const glowMid = v(st.midFocus);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <FormulaColumn st={st} />
      {/* tầng trên: đồ thị f */}
      <Plot scale={sT} left={PL} top={tT} overlay={<AutoLabels scale={sT} items={items} obstacles={obstT} />}>
        <Axes scale={sT} xTicks={XT} yTicks={YT} hideXLabels={XT_HIDE} xLabel="x" yLabel="y" />
        {/* vùng đoán trên / dưới đường thẳng tại x = 0,5 */}
        {v(st.guessUp) > 0 ? (
          <rect x={sT.x(0.5) - 26} y={sT.y(4.6)} width={52} height={sT.y(1.62) - sT.y(4.6)} rx={14} fill={tint(K.focus, 0.18)} opacity={st.guessUp} />
        ) : null}
        {v(st.guessDown) > 0 ? (
          <rect x={sT.x(0.5) - 26} y={sT.y(1.38)} width={52} height={sT.y(-0.8) - sT.y(1.38)} rx={14} fill={tint(K.focus, 0.18)} opacity={st.guessDown} />
        ) : null}
        {v(st.tick05) > 0 ? (
          <g opacity={st.tick05}>
            <line x1={sT.x(0.5)} x2={sT.x(0.5)} y1={sT.y(0) - 14} y2={sT.y(0) + 14} stroke={K.focus} strokeWidth={6} strokeLinecap="round" />
            <text data-text="tick" x={sT.x(0.5)} y={sT.y(0) + 40} textAnchor="middle" fontFamily={fontText} fontSize={30} fontWeight={700} fill={K.focus} stroke={colors.bg} strokeWidth={7} paintOrder="stroke">
              0,5
            </text>
          </g>
        ) : null}
        {v(st.line) > 0 ? (
          <line x1={sT.x(-0.5)} y1={sT.y(0.5)} x2={sT.x(2.5)} y2={sT.y(3.5)} stroke={K.main} strokeWidth={4} strokeDasharray="14 12" opacity={0.75 * v(st.line)} />
        ) : null}
        {/* đường cong thật */}
        {glowMid > 0 ? <FunctionPlot scale={sT} f={f} from={0.5} to={1.5} color={tint(K.focus, 0.35)} width={20} opacity={glowMid} /> : null}
        {v(st.curveDim) > 0 ? <FunctionPlot scale={sT} f={f} color={K.dim} width={5} opacity={st.curveDim} /> : null}
        {redraw < 0 ? (
          <>
            <Pieces s={sT} fn={f} prog={v(st.curveProg)} colors={[K.main, K.main, K.main]} o={v(st.curve)} />
            <Pieces
              s={sT}
              fn={f}
              prog={v(st.curveProg)}
              colors={[curveColorOut, st.colorMid ? K.down : "transparent", curveColorOut]}
              o={v(st.curve) * Math.max(v(st.colorOut), v(st.colorMid))}
            />
          </>
        ) : (
          <Pieces s={sT} fn={f} prog={redraw} colors={[K.up, K.down, K.up]} o={1} />
        )}
        {v(st.sweep) > 0 && v(st.sweep) < 1 ? (
          <FunctionPlot scale={sT} f={f} from={X_MIN + (X_MAX - X_MIN) * Math.max(0, v(st.sweep) - 0.12)} to={X_MIN + (X_MAX - X_MIN) * v(st.sweep)} color={tint(K.focus, 0.55)} width={18} />
        ) : null}
        {/* chỗ nhấp nhô giả định */}
        {v(st.bump) > 0 ? (
          <path
            d={Array.from({ length: 121 }, (_, i) => 0.84 + (0.62 * i) / 120)
              .map((x, i) => `${i ? "L" : "M"}${sT.x(x).toFixed(1)},${sT.y(bumpF(x)).toFixed(1)}`)
              .join(" ")}
            fill="none"
            stroke={K.warn}
            strokeWidth={6}
            strokeDasharray="12 9"
            strokeLinecap="round"
            opacity={st.bump}
          />
        ) : null}
        {v(st.dip) > 0 ? <circle data-mark="point" cx={sT.x(DIP_X)} cy={sT.y(bumpF(DIP_X))} r={11} fill={K.warn} stroke={colors.bg} strokeWidth={4} opacity={st.dip} /> : null}
        {/* điểm dày */}
        {v(st.dense) > 0
          ? dense.map((x) => <circle key={x} data-mark="dot" cx={sT.x(x)} cy={sT.y(f(x))} r={6.5} fill={colors.text} opacity={0.9 * v(st.dense)} />)
          : null}
        {v(st.gapQ) > 0 ? (
          <ellipse cx={sT.x(1.25)} cy={sT.y(f(1.25))} rx={26} ry={26} fill="none" stroke={K.warn} strokeWidth={5} opacity={st.gapQ} />
        ) : null}
        {/* ba điểm ban đầu */}
        {[0, 1, 2].map((x) => (
          <Point key={x} scale={sT} x={x} y={f(x)} color={K.main} opacity={v(st.pts)} />
        ))}
        {/* hai điểm thêm: đỉnh, đáy */}
        {v(st.peakGlow) > 0
          ? [0.5, 1.5].map((x) => <circle key={x} cx={sT.x(x)} cy={sT.y(f(x))} r={26} fill={tint(K.focus, 0.25)} opacity={st.peakGlow} />)
          : null}
        <Point scale={sT} x={0.5} y={3} color={K.focus} opacity={v(st.p05)} />
        <Point scale={sT} x={1.5} y={1} color={K.focus} opacity={v(st.p15)} />
        {/* giao với trục tung */}
        {v(st.yInt) > 0 ? (
          <>
            <circle cx={sT.x(0)} cy={sT.y(1)} r={24} fill="none" stroke={K.focus} strokeWidth={5} opacity={st.yInt} />
            <Point scale={sT} x={0} y={1} color={K.focus} opacity={st.yInt} />
          </>
        ) : null}
        {/* hai đầu */}
        <EndArrow s={sT} fn={f} dfn={df} x={X_EXIT_R} dir={1} color={v(st.endFocus) > 0.5 ? K.focus : K.up} o={v(st.arrowR)} />
        <EndArrow s={sT} fn={f} dfn={df} x={X_EXIT_L} dir={-1} color={v(st.endFocus) > 0.5 ? K.focus : K.up} o={v(st.arrowL)} />
        {v(st.endFocus) > 0 ? (
          <>
            <FunctionPlot scale={sT} f={f} from={1.95} to={X_MAX} color={tint(K.focus, 0.4)} width={20} opacity={st.endFocus} />
            {v(st.arrowL) > 0 ? <FunctionPlot scale={sT} f={f} from={X_MIN} to={0.05} color={tint(K.focus, 0.4)} width={20} opacity={st.endFocus} /> : null}
          </>
        ) : null}
      </Plot>
      {/* dấu ? (chữ HTML để có halo) */}
      {v(st.q1) > 0
        ? [
            [0.5, 2.25],
            [1.5, 3.25],
          ].map(([x, y]) => (
            <Tag key={x} x={PL + sT.x(x)} y={tT + sT.y(y) - 44} color={K.warn} size={72} weight={800} opacity={st.q1} name="q">
              ?
            </Tag>
          ))
        : null}
      {v(st.gapQ) > 0 ? (
        <Tag x={PL + sT.x(1.25) + 40} y={tT + sT.y(f(1.25)) - 92} color={K.warn} size={60} weight={800} opacity={st.gapQ} name="q">
          ?
        </Tag>
      ) : null}
      {v(st.endQ) > 0 ? (
        <Tag x={PL + sT.x(X_EXIT_R) + 60} y={tT + sT.y(5) - 10} color={K.warn} size={64} weight={800} opacity={st.endQ} name="q">
          ?
        </Tag>
      ) : null}
      {/* tầng dưới: đồ thị f' */}
      {fpO > 0 ? (
        <Plot scale={sB} left={PL} top={TWO_D.top} style={{ opacity: fpO }} overlay={<AutoLabels scale={sB} items={itemsB} obstacles={obstB} />}>
          <Axes scale={sB} xTicks={XT} yTicks={[]} hideXLabels={XT_HIDE} xLabel="x" yLabel="y = f′(x)" />
          <FunctionPlot scale={sB} f={df} from={X_MIN} to={X_MAX} progress={v(st.fpProg)} color={K.main} width={6} />
          {v(st.fpMid) > 0 ? <FunctionPlot scale={sB} f={df} from={0.5} to={1.5} color={K.down} width={7} opacity={st.fpMid} /> : null}
          {v(st.fpOut) > 0 ? (
            <>
              <FunctionPlot scale={sB} f={df} from={X_MIN} to={0.5} color={K.up} width={7} opacity={st.fpOut} />
              <FunctionPlot scale={sB} f={df} from={1.5} to={X_MAX} color={K.up} width={7} opacity={st.fpOut} />
            </>
          ) : null}
          <Point scale={sB} x={0.5} y={0} color={K.focus} opacity={v(st.zeros)} />
          <Point scale={sB} x={1.5} y={0} color={K.focus} opacity={v(st.zeros)} />
          {v(st.proj) > 0 ? <Point scale={sB} x={DIP_X} y={df(DIP_X)} color={K.down} opacity={st.proj} /> : null}
        </Plot>
      ) : null}
      {/* đường nối hai tầng (toạ độ trang) */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
        {v(st.vlines) * fpO > 0
          ? [
              [0.5, 3],
              [1.5, 1],
            ].map(([x, y]) => {
              const a = pgB(x, 0);
              const b = pgT(x, y);
              const k = clamp01(v(st.vlines));
              return <line key={x} x1={a.x} y1={a.y - 14} x2={a.x} y2={lerp(a.y - 14, b.y + 14, k)} stroke={K.focus} strokeWidth={3} strokeDasharray="10 9" opacity={fpO} />;
            })
          : null}
        {v(st.proj) * fpO > 0 ? (
          (() => {
            const a = pgT(DIP_X, bumpF(DIP_X));
            const b = pgB(DIP_X, df(DIP_X));
            return <line x1={a.x} y1={a.y + 14} x2={a.x} y2={lerp(a.y + 14, b.y - 14, clamp01(v(st.proj)))} stroke={K.warn} strokeWidth={3} strokeDasharray="8 8" opacity={fpO} />;
          })()
        ) : null}
      </svg>
      {v(st.dipCross) > 0 ? <DipCross st={st} sT={sT} tT={tT} /> : null}
      <MiniRecip o={v(st.mini)} />
    </div>
  );
};

/** Gạch chéo nhãn "f' = 0?" khi thấy mâu thuẫn (b04). Vị trí lấy từ nhãn do AutoLabels đặt. */
const DipCross: React.FC<{ st: S1; sT: Scale; tT: number }> = ({ st, sT, tT }) => {
  // nhãn "f' = 0?" nằm phía tây-nam chấm đáy giả định (prefer sw); gạch chéo một dấu X lớn ngay trên chấm
  const cx = PL + sT.x(DIP_X);
  const cy = tT + sT.y(bumpF(DIP_X));
  const r = 26;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g stroke={K.warn} strokeWidth={8} strokeLinecap="round" opacity={v(st.dipCross)}>
        <line x1={cx - r} y1={cy - r} x2={cx + r} y2={cy + r} />
        <line x1={cx - r} y1={cy + r} x2={cx + r} y2={cy - r} />
      </g>
    </svg>
  );
};

/** Hình nhỏ: hai nhánh của y = 1/x, chỗ đứt tại 0 (b08, để dành bài sau). */
const MINI = { left: 110, top: 790, w: 300, h: 135 };
const MiniRecip: React.FC<{ o: number }> = ({ o }) => {
  if (o <= 0) return null;
  const s = makeScale({ xMin: -3, xMax: 3, yMin: -3, yMax: 3, width: MINI.w, height: MINI.h });
  return (
    <div data-box style={{ position: "absolute", left: MINI.left, top: MINI.top, width: MINI.w, height: MINI.h, opacity: o }}>
      <svg width={MINI.w} height={MINI.h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <line x1={0} x2={MINI.w} y1={s.y(0)} y2={s.y(0)} stroke={colors.axis} strokeWidth={2} />
        <line x1={s.x(0)} x2={s.x(0)} y1={0} y2={MINI.h} stroke={colors.axis} strokeWidth={2} />
        <FunctionPlot scale={s} f={(x) => 1 / x} from={-3} to={-0.34} color={K.main} width={5} />
        <FunctionPlot scale={s} f={(x) => 1 / x} from={0.34} to={3} color={K.main} width={5} />
        <ellipse cx={s.x(0)} cy={s.y(0)} rx={26} ry={MINI.h / 2 - 6} fill="none" stroke={K.warn} strokeWidth={4} strokeDasharray="8 6" />
      </svg>
    </div>
  );
};

// ---------------- Cột trái: công thức, bảng giá trị, sơ đồ ----------------
const COL = { left: 100, w: 600 };
const F_TOP = 150;
const FS_F = 54;

const Piece: React.FC<{ tex: string; o?: number; color?: string; bg?: number; children?: React.ReactNode }> = ({ tex, o = 1, color, bg = 0, children }) => (
  <span
    style={{
      position: "relative",
      display: "inline-block",
      opacity: o,
      color,
      background: bg > 0 ? tint(K.focus, 0.16 * bg) : undefined,
      borderRadius: 10,
      padding: bg > 0 ? "0 4px" : 0,
    }}
  >
    <Tex tex={tex} />
    {children}
  </span>
);

/** Ngoặc dưới một cụm của công thức, kèm giá trị. */
const Brace: React.FC<{ o: number; color: string; steps: string[]; step: number }> = ({ o, color, steps, step }) =>
  o <= 0 ? null : (
    <>
      <span
        style={{
          position: "absolute",
          left: 4,
          right: 4,
          top: "100%",
          marginTop: 6,
          height: 18,
          border: `4px solid ${color}`,
          borderTop: "none",
          borderRadius: "0 0 12px 12px",
          opacity: o,
        }}
      />
      {steps.map((t, i) => {
        const k = clamp01(1 - Math.abs(step - i)) * o;
        return k > 0 ? (
          <span
            key={i}
            data-text="label"
            style={{
              position: "absolute",
              left: "50%",
              top: "100%",
              marginTop: 34,
              translate: "-50% 0",
              whiteSpace: "nowrap",
              fontSize: 44,
              fontWeight: 700,
              color,
              opacity: k,
            }}
          >
            <MathText text={t} />
          </span>
        ) : null;
      })}
    </>
  );

/** Nhãn ngay dưới một cụm (hệ số a, d). */
const Under: React.FC<{ o: number; text: string; color: string }> = ({ o, text, color }) =>
  o <= 0 ? null : (
    <span
      data-text="label"
      style={{ position: "absolute", left: "50%", top: "100%", marginTop: 14, translate: "-50% 0", whiteSpace: "nowrap", fontSize: 44, fontWeight: 700, color, opacity: o }}
    >
      <MathText text={text} />
    </span>
  );

const FormulaColumn: React.FC<{ st: S1 }> = ({ st }) => {
  const rest = 1 - 0.7 * v(st.restDim);
  const rowsO = st.rows ?? [0, 0, 0, 0, 0];
  const rows: [string, string][] = [
    ["0", "1"],
    ["1", "2"],
    ["2", "3"],
    ["0,5", "3"],
    ["1,5", "1"],
  ];
  const step = v(st.schemeStep);
  const schemeItems = [
    { n: 1, t: "Tập xác định" },
    { n: 2, t: "Sự biến thiên: dấu $f'$, cực trị, giới hạn tại vô cực" },
    { n: 3, t: "Vẽ đồ thị: điểm cắt các trục" },
  ];
  return (
    <>
      {/* công thức f */}
      <div
        data-text="formula"
        style={{
          position: "absolute",
          left: COL.left,
          top: F_TOP,
          fontFamily: fontText,
          fontSize: FS_F,
          color: colors.text,
          whiteSpace: "nowrap",
          opacity: v(st.formula),
          textShadow: halo(),
        }}
      >
        <Piece tex="f(x) ={}" />
        <span style={{ position: "relative", display: "inline-block" }}>
          <Piece tex="4" o={rest} color={v(st.coefGlow) > 0.5 ? K.focus : undefined} bg={v(st.coefGlow)}>
            <Under o={v(st.aLabel)} text="$a = 4 > 0$" color={K.focus} />
          </Piece>
          <Piece tex="x^3" o={rest} />
          <Brace o={v(st.braceA)} color={K.focus} steps={["$4000$", "4 triệu"]} step={v(st.braceStep)} />
        </span>
        <span style={{ position: "relative", display: "inline-block" }}>
          <Piece tex="{}-12x^2 + 9x" o={rest} />
          <Piece tex="{}+{}" />
          <Piece tex="1" color={v(st.dGlow) > 0.5 ? K.focus : undefined} bg={v(st.dGlow)}>
            <Under o={v(st.dLabel)} text="$d = 1$" color={K.focus} />
          </Piece>
          <Brace o={v(st.braceB)} color={colors.muted} steps={["$\\approx -1100$", "≈ −119 nghìn"]} step={v(st.braceStep)} />
        </span>
      </div>
      {/* tại x = 10 / 100 và tỉ số */}
      {v(st.braceA) > 0 ? (
        <>
          {[0, 1].map((i) => {
            const k = clamp01(1 - Math.abs(v(st.braceStep) - i)) * v(st.braceA);
            return k > 0 ? (
              <Tag key={i} x={COL.left} y={F_TOP + 200} anchor="left" color={colors.muted} size={40} opacity={k}>
                <MathText text={i === 0 ? "tại $x = 10$" : "tại $x = 100$"} />
              </Tag>
            ) : null;
          })}
          <Tag x={COL.left} y={F_TOP + 275} anchor="left" color={K.focus} size={44} weight={700} opacity={v(st.ratio) * v(st.braceA)}>
            gấp hơn 30 lần
          </Tag>
        </>
      ) : null}
      {v(st.general) > 0 ? (
        <Tag x={COL.left} y={F_TOP + 190} anchor="left" color={colors.muted} size={40} opacity={st.general}>
          <MathText text={"dạng chung $y = ax^3 + bx^2 + cx + d$"} />
        </Tag>
      ) : null}
      {/* nhắc bài trước + công thức f' */}
      {v(st.recall) > 0 ? (
        <Tag x={COL.left} y={F_TOP + 110} anchor="left" size={44} weight={700} opacity={st.recall}>
          <MathText text={`$f' > 0$: `} />
          <span style={{ color: K.up }}>lên</span>
          <span>, </span>
          <MathText text={`$f' < 0$: `} />
          <span style={{ color: K.down }}>xuống</span>
        </Tag>
      ) : null}
      {v(st.fpFormula) > 0 ? (
        <Tag x={COL.left} y={F_TOP + 200} anchor="left" size={50} weight={600} opacity={st.fpFormula}>
          <span style={{ background: v(st.fpGlow) > 0 ? tint(K.focus, 0.16 * v(st.fpGlow)) : undefined, borderRadius: 10, padding: "0 6px", color: v(st.fpGlow) > 0.5 ? K.focus : undefined }}>
            <MathText text={"$f'(x) = 12x^2 - 24x + 9$"} />
          </span>
        </Tag>
      ) : null}
      {/* bảng giá trị kiểu máy tính bỏ túi */}
      <CalcTable
        left={COL.left + 20}
        top={290}
        width={420}
        headers={["$x$", "$f(x)$"]}
        rows={rows.map(([a, b], i) => ({ cells: [a, b], o: rowsO[i], color: i >= 3 ? K.focus : undefined }))}
        opacity={v(st.tableO)}
      />
      {/* sơ đồ khảo sát (SGK) */}
      {v(st.scheme) > 0 ? (
        <Card style={{ left: COL.left, top: 290, width: 680, padding: "22px 30px", opacity: st.scheme }}>
          <div data-text="label" style={{ fontSize: 40, fontWeight: 800, color: colors.brandIndigo, marginBottom: 14 }}>
            Sơ đồ khảo sát hàm số
          </div>
          {schemeItems.map((it) => {
            const on = clamp01(1 - Math.abs(step - it.n));
            return (
              <div
                key={it.n}
                data-text="label"
                style={{
                  fontSize: 38,
                  lineHeight: 1.3,
                  fontWeight: 600,
                  padding: "8px 14px",
                  marginBottom: 18,
                  borderRadius: 14,
                  background: on > 0 ? tint(K.focus, 0.12 * on) : undefined,
                  color: on > 0.5 ? K.focus : colors.text,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <span>
                  {it.n}. <MathText text={it.t} />
                </span>
                {it.n === 1 && v(st.dR) > 0 ? (
                  <span style={{ opacity: st.dR, color: K.focus, fontWeight: 700, whiteSpace: "nowrap" }}>
                    <MathText text={"$D = \\mathbb{R}$"} />
                  </span>
                ) : null}
              </div>
            );
          })}
        </Card>
      ) : null}
      {v(st.mini) > 0 ? (
        <Tag x={MINI.left + MINI.w + 30} y={MINI.top + MINI.h / 2 - 26} anchor="left" color={K.warn} size={44} weight={700} opacity={st.mini}>
          phân thức
        </Tag>
      ) : null}
    </>
  );
};

// ---------------- CẢNH 2: đề thi ----------------
const P2 = { top: 330, w: 680, h: 540 };
export const s2a = makeScale({ xMin: X_MIN, xMax: X_MAX, yMin: -1, yMax: 5, width: P2.w, height: P2.h });
export const s2b = makeScale({ xMin: X_MIN, xMax: X_MAX, yMin: -5, yMax: 1, width: P2.w, height: P2.h });
const LEFT_A = 200;
const LEFT_B = 1060;

export type S2 = Partial<{
  o: number;
  q: number;
  a1: number;
  aEnd: number;
  aLab: number;
  dInt: number;
  dLab: number;
  labPulse: number;
  b1: number;
  bEnd: number;
  bLab: number;
  bInt: number;
  bdLab: number;
  endsPulse: number;
}>;

const ExamPlot: React.FC<{
  s: Scale;
  left: number;
  fn: (x: number) => number;
  dfn: (x: number) => number;
  o: number;
  endGlow: number;
  endColor: string;
  intGlow: number;
  aText: string;
  aO: number;
  dText: string;
  dO: number;
  yTicks: number[];
}> = ({ s, left, fn, dfn, o, endGlow, endColor, intGlow, aText, aO, dText, dO, yTicks }) => {
  if (o <= 0) return null;
  const items: AutoLabelItem[] = [
    { id: `a${left}`, x: 2.05, y: fn(2.05), text: aText, color: endColor, size: 48, weight: 700, opacity: aO, prefer: ["w", "nw", "sw"] },
    { id: `d${left}`, x: 0, y: fn(0), text: dText, color: K.focus, size: 48, weight: 700, opacity: dO, prefer: ["w", "nw", "sw"] },
  ];
  const obst = [...curveObstacles(s, fn, X_MIN, X_MAX), ...axesObstacles(s, XT, yTicks)];
  return (
    <Plot scale={s} left={left} top={P2.top} style={{ opacity: o }} overlay={<AutoLabels scale={s} items={items} obstacles={obst} />}>
      <Axes scale={s} xTicks={XT} yTicks={yTicks} hideXLabels={XT_HIDE} xLabel="x" yLabel="y" />
      {endGlow > 0 ? <FunctionPlot scale={s} f={fn} from={1.9} to={X_MAX} color={tint(endColor, 0.45)} width={22} opacity={endGlow} /> : null}
      <FunctionPlot scale={s} f={fn} color={K.main} width={7} />
      <EndArrow s={s} fn={fn} dfn={dfn} x={X_EXIT_R} dir={1} color={endGlow > 0.5 ? endColor : K.main} o={1} />
      <EndArrow s={s} fn={fn} dfn={dfn} x={X_EXIT_L} dir={-1} color={K.main} o={1} />
      {intGlow > 0 ? (
        <>
          <circle cx={s.x(0)} cy={s.y(fn(0))} r={24} fill="none" stroke={K.focus} strokeWidth={5} opacity={intGlow} />
          <Point scale={s} x={0} y={fn(0)} color={K.focus} opacity={intGlow} />
        </>
      ) : null}
    </Plot>
  );
};

export const Scene2: React.FC<{ st: S2 }> = ({ st }) => {
  const o = v(st.o);
  const lp = v(st.labPulse);
  const ep = v(st.endsPulse);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div
        data-text="label"
        style={{
          position: "absolute",
          left: 200,
          right: 200,
          top: 150,
          textAlign: "center",
          fontFamily: fontText,
          fontSize: 44,
          fontWeight: 600,
          color: colors.text,
          opacity: v(st.q),
        }}
      >
        <MathText text={"Hàm số $y = ax^3 + bx^2 + cx + d$ có đồ thị như hình. Xét dấu $a$ và $d$."} />
      </div>
      <ExamPlot
        s={s2a}
        left={LEFT_A}
        fn={f}
        dfn={df}
        o={v(st.a1)}
        endGlow={Math.max(v(st.aEnd), ep)}
        endColor={K.up}
        intGlow={v(st.dInt)}
        aText="$a > 0$"
        aO={v(st.aLab)}
        dText="$d > 0$"
        dO={v(st.dLab)}
        yTicks={YT}
      />
      <ExamPlot
        s={s2b}
        left={LEFT_B}
        fn={g}
        dfn={dg}
        o={v(st.b1)}
        endGlow={Math.max(v(st.bEnd), ep)}
        endColor={K.down}
        intGlow={v(st.bInt)}
        aText="$a < 0$"
        aO={v(st.bLab)}
        dText="$d < 0$"
        dO={v(st.bdLab)}
        yTicks={[-4, -3, -2, -1]}
      />
      {lp > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={LEFT_A - 30} y={P2.top - 30} width={P2.w + 60} height={P2.h + 60} rx={24} fill="none" stroke={K.focus} strokeWidth={4} opacity={0.6 * lp} />
        </svg>
      ) : null}
    </div>
  );
};
