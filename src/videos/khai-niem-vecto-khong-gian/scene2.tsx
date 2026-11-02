import React from "react";
import { AutoLabelItem, AutoLabels, Rect, estimateLabel, placeLabels, segmentObstacles, textObstacle } from "../../components/labels";
import { MathText, Tex } from "../../components/MathText";
import { lerp } from "../../components/parts";
import { role } from "../../components/roles";
import { ArrowPx, Seg, V3, makeProj } from "../../components/space3d";
import { colors, fontSize, fontText, halo, shadow, tint } from "../../components/theme";

// CẢNH 2 — hình hộp ABCD.A'B'C'D' kiểu SGK (trục sâu 30°, rút ngắn 0,5), đứng yên từ b02 tới b11.
// Trạng thái cảnh là một bảng số (độ mờ, tiến độ); thiếu khoá = 0. Mỗi beat tính bảng của mình (beats.tsx).

export type St = Record<string, number>;
const g = (s: St, k: string) => s[k] ?? 0;

/** Màu theo vai trò, giữ nghĩa suốt video. */
export const K = {
  box: role.main, // hình hộp
  vec: role.focus, // vectơ AB (vectơ đang xét)
  eq: role.pairB, // vectơ so với AB / bằng AB
  warn: role.warn, // phản ví dụ, bẫy
  zero: colors.text, // vectơ bình thường dùng để minh hoạ vectơ-không
  dim: role.dim,
};

// ---------------- Hình học ----------------
const P = makeProj(150, 790, 165, 30, 0.5);
const V: Record<string, V3> = {
  A: [0, 0, 0],
  B: [4, 0, 0],
  C: [4, 3, 0],
  D: [0, 3, 0],
  "A'": [0, 0, 2],
  "B'": [4, 0, 2],
  "C'": [4, 3, 2],
  "D'": [0, 3, 2],
};
export const px = (n: string) => P(V[n]);
const mid = (a: string, b: string): [number, number] => {
  const p = px(a);
  const q = px(b);
  return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
};
/** cạnh hình hộp; cạnh khuất (qua D) nét đứt */
const EDGES: [string, string, boolean][] = [
  ["A", "B", false],
  ["B", "C", false],
  ["D", "C", true],
  ["A", "D", true],
  ["A'", "B'", false],
  ["B'", "C'", false],
  ["D'", "C'", false],
  ["A'", "D'", false],
  ["A", "A'", false],
  ["B", "B'", false],
  ["C", "C'", false],
  ["D", "D'", true],
];

// ---------------- Dải phải: đẳng thức, thẻ đề bài, bảng tính chất ----------------
const STRIP = 1110;
const STRIP_W = 720;
const EQ = { left: STRIP, top: 196, w: STRIP_W, h: 80 };
const CARD = { left: STRIP, top: 160, w: STRIP_W, h: 150 };
const TABLE = { left: STRIP, top: 500, w: STRIP_W, rowH: 66, pad: 20 };
const TABLE_H = TABLE.pad * 2 + TABLE.rowH * 5;
export const ROWS = [
  "vectơ: đoạn thẳng có hướng",
  "cùng phương: giá song song, trùng",
  "cùng phương thì cùng/ngược hướng",
  "bằng nhau: cùng hướng, cùng độ dài",
  "$\\vec{0}$: điểm đầu trùng điểm cuối",
];
const ROW_COLOR = [K.vec, K.vec, K.vec, K.eq, K.zero];

// ---------------- Nhãn ----------------
const GIA_AB: [[number, number], [number, number]] = [
  [100, px("A")[1]],
  [1120, px("A")[1]],
];
const GIA_DC: [[number, number], [number, number]] = [
  [210, px("D")[1]],
  [1150, px("D")[1]],
];
const GIA_AA: [[number, number], [number, number]] = [
  [px("A")[0], 250],
  [px("A")[0], 900],
];
const RULER_AB = 30; // thước AB: dưới cạnh AB
const RULER_DC = 22; // thước DC: phía trong đáy (dưới DC)

const segObs = (a: [number, number], b: [number, number], t = 8) => segmentObstacles(a[0], a[1], b[0], b[1], t);
const BOX_OBST: Rect[] = EDGES.flatMap(([a, b]) => segObs(px(a), px(b)));
const CARD_OBST: Rect[] = [textObstacle(STRIP - 20, 140, STRIP_W + 40, TABLE.top + TABLE_H - 120)];
const BOUNDS: Rect = { x: 90, y: 110, w: 1000, h: 810 };

