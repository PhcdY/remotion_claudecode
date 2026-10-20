import React from "react";
import { MathText } from "../../components/MathText";
import { Axes, FunctionPlot, Plot, PlotLabel, Point, Scale, Segment, TangentLine, makeScale } from "../../components/plot";
import { colors } from "../../components/theme";
import { lerp } from "./parts";

// ---------------- Cảnh 2: đồ thị s = t² của người chạy mô hình ----------------

export const s2 = (t: number) => t * t;
export const T0 = 5; // thời điểm đang xét (s)
export const S0 = s2(T0); // 25 m

/** Màu theo vai trò, giữ nguyên nghĩa trong mọi beat của cảnh 2. */
export const C = {
  x0: colors.increase, // x0 và cột f(x0)
  x: "#0284C7", // x và cột f(x)
  rise: colors.c2, // phần chênh: quãng đường chạy thêm (tử số)
  run: colors.c1, // khoảng giữa hai chân cột: thời gian trôi qua (mẫu số)
  secant: colors.warn, // cát tuyến (cả phân số)
  tangent: colors.accent, // tiếp tuyến (giới hạn)
  point: colors.accent, // điểm A
  dim: "#A9B1C7",
};

/** Bố cục đồ thị: mix = 0 giữa khung, 1 bên trái (chừa chỗ bên phải cho bảng/kính lúp/công thức). */
export const graphLayout = (mix: number) => {
  const left = lerp(580, 240, mix);
  const width = lerp(760, 620, mix);
  const top = 130;
  const s: Scale = makeScale({ xMin: 0, xMax: 6.5, yMin: 0, yMax: 44, width, height: 330 });
  return { left, top, s };
};

export type GraphProps = {
  mix?: number;
  axes?: number;
  /** đồ thị vẽ tới thời điểm t nào (0 = chưa vẽ) */
  curveTo?: number;
  labels?: "ts" | "xy";
  curveLabel?: number;
  /** nhãn đường cong sáng lên (0 → 1) */
  curveLabelGlow?: number;
  children?: (s: Scale) => React.ReactNode;
  overlay?: (s: Scale) => React.ReactNode;
};

export const ModelGraph: React.FC<GraphProps> = ({
  mix = 0,
  axes = 1,
  curveTo = 6.5,
  labels = "ts",
  curveLabel = 1,
  curveLabelGlow = 0,
  children,
  overlay,
}) => {
  const { left, top, s } = graphLayout(mix);
  const wide = mix < 0.5;
  const xLabel = labels === "xy" ? "$x$" : wide ? "thời gian $t$ (s)" : "$t$ (s)";
  const yLabel = labels === "xy" ? "$y$" : "quãng đường $s$ (m)";
  const curveText = labels === "xy" ? "$y = f(x) = x^2$" : "$s = t^2$";
  return (
    <Plot
      scale={s}
      left={left}
      top={top}
      overlay={
        <>
          <PlotLabel scale={s} x={s.xMax} y={0} dx={34} anchor="left" opacity={axes}>
            <MathText text={xLabel} />
          </PlotLabel>
          <PlotLabel scale={s} x={0} y={s.yMax} dx={20} dy={-26} anchor="left" opacity={axes}>
            <MathText text={yLabel} />
          </PlotLabel>
          {curveLabel > 0 ? (
            <PlotLabel scale={s} x={0.8} y={29} anchor="left" color={colors.curve} opacity={curveLabel}>
              <span
                style={{
                  padding: "2px 10px",
                  borderRadius: 10,
                  background: curveLabelGlow > 0 ? `rgba(75, 135, 244, ${0.18 * curveLabelGlow})` : undefined,
                }}
              >
                <MathText text={curveText} />
              </span>
            </PlotLabel>
          ) : null}
          {overlay ? overlay(s) : null}
        </>
      }
    >
      <g opacity={axes}>
        <Axes scale={s} xTicks={[1, 2, 3, 4, 5, 6]} yTicks={[10, 20, 30, 40]} xLabel="" yLabel="" />
      </g>
      {curveTo > 0 ? <FunctionPlot scale={s} f={s2} from={0} to={6.5} progress={curveTo / 6.5} /> : null}
      {children ? children(s) : null}
    </Plot>
  );
};

// ---------------- Mảnh ghép trên đồ thị ----------------

/** Điểm (x; x²) + gióng đứt nét xuống trục t (và sang trục s nếu toS). */
export const GraphPoint: React.FC<{ s: Scale; x: number; color?: string; guides?: number; toS?: boolean; opacity?: number; r?: number }> = ({
  s,
  x,
  color = C.point,
  guides = 1,
  toS = false,
  opacity = 1,
  r = 11,
}) => (
  <g opacity={opacity}>
    <Segment scale={s} x1={x} y1={0} x2={x} y2={s2(x)} color={colors.muted} width={3} dashed opacity={guides} />
    {toS ? <Segment scale={s} x1={0} y1={s2(x)} x2={x} y2={s2(x)} color={colors.muted} width={3} dashed opacity={guides} /> : null}
    <Point scale={s} x={x} y={s2(x)} color={color} r={r} />
  </g>
);

/** Tam giác đoạn ngang (thời gian) + đoạn dọc (quãng đường) từ A tới B = (b; b²). */
export const Triangle: React.FC<{ s: Scale; b: number; opacity?: number }> = ({ s, b, opacity = 1 }) => (
  <g opacity={opacity}>
    <Segment scale={s} x1={T0} y1={S0} x2={b} y2={S0} color={C.run} width={6} />
    <Segment scale={s} x1={b} y1={S0} x2={b} y2={s2(b)} color={C.rise} width={6} />
  </g>
);

export const slopeAB = (b: number) => (Math.abs(b - T0) < 1e-9 ? 2 * T0 : (s2(b) - S0) / (b - T0));
export const isTangent = (b: number) => Math.abs(b - T0) < 0.0004;

/** Cát tuyến qua A và B (b ≠ 5) hoặc tiếp tuyến (b = 5); progress < 1 thì vẽ dần từ A ra hai phía. */
export const SecantLine: React.FC<{ s: Scale; b: number; opacity?: number; color?: string; progress?: number }> = ({
  s,
  b,
  opacity = 1,
  color,
  progress = 1,
}) => {
  if (progress <= 0) return null;
  const c = color ?? (isTangent(b) ? C.tangent : C.secant);
  if (progress >= 1) return <TangentLine scale={s} x0={T0} y0={S0} slope={slopeAB(b)} color={c} width={5} opacity={opacity} />;
  const half = 2.2 * progress;
  const m = slopeAB(b);
  return <Segment scale={s} x1={T0 - half} y1={S0 - m * half} x2={T0 + half} y2={S0 + m * half} color={c} width={5} opacity={opacity} />;
};

/** Nhãn của đường thẳng qua A. mix < 0.5: phía trên bên trái đường; ngược lại: dưới đường cong, bên phải tiếp tuyến. */
export const LineLabel: React.FC<{ s: Scale; mix: number; opacity?: number; color?: string; children: React.ReactNode }> = ({
  s,
  mix,
  opacity = 1,
  color = C.secant,
  children,
}) => (
  <PlotLabel
    scale={s}
    x={mix < 0.5 ? 5.7 : 5.15}
    y={mix < 0.5 ? 38.5 : 14}
    anchor={mix < 0.5 ? "right" : "left"}
    color={color}
    opacity={opacity}
  >
    {children}
  </PlotLabel>
);
