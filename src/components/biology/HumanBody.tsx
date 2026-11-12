import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Dir, Rect } from "../labelLayout";
import { BLOOD, ORGAN, SUBSTANCE, type Substance } from "./palette";
import { Pt, arrowHead, offsetPolyline, pointAt, polyLength, slice, toPath, trimEnd } from "./polyline";

/**
 * Cơ thể người nhìn thẳng — sơ đồ trao đổi chất với môi trường (gói Sinh › 3 › Sơ đồ cơ thể có nhiều quá trình).
 *
 * - Cơ quan đặt đúng vị trí giải phẫu tương đối: phổi hai bên tim, dạ dày dưới tim, ruột ở bụng, mô cơ ở đùi.
 * - Đường đi của chất (`routes`) vẽ đủ từ môi trường tới tế bào và ngược lại, đi theo mạch máu, mỗi chất một màu
 *   (palette.ts), hai quá trình đi chung một đoạn mạch thì tách làn.
 * - Mỗi đường có ba trạng thái: "active" (đang đọc — sáng, có hạt chạy theo mạch), "done" (đã nói xong — mờ),
 *   không khai báo = chưa hiện. Mỗi beat/dòng chỉ một đường "active".
 * - Tên cơ quan KHÔNG vẽ ở đây: đặt bằng AutoLabels, neo vào humanBodyLabelSpots(...) (mép cơ quan + hướng trống),
 *   vật cản humanBodyObstacles(...). Mọi cơ quan lời đọc nhắc tới đều phải có nhãn (dung-video › quy tắc 7).
 *
 *   const P = { left: 140, top: 140, height: 880 };
 *   <HumanBody {...P} routes={{ food: { state: "done" }, nutrient: { state: "active", draw: fadeIn(fr, L[1], 40) } }} />
 *   <AutoLabels items={[{ id: "ruot", ...humanBodyLabelSpots(P).intestine, text: "Ruột", phases: ["b02"] }]}
 *               obstacles={humanBodyObstacles(P)} />
 * Mẫu đủ: src/videos/lab-thanh-phan/sinh.tsx (cảnh 4).
 */

/** Khung thiết kế 900 × 1000: vùng môi trường bên trái (đĩa thức ăn, không khí), cơ thể ở giữa–phải. */
const DW = 900;
const DH = 1000;

export type OrganId = "lungs" | "heart" | "stomach" | "intestine" | "tissue" | "airway" | "mouth";
export type RouteId = "food" | "o2Air" | "o2Blood" | "nutrient" | "co2Blood" | "co2Out";
export type RouteState = { state: "active" | "done"; /** 0–1: phần đường đã vẽ (mặc định 1) */ draw?: number };
export type OrganState = "normal" | "focus" | "dim";
/** Tế bào nhận chất: mô cơ ở đùi (mặc định) hoặc chính cơ tim (đường máu dừng ở tim). */
export type TissueSite = "thigh" | "heart";

export type HumanBodyProps = {
  left: number;
  top: number;
  /** chiều cao (px trang); rộng = height × 0,9 */
  height: number;
  tissue?: TissueSite;
  routes?: Partial<Record<RouteId, RouteState>>;
  organs?: Partial<Record<OrganId, OrganState>>;
  /** độ hiện của mạch máu (ống nhạt đỏ/tím) */
  vessels?: number;
  /** độ hiện của vật bên ngoài cơ thể (đĩa thức ăn, không khí) */
  outside?: number;
  opacity?: number;
};

// ---------- hình học (toạ độ thiết kế) ----------
const HEAD = { x: 560, y: 105, r: 68 };
const TORSO = "M 440 232 C 500 212 620 212 680 232 C 700 300 692 430 676 612 C 600 642 520 642 444 612 C 428 430 420 300 440 232 Z";
const ARMS: Pt[][] = [
  [{ x: 446, y: 252 }, { x: 398, y: 330 }, { x: 378, y: 562 }],
  [{ x: 674, y: 252 }, { x: 722, y: 330 }, { x: 742, y: 562 }],
];
const LEGS: Pt[][] = [
  [{ x: 505, y: 600 }, { x: 495, y: 962 }],
  [{ x: 615, y: 600 }, { x: 625, y: 962 }],
];
const LUNG_L = { x: 497, y: 345, rx: 50, ry: 88 };
const LUNG_R = { x: 630, y: 338, rx: 44, ry: 80 };
const HEART = { x: 580, y: 402, s: 44 };
const STOMACH = { x: 618, y: 478, rx: 46, ry: 28, rot: -18 };
const INTESTINE = "M 486 524 L 632 524 Q 650 537 632 551 L 486 551 Q 468 564 486 578 L 632 578";
const THIGH = { x: 620, y: 772, w: 70, h: 112 };
const PLATE = { x: 175, y: 182 };
const AIR = { x: 190, y: 92 };

