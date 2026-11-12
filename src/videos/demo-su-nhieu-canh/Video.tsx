import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, Composition, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BrandFrame } from "../../components/BrandFrame";
import { LayoutProbe } from "../../components/LayoutProbe";
import { MathText } from "../../components/MathText";
import { buildTimeline, findPhrase, FPS, TLine } from "../../components/timeline";
import script from "./script.json";

const WIDTH = 1920;
const HEIGHT = 1080;
const INK = "#0E1046";
const ASSETS = "su-mau";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
const ramp = (f: number, start: number, length: number) =>
  interpolate(f, [start, start + length], [0, 1], { ...CLAMP, easing: ease });
const hold = (f: number, start: number, length: number) =>
  ramp(f, start, 9) * (1 - ramp(f, start + length - 10, 10));
const cue = (line: TLine, phrase: string) => line.words[findPhrase(line.words, phrase)]?.f ?? line.startFrame;
type SceneProps = { lines: TLine[] };
type Shot = { from: number; duration: number; lines: TLine[] };
type DemoProps = { draft: boolean; shots: Shot[] };

const Label: React.FC<{
  text: string; left: number; top: number; opacity?: number; size?: number; color?: string; note?: boolean;
}> = ({ text, left, top, opacity = 1, size = 38, color = INK, note = false }) => (
  <div data-text={note ? "note" : "label"} style={{
    position: "absolute", left, top, opacity, fontSize: size, fontWeight: note ? 400 : 750,
    color, lineHeight: 1.2, whiteSpace: "nowrap",
  }}>
    <MathText text={text} />
  </div>
);

const Portrait: React.FC<SceneProps> = ({ lines: [intro, quote] }) => {
  const frame = useCurrentFrame();
  const secondHalf = cue(quote, "và sự thực");
  const zoom = ramp(frame, 3, quote.endFrame);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(112deg,#F1E6D3,#FFFCF7 65%,#F5F7FE)" }}>
      <div style={{
        position: "absolute", left: 155, top: 127, width: 632, height: 813, overflow: "hidden",
        borderRadius: 7, boxShadow: "0 20px 50px #2A252831", background: "#CFBCA5",
      }}>
        <Img src={staticFile(`${ASSETS}/ho-chi-minh-1945.jpg`)} style={{
          position: "absolute", width: 1580, left: -434, top: -426, scale: 1 + 0.045 * zoom,
          transformOrigin: "48% 44%",
        }} />
      </div>
      <Label text="Hồ Chí Minh · 1945" left={916} top={378} size={56}
        opacity={ramp(frame, cue(intro, "chủ tịch Hồ Chí Minh"), 11) * (1 - ramp(frame, quote.startFrame - 19, 15))} />
      <Label text="Tuyên ngôn Độc lập · 2/9/1945" left={922} top={222}
        opacity={ramp(frame, quote.startFrame - 9, 16)} />
      <div style={{ position: "absolute", left: 923, top: 321, height: 350, width: 6,
        background: "#B38B50", opacity: ramp(frame, quote.startFrame, 14) }} />
      <div style={{
        position: "absolute", left: 959, top: 332, width: 840, fontSize: 60, fontWeight: 750,
        lineHeight: 1.32, color: INK,
      }}>
        <div data-text="label" style={{ opacity: ramp(frame, quote.startFrame, 14) * (1 - 0.48 * ramp(frame, secondHalf, 15)) }}>
          <MathText text="“Nước Việt Nam có quyền hưởng tự do và độc lập," />
        </div>
        <div data-text="label" style={{ marginTop: 27, opacity: ramp(frame, secondHalf, 16), color: "#43382C" }}>
          <MathText text="và sự thực đã thành một nước tự do và độc lập.”" />
        </div>
      </div>
      <Label text="Ảnh tư liệu · Trang sử mới" left={155} top={969} size={24} note color="#62574A" />
    </AbsoluteFill>
  );
};

const Diplomacy: React.FC<SceneProps> = ({ lines: [intro, role] }) => {
  const frame = useCurrentFrame();
  const name = cue(intro, "Nguyễn Thị Bình");
  const focus = ramp(frame, Math.max(intro.startFrame + 52, name - 28), 54);
  const highlight = ramp(frame, name - 3, 19);
  const roleHighlight = ramp(frame, cue(role, "chính phủ"), 32);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(125deg,#E8EEF7,#F8F7F2)" }}>
      <div style={{
        position: "absolute", left: 168 - 302 * focus, top: 274 - 10 * focus, width: 1560,
        height: 684.5, scale: 1 + 0.38 * focus, transformOrigin: "78% 44%",
        boxShadow: "0 24px 54px #1D30452A", borderRadius: 5,
      }}>
        <Img src={staticFile(`${ASSETS}/paris-1973.jpg`)} style={{ position: "absolute", width: "100%", height: "100%" }} />
        <div style={{ position: "absolute", inset: 0, width: "49%", background: "#EEF1F7", opacity: 0.64 * highlight }} />
        <div style={{
          position: "absolute", left: "57%", top: "40%", width: "40%", height: "27%",
          border: "3px solid #A3742B", background: "#E6BC511A", borderRadius: 13,
          opacity: highlight * (1 - 0.64 * roleHighlight),
        }} />
        <div style={{
          position: "absolute", left: "60%", top: "31%", width: `${36 * roleHighlight}%`,
          height: 3.5, background: "#A3742B", borderRadius: 3,
        }} />
      </div>
      <Label text="Hiệp định Paris · 27/1/1973" left={179} top={159} size={49}
        opacity={hold(frame, intro.startFrame + 1, 103)} />
    </AbsoluteFill>
  );
};

