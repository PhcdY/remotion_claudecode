import React from "react";
import { Card } from "../../components/Card";
import { AutoLabelItem, AutoLabels, Rect, axesObstacles, curveObstacles, segmentObstacles } from "../../components/labels";
import { MathText } from "../../components/MathText";
import { Tag, lerp } from "../../components/parts";
import { Axes, CurveArrow, FunctionPlot, Plot, Point, Scale, Segment, makeScale } from "../../components/plot";
import { role } from "../../components/roles";
import { colors, fontSize, fontText, halo, tint } from "../../components/theme";

// ---------------- Câu đố (đơn vị: km, km/h, giây) ----------------
/** Tốc độ trung bình cả 2 km khi xuống dốc với tốc độ v (lên dốc 30 km/h). */
export const TB = (v: number) => (60 * v) / (v + 30);
export const dTB = (v: number) => 1800 / ((v + 30) * (v + 30));
/** Tốc độ phải xuống để trung bình được A. */
export const VN = (a: number) => (30 * a) / (60 - a);
/** Thời gian xuống 1 km (s). */
export const downSec = (v: number) => 3600 / v;
/** Thời gian cho phép cả 2 km để trung bình được A (s). */
export const allowSec = (a: number) => 7200 / a;
export const UP_SEC = 120;

/** Màu theo vai trò (roles.ts), giữ nguyên nghĩa suốt video. */
export const K = {
  climb: role.up, // sườn lên, khúc leo dốc (độ cao tăng)
  descent: role.down, // sườn xuống, khúc xuống dốc (độ cao giảm)
  target: role.focus, // mục tiêu 60, vạch cho phép, tiệm cận
  gap: role.warn, // khoảng còn thiếu tới 60
  den: role.pairA, // mẫu số
  num: role.pairB, // tử số
  main: role.main,
  dim: role.dim,
  ground: "#7A8499",
};

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
/** Nhấp nháy 0 → 1 → 0 trong [a, a + d]. */
export const pulse = (fr: number, a: number, d = 24) => (fr < a || fr > a + d ? 0 : Math.sin(((fr - a) / d) * Math.PI));

/** Chữ đổi bước tại chỗ: [chữ, độ mờ] cho từng bước. */
export const stepMix = (steps: string[], step: number) => {
  const st = Math.min(Math.max(step, 0), steps.length - 1);
  const lo = Math.floor(st);
  return steps.map((t, i) => [t, i === lo ? 1 - (st - lo) : i === lo + 1 ? st - lo : 0] as const);
};

/** Nhãn HTML (có KaTeX) đổi bước tại chỗ. */
export const StepTag: React.FC<{
  x: number;
  y: number;
  steps: string[];
  step: number;
  o: number;
  anchor?: "center" | "left" | "right";
  color?: string;
  size?: number;
  weight?: number;
}> = ({ x, y, steps, step, o, anchor = "center", color = colors.text, size = 44, weight = 700 }) =>
  o <= 0 ? null : (
    <>
      {stepMix(steps, step).map(([t, k], i) =>
        k * o > 0 ? (
          <Tag key={i} x={x} y={y} anchor={anchor} color={color} size={size} weight={weight} opacity={k * o}>
            <MathText text={t} />
          </Tag>
        ) : null,
      )}
    </>
  );

// ---------------- Con dốc, xe, thanh thời gian ----------------
export type Box = { x: number; y: number; w: number; h: number };
export type BarGeo = { x: number; y: number; w: number };
export type HBGeo = { hill: Box; bar: BarGeo; carW: number; big: number };

