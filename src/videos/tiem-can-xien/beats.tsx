import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, clamp } from "../../components/BeatShell";
import { fadeIn, pulse } from "../../components/parts";
import { Scene1, Scene2, St1, St2 } from "./scene";

// Mỗi beat dựng trạng thái từ trạng thái CUỐI của beat trước (gọi hàm của beat trước với frame rất lớn),
// nên các beat cùng cảnh nối liền, không nháy (skill dung-video › Cảnh liền mạch).

const END = 1e9;
const Z = new Array(12).fill(0);
const In = (fr: number, a: number, d = 15) => fadeIn(fr, a, d);
const Out = (fr: number, a: number, d = 12) => 1 - fadeIn(fr, a, d);
const lin = (fr: number, a: number, b: number) => interpolate(fr, [a, Math.max(b, a + 1)], [0, 1], clamp);
/** dời kính lúp theo thang log (10 → 100 → 1000 đi đều mắt) */
const moveX = (fr: number, a: number, from: number, to: number, d = 30) => {
  const t = interpolate(fr, [a, a + d], [0, 1], { ...clamp, easing: (u) => u * u * (3 - 2 * u) });
  return Math.pow(10, Math.log10(from) + (Math.log10(to) - Math.log10(from)) * t);
};
/** đoạn đo chỉ hiện khi kính lúp đứng yên: tắt lúc bắt đầu dời, bật lại sau d frame */
const C_ = (p: BeatProps) => p.C ?? p.L;

type Fn<S> = (fr: number, L: number[], E: number[], C: number[]) => S;
const last = <S,>(fn: Fn<S>) => fn(END, Z, Z, Z);

const make1 =
  (fn: Fn<St1>): React.FC<BeatProps> =>
  (p) => {
    const fr = useCurrentFrame();
    const o = p.T0 > 0 ? In(fr, p.T0, 8) : 1;
    return (
      <div style={{ position: "absolute", inset: 0, opacity: o }}>
        <Scene1 st={fn(fr, p.L, p.E, C_(p))} />
      </div>
    );
  };
const make2 =
  (fn: Fn<St2>): React.FC<BeatProps> =>
  (p) => {
    const fr = useCurrentFrame();
    const o = p.T0 > 0 ? In(fr, p.T0, 8) : 1;
    return (
      <div style={{ position: "absolute", inset: 0, opacity: o }}>
        <Scene2 st={fn(fr, p.L, p.E, C_(p))} />
      </div>
    );
  };

// ===================== CẢNH 1 =====================

// b01: mẹo bỏ số cộng → y = x; nhìn xa trùng khít; soi tại 1000 vẫn cách gần 1
const s01: Fn<St1> = (fr, L, E, C) => ({
  shift: lin(fr, C[3], C[3] + 20),
  formula: In(fr, 0),
  plus1Fade: In(fr, C[1]),
  approx: In(fr, C[1] + 8),
  yx: lin(fr, C[2], C[2] + 30),
  labYX: In(fr, C[2] + 24),
  zoom: In(fr, C[3] + 14),
  x0: 1000,
  gapYX: "cách $\\approx 1$",
  gapYXo: In(fr, C[3] + 26),
});

// b02: đo tại 10, 100, 1000: 0,91 → 0,99 → 0,999, dồn về 1
const s02: Fn<St1> = (fr, L) => {
  const p = last(s01);
  let x0 = moveX(fr, L[0], 1000, 10);
  if (fr >= L[2]) x0 = moveX(fr, L[2], 10, 100);
  if (fr >= L[4]) x0 = moveX(fr, L[4], 100, 1000);
  const gap = fr < L[3] ? "$0{,}91$" : fr < L[4] ? "$0{,}99$" : "$0{,}999$";
  const seg = fr < L[2] ? lin(fr, L[1], L[1] + 15) : fr < L[4] ? lin(fr, L[3], L[3] + 15) : lin(fr, L[4] + 32, L[4] + 47);
  const gapO = fr < L[2] ? In(fr, L[1] + 10) : fr < L[4] ? In(fr, L[3] + 10) : In(fr, L[4] + 40) * Out(fr, L[5]);
  return {
    ...p,
    approx: Out(fr, 0),
    plus1Fade: Out(fr, 0),
    gapYXo: Math.min(gapO, fr < L[1] ? Out(fr, 0) : 1),
    gapYX: fr < L[1] ? p.gapYX : gap,
    x0,
    segYX: seg,
    ghost: In(fr, L[2] + 30) * Out(fr, L[4]),
    rows: [In(fr, L[2]), In(fr, L[4]), In(fr, L[5])],
    rowsArrow: In(fr, L[5] + 12),
  };
};

