import React from "react";
import { Composition, useCurrentFrame } from "remotion";
import { BeatProps } from "../../components/BeatShell";
import { ExplainerProps, ExplainerVideo, explainerMetadata } from "../../components/ExplainerVideo";
import { AutoLabels, AutoLabelItem, axesObstacles, curveObstacles } from "../../components/labels";
import { fadeIn } from "../../components/parts";
import { Axes, FunctionPlot, Plot, Point, makeScale } from "../../components/plot";
import { role } from "../../components/roles";
import { colors, fontText } from "../../components/theme";
import { FPS, Script } from "../../components/timeline";
import scriptJson from "./script.json";

// Composition thử thành phần dùng chung (nhãn tự đặt, cảnh liền mạch, chế độ nháp). Không phải video đăng.

const script = scriptJson as Script;
const f = (x: number) => -(x ** 3) + 6 * x ** 2 - 9 * x + 6;
const S = makeScale({ xMin: -1.2, xMax: 4.2, yMin: 0, yMax: 24, width: 1100, height: 640 });
const XT = [-1, 1, 2, 3, 4];
const YT = [4, 8, 12, 16, 20, 24];
const OBST = [...curveObstacles(S, f, -1, 4), ...axesObstacles(S, XT, YT)];

/** Cảnh 1 dùng chung cho b01, b02: cùng một trạng thái ở ranh giới hai beat. */
const Scene1: React.FC<{ draw: number; labels: AutoLabelItem[]; points: { x: number; color: string; o: number }[] }> = ({ draw, labels, points }) => (
  <Plot
    scale={S}
    left={410}
    top={200}
    overlay={<AutoLabels scale={S} items={labels} obstacles={OBST} />}
  >
    <Axes scale={S} xTicks={XT} yTicks={YT} xLabel="x" yLabel="f(x)" />
    <FunctionPlot scale={S} f={f} from={-1} to={4} progress={draw} />
    {points.map((p) => (
      <Point key={p.x} scale={S} x={p.x} y={f(p.x)} color={p.color} opacity={p.o} />
    ))}
  </Plot>
);

const b01Labels = (fr: number, L: number[]): AutoLabelItem[] => [
  { id: "max", x: 3, y: 6, text: "cực đại: $6$", color: role.focus, opacity: fadeIn(fr, L[1]) },
  { id: "min", x: 1, y: 2, text: "cực tiểu: $2$", color: role.focus, opacity: fadeIn(fr, L[2]) },
];

const Beat01: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  return (
    <Scene1
      draw={fadeIn(fr, L[0], 50)}
      labels={[...b01Labels(fr, L), ...b02Labels(-1, [1e9, 1e9, 1e9])]}
      points={[
        { x: 3, color: role.focus, o: fadeIn(fr, L[1]) },
        { x: 1, color: role.focus, o: fadeIn(fr, L[2]) },
      ]}
    />
  );
};

const b02Labels = (fr: number, L: number[]): AutoLabelItem[] => [
  { id: "d2", x: 2, y: 4, text: "$f'(2) = 3$", color: role.up, opacity: fadeIn(fr, L[0]) },
  { id: "d35", x: 3.5, y: f(3.5), text: "$f'(3{,}5) < 0$", color: role.down, opacity: fadeIn(fr, L[1]) },
  { id: "top", x: -1, y: 22, text: "lớn nhất: $22$", color: role.focus, opacity: fadeIn(fr, L[2]) },
];

const Beat02: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  // frame đầu b02 = frame cuối b01: đồ thị vẽ xong, hai nhãn cực trị đã hiện
  return (
    <Scene1
      draw={1}
      labels={[...b01Labels(1e9, [0, 0, 0]), ...b02Labels(fr, L)]}
      points={[
        { x: 3, color: role.focus, o: 1 },
        { x: 1, color: role.focus, o: 1 },
        { x: 2, color: role.up, o: fadeIn(fr, L[0]) },
        { x: 3.5, color: role.down, o: fadeIn(fr, L[1]) },
        { x: -1, color: role.focus, o: fadeIn(fr, L[2]) },
      ]}
    />
  );
};

const Beat03: React.FC<BeatProps> = () => (
  <div
    data-text="label"
    style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontFamily: fontText, fontSize: 56, fontWeight: 700, color: colors.text }}
  >
    Cảnh 2
  </div>
);

const BEATS: Record<string, React.FC<BeatProps>> = { b01: Beat01, b02: Beat02, b03: Beat03 };

const Lab: React.FC<ExplainerProps> = ({ timeline, draft }) => (
  <ExplainerVideo script={script} timeline={timeline} beats={BEATS} draft={draft} />
);

export const LabComposition: React.FC = () => (
  <Composition
    id="lab-thanh-phan"
    component={Lab}
    durationInFrames={300}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{ timeline: null, draft: true } as ExplainerProps}
    calculateMetadata={explainerMetadata(script)}
  />
);