/** CẢNH 1: con dốc lớn giữa khung, thanh thời gian bên dưới. */
export const G_BIG: HBGeo = { hill: { x: 560, y: 300, w: 800, h: 270 }, bar: { x: 360, y: 730, w: 1200 }, carW: 180, big: 1 };
/** Khung nhỏ ở cột phải (CẢNH 2, 3). */
export const gPanel = (px: number, py: number, pw: number): HBGeo => ({
  hill: { x: px + (pw - 460) / 2, y: py + 80, w: 460, h: 140 },
  bar: { x: px, y: py + 310, w: pw },
  carW: 104,
  big: 0,
});
export const mixGeo = (a: HBGeo, b: HBGeo, t: number): HBGeo => ({
  hill: { x: lerp(a.hill.x, b.hill.x, t), y: lerp(a.hill.y, b.hill.y, t), w: lerp(a.hill.w, b.hill.w, t), h: lerp(a.hill.h, b.hill.h, t) },
  bar: { x: lerp(a.bar.x, b.bar.x, t), y: lerp(a.bar.y, b.bar.y, t), w: lerp(a.bar.w, b.bar.w, t) },
  carW: lerp(a.carW, b.carW, t),
  big: lerp(a.big, b.big, t),
});

/** Điểm trên mặt đường sau d km (0 chân trái, 1 đỉnh, 2 chân phải). */
export const roadPt = (h: Box, d: number) => {
  if (d < 0) return { x: h.x + (h.w / 2) * d, y: h.y + h.h };
  if (d > 2) return { x: h.x + h.w + (h.w / 2) * (d - 2), y: h.y + h.h };
  return d <= 1 ? { x: h.x + (h.w / 2) * d, y: h.y + h.h * (1 - d) } : { x: h.x + h.w / 2 + (h.w / 2) * (d - 1), y: h.y + h.h * (d - 1) };
};
const slopeDeg = (h: Box) => (Math.atan2(h.h, h.w / 2) * 180) / Math.PI;
/** Góc xe: nằm ngang trên mặt đất, nghiêng theo dốc, chuyển mượt ở chân dốc và đỉnh. */
const carAngle = (h: Box, d: number) => {
  const a = slopeDeg(h);
  if (d < 0.5) return lerp(0, -a, clamp01((d + 0.06) / 0.12));
  if (d < 1.5) return lerp(-a, a, clamp01((d - 0.95) / 0.1));
  return lerp(a, 0, clamp01((d - 1.94) / 0.12));
};
/** Chỗ xe đứng trước khi leo và sau khi xuống (trên mặt đất phẳng). */
export const D_START = -0.22;
export const D_END = 2.22;

/** Xe nhìn ngang, gốc toạ độ ở chỗ bánh chạm đường, đầu xe quay sang phải. */
export const Car: React.FC<{ x: number; y: number; angle: number; w: number; opacity?: number }> = ({ x, y, angle, w, opacity = 1 }) =>
  opacity <= 0 ? null : (
    <g data-mark="car" transform={`translate(${x},${y}) rotate(${angle})`} opacity={opacity}>
      <path d={`M${-0.3 * w},${-0.32 * w} L${-0.17 * w},${-0.5 * w} L${0.15 * w},${-0.5 * w} L${0.32 * w},${-0.32 * w} Z`} fill={colors.text} />
      <rect x={-w / 2} y={-0.35 * w} width={w} height={0.24 * w} rx={0.07 * w} fill={colors.text} />
      <path d={`M${-0.24 * w},${-0.34 * w} L${-0.15 * w},${-0.46 * w} L${-0.02 * w},${-0.46 * w} L${-0.02 * w},${-0.34 * w} Z`} fill="#CFE0FF" />
      <path d={`M${0.02 * w},${-0.34 * w} L${0.02 * w},${-0.46 * w} L${0.13 * w},${-0.46 * w} L${0.24 * w},${-0.34 * w} Z`} fill="#CFE0FF" />
      <circle cx={-0.28 * w} cy={-0.11 * w} r={0.11 * w} fill="#2B2F4A" stroke={colors.bg} strokeWidth={3} />
      <circle cx={0.28 * w} cy={-0.11 * w} r={0.11 * w} fill="#2B2F4A" stroke={colors.bg} strokeWidth={3} />
    </g>
  );

export const BAR_H = 56;
const SEC_MAX = 180;
export const bx = (b: BarGeo, s: number) => b.x + (b.w * s) / SEC_MAX;

