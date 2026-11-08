import React from "react";

export type BondType =
  | "single"
  | "double"
  | "triple"
  | "hydrogen"
  | "ionic"
  | "electron-pair";

export interface ChemicalBondProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  type?: BondType;
  color?: string;
  width?: number;
  progress?: number; // 0 -> 1 (hoạt ảnh kéo dài hoặc hình thành)
  opacity?: number;
  label?: string;
}

export const ChemicalBond: React.FC<ChemicalBondProps> = ({
  from,
  to,
  type = "single",
  color = "#64748B",
  width = 6,
  progress = 1,
  opacity = 1,
  label,
}) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) return null;

  const currentLength = length * progress;
  const unitX = dx / length;
  const unitY = dy / length;

  // Điểm cuối hiện tại theo progress
  const targetX = from.x + unitX * currentLength;
  const targetY = from.y + unitY * currentLength;

  // Vectơ pháp tuyến vuông góc (khoảng cách giữa các vạch liên kết đôi/ba)
  const normX = -unitY;
  const normY = unitX;

  const midX = (from.x + targetX) / 2;
  const midY = (from.y + targetY) / 2;

  const renderBondLines = () => {
    switch (type) {
      case "double": {
        const gap = width * 1.2;
        return (
          <>
            <line
              x1={from.x + normX * gap}
              y1={from.y + normY * gap}
              x2={targetX + normX * gap}
              y2={targetY + normY * gap}
              stroke={color}
              strokeWidth={width}
              strokeLinecap="round"
            />
            <line
              x1={from.x - normX * gap}
              y1={from.y - normY * gap}
              x2={targetX - normX * gap}
              y2={targetY - normY * gap}
              stroke={color}
              strokeWidth={width}
              strokeLinecap="round"
            />
          </>
        );
      }
      case "triple": {
        const gap = width * 1.6;
        return (
          <>
            <line
              x1={from.x}
              y1={from.y}
              x2={targetX}
              y2={targetY}
              stroke={color}
              strokeWidth={width}
              strokeLinecap="round"
            />
            <line
              x1={from.x + normX * gap}
              y1={from.y + normY * gap}
              x2={targetX + normX * gap}
              y2={targetY + normY * gap}
              stroke={color}
              strokeWidth={width}
              strokeLinecap="round"
            />
            <line
              x1={from.x - normX * gap}
              y1={from.y - normY * gap}
              x2={targetX - normX * gap}
              y2={targetY - normY * gap}
              stroke={color}
              strokeWidth={width}
              strokeLinecap="round"
            />
          </>
        );
      }
      case "hydrogen": {
        return (
          <line
            x1={from.x}
            y1={from.y}
            x2={targetX}
            y2={targetY}
            stroke={color}
            strokeWidth={width * 0.8}
            strokeDasharray={`${width * 1.5}, ${width * 1.2}`}
            strokeLinecap="round"
          />
        );
      }
      case "electron-pair": {
        // Cặp chấm electron chung phát sáng
        const dotGap = width * 1.5;
        const dotRadius = width * 0.9;
        return (
          <g>
            <circle
              cx={midX + normX * dotGap}
              cy={midY + normY * dotGap}
              r={dotRadius}
              fill="#F59E0B"
            />
            <circle
              cx={midX - normX * dotGap}
              cy={midY - normY * dotGap}
              r={dotRadius}
              fill="#F59E0B"
            />
            <circle
              cx={midX}
              cy={midY}
              r={dotGap * 2}
              fill="#F59E0B"
              opacity={0.15}
              style={{ filter: "blur(4px)" }}
            />
          </g>
        );
      }
      case "ionic": {
        return (
          <line
            x1={from.x}
            y1={from.y}
            x2={targetX}
            y2={targetY}
            stroke={color}
            strokeWidth={width * 0.7}
            strokeDasharray="4, 4"
            opacity={0.7}
          />
        );
      }
      case "single":
      default: {
        return (
          <line
            x1={from.x}
            y1={from.y}
            x2={targetX}
            y2={targetY}
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
          />
        );
      }
    }
  };

  return (
    <g opacity={opacity}>
      {renderBondLines()}
      {label && (
        <text
          x={midX + normX * (width * 2.5)}
          y={midY + normY * (width * 2.5)}
          textAnchor="middle"
          fill="#475569"
          fontSize={13}
          fontWeight="600"
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          {label}
        </text>
      )}
    </g>
  );
};
