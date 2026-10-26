import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, clamp } from "../../components/BeatShell";
import { fadeIn, pulse } from "../../components/parts";
import { Scene, St } from "./scene";

// Mỗi beat dựng trạng thái từ trạng thái CUỐI của beat trước (gọi hàm của beat trước với frame rất lớn),
// nên các beat cùng cảnh nối liền, không nháy (skill dung-video › Cảnh liền mạch).

const END = 1e9;
const Z = new Array(12).fill(0);
const In = (fr: number, a: number, d = 15) => fadeIn(fr, a, d);
const Out = (fr: number, a: number, d = 12) => 1 - fadeIn(fr, a, d);
const lin = (fr: number, a: number, b: number) => interpolate(fr, [a, Math.max(b, a + 1)], [0, 1], clamp);
const C_ = (p: BeatProps) => p.C ?? p.L;
type Fn = (fr: number, L: number[], E: number[], C: number[]) => St;
const last = (fn: Fn) => fn(END, Z, Z, Z);

const make =
  (fn: Fn): React.FC<BeatProps> =>
  (p) => {
    const fr = useCurrentFrame();
    // beat có thẻ mở (BẪY THƯỜNG GẶP, GIẢI ĐÁP): hình chỉ hiện sau khi thẻ đã tắt hẳn
    const o = p.T0 > 0 ? In(fr, p.T0, 8) : 1;
    return (
      <div style={{ position: "absolute", inset: 0, opacity: o }}>
        <Scene st={fn(fr, p.L, p.E, C_(p))} />
      </div>
    );
  };

// b01: máy tính cho đạo hàm tại 0 và 2 đều âm, nhưng điểm tại 2 cao hơn
const s01: Fn = (fr, L, E, C) => ({
  formula: In(fr, L[0]),
  table: In(fr, L[0]),
  rows: [In(fr, L[0] + 8), In(fr, L[2])],
  p0: In(fr, L[1], 10),
  tan0: lin(fr, L[1] + 6, L[1] + 26),
  dangXuong: In(fr, L[1] + 14) * Out(fr, L[3]),
  p2: In(fr, L[2], 10),
  tan2: lin(fr, L[2] + 6, L[2] + 26),
  cols: In(fr, C[3], 18),
  q: In(fr, L[4]),
});

// b02: khảo sát như bậc ba: đạo hàm luôn âm, không quay đầu → lẽ ra đi xuống mãi
const s02: Fn = (fr, L) => {
  const p = last(s01);
  return {
    ...p,
    cols: Out(fr, 0),
    q: Out(fr, 0),
    fp: In(fr, L[1]),
    notes: In(fr, L[2]),
    fpNeg: In(fr, L[3]),
    ghost: lin(fr, L[4], L[4] + 24),
    p2Pulse: pulse(fr, L[5], 36),
  };
};

// b03: tập xác định: mẫu bằng 0 tại 1 → đồ thị đứt làm hai nhánh
const s03: Fn = (fr, L) => {
  const p = last(s02);
  return {
    ...p,
    p2Pulse: 0,
    fp: Out(fr, 0, 15),
    notes: Out(fr, 0, 15),
    dLabel: In(fr, L[0]),
    denHi: In(fr, L[1]) * Out(fr, L[3]),
    vline: In(fr, L[1]),
    vlab: In(fr, L[1] + 8),
    vlabStep: 0,
    ghost: Out(fr, L[2], 18),
    halves: In(fr, L[2], 18),
    ptColor: In(fr, L[3]),
  };
};

// b04: sát chỗ đứt: bên trái lao xuống (−19), bên phải vọt lên (21) → tiệm cận đứng
const s04: Fn = (fr, L, E) => {
  const p = last(s03);
  const guess = E[4] + 4;
  return {
    ...p,
    dLabel: Out(fr, 0),
    halves: 1 - 0.55 * lin(fr, 0, 20),
    dot: In(fr, L[0], 10) * Out(fr, L[6]),
    dotX: 0.9 * lin(fr, L[0] + 6, L[0] + 36) + 0.2 * lin(fr, L[4], L[4] + 14),
    div: In(fr, L[1]) * Out(fr, END),
    divStep: lin(fr, L[5], L[5] + 14),
    arrow19: In(fr, L[2]) * Out(fr, L[4]),
    lA: lin(fr, L[3], L[3] + 40),
    guessTop: In(fr, guess, 8) * Out(fr, guess + 18, 8),
    guessBot: In(fr, guess + 22, 8) * Out(fr, L[5] - 6, 8),
    rA: lin(fr, L[5] + 4, L[5] + 40),
    vlineFocus: In(fr, L[6]),
    vlabStep: fr >= L[6] ? 1 : 0,
  };
};