export type BarState = {
  o: number;
  /** khúc leo dốc (s), tô từ 0 */
  up: number;
  upLabel?: number;
  upGlow?: number;
  /** khúc xuống dốc (s), bắt đầu sau khúc leo dốc */
  down?: number;
  /** chữ của khúc xuống dốc (đặt trong khúc nếu đủ chỗ, không thì ngay sau nó) */
  downLabel?: { steps: string[]; step: number; o: number };
  /** vạch cho phép */
  allow?: { sec: number; o: number; glow?: number; steps: string[]; step: number; labelO?: number };
  /** khoảng còn lại từ 2 phút tới vạch cho phép (nét đứt) */
  remain?: number;
  /** nhãn trên thanh ở cuối tổng thời gian */
  total?: { text: string; o: number; glow?: number };
  /** viền thanh sáng (mẫu số) */
  frame?: number;
};

export type HillState = {
  geo: HBGeo;
  o?: number;
  car: { d: number; o: number };
  climbTo: number;
  descentTo: number;
  slopeGlow?: number;
  km?: number;
  speedUp?: number;
  question?: number;
  calc?: number;
  target?: { steps: string[]; step: number; o: number };
  downSpeed?: { text: string; o: number };
  carNote?: { text: string; caption?: string; o: number; color?: string };
  bar: BarState;
};

const labelText = (text: string, size: number) => text.replace(/\$[^$]*\$/g, "MMMM").length * size * 0.56;

