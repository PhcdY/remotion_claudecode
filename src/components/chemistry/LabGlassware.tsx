import React from "react";
import { useCurrentFrame } from "remotion";

export interface LabGlasswareProps {
  type?: "test-tube" | "beaker" | "erlenmeyer";
  x: number;
  y: number;
  width?: number;
  height?: number;
  liquidLevel?: number; // 0 (rỗng) -> 1 (đầy)
  liquidColor?: string;
  liquidOpacity?: number;
  bubbles?: boolean | number;
  precipitate?: {
    color?: string;
    height?: number; // Chiều cao lớp kết tủa dưới đáy
  };
  mirrorLayer?: {
    color?: string;
    thickness?: number;
  };
  label?: string;
  opacity?: number;
}

export const LabGlassware: React.FC<LabGlasswareProps> = ({
  type = "test-tube",
  x,
  y,
  width = 70,
  height = 200,
  liquidLevel = 0.5,
  liquidColor = "#60A5FA",
  liquidOpacity = 0.65,
  bubbles = false,
  precipitate,
  mirrorLayer,
  label,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();

  const numBubbles = typeof bubbles === "number" ? bubbles : bubbles ? 8 : 0;

  // Tính toán tọa độ và kích thước
  const halfW = width / 2;
  const bottomR = type === "test-tube" ? halfW : 6;
  const liquidH = (height - bottomR) * Math.min(1, Math.max(0, liquidLevel));
  const liquidY = y + height - bottomR - liquidH;

  return (
    <g opacity={opacity} transform={`translate(${x}, ${y})`}>
      {/* 1. LỚP CHẤT LỎNG BÊN TRONG */}
      {liquidLevel > 0 && (
        <g>
          {type === "test-tube" ? (
            <path
              d={`
                M ${-halfW + 4} ${liquidY - y}
                L ${halfW - 4} ${liquidY - y}
                L ${halfW - 4} ${height - bottomR}
                A ${halfW - 4} ${bottomR - 4} 0 0 1 ${-halfW + 4} ${height - bottomR}
                Z
              `}
              fill={liquidColor}
              opacity={liquidOpacity}
            />
          ) : type === "beaker" ? (
            <path
              d={`
                M ${-halfW + 4} ${liquidY - y}
                L ${halfW - 4} ${liquidY - y}
                L ${halfW - 4} ${height - 6}
                A 4 4 0 0 1 ${halfW - 8} ${height - 2}
                L ${-halfW + 8} ${height - 2}
                A 4 4 0 0 1 ${-halfW + 4} ${height - 6}
                Z
              `}
              fill={liquidColor}
              opacity={liquidOpacity}
            />
          ) : (
            // Erlenmeyer Flask
            <polygon
              points={`
                ${-halfW * 0.4} ${liquidY - y},
                ${halfW * 0.4} ${liquidY - y},
                ${halfW - 4} ${height - 6},
                ${-halfW + 4} ${height - 6}
              `}
              fill={liquidColor}
              opacity={liquidOpacity}
            />
          )}

          {/* Đường meniscus mặt cong chất lỏng */}
          <ellipse
            cx={0}
            cy={liquidY - y}
            rx={type === "test-tube" ? halfW - 4 : halfW - 6}
            ry={4}
            fill={liquidColor}
            opacity={Math.min(1, liquidOpacity + 0.2)}
          />
        </g>
      )}

      {/* 2. BỌT KHÍ SỦI LÊN (Bong bóng nổi) */}
      {numBubbles > 0 && liquidLevel > 0 && (
        <g>
          {Array.from({ length: numBubbles }).map((_, i) => {
            const seed = i * 47;
            const bX =
              ((seed % (width - 24)) - (width - 24) / 2) * 0.8;
            const speed = 1.2 + (seed % 10) * 0.15;
            const totalTravel = liquidH;
            const bubbleYOffset =
              (height - bottomR - ((frame * speed + seed * 8) % totalTravel));
            const bubbleR = 2.5 + (seed % 3);
            const bOpacity = Math.sin(
              ((frame * speed + seed * 8) % totalTravel) / totalTravel * Math.PI
            );

            return (
              <circle
                key={i}
                cx={bX}
                cy={bubbleYOffset}
                r={bubbleR}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={1.5}
                opacity={Math.max(0, bOpacity * 0.8)}
              />
            );
          })}
        </g>
      )}

      {/* 3. LỚP KẾT TỦA DƯỚI ĐÁY */}
      {precipitate && (
        <path
          d={`
            M ${-halfW + 6} ${height - bottomR - (precipitate.height || 18)}
            Q 0 ${height - bottomR - (precipitate.height || 18) + 4} ${halfW - 6} ${height - bottomR - (precipitate.height || 18)}
            L ${halfW - 6} ${height - bottomR}
            A ${halfW - 6} ${bottomR - 6} 0 0 1 ${-halfW + 6} ${height - bottomR}
            Z
          `}
          fill={precipitate.color || "#F8FAFC"}
          opacity={0.9}
        />
      )}

      {/* 4. LỚP TRÁNG GƯƠNG BẠC SÁNG BÓNG (Tollens silver mirror) */}
      {mirrorLayer && (
        <g>
          <path
            d={`
              M ${-halfW + 3} ${liquidY - y}
              L ${-halfW + 3} ${height - bottomR}
              A ${halfW - 3} ${bottomR - 3} 0 0 0 ${halfW - 3} ${height - bottomR}
              L ${halfW - 3} ${liquidY - y}
            `}
            fill="none"
            stroke={mirrorLayer.color || "#E2E8F0"}
            strokeWidth={mirrorLayer.thickness || 5}
            strokeLinecap="round"
            opacity={0.85}
          />
          {/* Vệt sáng ánh kim */}
          <line
            x1={-halfW + 7}
            y1={liquidY - y + 10}
            x2={-halfW + 7}
            y2={height - bottomR - 10}
            stroke="#FFFFFF"
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.7}
          />
        </g>
      )}

      {/* 5. THÀNH THỦY TINH CỦA DỤNG CỤ (Glass Outline) */}
      {type === "test-tube" ? (
        <path
          d={`
            M ${-halfW - 4} 0
            L ${-halfW} 0
            L ${-halfW} ${height - bottomR}
            A ${halfW} ${bottomR} 0 0 0 ${halfW} ${height - bottomR}
            L ${halfW} 0
            L ${halfW + 4} 0
          `}
          fill="none"
          stroke="#94A3B8"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      ) : type === "beaker" ? (
        <path
          d={`
            M ${-halfW - 6} 0
            L ${-halfW} 0
            L ${-halfW} ${height - 6}
            A 6 6 0 0 0 ${-halfW + 6} ${height}
            L ${halfW - 6} ${height}
            A 6 6 0 0 0 ${halfW} ${height - 6}
            L ${halfW} 0
            L ${halfW + 4} 0
          `}
          fill="none"
          stroke="#94A3B8"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      ) : (
        // Erlenmeyer Flask
        <path
          d={`
            M ${-halfW * 0.3 - 4} 0
            L ${halfW * 0.3 + 4} 0
            M ${-halfW * 0.3} 0
            L ${-halfW * 0.3} ${height * 0.25}
            L ${-halfW} ${height - 6}
            A 6 6 0 0 0 ${-halfW + 6} ${height}
            L ${halfW - 6} ${height}
            A 6 6 0 0 0 ${halfW} ${height - 6}
            L ${halfW * 0.3} ${height * 0.25}
            L ${halfW * 0.3} 0
          `}
          fill="none"
          stroke="#94A3B8"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      )}

      {/* Phản xạ ánh sáng trên thành kính thủy tinh */}
      <line
        x1={halfW - 6}
        y1={15}
        x2={halfW - 6}
        y2={height - bottomR - 15}
        stroke="#FFFFFF"
        strokeWidth={2}
        opacity={0.4}
        strokeLinecap="round"
      />

      {/* 6. NHÃN BÊN DƯỚI NẾU CÓ */}
      {label && (
        <text
          x={0}
          y={height + 26}
          textAnchor="middle"
          fill="#334155"
          fontSize={15}
          fontWeight="600"
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          {label}
        </text>
      )}
    </g>
  );
};
