import React from "react";
import { AutoLabelItem, AutoLabels, Rect, segmentObstacles, textObstacle } from "../../components/labels";
import { MathText } from "../../components/MathText";
import { col, label, lerp } from "../../components/parts";
import { role } from "../../components/roles";
import { colors, halo, tint } from "../../components/theme";
import { BigQuestion } from "../ban-chat-dao-ham/parts";

// ---------------- Vai trò màu (một màu một nghĩa suốt video) ----------------
export const K = {
  ant: role.main, // con kiến, người bơi
  s: role.pairA, // QUÃNG ĐƯỜNG = sợi chỉ
  d: role.focus, // ĐỘ DỊCH CHUYỂN = dây chun (và vận tốc, cùng hướng dây chun)
  t: role.pairB, // THỜI GIAN = đồng hồ
  warn: role.warn,
};
const SAND = "#F1E4C8";
const SAND_DARK = "#DCC79E";
const FOOD = "#B9853F";

// ---------------- Quỹ đạo của kiến (toạ độ mặt cát, đơn vị tuỳ ý) ----------------
/** Tổ ở gốc; đường đi lòng vòng, có một khúc vòng lại gần tổ, rồi tới mồi. Thêm hai điểm sau mồi cho b02 dòng 6. */
const CTRL: [number, number][] = [
  [0, 0],
  [1.2, 0.9],
  [2.4, 0.4],
  [3.0, 1.7],
  [2.0, 2.6],
  [0.9, 1.8],
  [0.6, 1.0],
  [1.8, 1.3],
  [3.6, 0.9],
  [4.8, 1.8],
  [4.2, 3.0],
  [5.4, 3.8],
  [6.4, 3.6],
  [7.0, 2.9],
  [7.4, 3.5],
];
const I_EXC = 3; // xa tổ lần đầu
const I_NEAR = 6; // vòng lại sát tổ
const I_FOOD = 12; // chỗ mồi
export const FOODW = CTRL[I_FOOD];

type W = { x: number; y: number };
const cr = (p0: number, p1: number, p2: number, p3: number, t: number) =>
  0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
const SEG = 40;
const PTS: W[] = [];
const CTRL_IDX: number[] = [];
{
  const Q = [CTRL[0], ...CTRL, CTRL[CTRL.length - 1]];
  for (let i = 1; i < Q.length - 2; i++) {
    CTRL_IDX.push(PTS.length);
    for (let k = 0; k < SEG; k++) {
      const t = k / SEG;
      PTS.push({ x: cr(Q[i - 1][0], Q[i][0], Q[i + 1][0], Q[i + 2][0], t), y: cr(Q[i - 1][1], Q[i][1], Q[i + 1][1], Q[i + 2][1], t) });
    }
  }
  CTRL_IDX.push(PTS.length);
  PTS.push({ x: CTRL[CTRL.length - 1][0], y: CTRL[CTRL.length - 1][1] });
}
const ARC: number[] = [0];
for (let i = 1; i < PTS.length; i++) ARC.push(ARC[i - 1] + Math.hypot(PTS[i].x - PTS[i - 1].x, PTS[i].y - PTS[i - 1].y));
/** quãng đường (theo quỹ đạo) tới các mốc */
export const U_EXC = ARC[CTRL_IDX[I_EXC]];
export const U_NEAR = ARC[CTRL_IDX[I_NEAR]];
export const U_FOOD = ARC[CTRL_IDX[I_FOOD]];
export const U_END = ARC[ARC.length - 1];

/** điểm trên quỹ đạo sau khi đi được quãng đường u */
const onPath = (u: number): W & { i: number } => {
  const v = Math.min(Math.max(u, 0), U_END);
  let lo = 0;
  let hi = ARC.length - 1;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (ARC[m] <= v) lo = m;
    else hi = m;
  }
  const f = ARC[hi] > ARC[lo] ? (v - ARC[lo]) / (ARC[hi] - ARC[lo]) : 0;
  return { x: lerp(PTS[lo].x, PTS[hi].x, f), y: lerp(PTS[lo].y, PTS[hi].y, f), i: lo };
};

// ---------------- Chiếu mặt cát nghiêng → màn hình (một hàm chung) ----------------
const KPX = 130; // px trên một đơn vị theo chiều ngang khi camera ở gần (zoom 1)
const OX = 430;
const OY = 810;
const DEPTH = 0.75;
/** camera: zoom quanh tổ (tổ là mốc đứng yên); bản "kéo thẳng" dùng đúng tỉ lệ ngang này */
const camera = (z: number) => (p: W) => ({ x: OX + p.x * KPX * z, y: OY - p.y * KPX * DEPTH * z });
const NEST = { x: OX, y: OY };
/** chỗ thả kiến trong thí nghiệm nhấc kiến (b08) */
const DISPW: W = { x: 9.8, y: 4.4 };
/** hai bản kéo thẳng nằm trên bầu trời (dưới hai công thức), không đè lên hình trên cát */
const STRAIGHT = { x: 400, yS: 400, yD: 462 };
/** hai kiến (b05) đi bao xa mỗi bên */
const TWO = 2.9;
const DIR_A: W = (() => {
  const L = Math.hypot(-0.3, 1);
  return { x: -0.3 / L, y: 1 / L };
})();
const DIR_B: W = { x: 1, y: 0 };
const unit = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const L = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { x: (b.x - a.x) / L, y: (b.y - a.y) / L };
};