export const HillBar: React.FC<HillState> = (p) => {
  const o = p.o ?? 1;
  if (o <= 0) return null;
  const { hill: h, bar: b, carW, big } = p.geo;
  const apex = { x: h.x + h.w / 2, y: h.y };
  const lf = { x: h.x, y: h.y + h.h };
  const rf = { x: h.x + h.w, y: h.y + h.h };
  const car = roadPt(h, p.car.d);
  const glow = p.slopeGlow ?? 0;
  const c1 = roadPt(h, clamp01(p.climbTo));
  const c2 = roadPt(h, 1 + clamp01(p.descentTo));
  const B = p.bar;
  const down = B.down ?? 0;
  const upEnd = bx(b, B.up);
  const dStart = bx(b, UP_SEC);
  const dEnd = bx(b, UP_SEC + down);
  const downW = down > 0 ? Math.max(dEnd - dStart, 9) : 0;
  const allow = B.allow;
  const leftMid = roadPt(h, 0.5);
  const rightMid = roadPt(h, 1.5);
  const downLabelW = B.downLabel ? Math.max(...B.downLabel.steps.map((t) => labelText(t, 44))) : 0;
  const downInside = downW > downLabelW + 24;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={lf.x - 0.32 * h.w} x2={rf.x + 0.32 * h.w} y1={lf.y} y2={lf.y} stroke={K.ground} strokeWidth={4} strokeLinecap="round" />
        <polygon points={`${lf.x},${lf.y} ${apex.x},${apex.y} ${rf.x},${rf.y}`} fill={tint(K.ground, 0.14)} />
        <polyline points={`${lf.x},${lf.y} ${apex.x},${apex.y} ${rf.x},${rf.y}`} fill="none" stroke={K.ground} strokeWidth={6} strokeLinejoin="round" />
        {p.climbTo > 0 ? <line x1={lf.x} y1={lf.y} x2={c1.x} y2={c1.y} stroke={K.climb} strokeWidth={9} strokeLinecap="round" /> : null}
        {p.descentTo > 0 ? <line x1={apex.x} y1={apex.y} x2={c2.x} y2={c2.y} stroke={K.descent} strokeWidth={9} strokeLinecap="round" /> : null}
        {glow > 0 ? (
          <polyline points={`${lf.x},${lf.y} ${apex.x},${apex.y} ${rf.x},${rf.y}`} fill="none" stroke={K.num} strokeWidth={12} strokeLinejoin="round" opacity={glow} />
        ) : null}
        <Car x={car.x} y={car.y - 3} angle={carAngle(h, p.car.d)} w={carW} opacity={p.car.o} />
        {/* thanh thời gian */}
        {B.o > 0 ? (
          <g opacity={B.o}>
            <rect x={b.x} y={b.y} width={b.w} height={BAR_H} rx={10} fill="#EEF2FA" stroke={colors.panelBorder} strokeWidth={2} />
            {B.up > 0 ? <rect x={b.x} y={b.y} width={upEnd - b.x} height={BAR_H} rx={10} fill={K.climb} /> : null}
            {(B.upGlow ?? 0) > 0 ? (
              <rect x={b.x - 6} y={b.y - 6} width={upEnd - b.x + 12} height={BAR_H + 12} rx={14} fill="none" stroke={K.climb} strokeWidth={5} opacity={B.upGlow} />
            ) : null}
            {allow && (B.remain ?? 0) > 0 ? (
              <rect
                x={dStart}
                y={b.y + 3}
                width={Math.max(bx(b, allow.sec) - dStart, 2)}
                height={BAR_H - 6}
                fill={tint(K.descent, 0.16)}
                stroke={K.descent}
                strokeWidth={3}
                strokeDasharray="7 5"
                opacity={B.remain}
              />
            ) : null}
            {downW > 0 ? <rect x={dStart} y={b.y} width={downW} height={BAR_H} fill={K.descent} /> : null}
            {(B.frame ?? 0) > 0 ? (
              <rect x={b.x - 8} y={b.y - 8} width={b.w + 16} height={BAR_H + 16} rx={16} fill="none" stroke={K.den} strokeWidth={6} opacity={B.frame} />
            ) : null}
            {allow && allow.o > 0 ? (
              <line
                x1={bx(b, allow.sec)}
                x2={bx(b, allow.sec)}
                y1={b.y - 18}
                y2={b.y + BAR_H + 10}
                stroke={K.target}
                strokeWidth={6 + 5 * (allow.glow ?? 0)}
                strokeLinecap="round"
                opacity={allow.o}
              />
            ) : null}
          </g>
        ) : null}
      </svg>
      {/* chữ của con dốc */}
      <Tag x={h.x + h.w * 0.35} y={h.y + h.h * 0.8 - 22} color={colors.muted} opacity={p.km ?? 0} size={fontSize.label}>
        1 km
      </Tag>
      <Tag x={h.x + h.w * 0.65} y={h.y + h.h * 0.8 - 22} color={colors.muted} opacity={p.km ?? 0} size={fontSize.label}>
        1 km
      </Tag>
      <Tag x={leftMid.x - 0.27 * h.w} y={leftMid.y - 0.68 * h.h} anchor="center" color={K.climb} size={44} weight={700} opacity={(p.speedUp ?? 0) * big}>
        30 km/h
      </Tag>
      {p.target ? <StepTag x={apex.x} y={apex.y - lerp(84, 186, big)} steps={p.target.steps} step={p.target.step} o={p.target.o} color={K.target} /> : null}
      <Tag x={rightMid.x + 56} y={rightMid.y - 150} anchor="left" color={K.descent} size={84} weight={800} opacity={(p.question ?? 0) * big}>
        ?
      </Tag>
      {(p.calc ?? 0) > 0 ? (
        <Tag x={rf.x + 30} y={h.y + 6} anchor="left" opacity={p.calc} size={44}>
          <MathText text={"$\\dfrac{30 + 90}{2} = 60$"} />
        </Tag>
      ) : null}
      {p.downSpeed ? (
        <Tag x={rightMid.x + 30} y={rightMid.y - 196} anchor="left" color={K.descent} size={44} weight={700} opacity={p.downSpeed.o * big}>
          {p.downSpeed.text}
        </Tag>
      ) : null}
      {p.carNote && p.carNote.o > 0 ? (
        <>
          {p.carNote.caption ? (
            <Tag x={roadPt(h, D_END).x} y={rf.y - carW * 0.62 - 124} anchor="center" color={colors.muted} size={fontSize.label} opacity={p.carNote.o}>
              {p.carNote.caption}
            </Tag>
          ) : null}
          <Tag x={roadPt(h, D_END).x} y={rf.y - carW * 0.62 - 64} anchor="center" color={p.carNote.color ?? K.descent} size={44} weight={700} opacity={p.carNote.o}>
            <MathText text={p.carNote.text} />
          </Tag>
        </>
      ) : null}
      {/* chữ của thanh thời gian */}
      <Tag x={b.x} y={b.y - 58} anchor="left" color={colors.muted} size={fontSize.label} opacity={B.o}>
        tổng thời gian
      </Tag>
      {B.up > 0 && (B.upLabel ?? 0) > 0 ? (
        <div
          data-text="label"
          style={{
            position: "absolute",
            left: (b.x + upEnd) / 2,
            top: b.y + BAR_H / 2,
            translate: "-50% -50%",
            fontFamily: fontText,
            fontWeight: 700,
            fontSize: 44,
            color: "#fff",
            whiteSpace: "nowrap",
            opacity: (B.upLabel ?? 0) * B.o,
          }}
        >
          2 phút
        </div>
      ) : null}
      {B.downLabel && B.downLabel.o > 0
        ? stepMix(B.downLabel.steps, B.downLabel.step).map(([t, k], i) =>
            k > 0 ? (
              <div
                key={i}
                data-text="label"
                style={{
                  position: "absolute",
                  left: downInside ? dStart + downW / 2 : dStart + downW + 16,
                  top: b.y + BAR_H / 2,
                  translate: downInside ? "-50% -50%" : "0 -50%",
                  fontFamily: fontText,
                  fontWeight: 700,
                  fontSize: 44,
                  color: downInside ? "#fff" : K.descent,
                  textShadow: downInside ? undefined : halo(),
                  whiteSpace: "nowrap",
                  opacity: k * B.downLabel!.o * B.o,
                }}
              >
                <MathText text={t} />
              </div>
            ) : null,
          )
        : null}
      {allow ? (
        <StepTag
          x={bx(b, allow.sec) + 24}
          y={b.y + BAR_H + 16}
          anchor="right"
          steps={allow.steps}
          step={allow.step}
          o={allow.o * B.o * (allow.labelO ?? 1)}
          color={K.target}
          size={fontSize.label}
          weight={700}
        />
      ) : null}
      {B.total ? (
        <Tag x={dStart + downW} y={b.y - 78} anchor="center" size={44} weight={700} opacity={B.total.o * B.o} color={(B.total.glow ?? 0) > 0.5 ? K.descent : colors.text}>
          {B.total.text}
        </Tag>
      ) : null}
    </div>
  );
};

