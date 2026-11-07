import React from "react";
import { AutoLabelItem, AutoLabels, Rect, segmentObstacles, textObstacle } from "../../components/labels";
import { MathText } from "../../components/MathText";
import { Badge, Tag, lerp } from "../../components/parts";
import { role } from "../../components/roles";
import { colors, fontText, halo, tint } from "../../components/theme";

// Hai cảnh: CẢNH 1 bầu trời (ngôi sao drone, minh họa), CẢNH 2 hình hộp tám drone (mô hình).
// Hình hộp vẽ kiểu SGK: hình chiếu song song, trục sâu xiên 30°, rút ngắn 1/2.
// Xiên 30° (không 45°): vectơ dời (sang 4,8 m, lên 6,4 m) nghiêng 53°, nếu trục sâu cũng ~45° thì mũi tên AM
// gần như chồng lên cạnh AD, người xem đọc thành "bay vào sâu".

// ===================== hình học 3D (đơn vị: mét) =====================

export type V3 = [number, number, number]; // x: sang phải, y: vào sâu, z: lên trên
const K = 56; // px mỗi mét
const OX = 440;
const OY = 860;
const DX = 0.5 * Math.cos(Math.PI / 6);
const DY = 0.5 * Math.sin(Math.PI / 6);
export const P = (v: V3): [number, number] => [OX + K * (v[0] + v[1] * DX), OY - K * (v[2] + v[1] * DY)];
export const add = (a: V3, b: V3, t = 1): V3 => [a[0] + b[0] * t, a[1] + b[1] * t, a[2] + b[2] * t];
const mid = (a: V3, b: V3): V3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];

export const AB = 10;
const AD = 4;
const AA = 4;
export const U: V3 = [4.8, 0, 6.4]; // vectơ dời, dài 8 m
export const V2: V3 = [-8, 0, 3]; // lần dời thứ hai (b09): đủ xa sang trái để mũi tên tổng đi ngoài khối, không qua A', D'
export const WRONG: V3 = [0, 0, 8]; // b08: cùng 8 m, khác hướng

export const VX = {
  A: [0, 0, 0] as V3,
  B: [AB, 0, 0] as V3,
  C: [AB, AD, 0] as V3,
  D: [0, AD, 0] as V3,
  A1: [0, 0, AA] as V3,
  B1: [AB, 0, AA] as V3,
  C1: [AB, AD, AA] as V3,
  D1: [0, AD, AA] as V3,
};
type VName = keyof typeof VX;
export const M = add(VX.A, U);
export const N = add(VX.B, U);
const EDGES: [VName, VName][] = [
  ["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"],
  ["A1", "B1"], ["B1", "C1"], ["C1", "D1"], ["D1", "A1"],
  ["A", "A1"], ["B", "B1"], ["C", "C1"], ["D", "D1"],
];
const hidden = (e: [VName, VName]) => e[0] === "D" || e[1] === "D";

// ===================== nét vẽ =====================

const Line: React.FC<{ a: V3; b: V3; color: string; w?: number; o?: number; dash?: boolean }> = ({ a, b, color, w = 4, o = 1, dash }) => {
  if (o <= 0) return null;
  const [x1, y1] = P(a);
  const [x2, y2] = P(b);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeOpacity={o} strokeDasharray={dash ? "12 10" : undefined} strokeLinecap="round" />;
};

/** Mũi tên từ a tới a + (b − a)·t, đầu nhọn ở ngọn. */
const Arrow: React.FC<{ a: V3; b: V3; t?: number; color: string; o?: number; w?: number; dash?: boolean }> = ({ a, b, t = 1, color, o = 1, w = 6, dash }) => {
  if (o <= 0 || t <= 0.01) return null;
  const [x1, y1] = P(a);
  const [bx, by] = P(b);
  const x2 = lerp(x1, bx, t);
  const y2 = lerp(y1, by, t);
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const H = Math.min(30, len * 0.5);
  const hx = x2 - ux * H;
  const hy = y2 - uy * H;
  return (
    <g opacity={o}>
      <line x1={x1} y1={y1} x2={hx + ux * 4} y2={hy + uy * 4} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash ? "14 10" : undefined} />
      <polygon points={`${x2},${y2} ${hx - uy * 13},${hy + ux * 13} ${hx + uy * 13},${hy - ux * 13}`} fill={color} />
    </g>
  );
};

