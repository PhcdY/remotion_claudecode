import React from "react";
import { role } from "../roles";
import { colors, halo } from "../theme";
import { MathText } from "../MathText";

// ============================================================================
// 1. DÂY CHUN ĐỘ DỊCH CHUYỂN (ElasticBand)
// Đại lượng: Độ dịch chuyển d
// Bản chất: Căng thẳng từ mốc tới vật, xoay và co giãn, về mốc thì co thành chấm
// ============================================================================

export type ElasticBandProps = {
  /** Điểm mốc ban đầu (tổ / vạch xuất phát) */
  origin: { x: number; y: number };
  /** Vị trí tức thời của vật */
  target: { x: number; y: number };
  /** Màu dây chun (mặc định role.focus) */
  color?: string;
  /** Độ dày dây chun */
  strokeWidth?: number;
  /** Nhãn chữ hoặc công thức gắn cạnh dây chun */
  label?: string;
  /** Độ mờ đục */
  opacity?: number;
  /** Hiệu ứng xung nhịp ở 2 đầu chốt (0 -> 1) */
  pulseRate?: number;
};

export const ElasticBand: React.FC<ElasticBandProps> = ({
  origin,
  target,
  color = role.focus,
  strokeWidth = 7,
  label = "\\vec{d}",
  opacity = 1,
  pulseRate = 0,
}) => {
  if (opacity <= 0) return null;

  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  const dist = Math.hypot(dx, dy);

  // Khi vật quay về mốc (khoảng cách cực nhỏ) -> co thành một chấm tròn lớn
  const isCollapsed = dist < 12;

  const midX = (origin.x + target.x) / 2;
  const midY = (origin.y + target.y) / 2;
  const nx = -dy / (dist || 1);
  const ny = dx / (dist || 1);

  return (
    <g opacity={opacity}>
      {isCollapsed ? (
        // Chấm tròn co lại tại mốc
        <g>
          <circle cx={origin.x} cy={origin.y} r={18} fill={color} opacity={0.25} />
          <circle cx={origin.x} cy={origin.y} r={10} fill={color} />
        </g>
      ) : (
        // Dây chun căng thẳng
        <>
          <line
            x1={origin.x}
            y1={origin.y}
            x2={target.x}
            y2={target.y}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Chốt tròn tại mốc */}
          <circle cx={origin.x} cy={origin.y} r={8 + 4 * pulseRate} fill={color} />
          {/* Chốt tròn tại vật */}
          <circle cx={target.x} cy={target.y} r={6 + 3 * pulseRate} fill={color} />

          {/* Nhãn gắn cạnh dây chun (cố định khoảng cách vuông góc an toàn) */}
          {label && dist > 30 ? (
            <foreignObject
              x={midX + nx * 26 - 100}
              y={midY + ny * 26 - 20}
              width={200}
              height={40}
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
                  text={label}
                  style={{
                    fontSize: 32,
                    color,
                    fontWeight: 700,
                    textShadow: halo("#FFFFFF"),
                    whiteSpace: "nowrap",
                  }}
                />
              </div>
            </foreignObject>
          ) : null}
        </>
      )}
    </g>
  );
};

// ============================================================================
// 2. SỢI CHỈ QUÃNG ĐƯỜNG (ThreadTrace)
// Đại lượng: Quãng đường s
// Bản chất: Tuôn ra từ cuộn chỉ, uốn lượn theo quỹ đạo, chỉ có dài thêm
// ============================================================================

export type ThreadTraceProps = {
  /** Danh sách các toạ độ trên quỹ đạo vật đã đi qua */
  points: { x: number; y: number }[];
  /** Tọa độ cuộn chỉ đặt ở vạch mốc (tuỳ chọn) */
  spoolPosition?: { x: number; y: number };
  /** Màu sợi chỉ (mặc định role.pairA) */
  color?: string;
  /** Độ dày sợi chỉ */
  strokeWidth?: number;
  /** Nhãn chú thích (ví dụ: "sợi chỉ = quãng đường") */
  label?: string;
  /** Độ mờ đục */
  opacity?: number;
  /** Làm nổi bật sợi chỉ (phóng to nhẹ đường viền) */
  highlight?: boolean;
};

