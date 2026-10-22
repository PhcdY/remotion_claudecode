import React from "react";
import { Card } from "../../components/Card";
import { MathText } from "../../components/MathText";
import { Axes, FunctionPlot, Plot, PlotLabel, Point, Scale, Segment, makeScale } from "../../components/plot";
import { colors, fontSize, fontText, halo, tint } from "../../components/theme";

// ---------------- Mô hình sườn đồi ----------------
/** Độ cao mặt đất (trăm m) tại quãng bay ngang x (km). */
export const h = (x: number) => -x * x * x + 6 * x * x - 9 * x + 6;
/** Đạo hàm h'(x) = -3(x-1)(x-3). */
export const hp = (x: number) => -3 * x * x + 12 * x - 9;
/** Tỉ số (h(x) - h(x0)) / (x - x0). */
export const ratio = (x: number, x0 = 2) => (h(x) - h(x0)) / (x - x0);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Màu theo vai trò, giữ nguyên nghĩa suốt video. */
export const C = {
  up: colors.increase, // leo dốc, h' > 0
  down: colors.decrease, // hạ xuống, h' < 0
  num: colors.c2, // tử: độ cao chênh
  den: colors.c1, // mẫu: quãng bay ngang
  x0: colors.accent, // x1 / x0 và cột của nó
  x: "#0284C7", // x2 / x và cột của nó
  deriv: colors.accent, // đạo hàm
  dim: "#A9B1C7",
  ground: "#7A8499",
};

export const label: React.CSSProperties = {
  fontFamily: fontText,
  fontWeight: 600,
  fontSize: fontSize.label,
  color: colors.text,
};

/** Nhãn HTML đặt tuyệt đối (toạ độ trang), có halo. */
export const Tag: React.FC<{
  x: number;
  y: number;
  anchor?: "center" | "left" | "right";
  color?: string;
  weight?: number;
  size?: number;
  opacity?: number;
  name?: string;
  children: React.ReactNode;
}> = ({ x, y, anchor = "center", color = colors.text, weight = 600, size = fontSize.label, opacity = 1, name = "label", children }) =>
  opacity <= 0 ? null : (
    <div
      data-text={name}
      style={{
        ...label,
        position: "absolute",
        left: x,
        top: y,
        translate: anchor === "center" ? "-50% 0" : anchor === "right" ? "-100% 0" : "0 0",
        whiteSpace: "nowrap",
        color,
        fontWeight: weight,
        fontSize: size,
        opacity,
        textShadow: halo(),
      }}
    >
      {children}
    </div>
  );

/** Nhãn nhỏ dạng viên thuốc ("mô hình", "đề bài"). */
export const Badge: React.FC<{ x: number; y: number; text: string; color?: string; opacity?: number; anchor?: "left" | "right" | "center" }> = ({
  x,
  y,
  text,
  color = colors.brandBlue,
  opacity = 1,
  anchor = "right",
}) =>
  opacity <= 0 ? null : (
    <div
      data-text="badge"
      style={{
        ...label,
        position: "absolute",
        left: x,
        top: y,
        translate: anchor === "center" ? "-50% 0" : anchor === "right" ? "-100% 0" : "0 0",
        padding: "2px 18px",
        borderRadius: 999,
        border: `2px solid ${color}`,
        background: tint(color, 0.08),
        color,
        fontWeight: 700,
        whiteSpace: "nowrap",
        opacity,
      }}
    >
      {text}
    </div>
  );

// ---------------- Flycam ----------------
/**
 * Flycam nhìn ngang. (x, y) = toạ độ trang của điểm giữa đáy càng.
 * w: bề ngang (px). tilt: độ nghiêng (độ, dương = chúc mũi phải xuống). spin: góc quay cánh.
 */
