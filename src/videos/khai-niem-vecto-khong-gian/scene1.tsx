import React from "react";
import { AutoLabelItem, AutoLabels, Rect, segmentObstacles, textObstacle } from "../../components/labels";
import { MathText } from "../../components/MathText";
import { lerp } from "../../components/parts";
import { ArrowPx, Seg, arcPath, makeProj } from "../../components/space3d";
import { colors, fontText, halo, shadow, tint } from "../../components/theme";
import { K, St } from "./scene2";

// CẢNH 1 — hai khung: trái dưới nắng (tia song song, nghiêng 45°), phải dưới đèn đường (tia toả từ một điểm).
// Ba cột cao 6 m giống hệt nhau ở cùng ba chỗ trong hai khung. Toạ độ mặt đất (m) → px qua phép chiếu song song.
// Lúc khung đêm chưa có, khung ngày đứng giữa; khung đêm hiện thì khung ngày trượt sang trái (quy tắc bố cục 3).

const g = (s: St, k: string) => s[k] ?? 0;

type Pt = [number, number];
type Proj = ReturnType<typeof makeProj>;
const H = 6; // chiều cao cột (m)
const POLES: [number, number][] = [
  [0, 0],
  [7, 5],
  [14, 10],
];
/** bóng dưới nắng: nắng chiếu từ trái, cao 45° → bóng dài đúng bằng cột, nằm ngang sang phải */
const SUN_SHADOW: [number, number] = [H, 0];
/** đèn đường: chân đèn trên mặt đất, cao 14 m */
const LAMP: [number, number] = [7, -2];
const LAMP_H = 14;
const lampShadow = (q: [number, number]): [number, number] => {
  const k = H / (LAMP_H - H);
  return [q[0] + (q[0] - LAMP[0]) * k, q[1] + (q[1] - LAMP[1]) * k];
};

const PANEL = { top: 130, h: 650, w: 840 };
const LEFT = 90;
const RIGHT = 990;
/** khung ngày đứng giữa → dịch về trái bao nhiêu */
const DAY_CENTER_SHIFT = (1920 - PANEL.w) / 2 - LEFT;
const projFor = (left: number) => makeProj(left + 150, PANEL.top + 530, 26, 30, 0.5);
const PD = projFor(LEFT);
const PN = projFor(RIGHT);
const ground = (P: Proj, q: [number, number]): Pt => P([q[0], q[1], 0]);
const top = (P: Proj, q: [number, number], h = H): Pt => P([q[0], q[1], h]);
const groundPoly = (P: Proj) =>
  (
    [
      [-12, -8],
      [34, -8],
      [34, 22],
      [-12, 22],
    ] as [number, number][]
  )
    .map((q) => ground(P, q).join(","))
    .join(" ");

const dayBase = POLES.map((q) => ground(PD, q));
const dayTip = POLES.map((q) => ground(PD, [q[0] + SUN_SHADOW[0], q[1] + SUN_SHADOW[1]]));
const dayTop = POLES.map((q) => top(PD, q));
const nightBase = POLES.map((q) => ground(PN, q));
const nightTip = POLES.map((q) => ground(PN, lampShadow(q)));
const nightTop = POLES.map((q) => top(PN, q));
const lampBase = ground(PN, LAMP);
const lampTop = top(PN, LAMP, LAMP_H);
const avg = (ps: Pt[]): Pt => [ps.reduce((a, p) => a + p[0], 0) / ps.length, ps.reduce((a, p) => a + p[1], 0) / ps.length];
const midSh = (b: Pt[], t: Pt[]) => avg(b.map((p, i) => [(p[0] + t[i][0]) / 2, (p[1] + t[i][1]) / 2] as Pt));
const lerpPt = (a: Pt, b: Pt, t: number): Pt => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

const polesObst = (base: Pt[], tops: Pt[], tips: Pt[]): Rect[] =>
  base.flatMap((b, i) => [...segmentObstacles(b[0], b[1], tops[i][0], tops[i][1], 10), ...segmentObstacles(b[0], b[1], tips[i][0], tips[i][1], 12)]);