const ORGAN_CENTER: Record<OrganId, Pt> = {
  lungs: { x: LUNG_L.x, y: LUNG_L.y },
  heart: { x: HEART.x, y: HEART.y },
  stomach: { x: STOMACH.x, y: STOMACH.y },
  intestine: { x: 560, y: 551 },
  tissue: { x: THIGH.x, y: THIGH.y },
  airway: { x: 552, y: 215 },
  mouth: { x: 560, y: 136 },
};

/** Hình bầu dục → các dải ngang (vật cản sát hình thật hơn một khung bao — góc khung bao trống chừa chỗ cho nhãn). */
const ellipseBands = (cx: number, cy: number, rx: number, ry: number, n = 5): Rect[] =>
  Array.from({ length: n }, (_, i) => {
    const y0 = cy - ry + (2 * ry * i) / n;
    const y1 = y0 + (2 * ry) / n;
    const dy = Math.min(Math.abs(y0 - cy), Math.abs(y1 - cy));
    const hw = rx * Math.sqrt(Math.max(0, 1 - (dy / ry) ** 2));
    return { x: cx - hw, y: y0, w: hw * 2, h: y1 - y0 };
  });

const ORGAN_BOX: Record<Exclude<OrganId, "mouth" | "airway">, Rect[]> = {
  // hai lá phổi và tim theo dải sát hình: nhãn "Tim" phải có chỗ ngay dưới tim
  lungs: [...ellipseBands(LUNG_L.x, LUNG_L.y, LUNG_L.rx, LUNG_L.ry), ...ellipseBands(LUNG_R.x, LUNG_R.y, LUNG_R.rx, LUNG_R.ry)],
  heart: [
    { x: HEART.x - HEART.s, y: HEART.y - HEART.s * 0.75, w: HEART.s * 2, h: HEART.s * 0.75 },
    { x: HEART.x - HEART.s * 0.9, y: HEART.y, w: HEART.s * 1.8, h: HEART.s * 0.45 },
    { x: HEART.x - HEART.s * 0.5, y: HEART.y + HEART.s * 0.45, w: HEART.s, h: HEART.s * 0.42 },
  ],
  stomach: [{ x: STOMACH.x - STOMACH.rx - 6, y: STOMACH.y - STOMACH.ry - 10, w: STOMACH.rx * 2 + 12, h: STOMACH.ry * 2 + 20 }],
  intestine: [{ x: 470, y: 512, w: 182, h: 78 }],
  tissue: [{ x: THIGH.x - THIGH.w / 2, y: THIGH.y - THIGH.h / 2, w: THIGH.w, h: THIGH.h }],
};

// mạch máu (sơ đồ): động mạch chủ từ tim xuống đùi; tĩnh mạch từ đùi về tim; mạch phổi
const AORTA: Pt[] = [{ x: 592, y: 440 }, { x: 592, y: 600 }, { x: 636, y: 680 }, { x: 636, y: 716 }];
const VENA: Pt[] = [{ x: 604, y: 716 }, { x: 604, y: 680 }, { x: 548, y: 600 }, { x: 548, y: 440 }, { x: 566, y: 418 }];
const PULM: Pt[][] = [
  [{ x: 568, y: 392 }, { x: 515, y: 350 }],
  [{ x: 594, y: 388 }, { x: 618, y: 352 }],
];

type RouteDef = { substance: Substance; main: Pt[]; branches?: Pt[][]; offset: number; trim: number };

