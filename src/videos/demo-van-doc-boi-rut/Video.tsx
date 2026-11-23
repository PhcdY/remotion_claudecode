import React from "react";
import { AbsoluteFill, Composition, useCurrentFrame } from "remotion";
import type { BeatProps } from "../../components/BeatShell";
import { ramp } from "../../components/BeatShell";
import { ExplainerVideo, explainerMetadata } from "../../components/ExplainerVideo";
import type { ExplainerProps } from "../../components/ExplainerVideo";
import { MathText } from "../../components/MathText";
import { colors, fontText, MIN_FONT } from "../../components/theme";
import { FPS } from "../../components/timeline";
import { BrushLine, MarginNote } from "../../components/van/MarginNote";
import { QuoteMarker } from "../../components/van/QuoteMarker";
import { fontQuote, useVanQuoteFont } from "../../components/van/useVanQuoteFont";
import { Child, Drift, Leaves, MistWipe, Mother, RoadView, SideWorld, Tree, WideWorld, childRest, holdPoint, lerpPt, motherRest } from "./scene";
import script from "./script.json";

// Demo cách "đọc, bôi, rút" và hình kể chuyện của gói Văn (mục 1, 3.4). Không phải video đăng.

/** Mỗi màu một nghĩa suốt video: vệt bôi nhạt + mực đậm cùng sắc. */
const TU_SU = { mark: "#FBD58B", ink: "#8A5407" };
const MIEU_TA = { mark: "#A6E6D2", ink: "#08654F" };
const BIEU_CAM = { mark: "#F8C4D8", ink: "#A02A62" };

const Q1 = "Mẹ tôi âu yếm nắm tay tôi dẫn đi";
const Q2 = "trên con đường làng dài và hẹp";
const Q3 = "lần này tự nhiên tôi thấy lạ";

const useCues = ({ L, cue }: BeatProps) => (line: number, phrase: string) => cue?.(line, phrase) ?? L[line];

const WALK = 6.4;
const walked = (f: number, start: number, stop = Infinity) => Math.max(0, Math.min(f, stop) - start) * WALK;

// ---------- Cảnh 1: toàn cảnh, đọc câu gốc, câu hỏi đoán ----------

const B01: React.FC<BeatProps> = (props) => {
  const { L, E } = props;
  const f = useCurrentFrame();
  const g = 900;
  const s = 0.56;
  const mx = 900;
  const cx = mx + 190 * s;
  const hold = holdPoint(mx, g, s);
  const ask = E[4];
  const pulse = (i: number) => {
    const a = ask + 3 + i * 16;
    return ramp(f, a, a + 7) * (1 - ramp(f, a + 13, a + 19));
  };
  const opt = (i: number) => 0.8 + 0.2 * pulse(i);
  return (
    <AbsoluteFill>
      <WideWorld push={ramp(f, 0, L[4])}>
        <g data-mark="hai-me-con">
          <Mother x={mx} g={g} phase={0} amt={0} hand={hold} s={s} />
          <Child x={cx} g={g} phase={0} amt={0} hand={hold} s={s} />
        </g>
      </WideWorld>
      <QuoteMarker
        top={150}
        lines={[
          { text: Q1, from: L[1], to: L[3] - 6, slot: 0 },
          { text: Q2, from: L[2], to: L[3] - 6, slot: 1 },
          { text: Q3, from: L[3], to: L[4] - 4, slot: 0 },
        ]}
      />
      <div style={{ opacity: opt(0) }}>
        <MarginNote from={[hold[0], hold[1]]} to={[972, 520]} side="left" title="nắm tay tôi dẫn đi" ink={colors.text} at={L[4]} bend={10} titleSize={46} />
      </div>
      <div style={{ opacity: opt(1) }}>
        <MarginNote from={[1236, 900]} to={[1370, 980]} title="dài và hẹp" ink={colors.text} at={L[4] + 7} bend={-16} titleSize={46} />
      </div>
      <div style={{ opacity: opt(2) }}>
        <MarginNote from={[cx + 16, g - 330 * s]} to={[1120, 640]} title="tự nhiên tôi thấy lạ" ink={colors.text} at={L[4] + 14} bend={-16} titleSize={46} />
      </div>
      <MistWipe />
    </AbsoluteFill>
  );
};

// ---------- Cảnh 2: đi ngang, tự sự ----------

