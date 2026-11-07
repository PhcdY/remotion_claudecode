import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, clamp, ramp } from "../../components/BeatShell";
import { AutoLabelItem } from "../../components/labels";
import { MathText, Tex } from "../../components/MathText";
import { col, fadeIn } from "../../components/parts";
import { colors, fontSize } from "../../components/theme";
import {
  G2,
  G3,
  D_END,
  D_START,
  G_BIG,
  Frac,
  Graph2,
  Graph3,
  HillBar,
  HillState,
  K,
  Lit,
  SideCard,
  TB,
  UP_SEC,
  allowSec,
  gPanel,
  mixGeo,
  pulse,
} from "./scene";

// Mỗi beat dựng trạng thái từ trạng thái CUỐI của beat trước (gọi hàm của beat trước với frame rất lớn),
// nên hai beat cùng cảnh nối liền, không nháy (skill dung-video › Cảnh liền mạch).

const END = 1e9;
const Z = new Array(12).fill(0);
const In = (fr: number, a: number, d = 15) => fadeIn(fr, a, d);
const Out = (fr: number, a: number, d = 12) => 1 - fadeIn(fr, a, d);
/** Tiến độ tuyến tính 0 → 1 trong [a, b]. */
const lin = (fr: number, a: number, b: number) => seg(fr, a, Math.max(b, a + 1), 0, 1);
const C_ = (p: BeatProps) => p.C ?? p.L;
/** Công thức không bị tách khi xuống dòng. */
const NW: React.CSSProperties = { whiteSpace: "nowrap" };
/** Nội suy theo frame, an toàn cả khi mốc giả (trạng thái cuối beat trước) làm khoảng bị ngược. */
const seg = (fr: number, a: number, b: number, from: number, to: number) =>
  interpolate(fr, [a, Math.max(b, a + 1)], [from, to], clamp);

const TARGET = ["mục tiêu 60 km/h", "mục tiêu 59 km/h", "60 km/h: tiệm cận"];
const ALLOW = ["mức cho phép (60 km/h)", "cho phép: 2 phút 2 s"];
const fmt0 = (v: number) => String(Math.round(v));

// ======================= CẢNH 1 =======================
const h01 = (fr: number, L: number[], E: number[], C: number[]): HillState => {
  const k = lin(fr, L[1] + 6, E[1] - 6);
  const d = D_START + (1 - D_START) * k;
  return {
    geo: G_BIG,
    car: { d, o: In(fr, L[0]) },
    climbTo: Math.max(d, 0),
    descentTo: 0,
    km: In(fr, L[0]),
    speedUp: In(fr, L[1] + 10),
    question: In(fr, C[2]),
    target: { steps: TARGET, step: 0, o: In(fr, C[2]) },
    bar: { o: 0, up: 0 },
  };
};

const Beat01: React.FC<BeatProps> = (p) => {
  const fr = useCurrentFrame();
  return <HillBar {...h01(fr, p.L, p.E, C_(p))} />;
};

const h02 = (fr: number, L: number[], E: number[]): HillState => {
  const s = h01(END, Z, Z, Z);
  const dd = lin(fr, L[2] + 6, E[2] - 6);
  const down = 40 * dd;
  return {
    ...s,
    calc: In(fr, L[0]) * Out(fr, L[1]),
    question: Out(fr, L[2]),
    downSpeed: { text: "90 km/h", o: In(fr, L[2] + 6) },
    car: { d: 1 + (D_END - 1) * dd, o: 1 },
    descentTo: Math.min(1, dd * (D_END - 1)),
    bar: {
      o: In(fr, L[1], 10),
      up: UP_SEC * ramp(fr, L[1] + 4, L[1] + 40),
      upLabel: In(fr, L[1] + 30),
      down,
      downLabel: { steps: [`${fmt0(down)} s`], step: 0, o: dd > 0.05 ? 1 : 0 },
      total: { text: "2 phút 40 s", o: In(fr, L[3]) },
    },
  };
};

const Beat02: React.FC<BeatProps> = (p) => {
  const fr = useCurrentFrame();
  return <HillBar {...h02(fr, p.L, p.E)} />;
};

// ======================= CẢNH 2 (câu chuyện) =======================
const COL2 = { x: 1220, w: 610 };
const L60 = ["mục tiêu 60", "tiệm cận ngang"];

