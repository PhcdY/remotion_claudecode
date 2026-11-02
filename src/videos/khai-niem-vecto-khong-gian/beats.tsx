import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, clamp } from "../../components/BeatShell";
import { fadeIn, lerp, pulse } from "../../components/parts";
import { Scene1 } from "./scene1";
import { Scene2, St, VNAMES } from "./scene2";

// Mỗi beat dựng trạng thái từ trạng thái CUỐI của beat trước (gọi hàm beat trước với frame rất lớn),
// nên các beat cùng cảnh nối liền, không nháy (skill dung-video › Cảnh liền mạch).

const END = 1e9;
const Z = new Array(12).fill(0);
const In = (fr: number, a: number, d = 15) => fadeIn(fr, a, d);
const Out = (fr: number, a: number, d = 12) => 1 - fadeIn(fr, a, d);
const lin = (fr: number, a: number, b: number) => interpolate(fr, [a, Math.max(b, a + 1)], [0, 1], clamp);
type Fn = (fr: number, L: number[], C: number[]) => St;
const last = (fn: Fn) => fn(END, Z, Z);

/** Giữ giá trị cũ rồi mờ đi ở đầu beat. */
const fade = (p: St, keys: string[], fr: number, at = 0): St => Object.fromEntries(keys.map((k) => [k, (p[k] ?? 0) * Out(fr, at)]));
/** Tên đỉnh được nói tới thì rõ, còn lại mờ bớt (chuyển trong 12 frame đầu beat). */
const emph = (p: St, on: string[] | "all", fr: number): St =>
  Object.fromEntries(VNAMES.map((n) => [`e${n}`, lerp(p[`e${n}`] ?? 1, on === "all" || on.includes(n) ? 1 : 0, In(fr, 0, 12))]));

const make =
  (fn: Fn, scene: 1 | 2, phase: string): React.FC<BeatProps> =>
  (p) => {
    const fr = useCurrentFrame();
    // beat có thẻ mở (TRONG ĐỀ THI, BẪY THƯỜNG GẶP, GIẢI ĐÁP): hình chỉ hiện sau khi thẻ đã tắt hẳn
    const o = p.T0 > 0 ? In(fr, p.T0, 8) : 1;
    const st = fn(fr, p.L, p.C ?? p.L);
    return <div style={{ position: "absolute", inset: 0, opacity: o }}>{scene === 1 ? <Scene1 s={st} phase={phase} /> : <Scene2 s={st} phase={phase} />}</div>;
  };

// ================= CẢNH 1: hiện tượng =================

// b01: dưới nắng bóng song song, dài bằng nhau; dưới đèn bóng xòe ra
const s01: Fn = (fr, L) => ({
  day: In(fr, L[0], 18),
  lab6: In(fr, L[0] + 10),
  sh: lin(fr, L[1], L[1] + 24),
  labSS: In(fr, L[1] + 18),
  daySlide: lin(fr, L[2], L[2] + 24),
  night: In(fr, L[2] + 12, 18),
  nsh: lin(fr, L[3], L[3] + 24),
  labXoe: In(fr, L[3] + 18),
});

// ================= CẢNH 2: hình hộp =================

// b02: vectơ = đoạn thẳng có hướng; điểm đầu, điểm cuối, độ dài
const s02: Fn = (fr, L) => ({
  box: In(fr, L[0], 24),
  names: In(fr, L[1]),
  title: In(fr, L[1]) * Out(fr, L[5]),
  AB: In(fr, L[2], 6),
  ABt: lin(fr, L[2], L[2] + 24),
  labAB: In(fr, L[2] + 16),
  dau: In(fr, L[3]),
  pA: pulse(fr, L[3], 30),
  cuoi: In(fr, L[4]),
  pB: pulse(fr, L[4], 30),
  rAB: In(fr, L[5]),
  len: In(fr, L[5] + 6),
  lenStep: 0,
});

