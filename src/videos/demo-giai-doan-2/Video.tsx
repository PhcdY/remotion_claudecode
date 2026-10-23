import React from "react";
import { Composition, Easing, useCurrentFrame } from "remotion";
import { BeatProps, ramp } from "../../components/BeatShell";
import { Card } from "../../components/Card";
import { ExplainerProps, ExplainerVideo, explainerMetadata } from "../../components/ExplainerVideo";
import { AutoLabels, AutoLabelItem, Rect, axesObstacles, curveObstacles, segmentObstacles, textObstacle } from "../../components/labels";
import { MathText, Tex } from "../../components/MathText";
import { Hi, fadeIn, label, lerp, lineAt } from "../../components/parts";
import { Axes, FunctionPlot, Plot, PlotLabel, Point, Segment, makeScale } from "../../components/plot";
import { role } from "../../components/roles";
import { colors } from "../../components/theme";
import { FPS, Script } from "../../components/timeline";
import scriptJson from "./script.json";

// Demo giai đoạn 2: dựng lại b02–b03 của video cực trị (cùng audio) bằng hệ thống mới —
// chữ trong cảnh, nhãn neo tự đặt, một cảnh liền qua hai beat, màu theo vai trò. Không phải video đăng.

const script = scriptJson as Script;
const f = (x: number) => -x * x * x + 6 * x * x - 9 * x + 6;
const A = -1;
const B = 4;
const H = 0.8; // khoảng sát hai bên đỉnh: (2,2; 3,8)

const S = makeScale({ xMin: -1.3, xMax: 4.4, yMin: 0, yMax: 24.5, width: 1000, height: 560 });
const TOP = 170;
const POS = { center: 460, left: 130 };
const CARD = { left: 1190, top: 140, width: 640 };
const XT = [-1, 1, 2, 3, 4];
const YT = [5, 10, 15, 20];

// Vật cản cố định của cả cảnh (toạ độ trong khung đồ thị), để nhãn đứng yên suốt hai beat.
const OBST: Rect[] = [
  ...curveObstacles(S, f, A, B),
  ...axesObstacles(S, XT.filter((t) => t !== 3), YT, "right"),
  textObstacle(S.x(0) + 62, S.y(23.6), 560, S.y(15.6) - S.y(23.6)), // nhãn "mô hình" + công thức (góc trên trái, cạnh trục dọc)
  textObstacle(S.x(0) + 10, -74, 230, 50), // tên trục dọc
  textObstacle(S.x(1.55) - 170, S.height + 44, 340, 48), // tên trục ngang
  textObstacle(CARD.left - POS.left, CARD.top - TOP, CARD.width, 350), // thẻ định nghĩa (beat 2)
  ...segmentObstacles(S.x(3 - H), S.y(6), S.x(3 + H), S.y(6)), // đường ngang đứt qua đỉnh
  ...segmentObstacles(S.x(1 - H), S.y(2), S.x(1 + H), S.y(2)), // đường ngang đứt qua đáy
  ...segmentObstacles(S.x(3 - H), S.y(0), S.x(3 + H), S.y(0), 16), // khoảng sát hai bên trên trục
];

type State = {
  left: number;
  axes: number;
  draw: number;
  up: number;
  down: number;
  pts: number;
  near: number;
  nearBold: number;
  x0: number;
  span: number;
  minNear: number;
  labels: AutoLabelItem[];
};

