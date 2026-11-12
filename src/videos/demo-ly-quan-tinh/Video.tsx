import React from "react";
import { AbsoluteFill, Composition, Easing, interpolate, useCurrentFrame } from "remotion";
import type { BeatProps } from "../../components/BeatShell";
import { ExplainerVideo, explainerMetadata } from "../../components/ExplainerVideo";
import type { ExplainerProps } from "../../components/ExplainerVideo";
import { MathText } from "../../components/MathText";
import { FPS } from "../../components/timeline";
import script from "./script.json";

const INK = "#153858";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) } as const;
const progress = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], clamp);
const mod = (n: number, range: number) => ((n % range) + range) % range;

const Wheel: React.FC<{ x: number; rotation: number }> = ({ x, rotation }) => (
  <g transform={`translate(${x} 768) rotate(${rotation})`}>
    <circle r="82" fill="#26374B" />
    <circle r="53" fill="#A5B9C9" stroke="#E5EEF4" strokeWidth="6" />
    <path d="M0-43V43M-43 0H43M-30-30L30 30M30-30L-30 30" stroke="#657D94" strokeWidth="7" />
    <circle r="17" fill="#E5EDF4" />
  </g>
);

const Rider: React.FC<{ angle: number; ghost: number }> = ({ angle, ghost }) => (
  <g>
    <path d="M1089 571L1069 622L1069 680M1094 575L1124 623L1126 680"
      fill="none" stroke="#353A54" strokeWidth="27" strokeLinecap="round" />
    <path d="M1059 680h35m22 0h37" stroke="#1C304C" strokeWidth="19" strokeLinecap="round" />
    <path d="M1090 578V422" stroke="#CD6D2C" strokeWidth="4" strokeDasharray="9 8" opacity={ghost} />
    <g transform={`rotate(${angle} 1090 574)`}>
      <path d="M1064 477Q1090 463 1117 477L1121 552Q1119 573 1090 587L1062 570Z"
        fill="#DB783C" stroke="#FCE6B8" strokeWidth="4" />
      <path d="M1110 493L1122 526L1163 545" fill="none" stroke="#DF9D71" strokeWidth="16" strokeLinecap="round" />
      <path d="M1075 491L1055 530L1067 554" fill="none" stroke="#D5966D" strokeWidth="14" strokeLinecap="round" />
      <path d="M1080 462V480H1102V462" fill="#EAB082" />
      <ellipse cx="1090" cy="432" rx="32" ry="38" fill="#EDB486" />
      <path d="M1060 432Q1049 404 1073 395Q1098 384 1117 404Q1108 416 1091 410L1079 425L1073 440Z" fill="#263446" />
      <path d="M1112 433l12 12l-10 4" fill="#EDB486" />
      <circle cx="1111" cy="431" r="3.5" fill="#253445" />
    </g>
    <path d="M1050 694h109" stroke="#F4B653" strokeWidth="6" opacity={ghost} strokeLinecap="round" />
  </g>
);

const Bus: React.FC<{ bend: number; ghost: number; wheel: number; flash: number }> = ({ bend, ghost, wheel, flash }) => (
  <g>
    <ellipse cx="953" cy="835" rx="707" ry="46" fill="#263C4A" opacity=".19" />
    <path d="M322 323H1370Q1450 323 1490 369L1574 480Q1611 524 1612 580V736H297V373Q297 330 322 323Z"
      fill="#3076A0" stroke="#17466C" strokeWidth="8" />
    <path d="M329 355H1375Q1422 355 1455 395L1538 506Q1563 538 1567 588H329Z"
      fill="#E6F2ED" />
    <path d="M330 357H1391Q1437 368 1469 413L1550 543H330Z" fill="#BCDFEA" opacity=".6" />
    <path d="M337 578H1573V690H337Z" fill="#D1DEDC" />
    <path d="M337 694H1588" stroke="#173D5F" strokeWidth="9" />
    <path d="M488 520V616M825 520V616" stroke="#899FAE" strokeWidth="17" />
    <path d="M420 566Q425 538 452 537H510V587H420Zm338 0Q763 538 790 537H848V587H758Z" fill="#657E91" />
    <path d="M1254 353V689M1400 426V689" stroke="#8EADBE" strokeWidth="9" />
    <path d="M591 356V580M891 356V579" stroke="#759DB4" strokeWidth="8" />
    <path d="M333 348H1366" stroke="#F1F8F8" strokeWidth="7" opacity=".74" />
    <Rider angle={bend} ghost={ghost} />
    <path d="M298 701H1614V772H300Z" fill="#2A6F9A" stroke="#17466C" strokeWidth="7" />
    <path d="M297 718H1611" stroke="#A7D2DD" strokeWidth="7" opacity=".56" />
    <path d="M1531 652h70v31h-70z" fill="#FFF0AF" />
    <path d="M300 626h25v62h-25z" fill="#A34D53" />
    <path d="M301 626h28v62h-28z" fill="#F37554" opacity={flash} />
    <Wheel x={521} rotation={wheel} />
    <Wheel x={1405} rotation={wheel} />
  </g>
);