/** Khung con dốc nhỏ ở cột phải, giữ đúng trạng thái cuối CẢNH 1. */
const panel2 = (py: number): HillState => {
  const s = h02(END, Z, Z);
  return { ...s, geo: gPanel(COL2.x, py, COL2.w), calc: 0, question: 0, bar: { ...s.bar, total: undefined, downLabel: { steps: ["40 s"], step: 0, o: 0 } } };
};

/** Mọi nhãn neo của CẢNH 2 phần câu chuyện; từng beat chỉ đổi độ mờ / bước. */
type L2 = Partial<Record<"p90" | "p150" | "v900" | "p900" | "g90" | "g150" | "g900" | "cur" | "tm" | "l60", number>>;
const labels2 = (o: L2, extra: { g900Step?: number; curV?: number; curStep?: number; l60Step?: number } = {}): AutoLabelItem[] => {
  const cv = extra.curV ?? 900;
  const big = 44;
  return [
    { id: "l60", x: 1000, y: 60, text: "", steps: L60, step: extra.l60Step ?? 0, color: K.target, size: big, opacity: o.l60 ?? 0, prefer: ["n", "nw"], anchor: "region" },
    { id: "p90", x: 90, y: 45, text: "$(90;\\, 45)$", size: big, opacity: o.p90 ?? 0, prefer: ["s", "sw"], phases: ["p90"] },
    { id: "p150", x: 150, y: 50, text: "$(150;\\, 50)$", size: big, opacity: o.p150 ?? 0, prefer: ["s", "se"], phases: ["p150"] },
    { id: "v900", x: 900, y: 0, text: "$v = 900$", size: big, opacity: o.v900 ?? 0, prefer: ["nw", "n"] },
    { id: "p900", x: 900, y: TB(900), text: "$58{,}1$", size: big, opacity: o.p900 ?? 0, prefer: ["s", "se"], phases: ["p900"] },
    { id: "g90", x: 90, y: 52.5, text: "15", color: K.gap, weight: 700, opacity: o.g90 ?? 0, prefer: ["w"], anchor: "region" },
    { id: "g150", x: 150, y: 55, text: "10", color: K.gap, weight: 700, opacity: o.g150 ?? 0, prefer: ["e"], anchor: "region" },
    {
      id: "g900",
      text: "",
      x: 900,
      y: 59,
      steps: ["khoảng cách tới 60: $1{,}9$", "khoảng cách tới 60: $1{,}9$ ?"],
      step: extra.g900Step ?? 0,
      color: K.gap,
      size: big,
      opacity: o.g900 ?? 0,
      prefer: ["sw", "s", "w"],
      anchor: "region",
    },
    {
      id: "cur",
      text: "",
      x: cv,
      y: TB(cv) - 9,
      steps: ["$v_{tb} < 60$", "$v_{tb} \\to 60$"],
      step: extra.curStep ?? 0,
      color: K.gap,
      size: big,
      opacity: o.cur ?? 0,
      prefer: ["nw", "n"],
      anchor: "region",
    },
    { id: "tm", x: 930, y: 8, text: "tăng mãi", color: K.main, size: big, opacity: o.tm ?? 0, prefer: ["nw", "n"], anchor: "region" },
  ];
};

const g03 = (fr: number, L: number[]): G2 => ({
  m: 0,
  axesO: In(fr, L[0]),
  titles: 0,
  right: 0,
  line60: In(fr, L[2]),
  pts: [
    { id: "p90", v: 90, o: In(fr, L[0] + 10) },
    { id: "p150", v: 150, o: In(fr, L[1]) },
  ],
  labels: labels2({ p90: In(fr, L[0] + 10) * Out(fr, L[1]), p150: In(fr, L[1]), l60: In(fr, L[2]) }),
});

const Beat03: React.FC<BeatProps> = (p) => {
  const fr = useCurrentFrame();
  return (
    <>
      <HillBar {...panel2(250)} o={In(fr, 0, 10)} />
      <Graph2 {...g03(fr, p.L)} />
    </>
  );
};

const g04 = (fr: number, L: number[], E: number[]): G2 => {
  const s = g03(END, Z);
  const pa = E[0];
  const pd = Math.max(L[1] - E[0], 20);
  const gapO = In(fr, L[2]);
  return {
    ...s,
    giong: { o: In(fr, L[0]) * Out(fr, L[1]), hiA: pulse(fr, pa, pd / 2), hiB: pulse(fr, pa + pd / 2, pd / 2) },
    pts: [...(s.pts ?? []), { id: "p900", v: 900, o: In(fr, L[1]) }],
    gaps: [
      { id: "g90", v: 90, o: gapO, color: K.gap },
      { id: "g150", v: 150, o: gapO, color: K.gap },
      { id: "g900", v: 900, o: gapO, color: K.gap },
    ],
    right: lin(fr, L[3] + 4, E[3] - 4),
    labels: labels2({
      l60: 1,
      p90: 0,
      p150: Out(fr, L[2]),
      v900: In(fr, L[0]) * Out(fr, L[1]),
      p900: In(fr, L[1]) * Out(fr, L[2]),
      g90: gapO,
      g150: gapO,
      g900: gapO,
    }),
  };
};

