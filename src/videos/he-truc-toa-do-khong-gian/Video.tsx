import React from "react";
import { Composition } from "remotion";
import { ExplainerProps, ExplainerVideo, explainerMetadata } from "../../components/ExplainerVideo";
import { FPS, Script } from "../../components/timeline";
import { BEATS } from "./beats";
import scriptJson from "./script.json";

// Video "Hệ trục tọa độ trong không gian": Hai máy bay chồng lên nhau trên radar — vì sao không va chạm?
const script = scriptJson as Script;

const HeTrucToaDoKhongGian: React.FC<ExplainerProps> = ({ timeline, draft }) => (
  <ExplainerVideo script={script} timeline={timeline} beats={BEATS} draft={draft} />
);

export const HeTrucToaDoKhongGianComposition: React.FC = () => (
  <Composition
    id="he-truc-toa-do-khong-gian"
    component={HeTrucToaDoKhongGian}
    durationInFrames={300}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{ timeline: null } as ExplainerProps}
    calculateMetadata={explainerMetadata(script)}
  />
);