// b03: giá; cùng phương (AB, DC); AA' không cùng phương
const s03: Fn = (fr, L) => {
  const p = last(s02);
  return {
    ...p,
    ...fade(p, ["title", "dau", "cuoi", "rAB", "len"], fr),
    ...emph(p, ["A", "B", "C", "D", "A'"], fr),
    giaAB: In(fr, L[0]),
    labGia: In(fr, L[0] + 8) * Out(fr, L[3]),
    DC: In(fr, L[1], 6),
    DCt: lin(fr, L[1], L[1] + 24),
    labDC: In(fr, L[1] + 16),
    giaDC: In(fr, L[2]),
    labCP: In(fr, L[3]),
    giaHi: pulse(fr, L[3], 40),
    AAp: In(fr, L[4], 6) * Out(fr, L[5]),
    AApT: lin(fr, L[4], L[4] + 20),
    giaAA: In(fr, L[4] + 10) * Out(fr, L[5]),
    labKCP: In(fr, L[4] + 14) * Out(fr, L[5]),
  };
};

// b04: cùng phương thì cùng hướng (AB, DC) hoặc ngược hướng (AB, CD)
const s04: Fn = (fr, L) => {
  const p = last(s03);
  return {
    ...p,
    ...fade(p, ["labCP"], fr),
    ...emph(p, ["A", "B", "C", "D"], fr),
    pAB: pulse(fr, L[0], 30),
    pDC: pulse(fr, L[0], 30),
    labCH: In(fr, L[0] + 6) * Out(fr, L[1]),
    CD: In(fr, L[1], 6) * Out(fr, L[3]),
    CDt: lin(fr, L[1], L[1] + 24),
    labCD: In(fr, L[1] + 16) * Out(fr, L[3]),
    dcGhost: In(fr, L[1]) * Out(fr, L[3]),
    labNH: In(fr, L[2]) * Out(fr, L[3]),
  };
};

// b05: bằng nhau = cùng hướng + cùng độ dài; trượt AB khít lên DC; CD không bằng
const s05: Fn = (fr, L) => {
  const p = last(s04);
  return {
    ...p,
    ...fade(p, ["giaAB", "giaDC"], fr),
    pAB: 0,
    pDC: 0,
    rAB: In(fr, L[0]) * Out(fr, L[5]),
    len: In(fr, L[0] + 6) * Out(fr, L[5]),
    lenStep: 1,
    rDC: In(fr, L[1]) * Out(fr, L[5]),
    lenDC: In(fr, L[1] + 6) * Out(fr, L[5]),
    eq: In(fr, L[2]),
    eqHi: 1,
    slide: lin(fr, L[2], L[2] + 24),
    copy: In(fr, L[3], 8) * Out(fr, L[3] + 56),
    copyS: lin(fr, L[3] + 10, L[3] + 50),
    CD: In(fr, L[4], 6) * Out(fr, L[5]),
    CDt: lin(fr, L[4], L[4] + 20),
    labCD: 0,
    dcGhost: In(fr, L[4]) * Out(fr, L[5]),
    labNe: In(fr, L[4] + 12) * Out(fr, L[5]),
  };
};

// b06: vectơ-không: kéo điểm cuối về điểm đầu
const s06: Fn = (fr, L) => {
  const p = last(s05);
  return {
    ...p,
    ...emph(p, ["A", "A'"], fr),
    eqHi: lerp(1, 0.6, In(fr, 0)),
    Z: In(fr, L[0], 8),
    Zz: 2 * (1 - lin(fr, L[1], L[1] + 45)),
    zDot: In(fr, L[2], 8) * Out(fr, L[4]),
    zPulse: pulse(fr, L[2], 30),
    labZ: In(fr, L[2] + 6) * Out(fr, L[4]),
  };
};

