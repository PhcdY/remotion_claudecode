import React from "react";
import { Card } from "../../components/Card";
import { Drone } from "../../components/Drone";
import { MathText, Tex } from "../../components/MathText";
import { Pill, label, lerp } from "../../components/parts";
import { Axes, FunctionPlot, Plot, PlotLabel, Point, Scale, Segment, makeScale } from "../../components/plot";
import { colors, tint } from "../../components/theme";

// ---------------- Mô hình (giữ nguyên sườn đồi bài trước) ----------------
/** Độ cao mặt đất tại quãng bay ngang x. */
export const f = (x: number) => -x * x * x + 6 * x * x - 9 * x + 6;
/** f'(x) = -3(x - 1)(x - 3). */
export const fp = (x: number) => -3 * x * x + 12 * x - 9;
/** Sườn dốc khác (b07): g(x) = x³ - 6x² + 12x = (x - 2)³ + 8. */
export const g = (x: number) => x * x * x - 6 * x * x + 12 * x;
export const gp = (x: number) => 3 * (x - 2) * (x - 2);

/** Tuyến bay. */
export const A = -1;
export const B = 4;
export const FORMULA = "f(x) = -x^3 + 6x^2 - 9x + 6";

/** Màu theo vai trò, giữ nguyên nghĩa suốt video. */
export const C = {
  up: colors.increase, // f' > 0, đi lên
  down: colors.decrease, // f' < 0, đi xuống
  deriv: colors.accent, // chỗ f' = 0, tiếp tuyến ngang, x0
  span: colors.c1, // khoảng sát hai bên (x0 - h; x0 + h)
  max: colors.c2, // giá trị lớn nhất
  min: "#0284C7", // giá trị nhỏ nhất
  num: colors.c2, // phần chênh độ cao trong kính lúp
  below: "#7C3AED", // "thấp hơn đỉnh": đoạn đồ thị quanh đỉnh + đường ngang
  warn: colors.warn,
  dim: "#A9B1C7",
  ground: "#7A8499",
};

// ---------------- CẢNH 1: sườn đồi nhìn ngang, tuyến từ -1 đến 4 ----------------
export const HILL = { top: 250, width: 1100, height: 470 };
export const HS: Scale = makeScale({ xMin: -1.1, xMax: 4.1, yMin: 0, yMax: 27, width: HILL.width, height: HILL.height });
export const hillLeft = (mix: number) => lerp(410, 120, mix);
/** Độ cao bay cố định (đáy flycam) trên CẢNH 1, cao hơn chỗ cao nhất 22. */
export const ALT = 24.4;

export const Hill: React.FC<{
  mix: number;
  opacity?: number;
  faint?: number;
  children?: (s: Scale, left: number) => React.ReactNode;
}> = ({ mix, opacity = 1, faint = 0, children }) => {
  const s = HS;
  const left = hillLeft(mix);
  let d = `M${s.x(A)},${s.y(0)} `;
  for (let i = 0; i <= 200; i++) {
    const x = A + ((B - A) * i) / 200;
    d += `L${s.x(x).toFixed(1)},${s.y(f(x)).toFixed(1)} `;
  }
  d += `L${s.x(B)},${s.y(0)} Z`;
  return (
    <>
      <Plot scale={s} left={left} top={HILL.top} style={{ opacity }}>
        <path d={d} fill={tint(C.ground, 0.16 * (1 - faint))} stroke="none" />
        <FunctionPlot scale={s} f={f} from={A} to={B} color={faint > 0.5 ? C.dim : C.ground} width={faint > 0.5 ? 3 : 6} opacity={1 - 0.5 * faint} />
        {children ? children(s, left) : null}
      </Plot>
    </>
  );
};

