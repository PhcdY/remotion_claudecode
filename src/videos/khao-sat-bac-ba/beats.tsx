import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, clamp } from "../../components/BeatShell";
import { fadeIn } from "../../components/parts";
import { S1, S2, Scene1, Scene2, pulse } from "./scene";

// Mỗi beat dựng trạng thái từ trạng thái CUỐI của beat trước (gọi hàm của beat trước với frame rất lớn),
// nên hai beat cùng cảnh nối liền, không nháy (skill dung-video › Cảnh liền mạch).

const END = 1e9;
const Z = new Array(12).fill(0);
const In = (fr: number, a: number, d = 15) => fadeIn(fr, a, d);
const Out = (fr: number, a: number, d = 12) => 1 - fadeIn(fr, a, d);
/** Tiến độ 0 → 1 trong [a, b]. */
const lin = (fr: number, a: number, b: number) => interpolate(fr, [a, Math.max(b, a + 1)], [0, 1], clamp);
const C_ = (p: BeatProps) => p.C ?? p.L;
type Fn = (fr: number, L: number[], E: number[], C: number[]) => S1;

const make =
  (fn: Fn): React.FC<BeatProps> =>
  (p) => {
    const fr = useCurrentFrame();
    // beat có thẻ mở (GIẢI ĐÁP): hình chỉ hiện sau khi thẻ đã tắt hẳn, không chồng lên thẻ
    const o = p.T0 > 0 ? In(fr, p.T0, 8) : 1;
    return (
      <div style={{ position: "absolute", inset: 0, opacity: o }}>
        <Scene1 st={fn(fr, p.L, p.E, C_(p))} />
      </div>
    );
  };
const last = (fn: Fn) => fn(END, Z, Z, Z);

// ======================= CẢNH 1 =======================
// b01: bảng giá trị → ba điểm thẳng hàng → nối thành đường thẳng → dấu ?
const s01: Fn = (fr, L) => ({
  formula: In(fr, L[0]),
  tableO: In(fr, L[0]),
  rows: [In(fr, L[0] + 8), In(fr, L[0] + 14), In(fr, L[0] + 20), 0, 0],
  pts: In(fr, L[1]),
  line: lin(fr, L[2], L[2] + 24),
  thang: In(fr, L[2] + 18),
  q1: In(fr, L[3]),
});

// b02: thử 0,5 (đoán) → điểm trên → điểm dưới → điểm dày + đường cong thật → bỏ đường thẳng → còn khe chưa biết
const s02: Fn = (fr, L, E) => {
  const p = last(s01);
  const guess = E[0] + 4; // khoảng nghỉ sau câu hỏi
  const rows = [1, 1, 1, In(fr, L[1]), In(fr, L[2])];
  return {
    ...p,
    q1: Out(fr, 0),
    thang: Out(fr, L[3], 10),
    rows,
    tick05: In(fr, L[0]) * Out(fr, L[3]),
    guessUp: In(fr, guess, 8) * Out(fr, guess + 18, 8),
    guessDown: In(fr, guess + 22, 8) * Out(fr, L[1] - 6, 8),
    p05: In(fr, L[1], 10),
    p15: In(fr, L[2], 10),
    extraLabel: In(fr, L[1]) * Out(fr, L[3]),
    extraStep: 0,
    dense: In(fr, L[3], 20),
    curve: In(fr, L[3] + 20),
    curveProg: lin(fr, L[3] + 20, L[3] + 60),
    line: Out(fr, L[4], 20),
    gapQ: In(fr, L[5]) * Out(fr, E[5] - 2, 6),
  };
};

// b03: hai tầng: nhắc bài trước → f' → parabol → hai nghiệm → kéo lên đỉnh, đáy
const s03: Fn = (fr, L, E, C) => {
  const p = last(s02);
  return {
    ...p,
    dense: Out(fr, 0, 12),
    gapQ: Out(fr, 0, 12),
    tableO: Out(fr, 0, 10),
    tier: lin(fr, L[0], L[0] + 30),
    recall: In(fr, L[1]),
    fpFormula: In(fr, L[2]),
    fp: In(fr, L[3], 10),
    fpProg: lin(fr, L[3] + 6, L[3] + 46),
    zeros: In(fr, L[4], 10),
    zerosLabel: In(fr, L[4]),
    vlines: lin(fr, C[5], C[5] + 24),
  };
};

// b04: chuỗi vì sao (1): giả sử có chỗ nhấp nhô → phải qua một đáy → tại đáy f' = 0 → nhưng parabol âm → mâu thuẫn
const s04: Fn = (fr, L) => {
  const p = last(s03);
  const gone = Out(fr, L[7], 18);
  return {
    ...p,
    zerosLabel: Out(fr, 0, 10),
    midFocus: In(fr, L[0]) * Out(fr, L[7], 18),
    bump: In(fr, L[1], 18) * gone,
    giaSu: In(fr, L[1] + 10) * gone,
    dip: In(fr, L[2]) * gone,
    dipQ: In(fr, L[3]) * gone,
    proj: lin(fr, L[4], L[4] + 20) * gone,
    fpGlow: pulse(fr, L[5], 40),
    dipCross: In(fr, L[6]) * gone,
  };
};