const ang = (a: { x: number; y: number }, b: { x: number; y: number }) => (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
const dist = (a: W, b: W) => Math.hypot(a.x - b.x, a.y - b.y);

// ---------------- Trạng thái ----------------
export type AntMode = "path" | "home" | "disp";
export type St = {
  scene: 1 | 2;
  fr: number;
  /** camera: 1 gần, 0,7 kéo ra để đặt bản kéo thẳng */
  zoom: number;
  // kiến chính
  mode: AntMode;
  u: number;
  homeR: number;
  lift: number;
  run: number;
  wander: number;
  antO: number;
  carry: number;
  foodO: number;
  nestLab: number;
  foodLab: number;
  footO: number;
  wind: number;
  q: number;
  // sợi chỉ = quãng đường
  spoolO: number;
  spoolLab: number;
  threadO: number;
  /** sợi chỉ nhả tới quãng đường này trên quỹ đạo (≤ u) */
  threadU: number;
  threadHi: number;
  threadDim: number;
  threadLab: number;
  copyS: number;
  copySLab: number;
  // dây chun = độ dịch chuyển
  bandO: number;
  bandHi: number;
  bandLab: number;
  bandName: number;
  bandEnds: number;
  copyD: number;
  homeArrow: number;
  homeLab: number;
  dot: number;
  dotLab: number;
  notHere: number;
  memBand: number;
  // hai kiến (vận tốc)
  twoO: number;
  twoRun: number;
  arrows: number;
  arrowLab: number;
  lenHi: number;
  lenLab: number;
  tipHi: number;
  // đặt tên công thức
  clockO: number;
  clockLab: number;
  f1: number;
  f2: number;
  sHi: number;
  dHi: number;
  tHi: number;
  vecHi: number;
  sLab: number;
  dLab: number;
  // cảnh 2
  phoneL: number;
  route: number;
  routeHi: number;
  phoneM: number;
  line: number;
  lineHi: number;
  pool: number;
  swim: number;
  poolDot: number;
  slide1: number;
  slide2: number;
};

export const S0: St = {
  scene: 1,
  fr: 0,
  zoom: 1,
  mode: "path",
  u: 0,
  homeR: 0,
  lift: 0,
  run: 0,
  wander: 0,
  antO: 1,
  carry: 0,
  foodO: 0,
  nestLab: 0,
  foodLab: 0,
  footO: 0,
  wind: 0,
  q: 0,
  spoolO: 0,
  spoolLab: 0,
  threadO: 0,
  threadU: 0,
  threadHi: 0,
  threadDim: 0,
  threadLab: 0,
  copyS: 0,
  copySLab: 0,
  bandO: 0,
  bandHi: 0,
  bandLab: 0,
  bandName: 0,
  bandEnds: 0,
  copyD: 0,
  homeArrow: 0,
  homeLab: 0,
  dot: 0,
  dotLab: 0,
  notHere: 0,
  memBand: 0,
  twoO: 0,
  twoRun: 0,
  arrows: 0,
  arrowLab: 0,
  lenHi: 0,
  lenLab: 0,
  tipHi: 0,
  clockO: 0,
  clockLab: 0,
  f1: 0,
  f2: 0,
  sHi: 0,
  dHi: 0,
  tHi: 0,
  vecHi: 0,
  sLab: 0,
  dLab: 0,
  phoneL: 0,
  route: 0,
  routeHi: 0,
  phoneM: 0,
  line: 0,
  lineHi: 0,
  pool: 0,
  swim: 0,
  poolDot: 0,
  slide1: 0,
  slide2: 0,
};

/** Vị trí (mặt cát) và hướng nhìn tới của kiến chính theo trạng thái. */
const antWorld = (st: St): { p: W; toward: W } => {
  const food = { x: FOODW[0], y: FOODW[1] };
  if (st.mode === "home") {
    const p = { x: lerp(food.x, 0, st.homeR), y: lerp(food.y, 0, st.homeR) };
    return { p, toward: { x: 0, y: 0 } };
  }
  if (st.mode === "disp") {
    const start = { x: lerp(food.x, DISPW.x, st.lift), y: lerp(food.y, DISPW.y, st.lift) };
    const end = { x: DISPW.x - food.x, y: DISPW.y - food.y };
    const p = { x: lerp(start.x, end.x, st.run), y: lerp(start.y, end.y, st.run) };
    if (st.wander > 0) {
      // đi loanh quanh tìm tổ: vòng nhỏ quanh chỗ dừng
      const a = st.wander * Math.PI * 2;
      const q = { x: end.x + 0.8 * Math.sin(a), y: end.y + 0.7 * (1 - Math.cos(a)) };
      const q2 = { x: end.x + 0.8 * Math.sin(a + 0.1), y: end.y + 0.7 * (1 - Math.cos(a + 0.1)) };
      return { p: q, toward: q2 };
    }
    return { p, toward: st.run < 1 ? end : { x: end.x - 1, y: end.y } };
  }
  const p = onPath(st.u);
  const ahead = onPath(st.u + 0.15);
  return { p, toward: dist(ahead, p) > 1e-6 ? ahead : { x: p.x + 1, y: p.y } };
};

// ---------------- Thành phần ----------------

/** Con kiến giản lược (dài ≈ 145px), (x, y) = tâm ngực, angle: hướng đầu (độ, trên màn hình). */
const Ant: React.FC<{ x: number; y: number; angle: number; o: number; carry?: number; step?: number; mark?: boolean }> = ({
  x,
  y,
  angle,
  o,
  carry = 0,
  step = 0,
  mark = true,
}) => {
  if (o <= 0) return null;
  const sw = Math.sin(step) * 8;
  return (
    <g data-mark={mark ? "ant" : undefined} transform={`translate(${x}, ${y}) rotate(${angle})`} opacity={o}>
      {[-1, 0, 1].map((i) => (
        <g key={i} stroke={colors.text} strokeWidth={4} strokeLinecap="round" fill="none">
          <path d={`M${i * 13},0 L${i * 14 + (i === 0 ? -sw : sw)},-24 L${i * 22 + (i === 0 ? -sw : sw)},-36`} />
          <path d={`M${i * 13},0 L${i * 14 + (i === 0 ? sw : -sw)},24 L${i * 22 + (i === 0 ? sw : -sw)},36`} />
        </g>
      ))}
      <ellipse cx={-44} cy={0} rx={32} ry={22} fill={K.ant} />
      <ellipse cx={0} cy={0} rx={20} ry={12} fill={K.ant} />
      <circle cx={34} cy={0} r={16} fill={K.ant} />
      <path d="M44,-8 Q58,-24 72,-24 M44,8 Q58,24 72,24" stroke={colors.text} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {carry > 0 ? <ellipse cx={58} cy={0} rx={13} ry={9} fill={FOOD} opacity={carry} /> : null}
    </g>
  );
};

/** Mũi tên thẳng (px) với đầu nhọn; ngắn quá thì thôi vẽ. */
const Arrow: React.FC<{ a: { x: number; y: number }; b: { x: number; y: number }; color: string; o: number; w?: number; head?: number }> = ({
  a,
  b,
  color,
  o,
  w = 8,
  head = 22,
}) => {
  const L = Math.hypot(b.x - a.x, b.y - a.y);
  if (o <= 0 || L < head + 4) return null;
  const ux = (b.x - a.x) / L;
  const uy = (b.y - a.y) / L;
  const bx = b.x - ux * head;
  const by = b.y - uy * head;
  return (
    <g opacity={o}>
      <line x1={a.x} y1={a.y} x2={bx} y2={by} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <polygon points={`${b.x},${b.y} ${bx - uy * 13},${by + ux * 13} ${bx + uy * 13},${by - ux * 13}`} fill={color} />
    </g>
  );
};

const Layer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    {children}
  </svg>
);

