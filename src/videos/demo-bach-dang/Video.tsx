import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, Composition, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { BrandFrame } from "../../components/BrandFrame";
import { LayoutProbe } from "../../components/LayoutProbe";
import { MathText } from "../../components/MathText";
import { fontSize } from "../../components/theme";
import { buildTimeline, findPhrase, FPS, TLine } from "../../components/timeline";
import script from "./script.json";

const WIDTH = 1920;
const HEIGHT = 1080;
const RIVER = "M-230 447C45 407 235 472 428 501C634 532 733 452 911 431C1089 409 1193 462 1318 491C1520 538 1651 499 2150 440";
const NORTH_BRANCH = "M96-160C146-63 218 13 300 71C425 148 408 288 527 339C592 365 654 406 685 476";
const SOUTH_BRANCH = "M150 1120C300 980 336 775 462 707C547 657 629 641 696 524";
const BANK = "#BEBB89";
const WATER = "#AAD5DF";
const INK = "#203946";
const NGO = "#9E3028";
const HAN = "#225A81";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.inOut(Easing.cubic);
type Point = { x: number; y: number };
type Course = readonly [Point, Point, Point, Point];
type DemoProps = { draft: boolean; lines: TLine[] };
const point = (x: number, y: number): Point => ({ x, y });

// Positions describe the historical sequence on a schematic river, not surveyed locations.
const hanApproach: Course = [point(1840, 520), point(1750, 525), point(1610, 506), point(1470, 505)];
const lightApproach: Course = [point(710, 477), point(920, 441), point(1130, 454), point(1330, 495)];
const lightReturn: Course = [point(1330, 495), point(1100, 435), point(840, 433), point(630, 503)];
const hanPursuit: Course = [point(1470, 505), point(1280, 505), point(1120, 443), point(925, 472)];
const northCounter: Course = [point(447, 284), point(484, 342), point(660, 348), point(867, 423)];
const southCounter: Course = [point(389, 781), point(483, 679), point(698, 640), point(870, 532)];
const hanRetreat: Course = [point(925, 472), point(1050, 458), point(1106, 480), point(1183, 497)];

const courseAt = ([a, b, c, d]: Course, t: number) => {
  const u = 1 - t;
  const position = (p: keyof Point) => u ** 3 * a[p] + 3 * u ** 2 * t * b[p] + 3 * u * t ** 2 * c[p] + t ** 3 * d[p];
  const tangent = (p: keyof Point) => u ** 2 * (b[p] - a[p]) + 2 * u * t * (c[p] - b[p]) + t ** 2 * (d[p] - c[p]);
  return { x: position("x"), y: position("y"), angle: Math.atan2(tangent("y"), tangent("x")) * 180 / Math.PI };
};

const fade = (frame: number, start: number, length = 13) => interpolate(frame, [start, start + length], [0, 1], CLAMP);
const labelFor = (frame: number, start: number, seconds: number) =>
  fade(frame, start, 7) * (1 - fade(frame, start + Math.round(seconds * FPS) - 9, 9));
const travel = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, Math.max(start + 1, end)], [0, 1], { ...CLAMP, easing: EASE });

const Boat: React.FC<{ large: boolean; color: string }> = ({ large, color }) => (
  <g transform={large ? "scale(1.24)" : undefined}>
    <path d="M-30-8Q-52-10-65-19M-30 8Q-52 10-65 19" fill="none" stroke="#FFF" strokeWidth="2.5" opacity=".9" />
    <path d="M-30-13H13Q24-12 38 0Q24 12 13 13H-30Q-35 0-30-13Z" fill="#715037" stroke="#FFF8E7" strokeWidth="2.3" />
    <path d="M-25-8H17Q23-7 28 0Q23 7 17 8H-25Z" fill="#D3A76D" />
    <path d="M-7-14Q5-12 5 0Q5 12-7 14L-2 0Z" fill={color} stroke="#FAE9CE" strokeWidth="1.4" />
    {large && <path d="M11-9Q20-7 20 0Q20 7 11 9L15 0Z" fill={color} stroke="#FAE9CE" strokeWidth="1.4" />}
  </g>
);