/** Flycam bay ở độ cao cố định ALT tại quãng x (bay từ phải sang trái), có thể kèm vạch đo xuống mặt đất. */
export const FixedDrone: React.FC<{ mix: number; x: number; spin: number; gauge?: number; opacity?: number }> = ({ mix, x, spin, gauge = 0, opacity = 1 }) => {
  const s = HS;
  const left = hillLeft(mix);
  const px = left + s.x(x);
  const ground = HILL.top + s.y(f(x));
  const bottom = HILL.top + s.y(ALT);
  return (
    <>
      {gauge > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: gauge * opacity }}>
          <line x1={px} y1={bottom + 6} x2={px} y2={ground - 4} stroke={colors.accent} strokeWidth={4} strokeDasharray="8 7" />
        </svg>
      ) : null}
      <Drone x={px} y={bottom} w={150} spin={spin} opacity={opacity} flip />
    </>
  );
};

/** Đường bay nằm ngang ở độ cao ALT trên CẢNH 1. */
export const FlightLine: React.FC<{ mix: number; opacity: number }> = ({ mix, opacity }) =>
  opacity <= 0 ? null : (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity }}>
      <line
        x1={hillLeft(mix) + HS.x(A) - 20}
        x2={hillLeft(mix) + HS.x(B) + 20}
        y1={HILL.top + HS.y(ALT)}
        y2={HILL.top + HS.y(ALT)}
        stroke={colors.accent}
        strokeWidth={4}
        strokeDasharray="14 10"
      />
    </svg>
  );

/** Thẻ "bản đồ độ cao" (công thức + nhãn mô hình). */
export const MapCard: React.FC<{ left: number; top: number; width: number; opacity: number; children?: React.ReactNode }> = ({
  left,
  top,
  width,
  opacity,
  children,
}) =>
  opacity <= 0 ? null : (
    <Card group="map" style={{ left, top, width, padding: "18px 28px", opacity }}>
      <div data-box>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div data-text="th" style={{ ...label, color: colors.muted }}>
            bản đồ độ cao
          </div>
          <span data-text="badge" style={label}>
            <Pill text="mô hình" />
          </span>
        </div>
        <div data-text="formula" style={{ textAlign: "center", fontSize: 38, marginTop: 10, whiteSpace: "nowrap" }}>
          <Tex tex={FORMULA} />
        </div>
        {children}
      </div>
    </Card>
  );

// ---------------- CẢNH 2: đồ thị trên hệ trục ----------------
export const G = { top: 150, width: 900, height: 430 };
/** Hệ trục của tuyến [-1; 4]. */
export const RS: Scale = makeScale({ xMin: -1.3, xMax: 4.4, yMin: 0, yMax: 24.5, width: G.width, height: G.height });
/** Hệ trục của sườn dốc khác g trên [0; 4]. */
export const QS: Scale = makeScale({ xMin: 0, xMax: 4.4, yMin: 0, yMax: 17.5, width: G.width, height: G.height });
export const GPOS = { center: 510, left: 150 };
/** Thẻ bên phải đồ thị (khi đồ thị ở GPOS.left). */
export const PANEL = { left: 1100, width: 730 };