// b03: vì sao bài trước bỏ được: thương dồn về 60 cố định
const s03: Fn<St1> = (fr, L) => {
  const p = last(s02);
  return {
    ...p,
    rows: [Out(fr, 0), Out(fr, 0), Out(fr, 0)],
    rowsArrow: Out(fr, 0),
    q: In(fr, L[0]) * Out(fr, L[1]),
    refCard: In(fr, L[1]),
    refHi: In(fr, L[2]),
    hut: [In(fr, L[3]), In(fr, L[4])],
  };
};

// b04: tại 100: 10000/100 = 100 nhưng /101 ≈ 99; 1% của 100 là 1; tại 1000 vẫn 1
const s04: Fn<St1> = (fr, L) => {
  const p = last(s03);
  const x0 = fr < L[5] ? moveX(fr, L[0], 1000, 100) : moveX(fr, L[5], 100, 1000);
  return {
    ...p,
    refCard: Out(fr, 0),
    hut: [Out(fr, 0), Out(fr, 0)],
    q: 0,
    x0,
    segYX: fr < L[0] + 2 ? Out(fr, 0, 2) : fr < L[5] ? lin(fr, L[4], L[4] + 15) : lin(fr, L[5] + 32, L[5] + 47),
    divCard: In(fr, L[1]),
    divRow1: In(fr, L[1]),
    divRow2: In(fr, L[2]),
    ptYX: In(fr, L[1]),
    ptF: In(fr, L[2]),
    divHi: In(fr, L[3]),
    divNote: In(fr, L[3] + 6),
    divStep: lin(fr, L[5], L[5] + 20),
    pct: fr < L[5] ? In(fr, L[4] + 10) : In(fr, L[5] + 38),
    pctStep: fr < L[5] ? 0 : 1,
    slideO: In(fr, L[6]),
    slide: lin(fr, L[6], L[6] + 70),
  };
};

// b05: hạ đường y = x xuống 1 → y = x − 1; khoảng cách 0,09 → 0,01 → 0,001
const s05: Fn<St1> = (fr, L, E, C) => {
  const p = last(s04);
  let x0 = 1000;
  if (fr >= L[1]) x0 = moveX(fr, L[1], 1000, 10);
  if (fr >= L[2]) x0 = moveX(fr, L[2], 10, 100);
  if (fr >= L[3]) x0 = moveX(fr, L[3], 100, 1000);
  const gap = fr < L[2] ? "$0{,}09$" : fr < L[3] ? "$0{,}01$" : "$0{,}001$";
  const at = fr < L[2] ? L[1] : fr < L[3] ? L[2] : L[3];
  return {
    ...p,
    divCard: Out(fr, 0),
    pct: Out(fr, 0),
    ptYX: Out(fr, 0),
    ptF: Out(fr, 0),
    segYX: Out(fr, 0),
    slideO: 0,
    newO: In(fr, C[0]),
    newLine: lin(fr, C[0], C[0] + 30),
    yxDim: In(fr, C[0] + 24),
    x0,
    segNew: fr < L[1] ? 0 : lin(fr, at + 32, at + 44),
    gapNew: gap,
    gapNewO: fr < L[1] ? 0 : In(fr, at + 38),
    rows2: [In(fr, L[2]), In(fr, L[3]), In(fr, L[4])],
  };
};

// b13: GIẢI ĐÁP — quay lại cảnh 1, kính lúp tại 1000
const s13: Fn<St1> = (fr, L) => ({
  shift: 1,
  formula: 1,
  yx: 1,
  labYX: 1,
  zoom: 1,
  x0: 1000,
  newO: 1,
  newLine: 1,
  approxBack: In(fr, L[0]),
  pulseYX: pulse(fr, L[0] + 6, 30),
  segYX: lin(fr, L[1], L[1] + 15),
  gapYX: "$0{,}999$",
  gapYXo: In(fr, L[1] + 10),
  segNew: In(fr, L[2]),
  gapNew: "$0{,}001$",
  gapNewO: In(fr, L[2] + 8),
  labTC: lin(fr, L[3], L[3] + 15),
  labTCpulse: pulse(fr, L[3], 30),
});

// ===================== CẢNH 2 =====================

// b06: gần gốc: M trên đồ thị, H trên đường, đoạn MH co về 0 khi đi xa
const s06: Fn<St2> = (fr, L) => ({
  base: In(fr, 0),
  formula: In(fr, 0),
  xm: 2.5 + 2 * lin(fr, L[4], L[4] + 60),
  mh: In(fr, L[1]),
  colM: In(fr, L[1] + 6),
  labFx: In(fr, L[1] + 10),
  hh: In(fr, L[2]),
  colH: In(fr, L[2] + 6),
  labHx: In(fr, L[2] + 10),
  seg: In(fr, L[3]),
  labMH: In(fr, L[3] + 8),
  colDim: In(fr, L[3]),
});