/** Chấm drone (có quầng sáng). */
const Drone: React.FC<{ v: V3; color?: string; o?: number; r?: number; mark?: string }> = ({ v, color = role.main, o = 1, r = 11, mark }) => {
  if (o <= 0) return null;
  const [x, y] = P(v);
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r * 2} fill={tint(color, 0.18)} />
      <circle cx={x} cy={y} r={r} fill={color} stroke="#fff" strokeWidth={3} data-mark={mark} />
    </g>
  );
};

const SIDE = 30; // thước nằm phía trên-trái mũi tên
/** Đoạn song song với a→b, lệch sang một bên `off` px: thước đo có hai vạch chặn. */
const Ruler: React.FC<{ a: V3; b: V3; o: number; color: string; side?: number }> = ({ a, b, o, color, side = SIDE }) => {
  if (o <= 0) return null;
  const [x1, y1] = P(a);
  const [x2, y2] = P(b);
  const len = Math.hypot(x2 - x1, y2 - y1);
  const nx = (y2 - y1) / len; // pháp tuyến (bên phải chiều đi)
  const ny = -(x2 - x1) / len;
  const off = side;
  const ax = x1 + nx * off;
  const ay = y1 + ny * off;
  const bx = x2 + nx * off;
  const by = y2 + ny * off;
  return (
    <g opacity={o} stroke={color} strokeWidth={3}>
      <line x1={ax} y1={ay} x2={bx} y2={by} />
      <line x1={ax - nx * 12} y1={ay - ny * 12} x2={ax + nx * 12} y2={ay + ny * 12} />
      <line x1={bx - nx * 12} y1={by - ny * 12} x2={bx + nx * 12} y2={by + ny * 12} />
    </g>
  );
};
/** điểm giữa thước (để neo nhãn) */
const rulerMid = (a: V3, b: V3, side = SIDE): [number, number] => {
  const [x1, y1] = P(a);
  const [x2, y2] = P(b);
  const len = Math.hypot(x2 - x1, y2 - y1);
  return [(x1 + x2) / 2 + ((y2 - y1) / len) * side, (y1 + y2) / 2 - ((x2 - x1) / len) * side];
};

const Poly: React.FC<{ pts: V3[]; color: string; o: number }> = ({ pts, color, o }) =>
  o <= 0 ? null : <polygon points={pts.map((v) => P(v).join(",")).join(" ")} fill={tint(color, 0.16 * o)} stroke="none" />;

const Box: React.FC<{ shift?: V3; color: string; o: number; w?: number; hideFaces?: boolean }> = ({ shift = [0, 0, 0], color, o, w = 4 }) =>
  o <= 0 ? null : (
    <g>
      {EDGES.map((e) => (
        <Line key={e.join()} a={add(VX[e[0]], shift)} b={add(VX[e[1]], shift)} color={color} w={w} o={o * (hidden(e) ? 0.8 : 1)} dash={hidden(e)} />
      ))}
    </g>
  );

// ===================== CẢNH 2 — hình hộp =====================

export type St2 = {
  star: number; // ngôi sao thu nhỏ của cảnh 1 (đầu b02)
  box: number; // hộp gốc hiện
  boxGhost: number; // 0: hộp gốc sáng, 1: hộp gốc thành bóng mờ
  model: number; // nhãn "mô hình"
  modelPulse: number;
  names: number; // tên tám đỉnh
  abHi: number; // cạnh AB sáng
  abLab: number; // nhãn AB (bước 0: "AB = 10 m", 1: "10 m")
  abStep: number;
  dimOthers: number; // các drone khác mờ bớt (b03)
  aHi: number; // drone A sáng
  am: number; // drone A bay tới M (0..1)
  amO: number;
  amLab: number;
  startLab: number;
  endLab: number;
  headPulse: number;
  ruler: number;
  amStep: number;
  gia: number; // giá của AM
  giaLab: number;
  bHi: number;
  bn: number;
  bnO: number;
  bnLab: number;
  giaBN: number;
  pairLab: number; // "cùng phương" → "cùng hướng"
  pairStep: number;
  sameLine: number; // mũi tên trên giá AM (giá trùng)
  sameLineLab: number;
  opp: number; // mũi tên ngược hướng trên giá BN
  oppLab: number;
  blinkAM: number;
  blinkBN: number;
  ruler2: number;
  ruler2Lab: number;
  eq: number; // đẳng thức AM = BN
  copy: number; // bản sao AM trượt sang BN (0..1), độ mờ copyO
  copyO: number;
  mn: number;
  mnO: number;
  bold: number; // AM, BN đậm
  para: number;
  paraLab: number;
  mnHi: number;
  mnLab: number;
  moveRest: number; // sáu drone còn lại dời (0..1)
  newBox: number;
  newBoxDim: number;
  wrong: number;
  wrongLab: number;
  wrongEdge: number;
  bPulse: number;
  zeroLab: number;
  edgeMB: number;
  v2: number;
  sum: number;
  // đề thi
  ex: number; // tên hình hộp (góc phải)
  aa: number;
  aaLab: number;
  aaStep: number;
  others3: number;
  othersLab: number;
  aaRev: number;
  abArr: number;
  dcArr: number;
  bottomFill: number;
  dcHi: number;
  backFill: number;
  giaAbDc: number;
  eqLab: number;
  // bẫy
  tAB: number;
  tBC: number;
  tGia: number;
  tBlinkBC: number;
  tBlinkAB: number;
  skewLab: number;
  notLab: number;
  sumLab: number;
  part: 0 | 1 | 2; // phần của cảnh 2 (chọn bộ vật cản của nhãn): 0 b02–b06, 1 b07–b09, 2 b10–b11
};

