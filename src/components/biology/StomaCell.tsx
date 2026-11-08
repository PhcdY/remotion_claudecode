import React from "react";
import { fontText } from "../theme";

export interface StomaCellProps {
  /** 0 = đóng hoàn toàn, 1 = mở rộng tối đa */
  openProgress: number;
  width?: number;
  height?: number;
  showLabels?: boolean;
  showWaterVapor?: boolean;
  showCO2?: boolean;
}

export const StomaCell: React.FC<StomaCellProps> = ({
  openProgress,
  width = 660,
  height = 520,
  showLabels = true,
  showWaterVapor = true,
  showCO2 = true,
}) => {
  const aperture = Math.max(0, Math.min(1, openProgress));

  // Tọa độ tâm
  const cx = width / 2;
  const cy = height / 2 - 10;

  // Cực trên và cực dưới nơi 2 tế bào hạt đậu tiếp giáp nhau
  const topY = cy - 180;
  const bottomY = cy + 180;

  // Khe khí khổng: khi mở (aperture = 1), mép trong dạt ra mỗi bên 32px (khe rộng 64px)
  const innerOffset = aperture * 32;

  // Thành ngoài: khi no nước phồng ra thêm 30px
  const outerOffset = 95 + aperture * 30;

  // Đường cong tế bào hạt đậu bên TRÁI
  // Điểm cực trên (cx, topY) -> Thành ngoài uốn cong qua (cx - outerOffset, cy) -> Cực dưới (cx, bottomY)
  // Quay về: Thành trong uốn cong qua (cx - innerOffset, cy) -> Cực trên (cx, topY)
  const leftCellPath = `
    M ${cx} ${topY}
    C ${cx - outerOffset * 0.9} ${cy - 120}, ${cx - outerOffset} ${cy - 50}, ${cx - outerOffset} ${cy}
    C ${cx - outerOffset} ${cy + 50}, ${cx - outerOffset * 0.9} ${cy + 120}, ${cx} ${bottomY}
    C ${cx - innerOffset * 0.8} ${cy + 110}, ${cx - innerOffset} ${cy + 50}, ${cx - innerOffset} ${cy}
    C ${cx - innerOffset} ${cy - 50}, ${cx - innerOffset * 0.8} ${cy - 110}, ${cx} ${topY}
    Z
  `;

  // Đường cong tế bào hạt đậu bên PHẢI
  const rightCellPath = `
    M ${cx} ${topY}
    C ${cx + outerOffset * 0.9} ${cy - 120}, ${cx + outerOffset} ${cy - 50}, ${cx + outerOffset} ${cy}
    C ${cx + outerOffset} ${cy + 50}, ${cx + outerOffset * 0.9} ${cy + 120}, ${cx} ${bottomY}
    C ${cx + innerOffset * 0.8} ${cy + 110}, ${cx + innerOffset} ${cy + 50}, ${cx + innerOffset} ${cy}
    C ${cx + innerOffset} ${cy - 50}, ${cx + innerOffset * 0.8} ${cy - 110}, ${cx} ${topY}
    Z
  `;

  // Thành trong dày (dải uốn cong viền mép lỗ khí)
  const leftInnerWall = `
    M ${cx} ${topY}
    C ${cx - innerOffset * 0.8} ${cy - 110}, ${cx - innerOffset} ${cy - 50}, ${cx - innerOffset} ${cy}
    C ${cx - innerOffset} ${cy + 50}, ${cx - innerOffset * 0.8} ${cy + 110}, ${cx} ${bottomY}
  `;

  const rightInnerWall = `
    M ${cx} ${topY}
    C ${cx + innerOffset * 0.8} ${cy - 110}, ${cx + innerOffset} ${cy - 50}, ${cx + innerOffset} ${cy}
    C ${cx + innerOffset} ${cy + 50}, ${cx + innerOffset * 0.8} ${cy + 110}, ${cx} ${bottomY}
  `;

  // Vị trí tâm khối của tế bào trái/phải để đặt nhân tế bào và nhãn
  const leftMidX = cx - (innerOffset + outerOffset) * 0.52;
  const rightMidX = cx + (innerOffset + outerOffset) * 0.52;

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
          {/* Gradient màu lục tươi cho tế bào biểu bì no nước */}
          <linearGradient id="stomaCellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Gradient màu thành trong dày sẫm màu */}
          <linearGradient id="innerThickWallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#064E3B" />
            <stop offset="50%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>

          {/* Clip path để ĐẢM BẢO toàn bộ lục lạp và nhân nằm 100% trong tế bào */}
          <clipPath id="leftCellClip">
            <path d={leftCellPath} />
          </clipPath>
          <clipPath id="rightCellClip">
            <path d={rightCellPath} />
          </clipPath>

          {/* Bóng đổ sinh học mềm mại */}
          <filter id="bioShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#064E3B" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* 1. Lỗ khí (Stomatal Pore) ở giữa - Nền sẫm khi mở */}
        {aperture > 0.05 && (
          <path
            d={`
              M ${cx} ${topY}
              C ${cx - innerOffset * 0.8} ${cy - 110}, ${cx - innerOffset} ${cy - 50}, ${cx - innerOffset} ${cy}
              C ${cx - innerOffset} ${cy + 50}, ${cx - innerOffset * 0.8} ${cy + 110}, ${cx} ${bottomY}
              C ${cx + innerOffset * 0.8} ${cy + 110}, ${cx + innerOffset} ${cy + 50}, ${cx + innerOffset} ${cy}
              C ${cx + innerOffset} ${cy - 50}, ${cx + innerOffset * 0.8} ${cy - 110}, ${cx} ${topY}
              Z
            `}
            fill="#0F172A"
            fillOpacity={0.88}
          />
        )}

        {/* 2. Tế bào hạt đậu BÊN TRÁI */}
        <g filter="url(#bioShadow)">
          {/* Thân tế bào */}
          <path
            d={leftCellPath}
            fill="url(#stomaCellGrad)"
            stroke="#047857"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Các bào quan bên trong (được clip gọn gàng, không bị tràn ra ngoài) */}
          <g clipPath="url(#leftCellClip)">
            {/* Lục lạp (Chloroplasts) */}
            {[-120, -70, -25, 25, 70, 120].map((offsetY, idx) => {
              const organelleX = leftMidX + Math.sin(offsetY * 0.05) * 12;
              return (
                <g key={`l-chloro-${idx}`} transform={`translate(${organelleX}, ${cy + offsetY})`}>
                  <ellipse rx="10" ry="6" fill="#064E3B" opacity="0.85" transform={`rotate(${offsetY * 0.25})`} />
                  <ellipse rx="7" ry="3.5" fill="#047857" opacity="0.9" transform={`rotate(${offsetY * 0.25})`} />
                </g>
              );
            })}

            {/* Nhân tế bào trái */}
            <circle cx={leftMidX} cy={cy} r="16" fill="#065F46" opacity="0.95" />
            <circle cx={leftMidX - 3} cy={cy - 3} r="5" fill="#6EE7B7" opacity="0.9" />
          </g>

          {/* Thành trong dày (Inner Thick Wall) viền mép lỗ khí */}
          <path
            d={leftInnerWall}
            fill="none"
            stroke="url(#innerThickWallGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Thành ngoài mỏng (Outer Thin Wall) viền ngoài dãn dài */}
          <path
            d={`
              M ${cx} ${topY}
              C ${cx - outerOffset * 0.9} ${cy - 120}, ${cx - outerOffset} ${cy - 50}, ${cx - outerOffset} ${cy}
              C ${cx - outerOffset} ${cy + 50}, ${cx - outerOffset * 0.9} ${cy + 120}, ${cx} ${bottomY}
            `}
            fill="none"
            stroke="#6EE7B7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* 3. Tế bào hạt đậu BÊN PHẢI */}
        <g filter="url(#bioShadow)">
          {/* Thân tế bào */}
          <path
            d={rightCellPath}
            fill="url(#stomaCellGrad)"
            stroke="#047857"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Các bào quan bên trong (được clip gọn gàng, không bị tràn ra ngoài) */}
          <g clipPath="url(#rightCellClip)">
            {/* Lục lạp (Chloroplasts) */}
            {[-120, -70, -25, 25, 70, 120].map((offsetY, idx) => {
              const organelleX = rightMidX - Math.sin(offsetY * 0.05) * 12;
              return (
                <g key={`r-chloro-${idx}`} transform={`translate(${organelleX}, ${cy + offsetY})`}>
                  <ellipse rx="10" ry="6" fill="#064E3B" opacity="0.85" transform={`rotate(${-offsetY * 0.25})`} />
                  <ellipse rx="7" ry="3.5" fill="#047857" opacity="0.9" transform={`rotate(${-offsetY * 0.25})`} />
                </g>
              );
            })}

            {/* Nhân tế bào phải */}
            <circle cx={rightMidX} cy={cy} r="16" fill="#065F46" opacity="0.95" />
            <circle cx={rightMidX + 3} cy={cy - 3} r="5" fill="#6EE7B7" opacity="0.9" />
          </g>

          {/* Thành trong dày (Inner Thick Wall) viền mép lỗ khí */}
          <path
            d={rightInnerWall}
            fill="none"
            stroke="url(#innerThickWallGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Thành ngoài mỏng (Outer Thin Wall) viền ngoài dãn dài */}
          <path
            d={`
              M ${cx} ${topY}
              C ${cx + outerOffset * 0.9} ${cy - 120}, ${cx + outerOffset} ${cy - 50}, ${cx + outerOffset} ${cy}
              C ${cx + outerOffset} ${cy + 50}, ${cx + outerOffset * 0.9} ${cy + 120}, ${cx} ${bottomY}
            `}
            fill="none"
            stroke="#6EE7B7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Khớp nối 2 đầu cực trên và dưới mềm mại */}
        <circle cx={cx} cy={topY} r="5" fill="#047857" />
        <circle cx={cx} cy={bottomY} r="5" fill="#047857" />

        {/* 4. Dòng phân tử thoát hơi nước (H2O) bay lên khi mở */}
        {showWaterVapor && aperture > 0.2 && (
          <g opacity={aperture}>
            {[-18, 0, 18].map((dx, idx) => (
              <g key={`vapor-${idx}`} transform={`translate(${cx + dx}, ${cy - 45 - idx * 26})`}>
                <circle cx="0" cy="0" r="10" fill="#38BDF8" fillOpacity="0.9" />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily={fontText}
                >
                  H₂O
                </text>
              </g>
            ))}
          </g>
        )}

        {/* 5. Dòng CO2 khuếch tán vào lá */}
        {showCO2 && aperture > 0.3 && (
          <g opacity={aperture}>
            <g transform={`translate(${cx}, ${cy + 65})`}>
              <circle cx="0" cy="0" r="14" fill="#F59E0B" fillOpacity="0.95" />
              <text
                x="0"
                y="5"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="bold"
                fontFamily={fontText}
              >
                CO₂
              </text>
            </g>
          </g>
        )}

        {/* 6. Nhãn chú thích với ĐƯỜNG NỐI CHUẨN XÁC, CÓ ĐIỂM NEO */}
        {showLabels && (
          <g fontFamily={fontText} fontSize="14" fontWeight="600">
            {/* Nhãn 1: Tế bào hạt đậu (trỏ chuẩn vào thân tế bào trái) */}
            <g>
              <text x={cx - 180} y={cy - 70} fill="#065F46" textAnchor="end">
                Tế bào hạt đậu
              </text>
              <line
                x1={cx - 170}
                y1={cy - 75}
                x2={leftMidX - 10}
                y2={cy - 40}
                stroke="#059669"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <circle cx={leftMidX - 10} cy={cy - 40} r="3.5" fill="#059669" />
            </g>

            {/* Nhãn 2: Thành ngoài mỏng (trỏ chuẩn vào mép ngoài tế bào trái) */}
            <g>
              <text x={cx - 180} y={cy + 80} fill="#059669" textAnchor="end">
                Thành ngoài mỏng (dãn dài)
              </text>
              <line
                x1={cx - 170}
                y1={cy + 75}
                x2={cx - outerOffset}
                y2={cy + 30}
                stroke="#059669"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <circle cx={cx - outerOffset} cy={cy + 30} r="3.5" fill="#059669" />
            </g>

            {/* Nhãn 3: Thành trong dày (trỏ chuẩn vào mép thành trong tế bào phải) */}
            <g>
              <text x={cx + 180} y={cy - 70} fill="#064E3B" textAnchor="start">
                Thành trong dày (uốn cong)
              </text>
              <line
                x1={cx + 170}
                y1={cy - 75}
                x2={cx + innerOffset + 4}
                y2={cy - 30}
                stroke="#064E3B"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <circle cx={cx + innerOffset + 4} cy={cy - 30} r="3.5" fill="#064E3B" />
            </g>

            {/* Huy hiệu trạng thái lỗ khí ở đáy */}
            <g transform={`translate(${cx}, ${bottomY + 45})`}>
              <rect
                x="-90"
                y="-18"
                width="180"
                height="36"
                rx="18"
                fill={aperture > 0.4 ? "#ECFDF5" : "#FEF2F2"}
                stroke={aperture > 0.4 ? "#10B981" : "#EF4444"}
                strokeWidth="1.5"
              />
              <text
                x="0"
                y="5"
                textAnchor="middle"
                fill={aperture > 0.4 ? "#065F46" : "#991B1B"}
                fontWeight="700"
                fontSize="15"
              >
                {aperture > 0.4 ? "KHÍ KHỔNG MỞ" : "KHÍ KHỔNG ĐÓNG"}
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