// b07: bảng năm tính chất; dòng nào hiện thì thứ trên hình sáng cùng
const s07: Fn = (fr, L) => {
  const p = last(s06);
  return {
    ...p,
    ...emph(p, ["A", "B", "C", "D"], fr),
    table: In(fr, L[0]),
    row1: In(fr, L[0]),
    pAB: pulse(fr, L[0], 36) + pulse(fr, L[2], 36) + pulse(fr, L[3], 36),
    row2: In(fr, L[1]),
    giaAB: 0.8 * pulse(fr, L[1], 50),
    giaDC: 0.8 * pulse(fr, L[1], 50),
    row3: In(fr, L[2]),
    pDC: pulse(fr, L[2], 36) + pulse(fr, L[3], 36),
    row4: In(fr, L[3]),
    row5: In(fr, L[4]),
    zDot: pulse(fr, L[4], 50),
  };
};

// b08: có hình bình hành thì có hai vectơ bằng nhau (cạnh đối, nối điểm đầu – điểm cuối)
const s08: Fn = (fr, L) => {
  const p = last(s07);
  return {
    ...p,
    pAB: 0,
    pDC: 0,
    zDot: 0,
    tDim: In(fr, 0),
    eqHi: lerp(0.6, 0.35, In(fr, 0)) + 0.65 * In(fr, L[6]),
    fillBase: In(fr, L[1]),
    hideAB: In(fr, L[1]),
    // nhãn nhường chỗ cho giao điểm hai đường chéo (dòng 6)
    labHbh: In(fr, L[1] + 6) * Math.max(Out(fr, L[5]), In(fr, L[6])),
    giaAB: In(fr, L[2]) * Out(fr, L[4]),
    giaDC: In(fr, L[2]) * Out(fr, L[4]),
    hi2: In(fr, L[2]) * Out(fr, L[3]),
    rAB: In(fr, L[3]) * Out(fr, L[4]),
    rDC: In(fr, L[3]) * Out(fr, L[4]),
    len: In(fr, L[3] + 6) * Out(fr, L[4]),
    lenDC: In(fr, L[3] + 6) * Out(fr, L[4]),
    AD: In(fr, L[4]),
    BC: In(fr, L[4]),
    diag: In(fr, L[5]) * Out(fr, L[6]),
    hi4: In(fr, L[6]),
  };
};

// b09: AB = DC = D'C' (bắc cầu); hình bình hành ABC'D' cắt xiên qua hộp
const s09: Fn = (fr, L) => {
  const p = last(s08);
  return {
    ...p,
    ...fade(p, ["fillBase", "labHbh", "AD", "BC", "hi4"], fr),
    hideAB: Out(fr, 0) + In(fr, L[4]),
    ...emph(p, ["A", "B", "C", "D", "C'", "D'"], fr),
    eqHi: lerp(1, 0.6, In(fr, 0)) + 0.4 * In(fr, L[3]),
    DpCp: In(fr, L[0], 6),
    DpCpT: lin(fr, L[0], L[0] + 24),
    labDpCp: In(fr, L[0] + 16),
    pAB: pulse(fr, L[1] + 30, 24) + pulse(fr, L[1] + 78, 24),
    pDpCp: pulse(fr, L[1] + 54, 24) + pulse(fr, L[1] + 102, 24),
    fillBack: In(fr, L[2]) * Out(fr, L[3]),
    pDC: pulse(fr, L[2], 30),
    labBack: In(fr, L[2] + 6) * Out(fr, L[3]),
    eqStep: In(fr, L[3]),
    fillSlant: In(fr, L[4]),
    dcGhost: In(fr, L[4]),
    ADp: In(fr, L[4]),
    labSlant: In(fr, L[4] + 6),
  };
};