/** Đồ thị f trên tuyến [-1; 4] kèm trục, nhãn trục, nhãn mô hình + công thức. */
export const Graph: React.FC<{
  left: number;
  axes?: number;
  curve?: number;
  curveOpacity?: number;
  chip?: number;
  chipText?: "mô hình" | "đề bài";
  hideX?: number[];
  hideY?: number[];
  children?: (s: Scale) => React.ReactNode;
  overlay?: (s: Scale) => React.ReactNode;
  under?: (s: Scale) => React.ReactNode;
}> = ({ left, axes = 1, curve = 1, curveOpacity = 1, chip = 1, chipText = "mô hình", hideX = [], hideY = [5, 20], children, overlay, under }) => {
  const s = RS;
  const chipColor = chipText === "đề bài" ? colors.warn : colors.brandBlue;
  return (
    <Plot
      scale={s}
      left={left}
      top={G.top}
      overlay={
        <>
          <PlotLabel scale={s} x={0} y={s.yMax} dx={22} dy={-26} anchor="left" opacity={axes}>
            <MathText text="độ cao $f(x)$" />
          </PlotLabel>
          <PlotLabel scale={s} x={1.55} y={0} dy={64} anchor="top" opacity={axes}>
            <MathText text="quãng bay ngang $x$" />
          </PlotLabel>
          <PlotLabel scale={s} x={s.xMax} y={19.4} anchor="right" opacity={chip * axes}>
            <Pill text={chipText} color={chipColor} />
          </PlotLabel>
          <PlotLabel scale={s} x={s.xMax} y={15.5} anchor="right" opacity={chip * axes}>
            <Tex tex={FORMULA} />
          </PlotLabel>
          {overlay ? overlay(s) : null}
        </>
      }
    >
      <g opacity={axes}>
        <Axes scale={s} xTicks={[-1, 1, 2, 3, 4]} yTicks={[5, 10, 15, 20]} xLabel="" yLabel="" hideXLabels={hideX} hideYLabels={hideY} yTickSide="right" />
      </g>
      {under ? under(s) : null}
      {curve > 0 ? <FunctionPlot scale={s} f={f} from={A} to={B} progress={curve} opacity={curveOpacity} /> : null}
      {children ? children(s) : null}
    </Plot>
  );
};

/** Đoạn đồ thị f tô màu trên [a, b]. */
export const CurvePart: React.FC<{ s: Scale; a: number; b: number; color: string; opacity?: number; width?: number; fn?: (x: number) => number }> = ({
  s,
  a,
  b,
  color,
  opacity = 1,
  width = 10,
  fn = f,
}) => (opacity <= 0 ? null : <FunctionPlot scale={s} f={fn} from={a} to={b} color={color} width={width} opacity={opacity} />);

/** Đoạn tô trên trục ngang [a, b]. */
export const AxisPart: React.FC<{ s: Scale; a: number; b: number; color: string; opacity?: number; width?: number }> = ({ s, a, b, color, opacity = 1, width = 12 }) =>
  opacity <= 0 ? null : <Segment scale={s} x1={a} y1={0} x2={b} y2={0} color={color} width={width} opacity={opacity} />;

/** Cột dọc từ trục ngang lên đồ thị f tại x. */
export const Col: React.FC<{ s: Scale; x: number; color: string; opacity?: number; width?: number }> = ({ s, x, color, opacity = 1, width = 12 }) =>
  opacity <= 0 ? null : <Segment scale={s} x1={x} y1={0} x2={x} y2={f(x)} color={color} width={width} opacity={opacity} />;

/** Dấu ✗ tại một điểm (toạ độ toán). */
export const Cross: React.FC<{ s: Scale; x: number; y: number; color?: string; opacity?: number; size?: number }> = ({ s, x, y, color = C.warn, opacity = 1, size = 20 }) =>
  opacity <= 0 ? null : (
    <g opacity={opacity} stroke={color} strokeWidth={7} strokeLinecap="round">
      <line x1={s.x(x) - size} y1={s.y(y) - size} x2={s.x(x) + size} y2={s.y(y) + size} />
      <line x1={s.x(x) + size} y1={s.y(y) - size} x2={s.x(x) - size} y2={s.y(y) + size} />
    </g>
  );

/** Vòng tròn viền đánh dấu một điểm ứng viên. */
export const Ring: React.FC<{ s: Scale; x: number; y: number; color: string; opacity?: number }> = ({ s, x, y, color, opacity = 1 }) =>
  opacity <= 0 ? null : <circle cx={s.x(x)} cy={s.y(y)} r={22} fill="none" stroke={color} strokeWidth={5} opacity={opacity} />;

/** Điểm đánh dấu trên trục ngang. */
export const AxisDot: React.FC<{ s: Scale; x: number; color: string; opacity?: number }> = ({ s, x, color, opacity = 1 }) =>
  opacity <= 0 ? null : <Point scale={s} x={x} y={0} r={10} color={color} opacity={opacity} />;