const Beat04: React.FC<BeatProps> = (p) => {
  const fr = useCurrentFrame();
  return (
    <>
      <HillBar {...panel2(250)} />
      <Graph2 {...g04(fr, p.L, p.E)} />
    </>
  );
};

/** Trạng thái khung con dốc ở b05 (cột phải dưới, có vạch cho phép). */
const h05 = (fr: number, L: number[]): HillState => {
  const py = interpolate(ramp(fr, L[1], L[1] + 20), [0, 1], [250, 470]);
  const s = panel2(py);
  const glow = pulse(fr, L[5], 26) + pulse(fr, L[5] + 30, 26);
  return {
    ...s,
    slopeGlow: In(fr, L[2]) * Out(fr, L[3]),
    bar: {
      ...s.bar,
      frame: In(fr, L[3]) * Out(fr, L[4]),
      upGlow: glow,
      allow: { sec: UP_SEC, o: In(fr, L[4]), glow, steps: ALLOW, step: 0 },
    },
  };
};

const g05 = (fr: number, L: number[]): G2 => {
  const s = g04(END, Z, Z);
  const dimG = Out(fr, L[0]);
  const g900Glow = pulse(fr, L[0], 24) + pulse(fr, L[0] + 28, 24);
  return {
    ...s,
    gaps: [
      { id: "g90", v: 90, o: dimG, color: K.gap },
      { id: "g150", v: 150, o: dimG, color: K.gap },
      { id: "g900", v: 900, o: 1, color: K.gap, w: 7 + 6 * g900Glow },
    ],
    labels: labels2({ l60: 1, g90: dimG, g150: dimG, g900: 1 }, { g900Step: ramp(fr, L[0], L[0] + 10) }),
  };
};

/** Thẻ công thức tốc độ trung bình (b05–b06). */
const AvgCard: React.FC<{ o: number; tu: number; mau: number }> = ({ o, tu, mau }) => (
  <SideCard left={COL2.x} top={130} width={COL2.w} o={o} group="avg">
    <div data-text="formula" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
      <MathText text="$v_{tb} =$" />
      <Frac num={<Lit on={tu} color={K.num}>tổng quãng đường</Lit>} den={<Lit on={mau} color={K.den}>tổng thời gian</Lit>} />
    </div>
    <div style={{ marginTop: 10, minHeight: 104 }}>
      <div data-text="label" style={{ color: K.num, opacity: tu, fontSize: 40, fontWeight: 700 }}>
        2 km
      </div>
      <div data-text="label" style={{ color: K.den, opacity: mau, fontSize: 40, fontWeight: 700 }}>
        2 phút + thời gian xuống
      </div>
    </div>
  </SideCard>
);

const Beat05: React.FC<BeatProps> = (p) => {
  const fr = useCurrentFrame();
  const L = p.L;
  return (
    <>
      <HillBar {...h05(fr, L)} />
      <AvgCard o={In(fr, L[1] + 10)} tu={In(fr, L[2])} mau={In(fr, L[3])} />
      <Graph2 {...g05(fr, L)} />
    </>
  );
};

/** b06: thời gian xuống (s) theo frame — co 40 → 24 → 4 ở dòng 1, 4 → 0,4 ở dòng 2. */
const t06 = (fr: number, L: number[], E: number[]) => {
  const mid = (L[0] + E[0]) / 2;
  if (fr < mid) return seg(fr, L[0] + 6, mid - 10, 40, 24);
  if (fr < L[1]) return seg(fr, mid, E[0] - 6, 24, 4);
  return seg(fr, L[1] + 4, L[1] + 30, 4, 0.4);
};
/** Tốc độ xuống của điểm đang xét: theo khúc xuống ở dòng 1, đứng ở 900, rồi trượt tới 1000 ở dòng 5. */
const v06 = (fr: number, L: number[], E: number[]) => {
  if (fr < L[1]) return 3600 / t06(fr, L, E);
  return seg(fr, L[4] + 4, E[4] - 6, 900, 1000);
};