/** Tên đỉnh + tên các vectơ trên cạnh: đặt một lần cho cả cảnh, không nhảy chỗ. */
const STATIC_LABELS: (AutoLabelItem & { key: string })[] = [
  ...(
    [
      ["A", ["sw", "s", "w"]],
      ["B", ["se", "s", "e"]],
      ["C", ["e", "se"]],
      ["D", ["nw", "w", "n"]],
      ["A'", ["nw", "w"]],
      ["B'", ["n", "nw", "ne"]],
      ["C'", ["ne", "e"]],
      ["D'", ["nw", "n"]],
    ] as const
  ).map(([n, pref]) => ({ key: `v${n}`, id: `v${n}`, x: px(n)[0], y: px(n)[1], text: n, prefer: [...pref], color: colors.text, weight: 700 })),
  { key: "lAB", id: "lAB", x: mid("A", "B")[0], y: mid("A", "B")[1], text: "$\\vec{AB}$", color: K.vec, prefer: ["n", "ne"] },
  { key: "lDC", id: "lDC", x: mid("D", "C")[0] + 60, y: mid("D", "C")[1], text: "$\\vec{DC}$", color: K.eq, prefer: ["n", "ne"] },
  { key: "lCD", id: "lCD", x: mid("D", "C")[0] - 60, y: mid("D", "C")[1], text: "$\\vec{CD}$", color: K.warn, prefer: ["n", "nw"] },
  { key: "lDpCp", id: "lDpCp", x: mid("D'", "C'")[0], y: mid("D'", "C'")[1], text: "$\\vec{D'C'}$", color: K.eq, prefer: ["n"] },
  { key: "lApBp", id: "lApBp", x: mid("A'", "B'")[0], y: mid("A'", "B'")[1], text: "$\\vec{A'B'}$", color: K.eq, prefer: ["n", "ne"] },
];
const STATIC_OBST = [...BOX_OBST, ...segObs(...GIA_AB), ...segObs(...GIA_DC)];
const STATIC_BOUNDS: Rect = { ...BOUNDS, x: 80, w: BOUNDS.w + 10 };
const staticPos = placeLabels(
  STATIC_LABELS.map((it) => ({ id: it.id, ax: it.x, ay: it.y, ...estimateLabel(it.text, it.size ?? fontSize.label), prefer: it.prefer })),
  STATIC_OBST,
  STATIC_BOUNDS,
);
const staticRect = (id: string) => textObstacle(staticPos[id].cx - staticPos[id].w / 2, staticPos[id].cy - staticPos[id].h / 2, staticPos[id].w, staticPos[id].h);

/** Vật tạm (giá, thước, đường chéo, đường nối) cũng là vật cản cho nhãn động. */
const rulerAB: [[number, number], [number, number]] = [
  [px("A")[0], px("A")[1] + RULER_AB],
  [px("B")[0], px("B")[1] + RULER_AB],
];
const rulerDC: [[number, number], [number, number]] = [
  [px("D")[0], px("D")[1] + RULER_DC],
  [px("C")[0], px("C")[1] + RULER_DC],
];
const RULERS = [...segObs(...rulerAB), ...segObs(...rulerDC)];
/** vật tạm của từng phần (beat): chỉ chặn nhãn ở phần có nó */
const TEMP: Record<string, Rect[]> = {
  p3: segObs(...GIA_AA),
  p5: RULERS,
  // đường chéo ở b08 chỉ hiện thoáng qua, sau khi nhãn hình bình hành đã đứng chỗ → không chặn nhãn
  p8: RULERS,
  p9: [...segObs(px("A"), px("D'")), ...segObs(px("B"), px("C'"))],
  p10: [...segObs(px("A"), px("D'")), ...segObs(px("B"), px("C'"))],
  p11: [...RULERS, ...segObs(px("A"), px("C"))],
};
/** ở b08, b09 nhãn hình bình hành nằm trong đáy, chỗ của nhãn AB (nhãn AB mờ đi lúc đó) */
const FREE: Record<string, string[]> = { p5: ["lAB"], p8: ["lAB"], p9: ["lAB"], p11: ["lAB"] };
/** nhãn tên mặt, đặt giữa mặt (vật cản của nhãn động) */
const FACE_LABEL = { base: { x: 587, y: 738 }, slant: { x: 587, y: 588 } };
const dynObst = (phase: string): Rect[] => [
  ...STATIC_OBST,
  ...STATIC_LABELS.filter((it) => !(FREE[phase] ?? []).includes(it.id)).map((it) => staticRect(it.id)),
  ...(TEMP[phase] ?? []),
  ...(phase === "p8" ? [textObstacle(FACE_LABEL.base.x - 175, FACE_LABEL.base.y - 27, 350, 54)] : []),
  // thẻ đề bài / bảng tính chất chỉ chặn từ khi dải phải có chúng (b05 trở đi)
  ...(["p2", "p3", "p4"].includes(phase) ? [] : CARD_OBST),
];
/** trước khi dải phải có gì (b02–b04) hình hộp đứng giữa khung, nhãn được dùng chỗ bên phải */
const dynBounds = (phase: string): Rect => (["p2", "p3", "p4"].includes(phase) ? { x: 90 - CENTER_SHIFT, y: BOUNDS.y, w: 1700, h: BOUNDS.h } : BOUNDS);
/** độ dịch ngang của cụm hình hộp khi đứng giữa khung */
export const CENTER_SHIFT = 300;

