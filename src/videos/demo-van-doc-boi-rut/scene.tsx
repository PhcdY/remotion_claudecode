import React from "react";
import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { ramp } from "../../components/BeatShell";

// Tranh phẳng cho demo "đọc, bôi, rút": đường làng buổi sớm mùa thu. Người không vẽ mặt (gói Văn › mục 1).

export const W = 1920;
export const H = 1080;

const C = {
  skyTop: "#D5E2E6",
  skyLow: "#EEF2EC",
  far: "#BCCBD2",
  mid: "#AFC09E",
  near: "#94AA7F",
  grass: "#7F9870",
  road: "#E0CCA3",
  roadEdge: "#BFA577",
  roadDark: "#CDB78C",
  trunk: "#6F5B45",
  leafA: "#7E9468",
  leafB: "#90A674",
  leafC: "#C9A24E",
  wall: "#F0DDB0",
  roof: "#8F5A4A",
  roofLine: "#6E4236",
  door: "#5F7180",
  skin: "#E8B48C",
  hair: "#2A2420",
};

const loop = (x: number, size: number) => ((x % size) + size) % size;

export const Tree: React.FC<{ x: number; y: number; s?: number; tone?: number }> = ({ x, y, s = 1, tone = 0 }) => {
  const a = tone ? C.leafB : C.leafA;
  const b = tone ? C.leafA : C.leafB;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-13 0 L-8 -128 L8 -128 L14 0 Z" fill={C.trunk} />
      <path d="M-4 -96 L-42 -150 M2 -108 L34 -160" stroke={C.trunk} strokeWidth={7} strokeLinecap="round" />
      <circle cx={-48} cy={-168} r={62} fill={a} />
      <circle cx={46} cy={-178} r={66} fill={a} />
      <circle cx={0} cy={-226} r={74} fill={b} />
      <circle cx={-26} cy={-250} r={30} fill={a} opacity={0.42} />
      {[[-62, -190], [40, -214], [8, -162], [66, -150], [-20, -270]].map(([lx, ly]) => (
        <ellipse key={`${lx}${ly}`} cx={lx} cy={ly} rx={9} ry={5} fill={C.leafC} transform={`rotate(32 ${lx} ${ly})`} />
      ))}
    </g>
  );
};

export const House: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-104} y={-82} width={208} height={82} fill={C.wall} />
    <path d="M-132 -80 L-82 -150 L82 -150 L132 -80 Z" fill={C.roof} />
    {[-88, -58, -28, 2, 32, 62, 92].map((rx) => (
      <line key={rx} x1={rx} y1={-82} x2={rx * 0.78} y2={-148} stroke={C.roofLine} strokeWidth={3} />
    ))}
    <line x1={-112} y1={-108} x2={112} y2={-108} stroke={C.roofLine} strokeWidth={2.5} />
    <rect x={-18} y={-58} width={36} height={58} fill={C.door} />
    <rect x={-76} y={-58} width={34} height={28} fill={C.door} />
    <rect x={44} y={-58} width={34} height={28} fill={C.door} />
  </g>
);

/** Lá rơi. `freezeAt`: lá đứng lại giữa không trung; `windAt`: gió thổi lá bay ngang. */
export const Leaves: React.FC<{ n?: number; freezeAt?: number; windAt?: number; seed?: string }> = ({ n = 16, freezeAt, windAt, seed = "la" }) => {
  const frame = useCurrentFrame();
  const t = freezeAt === undefined ? frame : Math.min(frame, freezeAt);
  const wind = windAt === undefined || frame < windAt ? 0 : (frame - windAt) ** 1.55 * 0.32;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const sx = random(`${seed}x${i}`) * (W + 300);
        const sy = random(`${seed}y${i}`) * H;
        const v = 0.7 + random(`${seed}v${i}`) * 0.9;
        const size = 7 + random(`${seed}s${i}`) * 7;
        const y = loop(sy + t * v, H + 60) - 30;
        const x = loop(sx + Math.sin(t / 34 + i) * 34 - t * 0.5 + wind * (0.8 + v), W + 300) - 150;
        return (
          <ellipse key={i} cx={x} cy={y} rx={size} ry={size * 0.46} fill={i % 3 ? C.leafC : "#B97F3C"}
            opacity={0.9} transform={`rotate(${t * (i % 2 ? 2.2 : -1.8) + i * 40} ${x} ${y})`} />
        );
      })}
    </g>
  );
};

