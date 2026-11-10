import React from "react";
import { Composition, useCurrentFrame } from "remotion";
import { BeatProps } from "../../components/BeatShell";
import { ExplainerProps, ExplainerVideo, explainerMetadata } from "../../components/ExplainerVideo";
import { fadeIn } from "../../components/parts";
import { FPS, Script } from "../../components/timeline";
import { Stage, ZERO } from "../demo-tuong-trung-moi/scene";
import scriptJson from "./script.json";

// Demo luật CŨ: beat riêng "đổi sang mô hình", nhãn MÔ HÌNH đậm, chú giải tỉ lệ,
// lời đọc nói "không phải số liệu thật". Không phải video đăng.

const script = scriptJson as Script;
const out = (fr: number, a: number) => 1 - fadeIn(fr, a);

const Beat01: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  const a = fadeIn(fr, L[0], 20);
  return <Stage s={{ ...ZERO, appear: a, dancu: 1, ruongdat: 1 }} />;
};

const Beat02: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  return (
    <Stage
      s={{
        ...ZERO,
        appear: 1,
        dancu: 1,
        ruongdat: 1,
        badge: fadeIn(fr, L[0]),
        legP: fadeIn(fr, L[1]),
        legF: fadeIn(fr, L[2]),
        badge2: fadeIn(fr, L[3]),
      }}
    />
  );
};

const Beat03: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  return (
    <Stage
      s={{
        ...ZERO,
        appear: 1,
        ruongdat: 1,
        badge: 1,
        badge2: 1,
        dancu: out(fr, L[0]),
        legF: out(fr, L[0]),
        noble: fadeIn(fr, L[0]),
        quytoc: fadeIn(fr, L[0]),
        pct: fadeIn(fr, L[0]),
        legP: out(fr, L[1]),
        farmer: fadeIn(fr, L[1]),
        nongdan: fadeIn(fr, L[1]),
      }}
    />
  );
};

const Beat04: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  return (
    <Stage
      s={{
        ...ZERO,
        appear: 1,
        ruongdat: 1,
        badge: 1,
        badge2: 1,
        noble: 1,
        quytoc: 1,
        farmer: 1,
        nongdan: 1,
        pct: out(fr, L[0]),
        y1397: fadeIn(fr, L[0]),
        state: fadeIn(fr, L[1], 18),
      }}
    />
  );
};

const BEATS: Record<string, React.FC<BeatProps>> = { b01: Beat01, b02: Beat02, b03: Beat03, b04: Beat04 };

const Demo: React.FC<ExplainerProps> = ({ timeline, draft }) => (
  <ExplainerVideo script={script} timeline={timeline} beats={BEATS} draft={draft} />
);

export const DemoTuongTrungCuComposition: React.FC = () => (
  <Composition
    id="demo-tuong-trung-cu"
    component={Demo}
    durationInFrames={900}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{ timeline: null } as ExplainerProps}
    calculateMetadata={explainerMetadata(script)}
  />
);