/** CẢNH 2 dùng chung cho b02 và b03. */
const Scene2: React.FC<State> = (st) => (
  <Plot
    scale={S}
    left={st.left}
    top={TOP}
    overlay={
      <>
        <PlotLabel scale={S} x={0} y={S.yMax} dx={22} dy={-34} anchor="left" opacity={st.axes}>
          <MathText text="độ cao $f(x)$" />
        </PlotLabel>
        <PlotLabel scale={S} x={1.55} y={0} dy={64} anchor="top" opacity={st.axes}>
          <MathText text="quãng bay ngang $x$" />
        </PlotLabel>
        <PlotLabel scale={S} x={0} y={22.3} dx={72} anchor="left" color={role.main} opacity={st.axes}>
          mô hình
        </PlotLabel>
        <PlotLabel scale={S} x={0} y={18.3} dx={72} anchor="left" opacity={st.axes}>
          <Tex tex="f(x) = -x^3 + 6x^2 - 9x + 6" />
        </PlotLabel>
        <AutoLabels scale={S} items={st.labels} obstacles={OBST} bounds={{ x: -80, y: -80, w: S.width + 340, h: S.height + 160 }} />
      </>
    }
  >
    <g opacity={st.axes}>
      <Axes scale={S} xTicks={XT} yTicks={YT} xLabel="" yLabel="" hideXLabels={st.x0 > 0 ? [3] : []} yTickSide="right" />
    </g>
    {st.span > 0 ? <Segment scale={S} x1={3 - H} y1={0} x2={3 + H} y2={0} color={role.pairA} width={12} opacity={st.span} /> : null}
    <FunctionPlot scale={S} f={f} from={A} to={B} progress={st.draw} />
    {st.up > 0 ? <FunctionPlot scale={S} f={f} from={1} to={3} color={role.up} width={10} opacity={st.up} /> : null}
    {st.down > 0 ? (
      <>
        <FunctionPlot scale={S} f={f} from={A} to={1} color={role.down} width={10} opacity={st.down} />
        <FunctionPlot scale={S} f={f} from={3} to={B} color={role.down} width={10} opacity={st.down} />
      </>
    ) : null}
    {st.near > 0 ? (
      <>
        <Segment scale={S} x1={3 - H} y1={6} x2={3 + H} y2={6} color={role.pairB} width={4} dashed opacity={st.near * 0.8} />
        <FunctionPlot scale={S} f={f} from={3 - H} to={3 + H} color={role.pairB} width={lerp(9, 13, st.nearBold)} opacity={st.near * lerp(0.75, 1, st.nearBold)} />
      </>
    ) : null}
    {st.minNear > 0 ? (
      <>
        <Segment scale={S} x1={1 - H} y1={2} x2={1 + H} y2={2} color={role.pairB} width={4} dashed opacity={st.minNear * 0.7} />
        <FunctionPlot scale={S} f={f} from={1 - H} to={1 + H} color={role.pairB} width={9} opacity={st.minNear * 0.75} />
      </>
    ) : null}
    {st.x0 > 0 ? <Segment scale={S} x1={3} y1={-0.7} x2={3} y2={0.7} color={role.focus} width={8} opacity={st.x0} /> : null}
    <Point scale={S} x={1} y={2} color={role.focus} opacity={st.pts} />
    <Point scale={S} x={3} y={6} color={role.focus} opacity={st.pts} />
  </Plot>
);

/**
 * Mọi nhãn của cảnh, theo thứ tự quan trọng. o: độ mờ; step: bước đổi chữ của nhãn đỉnh/đáy
 * (0: đạo hàm bằng 0 → 1: tên "đỉnh"/"đáy" → 2: tên trong định nghĩa). phases: nhãn chỉ chặn nhau khi cùng hiện.
 */
const sceneLabels = (o: Record<string, number>, peakStep: number, troughStep: number): AutoLabelItem[] => [
  { id: "peak", x: 3, y: 6, text: "", steps: ["$f'(3) = 0$", "đỉnh", "giá trị cực đại: $6$"], step: peakStep, color: role.focus, prefer: ["n", "nw", "ne"], opacity: o.pts },
  { id: "trough", x: 1, y: 2, text: "", steps: ["$f'(1) = 0$", "đáy", "cực tiểu"], step: troughStep, color: role.focus, prefer: ["n", "ne", "nw"], opacity: o.pts },
  { id: "x0", x: 3, y: 0, text: "$x_0 = 3$", color: role.focus, prefer: ["s"], phases: ["b03"], opacity: o.x0 },
  { id: "span", x: 3, y: 0, anchor: "region", text: "khoảng sát hai bên", color: role.pairA, prefer: ["n"], phases: ["b03"], opacity: o.span },
  { id: "below", x: 3 + H, y: 6, anchor: "region", text: "$f(x) < f(x_0) = 6$", color: role.pairB, prefer: ["e", "ne", "n"], phases: ["b03"], opacity: o.below },
  { id: "up", anchor: "region", x: 2, y: f(2), text: "$f' > 0$", color: role.up, prefer: ["se", "s"], phases: ["b02"], opacity: o.up },
  { id: "downL", anchor: "region", x: -0.45, y: f(-0.45), text: "$f' < 0$", color: role.down, prefer: ["sw", "w", "s"], phases: ["b02"], opacity: o.down },
  { id: "downR", anchor: "region", x: 3.75, y: f(3.75), text: "$f' < 0$", color: role.down, prefer: ["e", "se"], phases: ["b02"], opacity: o.down },
];