const House: React.FC<{ x: number; y: number; store?: boolean }> = ({ x, y, store }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="145" cy="219" rx="172" ry="55" fill="#32584A" opacity=".13" />
    <path d="M8 91L179 65L289 120V219L116 254L8 194Z" fill={store ? "#E8E5CD" : "#F3D8A7"} />
    <path d="M116 137L289 110V219L116 254Z" fill={store ? "#D0CBB1" : "#DDBD85"} />
    <path d="M-18 101L98-5L198 31L121 152Z" fill={store ? "#617B81" : "#B86949"} />
    <path d="M98-5L216 22L309 113L121 152Z" fill={store ? "#4D686F" : "#984632"} />
    <path d="M124 168L166 160V237L124 246Z" fill="#735846" />
    <path d="M216 160L255 152V185L216 193Z" fill="#53747D" stroke="#FBEDD3" strokeWidth="5" />
    <path d="M37 143L76 165V194L37 174Z" fill="#647B6D" stroke="#FBEDD3" strokeWidth="5" />
  </g>
);

const Sack: React.FC<{ x: number; y: number; opacity: number; color: string }> = ({ x, y, opacity, color }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <ellipse cy="35" rx="52" ry="15" fill="#315046" opacity=".18" />
    <path d="M-23-30Q-37-39-21-50H21Q36-42 23-30C51-7 57 27 37 39Q1 54-37 40C-59 26-52-6-23-30Z"
      fill={color} stroke="#785938" strokeWidth="3" />
    <path d="M-22-28Q0-19 23-29M-23 1Q-33 20-23 30" fill="none" stroke="#FFEFCE" strokeWidth="3" opacity=".72" />
  </g>
);

const Reform: React.FC<SceneProps> = ({ lines: [intro, distribution] }) => {
  const frame = useCurrentFrame();
  const harvest = cue(intro, "nhận khoán");
  const due = cue(distribution, "giao phần thóc");
  const retained = cue(distribution, "hưởng phần vượt khoán");
  return (
    <AbsoluteFill style={{ background: "linear-gradient(130deg,#F0F5DE,#DCEFD9 72%,#E9F4E8)" }}>
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute" }}>
        <defs>
          <clipPath id="su-rice">
            <path d="M496 488L1080 279L1464 468L872 681Z" />
          </clipPath>
        </defs>
        <path d="M238 749Q821 281 1553 466Q1679 507 1798 737" fill="none" stroke="#C1DAB1" strokeWidth="170" opacity=".5" />
        <path d="M475 486L1080 270L1486 468L870 701L476 520Z" fill="#7C8F59" />
        <path d="M496 488L1080 279L1464 468L872 681Z" fill="#8FCAB0" />
        <g clipPath="url(#su-rice)">
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d={`M${388 + i * 62} 690q90-188 400-390`} fill="none" stroke={i % 2 ? "#568A4C" : "#6AA258"}
              strokeWidth="17" strokeDasharray="10 9" strokeLinecap="round" />
          ))}
          <path d="M627 444L1018 638M790 379L1192 576M944 324L1340 519" fill="none" stroke="#C4DC8C" strokeWidth="9" />
        </g>
        <House x={138} y={584} />
        <House x={1470} y={582} store />
        {Array.from({ length: 6 }, (_, i) => {
          const grow = ramp(frame, harvest + i * 4, 20);
          const toHouse = i >= 4;
          const move = ramp(frame, (toHouse ? retained : due) + (i % 4) * 5, 45);
          const originX = 764 + i * 72;
          const destX = toHouse ? 488 + (i - 4) * 86 : 1408 + (i % 2) * 78;
          const destY = toHouse ? 851 : 877 - Math.floor(i / 2) * 66;
          return <Sack key={i} x={originX + (destX - originX) * move}
            y={694 + (1 - grow) * 32 + (destY - 694) * move - 92 * Math.sin(Math.PI * move)}
            opacity={grow} color={toHouse && move > 0.05 ? "#65A79C" : "#D6AD70"} />;
        })}
      </svg>
      <Label text="Khoán 10 · 1988" left={158} top={182} size={52} opacity={hold(frame, intro.startFrame, 79)} />
      <Label text="Hộ nhận khoán" left={148} top={884} opacity={hold(frame, harvest - 6, 64)} />
      <Label text="Giao theo khoán" left={1461} top={945} opacity={hold(frame, due + 21, 63)} />
      <Label text="Phần vượt khoán" left={450} top={940} color="#1D665A" opacity={hold(frame, retained + 20, 66)} />
    </AbsoluteFill>
  );
};

