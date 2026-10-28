import React from "react";
import { Composition } from "remotion";
import { ExplainerProps, ExplainerVideo, explainerMetadata } from "../../components/ExplainerVideo";
import { FPS, Script } from "../../components/timeline";
import { BEATS } from "./beats";
import scriptJson from "./script.json";

// Video "Tích vô hướng": trọng lực kéo suốt mà Vinasat-1 không nhanh lên, vì lực vuông góc hướng bay.
const script = scriptJson as Script;

const TichVoHuong: React.FC<ExplainerProps> = ({ timeline, draft }) => (
  <ExplainerVideo script={script} timeline={timeline} beats={BEATS} draft={draft} />
);

export const TichVoHuongComposition: React.FC = () => (
  <Composition
    id="tich-vo-huong"
    component={TichVoHuong}
    durationInFrames={300}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{ timeline: null } as ExplainerProps}
    calculateMetadata={explainerMetadata(script)}
  />
);