/** trạng thái cảnh 2: trường thiếu = 0 */
export type S2 = Partial<St2>;

const NAME_OFF: Record<VName, [number, number]> = {
  A: [-48, 2],
  B: [0, 42],
  C: [36, 22],
  D: [26, -24],
  A1: [-44, 2],
  B1: [36, 20],
  C1: [36, -18],
  D1: [-16, -36],
};
const NAME_TXT: Record<VName, string> = { A: "A", B: "B", C: "C", D: "D", A1: "A'", B1: "B'", C1: "C'", D1: "D'" };
const namePos = (n: VName): [number, number] => {
  const [x, y] = P(VX[n]);
  return [x + NAME_OFF[n][0], y + NAME_OFF[n][1]];
};
const M_OFF: [number, number] = [-4, -46];
const N_OFF: [number, number] = [42, -4];

const EQ_X = 1620;
const EQ_Y = 430;
// tên hình hộp (b10): ngay dưới đáy
const EX_X = OX + K * 5;
const EX_Y = OY + 128; // dưới nhãn "10 m"; câu chốt b10 chỉ hiện ở dòng cuối, lúc tên hình đã tắt

const BOUNDS: Rect = { x: 100, y: 120, w: 1720, h: 830 };

// vật cản cố định cho nhãn: cạnh hộp gốc, AM, BN, MN, tên đỉnh, chữ cố định bên phải
// vật cản cho nhãn theo ba phần: 0 = định nghĩa (b02–b06), 1 = khối mới, phản ví dụ, phép cộng (b07–b09),
// 2 = đề thi (b10–b11, chỉ còn hộp gốc) — vật của phần này không chiếm chỗ nhãn của phần kia
const makeObst = (part: 0 | 1 | 2): Rect[] => {
  const exam = part === 2;
  const r: Rect[] = [];
  const seg = (a: V3, b: V3) => {
    const [x1, y1] = P(a);
    const [x2, y2] = P(b);
    r.push(...segmentObstacles(x1, y1, x2, y2));
  };
  EDGES.forEach((e) => seg(VX[e[0]], VX[e[1]]));
  if (!exam) {
    seg(VX.A, M);
    seg(VX.B, N);
    seg(M, N);
    // giá AM, BN (b04–b07), mũi tên thử trên giá (b05)
    seg(add(VX.A, U, -0.25), add(VX.A, U, 2));
    seg(add(VX.B, U, -0.25), add(VX.B, U, 2));
    if (part === 1) {
      // khối mới (b07–b09)
      EDGES.forEach((e) => seg(add(VX[e[0]], U), add(VX[e[1]], U)));
      // phản ví dụ (b08)
      seg(VX.B, add(VX.B, WRONG));
      seg(M, add(VX.B, WRONG));
      seg(M, VX.B);
      // lần dời thứ hai + tổng (b09)
      seg(M, add(M, V2));
      seg(VX.A, add(M, V2));
    }
    [P(M), P(N)].forEach(([x, y], i) => {
      const o = i === 0 ? M_OFF : N_OFF;
      r.push(textObstacle(x + o[0] - 22, y + o[1] - 22, 44, 44));
    });
    r.push(textObstacle(EQ_X - 170, EQ_Y - 30, 340, 70));
  } else {
    // giá AB, D'C' (b10), giá AB, B'C' (b11)
    seg(add(VX.A, [AB, 0, 0], -0.25), add(VX.A, [AB, 0, 0], 1.55));
    seg(add(VX.D1, [AB, 0, 0], -0.25), add(VX.D1, [AB, 0, 0], 1.55));
    seg(add(VX.B1, [0, AD, 0], -1.5), add(VX.B1, [0, AD, 0], 3));
    r.push(textObstacle(EX_X - 190, EX_Y - 35, 380, 70));
  }
  (Object.keys(VX) as VName[]).forEach((n) => {
    const [x, y] = namePos(n);
    r.push(textObstacle(x - 22, y - 22, 44, 44));
  });
  r.push(textObstacle(1500, 120, 330, 60));
  return r;
};
const OBST = [makeObst(0), makeObst(1), makeObst(2)];