// ---------------- HTML: phân số, thẻ ----------------
export const Frac: React.FC<{ num: React.ReactNode; den: React.ReactNode }> = ({ num, den }) => (
  <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", margin: "0 8px" }}>
    <span style={{ padding: "0 10px 6px" }}>{num}</span>
    <span style={{ height: 3, alignSelf: "stretch", background: colors.text }} />
    <span style={{ padding: "6px 10px 0" }}>{den}</span>
  </span>
);

/** Cụm chữ sáng màu (nền nhạt) khi on > 0. */
export const Lit: React.FC<{ on: number; color: string; dim?: number; children: React.ReactNode }> = ({ on, color, dim = 0, children }) => (
  <span
    style={{
      color: on > 0.5 ? color : colors.text,
      background: on > 0 ? tint(color, 0.14 * on) : undefined,
      borderRadius: 10,
      padding: "0 6px",
      whiteSpace: "nowrap",
      opacity: 1 - 0.6 * dim,
    }}
  >
    {children}
  </span>
);

export const SideCard: React.FC<{ left: number; top: number; width: number; o: number; children: React.ReactNode; group?: string }> = ({
  left,
  top,
  width,
  o,
  children,
  group,
}) =>
  o <= 0 ? null : (
    <Card group={group} style={{ left, top, width, padding: "20px 28px", opacity: o, fontSize: 40, fontWeight: 600, lineHeight: 1.35 }}>
      {children}
    </Card>
  );

// ---------------- CẢNH 2: tốc độ trung bình theo tốc độ xuống ----------------
export const P2 = { left: 200, top: 200, w: 900, h: 590 };
export const sc2 = (m: number): Scale =>
  makeScale({ xMin: lerp(0, -240, m), xMax: lerp(1000, 120, m), yMin: lerp(0, -150, m), yMax: lerp(70, 210, m), width: P2.w, height: P2.h });
