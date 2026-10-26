import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, clamp } from "../../components/BeatShell";
import { fadeIn, lerp, pulse } from "../../components/parts";
import { R_CUP, R_OPT, R_REAL, S1_0, S2_0, S3_0, Scene1, Scene2, Scene3, St1, St2, St3 } from "./scene";

// Mỗi beat dựng trạng thái từ trạng thái CUỐI của beat trước (gọi hàm beat trước với frame rất lớn),
// nên các beat cùng cảnh nối liền, không nháy (skill dung-video › Cảnh liền mạch).

const END = 1e9;
const Z = new Array(12).fill(0);
const In = (fr: number, a: number, d = 15) => fadeIn(fr, a, d);
const Out = (fr: number, a: number, d = 12) => 1 - fadeIn(fr, a, d);
const lin = (fr: number, a: number, b: number) => interpolate(fr, [a, Math.max(b, a + 1)], [0, 1], clamp);
/** bán kính đổi mượt từ a sang b trong [t, t + d] (nội suy theo thể tích để chiều cao không giật) */
const rTo = (fr: number, t: number, a: number, b: number, d = 36) => lerp(a, b, lin(fr, t, t + d));

type Fn<S> = (fr: number, L: number[], E: number[]) => S;
const last = <S,>(fn: Fn<S>) => fn(END, Z, Z);

const make =
  <S,>(fn: Fn<S>, View: React.FC<{ st: S }>): React.FC<BeatProps> =>
  (p) => {
    const fr = useCurrentFrame();
    const o = p.T0 > 0 ? In(fr, p.T0, 8) : 1;
    return (
      <div style={{ position: "absolute", inset: 0, opacity: o }}>
        <View st={fn(fr, p.L, p.E)} />
      </div>
    );
  };

// ---------------- CẢNH 1 ----------------
// b01: lon cao gần gấp đôi bề ngang, chứa 330 ml; lon gầy hơn / béo hơn cũng được; dáng nào ít nhôm nhất?
const s01: Fn<St1> = (fr, L) => ({
  ...S1_0,
  hBar: In(fr, L[0]),
  wBar: In(fr, L[0]),
  tRatio: In(fr, L[0] + 8) * Out(fr, END),
  ml: In(fr, L[1]),
  side: In(fr, L[2], 18),
  sideHi: [pulse(fr, L[3], 30), 0, pulse(fr, L[3] + 60, 30)],
});

// b02: thu nhỏ lon → không đủ 330 ml → giữ thể tích, chỉ đổi dáng
const s02: Fn<St1> = (fr, L) => {
  const p = last(s01);
  const shrink = lerp(1, 0.6, lin(fr, L[0], L[0] + 30)) + 0.4 * lin(fr, L[2], L[2] + 30);
  return {
    ...p,
    sideHi: [0, 0, 0],
    side: Out(fr, 0, 12),
    tRatio: Out(fr, 0, 12),
    hBar: Out(fr, 0, 12),
    wBar: Out(fr, 0, 12),
    water: In(fr, 0, 12),
    shrink,
    ghost: In(fr, L[1]) * Out(fr, L[2]),
    tShort: In(fr, L[1]) * Out(fr, L[2]),
    mlLock: In(fr, L[2] + 20),
  };
};

// b03: kéo gầy (r = 2) tốn thân, kéo béo (r = 7) tốn nắp đáy → ở giữa có dáng tốt nhất
const s03: Fn<St1> = (fr, L) => {
  const p = last(s02);
  let r = rTo(fr, L[0], R_REAL, 2, 40);
  if (fr >= L[2]) r = rTo(fr, L[2], 2, 7, 45);
  if (fr >= L[4]) r = rTo(fr, L[4], 7, R_REAL, 40);
  return {
    ...p,
    water: Out(fr, 0),
    ml: Out(fr, L[0], 10),
    r,
    tR2: In(fr, L[0] + 30) * Out(fr, L[2]),
    bodyHi: In(fr, L[1]) * Out(fr, L[2]) + In(fr, L[4]),
    tR7: In(fr, L[2] + 35) * Out(fr, L[4]),
    endsHi: In(fr, L[3]),
    legend: 1,
  };
};

