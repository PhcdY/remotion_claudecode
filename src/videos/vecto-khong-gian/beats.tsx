import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, clamp } from "../../components/BeatShell";
import { fadeIn, pulse } from "../../components/parts";
import { S2, Scene1, Scene2, St1, ZERO1 } from "./scene";

// Mỗi beat dựng trạng thái từ trạng thái CUỐI của beat trước (gọi hàm beat trước với frame rất lớn),
// nên các beat cùng cảnh nối liền, không nháy (skill dung-video › Cảnh liền mạch).

const END = 1e9;
const Z = new Array(12).fill(0);
const In = (fr: number, a: number, d = 15) => fadeIn(fr, a, d);
const Out = (fr: number, a: number, d = 12) => 1 - fadeIn(fr, a, d);
const lin = (fr: number, a: number, d: number) => interpolate(fr, [a, a + d], [0, 1], { ...clamp, easing: (u) => u * u * (3 - 2 * u) });
const C_ = (p: BeatProps) => p.C ?? p.L;

type Fn<S> = (fr: number, L: number[], C: number[]) => S;
const last = <S,>(fn: Fn<S>) => fn(END, Z, Z);

const make =
  <S,>(fn: Fn<S>, Scene: React.FC<{ st: S }>): React.FC<BeatProps> =>
  (p) => {
    const fr = useCurrentFrame();
    const o = p.T0 > 0 ? In(fr, p.T0, 8) : 1;
    return (
      <div style={{ position: "absolute", inset: 0, opacity: o }}>
        <Scene st={fn(fr, p.L, C_(p))} />
      </div>
    );
  };

// ===================== CẢNH 1 =====================

// b01: 10.518 drone, cả hình trôi mà không méo
const s01: Fn<St1> = (fr, L) => ({
  ...ZERO1,
  sky: 1,
  dots: lin(fr, L[0], 40),
  count: In(fr, L[1]),
  shift: lin(fr, L[2], 45),
  ghost: In(fr, L[2], 20),
  tips: In(fr, L[3]),
});

// ===================== CẢNH 2 =====================

// b02: đổi sang mô hình: tám drone ở tám đỉnh hình hộp
const s02: Fn<S2> = (fr, L) => ({
  star: Out(fr, L[0], 20),
  model: In(fr, L[0]),
  box: In(fr, L[1], 20),
  modelPulse: pulse(fr, L[2], 24),
  names: In(fr, L[3]),
  abHi: In(fr, L[4]),
  abLab: In(fr, L[4]),
});

// b03: đường bay A → M là vectơ; điểm đầu, điểm cuối
const s03: Fn<S2> = (fr, L) => {
  const p = last(s02);
  return {
    ...p,
    abHi: Out(fr, 0),
    abStep: lin(fr, 0, 12),
    aHi: In(fr, L[0]),
    dimOthers: In(fr, L[0]),
    am: lin(fr, L[1], 40),
    amO: In(fr, L[1], 4),
    amLab: In(fr, L[1] + 36),
    startLab: In(fr, L[2]),
    endLab: In(fr, L[3]),
  };
};

// b04: độ dài 8 m, giá
const s04: Fn<S2> = (fr, L, C) => {
  const p = last(s03);
  return {
    ...p,
    startLab: Out(fr, 0),
    endLab: Out(fr, 0),
    ruler: In(fr, C[1]),
    amStep: lin(fr, C[1], 12),
    gia: lin(fr, C[2], 25),
    giaLab: In(fr, C[2] + 15),
    headPulse: pulse(fr, L[3], 30) + pulse(fr, L[3] + 34, 30),
  };
};

// b05: drone B; cùng phương, giá trùng, ngược hướng, cùng hướng
const s05: Fn<S2> = (fr, L, C) => {
  const p = last(s04);
  return {
    ...p,
    bHi: In(fr, L[0]),
    bn: lin(fr, L[0], 40),
    bnO: In(fr, L[0], 4),
    bnLab: In(fr, L[0] + 36),
    giaBN: lin(fr, L[1], 25),
    pairLab: In(fr, C[2]),
    pairStep: lin(fr, L[5], 15),
    sameLine: In(fr, L[3]) * Out(fr, L[4]),
    sameLineLab: In(fr, L[3]) * Out(fr, L[4]),
    opp: In(fr, C[4]) * Out(fr, L[5]),
    oppLab: In(fr, C[4]) * Out(fr, L[5]),
  };
};

// b06: AM = BN dù ở hai góc khác nhau
const s06: Fn<S2> = (fr, L, C) => {
  const p = last(s05);
  const q = L[1];
  return {
    ...p,
    pairLab: Out(fr, 0),
    giaLab: Out(fr, 0),
    blinkAM: pulse(fr, q, 22) + pulse(fr, q + 50, 22),
    blinkBN: pulse(fr, q + 25, 22) + pulse(fr, q + 75, 22),
    ruler2: In(fr, C[2]),
    ruler2Lab: In(fr, C[2]),
    eq: In(fr, L[3]),
    copy: lin(fr, L[4] + 10, 40),
    copyO: In(fr, L[4]) * Out(fr, L[4] + 60, 15),
  };
};