const routeDefs = (tissue: TissueSite): Record<RouteId, RouteDef> => {
  const toTissue: Pt[] = tissue === "thigh" ? [{ x: 592, y: 440 }, ...AORTA.slice(1)] : [];
  const heartIn: Pt = { x: 574, y: 404 };
  return {
    food: {
      substance: "nutrient",
      main: [{ x: 250, y: 172 }, { x: 500, y: 144 }, { x: 556, y: 140 }, { x: 572, y: 160 }, { x: 572, y: 432 }, { x: 604, y: 468 }, { x: 600, y: 506 }, { x: 560, y: 540 }],
      offset: 0,
      trim: 22,
    },
    o2Air: {
      substance: "o2",
      main: [{ x: 252, y: 96 }, { x: 540, y: 106 }, { x: 552, y: 140 }, { x: 552, y: 282 }, { x: 510, y: 318 }],
      branches: [[{ x: 552, y: 282 }, { x: 610, y: 306 }]],
      offset: 7,
      trim: 18,
    },
    o2Blood: {
      substance: "o2",
      main: tissue === "thigh" ? [{ x: 515, y: 350 }, { x: 568, y: 392 }, ...toTissue] : [{ x: 515, y: 350 }, heartIn],
      offset: -8,
      trim: tissue === "thigh" ? 26 : 18,
    },
    nutrient: {
      substance: "nutrient",
      main:
        tissue === "thigh"
          ? [{ x: 532, y: 551 }, { x: 548, y: 551 }, { x: 548, y: 440 }, { x: 572, y: 418 }, ...toTissue]
          : [{ x: 532, y: 551 }, { x: 548, y: 551 }, { x: 548, y: 440 }, heartIn],
      offset: 8,
      trim: tissue === "thigh" ? 26 : 18,
    },
    co2Blood: {
      substance: "co2",
      main: tissue === "thigh" ? [...VENA.slice(0, 4), { x: 566, y: 412 }, { x: 520, y: 352 }] : [heartIn, { x: 520, y: 352 }],
      offset: -8,
      trim: 18,
    },
    co2Out: {
      substance: "co2",
      main: [{ x: 506, y: 326 }, { x: 548, y: 286 }, { x: 548, y: 140 }, { x: 538, y: 114 }, { x: 252, y: 120 }],
      offset: 7,
      trim: 0,
    },
  };
};

// ---------- hình phụ ----------
const heartPath = (x: number, y: number, s: number) =>
  `M ${x} ${y + s * 0.85} C ${x - s * 1.25} ${y + s * 0.05}, ${x - s * 0.95} ${y - s * 0.95}, ${x} ${y - s * 0.38} ` +
  `C ${x + s * 0.95} ${y - s * 0.95}, ${x + s * 1.25} ${y + s * 0.05}, ${x} ${y + s * 0.85} Z`;

/** Hạt chất: O₂ hai cầu, CO₂ ba cầu, chất dinh dưỡng lục giác (khớp hình trong Biomolecule). */
const Particle: React.FC<{ substance: Substance; x: number; y: number; angle: number }> = ({ substance, x, y, angle }) => {
  const c = SUBSTANCE[substance];
  const st = { stroke: "#FFFFFF", strokeWidth: 2.5 };
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      {substance === "o2" ? (
        <>
          <circle cx={-6} cy={0} r={7.5} fill={c} {...st} />
          <circle cx={6} cy={0} r={7.5} fill={c} {...st} />
        </>
      ) : substance === "co2" ? (
        <>
          <circle cx={-11} cy={0} r={6.5} fill={c} {...st} />
          <circle cx={11} cy={0} r={6.5} fill={c} {...st} />
          <circle cx={0} cy={0} r={7.5} fill={c} {...st} />
        </>
      ) : (
        <path d="M 0 -9 L 7.8 -4.5 L 7.8 4.5 L 0 9 L -7.8 4.5 L -7.8 -4.5 Z" fill={c} {...st} />
      )}
    </g>
  );
};