// b05: chuỗi vì sao (2): khúc giữa xuống, hai khúc ngoài lên → đỉnh, đáy → vẽ lại theo chiều
const s05: Fn = (fr, L) => {
  const p = last(s04);
  const re = fr >= L[4];
  return {
    ...p,
    colorMid: In(fr, L[0]),
    fpMid: In(fr, L[0]),
    fpOut: In(fr, L[1]),
    colorOut: In(fr, L[2]),
    peakGlow: pulse(fr, L[3], 30),
    extraLabel: In(fr, L[3]),
    extraStep: 1,
    curve: re ? 0 : 1,
    redraw: re ? lin(fr, L[4] + 8, L[4] + 60) : -1,
  };
};

// b06: hai đầu: dấu a
const s06: Fn = (fr, L) => {
  const p = last(s05);
  const out = Out(fr, 0, 18);
  const bOut = Out(fr, L[5], 15);
  return {
    ...p,
    tier: 1 - lin(fr, 0, 30),
    fp: out,
    vlines: p.vlines! * out,
    recall: out,
    fpFormula: out,
    fpMid: out,
    fpOut: out,
    zeros: out,
    redraw: 1,
    endFocus: In(fr, L[0]) * Out(fr, L[1]),
    endQ: In(fr, L[0]) * Out(fr, L[4]),
    braceA: In(fr, L[1]) * bOut,
    braceB: In(fr, L[2]) * bOut,
    braceStep: lin(fr, L[3], L[3] + 14),
    ratio: In(fr, L[3]),
    arrowR: In(fr, L[4]),
    coefGlow: In(fr, L[5]),
    aLabel: In(fr, L[5] + 8),
    general: In(fr, L[5] + 16),
    arrowL: In(fr, L[6]),
  };
};

// b07: chỗ cắt trục tung: d
const s07: Fn = (fr, L) => {
  const p = last(s06);
  return {
    ...p,
    coefGlow: Out(fr, 0),
    yInt: In(fr, L[0]),
    restDim: In(fr, L[1]) * Out(fr, L[2]),
    dGlow: In(fr, L[1]) * Out(fr, L[2] + 30),
    dLabel: In(fr, L[1] + 8),
    peakGlow: 0,
  };
};

// b08: sơ đồ khảo sát
const s08: Fn = (fr, L) => {
  const p = last(s07);
  return {
    ...p,
    aLabel: Out(fr, 0),
    dLabel: Out(fr, 0),
    general: Out(fr, 0),
    yInt: Out(fr, 0) + In(fr, L[5]),
    scheme: In(fr, L[0]),
    schemeStep: lin(fr, L[1], L[1] + 10) + lin(fr, L[4], L[4] + 10) + lin(fr, L[5], L[5] + 10),
    dR: In(fr, L[1] + 10),
    sweep: lin(fr, L[2] + 4, L[2] + 50),
    mini: In(fr, L[3]) * Out(fr, L[4]),
    peakGlow: In(fr, L[4]) * Out(fr, L[5]),
    endFocus: In(fr, L[4]) * Out(fr, L[5]),
  };
};

// b11: giải đáp — quay lại hình mở đầu
const s11: Fn = (fr, L) => {
  const draw = lin(fr, L[5], L[5] + 26);
  return {
    formula: 1,
    tableO: 1,
    rows: [1, 1, 1, 0, 0],
    pts: 1,
    line: Out(fr, L[5]),
    thang: Out(fr, L[2]),
    curveDim: 1,
    q1: In(fr, L[1]) * Out(fr, L[2]),
    p05: In(fr, L[2]),
    p15: In(fr, L[2]),
    peakGlow: pulse(fr, L[2], 30),
    extraLabel: In(fr, L[3]),
    extraStep: 2,
    arrowR: In(fr, L[4]),
    arrowL: In(fr, L[4]),
    yInt: In(fr, L[4]),
    redraw: fr >= L[5] ? draw : -1,
    curve: 0,
  };
};

// ======================= CẢNH 2 (đề thi) =======================
const t09 = (fr: number, L: number[]): S2 => ({
  o: 1,
  q: In(fr, L[0]),
  a1: In(fr, L[0] + 6),
  aEnd: In(fr, L[1]),
  aLab: In(fr, L[1] + 6),
  dInt: In(fr, L[2]),
  dLab: In(fr, L[2] + 6),
  labPulse: pulse(fr, L[3], 36),
});
const t10 = (fr: number, L: number[]): S2 => ({
  ...t09(END, Z),
  labPulse: 0,
  aEnd: Out(fr, L[0]),
  b1: In(fr, L[0]),
  bEnd: In(fr, L[1]),
  bLab: In(fr, L[1] + 6),
  bInt: In(fr, L[2]),
  bdLab: In(fr, L[2] + 6),
  endsPulse: pulse(fr, L[3], 40),
});

const Beat09: React.FC<BeatProps> = (p) => {
  const fr = useCurrentFrame();
  return <Scene2 st={t09(fr, p.L)} />;
};
const Beat10: React.FC<BeatProps> = (p) => {
  const fr = useCurrentFrame();
  return <Scene2 st={t10(fr, p.L)} />;
};

export const BEATS: Record<string, React.FC<BeatProps>> = {
  b01: make(s01),
  b02: make(s02),
  b03: make(s03),
  b04: make(s04),
  b05: make(s05),
  b06: make(s06),
  b07: make(s07),
  b08: make(s08),
  b09: Beat09,
  b10: Beat10,
  b11: make(s11),
};