const h06 = (fr: number, L: number[], E: number[]): HillState => {
  const s = h05(END, Z);
  const t = t06(fr, L, E);
  const glow = pulse(fr, L[5], 26) + pulse(fr, L[5] + 30, 26);
  return {
    ...s,
    slopeGlow: 0,
    bar: {
      ...s.bar,
      upGlow: glow,
      down: t,
      downLabel: { steps: [`${fmt0(Math.max(t, 4))} s`, "> 0"], step: ramp(fr, L[1] + 20, L[1] + 32), o: 1 },
      total: { text: "hơn 2 phút", o: In(fr, L[2]), glow: In(fr, L[2]) },
      allow: { sec: UP_SEC, o: 1, glow, steps: ALLOW, step: 0 },
    },
  };
};

const g06 = (fr: number, L: number[], E: number[]): G2 => {
  const s = g05(END, Z);
  const fadeOld = Out(fr, L[0]);
  const v = v06(fr, L, E);
  const hi = In(fr, L[3]);
  return {
    ...s,
    pts: [
      { id: "p90", v: 90, o: fadeOld },
      { id: "p150", v: 150, o: fadeOld },
      { id: "p900", v: 900, o: fadeOld },
      { id: "cur", v, o: In(fr, L[0]), color: K.target },
    ],
    gaps: [
      { id: "g900", v: 900, o: fadeOld, color: K.gap },
      { id: "cur", v, o: In(fr, L[0]), color: hi > 0.5 ? K.gap : K.dim, w: 7 + 3 * hi },
    ],
    labels: labels2({ l60: 1, g900: fadeOld, cur: hi }, { g900Step: 1, curV: v, curStep: ramp(fr, L[4], L[4] + 12) }),
  };
};

const Beat06: React.FC<BeatProps> = (p) => {
  const fr = useCurrentFrame();
  return (
    <>
      <HillBar {...h06(fr, p.L, p.E)} />
      <AvgCard o={1} tu={1} mau={1} />
      <Graph2 {...g06(fr, p.L, p.E)} />
    </>
  );
};

const g07 = (fr: number, L: number[]): G2 => {
  const s = g06(END, Z, Z);
  return {
    ...s,
    titles: ramp(fr, L[4], L[4] + 20),
    arrowGlow: In(fr, L[1]),
    line60Glow: In(fr, L[3]) * 0.6,
    gaps: [{ id: "cur", v: 1000, o: 1, color: K.gap, w: 7 + 4 * pulse(fr, L[2], 30) }],
    labels: labels2(
      { l60: 1, cur: Out(fr, L[2]), tm: In(fr, L[1]) * Out(fr, L[4]) },
      { curV: 1000, curStep: 1, l60Step: ramp(fr, L[3], L[3] + 14) },
    ),
  };
};

/** Thẻ giới hạn (b07) và định nghĩa SGK tiệm cận ngang (b07, b11). */
const LimH: React.FC<{ o: number; a: number; b: number }> = ({ o, a, b }) => (
  <SideCard left={COL2.x} top={330} width={COL2.w} o={o} group="limh">
    <div data-text="formula" style={{ display: "flex", justifyContent: "center", fontSize: 52 }}>
      <MathText text={`$\\lim\\limits_{${col(a > 0.5 ? K.main : null, "v \\to +\\infty")}} v_{tb} ${col(b > 0.5 ? K.target : null, "= 60")}$`} />
    </div>
  </SideCard>
);

const DefH: React.FC<{ o: number; left: number; top: number; minus: number; minusOn: number; plusOn: number }> = ({ o, left, top, minus, minusOn, plusOn }) => (
  <SideCard left={left} top={top} width={COL2.w} o={o} group="defh">
    <div data-text="def" style={{ fontSize: fontSize.label, fontWeight: 500, lineHeight: 1.5 }}>
      Đường thẳng <Tex tex="y = y_0" style={NW} /> là <b>tiệm cận ngang</b> của đồ thị hàm số <Tex tex="y = f(x)" style={NW} /> nếu{" "}
      <Lit on={plusOn} color={K.target}>
        <Tex tex="\lim\limits_{x \to +\infty} f(x) = y_0" />
      </Lit>{" "}
      <Lit on={minusOn} color={K.target} dim={minus}>
        hoặc <Tex tex="\lim\limits_{x \to -\infty} f(x) = y_0" />
      </Lit>
    </div>
  </SideCard>
);

