import React from "react";
import { AutoLabelItem, AutoLabels, Rect, segmentObstacles, textObstacle } from "../../components/labels";
import { MathText } from "../../components/MathText";
import { Badge, Tag, col, lerp } from "../../components/parts";
import { role } from "../../components/roles";
import { ArrowPx, Seg, V3, add3, angleOf, arcPath, makeProj, mid3 } from "../../components/space3d";
import { colors, fontText, halo, tint } from "../../components/theme";

// Ba cảnh: CẢNH 1 Trái Đất + quỹ đạo Vinasat-1 (không theo tỉ lệ); CẢNH 2 kính lúp quanh vệ tinh
// (mô hình: lực 3, độ dời 2); CẢNH 3 hình lập phương (đề thi).
// Màu: lực = pairA, độ dời = pairB, bóng cùng hướng lực = up, ngược hướng = down, thứ đang nói tới = focus.

type Pt = [number, number];
const F_COL = role.pairA;
const S_COL = role.pairB;

const lab = (id: string, at: Pt, text: string, o: number, color: string = role.focus, extra: Partial<AutoLabelItem> = {}): AutoLabelItem => ({
  id,
  x: at[0],
  y: at[1],
  text,
  color,
  opacity: o,
  ...extra,
});

/** Chữ cố định (công thức, kết quả) đặt theo tâm, có halo. */
const Fixed: React.FC<{ x: number; y: number; text: string; o: number; size?: number; color?: string; name: string; anchor?: "center" | "left" }> = ({
  x,
  y,
  text,
  o,
  size = 44,
  color = colors.text,
  name,
  anchor = "center",
}) =>
  o <= 0 ? null : (
    <div
      data-text={name}
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: anchor === "center" ? "-50% -50%" : "0 -50%",
        fontFamily: fontText,
        fontWeight: 600,
        fontSize: size,
        color,
        opacity: o,
        textShadow: halo(),
        whiteSpace: "nowrap",
      }}
    >
      <MathText text={text} />
    </div>
  );