const B02: React.FC<BeatProps> = (props) => {
  const { C = props.L } = props;
  const at = useCues(props);
  const f = useCurrentFrame();
  const clasp = ramp(f, at(1, "nắm lấy"), at(1, "nắm lấy") + 18);
  const start = at(1, "cùng bước");
  const moving = ramp(f, start, start + 14);
  const scroll = walked(f, start);
  const phase = scroll / 34;
  const g = 925;
  const mx = 650;
  const cx = mx + 190;
  const hold = holdPoint(mx, g);
  const mHand = lerpPt(motherRest(mx, g), hold, clasp);
  const cHand = lerpPt(childRest(cx, g), hold, clasp);
  const prints = Array.from({ length: 34 }, (_, i) => i * 58).filter((d) => d < scroll);
  return (
    <AbsoluteFill>
      <SideWorld scroll={scroll}>
        {prints.map((d, i) => {
          const x = mx - 44 + d - scroll;
          if (x < -30) return null;
          return <ellipse key={d} cx={x} cy={i % 2 ? 908 : 934} rx={17} ry={6} fill="#B89F73" opacity={Math.max(0.2, 0.72 - (scroll - d) / 1300)} />;
        })}
        <g data-mark="hai-me-con">
          <Mother x={mx} g={g} phase={phase} amt={moving} hand={mHand} />
          <Child x={cx} g={g} phase={phase} amt={moving} hand={cHand} />
        </g>
      </SideWorld>
      <QuoteMarker top={136} lines={[{ text: Q1, from: 0, to: C[3] - 8, marks: [{ phrase: "nắm tay tôi dẫn đi", color: TU_SU.mark, at: C[0] }] }]} />
      <MarginNote from={[hold[0], hold[1]]} to={[985, 440]} title="Tự sự" sub="kể việc nối tiếp việc" ink={TU_SU.ink} at={C[3]} bend={-34} />
      <MistWipe />
    </AbsoluteFill>
  );
};

// ---------- Cảnh 3: nhìn dọc đường, miêu tả ----------

const B03: React.FC<BeatProps> = (props) => {
  const { C = props.L } = props;
  const f = useCurrentFrame();
  const dai = ramp(f, C[1], C[1] + 36);
  const hep = ramp(f, C[2], C[2] + 22);
  return (
    <AbsoluteFill>
      <RoadView dai={dai} hep={hep} freezeAt={C[0]} edge={MIEU_TA.ink} />
      <QuoteMarker
        top={136}
        lines={[{
          text: Q2,
          from: 0,
          to: C[3] - 8,
          marks: [
            { phrase: "con đường làng dài", color: MIEU_TA.mark, at: C[1] },
            { phrase: "và hẹp", color: MIEU_TA.mark, at: C[2] },
          ],
        }]}
      />
      <MarginNote from={[1180, 830]} to={[1420, 640]} title="Miêu tả" sub="tả dáng vẻ của cảnh" ink={MIEU_TA.ink} at={C[3]} bend={-34} />
      <MistWipe />
    </AbsoluteFill>
  );
};

// ---------- Cảnh 4: đứa trẻ khựng lại, biểu cảm ----------

const B04: React.FC<BeatProps> = (props) => {
  const { C = props.L } = props;
  const at = useCues(props);
  const f = useCurrentFrame();
  const stop = at(1, "khựng lại");
  const moving = 1 - ramp(f, stop - 4, stop + 10);
  const scroll = walked(f, 0, stop + 4);
  const phase = scroll / 34;
  const grade = ramp(f, stop, stop + 42);
  const g = 925;
  const mx = 650;
  const cx = mx + 190;
  const hold = holdPoint(mx, g);
  const chest: [number, number] = [cx + 4, g - 214];
  return (
    <AbsoluteFill>
      <SideWorld scroll={scroll} grade={grade}>
        <g data-mark="hai-me-con">
          <Mother x={mx} g={g} phase={phase} amt={moving} hand={hold} />
          <Child x={cx} g={g} phase={phase} amt={moving} hand={hold} lean={-4 * grade} />
        </g>
        {grade > 0
          ? [0, 1, 2].map((i) => {
              const t = ((f - stop + i * 26) % 78) / 78;
              if (f < stop + i * 4) return null;
              return <circle key={i} cx={chest[0]} cy={chest[1]} r={34 + t * 250} fill="none" stroke={BIEU_CAM.ink} strokeWidth={4} opacity={(1 - t) * 0.5 * grade} />;
            })
          : null}
      </SideWorld>
      <QuoteMarker top={136} lines={[{ text: Q3, from: 0, to: C[2] - 8, marks: [{ phrase: "tự nhiên tôi thấy lạ", color: BIEU_CAM.mark, at: C[0] }] }]} />
      <MarginNote from={[cx + 4, g - 346]} to={[1190, 410]} title="Biểu cảm" sub="nói cảm xúc trong lòng" ink={BIEU_CAM.ink} at={C[2]} bend={-50} />
      <MistWipe />
    </AbsoluteFill>
  );
};