export const ThreadTrace: React.FC<ThreadTraceProps> = ({
  points,
  spoolPosition,
  color = role.pairA,
  strokeWidth = 4,
  label,
  opacity = 1,
  highlight = false,
}) => {
  if (opacity <= 0 || points.length < 2) return null;

  const pathData = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const actualWidth = highlight ? strokeWidth + 4 : strokeWidth;

  return (
    <g opacity={opacity}>
      {/* Cuộn chỉ tại mốc nếu có */}
      {spoolPosition ? (
        <g transform={`translate(${spoolPosition.x}, ${spoolPosition.y})`}>
          <circle cx={0} cy={0} r={14} fill="#8D6E63" stroke={colors.text} strokeWidth={2} />
          <circle cx={0} cy={0} r={8} fill={color} />
          {/* Dây nối từ cuộn chỉ vào điểm bắt đầu */}
          <line
            x1={0}
            y1={0}
            x2={points[0].x - spoolPosition.x}
            y2={points[0].y - spoolPosition.y}
            stroke={color}
            strokeWidth={strokeWidth}
          />
        </g>
      ) : null}

      {/* Đường sợi chỉ uốn lượn theo quỹ đạo */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={actualWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Nhãn gắn cạnh sợi chỉ */}
      {label && points.length > 5 ? (
        <foreignObject
          x={points[Math.floor(points.length / 2)].x - 120}
          y={points[Math.floor(points.length / 2)].y - 50}
          width={240}
          height={40}
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
              text={label}
              style={{
                fontSize: 28,
                color,
                fontWeight: 700,
                textShadow: halo("#FFFFFF"),
                whiteSpace: "nowrap",
              }}
            />
          </div>
        </foreignObject>
      ) : null}
    </g>
  );
};

// ============================================================================
// 3. THƯỚC ĐO VỆT CHUYỂN ĐỘNG / VẾT ĐỒNG TỐC (MotionTape)
// Bản chất: Các điểm chấm/vệt sáng lưu lại sau mỗi chu kỳ thời gian đều đặn (strobe)
// Giúp so sánh bằng mắt: khoảng cách đều = thẳng đều, giãn ra = nhanh dần, co lại = chậm dần
// ============================================================================

export type MotionTapeProps = {
  /** Danh sách các vị trí ghi nhận sau mỗi khoảng thời gian đều đặn $\Delta t$ */
  positions: { x: number; y: number }[];
  /** Bán kính mỗi chấm đánh dấu */
  dotRadius?: number;
  /** Màu chấm */
  color?: string;
  /** Vẽ đường gióng nối các chấm */
  showTrack?: boolean;
  /** Đánh số thứ tự các tích tắc (0, 1, 2, 3...) */
  showTickLabels?: boolean;
  /** Độ mờ đục */
  opacity?: number;
};

export const MotionTape: React.FC<MotionTapeProps> = ({
  positions,
  dotRadius = 6,
  color = role.main,
  showTrack = true,
  showTickLabels = true,
  opacity = 1,
}) => {
  if (opacity <= 0 || positions.length === 0) return null;

  return (
    <g opacity={opacity}>
      {/* Đường ray nối các vết */}
      {showTrack && positions.length > 1 ? (
        <line
          x1={positions[0].x}
          y1={positions[0].y}
          x2={positions[positions.length - 1].x}
          y2={positions[positions.length - 1].y}
          stroke={colors.axis}
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      ) : null}

      {/* Các vết ghi nhận */}
      {positions.map((p, idx) => (
        <g key={idx}>
          <circle cx={p.x} cy={p.y} r={dotRadius} fill={color} />
          <circle cx={p.x} cy={p.y} r={dotRadius + 4} fill={color} opacity={0.25} />
          {showTickLabels ? (
            <text
              x={p.x}
              y={p.y + dotRadius + 18}
              textAnchor="middle"
              fontSize={18}
              fontFamily="sans-serif"
              fill={colors.muted}
              fontWeight="600"
            >
              {idx}s
            </text>
          ) : null}
        </g>
      ))}
    </g>
  );
};