const centroid = (...ns: string[]): [number, number] => {
  const ps = ns.map(px);
  return [ps.reduce((s, p) => s + p[0], 0) / ps.length, ps.reduce((s, p) => s + p[1], 0) / ps.length];
};

const dynLabels = (s: St, phase: string): AutoLabelItem[] => {
  const at = (p: [number, number]) => ({ x: p[0], y: p[1] });
  return [
    { id: "dau", ...at(px("A")), text: "điểm đầu", color: K.vec, opacity: g(s, "dau"), phases: ["p2"], prefer: ["w", "nw"] },
    { id: "cuoi", ...at(px("B")), text: "điểm cuối", color: K.vec, opacity: g(s, "cuoi"), phases: ["p2"], prefer: ["e", "ne"] },
    {
      id: "len",
      ...at([mid("A", "B")[0], px("A")[1] + RULER_AB]),
      text: "",
      steps: ["$|\\vec{AB}| = 4$", "$4$"],
      step: g(s, "lenStep"),
      color: K.vec,
      opacity: g(s, "len"),
      phases: ["p2", "p5", "p8", "p11"],
      prefer: ["s"],
      anchor: "region",
    },
    { id: "lenDC", ...at([mid("D", "C")[0] - (phase === "p8" ? 150 : phase === "p11" ? 220 : 0), px("D")[1] + RULER_DC]), text: "$4$", color: K.eq, opacity: g(s, "lenDC"), phases: ["p5", "p8", "p11"], prefer: phase === "p8" || phase === "p11" ? ["n", "nw", "ne"] : ["s"], anchor: "region" },
    { id: "gia", ...at(GIA_AB[1]), text: "giá", color: colors.muted, opacity: g(s, "labGia"), phases: ["p3"], prefer: ["e", "ne", "se"], anchor: "region" },
    { id: "cp", x: 1170, y: (px("A")[1] + px("D")[1]) / 2, text: "cùng phương", color: K.vec, opacity: g(s, "labCP"), phases: ["p3"], prefer: ["e"], anchor: "region" },
    { id: "kcp", ...at([px("A")[0], 300]), text: "không cùng phương", color: K.warn, opacity: g(s, "labKCP"), phases: ["p3"], prefer: ["ne", "e"], anchor: "region" },
    { id: "ch", ...at(centroid("B", "C")), text: "cùng hướng", color: K.vec, opacity: g(s, "labCH"), phases: ["p4"], prefer: ["e", "se"], anchor: "region" },
    { id: "nh", ...at(centroid("A", "B", "C", "D")), text: "ngược hướng", color: K.warn, opacity: g(s, "labNH"), phases: ["p4"], prefer: ["s", "n"], anchor: "region" },
    { id: "ne", ...at([mid("D", "C")[0], px("D")[1]]), text: "$\\vec{AB} \\ne \\vec{CD}$", color: K.warn, opacity: g(s, "labNe"), phases: ["p5"], prefer: ["n", "nw"] },
    { id: "zero", ...at(px("A")), text: "$\\vec{AA} = \\vec{0}$", color: K.zero, opacity: g(s, "labZ"), phases: ["p6"], prefer: ["e", "ne", "n"] },
    { id: "back", ...at(centroid("D", "C", "C'", "D'")), text: "$\\vec{DC} = \\vec{D'C'}$", color: K.eq, opacity: g(s, "labBack"), phases: ["p9"], prefer: ["n", "e"], anchor: "region" },
    { id: "eq11", ...at([mid("D", "C")[0], px("D")[1]]), text: "$\\vec{AB} = \\vec{DC}$", color: K.eq, opacity: g(s, "labEq11"), phases: ["p11"], prefer: ["n", "ne"] },
  ];
};

