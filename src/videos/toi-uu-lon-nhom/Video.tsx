import React from "react";
import { Composition } from "remotion";
import { ExplainerProps, ExplainerVideo, explainerMetadata } from "../../components/ExplainerVideo";
import { FPS, Script } from "../../components/timeline";
import { BEATS } from "./beats";
import scriptJson from "./script.json";

// Video "Lon nhôm nên cao bao nhiêu?": bài tối ưu = đưa về một biến rồi tìm đáy của hàm số.
const script = scriptJson as Script;

const ToiUuLonNhom: React.FC<ExplainerProps> = ({ timeline, draft }) => (
  <ExplainerVideo script={script} timeline={timeline} beats={BEATS} draft={draft} />
);

export const ToiUuLonNhomComposition: React.FC = () => (
  <Composition
    id="toi-uu-lon-nhom"
    component={ToiUuLonNhom}
    durationInFrames={300}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{ timeline: null } as ExplainerProps}
    calculateMetadata={explainerMetadata(script)}
  />
);
