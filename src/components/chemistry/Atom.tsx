import React from "react";
import { useCurrentFrame } from "remotion";
import { ElementData, getElement } from "./CPK";

export interface AtomProps {
  element: string | ElementData;
  x: number;
  y: number;
  scale?: number;
  showSymbol?: boolean;
  oxidationState?: string | number;
  charge?: string;
  glow?: boolean | string;
  vibrate?: number; // Biên độ rung nhiệt (px)
  opacity?: number;
  label?: string;
}

export const Atom: React.FC<AtomProps> = ({
  element,
  x,
  y,
  scale = 1,
  showSymbol = true,
  oxidationState,
  charge,
  glow = false,
  vibrate = 0,
  opacity = 1,
  label,
}) => {
  const frame = useCurrentFrame();
  const el = typeof element === "string" ? getElement(element) : element;

  // Tính toán rung lắc nhiệt nếu có
  let dx = 0;
  let dy = 0;
  if (vibrate > 0) {
    const seed = (x * 13 + y * 7) % 100;
    dx = Math.sin((frame + seed) * 0.4) * vibrate;
    dy = Math.cos((frame + seed * 1.5) * 0.5) * vibrate;
  }

  const cx = x + dx;
  const cy = y + dy;
  const r = el.radius * scale;

  const glowColor = typeof glow === "string" ? glow : "#60A5FA";

  return (
    <g opacity={opacity}>
      {/* Hiệu ứng hào quang (Glow) nếu được bật */}
      {glow && (
        <circle
          cx={cx}
          cy={cy}
          r={r + 12 * scale}
          fill={glowColor}
          opacity={0.35}
          style={{ filter: "blur(8px)" }}
        />
      )}

      {/* Đổ bóng nhẹ phía dưới */}
      <circle
        cx={cx}
        cy={cy + 3 * scale}
        r={r}
        fill="rgba(0, 0, 0, 0.15)"
      />

      {/* Quả cầu nguyên tử chính */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={el.color}
        stroke={el.borderColor}
        strokeWidth={3 * scale}
      />

      {/* Phản xạ ánh sáng điểm nhấn 3D nhẹ nhàng ở góc trên trái */}
      <circle
        cx={cx - r * 0.35}
        cy={cy - r * 0.35}
        r={r * 0.3}
        fill="rgba(255, 255, 255, 0.45)"
      />

      {/* Ký hiệu nguyên tố bên trong */}
      {showSymbol && (
        <text
          x={cx}
          y={cy + (r * 0.35)}
          textAnchor="middle"
          fill={el.textColor}
          fontSize={r * 0.95}
          fontWeight="bold"
          fontFamily="Plus Jakarta Sans, sans-serif"
          style={{ userSelect: "none" }}
        >
          {el.symbol}
        </text>
      )}

      {/* Điện tích / Số oxi hóa hiển thị phía trên đỉnh */}
      {oxidationState !== undefined && (
        <g transform={`translate(${cx}, ${cy - r - 8 * scale})`}>
          <rect
            x={-16 * scale}
            y={-14 * scale}
            width={32 * scale}
            height={16 * scale}
            rx={4 * scale}
            fill="#1E293B"
            opacity={0.85}
          />
          <text
            x={0}
            y={-2 * scale}
            textAnchor="middle"
            fill="#F8FAFC"
            fontSize={12 * scale}
            fontWeight="bold"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            {oxidationState}
          </text>
        </g>
      )}

      {/* Điện tích ion góc trên bên phải (e.g. +, 2-, 3+) */}
      {charge && (
        <text
          x={cx + r * 0.75}
          y={cy - r * 0.55}
          fill={el.textColor}
          fontSize={r * 0.65}
          fontWeight="bold"
          fontFamily="Plus Jakarta Sans, sans-serif"
          style={{ userSelect: "none" }}
        >
          {charge}
        </text>
      )}

      {/* Nhãn mô tả bên dưới nếu có */}
      {label && (
        <text
          x={cx}
          y={cy + r + 22 * scale}
          textAnchor="middle"
          fill="#334155"
          fontSize={14 * scale}
          fontWeight="600"
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          {label}
        </text>
      )}
    </g>
  );
};