const Beat07: React.FC<BeatProps> = (p) => {
  const fr = useCurrentFrame();
  const L = p.L;
  return (
    <>
      <HillBar {...h06(END, Z, Z)} o={Out(fr, L[0])} />
      <AvgCard o={Out(fr, L[0])} tu={1} mau={1} />
      <LimH o={In(fr, L[0] + 8) * Out(fr, L[5])} a={In(fr, L[1])} b={In(fr, L[2])} />
      <DefH o={In(fr, L[5] + 6)} left={COL2.x} top={250} minus={1} minusOn={0} plusOn={In(fr, L[5] + 6)} />
      <Graph2 {...g07(fr, L)} />
    </>
  );
};

// ======================= CẢNH 3 =======================
const COL3 = { x: 1150, w: 680 };
const P3PANEL = gPanel(COL3.x, 130, COL3.w);

const h08 = (fr: number, L: number[]): HillState => {
  const dd = lin(fr, L[2] + 4, L[2] + 24);
  const mix = ramp(fr, L[3], L[3] + 24);
  const al = allowSec(59);
  return {
    geo: mixGeo(G_BIG, P3PANEL, mix),
    car: { d: 1 + (D_END - 1) * dd, o: 1 },
    climbTo: 1,
    descentTo: Math.min(1, dd * (D_END - 1)),
    km: 1,
    target: { steps: TARGET, step: ramp(fr, L[0], L[0] + 14), o: 1 },
    carNote: { text: "$\\approx 1770$ km/h", o: In(fr, L[2] + 18) * Out(fr, L[3]) },
    bar: {
      o: 1,
      up: UP_SEC,
      upLabel: 1,
      remain: In(fr, L[1]),
      down: (al - UP_SEC) * dd,
      allow: { sec: interpolate(ramp(fr, L[1], L[1] + 18), [0, 1], [UP_SEC, al]), o: 1, steps: ALLOW, step: ramp(fr, L[1] + 10, L[1] + 24) },
    },
  };
};

type L3 = Partial<Record<"p59" | "q" | "seg" | "from" | "tcd" | "x0", number>>;
const labels3 = (o: L3, a = 59.5): AutoLabelItem[] => [
  { id: "p59", x: 59, y: 1770, text: "$(59;\\, 1770)$", opacity: o.p59 ?? 0, prefer: ["w", "nw"] },
  { id: "q", x: 58, y: 1200, text: "?", color: K.target, size: 64, weight: 800, opacity: o.q ?? 0, prefer: ["w"], anchor: "region" },
  { id: "seg", x: (a + 60) / 2, y: 0, text: "$60 - A \\to 0$", color: K.den, size: 44, opacity: o.seg ?? 0, prefer: ["nw", "n"], anchor: "region" },
  { id: "from", x: a, y: 0, text: "từ bên trái", color: K.target, size: 44, opacity: o.from ?? 0, prefer: ["nw", "n"] },
  { id: "tcd", x: 59.6, y: 1400, text: "tiệm cận đứng", color: K.target, size: 44, opacity: o.tcd ?? 0, prefer: ["w", "nw"], anchor: "region" },
  { id: "x0", x: 64, y: 150, text: "$x_0 = 60$", color: K.target, size: 44, opacity: o.x0 ?? 0, prefer: ["e", "ne"], anchor: "region" },
];

const g08 = (fr: number, L: number[], E: number[]): G3 => ({
  axesO: In(fr, L[3] + 14),
  titles: 0,
  curve: lin(fr, L[4] + 4, E[4] - 4),
  pts: [{ id: "p59", a: 59, o: In(fr, L[3] + 20) }],
  labels: labels3({ p59: In(fr, L[3] + 20) }),
});

const Beat08: React.FC<BeatProps> = (p) => {
  const fr = useCurrentFrame();
  return (
    <>
      <HillBar {...h08(fr, p.L)} />
      <Graph3 {...g08(fr, p.L, p.E)} />
    </>
  );
};

/** b09: mục tiêu A theo frame (chấm trên trục ngang). */
const a09 = (fr: number, L: number[], E: number[]) => {
  if (fr < L[2]) return seg(fr, L[1] + 10, E[1] - 6, 45, 55);
  return seg(fr, L[2] + 4, E[2] - 6, 55, 59.5);
};