const lab = (id: string, at: [number, number], text: string, o: number, color: string = role.focus, extra: Partial<AutoLabelItem> = {}): AutoLabelItem => ({
  id,
  x: at[0],
  y: at[1],
  text,
  color,
  opacity: o,
  ...extra,
});

export const Scene2: React.FC<{ st: S2 }> = ({ st: raw }) => {
  const st = new Proxy(raw, { get: (o, k) => (o as Record<string | symbol, number | undefined>)[k] ?? 0 }) as St2;
  const ghostCol = st.boxGhost > 0 ? role.dim : role.main;
  const boxO = st.box * lerp(1, 0.55, st.boxGhost);
  const droneDim = 1 - 0.6 * st.dimOthers;
  const Mn = add(VX.A, U, st.am);
  const Nn = add(VX.B, U, st.bn);
  const others: VName[] = ["C", "D", "A1", "B1", "C1", "D1"];

  const labels: AutoLabelItem[] = [
    lab("ab", P(mid(VX.A, VX.B)), "", st.abLab, role.focus, {
      steps: ["$AB = 10$ m", "$10$ m"],
      step: st.abStep,
      prefer: ["s"],
      phases: ["b02", "b03", "b04", "b05", "b06", "b07", "b08", "b09", "b10"],
    }),
    lab("am", P(add(VX.A, U, 0.45)), "", st.amLab, role.focus, {
      steps: ["$\\vec{AM}$", "$|\\vec{AM}| = 8$ m"],
      step: st.amStep,
      prefer: ["e", "se"],
      phases: ["b03", "b04", "b05", "b06", "b07", "b08", "b09"],
    }),
    lab("start", P(VX.A), "điểm đầu", st.startLab, role.focus, { prefer: ["w", "sw"], phases: ["b03"] }),
    lab("end", P(M), "điểm cuối", st.endLab, role.focus, { prefer: ["e", "ne"], phases: ["b03"] }),
    lab("gia", P(add(M, U, 0.7)), "giá", st.giaLab, role.focus, { prefer: ["w", "nw"], phases: ["b04", "b05"] }),
    lab("bn", P(add(VX.B, U, 0.75)), "$\\vec{BN}$", st.bnLab, role.focus, { prefer: ["e", "se"], phases: ["b05", "b06", "b07", "b08"] }),
    lab("pair", P(mid(add(M, U, 0.45), add(N, U, 0.45))), "", st.pairLab, role.focus, { steps: ["cùng phương", "cùng hướng"], step: st.pairStep, anchor: "region", phases: ["b05"] }),
    lab("same", P(add(M, U, 0.5)), "giá trùng nhau", st.sameLineLab, role.focus, { prefer: ["w", "nw"], anchor: "region", phases: ["b05"] }),
    lab("opp", P(add(N, U, 0.5)), "ngược hướng", st.oppLab, role.warn, { prefer: ["e"], phases: ["b05"] }),
    lab("ruler2", rulerMid(VX.B, N), "$8$ m", st.ruler2Lab, role.focus, { prefer: ["nw", "w"], phases: ["b06"] }),
    lab("para", P([11.4, 0, 3.4]), "hình bình hành", st.paraLab, role.focus, { anchor: "region", phases: ["b07"] }),
    lab("mn", P(mid(M, N)), "$MN = AB = 10$ m", st.mnLab, role.focus, { prefer: ["n"], phases: ["b07"] }),
    lab("wrong", P(add(VX.B, WRONG, 0.8)), "$8$ m, khác hướng", st.wrongLab, role.warn, { prefer: ["e", "ne"], phases: ["b08"] }),
    lab("sum", P(add(VX.A, add(U, V2), 0.78)), "phép cộng vectơ", st.sumLab, role.focus, { prefer: ["w", "nw"], phases: ["b09"] }),
    lab("zero", P(VX.B), "$\\vec{BB} = \\vec{0}$", st.zeroLab, role.warn, { prefer: ["e", "se"], phases: ["b08"] }),
    lab("aa", P(mid(VX.A, VX.A1)), "", st.aaLab, st.aaStep > 0.5 ? role.warn : role.focus, {
      steps: ["$\\vec{AA'}$", "$\\vec{A'A} \\ne \\vec{AA'}$"],
      step: st.aaStep,
      prefer: ["e"],
      phases: ["b10"],
    }),
    lab("others", P(mid(VX.C, VX.C1)), "$\\vec{BB'},\\ \\vec{CC'},\\ \\vec{DD'}$", st.othersLab, role.focus, { prefer: ["e", "ne"], phases: ["b10"] }),
    lab("abdc", P(mid(VX.D1, VX.C1)), "$\\vec{AB} = \\vec{D'C'}$", st.eqLab, role.focus, { prefer: ["n"], phases: ["b10"] }),
    lab("skew", P([12.4, 2, 1]), "chéo nhau", st.skewLab, role.warn, { prefer: ["e", "se"], anchor: "region", phases: ["b11"] }),
    lab("not", P(mid(VX.A, VX.B)), "không cùng phương", st.notLab, role.warn, { prefer: ["s"], anchor: "region", phases: ["b11"] }),
  ];

  // giá: đường thẳng mảnh kéo dài
  const giaLine = (a: V3, dir: V3, t0: number, t1: number, o: number, color: string) => (
    <Line a={add(a, dir, t0)} b={add(a, dir, t1)} color={color} w={3.5} o={o * 0.85} />
  );
  const BC1dir: V3 = [0, AD, 0];
  const ABdir: V3 = [AB, 0, 0];

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* ngôi sao thu nhỏ (chuyển từ cảnh 1) */}
      {st.star > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: st.star }}>
          {STAR_AT_END().map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={7} fill={role.main} />
          ))}
        </svg>
      ) : null}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* tô mặt */}
        <Poly pts={[VX.A, VX.B, VX.C, VX.D]} color={role.focus} o={st.bottomFill} />
        <Poly pts={[VX.D, VX.C, VX.C1, VX.D1]} color={role.focus} o={st.backFill} />
        <Poly pts={[VX.A, VX.B, N, M]} color={role.focus} o={st.para} />
        {/* giá */}
        {giaLine(VX.A, U, -0.1, 1.9, st.gia, role.focus)}
        {giaLine(VX.B, U, -0.1, 1.9, st.giaBN, role.focus)}
        {giaLine(VX.A, ABdir, -0.25, 1.55, st.giaAbDc, role.focus)}
        {giaLine(VX.D1, ABdir, -0.25, 1.55, st.giaAbDc, role.focus)}
        {giaLine(VX.A, ABdir, -0.3, 1.5, st.tGia * (1 + 0.5 * st.tBlinkAB), role.focus)}
        {giaLine(VX.B1, BC1dir, -1.5, 3, st.tGia * (1 + 0.5 * st.tBlinkBC), role.pairA)}

        {/* hộp gốc */}
        <Box color={ghostCol} o={boxO} />
        <Line a={VX.A} b={VX.B} color={role.focus} w={7} o={st.abHi} />
        <Line a={VX.D} b={VX.C} color={role.focus} w={7} o={st.dcHi} dash />

        {/* hộp mới (sau khi dời) */}
        <Box shift={U} color={role.main} o={st.newBox * (1 - 0.6 * st.newBoxDim)} />

        {/* thước */}
        <Ruler a={VX.A} b={M} o={st.ruler} color={role.focus} />
        <Ruler a={VX.B} b={N} o={st.ruler2} color={role.focus} />

        {/* vectơ dời */}
        <Arrow a={VX.A} b={M} t={st.am} color={role.focus} o={st.amO * (1 + 0.5 * st.blinkAM)} w={6 + 2 * st.bold + 3 * st.blinkAM} />
        <Arrow a={VX.B} b={N} t={st.bn} color={role.focus} o={st.bnO * (1 + 0.5 * st.blinkBN)} w={6 + 2 * st.bold + 3 * st.blinkBN} />
        {/* đầu mũi tên nháy */}
        {st.headPulse > 0 ? <circle cx={P(M)[0]} cy={P(M)[1]} r={26 + 10 * st.headPulse} fill="none" stroke={role.focus} strokeWidth={3} opacity={st.headPulse} /> : null}
        <Arrow a={M} b={add(M, U)} color={role.focus} o={st.sameLine * 0.55} />
        <Arrow a={add(N, U)} b={N} color={role.warn} o={st.opp} />
        <Arrow a={add(VX.A, [AB * st.copy, 0, 0])} b={add(M, [AB * st.copy, 0, 0])} color={role.focus} o={st.copyO * 0.5} w={10} />
        <Line a={M} b={N} color={role.main} w={5} o={st.mnO * (1 - 0.6 * st.newBoxDim)} />
        <Line a={M} b={N} color={role.focus} w={7} o={st.mnHi} />
        <Line a={VX.A} b={VX.B} color={role.focus} w={7} o={st.mnHi} />

        {/* sáu drone còn lại dời */}
        {others.map((n) => (
          <Arrow key={n} a={VX[n]} b={add(VX[n], U)} t={st.moveRest} color={role.focus} o={st.moveRest > 0 ? 0.45 * (1 - st.newBox) : 0} w={3} />
        ))}

        {/* phản ví dụ */}
        <Arrow a={VX.B} b={add(VX.B, WRONG)} t={st.wrong} color={role.warn} o={st.wrong > 0 ? 1 : 0} />
        <Line a={M} b={add(VX.B, WRONG)} color={role.warn} w={5} o={st.wrongEdge} />
        <Line a={M} b={VX.B} color={role.warn} w={5} o={st.edgeMB} />
        {st.bPulse > 0 ? <circle cx={P(VX.B)[0]} cy={P(VX.B)[1]} r={24 + 12 * st.bPulse} fill="none" stroke={role.warn} strokeWidth={4} opacity={st.bPulse} /> : null}

        {/* lần dời thứ hai */}
        <Arrow a={M} b={add(M, V2)} t={st.v2} color={role.pairA} o={st.v2 > 0 ? 1 : 0} />
        <Arrow a={VX.A} b={add(M, V2)} t={st.sum} color={role.focus} o={st.sum > 0 ? 0.9 : 0} dash w={5} />

        {/* đề thi */}
        <Arrow a={VX.A} b={VX.A1} color={role.focus} o={st.aa} />
        <Arrow a={VX.B} b={VX.B1} color={role.focus} o={st.others3} />
        <Arrow a={VX.C} b={VX.C1} color={role.focus} o={st.others3} />
        <Arrow a={VX.D} b={VX.D1} color={role.focus} o={st.others3 * 0.8} dash />
        <Arrow a={VX.A1} b={VX.A} color={role.warn} o={st.aaRev} />
        <Arrow a={VX.A} b={VX.B} color={role.focus} o={st.abArr} />
        <Arrow a={VX.D1} b={VX.C1} color={role.focus} o={st.dcArr} />

        {/* bẫy: AB và B'C' */}
        <Arrow a={VX.A} b={VX.B} color={role.focus} o={st.tAB} w={7 + 3 * st.tBlinkAB} />
        <Arrow a={VX.B1} b={VX.C1} color={role.pairA} o={st.tAB} w={7 + 3 * st.tBlinkBC} />

        {/* drone ở tám đỉnh */}
        {(Object.keys(VX) as VName[]).map((n) => {
          const isA = n === "A";
          const isB = n === "B";
          // drone A, B: chấm cũ ở lại dạng mờ khi drone đã bay
          const leftBehind = (isA && st.am > 0) || (isB && st.bn > 0);
          const o = st.box * (isA ? 1 : isB ? 1 : droneDim) * (leftBehind ? 0.35 : 1);
          const color = isA && st.aHi > 0 ? role.focus : isB && st.bHi > 0 ? role.focus : role.main;
          return <Drone key={n} v={VX[n]} o={o} color={color} mark={`drone-${n}`} />;
        })}
        {/* drone đang bay / đã tới chỗ mới */}
        <Drone v={Mn} o={st.am > 0 ? st.amO : 0} color={role.focus} mark="drone-M" />
        <Drone v={Nn} o={st.bn > 0 ? st.bnO : 0} color={role.focus} mark="drone-N" />
        {others.map((n) => (
          <Drone key={n} v={add(VX[n], U, st.moveRest)} o={st.moveRest > 0 ? 1 - 0.6 * st.newBoxDim : 0} color={role.main} />
        ))}
      </svg>

      {/* tên đỉnh */}
      {(Object.keys(VX) as VName[]).map((n) => {
        const [x, y] = namePos(n);
        return (
          <Tag key={n} x={x} y={y - 24} color={colors.text} weight={700} opacity={st.names * lerp(1, 0.6, st.boxGhost)}>
            {NAME_TXT[n]}
          </Tag>
        );
      })}
      <Tag x={P(M)[0] + M_OFF[0]} y={P(M)[1] + M_OFF[1] - 24} color={role.focus} weight={700} opacity={st.am > 0.9 ? st.amO : 0}>
        M
      </Tag>
      <Tag x={P(N)[0] + N_OFF[0]} y={P(N)[1] + N_OFF[1] - 24} color={role.focus} weight={700} opacity={st.bn > 0.9 ? st.bnO : 0}>
        N
      </Tag>

      {/* chữ cố định bên phải */}
      <Badge x={1830} y={130} text="mô hình" opacity={st.model * (1 - 0.4 * st.modelPulse)} />
      {st.eq > 0 ? (
        <div data-text="eq" style={{ position: "absolute", left: EQ_X, top: EQ_Y, translate: "-50% -50%", fontFamily: fontText, fontSize: 52, color: role.focus, opacity: st.eq, textShadow: halo(), whiteSpace: "nowrap" }}>
          <MathText text="$\vec{AM} = \vec{BN}$" />
        </div>
      ) : null}
      {st.ex > 0 ? (
        <div data-text="hop" style={{ position: "absolute", left: EX_X, top: EX_Y, translate: "-50% -50%", fontFamily: fontText, fontSize: 52, color: colors.text, opacity: st.ex, textShadow: halo(), whiteSpace: "nowrap" }}>
          <MathText text="$ABCD.A'B'C'D'$" />
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <AutoLabels items={labels} obstacles={OBST[st.part]} bounds={BOUNDS} />
      </div>
    </div>
  );
};