const X2 = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
const Y2 = [10, 20, 30, 40, 50, 60, 70];
const X2E = [-240, -180, -120, -60, 60, 120];
const Y2E = [-120, -60, 60, 120, 180];

export type G2 = {
  m: number;
  axesO: number;
  /** tên trục: 0 câu chuyện, 1 x / y = f(x) kèm nghĩa, 2 chỉ x, y (đề thi) */
  titles: number;
  right: number;
  left?: number;
  mid?: number;
  line60: number;
  line60Glow?: number;
  pts?: { id: string; v: number; y?: number; o: number; color?: string }[];
  gaps?: { id: string; v: number; o: number; color: string; w?: number }[];
  giong?: { o: number; hiA: number; hiB: number };
  arrowGlow?: number;
  vline?: number;
  leftHi?: number;
  arrowUp?: number;
  arrowDown?: number;
  labels: AutoLabelItem[];
};

export const Graph2: React.FC<G2> = (g) => {
  const s = sc2(g.m);
  const exam = g.m > 0.5;
  const xt = exam ? X2E : X2;
  const yt = exam ? Y2E : Y2;
  const obst: Rect[] = [
    ...axesObstacles(s, xt, yt),
    ...(g.right > 0 || !exam ? curveObstacles(s, TB, 0, s.xMax) : []),
    ...((g.left ?? 0) > 0 ? curveObstacles(s, TB, s.xMin, -31) : []),
    ...((g.mid ?? 0) > 0 ? curveObstacles(s, TB, -22, 0) : []),
    ...(g.line60 > 0 ? segmentObstacles(0, s.y(60), s.width, s.y(60), 6) : []),
    ...((g.vline ?? 0) > 0 ? segmentObstacles(s.x(-30), 0, s.x(-30), s.height, 6) : []),
  ];
  const titleX = ["tốc độ xuống $v$ (km/h)", "$x$: tốc độ xuống (km/h)"];
  const titleY = ["tốc độ trung bình $v_{tb}$ (km/h)", "$y = f(x)$: tốc độ trung bình (km/h)"];
  const tStory = clamp01(2 - g.titles) * (1 - g.m);
  const oy = s.y(Math.min(Math.max(0, s.yMin), s.yMax));
  const xy = g.titles >= 2;
  return (
    <>
      <Plot scale={s} left={P2.left} top={P2.top} overlay={<AutoLabels scale={s} items={g.labels} obstacles={obst} />}>
        {g.axesO * (1 - g.m) > 0.01 ? (
          <Axes scale={s} xTicks={X2} yTicks={Y2} hideXLabels={xy ? [100, 300, 500, 700, 900, 1000] : [100, 300, 500, 700, 900]} hideYLabels={[10, 30, 50, 70]} xLabel={xy ? "x" : ""} yLabel={xy ? "y" : ""} opacity={g.axesO * (1 - g.m)} />
        ) : null}
        {g.axesO * g.m > 0.01 ? (
          <Axes
            scale={s}
            xTicks={X2E}
            yTicks={Y2E}
            hideXLabels={[-240, -60, 120]}
            hideYLabels={[-60, -120]}
            xLabel="x"
            yLabel="y"
            opacity={g.axesO * g.m}
          />
        ) : null}
        {(g.arrowGlow ?? 0) > 0 ? (
          <polygon
            points={`${s.width + 30},${oy} ${s.width + 4},${oy - 14} ${s.width + 4},${oy + 14}`}
            fill={K.main}
            opacity={g.arrowGlow}
          />
        ) : null}
        {g.line60 > 0 ? (
          <Segment scale={s} x1={s.xMin} y1={60} x2={s.xMax} y2={60} color={K.target} width={4 + 4 * (g.line60Glow ?? 0)} dashed opacity={g.line60} />
        ) : null}
        {(g.vline ?? 0) > 0 ? <Segment scale={s} x1={-30} y1={s.yMin} x2={-30} y2={s.yMax} color={K.target} width={4} dashed opacity={g.vline} /> : null}
        {g.giong && g.giong.o > 0 ? (
          <g opacity={g.giong.o}>
            <Segment scale={s} x1={900} y1={0} x2={900} y2={70} color={K.main} width={3} dashed />
            <Segment scale={s} x1={900} y1={60} x2={900} y2={70} color={K.target} width={10} opacity={g.giong.hiA} />
            <Segment scale={s} x1={900} y1={0} x2={900} y2={60} color={K.target} width={10} opacity={g.giong.hiB} />
          </g>
        ) : null}
        {(g.gaps ?? []).map((gp) =>
          gp.o > 0 ? <Segment key={gp.id} scale={s} x1={gp.v} y1={TB(gp.v)} x2={gp.v} y2={60} color={gp.color} width={gp.w ?? 7} opacity={gp.o} /> : null,
        )}
        <FunctionPlot scale={s} f={TB} from={0} to={s.xMax} progress={g.right} color={K.main} />
        <FunctionPlot scale={s} f={TB} from={s.xMin} to={-30.2} progress={g.left ?? 0} color={K.main} />
        <FunctionPlot scale={s} f={TB} from={0} to={-29.8} progress={g.mid ?? 0} color={K.main} />
        {(g.leftHi ?? 0) > 0 ? <FunctionPlot scale={s} f={TB} from={-75} to={-30.2} color={K.climb} width={9} opacity={g.leftHi} /> : null}
        <CurveArrow s={s} f={TB} df={dTB} x={-55} color={K.climb} opacity={g.arrowUp ?? 0} off={34} />
        <CurveArrow s={s} f={TB} df={dTB} x={-18} color={K.descent} opacity={g.arrowDown ?? 0} off={34} reverse />
        {(g.pts ?? []).map((p) =>
          p.o > 0 ? <Point key={p.id} scale={s} x={p.v} y={p.y ?? TB(p.v)} color={p.color ?? K.main} opacity={p.o} /> : null,
        )}
      </Plot>
      <Tag x={P2.left + P2.w + 10} y={P2.top + P2.h + 56} anchor="right" opacity={g.axesO * tStory * clamp01(1 - g.titles)} size={fontSize.label} weight={600}>
        <MathText text={titleX[0]} />
      </Tag>
      <Tag x={P2.left + P2.w + 10} y={P2.top + P2.h + 56} anchor="right" opacity={g.axesO * tStory * clamp01(g.titles)} size={fontSize.label} weight={600}>
        <MathText text={titleX[1]} />
      </Tag>
      <Tag x={P2.left - 20} y={P2.top - 74} anchor="left" opacity={g.axesO * tStory * clamp01(1 - g.titles)} size={fontSize.label} weight={600}>
        <MathText text={titleY[0]} />
      </Tag>
      <Tag x={P2.left - 20} y={P2.top - 74} anchor="left" opacity={g.axesO * tStory * clamp01(g.titles)} size={fontSize.label} weight={600}>
        <MathText text={titleY[1]} />
      </Tag>
    </>
  );
};

