import React from "react";
import { Composition } from "remotion";
import { ExplainerProps, ExplainerVideo, explainerMetadata } from "../../components/ExplainerVideo";
import { FPS, Script } from "../../components/timeline";
import { BEATS } from "./beats";
import scriptJson from "./script.json";

// Video "Tiệm cận": câu đố xe lên dốc (Wertheimer gửi Einstein).
const script = scriptJson as Script;

const TiemCan: React.FC<ExplainerProps> = ({ timeline, draft }) => (
  <ExplainerVideo script={script} timeline={timeline} beats={BEATS} draft={draft} />
);

export const TiemCanComposition: React.FC = () => (
  <Composition
    id="tiem-can"
    component={TiemCan}
    durationInFrames={300}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{ timeline: null } as ExplainerProps}
    calculateMetadata={explainerMetadata(script)}
  />
);
