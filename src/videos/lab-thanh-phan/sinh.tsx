import React from "react";
import { useCurrentFrame } from "remotion";
import { BeatProps } from "../../components/BeatShell";
import { AutoLabels, AutoLabelItem, Rect } from "../../components/labels";
import { fadeIn } from "../../components/parts";
import { ZoomCallout } from "../../components/ZoomCallout";
import "../../components/chemistry/mhchem";
import {
  ATPChain,
  AminoAcid,
  CapillaryExchange,
  CapillaryExchangeProps,
  GlucoseBreakdown,
  HumanBody,
  HumanBodyProps,
  MonomerChain,
  RouteId,
  RouteState,
  SUBSTANCE,
  SmallMolecule,
  aminoAcidAnchors,
  atpAnchors,
  capillaryAnchors,
  glucoseProductAnchors,
  humanBodyLabelSpots,
  humanBodyObstacles,
  humanBodySoi,
  monomerChainAnchors,
} from "../../components/biology";
import { colors } from "../../components/theme";

// Cảnh thử component Sinh (HumanBody, ZoomCallout + CapillaryExchange, Biomolecule). Không phải video đăng.

const P: HumanBodyProps = { left: 140, top: 140, height: 880 };
const BOX = { left: 1040, top: 190, width: 780, height: 560 };
const CAP: CapillaryExchangeProps = { ...BOX, site: "tissue" };
const A = humanBodyLabelSpots(P);
const SOI = humanBodySoi(P);
const CA = capillaryAnchors(CAP);
const PH = ["b05", "b06"];

const organLabels = (o: number): AutoLabelItem[] => [
  { id: "phoi", ...A.lungs, text: "Phổi", opacity: o, phases: PH },
  { id: "tim", ...A.heart, text: "Tim", opacity: o, phases: PH },
  { id: "daday", ...A.stomach, text: "Dạ dày", opacity: o, phases: PH },
  { id: "ruot", ...A.intestine, text: "Ruột", opacity: o, phases: PH },
  { id: "mo", ...A.tissue, text: "Mô cơ", opacity: o, phases: PH },
  { id: "thucan", ...A.food, text: "Thức ăn", opacity: o, phases: PH },
  { id: "khi", ...A.air, text: "Không khí", opacity: o, phases: PH },
];

const Scene4: React.FC<{ routes: Partial<Record<RouteId, RouteState>>; zoom: number; flows: CapillaryExchangeProps["flows"] }> = ({ routes, zoom, flows }) => {
  const capLabels: AutoLabelItem[] = [
    { id: "mao", ...CA.vessel, text: "Mao mạch", opacity: zoom >= 1 ? 1 : 0, phases: ["b06"] },
    { id: "tb", ...CA.site, text: "Tế bào cơ", opacity: zoom >= 1 ? 1 : 0, phases: ["b06"] },
  ];
  const boxRect: Rect = { x: BOX.left + 10, y: BOX.top + 10, w: BOX.width - 20, h: BOX.height - 20 };
  return (
    <>
      <HumanBody {...P} routes={routes} />
      <AutoLabels items={organLabels(1)} obstacles={humanBodyObstacles(P)} />
      <ZoomCallout source={{ ...SOI.tissue, r: SOI.r }} box={BOX} progress={zoom}>
        <CapillaryExchange {...CAP} flows={flows} />
      </ZoomCallout>
      <AutoLabels items={capLabels} bounds={boxRect} />
    </>
  );
};

export const Beat05: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  const st = (from: number, to?: number): RouteState | undefined =>
    fr < from ? undefined : to !== undefined && fr >= to ? { state: "done" } : { state: "active", draw: fadeIn(fr, from, 40) };
  return (
    <Scene4
      routes={{ food: st(L[1], L[2]), nutrient: st(L[2], L[3]), o2Air: st(L[3]) }}
      zoom={0}
      flows={{}}
    />
  );
};

export const Beat06: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  const done: RouteState = { state: "done" };
  const act = (from: number, d = 40): RouteState => ({ state: "active", draw: fadeIn(fr, from, d) });
  const zoom = fr < L[3] ? fadeIn(fr, L[1], 30) : 1 - fadeIn(fr, L[3], 15);
  const routes: Partial<Record<RouteId, RouteState>> = {
    food: done,
    nutrient: done,
    o2Air: fr < L[0] ? { state: "active" } : done,
    o2Blood: fr < L[0] ? undefined : fr < L[3] ? act(L[0]) : done,
    co2Blood: fr < L[3] ? undefined : fr < L[3] + 70 ? act(L[3] + 10) : done,
    co2Out: fr < L[3] + 70 ? undefined : act(L[3] + 70, 30),
  };
  const flows: CapillaryExchangeProps["flows"] =
    fr < L[2]
      ? { o2: act(L[1] + 25, 20), nutrient: act(L[1] + 35, 20) }
      : { o2: done, nutrient: done, co2: act(L[2], 20) };
  return <Scene4 routes={routes} zoom={zoom} flows={flows} />;
};

// ---------- Cảnh 5: glucose phân giải, ATP tách phosphate ----------
const GX = 520;
const GY = 560;
const ATP_X = 1080;
const ATP_Y = 430;