// ===================== CẢNH 1 — bầu trời, ngôi sao drone =====================

// ngôi sao nhỏ hơn và trôi xa hơn bề rộng của nó: bóng cũ và hình mới không chồng lên nhau, dễ so
const SC: [number, number] = [640, 580];
const R_OUT = 235;
const R_IN = 96;
const STAR_VERTS: [number, number][] = Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5;
  const r = i % 2 === 0 ? R_OUT : R_IN;
  return [SC[0] + r * Math.cos(a), SC[1] + r * Math.sin(a)];
});
const PER_EDGE = 20;
const starDots = (cx: number, cy: number, k: number): [number, number][] =>
  STAR_VERTS.flatMap(([x0, y0], i) => {
    const [x1, y1] = STAR_VERTS[(i + 1) % 10];
    return Array.from({ length: PER_EDGE }, (_, j) => {
      const t = j / PER_EDGE;
      return [cx + (lerp(x0, x1, t) - SC[0]) * k, cy + (lerp(y0, y1, t) - SC[1]) * k] as [number, number];
    });
  });
const DOTS = starDots(SC[0], SC[1], 1);
// ngôi sao ở chỗ cuối b01 (đã trôi), mờ đi ở đầu cảnh 2
// đầu cảnh 2 (đổi cảnh nên không cần nối vị trí): ngôi sao đặt giữa khung, khung không lệch một bên trước khi hộp hiện
const STAR_AT_END = (): [number, number][] => starDots(960, 560, 1);
export const SHIFT: [number, number] = [600, -110];
/** chỉ số drone trên ngôi sao dùng ở b01 (hai đầu cánh xa nhau) và b12 (năm chấm có mũi tên) */
const TIP_L = 8 * PER_EDGE; // đỉnh cánh trái
const TIP_R = 2 * PER_EDGE; // đỉnh cánh phải
const ARROW_DOTS = [0, 2 * PER_EDGE, 4 * PER_EDGE, 6 * PER_EDGE, 8 * PER_EDGE];

