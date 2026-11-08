import React from "react";
import { role } from "../roles";
import { colors, halo } from "../theme";
import { MathText } from "../MathText";

export type PhysicsVectorProps = {
  /** Điểm đặt của vectơ */
  from: { x: number; y: number };
  /** Điểm ngọn của vectơ (nếu có, ưu tiên hơn length/angleDeg) */
  to?: { x: number; y: number };
  /** Độ dài định tính theo pixel */
  length?: number;
  /** Góc nghiêng tính bằng độ (0 = sang phải, 90 = hướng xuống, -90 = hướng lên) */
  angleDeg?: number;
  /** Màu vectơ theo vai trò (mặc định role.focus) */
  color?: string;
  /** Độ dày nét vẽ */
  strokeWidth?: number;
  /** Kích thước đầu mũi tên */
  headSize?: number;
  /** Nhãn chữ hoặc công thức LaTeX gắn cạnh vectơ (vd: "\\vec{F}", "v = 12\\text{ m/s}") */
  label?: string;
  /**
   * Vị trí nhãn so với thân vectơ:
   * - "auto" (mặc định): Tự động đặt nhãn theo pháp tuyến tự nhiên (hướng lên trên khi nằm ngang) và trôi mượt mà khi vectơ quay
   * - "opposite": Đặt nhãn ở phía đối diện của pháp tuyến tự nhiên
   * - "top": Luôn nằm ở phía trên điểm neo thân vectơ (theo trục Y)
   * - "bottom": Luôn nằm ở phía dưới điểm neo thân vectơ
   * - "left": Luôn nằm bên trái điểm neo thân vectơ
   * - "right": Luôn nằm bên phải điểm neo thân vectơ
   * - "along": Tương đương "auto"
   */
  labelSide?: "auto" | "opposite" | "top" | "bottom" | "left" | "right" | "along";
  /** Khoảng cách từ thân vectơ đến nhãn (pixel) */
  labelOffset?: number;
  /** Tỉ lệ vị trí đặt nhãn trên thân vectơ (0 = gốc, 0.5 = giữa, 1 = ngọn, mặc định 0.5) */
  labelPosRatio?: number;
  /** Độ mờ đục (0 -> 1) */
  opacity?: number;
  /** Vẽ chấm tròn tại điểm đặt */
  originDot?: boolean;
  /** Bán kính chấm tròn điểm đặt */
  originDotRadius?: number;
  /** Tiến độ vươn ra của mũi tên (0 -> 1) cho animation */
  progress?: number;
  /** Nét đứt (thường dùng cho vectơ thành phần khi phân tích lực) */
  dashed?: boolean;
  /** Hiển thị đường gióng vuông góc tới hai trục (phân tích lực) */
  showProjections?: boolean;
};

export const PhysicsVector: React.FC<PhysicsVectorProps> = ({
  from,
  to,
  length = 100,
  angleDeg = 0,
  color = role.focus,
  strokeWidth = 6,
  headSize = 20,
  label,
  labelSide = "auto",
  labelOffset = 28,
  labelPosRatio = 0.5,
  opacity = 1,
  originDot = true,
  originDotRadius = 6,
  progress = 1,
  dashed = false,
  showProjections = false,
}) => {
  if (opacity <= 0) return null;

  // Tính tọa độ đích thực
  let targetX = from.x;
  let targetY = from.y;
  let vecLen = length;
  let rad = (angleDeg * Math.PI) / 180;

  if (to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    vecLen = Math.hypot(dx, dy);
    rad = Math.atan2(dy, dx);
  }

  // Áp dụng tiến độ animation (progress vươn ra từ gốc)
  const currentLen = Math.max(vecLen * Math.min(Math.max(progress, 0), 1), 0.001);
  targetX = from.x + currentLen * Math.cos(rad);
  targetY = from.y + currentLen * Math.sin(rad);

  // Tính đầu mũi tên SVG
  const actualHead = Math.min(headSize, currentLen * 0.6);
  const headAngle = Math.PI / 6; // 30 độ
  const arrowLeftX = targetX - actualHead * Math.cos(rad - headAngle);
  const arrowLeftY = targetY - actualHead * Math.sin(rad - headAngle);
  const arrowRightX = targetX - actualHead * Math.cos(rad + headAngle);
  const arrowRightY = targetY - actualHead * Math.sin(rad + headAngle);

  // Điểm neo trên thân vectơ (mặc định ở giữa thân: ratio = 0.5)
  const anchorX = from.x + currentLen * Math.cos(rad) * labelPosRatio;
  const anchorY = from.y + currentLen * Math.sin(rad) * labelPosRatio;

  // Pháp tuyến tự nhiên: (sin(rad), -cos(rad))
  // Khi rad = 0 (sang phải): n = (0, -1) -> hướng lên trên (-y)
  // Khi rad = PI/2 (hướng xuống): n = (1, 0) -> hướng sang phải (+x)
  // Khi rad = -PI/2 (hướng lên): n = (-1, 0) -> hướng sang trái (-x)
  // Khi rad = PI (sang trái): n = (0, 1) -> hướng xuống dưới (+y)
  const nx = Math.sin(rad);
  const ny = -Math.cos(rad);

  let labelX = anchorX;
  let labelY = anchorY;

  switch (labelSide) {
    case "opposite":
      labelX = anchorX - nx * labelOffset;
      labelY = anchorY - ny * labelOffset;
      break;
    case "top":
      labelX = anchorX;
      labelY = anchorY - labelOffset;
      break;
    case "bottom":
      labelX = anchorX;
      labelY = anchorY + labelOffset;
      break;
    case "left":
      labelX = anchorX - labelOffset;
      labelY = anchorY;
      break;
    case "right":
      labelX = anchorX + labelOffset;
      labelY = anchorY;
      break;
    case "auto":
    case "along":
    default:
      labelX = anchorX + nx * labelOffset;
      labelY = anchorY + ny * labelOffset;
      break;
  }

  return (
    <g opacity={opacity}>
      {/* Đường gióng nét đứt phân tích thành phần nếu bật showProjections */}
      {showProjections ? (
        <g stroke={colors.axis} strokeWidth={2} strokeDasharray="4 4" opacity={0.7}>
          <line x1={from.x} y1={from.y} x2={targetX} y2={from.y} />
          <line x1={targetX} y1={from.y} x2={targetX} y2={targetY} />
        </g>
      ) : null}

      {/* Thân vectơ */}
      <line
        x1={from.x}
        y1={from.y}
        x2={targetX}
        y2={targetY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? "6 6" : undefined}
        strokeLinecap="round"
      />

      {/* Đầu mũi tên */}
      {currentLen > 4 ? (
        <polygon
          points={`${targetX},${targetY} ${arrowLeftX},${arrowLeftY} ${arrowRightX},${arrowRightY}`}
          fill={color}
        />
      ) : null}

      {/* Chấm tròn tại điểm đặt */}
      {originDot ? (
        <circle cx={from.x} cy={from.y} r={originDotRadius} fill={color} />
      ) : null}

      {/* Nhãn vectơ (đặt cố định tọa độ có halo shadow chống rung giật) */}
      {label && currentLen > 10 ? (
        <foreignObject
          x={labelX - 100}
          y={labelY - 20}
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
              text={label.includes("$") ? label : `$${label}$`}
              style={{
                fontSize: 30,
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
