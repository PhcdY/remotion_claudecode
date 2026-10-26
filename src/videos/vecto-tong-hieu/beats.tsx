import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BeatProps, clamp } from "../../components/BeatShell";
import { fadeIn, pulse } from "../../components/parts";
import { ALPHA, Arr, K, OX_CENTER, OX_LEFT, Scene1, Scene2, St1, St2, st1Zero, st2Zero } from "./scene";

// Mỗi beat dựng trạng thái từ trạng thái CUỐI của beat trước (gọi hàm beat trước với frame rất lớn),
// nên các beat cùng cảnh nối liền, không nháy (skill dung-video › Cảnh liền mạch).

const END = 1e9;
const Z = new Array(12).fill(0);
const In = (fr: number, a: number, d = 15) => fadeIn(fr, a, d);
const Out = (fr: number, a: number, d = 12) => 1 - fadeIn(fr, a, d);
const ease = (fr: number, a: number, d: number) =>
  interpolate(fr, [a, a + Math.max(d, 1)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Fn<S> = (fr: number, L: number[], E: number[], C: number[]) => S;
const last = <S,>(fn: Fn<S>) => fn(END, Z, Z, Z);

const make1 =
  (fn: Fn<St1>): React.FC<BeatProps> =>
  (p) => {
    const fr = useCurrentFrame();
    const o = p.T0 > 0 ? In(fr, p.T0, 8) : 1;
    return (
      <div style={{ position: "absolute", inset: 0, opacity: o }}>
        <Scene1 st={fn(fr, p.L, p.E, p.C ?? p.L)} />
      </div>
    );
  };
const make2 =
  (id: string, fn: Fn<St2>): React.FC<BeatProps> =>
  (p) => {
    const fr = useCurrentFrame();
    const o = p.T0 > 0 ? In(fr, p.T0, 8) : 1;
    return (
      <div style={{ position: "absolute", inset: 0, opacity: o }}>
        <Scene2 st={fn(fr, p.L, p.E, p.C ?? p.L)} phase={id} />
      </div>
    );
  };

/** Mũi tên theo toạ độ ô. */
const A = (x1: number, y1: number, x2: number, y2: number, c: string, o = 1, extra: Partial<Arr> = {}): Arr => ({ x1, y1, x2, y2, c, o, ...extra });
/** Mũi tên dời từ vị trí p sang q (giữ hướng, độ dài). */
const slide = (p: Arr, q: Arr, t: number): Arr => ({
  ...q,
  moving: t > 0 && t < 1,
  x1: lerp(p.x1, q.x1, t),
  y1: lerp(p.y1, q.y1, t),
  x2: lerp(p.x2, q.x2, t),
  y2: lerp(p.y2, q.y2, t),
});
/** Trạng thái mới = trạng thái cũ + thay đổi (sao chép các bảng con). */
const next = (p: St2, ch: Partial<St2>): St2 => ({
  ...p,
  ...ch,
  arrows: { ...p.arrows, ...(ch.arrows ?? {}) },
  pts: { ...p.pts, ...(ch.pts ?? {}) },
  labels: { ...p.labels, ...(ch.labels ?? {}) },
  fills: { ...p.fills, ...(ch.fills ?? {}) },
  cards: { ...p.cards, ...(ch.cards ?? {}) },
});
/** Mờ một mũi tên đã có. */
const fadeA = (a: Arr | undefined, o: number): Arr => ({ ...(a as Arr), o: (a?.o ?? 0) * o });

// ===================== CẢNH 1: máy bay hạ cánh =====================

// b01: máy bay bay thẳng → gió ngang → xoay mũi chếch → vẫn trượt thẳng
const s01: Fn<St1> = (fr, L, E, C) => ({
  ...st1Zero,
  wind: In(fr, C[1], 20),
  windTxt: In(fr, C[1] + 10),
  rot: ALPHA * ease(fr, C[2], 40),
});

// b13: giải đáp trên đúng hình mở đầu
const s13: Fn<St1> = (fr, L, E, C) => ({
  ...st1Zero,
  wind: 1,
  rot: ALPHA,
  own: In(fr, C[1]) * Out(fr, C[4]),
  ownT: ease(fr, C[1], 25),
  windArr: In(fr, C[1] + 25) * Out(fr, C[4]),
  tri: In(fr, C[2]) * Out(fr, C[4]),
  tanTxt: In(fr, C[2] + 8) * Out(fr, C[4]),
  arc: In(fr, C[3]),
  angTxt: In(fr, C[3] + 8),
});

// ===================== CẢNH 2: bản đồ có lưới =====================

// b02: lưới, chấm A, máy bay bay 10 ô → mũi tên AB (4 km)
const s02: Fn<St2> = (fr, L, E, C) => {
  const fly = ease(fr, C[2], 45);
  return next(st2Zero, {
    runway: In(fr, 0, 12),
    grid: In(fr, C[0], 20),
    pts: {
      A: { x: 0, y: 0, o: In(fr, C[1]) },
      B: { x: 0, y: 10, o: In(fr, C[3]) },
    },
    plane: { x: 0, y: 10 * fly, rot: 0, o: In(fr, C[1]) * Out(fr, C[3] + 10, 15) },
    arrows: {
      AB: A(0, 0, 0, 10, K.own, fr < C[3] ? 0.45 : lerp(0.45, 1, In(fr, C[3])), { t: fly, dash: fr < C[3] }),
    },
    labels: {
      A: { o: In(fr, C[1]) },
      B: { o: In(fr, C[3] + 6) },
      speed: { o: In(fr, C[2] + 6) * Out(fr, C[3]) },
      AB: { o: In(fr, C[3] + 6), step: 0 },
    },
  });
};

// b03: AB là vectơ; bản sao cùng hướng cùng độ dài; dời đi vẫn là nó
const s03: Fn<St2> = (fr, L, E, C) => {
  const p = last(s02);
  const right = A(6, 1, 6, 11, K.own, 0.7);
  const left = A(-6, 0, -6, 10, K.own, 0.7);
  const copy = slide(right, left, ease(fr, C[2], 45));
  return next(p, {
    labels: { AB: { o: 1, step: ease(fr, C[0], 12) }, copyEq: { o: In(fr, C[1] + 6) * Out(fr, C[2]) } },
    arrows: { copy: { ...copy, o: 0.7 * In(fr, C[1]) * Out(fr, C[3]) } },
  });
};

// b04: gió 0,8 km; chĩa thẳng: tự bay tới B rồi gió đẩy tới C → lệch 0,8 km
const s04: Fn<St2> = (fr, L, E, C) => {
  const p = last(s03);
  const wLeft = A(-6, 2, -4, 2, K.wind);
  const wB = A(0, 10, 2, 10, K.wind);
  const W = fr < C[3] ? { ...wLeft, o: In(fr, C[0]) } : slide(wLeft, wB, ease(fr, C[3], 30));
  const toB = ease(fr, C[2], 40);
  const toC = ease(fr, C[3] + 30, 30);
  return next(p, {
    arrows: { copy: fadeA(p.arrows.copy, 0), W },
    plane: { x: 2 * toC, y: 10 * toB, rot: 0, o: In(fr, C[2], 10) * Out(fr, C[4]) },
    pts: { C: { x: 2, y: 10, o: In(fr, C[3] + 55) } },
    bracket: In(fr, C[4]),
    labels: {
      // máy bay đậu đúng chỗ B: tạm ẩn nhãn B tới khi máy bay đi tiếp
      B: { o: Math.max(Out(fr, C[2] + 20, 10), In(fr, C[3] + 55, 10)) },
      windTxt: { o: In(fr, C[0] + 6) * Out(fr, C[3]) },
      C: { o: In(fr, C[3] + 55) },
      dev: { o: In(fr, C[4] + 6) },
    },
  });
};

// b05: tổng AC; công thức ba điểm; giải phẫu AB, B chung, AC
const s05: Fn<St2> = (fr, L, E, C) => {
  const p = last(s04);
  const hiAB = In(fr, C[2]) * Out(fr, C[3]);
  const hiB = In(fr, C[3]) * Out(fr, C[4]);
  const hiAC = In(fr, C[4]);
  return next(p, {
    bracket: Out(fr, 0),
    arrows: {
      AB: { ...p.arrows.AB, glow: hiAB },
      AC: A(0, 0, 2, 10, K.sum, 1, { t: ease(fr, C[0], 30), glow: hiAC, w: 9 }),
    },
    pts: { B: { ...p.pts.B, c: hiB > 0.05 ? K.sum : undefined, pulse: pulse(fr, C[3] + 4, 26) + pulse(fr, C[3] + 34, 26) } },
    labels: { dev: { o: Out(fr, 0) }, AC: { o: In(fr, C[0] + 20), step: 0 } },
    ox: lerp(OX_CENTER, OX_LEFT, ease(fr, C[1] - 10, 25)),
    cards: { ...p.cards, sum: In(fr, C[1] + 12), hiAB, hiB, hiAC },
  });
};

// b06 (vì sao 1): cùng lúc → chung gốc; dời gió lên ngọn B → nối đuôi, tổng tới đúng C; máy bay đi thẳng AC
const s06: Fn<St2> = (fr, L, E, C) => {
  const p = last(s05);
  const wA = A(0, 0, 2, 0, K.wind);
  const wB = A(0, 10, 2, 10, K.wind);
  const glowW = In(fr, C[4]) * Out(fr, C[5]);
  const W = { ...slide(wB, wA, ease(fr, C[0], 30)), glow: glowW };
  const copyW = { ...slide(wA, wB, ease(fr, C[3], 35)), o: fr < C[3] ? 0 : 0.85, glow: glowW };
  const toC = ease(fr, C[6] + 8, 55);
  return next(p, {
    arrows: {
      AB: { ...p.arrows.AB, glow: 0 },
      W,
      copyW,
      AC: { ...p.arrows.AC, glow: 0, o: fr < C[5] ? Out(fr, C[0]) : In(fr, C[5]) },
    },
    pts: { B: { ...p.pts.B, c: undefined, pulse: 0 }, E: { x: 2, y: 0, o: In(fr, C[0] + 25) } },
    plane: { x: 2 * toC, y: 10 * toC, rot: 0, o: In(fr, C[6], 8) * Out(fr, C[6] + 70, 15) },
    qmark: In(fr, C[2]) * Out(fr, C[3]),
    labels: {
      AC: { o: fr < C[5] ? Out(fr, C[0]) : In(fr, C[5]), step: 0 },
      E: { o: In(fr, C[1]) },
      AE: { o: In(fr, C[1]) },
      BCeqAE: { o: In(fr, C[4] + 6) },
    },
    cards: { ...p.cards, hiAC: Out(fr, 0) },
  });
};

// b07 (vì sao 2): gió trước, máy bay sau cũng tới C → hình bình hành, tổng là đường chéo
const s07: Fn<St2> = (fr, L, E, C) => {
  const p = last(s06);
  const ab = A(0, 0, 0, 10, K.own, 0.85);
  const ec = A(2, 0, 2, 10, K.own, 0.85);
  return next(p, {
    plane: { ...p.plane, o: Out(fr, 0) },
    arrows: {
      copyAB: { ...slide(ab, ec, ease(fr, C[0], 35)), o: fr < C[0] ? 0 : 0.85 },
      AC: { ...p.arrows.AC, glow: In(fr, C[2]) },
    },
    fills: { para: { pts: [[0, 0], [0, 10], [2, 10], [2, 0]], o: 0.14 * In(fr, C[1]), c: K.sum } },
    labels: { BCeqAE: { o: Out(fr, 0) }, hbh: { o: In(fr, C[1] + 6) } },
    cards: { ...p.cards, sumRow2: In(fr, C[3]) },
  });
};

// b08 (bẫy): 4 km + 0,8 km ≠ 4,8 km; Pi-ta-go cho 4,08 km; đường chéo đi tắt
const s08: Fn<St2> = (fr, L, E, C) => {
  const p = last(s07);
  // trong khoảng nghỉ sau câu hỏi: hai nhãn độ dài nháy lần lượt
  const blinkAB = 1 - 0.6 * pulse(fr, E[1] + 2, 20);
  const blink08 = 1 - 0.6 * pulse(fr, E[1] + 24, 20);
  return next(p, {
    arrows: {
      copyAB: fadeA(p.arrows.copyAB, Out(fr, 0)),
      AC: { ...p.arrows.AC, glow: 0 },
    },
    fills: { para: { ...p.fills.para, o: 0.14 * Out(fr, 0) } },
    rightAngle: In(fr, 0),
    detour: In(fr, C[3]),
    labels: {
      hbh: { o: Out(fr, 0) },
      AB: { o: blinkAB, step: 1 - ease(fr, C[0], 12) },
      len08: { o: In(fr, C[0]) * blink08 },
      AC: { o: Out(fr, 0), step: 0 },
      ACq: { o: In(fr, C[1]) * Out(fr, C[2]) },
      ACr: { o: In(fr, C[2] + 4) },
    },
  });
};

// b09: chỗ cần tới M, chặng cần đi AM, gió AE, phương trình ? + AE = AM
const s09: Fn<St2> = (fr, L, E, C) => {
  const p = last(s08);
  const out = Out(fr, 0, 15);
  const W = A(0, 0, 2, 0, K.wind, fr < C[2] ? out : In(fr, C[2]));
  return next(p, {
    rightAngle: out,
    detour: out,
    arrows: {
      AB: fadeA(p.arrows.AB, out),
      copyW: fadeA(p.arrows.copyW, out),
      AC: fadeA(p.arrows.AC, out),
      W,
      AM: A(0, 0, 0, 10, K.target, 1, { t: ease(fr, C[1], 30) }),
    },
    pts: {
      B: { ...p.pts.B, o: out },
      C: { ...p.pts.C, o: out },
      E: { x: 2, y: 0, o: fr < C[2] ? out : In(fr, C[2]) },
      M: { x: 0, y: 10, o: In(fr, C[0]), c: K.target },
    },
    labels: {
      AB: { o: out, step: 0 },
      B: { o: out },
      C: { o: out },
      AC: { o: 0 },
      ACq: { o: 0 },
      ACr: { o: out },
      len08: { o: out },
      E: { o: fr < C[2] ? out : In(fr, C[2]) },
      AE: { o: fr < C[2] ? out : In(fr, C[2]) },
      M: { o: In(fr, C[0] + 6) },
      AM: { o: In(fr, C[1] + 15) },
    },
    cards: { ...p.cards, sum: out, sumRow2: out, eq: In(fr, C[3]), eqStep: 0, eqQ: pulse(fr, C[4] + 4, 24) + pulse(fr, C[4] + 30, 24) },
  });
};

// b10: vectơ đối (minh hoạ góc dưới trái), AE + (−AE) = 0, định nghĩa hiệu
const s10: Fn<St2> = (fr, L, E, C) => {
  const p = last(s09);
  return next(p, {
    arrows: {
      illW: A(-7, 3, -5, 3, K.wind, In(fr, C[0])),
      illNeg: A(-5, 2.35, -7, 2.35, K.wind, In(fr, C[0] + 20), { dash: true, t: ease(fr, C[0] + 20, 25) }),
    },
    labels: { negIll: { o: In(fr, C[1]) }, illEq: { o: In(fr, C[2]) } },
    cards: { ...p.cards, eqQ: 0, def: In(fr, C[3]) },
  });
};

// b11 (à ra thế): cộng −AE hai vế → ? = AM − AE; nối ngược gió vào M → K; mũi tên AK; máy bay chếch, trượt thẳng
const s11: Fn<St2> = (fr, L, E, C) => {
  const p = last(s10);
  const out = Out(fr, 0, 15);
  const eqStep = fr < C[1] ? ease(fr, C[0], 15) : fr < C[1] + 30 ? 1 + ease(fr, C[1], 15) : 2 + ease(fr, C[1] + 30, 15);
  // câu hỏi đoán: hai ứng viên mờ, sáng lần lượt trong khoảng nghỉ
  const cand = 0.35 * In(fr, C[3]) * Out(fr, C[4]);
  const b1 = pulse(fr, E[3] + 2, 20);
  const b2 = pulse(fr, E[3] + 24, 20);
  const fly = 0.83 * ease(fr, C[6], 60);
  return next(p, {
    arrows: {
      illW: fadeA(p.arrows.illW, out),
      illNeg: fadeA(p.arrows.illNeg, out),
      negM: A(0, 10, -2, 10, K.wind, In(fr, C[2], 8), { dash: true, t: ease(fr, C[2], 25) }),
      candUp: A(0, 0, 0, 10, K.own, Math.min(1, cand + 0.5 * b1)),
      candK: A(0, 0, -2, 10, K.own, Math.min(1, cand + 0.5 * b2)),
      AK: A(0, 0, -2, 10, K.own, 1, { t: ease(fr, C[4], 25) }),
    },
    pts: { K: { x: -2, y: 10, o: In(fr, C[2] + 20), c: K.own } },
    plane: { x: 0, y: 10 * fly, rot: -ALPHA * ease(fr, C[5] + 10, 25), o: In(fr, C[5], 10) },
    labels: {
      negIll: { o: out },
      illEq: { o: out },
      K: { o: In(fr, C[2] + 24) },
      AK: { o: In(fr, C[4] + 15), step: 0 },
    },
    cards: { ...p.cards, eqStep },
  });
};

// b12: quy tắc hiệu: chung gốc AM, AE → EM nối hai ngọn; đếm ô; EM = AK; chĩa về ngọn vectơ trước dấu trừ
const s12: Fn<St2> = (fr, L, E, C) => {
  const p = last(s11);
  const dim = lerp(1, 0.25, ease(fr, C[0], 15));
  const back = fr < C[3] ? dim : lerp(0.25, 1, ease(fr, C[3], 15));
  return next(p, {
    plane: { ...p.plane, o: Out(fr, 0) },
    arrows: {
      AK: { ...p.arrows.AK, o: back },
      negM: { ...p.arrows.negM, o: dim },
      EM: A(2, 0, 0, 10, K.sum, 1, { t: ease(fr, C[1], 30), w: 9 }),
    },
    pts: { K: { ...p.pts.K, o: back }, M: { ...p.pts.M, pulse: pulse(fr, C[5] + 4, 26) + pulse(fr, C[5] + 34, 26) } },
    count: In(fr, C[2]) * Out(fr, C[3]),
    fills: { para2: { pts: [[0, 0], [-2, 10], [0, 10], [2, 0]], o: 0.12 * In(fr, C[3]), c: K.sum } },
    labels: {
      K: { o: back },
      AK: { o: back, step: ease(fr, C[3], 12) },
      EM: { o: In(fr, C[1] + 15) },
      count: { o: In(fr, C[2] + 6) * Out(fr, C[3]) },
    },
    cards: { ...p.cards, eqStep: 3 + ease(fr, C[3], 15), rule: In(fr, C[4]), ruleHi: pulse(fr, C[5] + 4, 26) + pulse(fr, C[5] + 34, 26) },
  });
};

export const BEATS: Record<string, React.FC<BeatProps>> = {
  b01: make1(s01),
  b02: make2("b02", s02),
  b03: make2("b03", s03),
  b04: make2("b04", s04),
  b05: make2("b05", s05),
  b06: make2("b06", s06),
  b07: make2("b07", s07),
  b08: make2("b08", s08),
  b09: make2("b09", s09),
  b10: make2("b10", s10),
  b11: make2("b11", s11),
  b12: make2("b12", s12),
  b13: make1(s13),
};
