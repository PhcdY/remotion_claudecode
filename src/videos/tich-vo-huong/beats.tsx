import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, clamp } from "../../components/BeatShell";
import { fadeIn, lerp, pulse } from "../../components/parts";
import { S2, S3, Scene1, Scene2, Scene3, St1, ZERO1 } from "./scene";

// Mỗi beat dựng trạng thái từ trạng thái CUỐI của beat trước (gọi hàm beat trước với frame rất lớn),
// nên các beat cùng cảnh nối liền, không nháy (skill dung-video › Cảnh liền mạch).

const END = 1e9;
const Z = new Array(12).fill(0);
const In = (fr: number, a: number, d = 15) => fadeIn(fr, a, d);
const Out = (fr: number, a: number, d = 12) => 1 - fadeIn(fr, a, d);
const lin = (fr: number, a: number, d: number) => interpolate(fr, [a, a + Math.max(d, 1)], [0, 1], { ...clamp, easing: (u) => u * u * (3 - 2 * u) });
/** tuyến tính (không làm mềm hai đầu): chuyển động đều của vệ tinh */
const flat = (fr: number, a: number, b: number) => interpolate(fr, [a, Math.max(b, a + 1)], [0, 1], clamp);

type Fn<S> = (fr: number, L: number[], C: number[], E: number[]) => S;
const last = <S,>(fn: Fn<S>) => fn(END, Z, Z, Z);

const make =
  <S,>(fn: Fn<S>, Scene: React.FC<{ st: S }>): React.FC<BeatProps> =>
  (p) => {
    const fr = useCurrentFrame();
    const o = p.T0 > 0 ? In(fr, p.T0, 8) : 1;
    return (
      <div style={{ position: "absolute", inset: 0, opacity: o }}>
        <Scene st={fn(fr, p.L, p.C ?? p.L, p.E)} />
      </div>
    );
  };

const lastOf = (E: number[]) => E[E.length - 1] ?? 0;

// ===================== CẢNH 1 =====================

// b01: Vinasat-1 bay đều, trọng lực kéo liên tục
const s01: Fn<St1> = (fr, L, C, E) => ({
  ...ZERO1,
  sat: In(fr, L[0]),
  satGlow: pulse(fr, L[0], 40),
  note: In(fr, L[0]),
  nameLab: In(fr, L[0]),
  th: lerp(-50, 0, flat(fr, L[1], lastOf(E))),
  speedLab: In(fr, C[2]),
  tan: In(fr, C[2]),
  fArrow: In(fr, L[3]),
  fLab: In(fr, L[3]),
});

// b02: công: dương nhanh lên, âm chậm đi, bằng 0 giữ nguyên
const s02: Fn<St1> = (fr, L, _C, E) => {
  const p = last(s01);
  return {
    ...p,
    nameLab: Out(fr, 0),
    left: lin(fr, L[1], 30),
    th: lerp(0, 35, flat(fr, 0, lastOf(E))),
    cong: In(fr, L[1]),
    cond1: In(fr, L[2]),
    cond0: In(fr, L[3]),
  };
};

// b12: giải đáp — trọng lực luôn vuông góc hướng bay
const s12: Fn<St1> = (fr, L, C) => ({
  ...ZERO1,
  left: 1,
  sat: 1,
  note: 1,
  speedLab: 1,
  fArrow: 1,
  fLab: 1,
  prop: In(fr, 0),
  // bay tới đỉnh quỹ đạo rồi dừng khi dấu góc vuông và các nhãn hiện (nhãn không nhảy chỗ; kết đứng yên)
  th: lerp(-15, 0, flat(fr, 0, C[2] || 1)),
  more: In(fr, L[1]),
  tan: In(fr, C[2]),
  right: In(fr, C[2]),
  rightLab: In(fr, C[2]),
  zeroLab: lin(fr, L[3], 12),
  speedHi: In(fr, L[4]),
  satGlow: pulse(fr, L[4], 40),
});

// ===================== CẢNH 2 =====================

// b03: góc giữa hai vectơ chung gốc, 0° đến 180°
const s03: Fn<S2> = (fr, L, C) => ({
  mini: 1,
  cong: 1,
  zoom: In(fr, L[0], 25),
  phi: 90,
  f: In(fr, L[1]),
  fLab: In(fr, L[1]),
  s: In(fr, C[2]),
  sLab: In(fr, C[2]),
  arc: In(fr, L[3]),
  angLab: In(fr, L[3]),
  copy0: In(fr, L[4]) * Out(fr, L[5], 8),
  copy180: In(fr, L[5]) * Out(fr, L[6]),
  copyRot: fr < L[5] ? lin(fr, L[4], 30) : lin(fr, L[5], 30),
  lab0: In(fr, L[4] + 25) * Out(fr, L[5], 8),
  lab180: In(fr, L[5] + 25) * Out(fr, L[6]),
});

// b04: mô hình: góc 60°, lực 3, độ dời 2
const s04: Fn<S2> = (fr, L) => {
  const p = last(s03);
  return {
    ...p,
    copy0: 0,
    copy180: 0,
    lab0: 0,
    lab180: 0,
    phi: lerp(90, 60, lin(fr, L[0], 40)),
    model: In(fr, L[1]),
    ticksF: In(fr, L[2]),
    fStep: lin(fr, L[2], 12),
    ticksS: In(fr, L[3]),
    sStep: lin(fr, L[3], 12),
    angStep: lin(fr, L[4], 12),
  };
};

