import React from "react";
import { role } from "../roles";
import { colors, halo } from "../theme";
import { MathText } from "../MathText";

export type PhysicsSpringProps = {
  /** Đầu cố định (điểm tựa/gắn giá) */
  from: { x: number; y: number };
  /** Đầu di động (gắn vật nặng) */
  to: { x: number; y: number };
  /** Số vòng xoắn zíc-zắc */
  coils?: number;
  /** Bề rộng zíc-zắc của thân lò xo (pixel) */
  width?: number;
  /** Màu lò xo */
  color?: string;
  /** Độ dày nét lò xo */
  strokeWidth?: number;
  /** Chiều dài đoạn nối thẳng ở 2 đầu */
  leadLength?: number;
  /** Độ mờ đục */
  opacity?: number;
  /** Vẽ giá đỡ cố định ở đầu `from` có các vạch gạch chéo */
  hasWallMount?: boolean;
  /** Hướng giá đỡ nếu có */
  wallSide?: "left" | "right" | "top" | "bottom";
  /** Khối vật nặng $m$ gắn ở đầu `to` (tuỳ chọn) */
  massBlock?: {
    size?: number;
    color?: string;
    label?: string;
  };
};

export const PhysicsSpring: React.FC<PhysicsSpringProps> = ({
  from,
  to,
  coils = 10,
  width = 24,
  color = colors.text,
  strokeWidth = 4,
  leadLength = 20,
  opacity = 1,
  hasWallMount = false,
  wallSide = "left",
  massBlock,
}) => {
  if (opacity <= 0) return null;

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const totalLength = Math.hypot(dx, dy);

  // Vector đơn vị dọc trục lò xo
  const ux = dx / (totalLength || 1);
  const uy = dy / (totalLength || 1);

  // Vector pháp tuyến vuông góc trục lò xo
  const nx = -uy;
  const ny = ux;

  // Tính các điểm zíc-zắc
  const activeLength = Math.max(totalLength - 2 * leadLength, 20);
  const startSpringX = from.x + ux * leadLength;
  const startSpringY = from.y + uy * leadLength;

  const points: { x: number; y: number }[] = [];

  points.push(from);
  points.push({ x: startSpringX, y: startSpringY });

  for (let i = 0; i < coils * 2; i++) {
    const fraction = (i + 0.5) / (coils * 2);
    const px = startSpringX + ux * activeLength * fraction;
    const py = startSpringY + uy * activeLength * fraction;
    const side = i % 2 === 0 ? 1 : -1;

    points.push({
      x: px + nx * (width / 2) * side,
      y: py + ny * (width / 2) * side,
    });
  }

  const endSpringX = from.x + ux * (totalLength - leadLength);
  const endSpringY = from.y + uy * (totalLength - leadLength);
  points.push({ x: endSpringX, y: endSpringY });
  points.push(to);

  const pathData = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Kích thước vật nặng nếu có
  const blockSize = massBlock?.size ?? 48;
  const blockColor = massBlock?.color ?? role.main;

  return (
    <g opacity={opacity}>
      {/* Giá gắn tường cố định nếu có */}
      {hasWallMount ? (
        <g stroke={colors.axis} strokeWidth={3} strokeLinecap="round">
          {wallSide === "left" || wallSide === "right" ? (
            <>
              <line x1={from.x} y1={from.y - 35} x2={from.x} y2={from.y + 35} strokeWidth={5} />
              {[-30, -15, 0, 15, 30].map((offset) => (
                <line
                  key={offset}
                  x1={from.x}
                  y1={from.y + offset}
                  x2={from.x - (wallSide === "left" ? 14 : -14)}
                  y2={from.y + offset + 10}
                />
              ))}
            </>
          ) : (
            <>
              <line x1={from.x - 35} y1={from.y} x2={from.x + 35} y2={from.y} strokeWidth={5} />
              {[-30, -15, 0, 15, 30].map((offset) => (
                <line
                  key={offset}
                  x1={from.x + offset}
                  y1={from.y}
                  x2={from.x + offset - 10}
                  y2={from.y - (wallSide === "top" ? 14 : -14)}
                />
              ))}
            </>
          )}
        </g>
      ) : null}

      {/* Đường vẽ thân lò xo zíc-zắc */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Chốt tròn ở 2 đầu */}
      <circle cx={from.x} cy={from.y} r={strokeWidth + 1} fill={color} />
      <circle cx={to.x} cy={to.y} r={strokeWidth + 1} fill={color} />

      {/* Khối vật nặng $m$ gắn ở đầu di động nếu có */}
      {massBlock ? (
        <g transform={`translate(${to.x}, ${to.y})`}>
          <rect
            x={-blockSize / 2}
            y={-blockSize / 2}
            width={blockSize}
            height={blockSize}
            rx={8}
            fill={blockColor}
            stroke={colors.text}
            strokeWidth={3}
          />
          {massBlock.label ? (
            <foreignObject
              x={-blockSize / 2}
              y={-blockSize / 2}
              width={blockSize}
              height={blockSize}
              style={{ overflow: "visible" }}
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
                  text={massBlock.label}
                  style={{
                    fontSize: 24,
                    color: "#FFFFFF",
                    fontWeight: 700,
                    textShadow: halo("rgba(0,0,0,0.4)"),
                    whiteSpace: "nowrap",
                  }}
                />
              </div>
            </foreignObject>
          ) : null}
        </g>
      ) : null}
    </g>
  );
};