// b04: mô hình vỏ dày đều → nhôm ↔ diện tích; r, h; nắp đáy 2πr², thân 2πrh; ghép S
const s04: Fn<St1> = (fr, L) => {
  const p = last(s03);
  // lon dời sang trái đúng lúc thẻ công thức vào (dòng 6), trước đó đứng giữa khung
  const move = lin(fr, L[5], L[5] + 24);
  return {
    ...p,
    canX: lerp(960, 480, move),
    legend: Out(fr, 0),
    bodyHi: Out(fr, 0) + In(fr, L[4]) * Out(fr, L[5] + 30),
    endsHi: Out(fr, 0) + In(fr, L[3]) * Out(fr, L[5] + 30),
    tModel: In(fr, L[0]) * Out(fr, L[5]),
    shell: In(fr, L[1]) * Out(fr, L[2]),
    tShell: In(fr, L[1]) * Out(fr, L[2]),
    rBar: In(fr, L[2]),
    hBar: In(fr, L[2]),
    sym: In(fr, L[2]),
    tUnits: In(fr, L[2] + 8) * Out(fr, L[3]),
    tEnds: In(fr, L[3]) * Out(fr, L[5] + 10),
    tBody: In(fr, L[4]) * Out(fr, L[5] + 10),
    panel: In(fr, L[5]),
    rowS: In(fr, L[5] + 10, 18),
  };
};

// b05: hai thứ thay đổi; nhưng V = πr²h = 330 buộc chúng; r = 3 → h ≈ 11,7; r = 4 → h ≈ 6,6
const s05: Fn<St1> = (fr, L) => {
  const p = last(s04);
  let r = R_REAL;
  if (fr >= L[3]) r = rTo(fr, L[3], R_REAL, 3, 30);
  if (fr >= L[4]) r = rTo(fr, L[4], 3, 4, 36);
  return {
    ...p,
    r,
    rhHi: In(fr, L[0]) * Out(fr, L[1] + 20),
    rowV: In(fr, L[1]),
    note330: In(fr, L[2]) * Out(fr, END),
    tRH: In(fr, L[3] + 20),
    tRHStep: lin(fr, L[4] + 20, L[4] + 34),
  };
};

// b06: h = 330/(πr²) → thay vào thân → triệt π, r → 660/r → S(r) một biến
const s06: Fn<St1> = (fr, L) => {
  const p = last(s05);
  return {
    ...p,
    note330: Out(fr, 0),
    tRH: Out(fr, 0),
    rowVStep: lin(fr, L[0], L[0] + 16),
    hHi: In(fr, L[1]) * Out(fr, L[3]),
    work: In(fr, L[2]) * Out(fr, L[5], 14),
    workStep: (fr >= L[3] ? 1 : 0) + (fr >= L[4] ? 1 : 0),
    workNote: In(fr, L[3]) * Out(fr, L[4]),
    rowSStep: lin(fr, L[5], L[5] + 16),
  };
};

// ---------------- CẢNH 2 ----------------
// b07: vẽ S(r); điểm r = 2, r = 7; hai thành phần; cộng lại có chỗ thấp nhất
const s07: Fn<St2> = (fr, L) => ({
  ...S2_0,
  draw: lin(fr, L[0], L[0] + 50),
  p2: In(fr, L[1]) * Out(fr, END),
  canR: L[1] > 0 && fr >= L[2] ? rTo(fr, L[2], 2, 7, 36) : fr >= L[1] ? rTo(fr, L[1], 4, 2, 30) : 4,
  p7: In(fr, L[2]),
  cEnds: lin(fr, L[3], L[3] + 36),
  cBody: lin(fr, L[4], L[4] + 36),
  sBold: In(fr, L[5]),
  trough: In(fr, L[5] + 10),
});