// b05: tích vô hướng, giải phẫu từng thừa số
const s05: Fn<S2> = (fr, L) => {
  const p = last(s04);
  return {
    ...p,
    cong: Out(fr, L[0]),
    def: In(fr, L[0] + 8),
    hiF: In(fr, L[1]) * Out(fr, L[2]),
    hiS: In(fr, L[2]) * Out(fr, L[3]),
    hiCos: In(fr, L[3]) * Out(fr, L[5]),
    cosNote: In(fr, L[3]),
    calc: In(fr, L[4]),
  };
};

// b06: chuỗi "vì sao" (1/3): côsin cắt ra cái bóng
const s06: Fn<S2> = (fr, L, C) => {
  const p = last(s05);
  return {
    ...p,
    gia: In(fr, 0),
    perp: In(fr, L[1]),
    tri: In(fr, L[2]),
    shadow: In(fr, L[3]),
    shLab: In(fr, L[3]),
    shStep: lin(fr, C[4], 12),
    dot: lin(fr, L[5], 40),
  };
};

// b07: chuỗi "vì sao" (2/3): tích = lực × bóng; góc tù → bóng ngược → tích âm
const s07: Fn<S2> = (fr, L) => {
  const p = last(s06);
  const turn = lin(fr, L[2], 40);
  return {
    ...p,
    dot: 0,
    r1: In(fr, L[0]),
    calc: Out(fr, L[2]),
    tri: (p.tri ?? 0) * (1 - turn) + In(fr, L[2] + 40),
    phi: lerp(60, 120, turn),
    // nhãn góc tắt trong lúc quay rồi hiện lại với số mới (không chồng hai chữ)
    angLab: fr < L[2] + 20 ? Out(fr, L[2], 8) : In(fr, L[2] + 30),
    angStep: fr < L[2] + 20 ? 1 : 2,
    shStep: 1 + lin(fr, L[3], 12),
    hiCos: In(fr, L[5]) * Out(fr, L[6]),
    cosStep: lin(fr, L[5], 10),
    r2: In(fr, L[6]),
  };
};

// b08: chuỗi "vì sao" (3/3): câu hỏi đoán; góc vuông → bóng là một điểm → tích bằng 0
const s08: Fn<S2> = (fr, L, _C, E) => {
  const p = last(s07);
  const q = E[0] || 0; // khoảng nghỉ sau câu hỏi
  const turn = lin(fr, L[1], 40);
  return {
    ...p,
    ghostF: pulse(fr, q, 20) + pulse(fr, q + 26, 20),
    ghostB: pulse(fr, q + 13, 20) + pulse(fr, q + 39, 20),
    phi: lerp(120, 90, turn),
    tri: (p.tri ?? 0) * (1 - turn),
    perp: (p.perp ?? 0) * (1 - turn),
    arc: 1,
    angLab: Out(fr, L[1]),
    shStep: 2 + lin(fr, L[1] + 30, 12),
    r3: In(fr, L[2]),
  };
};

// b09: vuông góc ⇔ tích bằng 0, cho mọi cặp vectơ khác vectơ-không
const s09: Fn<S2> = (fr, L) => {
  const p = last(s08);
  return {
    ...p,
    right: In(fr, L[0]),
    insetDim: In(fr, 0, 20),
    cosNote: Out(fr, 0),
    propL: In(fr, L[1]),
    propR: In(fr, L[2]),
  };
};

// ===================== CẢNH 3 =====================

// b10: AB · A'C' trên hình lập phương: dời chung gốc, góc 45°, bóng = a
const s10: Fn<S3> = (fr, L) => ({
  cube: 1,
  prop: 1,
  aLab: In(fr, L[0]),
  ab: In(fr, L[1]),
  a1c1: In(fr, L[1]),
  q1: In(fr, L[1]),
  copyAC: lin(fr, L[3], 40),
  copyACo: In(fr, L[3]),
  acLab: In(fr, L[3] + 40),
  arc45: In(fr, L[4]),
  lab45: In(fr, L[4]),
  calc: In(fr, L[5]),
  calcStep: lin(fr, L[6], 12),
  cb: In(fr, L[7]),
  abShadow: In(fr, L[7]),
  aStep: lin(fr, L[7], 12),
  q1Step: lin(fr, L[8], 12),
});

// b11: bẫy — AB · C'D': song song nhưng góc hai vectơ 180°
const s11: Fn<S3> = (fr, L) => {
  const p = last(s10);
  const off = Out(fr, 0);
  return {
    ...p,
    a1c1: off,
    copyACo: off,
    acLab: off,
    arc45: off,
    lab45: off,
    calc: off,
    cb: off,
    abShadow: off,
    aLab: off,
    q1Dim: In(fr, 0),
    c1d1: In(fr, L[0]),
    q2: In(fr, L[0]),
    giaPar: In(fr, L[1]),
    lab0: In(fr, L[1]),
    copyCD: lin(fr, L[2], 45),
    copyCDo: In(fr, L[2]),
    arc180: In(fr, L[3]),
    lab180: In(fr, L[3]),
    revShadow: In(fr, L[4]),
    q2Step: lin(fr, L[4], 12),
  };
};

export const BEATS: Record<string, React.FC<BeatProps>> = {
  b01: make(s01, Scene1),
  b02: make(s02, Scene1),
  b03: make(s03, Scene2),
  b04: make(s04, Scene2),
  b05: make(s05, Scene2),
  b06: make(s06, Scene2),
  b07: make(s07, Scene2),
  b08: make(s08, Scene2),
  b09: make(s09, Scene2),
  b10: make(s10, Scene3),
  b11: make(s11, Scene3),
  b12: make(s12, Scene1),
};
