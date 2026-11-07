import React from "react";
import { colors, fontText } from "./theme";

// Đồng hồ tốc độ: cung 240°. Số ghi NGOÀI vòng vạch, kim NGẮN hơn vòng vạch → kim không bao giờ đè số.
export const Speedometer: React.FC<{
  value: number;
  max: number;
  step: number;
  unit: string;
  size?: number;
  frozen?: number; // 0..1: hiệu ứng "đóng băng thời gian"
  showValue?: boolean;
  style?: React.CSSProperties;
}> = ({ value, max, step, unit, size = 520, frozen = 0, showValue = true, style }) => {
  const c = size / 2;
  const R = size * 0.33; // vòng vạch chia
  const v = Math.min(Math.max(value, 0), max);
  const ang = (x: number) => ((150 + (240 * x) / max) * Math.PI) / 180;
  const pt = (x: number, r: number) => [c + r * Math.cos(ang(x)), c + r * Math.sin(ang(x))];
  const [ax, ay] = pt(0, R);
  const [bx, by] = pt(max, R);
  const [vx, vy] = pt(v, R);
  const ticks: number[] = [];
  for (let x = 0; x <= max + 1e-9; x += step) ticks.push(x);
  const [nx, ny] = pt(v, R * 0.8);
  const frost = `rgba(140, 200, 255, ${0.9 * frozen})`;
  const labelSize = Math.max(28, size * 0.055);

  return (
    <svg width={size} height={size} style={{ overflow: "visible", ...style }}>
      <circle cx={c} cy={c} r={size * 0.49} fill={colors.panel} stroke={frozen > 0 ? frost : colors.grid} strokeWidth={6} />
      <path d={`M${ax},${ay} A${R},${R} 0 1 1 ${bx},${by}`} fill="none" stroke={colors.grid} strokeWidth={size * 0.03} strokeLinecap="round" />
      <path
        d={`M${ax},${ay} A${R},${R} 0 ${(240 * v) / max > 180 ? 1 : 0} 1 ${vx},${vy}`}
        fill="none"
        stroke={colors.accent}
        strokeWidth={size * 0.03}
        strokeLinecap="round"
      />
      {ticks.map((x) => {
        const [x1, y1] = pt(x, R * 1.06);
        const [x2, y2] = pt(x, R * 1.16);
        const [tx, ty] = pt(x, R * 1.32);
        return (
          <g key={x}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.muted} strokeWidth={4} />
            <text
              data-text="tick"
              x={tx}
              y={ty + labelSize * 0.35}
              textAnchor="middle"
              fontFamily={fontText}
              fontSize={labelSize}
              fill={colors.muted}
            >
              {x}
            </text>
          </g>
        );
      })}
      <line x1={c} y1={c} x2={nx} y2={ny} stroke={colors.decrease} strokeWidth={size * 0.018} strokeLinecap="round" />
      <circle cx={c} cy={c} r={size * 0.035} fill={colors.text} />
      {showValue ? (
        <text data-text="value" x={c} y={c + size * 0.25} textAnchor="middle" fontFamily={fontText} fontWeight={800} fontSize={size * 0.12} fill={colors.text}>
          {Math.round(value)}
        </text>
      ) : null}
      <text x={c} y={c + size * 0.33} textAnchor="middle" fontFamily={fontText} fontSize={labelSize} fill={colors.muted}>
        {unit}
      </text>
      {frozen > 0 ? <circle cx={c} cy={c} r={size * 0.49} fill={`rgba(120, 180, 255, ${0.12 * frozen})`} /> : null}
    </svg>
  );
};