const h09 = (fr: number, L: number[], E: number[]): HillState => {
  const s = h08(END, Z);
  const started = In(fr, L[1], 10);
  const a = a09(fr, L, E);
  const al = interpolate(started, [0, 1], [allowSec(59), allowSec(a)]);
  return {
    ...s,
    carNote: undefined,
    target: s.target ? { ...s.target, o: Out(fr, L[1]) } : undefined,
    bar: {
      ...s.bar,
      down: al - UP_SEC,
      remain: 1,
      downLabel: { steps: ["$\\to 0$"], step: 0, o: In(fr, L[2]) },
      allow: { sec: al, o: 1, steps: ALLOW, step: 1, labelO: Out(fr, L[1]) },
    },
  };
};

const g09 = (fr: number, L: number[], E: number[]): G3 => {
  const s = g08(END, Z, Z);
  const a = a09(fr, L, E);
  const runA = seg(fr, L[3] + 4, L[3] + 40, 45, 59.5);
  return {
    ...s,
    curveGlow: pulse(fr, L[0], 26) + pulse(fr, L[0] + 30, 26),
    pts: [
      { id: "p59", a: 59, o: Out(fr, L[1]) },
      { id: "run", a: runA, o: In(fr, L[3]) * Out(fr, L[7]), color: K.target, arrow: 1 },
    ],
    aDot: { a, o: In(fr, L[1]) },
    aSeg: { a, o: In(fr, L[5]) },
    column: { a, o: In(fr, L[7]) },
    labels: labels3({ p59: Out(fr, L[1]), q: In(fr, L[0]) * Out(fr, L[1]), seg: In(fr, L[5]) }, a),
  };
};

/** Thẻ công thức tốc độ phải xuống (b09, b10). */
const NeedCard: React.FC<{ o: number; top: number; tu: number; mau: number; row?: number }> = ({ o, top, tu, mau, row = 1 }) => (
  <SideCard left={COL3.x} top={top} width={COL3.w} o={o} group="need">
    <div data-text="formula" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38 }}>
      <MathText text="$v =$" />
      <Frac num={<span>1 km</span>} den={<span>thời gian còn lại</span>} />
      <MathText text={`$= \\dfrac{${col(tu > 0.5 ? K.num : null, "30A")}}{${col(mau > 0.5 ? K.den : null, "60 - A")}}$`} />
    </div>
    {row > 0 ? (
      <div data-text="label" style={{ marginTop: 6, color: K.num, opacity: tu * row, fontSize: 44, fontWeight: 700, textAlign: "center" }}>
        <MathText text="$30A \approx 1800$" />
      </div>
    ) : null}
  </SideCard>
);

const Beat09: React.FC<BeatProps> = (p) => {
  const fr = useCurrentFrame();
  const L = p.L;
  return (
    <>
      <HillBar {...h09(fr, L, p.E)} />
      <NeedCard o={In(fr, L[4])} top={590} tu={In(fr, L[6])} mau={In(fr, L[5])} />
      <Graph3 {...g09(fr, L, p.E)} />
    </>
  );
};

const g10 = (fr: number, L: number[]): G3 => {
  const s = g09(END, Z, Z);
  const a = seg(fr, L[1] + 4, E10(L) - 6, 59.5, 59.97);
  return {
    ...s,
    titles: ramp(fr, L[3], L[3] + 20),
    curveGlow: 0,
    pts: [],
    aDot: { a, o: 1 },
    aSeg: { a, o: Out(fr, L[0]) },
    column: { a: 59.5, o: Out(fr, L[2]) },
    vline: In(fr, L[2]),
    labels: labels3({ from: In(fr, L[1] + 10) * Out(fr, L[3]), tcd: In(fr, L[2]), x0: In(fr, L[3]) }, a),
  };
};
/** Mốc kết thúc trượt chấm A ở dòng 2 (dòng 2 dài ~2 s). */
const E10 = (L: number[]) => L[1] + 50;

const LimV: React.FC<{ o: number; a: number }> = ({ o, a }) => (
  <SideCard left={COL3.x} top={320} width={COL3.w} o={o} group="limv">
    <div data-text="formula" style={{ display: "flex", justifyContent: "center", fontSize: 52 }}>
      <MathText text={`$\\lim\\limits_{A \\to ${col(a > 0.5 ? K.target : null, "60^-")}} v = +\\infty$`} />
    </div>
  </SideCard>
);

