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

export type TacticalForceSpec = {
  id: string;
  x: number; // Toạ độ tâm của đạo quân
  y: number;
  title: string; // Tên đạo quân & tướng chỉ huy, vd: "20 vạn quân Minh (Trương Phụ)"
  color?: string;
  badge?: string; // vd: "TIẾN CÔNG" hoặc "QUÂN ĐOÀN BẮC"
  opacity?: number;
};

/**
 * Thành phần vẽ Chiến luỹ đất & Cọc chông phòng ngự chất lượng cao
 */
export const TacticalFortress: React.FC<{
  x: number;
  y: number;
  width?: number;
  label?: string;
  color?: string;
}> = ({ x, y, width = 320, label = "Chiến lũy Đa Bang", color = "#D97706" }) => {
  const halfW = width / 2;
  const stakeCount = Math.floor(width / 36);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Đổ bóng thành luỹ */}
      <ellipse cx={0} cy={18} rx={halfW + 15} ry={14} fill="rgba(0, 0, 0, 0.45)" filter="blur(4px)" />

      {/* Chân thành đất đắp thoải */}
      <polygon
        points={`${-halfW - 20},24 ${halfW + 20},24 ${halfW + 10},-6 ${-halfW - 10},-6`}
        fill="#78350F"
        opacity={0.85}
      />

      {/* Thân lũy thành đất nện kiên cố */}
      <rect
        x={-halfW}
        y={-14}
        width={width}
        height={28}
        rx={6}
        fill={color}
        stroke="#FDE68A"
        strokeWidth={2.5}
      />

      {/* Hàng chông gỗ phòng thủ vát nhọn phía mặt bắc */}
      {Array.from({ length: stakeCount }).map((_, i) => {
        const sx = -halfW + 18 + i * 36;
        return (
          <g key={i}>
            <polygon
              points={`${sx - 4},-14 ${sx + 4},-14 ${sx},-34`}
              fill="#DC2626"
              stroke="#450A0A"
              strokeWidth={1.5}
            />
            {/* Cọc chéo gia cố chữ X */}
            <line x1={sx - 7} y1={-12} x2={sx + 7} y2={-22} stroke="#7F1D1D" strokeWidth={2.5} />
            <line x1={sx + 7} y1={-12} x2={sx - 7} y2={-22} stroke="#7F1D1D" strokeWidth={2.5} />
          </g>
        );
      })}

      {/* Nhãn Chiến luỹ đặt ở đáy thoáng đãng, không đè lên thành hay sông */}
      {label && (
        <g transform="translate(0, 48)">
          <rect
            x={-130}
            y={-18}
            width={260}
            height={34}
            rx={8}
            fill="rgba(15, 23, 42, 0.92)"
            stroke="#F59E0B"
            strokeWidth={1.5}
          />
          <text
            x={0}
            y={5}
            textAnchor="middle"
            fill="#FEF3C7"
            fontSize={20}
            fontWeight={800}
            fontFamily={fontText}
            letterSpacing={0.5}
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
};

/**
 * Thành phần vẽ Dòng sông tự nhiên uốn lượn mềm mại
 */
export const TacticalRiver: React.FC<{
  d: string;
  name?: string;
  nameX?: number;
  nameY?: number;
}> = ({ d, name, nameX = 1100, nameY = 560 }) => (
  <g>
    {/* Vùng đệm bờ sông */}
    <path d={d} fill="none" stroke="#172554" strokeWidth={52} strokeLinecap="round" opacity={0.6} />
    {/* Dòng sông chính nước sâu */}
    <path d={d} fill="none" stroke="#1D4ED8" strokeWidth={34} strokeLinecap="round" opacity={0.9} />
    {/* Dải sáng phù sa / dòng chảy giữa sông */}
    <path
      d={d}
      fill="none"
      stroke="#60A5FA"
      strokeWidth={6}
      strokeDasharray="28 18"
      strokeLinecap="round"
      opacity={0.65}
    />
    {name && (
      <text
        x={nameX}
        y={nameY}
        fill="#93C5FD"
        fontSize={22}
        fontWeight={700}
        fontFamily={fontText}
        style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.9)" }}
      >
        {name}
      </text>
    )}
  </g>
);