// ---------------- CẢNH 3: tốc độ phải xuống theo mục tiêu ----------------
export const P3 = { left: 190, top: 226, w: 860, h: 580 };
export const S3 = makeScale({ xMin: 0, xMax: 70, yMin: 0, yMax: 2000, width: 860, height: 580 });
const X3 = [10, 20, 30, 40, 50, 60, 70];
const Y3 = [500, 1000, 1500, 2000];
/** A lớn nhất vẽ (vượt mép trên thì bị cắt). */
export const A_END = 59.7;

export type G3 = {
  axesO: number;
  titles: number;
  curve: number;
  curveGlow?: number;
  pts?: { id: string; a: number; o: number; color?: string; arrow?: number }[];
  aDot?: { a: number; o: number };
  aSeg?: { a: number; o: number };
  column?: { a: number; o: number };
  vline?: number;
  labels: AutoLabelItem[];
};

export const Graph3: React.FC<G3> = (g) => {
  const s = S3;
  const obst: Rect[] = [
    ...axesObstacles(s, X3, Y3),
    ...(g.curve > 0 ? curveObstacles(s, VN, 0, Math.min(59.4, A_END * g.curve)) : []),
    ...((g.vline ?? 0) > 0 ? segmentObstacles(s.x(60), 0, s.x(60), s.height, 6) : []),
    ...(g.column && g.column.o > 0 ? segmentObstacles(s.x(g.column.a), s.height, s.x(g.column.a), -30, 12) : []),
    ...(g.aSeg && g.aSeg.o > 0 ? segmentObstacles(s.x(g.aSeg.a), s.height, s.x(60), s.height, 14) : []),
  ];
  const titleX = ["mục tiêu trung bình $A$ (km/h)", "$x$: mục tiêu trung bình (km/h)"];
  const titleY = ["tốc độ phải xuống $v$ (km/h)", "$y = f(x)$: tốc độ phải xuống"];
  const col = g.column;
  const vTop = (a: number) => Math.min(VN(a), s.yMax);
  return (
    <>
      <Plot scale={s} left={P3.left} top={P3.top} overlay={<AutoLabels scale={s} items={g.labels} obstacles={obst} />}>
        {g.axesO > 0.01 ? (
          <Axes scale={s} xTicks={X3} yTicks={Y3} hideXLabels={[10, 30, 50, 70]} hideYLabels={[500, 1500]} xLabel="" yLabel="" opacity={g.axesO} />
        ) : null}
        {(g.vline ?? 0) > 0 ? <Segment scale={s} x1={60} y1={0} x2={60} y2={s.yMax} color={K.target} width={4} dashed opacity={g.vline} /> : null}
        {g.aSeg && g.aSeg.o > 0 ? <Segment scale={s} x1={g.aSeg.a} y1={0} x2={60} y2={0} color={K.den} width={14} opacity={g.aSeg.o} /> : null}
        {col && col.o > 0 ? (
          <g opacity={col.o}>
            <Segment scale={s} x1={col.a} y1={0} x2={col.a} y2={vTop(col.a)} color={K.main} width={16} opacity={0.35} />
            <polygon points={`${s.x(col.a)},${-26} ${s.x(col.a) - 14},${-2} ${s.x(col.a) + 14},${-2}`} fill={K.main} />
          </g>
        ) : null}
        <FunctionPlot scale={s} f={VN} from={0} to={A_END} progress={g.curve} color={K.main} />
        {(g.curveGlow ?? 0) > 0 ? <FunctionPlot scale={s} f={VN} from={56} to={A_END} color={K.target} width={10} opacity={g.curveGlow} /> : null}
        {(g.pts ?? []).map((p) =>
          p.o > 0 ? (
            <g key={p.id}>
              <Point scale={s} x={p.a} y={Math.min(VN(p.a), s.yMax)} color={p.color ?? K.main} opacity={p.o} />
              {(p.arrow ?? 0) > 0 && VN(p.a) > s.yMax ? (
                <polygon points={`${s.x(p.a)},${-40} ${s.x(p.a) - 14},${-16} ${s.x(p.a) + 14},${-16}`} fill={p.color ?? K.main} opacity={p.o * (p.arrow ?? 0)} />
              ) : null}
            </g>
          ) : null,
        )}
        {g.aDot && g.aDot.o > 0 ? <Point scale={s} x={g.aDot.a} y={0} color={K.target} opacity={g.aDot.o} r={8} /> : null}
      </Plot>
      <Tag x={P3.left + P3.w + 10} y={P3.top + P3.h + 56} anchor="right" opacity={g.axesO * clamp01(1 - g.titles)} size={fontSize.label}>
        <MathText text={titleX[0]} />
      </Tag>
      <Tag x={P3.left + P3.w + 10} y={P3.top + P3.h + 56} anchor="right" opacity={g.axesO * clamp01(g.titles)} size={fontSize.label}>
        <MathText text={titleX[1]} />
      </Tag>
      <Tag x={P3.left - 20} y={P3.top - 96} anchor="left" opacity={g.axesO * clamp01(1 - g.titles)} size={fontSize.label}>
        <MathText text={titleY[0]} />
      </Tag>
      <Tag x={P3.left - 20} y={P3.top - 96} anchor="left" opacity={g.axesO * clamp01(g.titles)} size={fontSize.label}>
        <MathText text={titleY[1]} />
      </Tag>
    </>
  );
};