const DefV: React.FC<{ o: number }> = ({ o }) => {
  const cell = (t: string, on: boolean) => (
    <div style={{ padding: "0 4px", borderRadius: 12, background: on ? "rgba(61, 74, 239, 0.10)" : undefined, textAlign: "center" }}>
      <Tex tex={t} style={{ color: on ? K.target : colors.text }} />
    </div>
  );
  return (
    <SideCard left={COL3.x} top={305} width={COL3.w} o={o} group="defv">
      <div data-text="def" style={{ fontSize: fontSize.label, fontWeight: 500, lineHeight: 1.35 }}>
        Đường thẳng <Tex tex="x = x_0" style={NW} /> là <b>tiệm cận đứng</b> của đồ thị hàm số <Tex tex="y = f(x)" style={NW} /> nếu ít nhất một trong các điều kiện sau
        thỏa mãn:
      </div>
      <div data-text="def" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 2, marginTop: 8, fontSize: 36 }}>
        {cell("\\lim\\limits_{x \\to x_0^-} f(x) = +\\infty", true)}
        {cell("\\lim\\limits_{x \\to x_0^-} f(x) = -\\infty", false)}
        {cell("\\lim\\limits_{x \\to x_0^+} f(x) = +\\infty", false)}
        {cell("\\lim\\limits_{x \\to x_0^+} f(x) = -\\infty", false)}
      </div>
    </SideCard>
  );
};

const Beat10: React.FC<BeatProps> = (p) => {
  const fr = useCurrentFrame();
  const L = p.L;
  const up = ramp(fr, L[0], L[0] + 20);
  return (
    <>
      <HillBar {...h09(END, Z, Z)} o={Out(fr, L[0])} />
      <NeedCard o={1} top={interpolate(up, [0, 1], [590, 130])} tu={1} mau={1} row={1 - up} />
      <LimV o={In(fr, L[0] + 12) * Out(fr, L[4])} a={In(fr, L[1])} />
      <DefV o={In(fr, L[4] + 6)} />
      <Graph3 {...g10(fr, L)} />
    </>
  );
};

// ======================= CẢNH 2 (đề thi) =======================
type LE = Partial<Record<"l60" | "y60" | "x30" | "pinf" | "sL" | "sR", number>>;
const labelsE = (o: LE): AutoLabelItem[] => [
  { id: "l60", x: 120, y: 60, text: "tiệm cận ngang", color: K.target, size: 44, opacity: o.l60 ?? 0, prefer: ["s", "sw"], anchor: "region" },
  { id: "y60", x: -240, y: 60, text: "$y = 60$", color: K.target, size: 44, opacity: o.y60 ?? 0, prefer: ["s", "se"], anchor: "region" },
  { id: "pinf", x: -64, y: 200, text: "$\\to +\\infty$", color: K.climb, size: 44, opacity: o.pinf ?? 0, prefer: ["w"], anchor: "region" },
  { id: "sL", x: -110, y: 100, text: "mẫu âm, tử âm", color: colors.text, weight: 700, opacity: o.sL ?? 0, prefer: ["w", "sw"], anchor: "region" },
  { id: "x30", x: -30, y: -150, text: "$x = -30$", color: K.target, size: 44, opacity: o.x30 ?? 0, prefer: ["w", "nw"], anchor: "region" },
  { id: "sR", x: -24, y: -90, text: "mẫu dương, tử âm", color: colors.text, weight: 700, opacity: o.sR ?? 0, prefer: ["w", "nw"], anchor: "region" },
];

const g11 = (fr: number, L: number[], E: number[]): G2 => ({
  m: ramp(fr, L[2], L[2] + 30),
  axesO: 1,
  titles: 2,
  right: 1,
  left: lin(fr, L[3] + 4, E[3] - 4),
  line60: 1,
  pts: [{ id: "p90", v: 90, o: In(fr, L[1]) * Out(fr, L[2]), color: K.target }],
  labels: [
    ...labelsE({ l60: 1, y60: In(fr, L[4]) }),
  ],
});

/** Thẻ đề bài + dòng tính bên dưới (b11, b12). */
const ExamCard: React.FC<{ o: number; dim30: number; tu: number; mau: number }> = ({ o, dim30, tu, mau }) => {
  const den = `x ${col(dim30 > 0.5 ? "#B8BFD3" : null, "+ 30")}`;
  return (
    <SideCard left={COL2.x} top={130} width={COL2.w} o={o} group="exam">
      <div data-text="label" style={{ fontSize: fontSize.label, color: colors.muted, fontWeight: 700 }}>
        đề bài
      </div>
      <div data-text="formula" style={{ display: "flex", justifyContent: "center", fontSize: 52 }}>
        <MathText text={`$y = \\dfrac{${col(tu > 0.5 ? K.num : null, "60x")}}{${mau > 0.5 ? col(K.den, "x + 30") : den}}$`} />
      </div>
    </SideCard>
  );
};