// b08: mốc bài trước; r > 0, hai đầu vọt lên; S'; giải S' = 0; tiếp tuyến ngang, r ≈ 3,74; âm/dương hai bên
const s08: Fn<St2> = (fr, L) => {
  const p = last(s07);
  return {
    ...p,
    compDim: Out(fr, 0, 15),
    p2: Out(fr, 0, 15),
    p7: Out(fr, 0, 15),
    sBold: Out(fr, 0, 15),
    trough: Out(fr, 0, 15),
    canO: Out(fr, 0, 15),
    rowMoc: In(fr, L[0]),
    rPos: In(fr, L[1]) * Out(fr, L[2] + 20),
    endsPulse: In(fr, L[1] + 10) * Out(fr, L[2]),
    rowD: In(fr, L[2]),
    rowEq: In(fr, L[3]),
    tan: In(fr, L[4]),
    rLab: In(fr, L[4] + 10),
    sides: In(fr, L[5], 18),
  };
};

// b09: lon về r = 3,74 (phóng to); cao ≈ 7,5; ngang ≈ 7,5; khung vuông, h = 2r
const s09: Fn<St2> = (fr, L) => {
  const p = last(s08);
  return {
    ...p,
    rowMoc: Out(fr, 0),
    rowD: Out(fr, 0),
    rowEq: Out(fr, 0),
    sides: Out(fr, 0, 15),
    canR: R_OPT,
    canK: 26,
    canO: In(fr, L[0]),
    hBar: In(fr, L[0]),
    hLab: In(fr, L[0] + 8),
    wBar: In(fr, L[1]),
    wLab: In(fr, L[1]),
    box: In(fr, L[2]),
    h2r: In(fr, L[2] + 10),
  };
};

// b10: bốn bước; bước 2 là chìa khoá
const s10: Fn<St2> = (fr, L) => {
  const p = last(s09);
  return {
    ...p,
    canO: Out(fr, 0, 15),
    hLab: Out(fr, 0, 15),
    recap: In(fr, L[0]),
    stepO: [In(fr, L[1]), In(fr, L[2]), In(fr, L[3]), In(fr, L[4])],
    rPos: In(fr, L[3]) * Out(fr, L[4]),
    rLab: 1,
    tan: 1,
    stepFocus: In(fr, L[5]),
  };
};

// ---------------- CẢNH 3 ----------------
// b11: cốc không nắp 330 ml: S = πr² + 2πrh → S(r) = πr² + 660/r → r > 0 → r ≈ 4,72 → h = r
const s11: Fn<St3> = (fr, L) => ({
  ...S3_0,
  cup: In(fr, L[0], 18),
  tCup: In(fr, L[0] + 10),
  cupHi: In(fr, L[1]) * Out(fr, L[2] + 30),
  rowA: In(fr, L[1]),
  rowAStep: lin(fr, L[2], L[2] + 16),
  rowB: In(fr, L[3]),
  cupR: rTo(fr, L[4], 3.5, R_CUP, 40),
  tR: In(fr, L[4] + 30),
  hEq: In(fr, L[5]),
});

// b12: giải đáp — lon tốt nhất cạnh lon thật; nắp đáy dày → dáng tốt nhất dịch về phía gầy
const s12: Fn<St3> = (fr, L) => {
  const p = last(s11);
  return {
    ...p,
    fade: lin(fr, 0, 15),
    canLBadge: Out(fr, 0),
    real: In(fr, L[0], 18),
    tAns: In(fr, L[1]),
    realThick: In(fr, L[2]),
    tThick: In(fr, L[2] + 8),
    arrow: lin(fr, L[3], L[3] + 30),
  };
};


export const BEATS: Record<string, React.FC<BeatProps>> = {
  b01: make(s01, Scene1),
  b02: make(s02, Scene1),
  b03: make(s03, Scene1),
  b04: make(s04, Scene1),
  b05: make(s05, Scene1),
  b06: make(s06, Scene1),
  b07: make(s07, Scene2),
  b08: make(s08, Scene2),
  b09: make(s09, Scene2),
  b10: make(s10, Scene2),
  b11: make(s11, Scene3),
  b12: make(s12, Scene3),
};
