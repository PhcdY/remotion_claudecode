import React from "react";
import { Scale } from "./plot";
import { colors, tint } from "./theme";

/**
 * Flycam nhìn ngang. (x, y) = toạ độ trang của điểm giữa đáy càng.
 * w: bề ngang (px). tilt: độ nghiêng (độ, dương = chúc mũi phải xuống). spin: góc quay cánh.
 * flip: quay mặt sang trái (bay từ phải sang trái).
 */
export const Drone: React.FC<{
  x: number;
  y: number;
  w?: number;
  tilt?: number;
  spin?: number;
  dizzy?: number;
  opacity?: number;
  flip?: boolean;
}> = ({ x, y, w = 220, tilt = 0, spin = 0, dizzy = 0, opacity = 1, flip = false }) => {
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
      <g transform={`${flip ? "scale(-1, 1) " : ""}rotate(${tilt}, 0, -40)`}>
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