const Fleet: React.FC<{
  course: Course; progress: number; large?: boolean; color: string; opacity: number; count: 2 | 3;
  previous?: Course; turn?: number;
}> = ({ course, progress, large = false, color, opacity, count, previous, turn = 1 }) => {
  const lead = courseAt(course, progress);
  const before = previous ? courseAt(previous, 1).angle : lead.angle;
  const angle = before + ((lead.angle - before + 540) % 360 - 180) * turn;
  const radians = angle * Math.PI / 180;
  return (
    <g opacity={opacity}>
      {Array.from({ length: count }, (_, index) => {
        const trailing = index * (large ? 82 : 60);
        const across = index === 0 ? 0 : index % 2 === 0 ? 34 : -34;
        const x = lead.x - trailing * Math.cos(radians) - across * Math.sin(radians);
        const y = lead.y - trailing * Math.sin(radians) + across * Math.cos(radians);
        return (
          <g key={index} transform={`translate(${x} ${y}) rotate(${angle})`}>
            <Boat large={large} color={color} />
          </g>
        );
      })}
    </g>
  );
};

const AnchorLabel: React.FC<{ at: Point; name: string; color?: string; opacity?: number }> = ({ at, name, color = INK, opacity = 1 }) => (
  <div data-text="label" style={{
    position: "absolute", left: at.x, top: at.y, translate: "-50% -50%", opacity,
    color, fontWeight: 800, fontSize: fontSize.label, whiteSpace: "nowrap", lineHeight: 1.15,
    textShadow: "0 0 4px #FFFBED, 0 0 12px #FFFBED, 0 0 18px #FFFBED",
  }}>
    <MathText text={name} />
  </div>
);

const TideInset: React.FC<{ tide: number; opacity: number; labelOpacity: number }> = ({ tide, opacity, labelOpacity }) => {
  const waterline = 70 + 73 * tide;
  return (
    <div style={{
      position: "absolute", right: 67, bottom: 87, width: 480, height: 239, opacity,
      borderRadius: 23, background: "#FFFBEE", boxShadow: "0 12px 40px #20394623", overflow: "hidden",
    }}>
      <svg width="480" height="181" viewBox="0 0 480 181" style={{ position: "absolute", bottom: 0 }}>
        <path d="M0 170Q150 160 238 171Q350 177 480 166V181H0Z" fill="#B79D70" />
        {[142, 211, 280, 349].map((x, i) => (
          <path key={x} d={`M${x} 173l${i % 2 ? 10 : -8} -68l8 -12l5 14l-4 66Z`} fill="#725337" stroke="#F7E6BB" strokeWidth="1.3" />
        ))}
        <path d={`M0 ${waterline} Q60 ${waterline - 8} 120 ${waterline}T240 ${waterline}T360 ${waterline}T480 ${waterline}V181H0Z`}
          fill="#68B4CE" />
        <path d={`M0 ${waterline} Q60 ${waterline - 8} 120 ${waterline}T240 ${waterline}T360 ${waterline}T480 ${waterline}`}
          fill="none" stroke="#3386A2" strokeWidth="3.5" />
      </svg>
      <div data-text="label" style={{ position: "absolute", left: 24, top: 14, color: INK, fontWeight: 800, fontSize: fontSize.label, lineHeight: 1.15, opacity: labelOpacity }}>
        <MathText text="Nước triều cao" />
      </div>
    </div>
  );
};