const panelBounds = (left: number): Rect => ({ x: left + 16, y: PANEL.top + 70, w: PANEL.w - 32, h: PANEL.h - 86 });
const titleObst = (left: number) => textObstacle(left + PANEL.w / 2 - 190, PANEL.top + 16, 380, 50);
// số đo góc nắng: nằm trong góc, sát cung (cung r = 60 ở đỉnh bóng, giữa mặt đất và tia nắng)
const ANGLE_LABEL: Pt = [dayTip[0][0] - 95 * Math.cos((22.5 * Math.PI) / 180) - 30, dayTip[0][1] - 95 * Math.sin((22.5 * Math.PI) / 180) - 24];

const DAY_OBST: Rect[] = [
  ...polesObst(dayBase, dayTop, dayTip),
  // tia nắng qua đỉnh cột
  ...dayTop.flatMap((t, i) => segmentObstacles(t[0] - 150, t[1] - 150, dayTip[i][0], dayTip[i][1], 6)),
  titleObst(LEFT),
  textObstacle(ANGLE_LABEL[0], ANGLE_LABEL[1], 70, 46),
  // thước đo dưới bóng (b12)
  ...dayBase.flatMap((b, i) => segmentObstacles(b[0], b[1] + 22, dayTip[i][0], dayTip[i][1] + 22, 24)),
];

const dayLabels = (s: St, phase: string): AutoLabelItem[] =>
  [
    { id: "h6", x: (dayBase[0][0] + dayTop[0][0]) / 2, y: (dayBase[0][1] + dayTop[0][1]) / 2, text: "6 m", color: colors.text, opacity: g(s, "lab6"), prefer: ["w", "e"] as const, anchor: "region" as const },
    { id: "ss", x: midSh(dayBase, dayTip)[0], y: midSh(dayBase, dayTip)[1] + 30, text: "song song, dài bằng nhau", opacity: g(s, "labSS"), prefer: ["s"] as const, anchor: "region" as const, phases: ["p1"] },
    { id: "ch", x: midSh(dayBase, dayTip)[0], y: midSh(dayBase, dayTip)[1] + 30, text: "cùng hướng", color: K.vec, opacity: g(s, "labCH"), prefer: ["s"] as const, anchor: "region" as const, phases: ["p12"] },
    { id: "b6", x: (dayBase[0][0] + dayTip[0][0]) / 2, y: dayBase[0][1] + 22, text: "bóng 6 m", color: K.vec, opacity: g(s, "labB6"), prefer: ["s", "sw"] as const, anchor: "region" as const, phases: ["p12"] },
  ].map((it) => ({ ...it, prefer: [...it.prefer], opacity: !it.phases || it.phases.includes(phase) ? it.opacity : 0 }));

/** chữ trên nền đêm: chữ sáng, viền tối (AutoLabels chỉ có viền sáng) */
const XOE_AT: Pt = [midSh(nightBase, nightTip)[0], Math.max(...nightBase.map((p) => p[1])) + 40];

const Pole: React.FC<{ b: Pt; t: Pt; color: string }> = ({ b, t, color }) => (
  <g>
    <Seg a={b} b={t} color={color} w={10} />
    <circle cx={t[0]} cy={t[1]} r={6} fill={color} />
  </g>
);

const Ruler: React.FC<{ a: Pt; b: Pt; o: number }> = ({ a, b, o }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      <Seg a={[a[0], a[1] + 22]} b={[b[0], b[1] + 22]} color={K.vec} w={3} />
      <Seg a={[a[0], a[1] + 12]} b={[a[0], a[1] + 32]} color={K.vec} w={3} />
      <Seg a={[b[0], b[1] + 12]} b={[b[0], b[1] + 32]} color={K.vec} w={3} />
    </g>
  );