const Row: React.FC<{ text: string; o: number; color?: string }> = ({ text, o, color = colors.text }) =>
  o <= 0 ? null : (
    <div data-text="label" style={{ position: "absolute", left: COL2.x, width: COL2.w, top: 360, textAlign: "center", fontSize: 48, color, opacity: o }}>
      <MathText text={text} />
    </div>
  );

const Beat11: React.FC<BeatProps> = (p) => {
  const fr = useCurrentFrame();
  const L = p.L;
  return (
    <>
      <ExamCard o={In(fr, L[0])} dim30={In(fr, L[5])} tu={0} mau={0} />
      <Row text="$\dfrac{60 \cdot 90}{90 + 30} = 45$" o={In(fr, L[1]) * Out(fr, L[2])} />
      <Row text="$\dfrac{60x}{x} = 60$" o={In(fr, L[5]) * Out(fr, L[6])} />
      <Row text="$\dfrac{2x + 1}{x - 3} \to \dfrac{2x}{x} = 2$" o={In(fr, L[6] + 6)} />
      <DefH o={1} left={COL2.x} top={560} minus={1 - In(fr, C_(p)[4])} minusOn={In(fr, C_(p)[4])} plusOn={0} />
      <Graph2 {...g11(fr, L, p.E)} />
    </>
  );
};

const g12 = (fr: number, L: number[], E: number[]): G2 => {
  const s = g11(END, Z, Z);
  return {
    ...s,
    pts: [],
    vline: In(fr, L[0]),
    leftHi: In(fr, L[2]),
    arrowUp: In(fr, L[2] + 6),
    mid: lin(fr, L[3] + 4, E[3] - 10),
    arrowDown: In(fr, E[3] - 10),
    labels: labelsE({ l60: 1, y60: 1, x30: In(fr, L[0]), pinf: In(fr, L[2] + 6), sL: In(fr, L[2] + 6), sR: In(fr, E[3] - 10) }),
  };
};

const Beat12: React.FC<BeatProps> = (p) => {
  const fr = useCurrentFrame();
  const L = p.L;
  return (
    <>
      <ExamCard o={1} dim30={0} tu={In(fr, L[1])} mau={In(fr, L[0])} />
      <Row text="$\dfrac{2x + 1}{x - 3} \to \dfrac{2x}{x} = 2$" o={Out(fr, L[0])} />
      <Row text="$60 \cdot (-30) = -1800$" o={In(fr, L[1])} color={K.num} />
      <DefH o={Out(fr, L[0])} left={COL2.x} top={560} minus={0} minusOn={1} plusOn={0} />
      <Graph2 {...g12(fr, L, p.E)} />
    </>
  );
};

// ======================= CẢNH 1 (giải đáp) =======================
const h13 = (fr: number, L: number[]): HillState => {
  const dd = lin(fr, L[0] + 6, L[0] + 30);
  const glow = In(fr, L[1]) * Out(fr, L[2]);
  const down = dd < 1 ? 4 * dd : seg(fr, L[2] + 4, L[2] + 30, 4, 0.4);
  return {
    geo: G_BIG,
    car: { d: 1 + (D_END - 1) * dd, o: 1 },
    climbTo: 1,
    descentTo: Math.min(1, dd * (D_END - 1)),
    km: 1,
    target: { steps: TARGET, step: 2 * ramp(fr, L[4], L[4] + 14), o: 1 },
    downSpeed: { text: "900 km/h", o: In(fr, L[0]) },
    carNote: { caption: "trung bình", text: "$\\approx 58{,}1$ km/h", o: In(fr, L[0] + 30), color: colors.text },
    bar: {
      o: 1,
      up: UP_SEC,
      upLabel: 1,
      upGlow: glow,
      down,
      downLabel: { steps: ["4 s", "> 0"], step: ramp(fr, L[2] + 16, L[2] + 30), o: dd > 0.3 ? 1 : 0 },
      allow: { sec: UP_SEC, o: 1, glow, steps: ALLOW, step: 0 },
    },
  };
};

const Beat13: React.FC<BeatProps> = (p) => {
  const fr = useCurrentFrame();
  return <HillBar {...h13(fr, p.L)} />;
};

export const BEATS: Record<string, React.FC<BeatProps>> = {
  b01: Beat01,
  b02: Beat02,
  b03: Beat03,
  b04: Beat04,
  b05: Beat05,
  b06: Beat06,
  b07: Beat07,
  b08: Beat08,
  b09: Beat09,
  b10: Beat10,
  b11: Beat11,
  b12: Beat12,
  b13: Beat13,
};
