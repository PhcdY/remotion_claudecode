import React from "react";
import { fontText } from "../theme";

export interface DNAHelixProps {
  progress?: number;
  width?: number;
  height?: number;
  numBasePairs?: number;
  showLabels?: boolean;
}

export const DNAHelix: React.FC<DNAHelixProps> = ({
  progress = 0,
  width = 500,
  height = 500,
  numBasePairs = 10,
  showLabels = true,
}) => {
  const cx = width / 2;
  const pairHeight = height / (numBasePairs + 1);

  // Dữ liệu các cặp base bổ sung A-T, G-C
  const baseTypes = [
    { left: "A", right: "T", colorL: "#3B82F6", colorR: "#F97316", bonds: 2 },
    { left: "G", right: "C", colorL: "#EAB308", colorR: "#10B981", bonds: 3 },
    { left: "T", right: "A", colorL: "#F97316", colorR: "#3B82F6", bonds: 2 },
    { left: "C", right: "G", colorL: "#10B981", colorR: "#EAB308", bonds: 3 },
  ];

  // Tính toán tọa độ các điểm neo
  const leftPoints = Array.from({ length: numBasePairs }).map((_, i) => {
    const y = (i + 1) * pairHeight;
    const angle = (i * 0.6 + progress * Math.PI * 2);
    const x = cx - Math.sin(angle) * 110;
    return { x, y };
  });

  const rightPoints = Array.from({ length: numBasePairs }).map((_, i) => {
    const y = (i + 1) * pairHeight;
    const angle = (i * 0.6 + progress * Math.PI * 2);
    const x = cx + Math.sin(angle) * 110;
    return { x, y };
  });

  // Tạo đường dẫn cong mượt (Smooth Bezier) qua các điểm
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cy1 = p0.y + (p1.y - p0.y) * 0.5;
      const cy2 = p1.y - (p1.y - p0.y) * 0.5;
      d += ` C ${p0.x} ${cy1}, ${p1.x} ${cy2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const leftPath = generateSmoothPath(leftPoints);
  const rightPath = generateSmoothPath(rightPoints);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="dnaShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#3B82F6" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* 1. Các cặp base liên kết với nhau bằng cầu nối hydrogen */}
        {Array.from({ length: numBasePairs }).map((_, i) => {
          const lp = leftPoints[i];
          const rp = rightPoints[i];
          const basePair = baseTypes[i % baseTypes.length];

          return (
            <g key={`bp-${i}`} filter="url(#dnaShadow)">
              {/* Cầu liên kết hydrogen nối 2 base */}
              <line
                x1={lp.x}
                y1={lp.y}
                x2={rp.x}
                y2={rp.y}
                stroke="#94A3B8"
                strokeWidth={basePair.bonds === 3 ? 3.5 : 2}
                strokeDasharray="4 3"
              />

              {/* Base bên trái */}
              <circle cx={lp.x} cy={lp.y} r="14" fill={basePair.colorL} stroke="#FFFFFF" strokeWidth="2" />
              <text
                x={lp.x}
                y={lp.y + 4}
                textAnchor="middle"
                fill="#FFFFFF"
                fontFamily={fontText}
                fontSize="12"
                fontWeight="800"
              >
                {basePair.left}
              </text>

              {/* Base bên phải */}
              <circle cx={rp.x} cy={rp.y} r="14" fill={basePair.colorR} stroke="#FFFFFF" strokeWidth="2" />
              <text
                x={rp.x}
                y={rp.y + 4}
                textAnchor="middle"
                fill="#FFFFFF"
                fontFamily={fontText}
                fontSize="12"
                fontWeight="800"
              >
                {basePair.right}
              </text>
            </g>
          );
        })}

        {/* 2. Hai dải khung đường - phosphate uốn lượn liên tục, mượt mà */}
        <path d={leftPath} fill="none" stroke="#3D4AEF" strokeWidth="5.5" strokeLinecap="round" />
        <path d={rightPath} fill="none" stroke="#6366F1" strokeWidth="5.5" strokeLinecap="round" />

        {/* 3. Bảng chú thích mã base ở góc */}
        {showLabels && (
          <g transform={`translate(${cx}, ${height + 25})`} fontFamily={fontText} fontSize="12" fontWeight="700">
            <g transform="translate(-160, 0)">
              <circle cx="0" cy="-4" r="6" fill="#3B82F6" />
              <text x="12" y="0" fill="#0E1046">
                Adenine (A)
              </text>
            </g>
            <g transform="translate(-60, 0)">
              <circle cx="0" cy="-4" r="6" fill="#F97316" />
              <text x="12" y="0" fill="#0E1046">
                Thymine (T)
              </text>
            </g>
            <g transform="translate(40, 0)">
              <circle cx="0" cy="-4" r="6" fill="#EAB308" />
              <text x="12" y="0" fill="#0E1046">
                Guanine (G)
              </text>
            </g>
            <g transform="translate(140, 0)">
              <circle cx="0" cy="-4" r="6" fill="#10B981" />
              <text x="12" y="0" fill="#0E1046">
                Cytosine (C)
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
