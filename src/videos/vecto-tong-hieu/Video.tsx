import React from "react";
import { Composition } from "remotion";
import { ExplainerProps, ExplainerVideo, explainerMetadata } from "../../components/ExplainerVideo";
import { FPS, Script } from "../../components/timeline";
import { BEATS } from "./beats";
import scriptJson from "./script.json";

// Video "Tổng và hiệu hai vectơ": vì sao máy bay hạ cánh lúc gió ngang lại chĩa mũi xiên.
const script = scriptJson as Script;

const VectoTongHieu: React.FC<ExplainerProps> = ({ timeline, draft }) => (
  <ExplainerVideo script={script} timeline={timeline} beats={BEATS} draft={draft} />
);

export const VectoTongHieuComposition: React.FC = () => (
  <Composition
    id="vecto-tong-hieu"
    component={VectoTongHieu}
    durationInFrames={300}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{ timeline: null, draft: true } as ExplainerProps}
    calculateMetadata={explainerMetadata(script)}
  />
);