/** Vệ tinh: thân hộp + hai tấm pin. k: tỉ lệ (1 → rộng ~150px). */
const Satellite: React.FC<{ x: number; y: number; k?: number; rot?: number; o?: number; glow?: number }> = ({ x, y, k = 1, rot = 0, o = 1, glow = 0 }) =>
  o <= 0 ? null : (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`} opacity={o}>
      {glow > 0 ? <circle r={70} fill={tint(role.focus, 0.18 * glow)} /> : null}
      <line x1={-75} y1={0} x2={75} y2={0} stroke={colors.axis} strokeWidth={4} />
      <rect x={-75} y={-14} width={50} height={28} rx={3} fill={tint(role.main, 0.85)} stroke={colors.text} strokeWidth={2} />
      <rect x={25} y={-14} width={50} height={28} rx={3} fill={tint(role.main, 0.85)} stroke={colors.text} strokeWidth={2} />
      <line x1={-50} y1={-14} x2={-50} y2={14} stroke="#fff" strokeWidth={2} />
      <line x1={50} y1={-14} x2={50} y2={14} stroke="#fff" strokeWidth={2} />
      <rect x={-18} y={-20} width={36} height={40} rx={5} fill="#F2C94C" stroke={colors.text} strokeWidth={2.5} data-mark="vetinh" />
      <circle cx={0} cy={-26} r={6} fill={colors.text} />
    </g>
  );

/** Trái Đất đơn giản: hình tròn xanh + vài mảng lục địa. */
const Earth: React.FC<{ c: Pt; r: number; o?: number }> = ({ c, r, o = 1 }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      <circle cx={c[0]} cy={c[1]} r={r} fill="#5B9BF0" />
      <path
        d={`M ${c[0] - r * 0.55} ${c[1] - r * 0.5} q ${r * 0.3} ${-r * 0.25} ${r * 0.55} ${r * 0.05} q ${r * 0.1} ${r * 0.3} ${-r * 0.2} ${r * 0.45} q ${-r * 0.35} ${r * 0.05} ${-r * 0.35} ${-r * 0.5} z`}
        fill="#4FBF7A"
      />
      <path
        d={`M ${c[0] + r * 0.15} ${c[1] + r * 0.05} q ${r * 0.4} ${-r * 0.2} ${r * 0.55} ${r * 0.15} q ${-r * 0.05} ${r * 0.4} ${-r * 0.35} ${r * 0.45} q ${-r * 0.3} ${-r * 0.2} ${-r * 0.2} ${-r * 0.6} z`}
        fill="#4FBF7A"
      />
      <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke={tint("#1E4FB5", 0.5)} strokeWidth={3} />
    </g>
  );

/** Dấu góc vuông tại o giữa hai hướng đơn vị u, v (px). */
const RightMark: React.FC<{ o: Pt; u: Pt; v: Pt; s?: number; color: string; op: number }> = ({ o, u, v, s = 28, color, op }) =>
  op <= 0 ? null : (
    <path
      d={`M ${o[0] + u[0] * s} ${o[1] + u[1] * s} L ${o[0] + (u[0] + v[0]) * s} ${o[1] + (u[1] + v[1]) * s} L ${o[0] + v[0] * s} ${o[1] + v[1] * s}`}
      fill="none"
      stroke={color}
      strokeWidth={3.5}
      opacity={op}
    />
  );

// ===================== CẢNH 1 — Trái Đất và quỹ đạo =====================

const E1: Pt = [640, 590];
const R_EARTH = 160;
const R_ORBIT = 320;
/** vị trí trên quỹ đạo, th (độ): 0 = đỉnh, tăng theo chiều kim đồng hồ */
const orbitAt = (th: number): Pt => [E1[0] + R_ORBIT * Math.sin((th * Math.PI) / 180), E1[1] - R_ORBIT * Math.cos((th * Math.PI) / 180)];
const tangentAt = (th: number): Pt => [Math.cos((th * Math.PI) / 180), Math.sin((th * Math.PI) / 180)];
const inwardAt = (th: number): Pt => [-Math.sin((th * Math.PI) / 180), Math.cos((th * Math.PI) / 180)];
const F_LEN1 = 175;
const S_LEN1 = 240;

export type St1 = {
  left: number; // 0: cụm Trái Đất giữa khung (b01), 1: dồn sang trái nhường chỗ công thức
  th: number; // góc vị trí vệ tinh
  sat: number;
  satGlow: number;
  nameLab: number;
  speedLab: number;
  speedHi: number;
  fArrow: number;
  fLab: number;
  note: number; // "không theo tỉ lệ"
  cong: number; // công thức công (b02)
  cond1: number;
  cond0: number;
  prop: number; // tính chất vuông góc ⇔ tích = 0 (b12)
  more: number; // trọng lực ở ba điểm khác (b12)
  tan: number; // mũi tên độ dời tiếp tuyến (b12)
  right: number;
  rightLab: number;
  zeroLab: number;
};
export const ZERO1: St1 = {
  left: 0,
  th: -50,
  sat: 0,
  satGlow: 0,
  nameLab: 0,
  speedLab: 0,
  speedHi: 0,
  fArrow: 0,
  fLab: 0,
  note: 0,
  cong: 0,
  cond1: 0,
  cond0: 0,
  prop: 0,
  more: 0,
  tan: 0,
  right: 0,
  rightLab: 0,
  zeroLab: 0,
};

const ORBIT_BOX: Rect = { x: E1[0] - R_ORBIT - 90, y: E1[1] - R_ORBIT - 90, w: 2 * R_ORBIT + 180, h: 2 * R_ORBIT + 180 };
const MORE_TH = [90, 180, 270];
/** b01: cụm Trái Đất dời sang phải chừng này để nằm giữa khung (chưa có công thức bên phải) */
const CENTER_DX = 320;

export const Scene1: React.FC<{ st: St1 }> = ({ st }) => {
  const S = orbitAt(st.th);
  const inw = inwardAt(st.th);
  const tg = tangentAt(st.th);
  const fEnd: Pt = [S[0] + inw[0] * F_LEN1, S[1] + inw[1] * F_LEN1];
  const sEnd: Pt = [S[0] + tg[0] * S_LEN1, S[1] + tg[1] * S_LEN1];
  const obst: Rect[] = [
    textObstacle(E1[0] - R_EARTH, E1[1] - R_EARTH, 2 * R_EARTH, 2 * R_EARTH),
    textObstacle(S[0] - 50, S[1] - 50, 100, 100),
    ...segmentObstacles(S[0], S[1], fEnd[0], fEnd[1]),
    ...(st.tan > 0 ? segmentObstacles(S[0], S[1], sEnd[0], sEnd[1]) : []),
    textObstacle(90, 960, 400, 50),
  ];
  if (st.cong > 0) obst.push(textObstacle(1150, 250, 680, 300));
  if (st.prop > 0) obst.push(textObstacle(1250, 265, 480, 70));
  // trọng lực ở ba điểm khác, độ dời tiếp tuyến (b12) cũng là vật cản
  if (st.more > 0)
    MORE_TH.forEach((t) => {
      const p = orbitAt(t);
      const iw = inwardAt(t);
      obst.push(...segmentObstacles(p[0], p[1], p[0] + iw[0] * F_LEN1 * 0.8, p[1] + iw[1] * F_LEN1 * 0.8));
    });
  // quỹ đạo nét đứt không tính là vật cản: nhãn có halo, nằm đè nét đứt vẫn đọc được
  const labels: AutoLabelItem[] = [
    lab("name", S, "Vinasat-1 (2008)", st.nameLab, colors.text, { prefer: ["w", "nw", "sw"], phases: ["b01", "b02"] }),
    lab("speed", S, "$\\approx 3{,}1$ km/s", st.speedLab, st.speedHi > 0 ? role.focus : colors.text, { prefer: ["e", "ne", "se"], weight: 700, anchor: "region" }),
    lab("F", [S[0] + inw[0] * F_LEN1 * 0.72, S[1] + inw[1] * F_LEN1 * 0.72], "trọng lực", st.fLab, F_COL, { prefer: ["w", "e", "nw"] }),
    // một vật một nhãn: dấu góc vuông "90°" → "F·s = 0"
    lab("right", [S[0] + inw[0] * 32 + tg[0] * 90, S[1] + inw[1] * 32 + tg[1] * 90], "", st.rightLab, role.focus, {
      steps: ["$90^\\circ$", "$\\vec F \\cdot \\vec s = 0$"],
      step: st.zeroLab,
      prefer: ["se", "s", "e"],
      phases: ["b12"],
      anchor: "region",
    }),
  ];
  void ORBIT_BOX;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, translate: `${CENTER_DX * (1 - st.left)}px 0` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle cx={E1[0]} cy={E1[1]} r={R_ORBIT} fill="none" stroke={colors.axis} strokeWidth={3} strokeDasharray="10 12" />
        <Earth c={E1} r={R_EARTH} />
        {/* trọng lực ở ba điểm khác (b12) */}
        {MORE_TH.map((t) => {
          const p = orbitAt(t);
          const iw = inwardAt(t);
          return <ArrowPx key={t} a={p} b={[p[0] + iw[0] * F_LEN1 * 0.8, p[1] + iw[1] * F_LEN1 * 0.8]} color={F_COL} o={st.more * 0.5} w={5} />;
        })}
        <ArrowPx a={S} b={fEnd} color={F_COL} o={st.fArrow} />
        <ArrowPx a={S} b={sEnd} color={S_COL} o={st.tan} />
        <RightMark o={S} u={inw} v={tg} s={40} color={role.focus} op={st.right} />
        <Satellite x={S[0]} y={S[1]} o={st.sat} rot={st.th} glow={st.satGlow} />
      </svg>
      <Tag x={110 - CENTER_DX * (1 - st.left)} y={970} anchor="left" color={colors.muted} opacity={st.note} name="note">
        không theo tỉ lệ
      </Tag>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <AutoLabels items={labels} obstacles={obst} bounds={{ x: 100 - CENTER_DX * (1 - st.left), y: 120, w: 1720, h: 820 }} />
      </div>
      </div>
      {/* công thức công (b02) */}
      <Fixed x={1490} y={300} text="$A = F\,s\cos\alpha$" o={st.cong} size={64} name="cong" />
      <Fixed x={1490} y={420} text="$A > 0$: nhanh lên · $A < 0$: chậm đi" o={st.cond1} name="cond1" />
      <Fixed x={1490} y={510} text="$A = 0$: tốc độ giữ nguyên" o={st.cond0} name="cond0" />
      {/* tính chất (b12) */}
      <Fixed x={1490} y={300} text="$\vec a \perp \vec b \Leftrightarrow \vec a \cdot \vec b = 0$" o={st.prop} size={48} name="prop" color={colors.muted} />
    </div>
  );
};

// ===================== CẢNH 2 — kính lúp quanh vệ tinh =====================

// hình nhỏ bên trái: Trái Đất + quỹ đạo thu nhỏ, vệ tinh ở đỉnh quỹ đạo (trọng lực chĩa thẳng xuống)
const E2: Pt = [340, 690];
const R_EARTH2 = 115;
const R_ORBIT2 = 260;
const SAT2: Pt = [E2[0], E2[1] - R_ORBIT2];
const BOX2 = 46; // nửa cạnh khung soi
// ô phóng
const PANEL = { x: 760, y: 120, w: 1070, h: 500 };
const S0: Pt = [1180, 318]; // vệ tinh trong ô phóng
const KU = 94; // px mỗi đơn vị mô hình
const F_LEN = 3;
const S_LEN = 2;
/** hướng độ dời (đơn vị, px) khi góc giữa lực (chĩa xuống) và độ dời là phi độ; phi = 90 → sang phải */
const sDir = (phi: number): Pt => [Math.sin((phi * Math.PI) / 180), Math.cos((phi * Math.PI) / 180)];
const sEndAt = (phi: number): Pt => [S0[0] + sDir(phi)[0] * S_LEN * KU, S0[1] + sDir(phi)[1] * S_LEN * KU];
/** chân đường vuông góc từ đầu độ dời xuống giá lực (trục dọc qua S0) */
const footAt = (phi: number): Pt => [S0[0], sEndAt(phi)[1]];
const F_END: Pt = [S0[0], S0[1] + F_LEN * KU];
const SH_OFF = 18;

// dải công thức dưới ô phóng
const ROW0 = 682;
const ROW1 = 772;
const ROW2 = 862;

export type St2 = {
  mini: number;
  zoom: number; // khung soi + ô phóng
  cong: number; // công thức công thu nhỏ (đầu cảnh 2)
  f: number;
  fLab: number;
  fStep: number; // 0 "$\vec F$", 1 "$|\vec F| = 3$"
  s: number;
  sLab: number;
  sStep: number;
  phi: number; // góc giữa lực và độ dời (độ)
  arc: number;
  angLab: number;
  angStep: number; // 0 "(F,s)", 1 "60°", 2 "120°"
  copy0: number; // bản sao quay chồng lên lực (0°)
  copy180: number; // bản sao ngược lực (180°)
  copyRot: number; // 0..1: bản sao quay từ hướng độ dời tới đích
  lab0: number;
  lab180: number;
  model: number;
  ticksF: number;
  ticksS: number;
  def: number; // công thức định nghĩa
  hiF: number;
  hiS: number;
  hiCos: number;
  cosNote: number;
  cosStep: number; // 0 cos60, 1 cos120
  calc: number;
  gia: number;
  perp: number;
  tri: number;
  shadow: number; // cạnh kề (bóng) sáng
  shLab: number;
  shStep: number; // 0 "2cos60 = 1", 1 "bóng của s", 2 "bóng = −1", 3 "bóng = 0"
  dot: number; // chấm trượt dọc bóng (0..1)
  r1: number; // F·s = 3·1 = 3
  r2: number; // −3
  r3: number; // 0
  ghostF: number; // bóng mờ phía trước (60°) nháy
  ghostB: number; // bóng mờ phía sau (120°) nháy
  right: number; // dấu góc vuông
  insetDim: number;
  propL: number;
  propR: number;
};
export type S2 = Partial<St2>;

const OBST2 = (phi: number, st: St2): Rect[] => {
  const r: Rect[] = [];
  const seg = (a: Pt, b: Pt) => r.push(...segmentObstacles(a[0], a[1], b[0], b[1]));
  seg(S0, F_END);
  seg(S0, sEndAt(phi));
  if (st.copy180 > 0) seg(S0, [S0[0], S0[1] - S_LEN * KU]);
  if (st.gia > 0) seg([S0[0], PANEL.y + 10], [S0[0], PANEL.y + PANEL.h - 10]);
  if (st.perp > 0) seg(sEndAt(phi), footAt(phi));
  r.push(textObstacle(S0[0] - 62, S0[1] - 26, 124, 52));
  r.push(textObstacle(PANEL.x + 10, PANEL.y + 10, 200, 60)); // "mô hình"
  return r;
};

export const Scene2: React.FC<{ st: S2 }> = ({ st: raw }) => {
  const st = new Proxy(raw, { get: (o, k) => (o as Record<string | symbol, number | undefined>)[k] ?? 0 }) as St2;
  const phi = st.phi || 90;
  const sEnd = sEndAt(phi);
  const foot = footAt(phi);
  const shCol = phi > 90.5 ? role.down : role.up;
  const insetO = st.zoom * (1 - 0.5 * st.insetDim);
  const aF = angleOf(S0, F_END);
  const aS = angleOf(S0, sEnd);
  // bản sao: quay từ hướng độ dời hiện tại tới hướng lực (0°) hoặc ngược lực (180°)
  const copyTarget = st.copy180 > 0 ? 180 : 0;
  const copyPhi = lerp(phi, copyTarget, st.copyRot);
  const copyEnd = sEndAt(copyPhi);
  const copyO = Math.max(st.copy0, st.copy180);

  const labels: AutoLabelItem[] = [
    lab("F", [S0[0], S0[1] + F_LEN * KU * 0.6], "", st.fLab, F_COL, { steps: ["$\\vec F$", "$|\\vec F| = 3$"], step: st.fStep, prefer: ["w", "sw"] }),
    lab("s", [(S0[0] + sEnd[0]) / 2, (S0[1] + sEnd[1]) / 2], "", st.sLab, S_COL, { steps: ["$\\vec s$", "$|\\vec s| = 2$"], step: st.sStep, prefer: ["ne", "e", "n"] }),
    lab(
      "ang",
      [S0[0] + 78 * Math.cos(((aF + aS) / 2) * (Math.PI / 180)), S0[1] + 78 * Math.sin(((aF + aS) / 2) * (Math.PI / 180))],
      "",
      st.angLab,
      role.focus,
      { steps: ["$(\\vec F, \\vec s)$", "$60^\\circ$", "$120^\\circ$"], step: st.angStep, prefer: ["s", "se", "e"], anchor: "region" },
    ),
    lab("c0", [S0[0], S0[1] + S_LEN * KU * 0.6], "$0^\\circ$", st.lab0, role.focus, { prefer: ["e"], phases: ["b03"] }),
    lab("c180", [S0[0], S0[1] - S_LEN * KU * 0.6], "$180^\\circ$", st.lab180, role.focus, { prefer: ["e", "w"], phases: ["b03"] }),
    lab("sh", Math.abs(phi - 90) > 1 ? foot : [S0[0] - 75, S0[1]], "", st.shLab, st.shStep >= 1.5 ? (st.shStep >= 2.5 ? role.focus : role.down) : role.up, {
      steps: ["$2 \\cdot \\cos 60^\\circ = 1$", "bóng của $\\vec s$", "bóng $= -1$", "bóng $= 0$"],
      step: st.shStep,
      prefer: ["w", "nw", "sw"],
      phases: ["b06", "b07", "b08"],
    }),
  ];

  const P1: Pt = [PANEL.x, PANEL.y];
  const P2: Pt = [PANEL.x, PANEL.y + PANEL.h];
  const hiOn = st.hiF + st.hiS + st.hiCos > 0;
  const part = (on: number, color: string, t: string) => (on > 0.5 ? col(color, t) : hiOn ? col(colors.muted, t) : t);
  const defTex = `$\\vec F \\cdot \\vec s = ${part(st.hiF, F_COL, "|\\vec F|")}\\,${part(st.hiS, S_COL, "|\\vec s|")}${part(st.hiCos, role.focus, "\\cos(\\vec F, \\vec s)")}$`;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* hình nhỏ bên trái */}
        <g opacity={st.mini}>
          <circle cx={E2[0]} cy={E2[1]} r={R_ORBIT2} fill="none" stroke={colors.axis} strokeWidth={3} strokeDasharray="8 10" />
          <Earth c={E2} r={R_EARTH2} />
          <Satellite x={SAT2[0]} y={SAT2[1]} k={0.45} />
        </g>
        {/* khung soi + đường dẫn + ô phóng */}
        <g opacity={st.zoom}>
          <rect x={SAT2[0] - BOX2} y={SAT2[1] - BOX2} width={2 * BOX2} height={2 * BOX2} fill="none" stroke={role.focus} strokeWidth={3} />
          <Seg a={[SAT2[0] + BOX2, SAT2[1] - BOX2]} b={P1} color={role.focus} w={2} o={0.6} />
          <Seg a={[SAT2[0] + BOX2, SAT2[1] + BOX2]} b={P2} color={role.focus} w={2} o={0.6} />
          <rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx={18} fill={colors.panel} stroke={role.focus} strokeWidth={3} />
          {/* lưới: mỗi ô = 1 đơn vị mô hình */}
          {Array.from({ length: 14 }, (_, i) => S0[0] + (i - 5) * KU)
            .filter((x) => x > PANEL.x + 5 && x < PANEL.x + PANEL.w - 5)
            .map((x) => (
              <line key={`gx${x}`} x1={x} y1={PANEL.y + 4} x2={x} y2={PANEL.y + PANEL.h - 4} stroke={colors.grid} strokeWidth={2} />
            ))}
          {Array.from({ length: 8 }, (_, i) => S0[1] + (i - 2) * KU)
            .filter((y) => y > PANEL.y + 5 && y < PANEL.y + PANEL.h - 5)
            .map((y) => (
              <line key={`gy${y}`} x1={PANEL.x + 4} y1={y} x2={PANEL.x + PANEL.w - 4} y2={y} stroke={colors.grid} strokeWidth={2} />
            ))}
        </g>
        <g opacity={insetO}>
          {/* giá của lực */}
          <Seg a={[S0[0], PANEL.y + 14]} b={[S0[0], PANEL.y + PANEL.h - 14]} color={F_COL} w={3} o={st.gia * 0.45} />
          {/* tam giác vuông */}
          {st.tri > 0 ? <polygon points={`${S0[0]},${S0[1]} ${sEnd[0]},${sEnd[1]} ${foot[0]},${foot[1]}`} fill={tint(S_COL, 0.22 * st.tri)} /> : null}
          <Seg a={sEnd} b={foot} color={colors.muted} w={3} o={st.perp} dash />
          <RightMark
            o={foot}
            u={[0, foot[1] > S0[1] ? -1 : 1]}
            v={[1, 0]}
            s={20}
            color={colors.muted}
            op={st.perp * (Math.abs(phi - 90) > 3 ? 1 : 0)}
          />
          {/* bóng mờ nháy (câu hỏi đoán) */}
          <Seg a={[S0[0] - SH_OFF, S0[1]]} b={[S0[0] - SH_OFF, footAt(60)[1]]} color={role.up} w={14} o={st.ghostF * 0.6} />
          <Seg a={[S0[0] - SH_OFF, S0[1]]} b={[S0[0] - SH_OFF, footAt(120)[1]]} color={role.down} w={14} o={st.ghostB * 0.6} />
          {/* lực */}
          <ArrowPx a={S0} b={F_END} color={F_COL} o={st.f} />
          {st.ticksF > 0
            ? [1, 2].map((i) => <line key={`tf${i}`} x1={S0[0] - 12} y1={S0[1] + i * KU} x2={S0[0] + 12} y2={S0[1] + i * KU} stroke={F_COL} strokeWidth={4} opacity={st.ticksF} />)
            : null}
          {/* bóng */}
          {/* bóng vẽ lệch sang trái giá lực một chút để không lẫn vào mũi tên lực */}
          <Seg a={[S0[0] - SH_OFF, S0[1]]} b={[foot[0] - SH_OFF, foot[1]]} color={shCol} w={14} o={st.shadow * (Math.abs(phi - 90) > 1 ? 1 : 0)} />
          {st.shadow > 0 && Math.abs(phi - 90) <= 1 ? <circle cx={S0[0]} cy={S0[1]} r={11} fill={role.focus} opacity={st.shadow} /> : null}
          {st.dot > 0 && st.dot < 1 ? <circle cx={S0[0]} cy={lerp(S0[1], foot[1], st.dot)} r={10} fill={colors.text} /> : null}
          {/* cung góc */}
          {st.arc > 0 ? <path d={arcPath(S0, 60, aF, aS)} fill="none" stroke={role.focus} strokeWidth={4} opacity={st.arc * (Math.abs(phi - 90) > 1 || st.right <= 0 ? 1 : 0)} /> : null}
          <RightMark o={S0} u={[0, 1]} v={[1, 0]} s={34} color={role.focus} op={st.right} />
          {/* độ dời */}
          <ArrowPx a={S0} b={sEnd} color={S_COL} o={st.s} />
          {st.ticksS > 0 ? (
            <circle cx={(S0[0] + sEnd[0]) / 2} cy={(S0[1] + sEnd[1]) / 2} r={6} fill="#fff" stroke={S_COL} strokeWidth={4} opacity={st.ticksS} />
          ) : null}
          {/* bản sao quay (0°, 180°) */}
          <ArrowPx a={S0} b={copyEnd} color={S_COL} o={copyO * 0.45} w={9} />
          <Satellite x={S0[0]} y={S0[1]} k={0.8} />
        </g>
      </svg>
      <Badge x={PANEL.x + 24} y={PANEL.y + 18} anchor="left" text="mô hình" opacity={st.model * insetO} />
      {/* dải công thức dưới ô phóng */}
      <Fixed x={1295} y={ROW0} text="$A = F\,s\cos\alpha$" o={st.cong} size={48} name="cong2" color={colors.muted} />
      <Fixed x={1250} y={ROW0} text={defTex} o={st.def} size={50} name="def" />
      <Fixed x={1000} y={ROW1} text={st.cosStep < 0.5 ? "$\\cos 60^\\circ = 0{,}5$" : "$\\cos 120^\\circ = -0{,}5$"} o={st.cosNote} color={role.focus} name="cosNote" />
      <Fixed x={1530} y={ROW1} text="$= 3 \cdot 2 \cdot 0{,}5 = 3$" o={st.calc} name="calc" />
      <Fixed x={960} y={ROW2} text="$\vec F \cdot \vec s = 3 \cdot 1 = 3$" o={st.r1} color={role.up} name="r1" />
      <Fixed x={1380} y={ROW2} text="$\vec F \cdot \vec s = -3$" o={st.r2} color={role.down} name="r2" />
      <Fixed x={1690} y={ROW2} text="$\vec F \cdot \vec s = 0$" o={st.r3} color={role.focus} name="r3" />
      <Fixed x={1130} y={ROW1} text="$\vec a \perp \vec b$" o={st.propL} size={44} color={role.focus} name="propL" />
      <Fixed x={1250} y={ROW1} anchor="left" text="$\Leftrightarrow \vec a \cdot \vec b = 0$" o={st.propR} size={44} color={role.focus} name="propR" />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: insetO }}>
        <AutoLabels items={labels} obstacles={OBST2(phi, st)} bounds={{ x: PANEL.x + 12, y: PANEL.y + 12, w: PANEL.w - 24, h: PANEL.h - 24 }} />
      </div>
    </div>
  );
};

// ===================== CẢNH 3 — hình lập phương =====================

const A3 = 4;
const P3 = makeProj(560, 830, 110);
const VX = {
  A: [0, 0, 0] as V3,
  B: [A3, 0, 0] as V3,
  C: [A3, A3, 0] as V3,
  D: [0, A3, 0] as V3,
  A1: [0, 0, A3] as V3,
  B1: [A3, 0, A3] as V3,
  C1: [A3, A3, A3] as V3,
  D1: [0, A3, A3] as V3,
};
type VName = keyof typeof VX;
const EDGES: [VName, VName][] = [
  ["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"],
  ["A1", "B1"], ["B1", "C1"], ["C1", "D1"], ["D1", "A1"],
  ["A", "A1"], ["B", "B1"], ["C", "C1"], ["D", "D1"],
];
const hidden = (e: [VName, VName]) => e[0] === "D" || e[1] === "D";
const NAME_OFF: Record<VName, Pt> = {
  A: [-40, 26],
  B: [10, 44],
  C: [40, 22],
  D: [-36, -24],
  A1: [-40, -10],
  B1: [-10, -40],
  C1: [40, -24],
  D1: [-36, -30],
};
const NAME_TXT: Record<VName, string> = { A: "A", B: "B", C: "C", D: "D", A1: "A'", B1: "B'", C1: "C'", D1: "D'" };
const Q_X = 1545;

export type St3 = {
  cube: number;
  aLab: number;
  aStep: number; // 0 "a", 1 "bóng = a"
  ab: number;
  a1c1: number;
  q1: number;
  q1Step: number; // 0 "?", 1 a²
  q1Dim: number;
  copyAC: number; // bản sao A'C' trượt xuống (0..1)
  copyACo: number;
  acLab: number;
  arc45: number;
  lab45: number;
  calc: number;
  calcStep: number; // 0 cos45°, 1 √2/2 = a²
  cb: number; // cạnh CB sáng
  abShadow: number;
  // bẫy
  c1d1: number;
  q2: number;
  q2Step: number;
  giaPar: number;
  lab0: number;
  copyCD: number; // bản sao C'D' trượt về A (0..1)
  copyCDo: number;
  arc180: number;
  lab180: number;
  revShadow: number;
  prop: number; // tính chất thu nhỏ góc trên phải
};
export type S3 = Partial<St3>;

const OBST3: Rect[] = (() => {
  const r: Rect[] = [];
  const seg = (a: V3, b: V3) => {
    const [x1, y1] = P3(a);
    const [x2, y2] = P3(b);
    r.push(...segmentObstacles(x1, y1, x2, y2));
  };
  EDGES.forEach((e) => seg(VX[e[0]], VX[e[1]]));
  seg(VX.A, VX.C);
  seg(VX.A1, VX.C1);
  seg(VX.A, [-A3, 0, 0]);
  seg([-A3 * 0.8, 0, 0], [A3 * 1.3, 0, 0]);
  seg(add3(VX.D1, [-A3 * 1.2, 0, 0]), add3(VX.D1, [A3 * 1.08, 0, 0]));
  (Object.keys(VX) as VName[]).forEach((n) => {
    const [x, y] = P3(VX[n]);
    r.push(textObstacle(x + NAME_OFF[n][0] - 22, y + NAME_OFF[n][1] - 22, 44, 44));
  });
  r.push(textObstacle(Q_X - 300, 210, 600, 370)); // đề bài, phép thay số
  r.push(textObstacle(1400, 120, 430, 60)); // tính chất góc trên phải
  return r;
})();

export const Scene3: React.FC<{ st: S3 }> = ({ st: raw }) => {
  const st = new Proxy(raw, { get: (o, k) => (o as Record<string | symbol, number | undefined>)[k] ?? 0 }) as St3;
  const p = (n: VName) => P3(VX[n]);
  const A = p("A");
  const down: V3 = [0, 0, -A3];
  const cA = P3(add3(VX.A1, down, st.copyAC));
  const cC = P3(add3(VX.C1, down, st.copyAC));
  // bản sao C'D' trượt về A: dời theo vectơ C' → A
  const shiftCD: V3 = [VX.A[0] - VX.C1[0], VX.A[1] - VX.C1[1], VX.A[2] - VX.C1[2]];
  const cdA = P3(add3(VX.C1, shiftCD, st.copyCD));
  const cdB = P3(add3(VX.D1, shiftCD, st.copyCD));
  const aAB = angleOf(A, p("B"));
  const aAC = angleOf(A, p("C"));

  const labels: AutoLabelItem[] = [
    lab("ab", P3(mid3(VX.A, VX.B)), "", st.aLab, st.aStep > 0.5 ? role.up : colors.text, { steps: ["$a$", "bóng $= a$"], step: st.aStep, prefer: ["s"] }),
    lab("ac", P3(mid3(VX.A, VX.C)), "$\\vec{A'C'} = \\vec{AC}$", st.acLab, S_COL, { prefer: ["n", "ne"] }),
    lab("45", P3([1.15, 0.55, 0]), "$45^\\circ$", st.lab45, role.focus, { prefer: ["e", "ne"], anchor: "region" }),
    lab("par", P3([-A3 * 0.5, A3 / 2, A3 / 2]), "góc hai đường thẳng: $0^\\circ$", st.lab0, colors.text, { anchor: "region", prefer: ["w", "nw", "sw"] }),
    lab("180", [A[0] - 40, A[1] - 10], "góc hai vectơ: $180^\\circ$", st.lab180, role.focus, { prefer: ["nw", "n", "w"] }),
  ];

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* giá song song AB, C'D' (bẫy) */}
        <Seg a={P3([-A3 * 0.8, 0, 0])} b={P3([A3 * 1.3, 0, 0])} color={F_COL} w={3.5} o={st.giaPar * 0.8} />
        <Seg a={P3(add3(VX.D1, [-A3 * 1.2, 0, 0]))} b={P3(add3(VX.D1, [A3 * 1.08, 0, 0]))} color={S_COL} w={3.5} o={st.giaPar * 0.8} />
        {EDGES.map((e) => (
          <Seg key={e.join()} a={p(e[0])} b={p(e[1])} color={role.main} w={4} o={st.cube * (hidden(e) ? 0.8 : 1)} dash={hidden(e)} />
        ))}
        {/* cạnh CB (vuông góc AB tại B) */}
        <Seg a={p("C")} b={p("B")} color={colors.muted} w={6} o={st.cb} dash />
        {/* bóng trên AB */}
        <Seg a={A} b={p("B")} color={role.up} w={14} o={st.abShadow * 0.75} />
        {/* bóng ngược hướng (bẫy) */}
        <Seg a={A} b={P3([-A3, 0, 0])} color={role.down} w={14} o={st.revShadow * 0.75} />
        {/* cung góc */}
        {st.arc45 > 0 ? <path d={arcPath(A, 70, aAB, aAC)} fill="none" stroke={role.focus} strokeWidth={4} opacity={st.arc45} /> : null}
        {st.arc180 > 0 ? <path d={arcPath(A, 60, 0, -180)} fill="none" stroke={role.focus} strokeWidth={4} opacity={st.arc180} /> : null}
        {/* vectơ */}
        <ArrowPx a={A} b={p("B")} color={F_COL} o={st.ab} w={7} />
        <ArrowPx a={p("A1")} b={p("C1")} color={S_COL} o={st.a1c1} w={7} />
        <ArrowPx a={cA} b={cC} color={S_COL} o={st.copyACo * 0.75} w={7} dash />
        <ArrowPx a={p("C1")} b={p("D1")} color={S_COL} o={st.c1d1} w={7} />
        <ArrowPx a={cdA} b={cdB} color={S_COL} o={st.copyCDo * 0.8} w={7} dash />
      </svg>
      {(Object.keys(VX) as VName[]).map((n) => {
        const [x, y] = p(n);
        return (
          <Tag key={n} x={x + NAME_OFF[n][0]} y={y + NAME_OFF[n][1] - 24} color={colors.text} weight={700} opacity={st.cube} name="dinh">
            {NAME_TXT[n]}
          </Tag>
        );
      })}
      <Fixed x={1640} y={150} text="$\vec a \perp \vec b \Leftrightarrow \vec a \cdot \vec b = 0$" o={st.prop} size={38} color={colors.muted} name="prop3" />
      {/* đề bài 1: ? → a² tại chỗ */}
      <div style={{ opacity: 1 - 0.55 * st.q1Dim }}>
        <Fixed x={Q_X} y={260} text="$\vec{AB} \cdot \vec{A'C'} = \,?$" o={st.q1 * (1 - st.q1Step)} size={52} name="q1" />
        <Fixed x={Q_X} y={260} text="$\vec{AB} \cdot \vec{A'C'} = a^2$" o={st.q1 * st.q1Step} size={52} color={role.focus} name="q1b" />
      </div>
      <Fixed x={Q_X} y={392} text="$a \cdot a\sqrt{2} \cdot \cos 45^\circ$" o={st.calc * (1 - st.calcStep)} size={44} name="calc3" />
      <Fixed x={Q_X} y={392} text="$a \cdot a\sqrt{2} \cdot \frac{\sqrt{2}}{2} = a^2$" o={st.calc * st.calcStep} size={44} name="calc3b" />
      {/* đề bài 2 (bẫy) */}
      <Fixed x={Q_X} y={520} text="$\vec{AB} \cdot \vec{C'D'} = \,?$" o={st.q2 * (1 - st.q2Step)} size={52} name="q2" />
      <Fixed x={Q_X} y={520} text="$\vec{AB} \cdot \vec{C'D'} = -a^2$" o={st.q2 * st.q2Step} size={52} color={role.down} name="q2b" />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <AutoLabels items={labels} obstacles={OBST3} bounds={{ x: 100, y: 120, w: 1720, h: 800 }} />
      </div>
    </div>
  );
};