/** Chữ có công thức, đặt tuyệt đối. */
const MT: React.FC<{ x: number; y: number; text: string; o: number; size?: number; color?: string; anchor?: "left" | "right" | "center" }> = ({
  x,
  y,
  text,
  o,
  size = 44,
  color = colors.text,
  anchor = "left",
}) =>
  o <= 0 ? null : (
    <div
      data-text="formula"
      style={{
        ...label,
        position: "absolute",
        left: x,
        top: y,
        translate: anchor === "right" ? "-100% 0" : anchor === "center" ? "-50% 0" : "0 0",
        whiteSpace: "nowrap",
        fontSize: size,
        color,
        opacity: o,
        textShadow: halo(),
      }}
    >
      <MathText text={text} />
    </div>
  );

const pulse = (v: number) => (v > 0 ? 0.5 + 0.5 * Math.sin(v * Math.PI) : 0);

// ---------------- CẢNH SA MẠC (cảnh 1 và cảnh 3) ----------------
const CLOCK = { x: 250, y: 640, r: 46 };
/** lề trái của hai công thức (góc trời bên trái) */
const FXL = 130;
const SPOOL = { x: 720, y: 832 };

export const Desert: React.FC<{ st: St }> = ({ st }) => {
  const proj = camera(st.zoom);
  const horizon = OY - 5.2 * KPX * DEPTH * st.zoom;
  const { p: aw, toward } = antWorld(st);
  const A = proj(aw);
  const angle = ang(A, proj(toward));
  const step = st.fr * 0.9;

  // sợi chỉ: đúng quỹ đạo tới threadU, rồi đoạn thẳng về tổ (b04) nếu kiến đang về
  const tu = Math.min(st.threadU, U_END);
  const end = onPath(tu);
  const tpts = PTS.slice(0, end.i + 1).map(proj);
  tpts.push(proj(end));
  let threadLen = tu;
  if (st.mode === "home" && st.threadU >= U_FOOD - 1e-6) {
    tpts.push(A);
    threadLen += dist({ x: FOODW[0], y: FOODW[1] }, aw);
  }
  const tpath = tpts.map((q, i) => `${i ? "L" : "M"}${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(" ");
  const threadOp = st.threadO * (1 - 0.8 * st.threadDim);

  // dây chun: từ tổ tới kiến
  const bandLen = dist(aw, { x: 0, y: 0 });
  const bandW = Math.max(4, 11 - bandLen * 0.9);

  // vết chân mờ dọc quỹ đạo đã đi
  const feet: { x: number; y: number }[] = [];
  if (st.footO > 0)
    for (let v = 0.2; v < Math.min(st.u, U_FOOD); v += 0.28) {
      const q = proj(onPath(v));
      feet.push(q);
    }

  // hai kiến (b05): bò thẳng từ tổ, nhanh như nhau, hai hướng khác nhau
  const twoAt = (dir: W, k: number) => proj({ x: dir.x * (1.0 + (TWO - 1.0) * k), y: dir.y * (1.0 + (TWO - 1.0) * k) });
  const left = twoAt(DIR_A, st.twoRun);
  const right = twoAt(DIR_B, st.twoRun);
  const uA = unit(proj({ x: 0, y: 0 }), proj(DIR_A));
  const uB = unit(proj({ x: 0, y: 0 }), proj(DIR_B));
  const angA = (Math.atan2(uA.y, uA.x) * 180) / Math.PI;
  const angB = (Math.atan2(uB.y, uB.x) * 180) / Math.PI;
  const ARW = 130;
  /** mũi tên vận tốc: gốc ở đầu kiến, theo hướng bò */
  const arrowOf = (q: { x: number; y: number }, u: { x: number; y: number }) => ({
    a: { x: q.x + u.x * 78, y: q.y + u.y * 78 },
    b: { x: q.x + u.x * (78 + ARW), y: q.y + u.y * (78 + ARW) },
  });
  const arA = arrowOf(left, uA);
  const arB = arrowOf(right, uB);

  // nhãn gắn cố định cạnh vật (phía kiến không bao giờ đi qua) — không để bộ đặt nhãn đổi phía khi kiến bò ngang
  const foodS = proj({ x: FOODW[0], y: FOODW[1] });
  const crossS = proj({ x: DISPW.x - FOODW[0], y: DISPW.y - FOODW[1] });
  const memMid = { x: (NEST.x + foodS.x) / 2 - 70, y: (NEST.y + foodS.y) / 2 - 70 };
  const fixed: { text: string; x: number; y: number; w: number; o: number; color: string; center?: boolean }[] = [
    { text: "mồi", x: foodS.x - 10, y: foodS.y + 74, w: 90, o: st.foodLab, color: FOOD },
    { text: "cuộn chỉ", x: SPOOL.x, y: SPOOL.y + 40, w: 190, o: st.spoolLab, color: K.s, center: true },
    { text: "co thành một chấm", x: NEST.x + 100, y: NEST.y - 8, w: 400, o: st.dotLab, color: K.d },
    { text: "tổ không ở đây", x: crossS.x, y: crossS.y + 46, w: 320, o: st.notHere, color: K.warn, center: true },
    { text: "dây chun", x: memMid.x, y: memMid.y - 26, w: 190, o: st.memBand, color: K.d, center: true },
  ];
  // vật cản cho nhãn
  const obst: Rect[] = [
    ...fixed.filter((f) => f.o > 0).map((f) => textObstacle(f.center ? f.x - f.w / 2 : f.x, f.y, f.w, 54)),
    { x: NEST.x - 100, y: NEST.y - 32, w: 200, h: 72 },
    ...(st.antO > 0 ? [{ x: A.x - 82, y: A.y - 78, w: 164, h: 156 }] : []),
    ...(st.spoolO > 0 ? [{ x: SPOOL.x - 30, y: SPOOL.y - 34, w: 60, h: 60 }] : []),
    ...(st.clockO > 0 ? [{ x: CLOCK.x - 50, y: CLOCK.y - 50, w: 100, h: 100 }] : []),
    ...(st.foodO > 0 ? [{ x: proj({ x: FOODW[0], y: FOODW[1] }).x - 30, y: proj({ x: FOODW[0], y: FOODW[1] }).y - 20, w: 60, h: 40 }] : []),
    ...(st.copyS > 0 || st.copyD > 0 ? [{ x: STRAIGHT.x - 200, y: STRAIGHT.yS - 30, w: 1560, h: STRAIGHT.yD - STRAIGHT.yS + 60 }] : []),
    ...(st.f1 > 0 ? [textObstacle(FXL, 112, 600, 112)] : []),
    ...(st.f2 > 0 ? [textObstacle(FXL, 232, 600, 118)] : []),
    ...(st.twoO > 0 ? [{ x: left.x - 82, y: left.y - 78, w: 164, h: 156 }, { x: right.x - 82, y: right.y - 78, w: 164, h: 156 }] : []),
    ...(st.arrows > 0 ? [...segmentObstacles(arA.a.x, arA.a.y, arA.b.x, arA.b.y, 14), ...segmentObstacles(arB.a.x, arB.a.y, arB.b.x, arB.b.y, 14)] : []),
  ];
  const bandMid = proj({ x: aw.x / 2, y: aw.y / 2 });
  const labels: AutoLabelItem[] = [
    { id: "nest", x: NEST.x - 60, y: NEST.y + 4, text: "tổ", size: 44, opacity: st.nestLab, prefer: ["w", "sw"], anchor: "region" },
    { id: "thread", phases: ["b2"], ...proj(onPath(U_EXC * 0.55)), text: "quãng đường = chiều dài sợi chỉ", size: 44, color: K.s, opacity: st.threadLab, prefer: ["se", "s", "e"], anchor: "region" },
    { id: "band", phases: ["b3"], ...bandMid, text: "dây chun", size: 44, color: K.d, opacity: st.bandLab, prefer: ["n", "ne"], anchor: "region" },
    { id: "bandName", phases: ["b3"], ...bandMid, text: "độ dịch chuyển = dây chun", size: 44, color: K.d, opacity: st.bandName, prefer: ["se", "s", "n"], anchor: "region" },
    { id: "home", phases: ["b4"], ...bandMid, text: "đường về", size: 44, color: K.d, opacity: st.homeLab, prefer: ["n", "nw"], anchor: "region" },
    { id: "arrow2", phases: ["b5"], x: (arB.a.x + arB.b.x) / 2, y: (arB.a.y + arB.b.y) / 2, text: "vận tốc", size: 44, color: K.d, opacity: st.arrowLab, prefer: ["n", "ne"], anchor: "region" },
    { id: "arrow", phases: ["b5"], x: (arA.a.x + arA.b.x) / 2, y: (arA.a.y + arA.b.y) / 2, text: "vận tốc", size: 44, color: K.d, opacity: st.arrowLab, prefer: ["n", "ne"], anchor: "region" },
    { id: "len", phases: ["b5"], x: (arB.a.x + arB.b.x) / 2, y: (arB.a.y + arB.b.y) / 2, text: "tốc độ: độ dài mũi tên", size: 44, color: K.d, opacity: st.lenLab, prefer: ["se", "s", "e"], anchor: "region" },
    { id: "clock", phases: ["b6"], x: CLOCK.x, y: CLOCK.y - CLOCK.r, text: "thời gian đi", size: 44, color: K.t, opacity: st.clockLab, prefer: ["n", "nw"] },
    { id: "sLab", phases: ["b6"], ...proj(onPath(U_EXC * 0.55)), text: "$s$", size: 48, color: K.s, opacity: st.sLab, prefer: ["se", "s"], anchor: "region" },
    { id: "dLab", phases: ["b6"], ...bandMid, text: "$\\vec d$", size: 48, color: K.d, opacity: st.dLab, prefer: ["n", "ne"], anchor: "region" },
  ];

  const homeEnd = st.mode === "disp" ? proj({ x: DISPW.x - FOODW[0], y: DISPW.y - FOODW[1] }) : NEST;
  const showArrowFromAnt = st.homeArrow > 0 && dist(A, homeEnd) > 40;

  return (
    <>
      <Layer>
        {/* mặt cát nghiêng tới chân trời */}
        <rect x={0} y={horizon} width={1920} height={1080 - horizon} fill={SAND} />
        <path d={`M0,${horizon} Q300,${horizon - 40} 620,${horizon} T1240,${horizon} T1920,${horizon} L1920,${horizon + 6} L0,${horizon + 6} Z`} fill={SAND_DARK} />
        {[0.25, 0.5, 0.8].map((k) => lerp(horizon, OY, k)).map((y, i) => (
          <path key={y} d={`M${120 + i * 160},${y} q60,-10 120,0 t120,0`} stroke={SAND_DARK} strokeWidth={3} fill="none" opacity={0.8} />
        ))}
        {/* gió xoá vết chân */}
        {st.wind > 0 && st.wind < 1
          ? [0, 1, 2, 3].map((i) => {
              const x = lerp(-200, 2000, (st.wind * 1.3 + i * 0.18) % 1.2);
              const y = 520 + i * 70;
              return <line key={i} x1={x} x2={x + 220} y1={y} y2={y - 6} stroke={colors.muted} strokeWidth={3} strokeLinecap="round" opacity={0.45} />;
            })
          : null}
        {feet.map((q, i) => (
          <circle key={i} cx={q.x} cy={q.y} r={4.5} fill={colors.muted} opacity={0.55 * st.footO} />
        ))}

        {/* tổ: mốc đứng yên */}
        <ellipse cx={NEST.x} cy={NEST.y + 4} rx={92} ry={34} fill={SAND_DARK} stroke="#C2A877" strokeWidth={4} />
        <ellipse cx={NEST.x} cy={NEST.y - 4} rx={58} ry={20} fill="#E6D3AB" />
        <ellipse cx={NEST.x} cy={NEST.y - 2} rx={26} ry={11} fill={colors.text} />

        {/* mồi */}
        {st.foodO > 0 ? (() => {
          const f = proj({ x: FOODW[0], y: FOODW[1] });
          return <ellipse cx={f.x} cy={f.y} rx={15} ry={10} fill={FOOD} opacity={st.foodO} />;
        })() : null}

        {/* cuộn chỉ */}
        {st.spoolO > 0 ? (
          <g data-mark="spool" opacity={st.spoolO}>
            <rect x={SPOOL.x - 30} y={SPOOL.y - 34} width={60} height={12} rx={4} fill="#C9A15B" />
            <rect x={SPOOL.x - 30} y={SPOOL.y + 14} width={60} height={12} rx={4} fill="#C9A15B" />
            <rect x={SPOOL.x - 20} y={SPOOL.y - 22} width={40} height={36} fill={K.s} />
            {[-14, -6, 2, 10].map((dy) => (
              <line key={dy} x1={SPOOL.x - 20} x2={SPOOL.x + 20} y1={SPOOL.y + dy} y2={SPOOL.y + dy + 3} stroke={tint(colors.text, 0.25)} strokeWidth={2} />
            ))}
          </g>
        ) : null}

        {/* sợi chỉ = quãng đường */}
        {st.threadO > 0 ? (
          <>
            {st.spoolO > 0 ? <line x1={SPOOL.x} y1={SPOOL.y - 6} x2={NEST.x} y2={NEST.y} stroke={K.s} strokeWidth={3} opacity={threadOp} /> : null}
            <path d={tpath} fill="none" stroke={K.s} strokeWidth={st.threadHi > 0 ? 4 + 3 * st.threadHi : 4} strokeLinejoin="round" strokeLinecap="round" opacity={threadOp} />
          </>
        ) : null}

        {/* dây chun = độ dịch chuyển: tổ → kiến */}
        {st.bandO > 0 && st.mode !== "disp" ? (
          <g opacity={st.bandO}>
            {bandLen > 0.12 ? (
              <line x1={NEST.x} y1={NEST.y} x2={A.x} y2={A.y} stroke={K.d} strokeWidth={bandW + 3 * st.bandHi} strokeLinecap="round" opacity={0.9} />
            ) : null}
            <circle cx={NEST.x} cy={NEST.y} r={9 + 6 * pulse(st.bandEnds)} fill={K.d} />
            {bandLen > 0.12 ? <circle cx={A.x} cy={A.y} r={7 + 6 * pulse(st.bandEnds > 1 ? st.bandEnds - 1 : 0)} fill={K.d} /> : null}
          </g>
        ) : null}
        {st.dot > 0 ? (
          <g opacity={st.dot}>
            <circle cx={NEST.x} cy={NEST.y - 2} r={30} fill={tint(K.d, 0.18)} />
            <circle cx={NEST.x} cy={NEST.y - 2} r={16} fill={K.d} />
          </g>
        ) : null}

        {/* b08: chỗ dây chun cũ dẫn tới (không có tổ) */}
        {st.notHere > 0 ? (() => {
          const x0 = proj({ x: DISPW.x - FOODW[0], y: DISPW.y - FOODW[1] });
          return (
            <g opacity={st.notHere} stroke={K.warn} strokeWidth={7} strokeLinecap="round">
              <line x1={x0.x - 16} y1={x0.y - 12} x2={x0.x + 16} y2={x0.y + 12} />
              <line x1={x0.x - 16} y1={x0.y + 12} x2={x0.x + 16} y2={x0.y - 12} />
            </g>
          );
        })() : null}
        {/* b08 dòng cuối: dây chun kiến đã ghi nhớ (từ tổ tới chỗ mồi) */}
        {st.memBand > 0 ? (() => {
          const f = proj({ x: FOODW[0], y: FOODW[1] });
          return <line x1={NEST.x} y1={NEST.y} x2={f.x} y2={f.y} stroke={K.d} strokeWidth={9} strokeLinecap="round" opacity={st.memBand} />;
        })() : null}
        {/* mũi tên ngược dây chun: hướng về tổ */}
        {showArrowFromAnt ? <Arrow a={A} b={homeEnd} color={K.d} o={st.homeArrow} w={7} /> : null}

        {/* bản kéo thẳng: sợi chỉ (trên) và dây chun (dưới), cùng tỉ lệ ngang với cảnh */}
        {st.copyS > 0 ? (
          <line x1={STRAIGHT.x} x2={STRAIGHT.x + Math.min(threadLen, U_END + 2) * KPX * st.zoom} y1={STRAIGHT.yS} y2={STRAIGHT.yS} stroke={K.s} strokeWidth={7} strokeLinecap="round" opacity={st.copyS} />
        ) : null}
        {st.copyD > 0 ? (
          <line x1={STRAIGHT.x} x2={STRAIGHT.x + Math.max(bandLen * KPX * st.zoom, 6)} y1={STRAIGHT.yD} y2={STRAIGHT.yD} stroke={K.d} strokeWidth={10} strokeLinecap="round" opacity={st.copyD} />
        ) : null}

        {/* đồng hồ kim (không ghi số) */}
        {st.clockO > 0 ? (
          <g data-mark="clock" opacity={st.clockO}>
            <circle cx={CLOCK.x} cy={CLOCK.y} r={CLOCK.r} fill="#FFFFFF" stroke={K.t} strokeWidth={st.tHi > 0 ? 8 : 5} />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <line key={i} x1={CLOCK.x + 36 * Math.sin(a)} y1={CLOCK.y - 36 * Math.cos(a)} x2={CLOCK.x + 42 * Math.sin(a)} y2={CLOCK.y - 42 * Math.cos(a)} stroke={K.t} strokeWidth={3} />;
            })}
            <line x1={CLOCK.x} y1={CLOCK.y} x2={CLOCK.x + 30 * Math.sin(4.2)} y2={CLOCK.y - 30 * Math.cos(4.2)} stroke={colors.text} strokeWidth={5} strokeLinecap="round" />
            <path d={`M${CLOCK.x},${CLOCK.y - 40} A40,40 0 1 1 ${CLOCK.x + 40 * Math.sin(4.2)},${CLOCK.y - 40 * Math.cos(4.2)}`} fill="none" stroke={tint(K.t, 0.35)} strokeWidth={8} />
          </g>
        ) : null}

        {/* hai kiến (b05) + ảnh mờ + mũi tên vận tốc */}
        {st.twoO > 0 ? (
          <g opacity={st.twoO}>
            {[0.25, 0.5, 0.75].map((k) =>
              st.twoRun > k + 0.12 ? (
                <React.Fragment key={k}>
                  <Ant {...twoAt(DIR_A, k)} angle={angA} o={0.18} mark={false} />
                  <Ant {...twoAt(DIR_B, k)} angle={angB} o={0.18} mark={false} />
                </React.Fragment>
              ) : null,
            )}
            <Ant x={left.x} y={left.y} angle={angA} o={1} step={st.twoRun < 1 ? step : 0} />
            <Ant x={right.x} y={right.y} angle={angB} o={1} step={st.twoRun < 1 ? step : 0} />
            <Arrow a={arA.a} b={arA.b} color={K.d} o={st.arrows} w={8 + 4 * pulse(st.lenHi)} head={22 + 8 * pulse(st.tipHi)} />
            <Arrow a={arB.a} b={arB.b} color={K.d} o={st.arrows} w={8 + 4 * pulse(st.lenHi)} head={22 + 8 * pulse(st.tipHi)} />
          </g>
        ) : null}

        {/* kiến chính */}
        <Ant x={A.x} y={A.y} angle={angle} o={st.antO} carry={st.carry} step={step} />
      </Layer>

      <BigQuestion x={(NEST.x + proj({ x: FOODW[0], y: FOODW[1] }).x) / 2} y={(NEST.y + proj({ x: FOODW[0], y: FOODW[1] }).y) / 2 - 80} p={st.q} />

      {/* công thức: đặt tên ở cuối, gắn vào thứ đã thấy */}
      <MT
        x={FXL}
        y={118}
        text={`tốc độ trung bình: $v = \\dfrac{${col(st.sHi > 0.5 ? K.s : null, "s")}}{${col(st.tHi > 0.5 ? K.t : null, "t")}}$`}
        o={st.f1}
      />
      <MT
        x={FXL}
        y={238}
        text={`vận tốc trung bình: $${col(st.vecHi > 0.5 ? K.d : null, "\\vec v")} = \\dfrac{${col(st.dHi > 0.5 ? K.d : null, "\\vec d")}}{${col(st.tHi > 0.5 ? K.t : null, "t")}}$`}
        o={st.f2}
      />

      <AutoLabels items={labels} obstacles={obst} bounds={{ x: 100, y: 110, w: 1730, h: 810 }} />
      {fixed.map((f) => (
        <div
          key={f.text}
          data-text="label"
          style={{ ...label, position: "absolute", left: f.x, top: f.y, translate: f.center ? "-50% 0" : "0 0", fontSize: 44, color: f.color, opacity: f.o, whiteSpace: "nowrap", textShadow: halo(SAND) }}
        >
          {f.text}
        </div>
      ))}
      {/* chú thích hai bản kéo thẳng */}
      {/* "kéo thẳng ra": đứng yên một chỗ (không bám theo đầu sợi chỉ đang dài ra / camera đang lùi) */}
      <div data-text="label" style={{ ...label, position: "absolute", left: STRAIGHT.x, top: STRAIGHT.yS - 78, color: K.s, opacity: st.copySLab, whiteSpace: "nowrap", textShadow: halo() }}>
        kéo thẳng ra
      </div>
      <div data-text="label" style={{ ...label, position: "absolute", left: STRAIGHT.x - 20, top: STRAIGHT.yS - 24, translate: "-100% 0", color: K.s, opacity: st.copyS, whiteSpace: "nowrap", textShadow: halo() }}>
        sợi chỉ
      </div>
      <div data-text="label" style={{ ...label, position: "absolute", left: STRAIGHT.x - 20, top: STRAIGHT.yD - 24, translate: "-100% 0", color: K.d, opacity: st.copyD, whiteSpace: "nowrap", textShadow: halo() }}>
        dây chun
      </div>
    </>
  );
};

// ---------------- CẢNH 2: đời sống ----------------
const PHONE = { w: 380, h: 600, top: 190 };
const POOLR = { x: 1150, y: 340, w: 660, h: 300 };
const SKIN = "#EDBE95";
const WATER = "#CFE3FB";

/**
 * Người bơi sải nhìn từ trên xuống, quay về +x, gốc ở giữa thân (chỗ buộc dây chun).
 * Hai tay quạt luân phiên, chân đập nước, bọt trắng sau chân và quanh tay vừa chạm nước.
 */
const Swimmer: React.FC<{ x: number; y: number; facing: number; fr: number; moving: boolean; o: number }> = ({ x, y, facing, fr, moving, o }) => {
  const ph = moving ? fr * 0.2 : 0.4;
  // tay quay quanh vai: nửa vòng quạt dưới nước (sát thân), nửa vòng vung trên mặt nước (xoè ra ngoài);
  // hai tay lệch nhau nửa vòng nên lúc nào cũng có một tay vươn hoặc vung ra, không bao giờ cùng chập dưới vai
  const arm = (side: 1 | -1, k: number) => {
    const th = (ph + k) % (2 * Math.PI);
    const pull = th < Math.PI;
    const s = Math.abs(Math.sin(th));
    return { sx: 20, sy: side * 17, hx: 20 + 64 * Math.cos(th), hy: side * (17 + (pull ? 12 : 46) * s), pull };
  };
  const a1 = arm(1, 0);
  const a2 = arm(-1, Math.PI);
  const kick = moving ? Math.sin(fr * 0.9) * 6 : 0;
  const foam = moving ? 1 : 0;
  return (
    <g data-mark="swimmer" transform={`translate(${x}, ${y}) rotate(${facing}) scale(1.4)`} opacity={o}>
      {/* vệt nước sau chân */}
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={-104 - i * 22} cy={(i % 2 ? 1 : -1) * 4} rx={16 - i * 3} ry={9 - i * 2} fill="#FFFFFF" opacity={foam * (0.85 - i * 0.25)} />
      ))}
      {/* chân */}
      <path d={`M-34,-8 L-86,${-10 + kick}`} stroke={SKIN} strokeWidth={13} strokeLinecap="round" />
      <path d={`M-34,8 L-86,${10 - kick}`} stroke={SKIN} strokeWidth={13} strokeLinecap="round" />
      {/* tay ở dưới thân */}
      {[a1, a2].map((a, i) => (
        <g key={i}>
          <path d={`M${a.sx},${a.sy} L${a.hx},${a.hy}`} stroke={SKIN} strokeWidth={12} strokeLinecap="round" opacity={a.pull ? 0.75 : 1} />
          <circle cx={a.hx} cy={a.hy} r={7.5} fill={SKIN} opacity={a.pull ? 0.75 : 1} />
          {a.pull && a.hx > 70 ? <circle cx={a.hx + 10} cy={a.hy} r={10} fill="#FFFFFF" opacity={0.85 * foam} /> : null}
        </g>
      ))}
      {/* thân: vai rộng, thon dần về hông */}
      <path d="M26,-24 Q34,0 26,24 L-30,15 Q-40,0 -30,-15 Z" fill={SKIN} />
      {/* quần bơi */}
      <path d="M-24,-15 L-42,-12 Q-48,0 -42,12 L-24,15 Z" fill={K.ant} />
      {/* đầu: mũ bơi + kính */}
      <ellipse cx={46} cy={0} rx={17} ry={14} fill={K.ant} />
      <path d="M44,-13 Q56,0 44,13" stroke={colors.text} strokeWidth={2.5} fill="none" />
      <ellipse cx={56} cy={-6} rx={4} ry={5} fill={colors.text} />
      <ellipse cx={56} cy={6} rx={4} ry={5} fill={colors.text} />
      {/* gợn nước quanh đầu */}
      <path d="M66,-20 Q78,0 66,20" stroke="#FFFFFF" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.9 * foam} />
    </g>
  );
};

const Phone: React.FC<{ left: number; o: number; title: string; children: React.ReactNode }> = ({ left, o, title, children }) =>
  o <= 0 ? null : (
    <div style={{ position: "absolute", left, top: PHONE.top, width: PHONE.w, height: PHONE.h, opacity: o }}>
      <div data-box style={{ position: "absolute", inset: 0, borderRadius: 44, background: colors.text, padding: 14 }}>
        <div style={{ position: "absolute", inset: 14, borderRadius: 32, background: "#FFFFFF", overflow: "hidden" }}>
          <div data-text="card" style={{ ...label, position: "absolute", left: 24, top: 22, fontSize: 36, color: colors.muted }}>
            {title}
          </div>
          {children}
        </div>
      </div>
    </div>
  );

/** Đường chạy ngoằn ngoèo trên bản đồ app (toạ độ trong màn hình điện thoại). */
const ROUTE: [number, number][] = [
  [40, 500],
  [90, 430],
  [60, 360],
  [130, 320],
  [210, 370],
  [250, 300],
  [200, 230],
  [120, 250],
  [100, 190],
  [180, 150],
  [270, 180],
  [280, 260],
  [250, 330],
];
const routeD = (k: number) => {
  const n = Math.max(1, Math.round(k * (ROUTE.length - 1)));
  return ROUTE.slice(0, n + 1)
    .map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1] + 90}`)
    .join(" ");
};

