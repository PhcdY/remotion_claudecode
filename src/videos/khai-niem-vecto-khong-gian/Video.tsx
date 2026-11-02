import React from "react";
import { Composition } from "remotion";
import { ExplainerProps, ExplainerVideo, explainerMetadata } from "../../components/ExplainerVideo";
import { FPS, Script } from "../../components/timeline";
import { BEATS } from "./beats";
import scriptJson from "./script.json";

// Video "Vì sao bóng nắng song song, bóng đèn xòe ra?" — khái niệm vectơ trong không gian (Bài 6, video 1).
const script = scriptJson as Script;

const KhaiNiemVectoKhongGian: React.FC<ExplainerProps> = ({ timeline, draft }) => (
  <ExplainerVideo script={script} timeline={timeline} beats={BEATS} draft={draft} />
);

export const KhaiNiemVectoKhongGianComposition: React.FC = () => (
  <Composition
    id="khai-niem-vecto-khong-gian"
    component={KhaiNiemVectoKhongGian}
    durationInFrames={300}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{ timeline: null } as ExplainerProps}
    calculateMetadata={explainerMetadata(script)}
  />
);
