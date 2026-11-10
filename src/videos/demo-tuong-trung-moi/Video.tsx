import React from "react";
import { Composition, useCurrentFrame } from "remotion";
import { BeatProps } from "../../components/BeatShell";
import { ExplainerProps, ExplainerVideo, explainerMetadata } from "../../components/ExplainerVideo";
import { fadeIn } from "../../components/parts";
import { FPS, Script } from "../../components/timeline";
import { Stage, ZERO } from "./scene";
import scriptJson from "./script.json";

// Demo luật MỚI "Hình và số tượng trưng": không nhắc mô hình, không chú giải tỉ lệ,
// chỉ một nhãn nhỏ mờ "Số liệu minh họa" ở góc video. Không phải video đăng.

const script = scriptJson as Script;
const out = (fr: number, a: number) => 1 - fadeIn(fr, a);

const Beat01: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  return (
    <Stage
      s={{
        ...ZERO,
        appear: fadeIn(fr, L[0], 20),
        noble: fadeIn(fr, L[1]),
        quytoc: fadeIn(fr, L[1]),
        pct: fadeIn(fr, L[1]),
        corner: fadeIn(fr, L[1]),
        farmer: fadeIn(fr, L[2]),
        nongdan: fadeIn(fr, L[2]),
      }}
    />
  );
};

const Beat02: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  return (
    <Stage
      s={{
        ...ZERO,
        appear: 1,
        noble: 1,
        quytoc: 1,
        farmer: 1,
        nongdan: 1,
        corner: 1,
        pct: out(fr, L[0]),
        y1397: fadeIn(fr, L[0]),
        state: fadeIn(fr, L[1], 18),
      }}
    />
  );
};

const BEATS: Record<string, React.FC<BeatProps>> = { b01: Beat01, b02: Beat02 };

const Demo: React.FC<ExplainerProps> = ({ timeline, draft }) => (
  <ExplainerVideo script={script} timeline={timeline} beats={BEATS} draft={draft} />
);

export const DemoTuongTrungMoiComposition: React.FC = () => (
  <Composition
    id="demo-tuong-trung-moi"
    component={Demo}
    durationInFrames={600}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{ timeline: null } as ExplainerProps}
    calculateMetadata={explainerMetadata(script)}
  />
);