export const Life: React.FC<{ st: St }> = ({ st }) => {
  // vị trí cuối: trái 230, giữa 690, bể bơi bên phải; trước đó cụm đang có đứng giữa khung
  const pl = lerp(lerp(770, 540, st.slide1), 180, st.slide2);
  const pm = lerp(1000, 640, st.slide2);
  // bể bơi: bơi sang thành bên kia rồi về (swim 0 → 1)
  const sx = st.swim < 0.5 ? st.swim * 2 : 2 - st.swim * 2;
  // chỗ xuất phát: giữa thân người bơi lúc chân chạm thành bể
  const start = { x: POOLR.x + 150, y: POOLR.y + POOLR.h / 2 };
  const swimmer = { x: lerp(start.x, POOLR.x + POOLR.w - 150, sx), y: start.y };
  const facing = st.swim < 0.5 ? 0 : 180;
  const moving = st.swim > 0.01 && st.swim < 0.99;
  return (
    <>
      <Phone left={pl} o={st.phoneL} title="app chạy bộ">
        <svg width={PHONE.w - 28} height={PHONE.h - 28} style={{ position: "absolute", inset: 0 }}>
          {[150, 260, 370, 480].map((y) => (
            <line key={y} x1={0} x2={PHONE.w} y1={y + 90} y2={y + 70} stroke="#E8ECF4" strokeWidth={10} />
          ))}
          <path d={routeD(st.route)} fill="none" stroke={K.s} strokeWidth={st.routeHi > 0.5 ? 9 : 6} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <div data-text="label" style={{ ...label, position: "absolute", left: 24, top: 86, fontSize: 44, fontWeight: 800, whiteSpace: "nowrap", color: K.s, opacity: st.phoneL }}>
          đã chạy 5 km
        </div>
      </Phone>
      <Phone left={pm} o={st.phoneM} title="bản đồ">
        <svg width={PHONE.w - 28} height={PHONE.h - 28} style={{ position: "absolute", inset: 0 }}>
          {[150, 260, 370, 480].map((y) => (
            <line key={y} x1={0} x2={PHONE.w} y1={y + 70} y2={y + 90} stroke="#E8ECF4" strokeWidth={10} />
          ))}
          <line x1={70} y1={520} x2={lerp(70, 250, st.line)} y2={lerp(520, 240, st.line)} stroke={K.d} strokeWidth={st.lineHi > 0.5 ? 11 : 8} strokeLinecap="round" />
          <circle data-mark="home" cx={70} cy={520} r={14} fill={colors.text} />
          {st.line > 0.95 ? <circle data-mark="you" cx={250} cy={240} r={14} fill={K.ant} /> : null}
        </svg>
        <div data-text="label" style={{ ...label, position: "absolute", left: 24, top: 86, fontSize: 44, fontWeight: 800, whiteSpace: "nowrap", color: K.d, opacity: st.phoneM }}>
          cách nhà 2 km
        </div>
        <div data-text="label" style={{ ...label, position: "absolute", left: 98, top: 516, fontSize: 36, opacity: st.phoneM }}>
          nhà
        </div>
      </Phone>
      {st.pool > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: st.pool }}>
          <Layer>
            {/* thành bể + nước */}
            <rect x={POOLR.x - 18} y={POOLR.y - 18} width={POOLR.w + 36} height={POOLR.h + 36} rx={18} fill="#FFFFFF" stroke={colors.panelBorder} strokeWidth={3} />
            <rect x={POOLR.x} y={POOLR.y} width={POOLR.w} height={POOLR.h} rx={8} fill={WATER} />
            {/* gợn nước trôi chậm */}
            {[0.22, 0.5, 0.78].map((k, i) => {
              const y = POOLR.y + POOLR.h * k;
              const dx = ((st.fr * 0.6 + i * 70) % 140) - 70;
              return (
                <path
                  key={k}
                  d={`M${POOLR.x + 40 + dx},${y} q25,-8 50,0 t50,0 M${POOLR.x + 300 + dx},${y + 10} q25,-8 50,0 t50,0`}
                  stroke="#FFFFFF"
                  strokeWidth={3}
                  fill="none"
                  opacity={0.55}
                />
              );
            })}
            {/* dây phao chia làn */}
            {[POOLR.y + 40, POOLR.y + POOLR.h - 40].map((y) => (
              <g key={y}>
                <line x1={POOLR.x} x2={POOLR.x + POOLR.w} y1={y} y2={y} stroke={colors.axis} strokeWidth={2} />
                {Array.from({ length: Math.floor(POOLR.w / 28) }).map((_, i) => (
                  <circle key={i} cx={POOLR.x + 14 + i * 28} cy={y} r={8} fill={i % 4 < 2 ? "#FFFFFF" : tint(colors.brandBlue, 0.8)} stroke={colors.axis} strokeWidth={1.5} />
                ))}
              </g>
            ))}
            {/* hai thành đầu bể */}
            <rect x={POOLR.x - 6} y={POOLR.y} width={12} height={POOLR.h} fill={colors.text} />
            <rect x={POOLR.x + POOLR.w - 6} y={POOLR.y} width={12} height={POOLR.h} fill={colors.text} />
            {/* dây chun: từ chỗ xuất phát tới người bơi (vẽ dưới người bơi) */}
            {Math.abs(swimmer.x - start.x) > 8 ? <line x1={start.x} y1={start.y} x2={swimmer.x} y2={swimmer.y} stroke={K.d} strokeWidth={12} strokeLinecap="round" /> : null}
            <Swimmer x={swimmer.x} y={swimmer.y} facing={facing} fr={st.fr} moving={moving} o={lerp(1, 0.4, st.poolDot)} />
            <circle cx={start.x} cy={start.y} r={13 + 9 * st.poolDot} fill={K.d} stroke="#FFFFFF" strokeWidth={3} />
          </Layer>
          <div data-text="label" style={{ ...label, position: "absolute", left: POOLR.x + POOLR.w / 2, top: POOLR.y - 96, translate: "-50% 0", fontSize: 44, fontWeight: 700, textShadow: halo() }}>
            bơi 100 m
          </div>
        </div>
      ) : null}
    </>
  );
};