export const Drone: React.FC<{
  x: number;
  y: number;
  w?: number;
  tilt?: number;
  spin?: number;
  dizzy?: number;
  opacity?: number;
}> = ({ x, y, w = 220, tilt = 0, spin = 0, dizzy = 0, opacity = 1 }) => {
  if (opacity <= 0) return null;
  const blade = Math.abs(Math.cos(spin)) * 40 + 6;
  const eye = (cx: number) =>
    dizzy > 0.5 ? (
      <g stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round">
        <line x1={cx - 6} y1={-52} x2={cx + 6} y2={-40} />
        <line x1={cx + 6} y1={-52} x2={cx - 6} y2={-40} />
      </g>
    ) : (
      <g>
        <circle cx={cx} cy={-46} r={9} fill="#FFFFFF" />
        <circle cx={cx + 3} cy={-45} r={4.5} fill={colors.text} />
      </g>
    );
  return (
    <svg
      width={w * 1.3}
      height={w * 0.75}
      viewBox={`${-143 * 1} ${-130} ${286} ${165}`}
      style={{ position: "absolute", left: x - (w * 1.3) / 2, top: y - (w * 0.75 * 130) / 165, overflow: "visible", opacity }}
    >
      <g transform={`rotate(${tilt}, 0, -40)`}>
        {/* tâm điểm đo chồng lấn: khung bao thân */}
        <rect data-mark="drone" x={-60} y={-92} width={120} height={92} fill="none" />
        {/* càng */}
        <g stroke={colors.text} strokeWidth={6} strokeLinecap="round" fill="none">
          <line x1={-34} y1={-24} x2={-50} y2={-2} />
          <line x1={34} y1={-24} x2={50} y2={-2} />
          <line x1={-68} y1={-2} x2={-34} y2={-2} />
          <line x1={34} y1={-2} x2={68} y2={-2} />
        </g>
        {/* tay */}
        <g stroke={colors.text} strokeWidth={10} strokeLinecap="round">
          <line x1={-40} y1={-60} x2={-92} y2={-74} />
          <line x1={40} y1={-60} x2={92} y2={-74} />
          <line x1={-92} y1={-74} x2={-92} y2={-88} />
          <line x1={92} y1={-74} x2={92} y2={-88} />
        </g>
        {/* cánh quạt: đĩa mờ + cánh quay */}
        {[-92, 92].map((cx) => (
          <g key={cx}>
            <ellipse cx={cx} cy={-92} rx={46} ry={7} fill={tint(colors.brandBlue, 0.28)} />
            <line x1={cx - blade} y1={-92} x2={cx + blade} y2={-92} stroke={colors.brandBlue} strokeWidth={6} strokeLinecap="round" />
          </g>
        ))}
        {/* thân */}
        <rect x={-50} y={-70} width={100} height={48} rx={18} fill={colors.text} />
        {eye(-16)}
        {eye(18)}
        {/* camera */}
        <circle cx={0} cy={-14} r={10} fill={colors.muted} />
        <circle cx={3} cy={-14} r={4} fill={colors.brandBlue} />
        {/* sao choáng */}
        {dizzy > 0
          ? [0, 1, 2].map((i) => {
              const a = spin * 0.35 + (i * Math.PI * 2) / 3;
              return (
                <text key={i} x={Math.cos(a) * 54} y={-122 + Math.sin(a) * 10} fontSize={30} textAnchor="middle" fill={colors.warn} opacity={dizzy}>
                  ★
                </text>
              );
            })
          : null}
      </g>
    </svg>
  );
};

/** Góc nghiêng (độ) theo độ dốc trên hình, có giới hạn. */
export const tiltFor = (slopeMath: number, s: Scale, max = 28) => {
  const deg = (Math.atan((slopeMath * s.sy) / s.sx) * 180) / Math.PI;
  return -Math.max(-max, Math.min(max, deg));
};

// ---------------- CẢNH 1: sườn đồi nhìn ngang ----------------
export const HILL = { top: 160, width: 1120, height: 530 };
export const HS: Scale = makeScale({ xMin: -0.15, xMax: 4.15, yMin: 0, yMax: 10, width: HILL.width, height: HILL.height });
export const hillLeft = (mix: number) => lerp(400, 120, mix);
/** Độ cao đáy flycam so với mặt đất (đơn vị trăm m trên hình; nhãn ghi 50 m). */
export const DRONE_GAP = 0.8;