// b05: hai đầu → tiệm cận ngang; vẽ nốt hai nhánh; mỗi nhánh đi xuống, nhánh phải bắt đầu lại từ trên cao
const s05: Fn = (fr, L) => {
  const p = last(s04);
  return {
    ...p,
    div: Out(fr, 0),
    dot: 0,
    tan0: Out(fr, 0),
    tan2: Out(fr, 0),
    approx: In(fr, L[0]),
    hline: lin(fr, L[1], L[1] + 24),
    hlab: In(fr, L[1] + 18),
    lB: lin(fr, L[2], L[2] + 40),
    rB: lin(fr, L[3], L[3] + 40),
    bArrows: In(fr, L[4]),
    jump: In(fr, L[5], 18),
    ptPulse: pulse(fr, L[5] + 10, 36),
  };
};

// b06: điểm cắt hai trục, đều trên nhánh trái
const s06: Fn = (fr, L) => {
  const p = last(s05);
  return {
    ...p,
    ptPulse: 0,
    jump: Out(fr, 0),
    bArrows: Out(fr, 0),
    approx: Out(fr, 0),
    ring0: In(fr, L[1]),
    iLab0: In(fr, L[1] + 6),
    pm1: In(fr, L[2]),
    ring1: In(fr, L[2]),
    iLab1: In(fr, L[2] + 6),
    interPulse: pulse(fr, L[3], 36),
  };
};

// b07: dạng chung: tử của đạo hàm là hằng số → không cực trị, hai nhánh cùng chiều
const s07: Fn = (fr, L) => {
  const p = last(s06);
  const out = Out(fr, 0, 15);
  return {
    ...p,
    interPulse: 0,
    ring0: out,
    ring1: out,
    iLab0: out,
    iLab1: out,
    table: out,
    fpNeg: out,
    general: In(fr, L[0], 18),
    numHi: In(fr, L[1]),
    coefs: In(fr, L[2]),
    conds: In(fr, L[3]),
    condNeg: In(fr, L[4]),
    branchPulse: pulse(fr, L[4], 40),
  };
};

// b08: bẫy: "nghịch biến trên R \ {1}" là sai; đúng là trên từng khoảng
const s08: Fn = (fr, L, E, C) => {
  const p = last(s07);
  const out = Out(fr, 0, 15);
  return {
    ...p,
    branchPulse: 0,
    general: out,
    card: In(fr, L[0]),
    mark: In(fr, L[1]),
    markStep: fr >= C[4] ? 1 : 0,
    ptPulse: pulse(fr, L[2], 36),
    ticks02: In(fr, L[2]) * Out(fr, L[5]),
    remind: In(fr, L[3]) * Out(fr, L[5]),
    cols: In(fr, C[4], 18) * Out(fr, L[5]),
    right: In(fr, L[5]),
    intervals: In(fr, L[5], 18),
    union: In(fr, L[6]),
    intL: pulse(fr, L[7], 36),
    intR: pulse(fr, L[7] + 36, 36),
  };
};

// b09: giải đáp — quay lại hình mở đầu
const s09: Fn = (fr, L) => ({
  formula: 1,
  table: 1,
  rows: [1, 1],
  p0: 1,
  p2: 1,
  tan0: 1,
  tan2: 1,
  lA: 1,
  lB: 1,
  rA: 1,
  rB: 1,
  branchDim: fr >= L[1] ? 0 : 1,
  ptColor: In(fr, L[1]),
  vline: In(fr, L[2]),
  vlab: In(fr, L[2] + 8),
  vlabStep: 2,
  sweep: lin(fr, L[3], L[3] + 70),
});

export const BEATS: Record<string, React.FC<BeatProps>> = {
  b01: make(s01),
  b02: make(s02),
  b03: make(s03),
  b04: make(s04),
  b05: make(s05),
  b06: make(s06),
  b07: make(s07),
  b08: make(s08),
  b09: make(s09),
};