// ---------- Cảnh 5: thử nhanh ----------

const choices = [
  { name: "Tự sự", ...TU_SU },
  { name: "Miêu tả", ...MIEU_TA },
  { name: "Biểu cảm", ...BIEU_CAM },
];

const B05: React.FC<BeatProps> = (props) => {
  const { L, E, C = props.L } = props;
  const f = useCurrentFrame();
  const answer = C[1];
  const wind = ramp(f, L[1], L[1] + 40);
  const g = 900;
  const s = 0.56;
  const mx = 900;
  const cx = mx + 190 * s;
  const hold = holdPoint(mx, g, s);
  const appear = ramp(f, L[0] + 18, L[0] + 32);
  return (
    <AbsoluteFill>
      <WideWorld push={1} boost={wind * 0.45}>
        <g data-mark="hai-me-con">
          <Mother x={mx} g={g} phase={0} amt={0} hand={hold} s={s} />
          <Child x={cx} g={g} phase={0} amt={0} hand={hold} s={s} />
        </g>
      </WideWorld>
      {wind > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <Leaves n={26} seed="gio" windAt={L[1]} />
          <g opacity={0.55}><Drift boost={wind * 0.5} y={600} /></g>
        </svg>
      ) : null}
      <QuoteMarker center left={0} width={1920} top={150} fontSize={66}
        lines={[{ text: "sương thu và gió lạnh", from: 0, marks: [{ phrase: "sương thu và gió lạnh", color: MIEU_TA.mark, at: answer }] }]} />
      <div style={{ position: "absolute", left: 0, width: 1920, top: 268, display: "flex", justifyContent: "center", gap: 92, opacity: appear }}>
        {choices.map((c, i) => {
          const a = E[0] + 2 + i * 15;
          const glow = f < answer ? ramp(f, a, a + 6) * (1 - ramp(f, a + 11, a + 17)) : 0;
          const right = c.name === "Miêu tả";
          const done = ramp(f, answer, answer + 10);
          const stroke = right ? ramp(f, answer + 2, answer + 16) : 0;
          return (
            <div key={c.name} data-text="label" style={{
              position: "relative", fontFamily: fontQuote, fontWeight: 600, fontSize: 48, color: c.ink,
              opacity: right ? 0.72 + 0.28 * Math.max(glow, done) : (0.72 + 0.28 * glow) * (1 - 0.62 * done),
              scale: 1 + glow * 0.07 + (right ? done * 0.1 : 0),
              textShadow: "0 0 16px rgba(255,255,255,.95), 0 0 5px rgba(255,255,255,.85)",
            }}>
              <MathText text={c.name} />
              <BrushLine ink={c.ink} progress={stroke} />
            </div>
          );
        })}
      </div>
      <MistWipe />
    </AbsoluteFill>
  );
};

// ---------- Cảnh 6: chốt ba dấu hiệu ----------

const Vignette: React.FC<{ id: string; x: number; tint: string; o: number; children: React.ReactNode }> = ({ id, x, tint, o, children }) => (
  <g opacity={o} transform={`translate(${x} 470) scale(${0.92 + 0.08 * o})`}>
    <clipPath id={id}><circle r={230} /></clipPath>
    <circle r={230} fill={tint} />
    <g clipPath={`url(#${id})`}>{children}</g>
    <circle r={230} fill="none" stroke="#FFFFFF" strokeWidth={8} />
  </g>
);