const Battle: React.FC<DemoProps> = ({ lines }) => {
  const frame = useCurrentFrame();
  if (lines.length !== 7) return null;
  const [intro, advance, intercept, pursue, tideLine, counter, retreat] = lines;
  const when = (line: TLine, phrase: string) => line.words[findPhrase(line.words, phrase)]?.f ?? line.startFrame;
  const tideDrop = when(tideLine, "nước rút");
  const tide = travel(frame, tideDrop, tideLine.endFrame - 4);
  const zoomIn = travel(frame, pursue.endFrame - 10, tideLine.startFrame + 22);
  const zoomOut = travel(frame, counter.startFrame - 10, counter.startFrame + 23);
  const close = zoomIn * (1 - zoomOut);
  const zoom = 1 + 0.37 * close;
  const camera = point(WIDTH / 2 + 250 * close, HEIGHT / 2 - 22 * close);
  const left = WIDTH / 2 - camera.x * zoom;
  const top = HEIGHT / 2 - camera.y * zoom;
  const screen = (x: number, y: number) => point(left + x * zoom, top + y * zoom);
  const stakeFocus = screen(1266, 517);
  const mouthLabel = when(intro, "sông Bạch Đằng");
  const revealMouth = labelFor(frame, mouthLabel, 2.2);
  const seaLabel = labelFor(frame, mouthLabel + 2.2 * FPS, 1.8);
  const tideInset = fade(frame, tideLine.startFrame + 6) * (1 - fade(frame, counter.startFrame - 4));
  const tideLabel = labelFor(frame, when(tideLine, "nước triều cao"), 1.8);
  const hanChase = when(pursue, "Lưu Hoằng Tháo");
  const hanCourse = frame >= retreat.startFrame ? hanRetreat : frame >= hanChase ? hanPursuit : hanApproach;
  const hanProgress = frame >= retreat.startFrame
    ? travel(frame, retreat.startFrame, when(retreat, "vướng cọc") + 10)
    : frame >= hanChase ? travel(frame, hanChase, tideLine.startFrame + 12)
    : travel(frame, advance.startFrame, advance.endFrame - 5);
  const lightCourse = frame >= pursue.startFrame ? lightReturn : lightApproach;
  const lightProgress = frame >= pursue.startFrame
    ? travel(frame, pursue.startFrame, pursue.endFrame - 7)
    : travel(frame, intercept.startFrame, intercept.endFrame - 5);
  const counterProgress = travel(frame, counter.startFrame, counter.endFrame - 6);
  const blocked = fade(frame, when(retreat, "vướng cọc") + 8);
  const conclusion = fade(frame, when(retreat, "đường tiến"));
  return (
    <BrandFrame>
      <AbsoluteFill data-layout="scene" style={{ overflow: "hidden", background: "#DDD8AD" }}>
        <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute" }}>
          <defs>
            <pattern id="bd-water" width="135" height="112" patternUnits="userSpaceOnUse">
              <path d="M20 26h22m50 35h17m-64 31h11" stroke="#FFF" opacity=".3" strokeWidth="2" strokeLinecap="round" />
            </pattern>
            <pattern id="bd-field" width="128" height="113" patternUnits="userSpaceOnUse">
              <path d="M14 21l9-13l9 13Zm77 42l11-16l11 16Zm-55 35l7-10l7 10Z" fill="#8E9A68" opacity=".25" />
            </pattern>
            <g id="bd-waterways">
              <path d={RIVER} fill="none" stroke="white" strokeWidth={370 - tide * 57} />
              <path d={NORTH_BRANCH} fill="none" stroke="white" strokeWidth={92 - tide * 12} />
              <path d={SOUTH_BRANCH} fill="none" stroke="white" strokeWidth={110 - tide * 13} />
              <path d="M1445 476C1570 349 1735 318 2090 218L2270 202V834L2100 815C1750 805 1570 665 1445 526Z" fill="white" />
            </g>
            <mask id="bd-river-mask"><use href="#bd-waterways" /></mask>
          </defs>
          <g transform={`translate(${left} ${top}) scale(${zoom})`}>
            <rect x="-200" y="-100" width="2450" height="1330" fill="#E9E5BF" />
            <rect x="-200" y="-100" width="2450" height="1330" fill="url(#bd-field)" />
            <path d={RIVER} fill="none" stroke={BANK} strokeWidth="386" />
            <path d={NORTH_BRANCH} fill="none" stroke={BANK} strokeWidth="107" />
            <path d={SOUTH_BRANCH} fill="none" stroke={BANK} strokeWidth="125" />
            <g mask="url(#bd-river-mask)">
              <rect x="-240" y="-120" width="2480" height="1330" fill={WATER} />
              <rect x="-240" y="-120" width="2480" height="1330" fill="url(#bd-water)" />
              <path d={RIVER} fill="none" stroke="#C6E8EA" strokeWidth="155" opacity=".6" />
            </g>
            <ellipse cx="1318" cy="495" rx="104" ry="161" fill="#E9AB50" fillOpacity=".17" stroke="#98521F"
              strokeWidth="3" strokeDasharray="8 9" opacity={revealMouth} />
            <g opacity={tide}>
              {[360, 407, 455, 502, 549, 598].map((y, i) => (
                <g key={y} transform={`translate(${1237 + i * 10} ${y})`}>
                  <ellipse cy="10" rx="15" ry="5" fill="#608B83" opacity=".66" />
                  <path d="M-5 10L-9-19L-1-30L6-19L5 10Z" fill="#795236" stroke="#F7E6BB" strokeWidth="2" />
                </g>
              ))}
            </g>
            <Fleet course={hanCourse} progress={hanProgress} large color={HAN} count={3} opacity={fade(frame, advance.startFrame)}
              previous={hanCourse === hanRetreat ? hanPursuit : undefined} turn={travel(frame, retreat.startFrame, retreat.startFrame + 18)} />
            <Fleet course={lightCourse} progress={lightProgress} color={NGO} count={2} opacity={fade(frame, intercept.startFrame) * (1 - fade(frame, counter.startFrame))}
              previous={lightCourse === lightReturn ? lightApproach : undefined} turn={travel(frame, pursue.startFrame, pursue.startFrame + 18)} />
            <Fleet course={northCounter} progress={counterProgress} color={NGO} count={2} opacity={fade(frame, counter.startFrame)} />
            <Fleet course={southCounter} progress={counterProgress} color={NGO} count={2} opacity={fade(frame, counter.startFrame + 7)} />
            <path d="M1216 471q21-14 37-9m-31 22q21-12 38-6m-37 21q22-12 38-6" fill="none" stroke="#FAF7E1"
              strokeWidth="4" strokeLinecap="round" opacity={blocked} />
          </g>
          <g opacity={tideInset} stroke="#785637" strokeWidth="2.5" fill="none">
            <ellipse cx={stakeFocus.x} cy={stakeFocus.y} rx="57" ry="118" strokeDasharray="7 8" />
            <path d={`M${stakeFocus.x + 46} ${stakeFocus.y + 85}L1334 782`} />
          </g>
        </svg>
        <AnchorLabel at={screen(1320, 288)} name="Cửa sông Bạch Đằng · 938" color="#774820" opacity={revealMouth} />
        <AnchorLabel at={point(1685, 680)} name="Ra biển" color="#366A77" opacity={seaLabel} />
        <AnchorLabel at={screen(1590, 621)} name="Lưu Hoằng Tháo · Nam Hán"
          color={HAN} opacity={labelFor(frame, when(advance, "Lưu Hoằng Tháo"), 2.3)} />
        <AnchorLabel at={screen(1010, 354)} name="Thuyền nhẹ · Ngô Quyền"
          color={NGO} opacity={labelFor(frame, when(intercept, "đội thuyền nhẹ"), 2.2)} />
        <AnchorLabel at={screen(1330, 346)} name="Bãi cọc" color="#784C2A"
          opacity={labelFor(frame, when(tideLine, "lộ ra"), 1.8)} />
        <TideInset tide={tide} opacity={tideInset} labelOpacity={tideLabel} />
        <div data-text="takeaway" style={{
          position: "absolute", left: "50%", bottom: 92, translate: "-50% 0", opacity: conclusion,
          color: INK, fontSize: fontSize.takeaway, fontWeight: 800, whiteSpace: "nowrap", lineHeight: 1.15,
          textShadow: "0 0 4px #FFFBEE, 0 0 16px #FFFBEE",
        }}>
          <MathText text="Triều rút, đường lui bị chặn" />
        </div>
        <div data-text="note" style={{ position: "absolute", left: 65, bottom: 57, fontSize: 22, color: "#555D51", opacity: labelFor(frame, 5, 2) }}>
          <MathText text="Sơ đồ diễn biến" />
        </div>
        {lines.map((line, i) => line.audioSrc && (
          <Sequence key={i} from={line.startFrame} durationInFrames={line.endFrame - line.startFrame} layout="none">
            <Audio src={line.audioSrc} />
          </Sequence>
        ))}
      </AbsoluteFill>
      <LayoutProbe />
    </BrandFrame>
  );
};

const metadata: CalculateMetadataFunction<DemoProps> = async ({ props }) => {
  const { beats } = await buildTimeline(script, script.slug, props.draft);
  const offset = beats[0].startFrame - 15;
  const lines = beats[0].lines.map((line) => ({
    ...line, startFrame: line.startFrame - offset, endFrame: line.endFrame - offset,
    words: line.words.map(({ w, f }) => ({ w, f: f - offset })),
  }));
  return { durationInFrames: lines[lines.length - 1].endFrame + 36, props: { ...props, lines } };
};

export const BachDangDemoComposition: React.FC = () => (
  <Composition id="demo-bach-dang" component={Battle} width={WIDTH} height={HEIGHT} fps={FPS}
    durationInFrames={1200} calculateMetadata={metadata} defaultProps={{ draft: true, lines: [] }} />
);