/** Sương trôi nền: giữ cảnh sống, không giành mắt. */
export const Drift: React.FC<{ boost?: number; y?: number }> = ({ boost = 0, y = 440 }) => {
  const frame = useCurrentFrame();
  return (
    <g fill="#FFFFFF">
      {[0, 1, 2, 3].map((i) => {
        const x = loop(i * 620 + frame * (0.55 + i * 0.13) + boost * 900, W + 1000) - 500;
        return <ellipse key={i} cx={x} cy={y + i * 52} rx={520 - i * 40} ry={46 + i * 8} opacity={0.3 + boost * 0.18} />;
      })}
    </g>
  );
};

/** Chuyển cảnh bằng sương: sương phủ cuối beat, tan ở đầu beat. */
export const MistWipe: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const cover = Math.max(1 - ramp(frame, 0, 20), ramp(frame, D - 16, D - 2));
  if (cover <= 0.005) return null;
  const slide = (1 - cover) * 460;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <rect width={W} height={H} fill="#F6F8FE" opacity={cover * 0.94} />
      {[160, 400, 650, 900].map((y, i) => (
        <ellipse key={y} cx={W / 2 + (i % 2 ? slide : -slide)} cy={y} rx={1250} ry={190} fill="#FFFFFF" opacity={cover * 0.8} />
      ))}
    </svg>
  );
};

// ---------- Nhân vật ----------

type Pt = [number, number];

const Leg: React.FC<{ hip: number; angle: number; color: string; width: number; foot: string }> = ({ hip, angle, color, width, foot }) => (
  <g transform={`rotate(${angle} 0 ${hip})`}>
    <line x1={0} y1={hip} x2={0} y2={-9} stroke={color} strokeWidth={width} strokeLinecap="round" />
    <ellipse cx={width * 0.52} cy={-5} rx={width * 0.98} ry={width * 0.4} fill={foot} />
  </g>
);