// b07: định nghĩa, giải phẫu từng cụm; tên tiệm cận xiên; a ≠ 0
const s07: Fn<St2> = (fr, L, E, C) => {
  const p = last(s06);
  const dh = fr < L[1] ? 0 : fr < L[2] ? 1 : fr < L[3] ? 2 : fr < L[4] ? 3 : fr < L[6] ? 4 : 0;
  return {
    ...p,
    def: In(fr, L[0]),
    defHi: dh,
    colDim: fr < L[1] ? 1 : fr < L[4] ? Out(fr, L[1]) : In(fr, L[4]),
    segHi: pulse(fr, L[3], 30),
    xm: 4.5 + 0.5 * lin(fr, L[4], L[4] + 40),
    lineLabStep: lin(fr, C[5], C[5] + 15),
    lineHi: pulse(fr, C[5], 30),
    defA: In(fr, L[6]),
    hline: In(fr, L[6] + 6) * Out(fr, L[6] + 50),
  };
};

// b08: tìm ra x − 1: thử x lần thì thừa x, nhân ít đi một lần, thiếu đúng 1
const s08: Fn<St2> = (fr, L) => {
  const p = last(s07);
  return {
    ...p,
    defA: Out(fr, 0),
    hline: 0,
    defLow: lin(fr, 0, 20),
    colM: Out(fr, 0),
    colH: Out(fr, 0),
    labFx: Out(fr, 0),
    labHx: Out(fr, 0),
    xm: 5 - 2 * lin(fr, 0, 30),
    q: In(fr, L[0]) * Out(fr, L[1]),
    lineLabStep: 1 + lin(fr, L[0], L[0] + 15) + lin(fr, L[1], L[1] + 15),
    r1: In(fr, L[1]),
    over: In(fr, L[2]),
    r2: In(fr, L[3]),
    r1dim: In(fr, L[3]),
    r2step: lin(fr, L[4], L[4] + 15),
  };
};

// b09: chia hai vế cho mẫu → f = x − 1 + 1/(x + 1); phần thừa chính là MH, dồn về 0
const s09: Fn<St2> = (fr, L) => {
  const p = last(s08);
  return {
    ...p,
    formSplit: lin(fr, L[0], L[0] + 20),
    rowsOut: lin(fr, L[0], L[0] + 15),
    splitHi: fr < L[1] ? 0 : fr < L[2] ? 1 : 2,
    lineHi: fr >= L[1] && fr < L[2] ? In(fr, L[1]) : 0,
    segHi: fr >= L[2] ? In(fr, L[2]) : 0,
    labMHstep: lin(fr, L[2], L[2] + 15),
    xm: 3 + 2.3 * lin(fr, L[3], L[3] + 60),
  };
};

// b10: tiệm cận đứng x = −1; nhánh trái nằm dưới, cũng sát dần
const s10: Fn<St2> = (fr, L, E, C) => {
  const p = last(s09);
  return {
    ...p,
    splitHi: 0,
    segHi: 0,
    mh: Out(fr, 0),
    hh: Out(fr, 0),
    seg: Out(fr, 0),
    labMH: Out(fr, 0),
    wide: lin(fr, 0, 24),
    vline: In(fr, L[0] + 20),
    leftDraw: lin(fr, C[1], C[1] + 40),
    m2: In(fr, C[1] + 40),
    xm2: -3 - 1.5 * lin(fr, L[2], L[2] + 45),
    defMinus: In(fr, L[2] + 30),
  };
};

// b11: TRONG ĐỀ THI — bước 1: hệ số góc
const s11: Fn<St2> = (fr, L) => {
  const p = last(s10);
  return {
    ...p,
    def: Out(fr, 0),
    m2: Out(fr, 0),
    mh: Out(fr, 0),
    hh: Out(fr, 0),
    seg: Out(fr, 0),
    labMH: Out(fr, 0),
    formSmall: In(fr, 0),
    formula: Out(fr, 0),
    ex: [In(fr, L[0]), In(fr, L[1]), In(fr, L[3])],
    noteA: In(fr, L[2]) * Out(fr, L[3]),
    yxO: In(fr, L[4]),
    yxHi: In(fr, L[4]),
  };
};

// b12: bước 2: độ cao; bẫy y = x
const s12: Fn<St2> = (fr, L) => {
  const p = last(s11);
  return {
    ...p,
    aCollapse: lin(fr, 0, 20),
    ex: [1, 1, 1, In(fr, L[0]), In(fr, L[1]), In(fr, L[2])],
    gapYX: In(fr, L[2]),
    yxWrong: lin(fr, L[3], L[3] + 15),
    splitBack: In(fr, L[4]),
    formula: In(fr, L[4]),
  };
};

export const BEATS: Record<string, React.FC<BeatProps>> = {
  b01: make1(s01),
  b02: make1(s02),
  b03: make1(s03),
  b04: make1(s04),
  b05: make1(s05),
  b06: make2(s06),
  b07: make2(s07),
  b08: make2(s08),
  b09: make2(s09),
  b10: make2(s10),
  b11: make2(s11),
  b12: make2(s12),
  b13: make1(s13),
};