// ---------------- b02: f' > 0 lên, f' < 0 xuống; còn f' = 0? Đáy, đỉnh ----------------
const Beat02: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  const up = fadeIn(fr, L[1]);
  const down = fadeIn(fr, L[2]);
  const pts = fadeIn(fr, L[3]);
  const names = fadeIn(fr, L[4]);
  return (
    <Scene2
      left={POS.center}
      axes={fadeIn(fr, 0, 14)}
      draw={ramp(fr, L[0] + 4, L[0] + 50, Easing.inOut(Easing.quad))}
      up={up}
      down={down}
      pts={pts}
      near={0}
      nearBold={0}
      x0={0}
      span={0}
      minNear={0}
      labels={sceneLabels({ pts, up, down, x0: 0, span: 0, below: 0 }, names, names)}
    />
  );
};

// ---------------- b03: định nghĩa cực đại, giải phẫu từng cụm ----------------
const DefCard: React.FC<{ hl: number; opacity: number }> = ({ hl, opacity }) => {
  const dim = hl > 0;
  const row = (children: React.ReactNode) => (
    <div data-text="td" style={{ ...label, fontSize: 38, marginTop: 8, lineHeight: 1.45 }}>
      {children}
    </div>
  );
  return opacity <= 0 ? null : (
    <Card group="def" style={{ left: CARD.left, top: CARD.top, width: CARD.width, padding: "18px 28px", opacity }}>
      <div data-box>
        <div data-text="th" style={{ ...label, color: colors.muted, textAlign: "center" }}>
          định nghĩa
        </div>
        {row(
          <Hi on={0} dim={dim} color={role.focus}>
            <MathText text="Nếu tồn tại số $h > 0$ sao cho" />
          </Hi>,
        )}
        {row(
          <>
            <Hi on={hl === 3 ? 1 : 0} dim={dim} color={role.pairB}>
              <Tex tex="f(x) < f(x_0)" />
            </Hi>{" "}
            <Hi on={0} dim={dim} color={role.focus}>
              với mọi
            </Hi>
          </>,
        )}
        {row(
          <>
            <Hi on={hl === 2 ? 1 : 0} dim={dim} color={role.pairA}>
              <Tex tex="x \in (x_0 - h;\, x_0 + h)" />
            </Hi>
            <Hi on={0} dim={dim} color={role.focus}>
              <MathText text=", $x \ne x_0$" />
            </Hi>
          </>,
        )}
        {row(
          <>
            <Hi on={0} dim={dim} color={role.focus}>
              <MathText text="thì $f$ đạt cực đại tại" />
            </Hi>{" "}
            <Hi on={hl === 1 ? 1 : 0} dim={dim} color={role.focus}>
              <Tex tex="x_0" />
            </Hi>
            .
          </>,
        )}
      </div>
    </Card>
  );
};

const Beat03: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  const line = lineAt(fr, L);
  // b02 xong việc: màu tăng/giảm và nhãn đạo hàm = 0 mờ dần (cùng cảnh, không nháy)
  const gone = 1 - fadeIn(fr, 0, 15);
  // đồ thị dịch sang trái đúng lúc thẻ định nghĩa vào
  const slide = ramp(fr, L[1], L[1] + 18);
  const card = fadeIn(fr, L[1] + 12);
  const x0 = fadeIn(fr, L[2]);
  const span = fadeIn(fr, L[3]);
  const below = fadeIn(fr, L[4]);
  const peakT = fadeIn(fr, L[5]);
  const minAll = fadeIn(fr, L[6]);
  const hl = line === 3 ? 1 : line === 4 ? 2 : line === 5 ? 3 : 0;
  return (
    <>
      <Scene2
        left={lerp(POS.center, POS.left, slide)}
        axes={1}
        draw={1}
        up={gone}
        down={gone}
        pts={1}
        near={fadeIn(fr, L[0])}
        nearBold={line === 5 ? 1 : 0}
        x0={x0}
        span={span * (line === 4 ? 1 : 0.55)}
        minNear={minAll}
        labels={sceneLabels({ pts: 1, up: gone, down: gone, x0, span, below }, 1 + peakT, 1 + minAll)}
      />
      <DefCard hl={hl} opacity={card} />
    </>
  );
};

const BEATS: Record<string, React.FC<BeatProps>> = { b02: Beat02, b03: Beat03 };

const Demo: React.FC<ExplainerProps> = ({ timeline, draft }) => (
  <ExplainerVideo script={script} timeline={timeline} beats={BEATS} draft={draft} />
);

export const DemoGiaiDoan2Composition: React.FC = () => (
  <Composition
    id="demo-giai-doan-2"
    component={Demo}
    durationInFrames={300}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{ timeline: null, audioDir: "cuc-tri-gtln-gtnn" } as ExplainerProps}
    calculateMetadata={explainerMetadata(script)}
  />
);