export const Beat07: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  const show = fadeIn(fr, L[0], 15);
  const brk = fadeIn(fr, L[1], 75);
  const rel = fadeIn(fr, L[2], 40);
  const prod = glucoseProductAnchors(GX, GY);
  const atp = atpAnchors(ATP_X, ATP_Y, 1, rel);
  const P0 = atpAnchors(ATP_X, ATP_Y, 1, 0).phosphates;
  const items: AutoLabelItem[] = [
    { id: "glu", x: GX, y: GY - 64, text: "Glucose $\\ce{C6H12O6}$", opacity: show * (1 - brk), prefer: ["n"] },
    { id: "co2", x: prod[0].x, y: prod[0].y - 30, text: "$\\ce{CO2}$", color: SUBSTANCE.co2, opacity: brk >= 1 ? 1 : 0, prefer: ["n", "ne"] },
    { id: "atp", ...atp.adenine, text: "ATP", opacity: show, prefer: ["n"] },
    { id: "nl", x: (P0[1].x + P0[2].x) / 2, y: P0[1].y - 50, text: "năng lượng", color: "#A16207", opacity: rel > 0.2 ? 1 : 0, prefer: ["n"] },
  ];
  const obst: Rect[] = [
    { x: GX - 80, y: GY - 80, w: 160, h: 160 },
    ...(brk > 0.55 ? prod.map((q) => ({ x: q.x - 100, y: q.y - 32, w: 200, h: 64 })) : []),
    { x: ATP_X - 10, y: ATP_Y - 50, w: atp.width + 20, h: 100 },
  ];
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <GlucoseBreakdown x={GX} y={GY} progress={brk} opacity={show} />
        <ATPChain x={ATP_X} y={ATP_Y} release={rel} opacity={show} />
      </svg>
      <AutoLabels items={items} obstacles={obst} />
    </>
  );
};

// ---------- Cảnh 6: amino acid, chuỗi đơn phân, phân tử nhỏ ----------
export const Beat08: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  const show = fadeIn(fr, L[0], 15);
  const split = fadeIn(fr, L[1], 50);
  const aa = aminoAcidAnchors(420, 430);
  const g = monomerChainAnchors(900, 330, 6, 56, split);
  const p = monomerChainAnchors(900, 580, 6, 56, split);
  const items: AutoLabelItem[] = [
    { id: "aa", x: aa.r.x, y: aa.r.y + 36, text: "Amino acid", opacity: show, prefer: ["s"] },
    { id: "tb", ...g[0], text: "Tinh bột", opacity: show, prefer: ["n", "w"] },
    { id: "pr", ...p[0], text: "Protein", opacity: show, prefer: ["s", "w"] },
    { id: "o2", x: 560, y: 880, text: "$\\ce{O2}$", color: SUBSTANCE.o2, opacity: show, prefer: ["s"] },
    { id: "co2", x: 900, y: 880, text: "$\\ce{CO2}$", color: SUBSTANCE.co2, opacity: show, prefer: ["s"] },
    { id: "h2o", x: 1240, y: 880, text: "$\\ce{H2O}$", color: colors.text, opacity: show, prefer: ["s"] },
  ];
  const obst: Rect[] = [
    { x: 260, y: 300, w: 360, h: 280 },
    { x: 880, y: 290, w: 900, h: 80 },
    { x: 880, y: 540, w: 900, h: 80 },
    { x: 480, y: 830, w: 880, h: 90 },
  ];
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g opacity={show}>
          <AminoAcid x={420} y={430} />
          <MonomerChain x={900} y={330} kind="glucose" unit={56} split={split} />
          <MonomerChain x={900} y={580} kind="amino" unit={56} split={split} />
          <SmallMolecule kind="O2" x={560} y={850} />
          <SmallMolecule kind="CO2" x={900} y={850} />
          <SmallMolecule kind="H2O" x={1240} y={850} />
        </g>
      </svg>
      <AutoLabels items={items} obstacles={obst} />
    </>
  );
};

// ---------- Cảnh 7: trao đổi ở phổi và ở ruột ----------
const LUNG: CapillaryExchangeProps = { left: 110, top: 230, width: 800, height: 600, site: "lung" };
const GUT: CapillaryExchangeProps = { left: 1010, top: 230, width: 800, height: 600, site: "intestine" };

export const Beat09: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  const act = { state: "active" as const, draw: fadeIn(fr, L[0] + 10, 25) };
  const la = capillaryAnchors(LUNG);
  const ga = capillaryAnchors(GUT);
  const items: AutoLabelItem[] = [
    { id: "pn", ...la.site, text: "Phế nang", phases: ["l"] },
    { id: "mm1", ...la.vessel, text: "Mao mạch", phases: ["l"] },
    { id: "lr", ...ga.site, text: "Lòng ruột", phases: ["g"] },
    { id: "mm2", ...ga.vessel, text: "Mao mạch", phases: ["g"] },
  ];
  return (
    <>
      <CapillaryExchange {...LUNG} flows={{ o2: act, co2: act }} />
      <CapillaryExchange {...GUT} flows={{ nutrient: act }} />
      <AutoLabels items={items} />
    </>
  );
};