const Inertia: React.FC<BeatProps> = ({ L, C }) => {
  const frame = useCurrentFrame();
  const brake = C?.[2] ?? L[2];
  const brakeLength = 28;
  const brakingFrames = Math.max(0, Math.min(brakeLength, frame - brake));
  const distance = 7.2 * (Math.min(frame, brake) + brakingFrames - brakingFrames ** 2 / (2 * brakeLength));
  const cruise = progress(frame, L[1], Math.max(1, brake - L[1] - 7));
  const zoom = 1 + 0.33 * cruise;
  const x = -98 * cruise;
  const y = -148 * cruise;
  const bend = 23 * progress(frame, brake + 3, 29);
  const ghost = progress(frame, L[3], 18) * (1 - progress(frame, L[4] + 12, 20));
  const brakeLabel = progress(frame, brake, 10) * (1 - progress(frame, L[3] - 20, 20));
  const context = progress(frame, 4, 14) * (1 - progress(frame, L[1] - 18, 19));
  const heelX = x + zoom * 1070;
  const heelY = y + zoom * 694;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#EAF6F6,#F4F8EF)" }}>
      <svg width="1920" height="1080" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="inertia-road" x2="0" y2="1">
            <stop stopColor="#A7B6BF" />
            <stop offset="1" stopColor="#BECAD1" />
          </linearGradient>
        </defs>
        <path d="M0 690Q450 618 948 687Q1500 727 1920 647V844H0Z" fill="#CEE2CE" />
        <g opacity=".53">
          {Array.from({ length: 8 }, (_, i) => {
            const px = mod(i * 288 - 0.32 * distance, 2304) - 140;
            const height = i % 3 * 31;
            return <path key={i} d={`M${px} 690V${557 - height}h95v133z`} fill={i % 2 ? "#D9E6DF" : "#D2E1DF"} />;
          })}
        </g>
        <path d="M0 823H1920V1080H0Z" fill="url(#inertia-road)" />
        <path d="M0 831H1920" stroke="#F6F7E5" strokeWidth="12" />
        {Array.from({ length: 9 }, (_, i) => {
          const px = mod(i * 245 - distance, 2205) - 180;
          return <path key={i} d={`M${px} 936h128`} stroke="#F5F3DB" strokeWidth="11" strokeLinecap="round" />;
        })}
        {Array.from({ length: 6 }, (_, i) => {
          const px = mod(i * 408 - 0.78 * distance, 2448) - 122;
          return <path key={i} d={`M${px} 792V591q0-15 15-15h30`} fill="none" stroke="#94AEB2" strokeWidth="8" />;
        })}
        <g transform={`translate(${x} ${y}) scale(${zoom})`}>
          <Bus bend={bend} ghost={ghost} wheel={distance / 82 * 180 / Math.PI} flash={progress(frame, brake, 8)} />
        </g>
        <path d={`M${heelX + 65} ${heelY - 10}l61-47`} stroke="#A76B25" strokeWidth="3" opacity={ghost} />
        <g opacity={context} stroke="#255477" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M1310 240H1575m-25-19l25 19l-25 19" />
        </g>
      </svg>
      <div data-text="label" style={{ position: "absolute", left: 1298, top: 174, opacity: context,
        fontSize: 40, fontWeight: 750, color: INK }}>
        <MathText text="Chiều xe chạy" />
      </div>
      <div data-text="label" style={{ position: "absolute", left: 129, top: 181, opacity: brakeLabel,
        fontSize: 51, fontWeight: 800, color: "#923C31" }}>
        <MathText text="Xe giảm tốc" />
      </div>
      <div data-text="label" style={{ position: "absolute", left: heelX + 142, top: heelY - 88, opacity: ghost,
        fontSize: 38, fontWeight: 800, lineHeight: 1.2, color: "#263240", background: "#FFFCF2",
        padding: "5px 15px", borderRadius: 11 }}>
        <MathText text="Bàn chân bám sàn" />
      </div>
    </AbsoluteFill>
  );
};

const beats = { b01: Inertia };
const Video: React.FC<ExplainerProps> = ({ timeline, draft }) => (
  <ExplainerVideo script={script} timeline={timeline} beats={beats} draft={draft} />
);

export const LyQuanTinhDemo: React.FC = () => (
  <Composition id="demo-ly-quan-tinh" component={Video} durationInFrames={900} width={1920} height={1080} fps={FPS}
    calculateMetadata={explainerMetadata(script)} defaultProps={{ timeline: null, draft: true }} />
);
