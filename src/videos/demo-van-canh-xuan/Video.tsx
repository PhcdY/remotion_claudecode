import React, { useEffect, useState } from "react";
import { AbsoluteFill, Composition, Easing, Img, interpolate, staticFile, useCurrentFrame, useDelayRender } from "remotion";
import type { BeatProps } from "../../components/BeatShell";
import { ExplainerVideo, explainerMetadata } from "../../components/ExplainerVideo";
import type { ExplainerProps } from "../../components/ExplainerVideo";
import { MathText } from "../../components/MathText";
import { FPS } from "../../components/timeline";
import script from "./script.json";

const verseFont = "Lora Canh Ngay Xuan";
let verseFontReady: Promise<FontFace> | undefined;

const loadVerseFont = () => {
  verseFontReady ??= new FontFace(verseFont, `url("${staticFile("demo-van-canh-xuan/lora.ttf")}")`, { weight: "600" })
    .load()
    .then((face) => {
      document.fonts.add(face);
      return face;
    })
    .catch((error: unknown) => {
      verseFontReady = undefined;
      throw error;
    });
  return verseFontReady;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) } as const;
const progress = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], clamp);

const flowers = [
  { x: 1305, y: 408, size: 1.05, tilt: -12 },
  { x: 1416, y: 332, size: 0.78, tilt: 14 },
  { x: 1551, y: 364, size: 1.35, tilt: 23 },
  { x: 1635, y: 239, size: 0.97, tilt: -25 },
  { x: 1694, y: 289, size: 0.72, tilt: 30 },
];

const Branch: React.FC<{ opacity: number; blooms: number; tilt: number; entrance: number }> = ({ opacity, blooms, tilt, entrance }) => (
  <svg width="1920" height="1080" style={{ position: "absolute", opacity }}>
    <defs>
      <linearGradient id="pear-wood" x1="0" x2="1">
        <stop stopColor="#66583C" />
        <stop offset="1" stopColor="#49372A" />
      </linearGradient>
      <radialGradient id="pear-petal">
        <stop stopColor="#FEF2D4" />
        <stop offset=".52" stopColor="#FFFDF1" />
        <stop offset="1" stopColor="#FCFCF2" />
      </radialGradient>
    </defs>
    <g transform={`translate(${entrance} 0) rotate(${tilt} 1900 565)`}>
      <path d="M1970 580C1841 553 1779 503 1691 453C1589 394 1522 401 1450 386C1388 373 1355 393 1276 419C1371 397 1403 383 1450 400C1536 426 1573 420 1669 477C1751 525 1805 577 1970 620Z"
        fill="url(#pear-wood)" />
      <path d="M1680 461C1645 404 1641 352 1635 239M1639 319Q1661 302 1694 289M1560 413Q1546 385 1551 364M1437 389Q1431 356 1416 332M1350 397Q1325 392 1305 408"
        stroke="#66513A" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M1699 464q-15-52-55-58q12 36 55 58m-247-68q-13-37-49-39q8 24 49 39m182-75q-34-35-56-22q18 18 56 22"
        fill="#849360" opacity=".86" />
      {flowers.map(({ x, y, size, tilt: angle }, i) => {
        const petal = interpolate(blooms, [i * 0.09, 0.55 + i * 0.09], [0, 1], clamp);
        return (
          <g key={x} opacity={petal} transform={`translate(${x} ${y}) rotate(${angle}) scale(${size * (0.7 + 0.3 * petal)})`}>
            {Array.from({ length: 5 }, (_, index) => (
              <path key={index} transform={`rotate(${index * 72})`} d="M0 2C-9-3-16-16-11-26C-8-36 7-39 13-28C20-16 11-4 0 2Z"
                fill="url(#pear-petal)" stroke="#E7DFCA" strokeWidth="1.5" />
            ))}
            <circle r="6" fill="#B09563" />
            <path d="M-9-3L-3-1M8-5L3-1M2 8L1 3" stroke="#C6A66D" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  </svg>
);

const SpringVerse: React.FC<BeatProps> = ({ L, E, cue }) => {
  const frame = useCurrentFrame();
  const intoMeadow = progress(frame, L[1], E[1] - L[1] + 8);
  const enterBranch = progress(frame, L[2], 38);
  const flowersIn = progress(frame, cue?.(2, "một vài bông hoa") ?? L[2], 37);
  const quoteExit = 1 - progress(frame, E[4], 12);
  const firstQuote = progress(frame, L[1], 14) * quoteExit;
  const secondQuote = progress(frame, L[2], 14) * quoteExit;
  const author = progress(frame, L[1], 12) * (1 - progress(frame, L[1] + 54, 12));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#E9F5F6" }}>
      <Img src={staticFile("demo-van-canh-xuan/dong-co.png")} style={{
        width: "100%", height: "100%", objectFit: "cover", scale: 1.018 + 0.064 * intoMeadow,
        transformOrigin: "37% 53%",
      }} />
      <Branch opacity={enterBranch} blooms={flowersIn} tilt={0.7 * Math.sin(frame / 53)} entrance={52 * (1 - enterBranch)} />
      {[firstQuote, secondQuote].map((opacity, i) => (
        <div key={i} data-text="label" style={{
          position: "absolute", left: 150 + i * 30, top: 226 + i * 74, opacity,
          fontFamily: verseFont, fontSize: 50, fontWeight: 600,
          lineHeight: 1.22, color: "#16362E", whiteSpace: "nowrap",
        }}>
          <MathText text={script.beats[0].lines[i + 1].text} />
        </div>
      ))}
      <div data-text="label" style={{ position: "absolute", left: 153, top: 155, fontSize: 36,
        opacity: author, color: "#334C43", fontWeight: 700 }}>
        <MathText text="Nguyễn Du · Truyện Kiều" />
      </div>
    </AbsoluteFill>
  );
};

const beats = { b01: SpringVerse };
const Video: React.FC<ExplainerProps> = ({ timeline, draft }) => {
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [fontHandle] = useState(() => delayRender("Đang nạp font Lora tiếng Việt cho câu thơ"));
  useEffect(() => {
    let active = true;
    loadVerseFont().then(
      () => {
        if (active) continueRender(fontHandle);
      },
      (error: Error) => {
        if (active) cancelRender(error);
      },
    );
    return () => {
      active = false;
      continueRender(fontHandle);
    };
  }, [cancelRender, continueRender, fontHandle]);
  return <ExplainerVideo script={script} timeline={timeline} beats={beats} draft={draft} />;
};

export const VanCanhXuanDemo: React.FC = () => (
  <Composition id="demo-van-canh-xuan" component={Video} durationInFrames={850} width={1920} height={1080} fps={FPS}
    calculateMetadata={explainerMetadata(script)} defaultProps={{ timeline: null, draft: true }} />
);
