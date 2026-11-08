import React from "react";
import { StagePanel } from "../Card";
import { fontText, tint } from "../theme";

export type TacticalMapPoint = {
  id: string;
  x: number; // 0..1740
  y: number; // 0..800
  label: string;
  sublabel?: string;
  color?: string;
  anchor?: "left" | "right" | "top" | "bottom";
  opacity?: number;
};

export type TacticalArrowSpec = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  color?: string;
  width?: number;
  progress?: number; // 0..1
  dashed?: boolean;
};

/**
 * Sa bàn Chiến sự Vector (Tactical Map) chuẩn Hero Canvas 1740x800px cho môn Sử.
 * Khắc phục hoàn toàn lỗi sa bàn bị thu bé giữa màn hình và chữ tràn viền.
 */
export const TacticalMap: React.FC<{
  title: string;
  timeTag?: string;
  points?: TacticalMapPoint[];
  arrows?: TacticalArrowSpec[];
  children?: React.ReactNode;
  hasTakeaway?: boolean;
}> = ({
  title,
  timeTag,
  points = [],
  arrows = [],
  children,
  hasTakeaway = false,
}) => {
  return (
    <StagePanel
      theme="dark"
      badge="Sa bàn chiến sự"
      badgeColor="#DC2626"
      title={`${title}${timeTag ? ` (${timeTag})` : ""}`}
      hasTakeaway={hasTakeaway}
    >
      <svg
        viewBox="0 0 1740 800"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <defs>
          <filter id="tactical-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#DC2626" floodOpacity="0.6" />
          </filter>
          <marker
            id="red-arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#EF4444" />
          </marker>
        </defs>

        {/* Lớp bản đồ nền / địa hình tùy biến */}
        {children}

        {/* Lớp mũi tên tác chiến động */}
        {arrows.map((arr) => {
          const prog = arr.progress ?? 1;
          const curX2 = arr.x1 + (arr.x2 - arr.x1) * prog;
          const curY2 = arr.y1 + (arr.y2 - arr.y1) * prog;
          const arrowColor = arr.color ?? "#EF4444";
          const strokeWidth = arr.width ?? 6;

          // Tính góc xoay đầu mũi tên
          const angle = (Math.atan2(arr.y2 - arr.y1, arr.x2 - arr.x1) * 180) / Math.PI;

          return (
            <g key={arr.id} opacity={prog > 0.05 ? 1 : 0}>
              {/* Thân mũi tên */}
              <line
                x1={arr.x1}
                y1={arr.y1}
                x2={curX2}
                y2={curY2}
                stroke={arrowColor}
                strokeWidth={strokeWidth}
                strokeDasharray={arr.dashed ? "10 6" : undefined}
                strokeLinecap="round"
              />
              {/* Đầu nhọn mũi tên */}
              {prog > 0.1 && (
                <polygon
                  points={`${curX2},${curY2} ${curX2 - 18},${curY2 - 8} ${curX2 - 18},${curY2 + 8}`}
                  fill={arrowColor}
                  transform={`rotate(${angle} ${curX2} ${curY2})`}
                  filter="url(#tactical-glow)"
                />
              )}
              {/* Nhãn lực lượng tại gốc mũi tên (tránh đè lên mục tiêu tiến công) */}
              {arr.label && (
                <g transform={`translate(${arr.x1}, ${arr.y1 - 18})`}>
                  <rect
                    x={-120}
                    y={-28}
                    width={240}
                    height={36}
                    rx={8}
                    fill="rgba(15, 23, 42, 0.9)"
                    stroke={arrowColor}
                    strokeWidth={1.5}
                  />
                  <text
                    x={0}
                    y={-6}
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize={18}
                    fontWeight={700}
                    fontFamily={fontText}
                  >
                    {arr.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Lớp điểm địa danh & đồn luỹ */}
        {points.map((pt) => {
          const o = pt.opacity ?? 1;
          if (o <= 0) return null;
          const ptColor = pt.color ?? "#F59E0B";
          const anchor = pt.anchor ?? (pt.x > 1400 ? "left" : "right");

          // Tính vị trí text để không tràn viền màn hình
          let textX = pt.x + 24;
          let textAnchor: "start" | "end" | "middle" = "start";
          if (anchor === "left") {
            textX = pt.x - 24;
            textAnchor = "end";
          } else if (anchor === "top") {
            textX = pt.x;
            textAnchor = "middle";
          }

          return (
            <g key={pt.id} opacity={o}>
              {/* Vòng hào quang điểm neo */}
              <circle cx={pt.x} cy={pt.y} r={14} fill={tint(ptColor, 0.25)} />
              <circle cx={pt.x} cy={pt.y} r={7} fill={ptColor} stroke="#FFFFFF" strokeWidth={2} />

              {/* Nhãn địa danh có halo bảo vệ */}
              <text
                x={textX}
                y={anchor === "top" ? pt.y - 22 : pt.y + 6}
                textAnchor={textAnchor}
                fill="#FFFFFF"
                fontSize={24}
                fontWeight={700}
                fontFamily={fontText}
                style={{
                  textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 4px #000000",
                }}
              >
                {pt.label}
              </text>
              {pt.sublabel && (
                <text
                  x={textX}
                  y={anchor === "top" ? pt.y - 46 : pt.y + 28}
                  textAnchor={textAnchor}
                  fill="#94A3B8"
                  fontSize={17}
                  fontWeight={500}
                  fontFamily={fontText}
                >
                  {pt.sublabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </StagePanel>
  );
};