/**
 * Sa bàn Chiến sự Vector (Tactical Map) chuẩn Hero Canvas 1740x800px cho môn Sử.
 * Khắc phục hoàn toàn lỗi sa bàn bị thu bé giữa màn hình và chữ tràn viền.
 */
export const TacticalMap: React.FC<{
  title: string;
  timeTag?: string;
  points?: TacticalMapPoint[];
  arrows?: TacticalArrowSpec[];
  forces?: TacticalForceSpec[];
  children?: React.ReactNode;
  hasTakeaway?: boolean;
}> = ({
  title,
  timeTag,
  points = [],
  arrows = [],
  forces = [],
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
              {/* Vầng hào quang hành quân */}
              <line
                x1={arr.x1}
                y1={arr.y1}
                x2={curX2}
                y2={curY2}
                stroke={tint(arrowColor, 0.3)}
                strokeWidth={strokeWidth + 10}
                strokeLinecap="round"
              />
              {/* Thân mũi tên chính */}
              <line
                x1={arr.x1}
                y1={arr.y1}
                x2={curX2}
                y2={curY2}
                stroke={arrowColor}
                strokeWidth={strokeWidth}
                strokeDasharray={arr.dashed ? "12 8" : undefined}
                strokeLinecap="round"
              />
              {/* Đầu nhọn quân sự chevron sắc bén */}
              {prog > 0.1 && (
                <polygon
                  points={`${curX2},${curY2} ${curX2 - 20},${curY2 - 9} ${curX2 - 14},${curY2} ${curX2 - 20},${curY2 + 9}`}
                  fill={arrowColor}
                  stroke="#FFFFFF"
                  strokeWidth={1.5}
                  transform={`rotate(${angle} ${curX2} ${curY2})`}
                  filter="url(#tactical-glow)"
                />
              )}
            </g>
          );
        })}

        {/* Lớp thẻ lực lượng chiến thuật (Căn giữa, tự co giãn, không bao giờ tràn box) */}
        {forces.map((fc) => {
          const o = fc.opacity ?? 1;
          if (o <= 0) return null;
          const boxColor = fc.color ?? "#EF4444";
          // Tính dynamic width chính xác chống tràn chữ ra khỏi box
          const textLen = fc.title.length;
          const boxW = Math.max(280, textLen * 11.5 + 44);
          const boxH = 46;

          return (
            <g key={fc.id} transform={`translate(${fc.x}, ${fc.y})`} opacity={o}>
              {/* Khối nền thẻ lực lượng */}
              <rect
                x={-boxW / 2}
                y={-boxH / 2}
                width={boxW}
                height={boxH}
                rx={12}
                fill="#0F172A"
                stroke={boxColor}
                strokeWidth={2}
                style={{
                  filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.6))",
                }}
              />
              {/* Dải nhấn quân sự góc trái */}
              <rect
                x={-boxW / 2}
                y={-boxH / 2}
                width={8}
                height={boxH}
                rx={4}
                fill={boxColor}
              />
              {/* Chữ tên lực lượng căn giữa hoàn hảo */}
              <text
                x={4}
                y={6}
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize={19}
                fontWeight={800}
                fontFamily={fontText}
              >
                {fc.title}
              </text>
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
          let textY = pt.y + 8;
          let subY = pt.y + 32;
          let textAnchor: "start" | "end" | "middle" = "start";

          if (anchor === "left") {
            textX = pt.x - 24;
            textAnchor = "end";
          } else if (anchor === "top") {
            textX = pt.x;
            textY = pt.y - 24;
            subY = pt.y - 48;
            textAnchor = "middle";
          } else if (anchor === "bottom") {
            textX = pt.x;
            textY = pt.y + 32;
            subY = pt.y + 56;
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
                y={textY}
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
                  y={subY}
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