const Route: React.FC<{ def: RouteDef; st: RouteState; frame: number; fps: number }> = ({ def, st, frame, fps }) => {
  const color = SUBSTANCE[def.substance];
  const active = st.state === "active";
  const draw = active ? Math.max(0, Math.min(1, st.draw ?? 1)) : 1;
  const lines = [def.main, ...(def.branches ?? [])].map((p, i) => {
    const off = offsetPolyline(p, def.offset);
    return i === 0 ? trimEnd(off, def.trim) : trimEnd(off, 14);
  });
  return (
    <g opacity={active ? 1 : 0.3}>
      {lines.map((pts, i) => {
        // nhánh chỉ vẽ khi thân đã vẽ tới chỗ rẽ
        const k = i === 0 ? draw : Math.max(0, (draw - 0.85) / 0.15);
        if (k <= 0) return null;
        const vis = slice(pts, k);
        const L = polyLength(vis);
        const n = active && k >= 1 ? Math.max(1, Math.floor(L / 70)) : 0;
        const speed = 90 / fps; // px thiết kế mỗi frame
        return (
          <g key={i}>
            <path d={toPath(vis)} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            {k >= 1 ? <path d={arrowHead(vis, 22)} fill={color} /> : null}
            {Array.from({ length: n }, (_, j) => {
              const t = (((frame * speed) / L + j / n) % 1 + 1) % 1;
              const p = pointAt(vis, t * 0.94);
              return <Particle key={j} substance={def.substance} x={p.x} y={p.y} angle={p.angle} />;
            })}
          </g>
        );
      })}
    </g>
  );
};

const organStyle = (s: OrganState | undefined) =>
  s === "dim" ? { opacity: 0.35, w: 4 } : s === "focus" ? { opacity: 1, w: 7 } : { opacity: 1, w: 4 };

const toPage = (p: HumanBodyProps, pt: Pt) => {
  const k = p.height / DH;
  return { x: p.left + pt.x * k, y: p.top + pt.y * k };
};

/** Cỡ khung component (px trang). */
export const humanBodySize = (height: number) => ({ width: (height * DW) / DH, height });

/** Điểm neo nhãn (px trang): tâm từng cơ quan, mạch máu, đĩa thức ăn, không khí. */
export const humanBodyAnchors = (p: HumanBodyProps) => {
  const out = {} as Record<OrganId | "food" | "air" | "artery" | "vein", Pt>;
  (Object.keys(ORGAN_CENTER) as OrganId[]).forEach((id) => {
    out[id] = toPage(p, id === "tissue" && p.tissue === "heart" ? ORGAN_CENTER.heart : ORGAN_CENTER[id]);
  });
  out.food = toPage(p, PLATE);
  out.air = toPage(p, AIR);
  out.artery = toPage(p, { x: 592, y: 520 });
  out.vein = toPage(p, { x: 548, y: 490 });
  return out;
};

/**
 * Chỗ đặt nhãn tên cơ quan (px trang): điểm neo ở MÉP cơ quan, phía còn trống, kèm hướng ưu tiên — để nhãn
 * nằm sát ngay cơ quan của nó, không lơ lửng giữa hai cơ quan (gói Sinh › Sơ đồ cơ thể).
 *   <AutoLabels items={[{ id: "tim", ...spots.heart, text: "Tim" }]} obstacles={humanBodyObstacles(P)} />
 */
export const humanBodyLabelSpots = (p: HumanBodyProps) => {
  const at = (x: number, y: number, prefer: Dir[]) => ({ ...toPage(p, { x, y }), prefer });
  const heartTissue = p.tissue === "heart";
  return {
    lungs: at(LUNG_L.x - LUNG_L.rx, LUNG_L.y - 20, ["w", "nw"]),
    heart: at(HEART.x - HEART.s * 0.5, HEART.y + HEART.s * 0.7, ["sw", "s", "w"]),
    stomach: at(STOMACH.x + STOMACH.rx, STOMACH.y, ["e", "ne"]),
    intestine: at(470, 551, ["w", "sw"]),
    tissue: heartTissue ? at(HEART.x - HEART.s * 0.45, HEART.y + HEART.s * 0.62, ["sw", "s"]) : at(THIGH.x + THIGH.w / 2, THIGH.y, ["e", "ne"]),
    airway: at(552, 230, ["w"]),
    mouth: at(540, 136, ["w"]),
    food: at(PLATE.x, PLATE.y + 32, ["s", "sw", "se"]),
    air: at(AIR.x, AIR.y - 34, ["n", "nw", "ne"]),
  } satisfies Record<OrganId | "food" | "air", Pt & { prefer: Dir[] }>;
};