const B06: React.FC<BeatProps> = (props) => {
  const { L } = props;
  const at = useCues(props);
  const f = useCurrentFrame();
  const shown = (i: number) => ramp(f, L[0] + i * 14, L[0] + i * 14 + 18);
  const names = [
    { x: 400, name: "Tự sự", verb: "kể", when: at(1, "tự sự"), ...TU_SU },
    { x: 960, name: "Miêu tả", verb: "tả", when: at(1, "miêu tả"), ...MIEU_TA },
    { x: 1520, name: "Biểu cảm", verb: "bộc lộ", when: at(1, "biểu cảm"), ...BIEU_CAM },
  ];
  const sway = Math.sin(f / 18);
  const ring = (f % 54) / 54;
  return (
    <AbsoluteFill style={{ background: "#EEF3F1" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Drift y={250} />
        <Vignette id="v-a" x={400} tint="#FBEBCB" o={shown(0)}>
          <g transform={`translate(0 ${sway * 3})`}>
            <path d="M -250 -130 Q -120 -60 -18 -2" fill="none" stroke="#8D5B4C" strokeWidth={62} strokeLinecap="round" />
            <path d="M 250 120 Q 120 70 22 8" fill="none" stroke="#35536F" strokeWidth={48} strokeLinecap="round" />
            <circle cx={18} cy={8} r={38} fill="#DFA67E" />
            <circle cx={-12} cy={-4} r={46} fill="#E8B48C" />
            {[-26, -10, 6, 22].map((fx) => (
              <path key={fx} d={`M ${fx} -30 q 7 22 1 44`} fill="none" stroke="#C98F68" strokeWidth={4} strokeLinecap="round" />
            ))}
          </g>
        </Vignette>
        <Vignette id="v-b" x={960} tint="#DDF2EA" o={shown(1)}>
          <rect x={-240} y={-240} width={480} height={190} fill="#D5E2E6" />
          <rect x={-240} y={-54} width={480} height={300} fill="#A9BC96" />
          <path d="M -130 240 L -8 -54 L 8 -54 L 130 240 Z" fill="#E0CCA3" />
          <path d="M -130 240 L -8 -54 M 130 240 L 8 -54" stroke={MIEU_TA.ink} strokeWidth={6} strokeLinecap="round" />
          <Tree x={-132} y={30} s={0.42} />
          <Tree x={136} y={34} s={0.42} tone={1} />
        </Vignette>
        <Vignette id="v-c" x={1520} tint="#FBE3EC" o={shown(2)}>
          {[0, 0.33, 0.66].map((d) => {
            const t = (ring + d) % 1;
            return <circle key={d} cy={8} r={30 + t * 190} fill="none" stroke={BIEU_CAM.ink} strokeWidth={4} opacity={(1 - t) * 0.55} />;
          })}
          <Child x={0} g={150} phase={0} amt={0} hand={childRest(0, 150, 0.8)} s={0.8} />
        </Vignette>
      </svg>
      {names.map((n) => {
        const on = ramp(f, n.when, n.when + 10);
        const stroke = ramp(f, n.when + 2, n.when + 16);
        return (
          <div key={n.name} style={{ position: "absolute", left: n.x - 260, width: 520, top: 736, textAlign: "center", opacity: 0.3 + 0.7 * on }}>
            <div style={{ display: "inline-block" }}>
              <div data-text="label" style={{ fontFamily: fontQuote, fontWeight: 600, fontSize: 66, lineHeight: 1.14, color: n.ink }}><MathText text={n.name} /></div>
              <BrushLine ink={n.ink} progress={stroke} width={3.6} />
            </div>
            <div style={{ marginTop: 8 }}>
              <span data-text="label" style={{ fontFamily: fontText, fontWeight: 600, fontSize: MIN_FONT.label + 6, color: colors.text }}><MathText text={n.verb} /></span>
            </div>
          </div>
        );
      })}
      <MistWipe />
    </AbsoluteFill>
  );
};

const beats = { b01: B01, b02: B02, b03: B03, b04: B04, b05: B05, b06: B06 };

const Video: React.FC<ExplainerProps> = ({ timeline, draft }) => {
  useVanQuoteFont();
  return <ExplainerVideo script={script} timeline={timeline} beats={beats} draft={draft} />;
};

export const DemoVanDocBoiRut: React.FC = () => (
  <Composition id="demo-van-doc-boi-rut" component={Video} durationInFrames={2000} width={1920} height={1080} fps={FPS}
    calculateMetadata={explainerMetadata(script)} defaultProps={{ timeline: null, draft: true }} />
);
