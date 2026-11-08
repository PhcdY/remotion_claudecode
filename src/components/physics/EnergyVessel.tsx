import React from "react";
import { role } from "../roles";
import { colors, halo } from "../theme";
import { MathText } from "../MathText";

export type EnergyVesselProps = {
  /** Tọa độ gốc (góc trên trái của bình) */
  x: number;
  y: number;
  /** Bề rộng cả bình */
  width?: number;
  /** Chiều cao cả bình */
  height?: number;
  /** Tỉ lệ Động năng Wđ (từ 0 đến 1) */
  kineticRatio: number;
  /** Màu động năng (mặc định role.focus hoặc đỏ cam) */
  kineticColor?: string;
  /** Màu thế năng (mặc định role.pairA hoặc xanh lam) */
  potentialColor?: string;
  /** Độ mờ đục */
  opacity?: number;
  /** Hiển thị nhãn công thức Wđ, Wt, W */
  showLabels?: boolean;
};

export const EnergyVessel: React.FC<EnergyVesselProps> = ({
  x,
  y,
  width = 160,
  height = 280,
  kineticRatio,
  kineticColor = role.focus,
  potentialColor = role.pairA,
  opacity = 1,
  showLabels = true,
}) => {
  if (opacity <= 0) return null;

  const kRatio = Math.max(0, Math.min(1, kineticRatio));
  const pRatio = 1 - kRatio;

  const colWidth = (width - 16) / 2;
  const kHeight = (height - 20) * kRatio;
  const pHeight = (height - 20) * pRatio;

  return (
    <g transform={`translate(${x}, ${y})`} opacity={opacity}>
      {/* Khung bình chứa ngoài */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={12}
        fill="#FFFFFF"
        stroke={colors.text}
        strokeWidth={3}
      />

      {/* Vách ngăn ở giữa */}
      <line
        x1={width / 2}
        y1={10}
        x2={width / 2}
        y2={height - 10}
        stroke={colors.axis}
        strokeWidth={2}
        strokeDasharray="4 4"
      />

      {/* Cột 1: Động năng (Wđ) */}
      <rect
        x={6}
        y={height - 8 - kHeight}
        width={colWidth}
        height={kHeight}
        rx={6}
        fill={kineticColor}
        opacity={0.85}
      />

      {/* Cột 2: Thế năng (Wt) */}
      <rect
        x={width / 2 + 2}
        y={height - 8 - pHeight}
        width={colWidth}
        height={pHeight}
        rx={6}
        fill={potentialColor}
        opacity={0.85}
      />

      {/* Vạch mức bảo toàn cơ năng (nét đứt chạy ngang đỉnh) */}
      <line
        x1={4}
        y1={12}
        x2={width - 4}
        y2={12}
        stroke={role.main}
        strokeWidth={3}
        strokeDasharray="3 3"
      />

      {/* Nhãn chú thích */}
      {showLabels ? (
        <>
          {/* Nhãn Cơ năng W bảo toàn ở trên đỉnh */}
          <foreignObject
            x={width / 2 - 80}
            y={-34}
            width={160}
            height={30}
            style={{ overflow: "visible", textAlign: "center" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <MathText
                text="$W = \text{const}$"
                style={{
                  fontSize: 22,
                  color: role.main,
                  fontWeight: 700,
                  textShadow: halo("#FFFFFF"),
                  whiteSpace: "nowrap",
                }}
              />
            </div>
          </foreignObject>

          {/* Nhãn Wđ dưới cột trái */}
          <foreignObject
            x={6}
            y={height + 10}
            width={colWidth}
            height={30}
            style={{ overflow: "visible", textAlign: "center" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <MathText
                text="$W_đ$"
                style={{
                  fontSize: 24,
                  color: kineticColor,
                  fontWeight: 700,
                  textShadow: halo("#FFFFFF"),
                  whiteSpace: "nowrap",
                }}
              />
            </div>
          </foreignObject>

          {/* Nhãn Wt dưới cột phải */}
          <foreignObject
            x={width / 2 + 2}
            y={height + 10}
            width={colWidth}
            height={30}
            style={{ overflow: "visible", textAlign: "center" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <MathText
                text="$W_t$"
                style={{
                  fontSize: 24,
                  color: potentialColor,
                  fontWeight: 700,
                  textShadow: halo("#FFFFFF"),
                  whiteSpace: "nowrap",
                }}
              />
            </div>
          </foreignObject>
        </>
      ) : null}
    </g>
  );
};