/** Vật cản cho AutoLabels (px trang): khung các cơ quan + đĩa thức ăn + đám mây, trừ những cơ quan trong `except`. */
export const humanBodyObstacles = (p: HumanBodyProps, except: OrganId[] = []): Rect[] => {
  const k = p.height / DH;
  const page = (b: Rect): Rect => ({ x: p.left + b.x * k, y: p.top + b.y * k, w: b.w * k, h: b.h * k });
  const organs = (Object.keys(ORGAN_BOX) as (keyof typeof ORGAN_BOX)[])
    .filter((id) => !except.includes(id) && !(id === "tissue" && p.tissue === "heart"))
    .flatMap((id) => ORGAN_BOX[id].map(page));
  return [
    ...organs,
    page({ x: PLATE.x - 70, y: PLATE.y - 24, w: 140, h: 58 }),
    page({ x: AIR.x - 64, y: AIR.y - 40, w: 156, h: 56 }),
  ];
};

/** Điểm trên cơ thể (px trang) để mở cửa sổ soi (ZoomCallout): nơi chất vào/ra máu. */
export const humanBodySoi = (p: HumanBodyProps) => ({
  lung: toPage(p, { x: LUNG_L.x, y: LUNG_L.y + 10 }),
  intestine: toPage(p, { x: 520, y: 551 }),
  tissue: toPage(p, p.tissue === "heart" ? { x: HEART.x, y: HEART.y } : { x: THIGH.x, y: THIGH.y }),
  /** bán kính vòng soi gợi ý (px trang) */
  r: 46 * (p.height / DH),
});

