import React from "react";
import { Composition, getInputProps, interpolate, useCurrentFrame } from "remotion";
import { BeatProps } from "../../components/BeatShell";
import { ExplainerProps, ExplainerVideo, explainerMetadata } from "../../components/ExplainerVideo";
import { AutoLabels, AutoLabelItem, axesObstacles, curveObstacles } from "../../components/labels";
import { fadeIn } from "../../components/parts";
import { Axes, FunctionPlot, Plot, Point, makeScale } from "../../components/plot";
import { role } from "../../components/roles";
import { Region } from "../../components/region";
import { colors, fontText, layout, tint } from "../../components/theme";
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

// ---------- Cảnh 3: lớp ăn khớp (Region + data-inside) ----------
// Bản đúng: sóng nằm trong Region (bị cắt theo lòng sông), cá gắn data-inside="song".
// Bản cố ý lỗi (inputProps { labLoi: true }): sóng không cắt mà dao động lên tới bờ, cá bơi lên bờ —
// để thử check-layout --motion và stills --onion có bắt được không.
const RIVER_X0 = layout.side;
const RIVER_X1 = layout.width - layout.side;
const bankTop = (x: number) => 430 + 40 * Math.sin(x / 300);
const bankBottom = (x: number) => 700 + 40 * Math.sin(x / 300 + 1);
const riverPath = (() => {
  const xs = Array.from({ length: 41 }, (_, i) => RIVER_X0 + ((RIVER_X1 - RIVER_X0) * i) / 40);
  const top = xs.map((x, i) => `${i ? "L" : "M"} ${x.toFixed(1)} ${bankTop(x).toFixed(1)}`).join(" ");
  const bottom = [...xs].reverse().map((x) => `L ${x.toFixed(1)} ${bankBottom(x).toFixed(1)}`).join(" ");
  return `${top} ${bottom} Z`;
})();

const Beat04: React.FC<BeatProps> = () => {
  const fr = useCurrentFrame();
  const broken = Boolean((getInputProps() as { labLoi?: boolean }).labLoi);
  const wave = (k: number) => {
    // bản lỗi: cả dải sóng trôi lên xuống 90px, lên tới bờ đất
    const drift = broken ? 90 * Math.sin(fr * 0.06) : 0;
    let d = "";
    for (let x = RIVER_X0; x <= RIVER_X1; x += 20) {
      const mid = (bankTop(x) + bankBottom(x)) / 2 + (k - 1) * 80;
      d += `${d ? " L" : "M"} ${x} ${(mid + drift + 8 * Math.sin(x / 60 + fr * 0.08 + k)).toFixed(1)}`;
    }
    return d;
  };
  const waves = [0, 1, 2].map((k) => <path key={k} d={wave(k)} fill="none" stroke={tint(colors.brandBlue, 0.45)} strokeWidth={4} strokeLinecap="round" />);
  const fishX = interpolate(fr % 240, [0, 240], [300, 1600]);
  const fishY = (bankTop(fishX) + bankBottom(fishX)) / 2 + (broken ? 150 * Math.sin(fr * 0.05) : 30 * Math.sin(fr * 0.05));
  return (
    <svg width={layout.width} height={layout.height} style={{ position: "absolute", inset: 0 }}>
      {/* đất: nền của cả cảnh */}
      <rect x={RIVER_X0} y={200} width={RIVER_X1 - RIVER_X0} height={760} rx={32} fill="#E3EED3" />
      <Region id="song" d={riverPath} fill={tint(colors.brandBlue, 0.16)} edge={{ color: "#CDB98F", width: 10 }}>
        {broken ? null : waves}
      </Region>
      {broken ? <g data-inside="song" data-name="sóng">{waves}</g> : null}
      <ellipse cx={fishX} cy={fishY} rx={44} ry={20} fill={colors.brandIndigo} data-inside="song" data-name="cá" />
    </svg>
  );
};

const BEATS: Record<string, React.FC<BeatProps>> = { b01: Beat01, b02: Beat02, b03: Beat03, b04: Beat04 };

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