const Drum: React.FC<SceneProps> = ({ lines: [intro, close] }) => {
  const frame = useCurrentFrame();
  const zoom = ramp(frame, cue(close, "vành hoa văn") - 11, 47);
  const size = 764;
  const x = 171;
  const y = 153;
  const birdX = 0.56;
  const birdY = 0.165;
  const origin = { x: x + size * birdX, y: y + size * birdY };
  const lensSize = 545;
  const lensImageSize = 2450;
  const drum = staticFile(`${ASSETS}/ngoc-lu.gif`);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 32% 40%,#FFFDF4,#F2EBDD 90%)" }}>
      <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", overflow: "hidden", mixBlendMode: "multiply" }}>
        <Img src={drum} style={{ width: size, height: size }} />
      </div>
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", opacity: zoom }}>
        <circle cx={origin.x} cy={origin.y} r="67" fill="none" stroke="#BA832B" strokeWidth="4" />
        <path d={`M${origin.x + 73} ${origin.y + 1}Q995 ${origin.y + 1} 1125 383`}
          fill="none" stroke="#BA832B" strokeWidth="4" />
      </svg>
      <div style={{
        position: "absolute", left: 1146, top: 237, width: lensSize, height: lensSize, borderRadius: "50%",
        overflow: "hidden", border: "5px solid #BA832B", boxShadow: "0 12px 34px #69451A24",
        opacity: zoom, scale: 0.79 + 0.21 * zoom, background: "#FCF6E7",
      }}>
        <Img src={drum} style={{
          position: "absolute", width: lensImageSize, height: lensImageSize,
          left: lensSize / 2 - lensImageSize * birdX, top: lensSize / 2 - lensImageSize * birdY,
          mixBlendMode: "multiply",
        }} />
      </div>
      <Label text="Trống đồng Ngọc Lũ" left={1057} top={447} size={55}
        opacity={ramp(frame, intro.startFrame, 11) * (1 - ramp(frame, close.startFrame - 8, 20))} />
      <Label text="Hoa văn chim" left={1284} top={827} size={45} opacity={zoom} />
      <Label text="Ảnh hoa văn · Doremon360 · CC BY-SA 4.0" left={185} top={967} size={22} note color="#64553D" />
    </AbsoluteFill>
  );
};

const sceneComponents = [Portrait, Diplomacy, Reform, Drum];
const Reel: React.FC<DemoProps> = ({ shots }) => (
  <BrandFrame>
    <AbsoluteFill data-layout="scene">
      {shots.map((shot, i) => {
        const Scene = sceneComponents[i];
        return (
          <Sequence key={script.beats[i].id} name={script.beats[i].visual} from={shot.from} durationInFrames={shot.duration}>
            <Scene lines={shot.lines} />
            {shot.lines.map((line) => line.audioSrc && (
              <Sequence key={line.startFrame} from={line.startFrame} durationInFrames={line.endFrame - line.startFrame} layout="none">
                <Audio src={line.audioSrc} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
    </AbsoluteFill>
    <LayoutProbe />
  </BrandFrame>
);

const metadata: CalculateMetadataFunction<DemoProps> = async ({ props }) => {
  const { beats } = await buildTimeline(script, script.slug, props.draft);
  const offset = beats[0].startFrame - 8;
  const shots = beats.map((beat, i) => {
    const start = i === 0 ? offset : beat.startFrame - 5;
    const end = i + 1 < beats.length ? beats[i + 1].startFrame - 5 : beat.lines[beat.lines.length - 1].endFrame + 28;
    const lines = beat.lines.map((line) => ({
      ...line, startFrame: line.startFrame - start, endFrame: line.endFrame - start,
      words: line.words.map(({ w, f }) => ({ w, f: f - start })),
    }));
    return { from: start - offset, duration: end - start, lines };
  });
  const last = shots[shots.length - 1];
  return { durationInFrames: last.from + last.duration, props: { ...props, shots } };
};

export const HistoryReelComposition: React.FC = () => (
  <Composition id="demo-su-nhieu-canh" component={Reel} durationInFrames={1400} fps={FPS} width={WIDTH} height={HEIGHT}
    defaultProps={{ draft: true, shots: [] }} calculateMetadata={metadata} />
);