// ---------------- Vẽ ----------------
const VNAMES = Object.keys(V);

const Fill: React.FC<{ ns: string[]; color: string; o: number }> = ({ ns, color, o }) =>
  o <= 0 ? null : <polygon points={ns.map((n) => px(n).join(",")).join(" ")} fill={tint(color, 0.16)} opacity={o} />;

const Ruler: React.FC<{ a: [number, number]; b: [number, number]; color: string; o: number }> = ({ a, b, color, o }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      <Seg a={a} b={b} color={color} w={3} />
      <Seg a={[a[0], a[1] - 10]} b={[a[0], a[1] + 10]} color={color} w={3} />
      <Seg a={[b[0], b[1] - 10]} b={[b[0], b[1] + 10]} color={color} w={3} />
    </g>
  );

export const Scene2: React.FC<{ s: St; phase: string }> = ({ s, phase }) => {
  const boxO = g(s, "box") * (1 - 0.6 * g(s, "boxDim"));
  const pw = (k: string) => 7 * (1 + 0.6 * g(s, k));
  // vectơ DC mờ thành bóng khi CD đang hiện
  const dcO = g(s, "DC") * (1 - 0.75 * g(s, "dcGhost"));
  const zTop: V3 = [0, 0, g(s, "Zz")];
  const shift = g(s, "copyS");
  const sh = (n: string): [number, number] => {
    const p = px(n);
    return [p[0] + (px("D")[0] - px("A")[0]) * shift, p[1] + (px("D")[1] - px("A")[1]) * shift];
  };

  // nhãn tĩnh: tên đỉnh mờ bớt khi không được nói tới; tên vectơ đi theo mũi tên của nó
  const vo = (n: string) => g(s, "names") * (0.4 + 0.6 * (s[`e${n}`] ?? 1));
  const staticItems: AutoLabelItem[] = STATIC_LABELS.map((it) => {
    const o =
      it.key === "lAB"
        ? g(s, "labAB") * (1 - Math.max(g(s, "hideAB"), g(s, "rDC")))
        : it.key === "lDC"
          ? g(s, "labDC") * g(s, "DC") * (1 - g(s, "dcGhost"))
          : it.key === "lCD"
            ? g(s, "labCD")
            : it.key === "lDpCp"
              ? g(s, "labDpCp") * g(s, "DpCp")
              : it.key === "lApBp"
                ? g(s, "labApBp") * g(s, "ApBp")
                : vo(it.text);
    return { ...it, opacity: o };
  });
  const dyn = dynLabels(s, phase).map((it) => ({ ...it, opacity: (it.phases ?? []).includes(phase) ? it.opacity : 0 }));

  const tableO = g(s, "table");
  const rowO = (i: number) => g(s, `row${i}`) * (1 - 0.55 * g(s, "tDim") * (1 - g(s, `hi${i}`)));

  const shiftX = CENTER_SHIFT * (1 - g(s, "slide"));
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, translate: `${shiftX}px 0` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* mặt tô */}
        <Fill ns={["A", "B", "C", "D"]} color={K.vec} o={g(s, "fillBase")} />
        <Fill ns={["D", "C", "C'", "D'"]} color={K.eq} o={g(s, "fillBack")} />
        <Fill ns={["A", "B", "B'", "A'"]} color={K.eq} o={g(s, "fillFront")} />
        <Fill ns={["A", "B", "C'", "D'"]} color={K.vec} o={g(s, "fillSlant")} />
        {/* giá */}
        <Seg a={GIA_AB[0]} b={GIA_AB[1]} color={K.vec} w={3} o={0.45 * g(s, "giaAB") * (1 + g(s, "giaHi"))} />
        <Seg a={GIA_DC[0]} b={GIA_DC[1]} color={K.eq} w={3} o={0.45 * g(s, "giaDC") * (1 + g(s, "giaHi"))} />
        <Seg a={GIA_AA[0]} b={GIA_AA[1]} color={K.warn} w={3} o={0.45 * g(s, "giaAA")} />
        {/* hình hộp */}
        {EDGES.map(([a, b, hid]) => (
          <Seg key={a + b} a={px(a)} b={px(b)} color={K.box} w={4} o={boxO} dash={hid} />
        ))}
        {/* đoạn nối điểm đầu / điểm cuối, đường chéo */}
        <Seg a={px("A")} b={px("D")} color={colors.text} w={6} o={g(s, "AD")} dash />
        <Seg a={px("B")} b={px("C")} color={colors.text} w={6} o={g(s, "BC")} />
        <Seg a={px("A")} b={px("D'")} color={colors.text} w={5} o={g(s, "ADp")} />
        <Seg a={px("B")} b={px("C'")} color={colors.text} w={5} o={g(s, "ADp")} />
        <Seg a={px("A")} b={px("C")} color={K.warn} w={4} o={g(s, "diag") + g(s, "ACtrap")} dash />
        <Seg a={px("B")} b={px("D")} color={K.warn} w={4} o={g(s, "diag")} dash />
        {g(s, "diag") > 0 ? (
          <circle data-mark="point" cx={(px("A")[0] + px("C")[0]) / 2} cy={(px("A")[1] + px("C")[1]) / 2} r={7} fill={K.warn} opacity={g(s, "diag")} />
        ) : null}
        {/* thước */}
        <Ruler a={rulerAB[0]} b={rulerAB[1]} color={K.vec} o={g(s, "rAB")} />
        <Ruler a={rulerDC[0]} b={rulerDC[1]} color={K.eq} o={g(s, "rDC")} />
        {/* mũi tên */}
        <ArrowPx a={px("A")} b={px("A'")} color={K.warn} o={g(s, "AAp")} t={g(s, "AApT")} />
        <ArrowPx a={px("D")} b={px("C")} color={K.eq} o={dcO} t={g(s, "DCt")} w={pw("pDC")} dash />
        <ArrowPx a={px("C")} b={px("D")} color={K.warn} o={g(s, "CD")} t={g(s, "CDt")} dash />
        <ArrowPx a={px("A'")} b={px("B'")} color={K.eq} o={g(s, "ApBp")} t={g(s, "ApBpT")} />
        <ArrowPx a={px("D'")} b={px("C'")} color={K.eq} o={g(s, "DpCp")} t={g(s, "DpCpT")} w={pw("pDpCp")} />
        <ArrowPx a={sh("A")} b={sh("B")} color={K.vec} o={0.45 * g(s, "copy")} />
        <ArrowPx a={px("A")} b={P(zTop)} color={K.zero} o={g(s, "Z") * (g(s, "Zz") > 0.05 ? 1 : 0)} head={Math.min(30, 170 * g(s, "Zz") * 0.4)} />
        <ArrowPx a={px("A")} b={px("B")} color={K.vec} o={g(s, "AB")} t={g(s, "ABt")} w={pw("pAB")} />
        {/* chấm nháy: điểm đầu, điểm cuối, vectơ-không */}
        {g(s, "pA") > 0 ? <circle cx={px("A")[0]} cy={px("A")[1]} r={10 + 10 * g(s, "pA")} fill={tint(K.vec, 0.35)} /> : null}
        {g(s, "pB") > 0 ? <circle cx={px("B")[0]} cy={px("B")[1]} r={10 + 10 * g(s, "pB")} fill={tint(K.vec, 0.35)} /> : null}
        {g(s, "zDot") > 0 ? (
          <circle data-mark="point" cx={px("A")[0]} cy={px("A")[1]} r={11 + 6 * g(s, "zPulse")} fill={K.zero} opacity={g(s, "zDot")} />
        ) : null}
      </svg>

      <AutoLabels items={staticItems} obstacles={STATIC_OBST} bounds={STATIC_BOUNDS} />
      <AutoLabels items={dyn} obstacles={dynObst(phase)} bounds={dynBounds(phase)} />

      {/* tên hai hình bình hành, giữa mặt mà chúng gọi tên */}
      {(
        [
          ["base", "labHbh", "hình bình hành $ABCD$"],
          ["slant", "labSlant", "hình bình hành $ABC'D'$"],
        ] as const
      ).map(([k, key, t]) =>
        g(s, key) > 0 ? (
          <div
            key={k}
            data-text="label"
            style={{ position: "absolute", left: FACE_LABEL[k].x, top: FACE_LABEL[k].y, translate: "-50% -50%", fontFamily: fontText, fontWeight: 600, fontSize: 36, color: K.vec, opacity: g(s, key), textShadow: halo(), whiteSpace: "nowrap" }}
          >
            <MathText text={t} />
          </div>
        ) : null,
      )}

      {/* tên hình (b02): dưới hình hộp, gỡ trước khi thước đo hiện */}
      {g(s, "title") > 0 ? (
        <div
          data-text="label"
          style={{ position: "absolute", left: mid("A", "B")[0], top: px("A")[1] + 44, translate: "-50% 0", fontFamily: fontText, fontWeight: 600, fontSize: 44, color: colors.text, opacity: g(s, "title"), textShadow: halo(), whiteSpace: "nowrap" }}
        >
          <MathText text="hình hộp $ABCD.A'B'C'D'$" />
        </div>
      ) : null}
      </div>

      {/* đẳng thức ở dải phải */}
      {g(s, "eq") > 0 ? (
        <div
          data-text="label"
          style={{ position: "absolute", left: EQ.left + EQ.w / 2, top: EQ.top, translate: "-50% 0", fontFamily: fontText, fontSize: 56, color: colors.text, opacity: g(s, "eq") * lerp(0.45, 1, g(s, "eqHi")), whiteSpace: "nowrap" }}
        >
          <MathText text={g(s, "eqStep") > 0.5 ? "$\\vec{AB} = \\vec{DC} = \\vec{D'C'}$" : "$\\vec{AB} = \\vec{DC}$"} />
        </div>
      ) : null}

      {/* thẻ đề bài */}
      {g(s, "card") > 0 ? (
        <div
          data-box="card"
          style={{ position: "absolute", left: CARD.left, top: CARD.top, width: CARD.w, height: CARD.h, background: colors.panel, border: `2px solid ${colors.panelBorder}`, borderRadius: 24, boxShadow: shadow, opacity: g(s, "card"), display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div data-text="card" style={{ fontFamily: fontText, fontWeight: 600, fontSize: 40, color: colors.text, whiteSpace: "nowrap" }}>
            {g(s, "cardStep") < 0.5 ? (
              <MathText text="Vectơ nào bằng $\vec{AB}$?" />
            ) : (
              <span>
                <Tex tex="\vec{AB}" />
                <span style={{ color: g(s, "neq") > 0.5 ? K.warn : colors.text, padding: "0 10px" }}>
                  <Tex tex={g(s, "neq") > 0.5 ? "\\ne" : "="} />
                </span>
                <Tex tex="\vec{CD}" />
                {/* đổi dấu xong, thẻ thành mệnh đề đã sửa; bỏ đuôi câu hỏi để không thành một câu hỏi mới */}
                {g(s, "neq") > 0.5 ? null : <span> đúng hay sai?</span>}
              </span>
            )}
          </div>
        </div>
      ) : null}

      {/* bảng tính chất */}
      {tableO > 0 ? (
        <div
          data-box="table"
          style={{ position: "absolute", left: TABLE.left, top: TABLE.top, width: TABLE.w, height: TABLE_H, background: colors.panel, border: `2px solid ${colors.panelBorder}`, borderRadius: 24, boxShadow: shadow, opacity: tableO }}
        >
          {ROWS.map((r, i) => (
            <div
              key={r}
              data-text="table"
              style={{
                position: "absolute",
                left: 18,
                top: TABLE.pad + i * TABLE.rowH + (TABLE.rowH - 50) / 2,
                height: 50,
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontFamily: fontText,
                fontWeight: g(s, `hi${i + 1}`) > 0.5 ? 700 : 600,
                fontSize: 36,
                color: colors.text,
                opacity: rowO(i + 1),
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ width: 14, height: 14, borderRadius: 7, background: ROW_COLOR[i], flex: "none" }} />
              <span style={{ background: g(s, `hi${i + 1}`) > 0 ? tint(ROW_COLOR[i], 0.14 * g(s, `hi${i + 1}`)) : undefined, borderRadius: 8, padding: "0 6px" }}>
                <MathText text={r} />
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export { VNAMES };