export const Hill: React.FC<{
  mix: number;
  opacity?: number;
  faint?: number;
  segments?: { a: number; b: number; color: string; opacity: number }[];
  children?: (s: Scale, left: number) => React.ReactNode;
}> = ({ mix, opacity = 1, faint = 0, segments = [], children }) => {
  const s = HS;
  const left = hillLeft(mix);
  let d = `M${s.x(s.xMin)},${s.y(0)} `;
  for (let i = 0; i <= 200; i++) {
    const x = s.xMin + ((s.xMax - s.xMin) * i) / 200;
    d += `L${s.x(x).toFixed(1)},${s.y(h(x)).toFixed(1)} `;
  }
  d += `L${s.x(s.xMax)},${s.y(0)} Z`;
  return (
    <>
      <Plot scale={s} left={left} top={HILL.top} style={{ opacity }}>
        <path d={d} fill={tint(C.ground, 0.16 * (1 - faint))} stroke="none" />
        <FunctionPlot scale={s} f={h} color={faint > 0.5 ? C.dim : C.ground} width={faint > 0.5 ? 3 : 6} opacity={1 - 0.5 * faint} />
        {segments.map((g, i) =>
          g.opacity > 0 ? <FunctionPlot key={i} scale={s} f={h} from={g.a} to={g.b} color={g.color} width={10} opacity={g.opacity} /> : null,
        )}
      </Plot>
      {children ? children(s, left) : null}
    </>
  );
};

/** Flycam bay bám sườn đồi tại quãng x, kèm vạch đo khoảng cách tới mặt đất. */
export const HillDrone: React.FC<{ mix: number; x: number; spin: number; gauge?: number; opacity?: number; showLabel?: boolean }> = ({
  mix,
  x,
  spin,
  gauge = 1,
  opacity = 1,
  showLabel = true,
}) => {
  const s = HS;
  const left = hillLeft(mix);
  const px = left + s.x(x);
  const ground = HILL.top + s.y(h(x));
  const bottom = HILL.top + s.y(h(x) + DRONE_GAP);
  return (
    <>
      {gauge > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: gauge * opacity }}>
          <line x1={px} y1={bottom + 6} x2={px} y2={ground - 4} stroke={colors.accent} strokeWidth={4} strokeDasharray="8 7" />
        </svg>
      ) : null}
      <Tag x={px + 78} y={bottom - 4} anchor="left" color={colors.accent} weight={700} opacity={showLabel ? gauge * opacity : 0}>
        50 m
      </Tag>
      <Drone x={px} y={bottom} w={220} tilt={tiltFor(hp(x), s)} spin={spin} opacity={opacity} />
    </>
  );
};

// ---------------- CẢNH 2: đồ thị h trên hệ trục ----------------
export const G = { top: 160, width: 780, height: 400 };
export const GS: Scale = makeScale({ xMin: 0, xMax: 4.4, yMin: 0, yMax: 7.5, width: G.width, height: G.height });
export const GPOS = { center: 570, left: 190, right: 720 };

export const Graph: React.FC<{
  left: number;
  axes?: number;
  curve?: number;
  curveOpacity?: number;
  hideX?: number[];
  model?: number;
  children?: (s: Scale) => React.ReactNode;
  overlay?: (s: Scale) => React.ReactNode;
}> = ({ left, axes = 1, curve = 1, curveOpacity = 1, hideX = [], model = 1, children, overlay }) => {
  const s = GS;
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
          <PlotLabel scale={s} x={2.2} y={0} dy={88} anchor="top" opacity={axes}>
            <MathText text="quãng bay ngang $x$" />
          </PlotLabel>
          {model > 0 ? (
            <PlotLabel scale={s} x={s.xMax} y={s.yMax} dy={-26} anchor="right" color={colors.brandBlue} opacity={model * axes}>
              <span style={{ padding: "0 14px", border: `2px solid ${colors.brandBlue}`, borderRadius: 999, background: tint(colors.brandBlue, 0.08), fontWeight: 700 }}>
                mô hình
              </span>
            </PlotLabel>
          ) : null}
          {overlay ? overlay(s) : null}
        </>
      }
    >
      <g opacity={axes}>
        <Axes scale={s} xTicks={[1, 2, 3, 4]} yTicks={[1, 2, 3, 4, 5, 6, 7]} xLabel="" yLabel="" hideXLabels={hideX} />
      </g>
      {curve > 0 ? <FunctionPlot scale={s} f={h} from={0} to={4} progress={curve} opacity={curveOpacity} /> : null}
      {children ? children(s) : null}
    </Plot>
  );
};