export type St1 = {
  sky: number;
  dots: number; // 0..1: các chấm hiện dần
  count: number; // nhãn 10.518 drone
  shift: number; // 0..1 trôi
  ghost: number; // bóng mờ ở chỗ cũ
  tips: number; // hai drone xa nhau sáng
  arrows: number; // b12: mũi tên giống hệt nhau
  uLab: number;
  edgeHi: number;
};
export const ZERO1: St1 = { sky: 0, dots: 0, count: 0, shift: 0, ghost: 0, tips: 0, arrows: 0, uLab: 0, edgeHi: 0 };

const SkyLine: React.FC = () => {
  const bars = [60, 110, 80, 150, 95, 70, 130, 100, 170, 85, 120, 75, 140, 90, 110, 65, 125, 95];
  let x = 140;
  return (
    <g fill={tint(role.main, 0.16)}>
      {bars.map((h, i) => {
        const w = 70 + ((i * 37) % 40);
        const r = <rect key={i} x={x} y={900 - h} width={w} height={h} rx={6} />;
        x += w + 8;
        return x > 1800 ? null : r;
      })}
    </g>
  );
};

export const Scene1: React.FC<{ st: St1 }> = ({ st }) => {
  const dx = SHIFT[0] * st.shift;
  const dy = SHIFT[1] * st.shift;
  const n = Math.round(DOTS.length * st.dots);
  // một cạnh cánh sao: từ đỉnh cánh trên (chỉ số 0) tới đỉnh lõm kế (PER_EDGE)
  const e0 = STAR_VERTS[0];
  const e1 = STAR_VERTS[1];
  const arrowO = st.arrows;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: st.sky }}>
      <div style={{ position: "absolute", left: 120, top: 120, width: 1680, height: 790, borderRadius: 32, background: `linear-gradient(180deg, ${tint(role.main, 0.1)}, ${tint(role.main, 0.03)})` }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="sky">
            <rect x={120} y={120} width={1680} height={790} rx={32} />
          </clipPath>
        </defs>
        <g clipPath="url(#sky)">
          <SkyLine />
        </g>
        {/* bóng ở chỗ cũ */}
        {st.ghost > 0 ? DOTS.map(([x, y], i) => <circle key={`g${i}`} cx={x} cy={y} r={5} fill={role.dim} opacity={0.5 * st.ghost} />) : null}
        {DOTS.slice(0, n).map(([x, y], i) => {
          const tip = i === TIP_L || i === TIP_R;
          const hi = tip ? st.tips : 0;
          return (
            <g key={i}>
              {hi > 0 ? <circle cx={x + dx} cy={y + dy} r={24} fill={tint(role.focus, 0.25 * hi)} /> : null}
              <circle cx={x + dx} cy={y + dy} r={tip ? 7 + 4 * hi : 7} fill={hi > 0.5 ? role.focus : role.main} opacity={1 - 0.5 * st.tips * (tip ? 0 : 1)} />
            </g>
          );
        })}
        {st.edgeHi > 0 ? (
          <>
            <line x1={e0[0]} y1={e0[1]} x2={e1[0]} y2={e1[1]} stroke={role.focus} strokeWidth={12} opacity={0.6 * st.edgeHi} strokeLinecap="round" />
            <line x1={e0[0] + SHIFT[0]} y1={e0[1] + SHIFT[1]} x2={e1[0] + SHIFT[0]} y2={e1[1] + SHIFT[1]} stroke={role.focus} strokeWidth={12} opacity={st.edgeHi} strokeLinecap="round" />
          </>
        ) : null}
        {/* mũi tên dời (b12): vẽ từ chỗ cũ tới chỗ mới */}
        {arrowO > 0
          ? ARROW_DOTS.map((i) => {
              const [x, y] = DOTS[i];
              const x2 = x + SHIFT[0];
              const y2 = y + SHIFT[1];
              const len = Math.hypot(SHIFT[0], SHIFT[1]);
              const ux = SHIFT[0] / len;
              const uy = SHIFT[1] / len;
              const hx = x2 - ux * 28;
              const hy = y2 - uy * 28;
              return (
                <g key={`a${i}`} opacity={arrowO}>
                  <line x1={x} y1={y} x2={hx} y2={hy} stroke={role.focus} strokeWidth={5} strokeLinecap="round" />
                  <polygon points={`${x2},${y2} ${hx - uy * 12},${hy + ux * 12} ${hx + uy * 12},${hy - ux * 12}`} fill={role.focus} />
                </g>
              );
            })
          : null}
      </svg>
      <Tag x={SC[0] - 120} y={250} color={colors.text} weight={800} size={52} opacity={st.count}>
        10.518 drone
      </Tag>
      <Badge x={SC[0] - 380} y={820} anchor="left" text="minh họa" color={colors.muted} opacity={st.dots > 0 ? 1 : 0} />
      {st.uLab > 0 ? (
        <div data-text="u" style={{ position: "absolute", left: DOTS[0][0] + SHIFT[0] / 2 - 30, top: DOTS[0][1] + SHIFT[1] / 2 - 85, fontFamily: fontText, fontSize: 48, color: role.focus, opacity: st.uLab, textShadow: halo() }}>
          <MathText text="$\vec{u}$" />
        </div>
      ) : null}
    </div>
  );
};