export const HumanBody: React.FC<HumanBodyProps> = (p) => {
  const { left, top, height, tissue = "thigh", routes = {}, organs = {}, vessels = 1, outside = 1, opacity = 1 } = p;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = height / DH;
  const B = ORGAN.body;
  const defs = routeDefs(tissue);
  const o = (id: OrganId) => organStyle(organs[id]);
  const limb = (pts: Pt[], w: number, color: string) => (
    <path d={toPath(pts)} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  );
  const silhouette = (outline: boolean) => {
    const c = outline ? B.stroke : B.fill;
    const e = outline ? 10 : 0;
    return (
      <g>
        {ARMS.map((a, i) => <React.Fragment key={`a${i}`}>{limb(a, 52 + e, c)}</React.Fragment>)}
        {LEGS.map((l, i) => <React.Fragment key={`l${i}`}>{limb(l, 84 + e, c)}</React.Fragment>)}
        <rect x={534 - e / 2} y={160} width={52 + e} height={70} fill={c} />
        <path d={TORSO} fill={c} stroke={c} strokeWidth={outline ? 10 : 0} strokeLinejoin="round" />
        <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r + e / 2} fill={c} />
      </g>
    );
  };
  return (
    <div data-extent="" style={{ position: "absolute", left, top, width: DW * k, height, opacity }}>
      <svg width={DW * k} height={height} viewBox={`0 0 ${DW} ${DH}`} style={{ overflow: "visible" }}>
        {/* môi trường: đĩa thức ăn, không khí */}
        <g opacity={outside}>
          <ellipse cx={PLATE.x} cy={PLATE.y + 14} rx={66} ry={16} fill="#E2E8F0" stroke="#94A3B8" strokeWidth={4} />
          <circle cx={PLATE.x - 22} cy={PLATE.y} r={18} fill="#E9B872" stroke="#B7862B" strokeWidth={3} />
          <circle cx={PLATE.x + 12} cy={PLATE.y - 4} r={20} fill="#D9A55B" stroke="#B7862B" strokeWidth={3} />
          <circle cx={PLATE.x + 36} cy={PLATE.y + 4} r={13} fill="#A3B86C" stroke="#7C8F45" strokeWidth={3} />
          <path
            d={`M ${AIR.x - 60} ${AIR.y + 10} q 0 -26 26 -26 q 8 -24 36 -18 q 22 -14 40 6 q 24 2 22 24 q 0 16 -20 16 h -84 q -20 0 -20 -2 Z`}
            fill="#EAF2FD"
            stroke="#A3B3D1"
            strokeWidth={4}
          />
        </g>
        {/* cơ thể: viền rồi nền (hợp các khối thành một hình liền) */}
        {silhouette(true)}
        {silhouette(false)}
        {/* mạch máu */}
        <g opacity={vessels}>
          {tissue === "thigh" ? (
            <>
              <path d={toPath(AORTA)} fill="none" stroke={BLOOD.rich} strokeOpacity={0.28} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
              <path d={toPath(VENA)} fill="none" stroke={BLOOD.poor} strokeOpacity={0.28} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
            </>
          ) : (
            <path d={toPath(VENA.slice(2))} fill="none" stroke={BLOOD.poor} strokeOpacity={0.28} strokeWidth={14} strokeLinecap="round" />
          )}
          {PULM.map((pp, i) => (
            <path key={i} d={toPath(pp)} fill="none" stroke={BLOOD.poor} strokeOpacity={0.24} strokeWidth={12} strokeLinecap="round" />
          ))}
        </g>
        {/* đường thở + thực quản */}
        <g opacity={o("airway").opacity}>
          <path d="M 552 140 L 552 282 M 552 282 L 512 312 M 552 282 L 604 302" fill="none" stroke={ORGAN.airway.stroke} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 552 140 L 552 282 M 552 282 L 512 312 M 552 282 L 604 302" fill="none" stroke={ORGAN.airway.fill} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <path d="M 572 158 L 572 438 L 596 462" fill="none" stroke={ORGAN.stomach.stroke} strokeOpacity={0.35} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        {/* miệng */}
        <path d="M 540 132 Q 560 146 580 132" fill="none" stroke="#1E293B" strokeWidth={4} strokeLinecap="round" opacity={o("mouth").opacity} />
        <circle cx={538} cy={92} r={5} fill="#1E293B" />
        <circle cx={582} cy={92} r={5} fill="#1E293B" />
        {/* phổi */}
        <g opacity={o("lungs").opacity}>
          <ellipse cx={LUNG_L.x} cy={LUNG_L.y} rx={LUNG_L.rx} ry={LUNG_L.ry} fill={ORGAN.lung.fill} stroke={ORGAN.lung.stroke} strokeWidth={o("lungs").w} />
          <ellipse cx={LUNG_R.x} cy={LUNG_R.y} rx={LUNG_R.rx} ry={LUNG_R.ry} fill={ORGAN.lung.fill} stroke={ORGAN.lung.stroke} strokeWidth={o("lungs").w} />
        </g>
        {/* dạ dày */}
        <g opacity={o("stomach").opacity}>
          <ellipse
            cx={STOMACH.x}
            cy={STOMACH.y}
            rx={STOMACH.rx}
            ry={STOMACH.ry}
            transform={`rotate(${STOMACH.rot} ${STOMACH.x} ${STOMACH.y})`}
            fill={ORGAN.stomach.fill}
            stroke={ORGAN.stomach.stroke}
            strokeWidth={o("stomach").w}
          />
        </g>
        {/* ruột */}
        <g opacity={o("intestine").opacity}>
          <path d={INTESTINE} fill="none" stroke={ORGAN.intestine.stroke} strokeWidth={22 + (o("intestine").w - 4) * 2} strokeLinecap="round" strokeLinejoin="round" />
          <path d={INTESTINE} fill="none" stroke={ORGAN.intestine.fill} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* tim */}
        <g opacity={o("heart").opacity}>
          <path d={heartPath(HEART.x, HEART.y, HEART.s)} fill={ORGAN.heart.fill} stroke={ORGAN.heart.stroke} strokeWidth={o("heart").w} strokeLinejoin="round" />
        </g>
        {/* mô cơ ở đùi */}
        {tissue === "thigh" ? (
          <g opacity={o("tissue").opacity}>
            <rect
              x={THIGH.x - THIGH.w / 2}
              y={THIGH.y - THIGH.h / 2}
              width={THIGH.w}
              height={THIGH.h}
              rx={26}
              fill={ORGAN.tissue.fill}
              stroke={ORGAN.tissue.stroke}
              strokeWidth={o("tissue").w}
            />
            {[-16, 0, 16].map((dx) => (
              <line key={dx} x1={THIGH.x + dx} y1={THIGH.y - THIGH.h / 2 + 16} x2={THIGH.x + dx} y2={THIGH.y + THIGH.h / 2 - 16} stroke={ORGAN.tissue.stroke} strokeOpacity={0.45} strokeWidth={3} />
            ))}
          </g>
        ) : null}
        {/* đường đi của chất: đã xong (mờ) vẽ trước, đang đọc vẽ sau cùng */}
        {(Object.keys(routes) as RouteId[])
          .sort((a, b) => Number(routes[a]?.state === "active") - Number(routes[b]?.state === "active"))
          .map((id) => {
            const st = routes[id];
            return st ? <Route key={id} def={defs[id]} st={st} frame={frame} fps={fps} /> : null;
          })}
      </svg>
    </div>
  );
};