/** Đoạn đồ thị h tô màu trên [a, b]. */
export const CurvePart: React.FC<{ s: Scale; a: number; b: number; color: string; opacity?: number; width?: number }> = ({
  s,
  a,
  b,
  color,
  opacity = 1,
  width = 10,
}) => (opacity <= 0 ? null : <FunctionPlot scale={s} f={h} from={a} to={b} color={color} width={width} opacity={opacity} />);

/** Đoạn tô trên trục ngang [a, b]. */
export const AxisPart: React.FC<{ s: Scale; a: number; b: number; color: string; opacity?: number }> = ({ s, a, b, color, opacity = 1 }) =>
  opacity <= 0 ? null : <Segment scale={s} x1={a} y1={0} x2={b} y2={0} color={color} width={12} opacity={opacity} />;

/** Cột dọc từ trục ngang lên đồ thị tại x. */
export const Col: React.FC<{ s: Scale; x: number; color: string; opacity?: number; width?: number }> = ({ s, x, color, opacity = 1, width = 9 }) =>
  opacity <= 0 ? null : <Segment scale={s} x1={x} y1={0} x2={x} y2={h(x)} color={color} width={width} opacity={opacity} />;

/** Mũi tên ngắn chạy dọc đường cong tại x (hướng theo chiều x tăng), lệch lên phía trên đường. */
export const CurveArrow: React.FC<{ s: Scale; x: number; color: string; opacity?: number; len?: number; off?: number }> = ({
  s,
  x,
  color,
  opacity = 1,
  len = 64,
  off = 26,
}) => {
  if (opacity <= 0) return null;
  const dx = s.sx;
  const dy = -hp(x) * s.sy;
  const n = Math.hypot(dx, dy);
  const ux = dx / n;
  const uy = dy / n;
  // pháp tuyến hướng lên trên
  const nx = uy;
  const ny = -ux;
  const sign = ny < 0 ? 1 : -1;
  const cx = s.x(x) + nx * off * sign;
  const cy = s.y(h(x)) + ny * off * sign;
  const x1 = cx - (ux * len) / 2;
  const y1 = cy - (uy * len) / 2;
  const x2 = cx + (ux * len) / 2;
  const y2 = cy + (uy * len) / 2;
  const hx = -ux * 18;
  const hy = -uy * 18;
  return (
    <g opacity={opacity} stroke={color} strokeWidth={6} strokeLinecap="round" fill="none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <line x1={x2} y1={y2} x2={x2 + hx - uy * 12} y2={y2 + hy + ux * 12} />
      <line x1={x2} y1={y2} x2={x2 + hx + uy * 12} y2={y2 + hy - ux * 12} />
    </g>
  );
};

/** Nhãn ký hiệu dưới trục ngang tại x. */
export const AxisLabel: React.FC<{ s: Scale; x: number; text: string; color: string; opacity?: number }> = ({ s, x, text, color, opacity = 1 }) => (
  <PlotLabel scale={s} x={x} y={0} dy={16} anchor="top" color={color} opacity={opacity}>
    <MathText text={text} />
  </PlotLabel>
);

export const AxisDot: React.FC<{ s: Scale; x: number; color: string; opacity?: number }> = ({ s, x, color, opacity = 1 }) =>
  opacity <= 0 ? null : <Point scale={s} x={x} y={0} r={9} color={color} opacity={opacity} />;

// ---------------- Thẻ bên phải ----------------
export const PANEL = { left: 1040, width: 790 };

export const PanelCard: React.FC<{ top: number; left?: number; width?: number; opacity?: number; children: React.ReactNode; group?: string }> = ({
  top,
  left = PANEL.left,
  width = PANEL.width,
  opacity = 1,
  children,
  group,
}) =>
  opacity <= 0 ? null : (
    <Card group={group} style={{ left, top, width, padding: "18px 28px", opacity }}>
      {children}
    </Card>
  );

/** KaTeX tô màu một cụm. */
export const col = (color: string | null, t: string) => (color ? `\\textcolor{${color}}{${t}}` : t);
