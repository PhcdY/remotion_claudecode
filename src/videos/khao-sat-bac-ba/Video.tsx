import React from "react";
import { Composition } from "remotion";
import { ExplainerProps, ExplainerVideo, explainerMetadata } from "../../components/ExplainerVideo";
import { FPS, Script } from "../../components/timeline";
import { BEATS } from "./beats";
import scriptJson from "./script.json";

// Video "Khảo sát và vẽ đồ thị (bậc ba)": ba điểm thẳng hàng, đồ thị có thẳng?
const script = scriptJson as Script;

const KhaoSatBacBa: React.FC<ExplainerProps> = ({ timeline, draft }) => (
  <ExplainerVideo script={script} timeline={timeline} beats={BEATS} draft={draft} />
);

export const KhaoSatBacBaComposition: React.FC = () => (
  <Composition
    id="khao-sat-bac-ba"
    component={KhaoSatBacBa}
    durationInFrames={300}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{ timeline: null } as ExplainerProps}
    calculateMetadata={explainerMetadata(script)}
  />
);
