import React from "react";
import { Composition } from "remotion";
import { ExplainerProps, ExplainerVideo, explainerMetadata } from "../../components/ExplainerVideo";
import { FPS, Script } from "../../components/timeline";
import { BEATS } from "./beats";
import scriptJson from "./script.json";

// Video "Biểu thức tọa độ của các phép toán vectơ": Máy bay tính quỹ đạo trong gió chỉ bằng 3 phép cộng: Vì sao?
const script = scriptJson as Script;

const BieuThucToaDoPhepToanVecto: React.FC<ExplainerProps> = ({ timeline, draft }) => (
  <ExplainerVideo script={script} timeline={timeline} beats={BEATS} draft={draft} />
);

export const BieuThucToaDoPhepToanVectoComposition: React.FC = () => (
  <Composition
    id="bieu-thuc-toa-do-phep-toan-vecto"
    component={BieuThucToaDoPhepToanVecto}
    durationInFrames={300}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{ timeline: null, draft: true } as ExplainerProps}
    calculateMetadata={explainerMetadata(script)}
  />
);