const NIGHT_BG = "#262B5E";
const POLE_DAY = "#5E6785";
const POLE_NIGHT = "#C9D2F0";
/** bóng: mảng tối trong suốt, khác hẳn thân cột */
const SHADOW_DAY = "#1E2235";
const SUN = "#F2B705";

/** mặt đất cắt theo khung tranh (bo góc) */
const Clip: React.FC<{ id: string; left: number }> = ({ id, left }) => (
  <defs>
    <clipPath id={id}>
      <rect x={left} y={PANEL.top} width={PANEL.w} height={PANEL.h} rx={28} />
    </clipPath>
  </defs>
);

const Title: React.FC<{ x: number; text: string; dark?: boolean }> = ({ x, text, dark }) => (
  <div
    data-text="label"
    style={{ position: "absolute", left: x, top: PANEL.top + 18, translate: "-50% 0", fontFamily: fontText, fontWeight: 700, fontSize: 36, color: dark ? "#FFFFFF" : colors.text, whiteSpace: "nowrap" }}
  >
    {text}
  </div>
);

const DayPanel: React.FC<{ s: St; phase: string }> = ({ s, phase }) => {
  const sh = g(s, "sh");
  const ray = (i: number): [Pt, Pt] => [[dayTop[i][0] - 150, dayTop[i][1] - 150], dayTip[i]];
  return (
    <>
      <div style={{ position: "absolute", left: LEFT, top: PANEL.top, width: PANEL.w, height: PANEL.h, borderRadius: 28, background: colors.panel, border: `2px solid ${colors.panelBorder}`, boxShadow: shadow }} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <Clip id="clipDay" left={LEFT} />
        <polygon points={groundPoly(PD)} fill={tint("#7BC47F", 0.22)} clipPath="url(#clipDay)" />
        <circle cx={LEFT + 90} cy={PANEL.top + 120} r={42} fill={SUN} />
        {POLES.map((_, i) => {
          const [a, b] = ray(i);
          return <Seg key={i} a={a} b={b} color={SUN} w={3 + 2 * g(s, "rayHi")} o={0.55 + 0.45 * g(s, "rayHi")} />;
        })}
        {g(s, "tri") > 0 ? (
          <g opacity={g(s, "tri")}>
            <polygon points={[dayBase[0], dayTop[0], dayTip[0]].map((p) => p.join(",")).join(" ")} fill={tint(K.vec, 0.18)} />
            <path d={`M ${dayBase[0][0] + 22} ${dayBase[0][1]} L ${dayBase[0][0] + 22} ${dayBase[0][1] - 22} L ${dayBase[0][0]} ${dayBase[0][1] - 22}`} fill="none" stroke={colors.text} strokeWidth={3} />
          </g>
        ) : null}
        {POLES.map((_, i) => (
          <Seg key={`sh${i}`} a={dayBase[i]} b={lerpPt(dayBase[i], dayTip[i], sh)} color={SHADOW_DAY} w={16} o={sh > 0 ? 0.3 : 0} />
        ))}
        {POLES.map((_, i) => (
          <ArrowPx key={`ar${i}`} a={dayBase[i]} b={dayTip[i]} color={K.vec} o={g(s, "dayArrows")} w={7} />
        ))}
        <Ruler a={dayBase[0]} b={dayTip[0]} o={g(s, "ruler0")} />
        <Ruler a={dayBase[1]} b={dayTip[1]} o={g(s, "ruler12")} />
        <Ruler a={dayBase[2]} b={dayTip[2]} o={g(s, "ruler12")} />
        {POLES.map((_, i) => (
          <Pole key={`p${i}`} b={dayBase[i]} t={dayTop[i]} color={POLE_DAY} />
        ))}
        {/* góc nắng 45° ở đỉnh bóng cột đầu */}
        <path d={arcPath(dayTip[0], 60, 180, 225)} fill="none" stroke={SUN} strokeWidth={4} />
      </svg>
      <Title x={LEFT + PANEL.w / 2} text="dưới nắng" />
      <div data-text="label" style={{ position: "absolute", left: ANGLE_LABEL[0], top: ANGLE_LABEL[1], fontFamily: fontText, fontWeight: 600, fontSize: 36, color: colors.text, textShadow: halo(colors.panel) }}>
        <MathText text="$45^\circ$" />
      </div>
      <AutoLabels items={dayLabels(s, phase)} obstacles={DAY_OBST} bounds={panelBounds(LEFT)} />
      {/* dòng 'bằng nhau' của bảng tính chất (b12) */}
      {g(s, "rowCard") > 0 ? (
        <div
          data-box="row"
          style={{ position: "absolute", left: LEFT + PANEL.w / 2 - 340, top: PANEL.top + PANEL.h + 24, width: 680, height: 72, borderRadius: 20, background: colors.panel, border: `2px solid ${colors.panelBorder}`, boxShadow: shadow, opacity: g(s, "rowCard") * lerp(0.5, 1, g(s, "rowHi")), display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}
        >
          <span style={{ width: 14, height: 14, borderRadius: 7, background: K.eq }} />
          <span data-text="table" style={{ fontFamily: fontText, fontWeight: g(s, "rowHi") > 0.5 ? 700 : 600, fontSize: 36, color: colors.text, whiteSpace: "nowrap" }}>
            bằng nhau: cùng hướng, cùng độ dài
          </span>
        </div>
      ) : null}
    </>
  );
};

const NightPanel: React.FC<{ s: St }> = ({ s }) => {
  const nsh = g(s, "nsh");
  return (
    <>
      <div style={{ position: "absolute", left: RIGHT, top: PANEL.top, width: PANEL.w, height: PANEL.h, borderRadius: 28, background: NIGHT_BG, boxShadow: shadow }} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <Clip id="clipNight" left={RIGHT} />
        <polygon points={groundPoly(PN)} fill="#6B74B8" clipPath="url(#clipNight)" />
        <circle cx={lampTop[0]} cy={lampTop[1]} r={70} fill={tint(SUN, 0.25)} />
        <Seg a={lampBase} b={lampTop} color={POLE_NIGHT} w={8} />
        <circle cx={lampTop[0]} cy={lampTop[1]} r={14} fill={SUN} />
        {POLES.map((_, i) => (
          <Seg key={`nsh${i}`} a={nightBase[i]} b={lerpPt(nightBase[i], nightTip[i], nsh)} color="#0B0E2E" w={16} o={nsh > 0 ? 0.85 : 0} />
        ))}
        {POLES.map((_, i) => (
          <ArrowPx key={`nar${i}`} a={nightBase[i]} b={nightTip[i]} color={K.warn} o={g(s, "nightArrows")} w={7} />
        ))}
        {POLES.map((_, i) => (
          <Pole key={`np${i}`} b={nightBase[i]} t={nightTop[i]} color={POLE_NIGHT} />
        ))}
      </svg>
      <Title x={RIGHT + PANEL.w / 2} text="dưới đèn đường" dark />
      {g(s, "labXoe") > 0 ? (
        <div
          data-text="label"
          style={{ position: "absolute", left: XOE_AT[0], top: XOE_AT[1], translate: "-50% 0", fontFamily: fontText, fontWeight: 600, fontSize: 36, color: "#FFFFFF", opacity: g(s, "labXoe"), textShadow: halo(NIGHT_BG), whiteSpace: "nowrap" }}
        >
          xòe ra
        </div>
      ) : null}
    </>
  );
};

export const Scene1: React.FC<{ s: St; phase: string }> = ({ s, phase }) => {
  const day = g(s, "day") * (1 - 0.5 * g(s, "dayDim"));
  const night = g(s, "night") * (1 - 0.45 * g(s, "nightDim"));
  const dx = DAY_CENTER_SHIFT * (1 - g(s, "daySlide"));
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {day > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: day, translate: `${dx}px 0` }}>
          <DayPanel s={s} phase={phase} />
        </div>
      ) : null}
      {night > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: night }}>
          <NightPanel s={s} />
        </div>
      ) : null}
    </div>
  );
};