const Arm: React.FC<{ s: Pt; h: Pt; color: string; width: number; hand: number }> = ({ s, h, color, width, hand }) => {
  const cx = (s[0] + h[0]) / 2 - 6;
  const cy = (s[1] + h[1]) / 2 + 26;
  return (
    <g>
      <path d={`M ${s[0]} ${s[1]} Q ${cx} ${cy} ${h[0]} ${h[1]}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
      <circle cx={h[0]} cy={h[1]} r={hand} fill={C.skin} />
    </g>
  );
};

/** Người mẹ áo dài nâu, tóc vấn. Gốc toạ độ ở bàn chân. `hand`: toạ độ thế giới của bàn tay phía trước. */
export const Mother: React.FC<{ x: number; g: number; phase: number; amt: number; hand: Pt; s?: number }> = ({ x, g, phase, amt, hand, s = 1 }) => {
  const bob = -Math.abs(Math.sin(phase)) * 6 * amt;
  const swing = Math.sin(phase) * 25 * amt;
  const flutter = Math.sin(phase * 0.5 + 0.7) * 10 + 8 * amt;
  const local: Pt = [(hand[0] - x) / s, (hand[1] - g) / s - bob];
  return (
    <g transform={`translate(${x} ${g}) scale(${s})`}>
      <ellipse cx={8} cy={2} rx={92} ry={13} fill="#3B3A2C" opacity={0.2} />
      <Leg hip={-262} angle={-swing} color="#CFC6B2" width={25} foot="#4B3B2E" />
      <Leg hip={-262} angle={swing} color="#EEE7D8" width={25} foot="#5A4738" />
      <g transform={`translate(0 ${bob})`}>
        <Arm s={[-20, -420]} h={[-34 - swing * 0.8, -255]} color="#6F4438" width={21} hand={12} />
        <path d={`M -44 -305 Q -72 -226 ${-84 - flutter} -132 L -18 -142 Z`} fill="#744A3D" />
        <path d="M -42 -444 Q 2 -462 44 -444 L 54 -305 L 74 -148 Q 12 -128 -50 -146 L -46 -305 Z" fill="#8D5B4C" />
        <path d="M 10 -452 L 22 -304 L 48 -140" fill="none" stroke="#744A3D" strokeWidth={4} />
        <path d="M -30 -454 Q 2 -440 34 -454 L 28 -470 L -24 -470 Z" fill="#744A3D" />
        <rect x={-13} y={-486} width={28} height={36} fill={C.skin} />
        <circle cx={6} cy={-516} r={42} fill={C.skin} />
        <path d="M -38 -510 C -44 -566 44 -574 50 -526 C 28 -540 2 -540 -12 -504 C -24 -500 -32 -502 -38 -510 Z" fill={C.hair} />
        <ellipse cx={-38} cy={-524} rx={23} ry={20} fill={C.hair} />
        <path d="M -38 -543 Q 6 -572 48 -537" fill="none" stroke="#4E3B5E" strokeWidth={12} strokeLinecap="round" />
        <Arm s={[28, -420]} h={local} color="#8D5B4C" width={22} hand={13} />
      </g>
    </g>
  );
};

/** Đứa trẻ áo dài xanh đậm, đeo túi vải. */
export const Child: React.FC<{ x: number; g: number; phase: number; amt: number; hand: Pt; s?: number; lean?: number }> = ({ x, g, phase, amt, hand, s = 1, lean = 0 }) => {
  const bob = -Math.abs(Math.sin(phase + 0.5)) * 5 * amt;
  const swing = Math.sin(phase + 0.5) * 28 * amt;
  const local: Pt = [(hand[0] - x) / s, (hand[1] - g) / s - bob];
  return (
    <g transform={`translate(${x} ${g}) scale(${s}) rotate(${lean} 0 -150)`}>
      <ellipse cx={4} cy={2} rx={62} ry={10} fill="#3B3A2C" opacity={0.2} />
      <Leg hip={-150} angle={-swing} color="#2D3B4D" width={18} foot="#2A2420" />
      <Leg hip={-150} angle={swing} color="#3B4B60" width={18} foot="#2A2420" />
      <g transform={`translate(0 ${bob})`}>
        <path d="M -30 -252 Q -54 -238 -56 -196 L -52 -172 L -24 -176 Z" fill="#A9794A" />
        <rect x={-58} y={-226} width={32} height={58} rx={7} fill="#B98A57" stroke="#7E5833" strokeWidth={3} />
        <path d="M -28 -262 Q 2 -274 30 -262 L 38 -160 L 48 -92 Q 6 -82 -38 -92 L -30 -160 Z" fill="#35536F" />
        <path d="M 6 -268 L 14 -158 L 30 -90" fill="none" stroke="#2A435B" strokeWidth={3.4} />
        <rect x={-9} y={-290} width={20} height={26} fill={C.skin} />
        <circle cx={3} cy={-314} r={33} fill={C.skin} />
        <path d="M -30 -310 C -36 -360 38 -364 40 -322 C 22 -334 4 -332 -8 -306 C -18 -300 -26 -302 -30 -310 Z" fill={C.hair} />
        <Arm s={[-6, -244]} h={local} color="#35536F" width={16} hand={11} />
      </g>
    </g>
  );
};

/** Vị trí tay nắm giữa mẹ (x) và con (x + gap*s). */
export const holdPoint = (x: number, g: number, s = 1): Pt => [x + 108 * s, g - 252 * s];
export const motherRest = (x: number, g: number, s = 1): Pt => [x + 46 * s, g - 262 * s];
export const childRest = (cx: number, g: number, s = 1): Pt => [cx + 8 * s, g - 150 * s];
export const lerpPt = (a: Pt, b: Pt, p: number): Pt => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p];

// ---------- Ba khung cảnh ----------

const Sky: React.FC<{ id: string }> = ({ id }) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor={C.skyTop} />
        <stop offset="0.62" stopColor={C.skyLow} />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill={`url(#${id})`} />
    <circle cx={1560} cy={210} r={72} fill="#FBF6E4" opacity={0.42} />
  </>
);

/** Toàn cảnh nhìn từ trên xuống: đường cong về phía nhà. */
export const WideWorld: React.FC<{ children?: React.ReactNode; push?: number; boost?: number }> = ({ children, push = 0, boost = 0 }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <Sky id="sky-wide" />
    <g transform={`translate(${W / 2} ${H * 0.72}) scale(${1 + push * 0.05}) translate(${-W / 2} ${-H * 0.72})`}>
      <path d="M0 430 C 260 365, 520 372, 800 420 S 1320 470, 1560 410 S 1820 390, 1920 416 V1080 H0Z" fill={C.far} />
      <Drift boost={boost} y={420} />
      <path d="M0 540 C 340 470, 700 490, 1010 540 S 1620 590, 1920 520 V1080 H0Z" fill={C.mid} />
      <Tree x={1680} y={560} s={0.62} tone={1} />
      <Tree x={1776} y={574} s={0.52} />
      <House x={1436} y={578} s={0.86} />
      <Tree x={1250} y={572} s={0.56} />
      <path d="M0 700 C 420 630, 900 700, 1300 650 S 1760 640, 1920 660 V1080 H0Z" fill={C.near} />
      <path d="M660 1080 C 860 910, 1180 830, 1330 720 C 1400 668, 1440 628, 1442 578 L 1468 578 C 1478 640, 1450 700, 1400 754 C 1290 870, 1160 960, 1120 1080 Z" fill={C.road} />
      <path d="M660 1080 C 860 910, 1180 830, 1330 720 C 1400 668, 1440 628, 1442 578 M1468 578 C 1478 640, 1450 700, 1400 754 C 1290 870, 1160 960, 1120 1080" fill="none" stroke={C.roadEdge} strokeWidth={5} />
      <Tree x={250} y={850} s={1.05} />
      <Tree x={470} y={816} s={0.76} tone={1} />
      <Tree x={92} y={930} s={1.25} tone={1} />
      <Tree x={1730} y={930} s={1.15} />
      {children}
    </g>
    <Leaves n={13} seed="rong" windAt={boost > 0 ? 0 : undefined} />
  </svg>
);

/** Khung đi ngang: nền trôi theo nhiều lớp khi nhân vật bước. */
export const SideWorld: React.FC<{ scroll: number; grade?: number; children?: React.ReactNode; freezeLeaves?: number }> = ({ scroll, grade = 0, children, freezeLeaves }) => {
  const tile = (k: number) => -loop(scroll * k, W);
  const filter = grade > 0 ? `saturate(${1 - 0.58 * grade}) brightness(${1 - 0.04 * grade})` : undefined;
  const trees = [130, 620, 1040, 1560, 2030];
  const tufts = [60, 260, 520, 780, 1010, 1290, 1520, 1760];
  const pebbles = [40, 180, 370, 610, 730, 940, 1180, 1330, 1540, 1720, 1860];
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <g style={{ filter }}>
        <Sky id="sky-side" />
        {[0, W].map((o) => (
          <path key={o} transform={`translate(${tile(0.1) + o} 0)`} d="M0 440 C 240 380, 480 380, 720 430 S 1200 490, 1440 430 S 1800 410, 1920 440 V1080 H0Z" fill={C.far} />
        ))}
        <Drift y={430} />
        {[0, W].map((o) => (
          <g key={o} transform={`translate(${tile(0.24) + o} 0)`}>
            <path d="M0 560 C 300 500, 620 510, 960 560 S 1560 620, 1920 560 V1080 H0Z" fill={C.mid} />
            <House x={1420} y={596} s={0.72} />
          </g>
        ))}
        {trees.map((tx) => (
          <Tree key={tx} x={loop(tx - scroll * 0.56, 2400) - 240} y={760} s={tx % 3 ? 1.08 : 0.92} tone={tx % 2} />
        ))}
        <rect y={748} width={W} height={332} fill={C.near} />
        <rect y={790} width={W} height={160} fill={C.road} />
        <rect y={790} width={W} height={7} fill={C.roadEdge} />
        <rect y={944} width={W} height={7} fill={C.roadEdge} />
        {pebbles.map((px, i) => (
          <ellipse key={px} cx={loop(px - scroll, W + 40) - 20} cy={812 + (i * 37) % 118} rx={9 + (i % 3) * 3} ry={4} fill={C.roadDark} />
        ))}
        <rect y={951} width={W} height={129} fill={C.grass} />
        {tufts.map((tx) => {
          const gx = loop(tx - scroll * 1.25, W + 80) - 40;
          return <path key={tx} d={`M ${gx - 18} 1004 L ${gx - 8} 972 M ${gx} 1006 L ${gx} 964 M ${gx + 18} 1004 L ${gx + 9} 974`} stroke="#657F58" strokeWidth={5} strokeLinecap="round" />;
        })}
        <rect width={W} height={H} fill="#5B5AA6" opacity={0.17 * grade} />
      </g>
      {children}
      <Leaves n={12} seed="ngang" freezeAt={freezeLeaves} />
    </svg>
  );
};

/** Góc nhìn dọc đường. `dai`: đường vươn tới chân trời; `hep`: hai mép khép vào. */
export const RoadView: React.FC<{ dai: number; hep: number; freezeAt: number; edge: string }> = ({ dai, hep, freezeAt, edge }) => {
  const hz = 500;
  const vx = 960;
  const halfBottom = 470 - 190 * hep;
  const farY = 800 - (800 - hz - 6) * dai;
  const atY = (y: number) => halfBottom * ((y - hz) / (H - hz));
  const leftFar = vx - atY(farY);
  const rightFar = vx + atY(farY);
  const dashes = Array.from({ length: 8 }, (_, i) => {
    const q = (i + 0.2) / 8;
    const y = H - (H - farY) * (1 - (1 - q) ** 2.1);
    const y2 = y - 34 * ((y - hz) / (H - hz)) ** 1.1;
    return { y, y2, w: 9 * ((y - hz) / (H - hz)) + 1 };
  });
  const trees = [0.12, 0.3, 0.52, 0.72, 0.9];
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <Sky id="sky-road" />
      <path d={`M0 ${hz - 42} C 300 ${hz - 92}, 620 ${hz - 70}, 960 ${hz - 34} S 1620 ${hz - 88}, 1920 ${hz - 46} V${hz + 8} H0Z`} fill={C.far} />
      <Drift y={hz - 34} />
      <rect y={hz} width={W} height={H - hz} fill={C.mid} />
      <path d={`M0 ${hz + 120} C 460 ${hz + 76}, 1400 ${hz + 136}, 1920 ${hz + 88} V1080 H0Z`} fill={C.near} />
      {trees.map((q, i) => {
        const y = hz + (H - hz) * q ** 1.7 * 0.8 + 14;
        const seen = ramp(dai, 0.86 - q * 0.86, 1 - q * 0.8);
        const s = 0.16 + q * 1.05;
        const offset = atY(y) + 130 * s + 34;
        return (
          <g key={q} opacity={seen}>
            <Tree x={vx - offset} y={y} s={s} tone={i % 2} />
            <Tree x={vx + offset} y={y + 6} s={s * 0.94} tone={(i + 1) % 2} />
          </g>
        );
      })}
      <path d={`M ${vx - halfBottom} ${H} L ${leftFar} ${farY} L ${rightFar} ${farY} L ${vx + halfBottom} ${H} Z`} fill={C.road} />
      {dashes.map(({ y, y2, w }) => (
        <line key={y} x1={vx} y1={y} x2={vx} y2={Math.max(y2, farY)} stroke={C.roadDark} strokeWidth={w} strokeLinecap="round" />
      ))}
      <path d={`M ${vx - halfBottom} ${H} L ${leftFar} ${farY} M ${vx + halfBottom} ${H} L ${rightFar} ${farY}`} fill="none" stroke={hep > 0 ? edge : C.roadEdge} strokeWidth={4 + 5 * hep} strokeLinecap="round" />
      {hep > 0
        ? [0, 1].map((side) => {
            const dir = side ? -1 : 1;
            const y = 900;
            const edgeX = vx - dir * atY(y);
            const tip = edgeX - dir * 22;
            const tail = tip - dir * (46 + 74 * hep);
            return (
              <g key={side} opacity={hep} stroke={edge} strokeWidth={6} strokeLinecap="round" fill="none">
                <line x1={tail} y1={y} x2={tip} y2={y} />
                <path d={`M ${tip - dir * 18} ${y - 14} L ${tip} ${y} L ${tip - dir * 18} ${y + 14}`} />
              </g>
            );
          })
        : null}
      <Leaves n={22} freezeAt={freezeAt} seed="doc" />
    </svg>
  );
};