// b10: trong đề thi: vectơ nào bằng AB? → DC, A'B', D'C' (đủ ba)
const s10: Fn = (fr, L) => {
  const p = last(s09);
  return {
    ...p,
    ...fade(p, ["eq", "fillSlant", "ADp", "labSlant", "DC", "DpCp", "pAB", "pDpCp", "pDC", "hideAB", "dcGhost"], fr),
    ...emph(p, "all", fr),
    tDim: 1,
    card: In(fr, L[0]),
    cardStep: 0,
    DC: In(fr, L[1], 8),
    DCt: 1,
    pDC: pulse(fr, L[1], 30),
    fillFront: In(fr, L[2]) * Out(fr, L[3]),
    ApBp: In(fr, L[2], 8),
    ApBpT: lin(fr, L[2], L[2] + 20),
    labApBp: In(fr, L[2] + 12),
    fillSlant: In(fr, L[3]) * Out(fr, L[4]),
    DpCp: In(fr, L[3], 8),
    DpCpT: 1,
    pDpCp: pulse(fr, L[3], 30),
    hi4: In(fr, L[1]),
    boxDim: In(fr, L[4]),
  };
};

// b11: bẫy: AB = CD? Nối điểm đầu A với C ra đường chéo → ngược hướng, sai; đúng là DC
const s11: Fn = (fr, L) => {
  const p = last(s10);
  return {
    ...p,
    ...fade(p, ["boxDim", "ApBp", "labApBp", "DpCp", "labDpCp", "DC", "fillFront", "fillSlant", "pDC", "pDpCp", "hi4"], fr),
    ...emph(p, ["A", "B", "C", "D"], fr),
    cardStep: In(fr, L[0], 2),
    rAB: In(fr, L[1]),
    rDC: In(fr, L[1]),
    len: In(fr, L[1] + 6),
    lenDC: In(fr, L[1] + 6),
    lenStep: 1,
    CD: In(fr, L[2], 6) * Out(fr, L[5]),
    CDt: lin(fr, L[2], L[2] + 20),
    labCD: In(fr, L[2] + 12) * Out(fr, L[5]),
    ACtrap: In(fr, L[3]) * Out(fr, L[5]),
    neq: In(fr, L[4], 4),
    DC: In(fr, L[5], 8),
    DCt: lin(fr, L[5], L[5] + 20),
    AD: In(fr, L[5]),
    labEq11: In(fr, L[5] + 12),
    labDC: 0,
    hi3: In(fr, L[4]),
  };
};

// ================= CẢNH 1 (quay lại): giải đáp =================

// b12: bóng nắng là ba vectơ bằng nhau; bóng đèn mỗi bóng một hướng
const s12: Fn = (fr, L) => {
  const p = last(s01);
  return {
    ...p,
    // câu kết nói về bóng nắng → khung nắng sáng lại ở dòng cuối
    nightDim: 1 - In(fr, L[6]) + 0.5 * In(fr, L[7]),
    dayDim: In(fr, L[6]) * Out(fr, L[7]),
    rowCard: In(fr, L[0]),
    labSS: p.labSS * Out(fr, L[1]),
    dayArrows: In(fr, L[1]),
    rayHi: In(fr, L[2]),
    labCH: In(fr, L[2] + 6),
    tri: In(fr, L[3]) * Out(fr, L[4]),
    labB6: In(fr, L[3] + 6),
    ruler0: In(fr, L[3] + 6),
    ruler12: In(fr, L[4]),
    rowHi: In(fr, L[5]),
    nightArrows: In(fr, L[6]),
  };
};

export const BEATS: Record<string, React.FC<BeatProps>> = {
  b01: make(s01, 1, "p1"),
  b02: make(s02, 2, "p2"),
  b03: make(s03, 2, "p3"),
  b04: make(s04, 2, "p4"),
  b05: make(s05, 2, "p5"),
  b06: make(s06, 2, "p6"),
  b07: make(s07, 2, "p7"),
  b08: make(s08, 2, "p8"),
  b09: make(s09, 2, "p9"),
  b10: make(s10, 2, "p10"),
  b11: make(s11, 2, "p11"),
  b12: make(s12, 1, "p12"),
};