// b07: chuỗi "vì sao" (1/2): ABNM hình bình hành → MN song song, bằng AB → cả khối trượt
const s07: Fn<S2> = (fr, L, C) => {
  const p = last(s06);
  return {
    ...p,
    ruler: Out(fr, 0),
    amStep: Out(fr, 0),
    ruler2: Out(fr, 0),
    ruler2Lab: Out(fr, 0),
    gia: fr < L[2] ? Out(fr, 0) : In(fr, L[2]) * Out(fr, L[4]),
    giaBN: fr < L[2] ? Out(fr, 0) : In(fr, L[2]) * Out(fr, L[4]),
    mn: lin(fr, L[1], 20),
    mnO: In(fr, L[1]),
    paraLab: In(fr, C[4]) * Out(fr, L[6]),
    mnHi: In(fr, C[5]) * Out(fr, L[6]),
    mnLab: In(fr, C[5]) * Out(fr, L[6]),
    moveRest: lin(fr, L[6], 40),
    newBox: In(fr, L[6] + 40, 20),
    boxGhost: In(fr, L[6] + 34, 15),
    bold: In(fr, L[3]) * Out(fr, L[6]),
    para: In(fr, C[4]) * Out(fr, L[6]),
  };
};

// b08: chuỗi "vì sao" (2/2): lệch hướng → méo; đứng yên (vectơ-không) → méo
const s08: Fn<S2> = (fr, L, C) => {
  const p = last(s07);
  const back = In(fr, L[6]);
  const away = In(fr, L[0]);
  return {
    ...p,
    newBoxDim: away * (1 - back),
    boxGhost: 1 - away + back,
    bnO: 1 - 0.65 * away * (1 - back),
    wrong: lin(fr, L[1], 25) * Out(fr, L[3]),
    wrongLab: In(fr, L[1] + 20) * Out(fr, L[3]),
    wrongEdge: In(fr, L[2]) * Out(fr, L[3]),
    bPulse: pulse(fr, L[3], 26) + pulse(fr, L[3] + 30, 26),
    zeroLab: In(fr, C[4]) * Out(fr, L[6]),
    edgeMB: In(fr, L[5]) * Out(fr, L[6]),
  };
};

// b09: dời hai lần → phép cộng (để dành)
const s09: Fn<S2> = (fr, L, C) => {
  const p = last(s08);
  return {
    ...p,
    newBoxDim: In(fr, L[0]),
    v2: lin(fr, L[0], 30),
    sum: lin(fr, C[1], 30),
  };
};

// b10: đề thi trên hình hộp
const s10: Fn<S2> = (fr, L, C) => {
  const p = last(s09);
  const off = Out(fr, 0, 12);
  const gone = fr < 14;
  return {
    ...p,
    am: gone ? 1 : 0,
    bn: gone ? 1 : 0,
    amO: off,
    bnO: off,
    amLab: off,
    bnLab: off,
    moveRest: gone ? 1 : 0,
    newBox: off,
    newBoxDim: 1,
    mnO: off,
    eq: off,
    zeroLab: 0,
    v2: gone ? p.v2 : 0,
    sum: gone ? p.sum : 0,
    boxGhost: off,
    dimOthers: off,
    aHi: off > 0.5 ? 1 : 0,
    bHi: off > 0.5 ? 1 : 0,
    ex: In(fr, L[0]) * Out(fr, L[4]),
    aa: In(fr, L[1]) * Out(fr, L[4]),
    aaLab: In(fr, L[1]) * Out(fr, L[4]),
    others3: In(fr, L[2]) * Out(fr, L[4]),
    othersLab: In(fr, L[2]) * Out(fr, L[4]),
    aaRev: In(fr, L[3]) * Out(fr, L[4]),
    aaStep: lin(fr, L[3], 12),
    abArr: In(fr, L[4]),
    dcArr: In(fr, L[4]),
    bottomFill: In(fr, L[5]) * Out(fr, L[6]),
    dcHi: In(fr, L[5]) * Out(fr, L[7]),
    backFill: In(fr, L[6]) * Out(fr, L[7]),
    giaAbDc: In(fr, L[7]),
    eqLab: In(fr, C[7]),
  };
};

// b11: AB và B'C' chéo nhau → không cùng phương
const s11: Fn<S2> = (fr, L, C) => {
  const p = last(s10);
  return {
    ...p,
    abArr: Out(fr, 0),
    dcArr: Out(fr, 0),
    giaAbDc: Out(fr, 0),
    eqLab: Out(fr, 0),
    tAB: In(fr, L[0]),
    tGia: lin(fr, L[1], 25),
    tBlinkBC: pulse(fr, L[2] + 10, 30),
    tBlinkAB: pulse(fr, L[2] + 45, 30),
    skewLab: In(fr, C[3]),
    notLab: In(fr, L[4]),
  };
};

// ===================== CẢNH 1 (giải đáp) =====================

const s12: Fn<St1> = (fr, L, C) => ({
  ...ZERO1,
  sky: 1,
  dots: 1,
  count: 1,
  arrows: In(fr, L[1]),
  uLab: In(fr, C[1]),
  shift: lin(fr, L[2], 45),
  ghost: In(fr, L[2], 20),
  edgeHi: In(fr, L[4]),
});

export const BEATS: Record<string, React.FC<BeatProps>> = {
  b01: make(s01, Scene1),
  b02: make(s02, Scene2),
  b03: make(s03, Scene2),
  b04: make(s04, Scene2),
  b05: make(s05, Scene2),
  b06: make(s06, Scene2),
  b07: make(s07, Scene2),
  b08: make(s08, Scene2),
  b09: make(s09, Scene2),
  b10: make(s10, Scene2),
  b11: make(s11, Scene2),
  b12: make(s12, Scene1),
};
