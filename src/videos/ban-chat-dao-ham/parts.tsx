import React from "react";
import { interpolate } from "remotion";
import { Card } from "../../components/Card";
import { colors, fontSize, fontText, halo } from "../../components/theme";

export const label: React.CSSProperties = {
  fontFamily: fontText,
  fontWeight: 600,
  fontSize: fontSize.label,
  color: colors.text,
};

/** Nhãn HTML đặt tuyệt đối, có halo; anchor theo tâm ngang. */
export const Tag: React.FC<{
  x: number;
  y: number;
  anchor?: "center" | "left" | "right";
  color?: string;
  weight?: number;
  size?: number;
  opacity?: number;
  name?: string;
  children: React.ReactNode;
}> = ({ x, y, anchor = "center", color = colors.text, weight = 600, size = fontSize.label, opacity = 1, name = "label", children }) => (
  <div
    data-text={name}
    style={{
      ...label,
      position: "absolute",
      left: x,
      top: y,
      translate: anchor === "center" ? "-50% 0" : anchor === "right" ? "-100% 0" : "0 0",
      whiteSpace: "nowrap",
      color,
      fontWeight: weight,
      fontSize: size,
      opacity,
      textShadow: halo(),
    }}
  >
    {children}
  </div>
);

// ---------------- Số liệu cuộc đua (arXiv:0911.1952, bảng I, Berlin 2009) ----------------
/** Thời điểm (s, tính từ súng lệnh) Bolt qua mỗi mốc 0, 10, …, 100 m. */
export const SPLITS = [0, 1.89, 2.88, 3.78, 4.64, 5.47, 6.29, 7.1, 7.92, 8.75, 9.58];
export const RACE_TIME = 9.58;

/** Vị trí (m) của Bolt ở thời điểm t (s): nội suy tuyến tính giữa các mốc 10 m. */
export const boltPos = (t: number) => {
  if (t <= 0) return 0;
  if (t >= RACE_TIME) return 100;
  const i = SPLITS.findIndex((s) => s > t);
  const a = SPLITS[i - 1];
  const b = SPLITS[i];
  return (i - 1) * 10 + ((t - a) / (b - a)) * 10;
};

// ---------------- Đường chạy 100 m nhìn ngang ----------------
export const TRACK = { left: 140, width: 1380, laneH: 70 };
export const mx = (m: number) => TRACK.left + (m / 100) * TRACK.width;

/** Đường chạy: dải đỏ gạch + vạch xuất phát/đích + vạch chia 10 m có số + tên trục. */
export const Track: React.FC<{
  top: number;
  lanes?: number;
  highlight?: { from: number; to: number; opacity: number };
  children?: React.ReactNode; // vẽ thêm trong cùng SVG (toạ độ trang)
  ticksOpacity?: number;
}> = ({ top, lanes = 1, highlight, children, ticksOpacity = 1 }) => {
  const h = TRACK.laneH * lanes;
  const tickY = top + h;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <rect x={mx(0) - 30} y={top} width={TRACK.width + 60} height={h} rx={10} fill="#E07A5A" />
        {Array.from({ length: lanes - 1 }).map((_, i) => (
          <line key={i} x1={mx(0) - 30} x2={mx(100) + 30} y1={top + TRACK.laneH * (i + 1)} y2={top + TRACK.laneH * (i + 1)} stroke="#FFFFFF" strokeWidth={3} opacity={0.8} />
        ))}
        <line x1={mx(0)} x2={mx(0)} y1={top} y2={top + h} stroke="#FFFFFF" strokeWidth={6} />
        <line x1={mx(100)} x2={mx(100)} y1={top} y2={top + h} stroke="#FFFFFF" strokeWidth={6} strokeDasharray="10 8" />
        {highlight && highlight.opacity > 0 ? (
          <rect
            x={mx(highlight.from)}
            y={top - 6}
            width={Math.max(3, mx(highlight.to) - mx(highlight.from))}
            height={h + 12}
            fill={colors.accent}
            fillOpacity={0.55}
            stroke={colors.accent}
            strokeWidth={3}
            opacity={highlight.opacity}
          />
        ) : null}
        <g opacity={ticksOpacity}>
          {Array.from({ length: 11 }).map((_, i) => (
            <g key={i}>
              <line x1={mx(i * 10)} x2={mx(i * 10)} y1={tickY + 6} y2={tickY + 20} stroke={colors.axis} strokeWidth={3} />
              <text data-text="tick" x={mx(i * 10)} y={tickY + 50} textAnchor="middle" fontFamily={fontText} fontSize={fontSize.tick} fill={colors.muted}>
                {i * 10}
              </text>
            </g>
          ))}
          <text data-text="axis" x={mx(100) + 40} y={tickY + 50} fontFamily={fontText} fontWeight={600} fontSize={fontSize.label} fill={colors.text}>
            quãng đường (m)
          </text>
        </g>
        {children}
      </svg>
    </>
  );
};

/** Người chạy vẽ giản lược (bóng một màu, không vẽ mặt). (x, foot) = điểm chân chạm đất. */
export const Runner: React.FC<{ x: number; foot: number; phase?: number; scale?: number; opacity?: number; color?: string }> = ({
  x,
  foot,
  phase = 0,
  scale = 1,
  opacity = 1,
  color = colors.text,
}) => {
  const sw = Math.sin(phase);
  const leg = (a: number, knee: number) => {
    const hipX = 0;
    const hipY = -62;
    const kx = hipX + Math.sin(a) * 34;
    const ky = hipY + Math.cos(a) * 34;
    const fx = kx + Math.sin(a - knee) * 34;
    const fy = ky + Math.cos(a - knee) * 34;
    return `M${hipX},${hipY} L${kx},${ky} L${fx},${fy}`;
  };
  const arm = (a: number) => {
    const sx = 6;
    const sy = -104;
    const ex = sx + Math.sin(a) * 26;
    const ey = sy + Math.cos(a) * 26;
    return `M${sx},${sy} L${ex},${ey} L${ex + Math.sin(a + 1.4) * 24},${ey + Math.cos(a + 1.4) * 24}`;
  };
  const stroke = { fill: "none", stroke: color, strokeWidth: 13, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <g data-mark="runner" transform={`translate(${x}, ${foot}) scale(${scale})`} opacity={opacity}>
      <path d={leg(0.7 * sw, 0.15 + 1.1 * Math.max(0, -sw))} {...stroke} />
      <path d={leg(-0.7 * sw, 0.15 + 1.1 * Math.max(0, sw))} {...stroke} />
      <path d="M0,-62 L10,-110" {...stroke} strokeWidth={18} />
      <path d={arm(-0.9 * sw)} {...stroke} strokeWidth={11} />
      <path d={arm(0.9 * sw)} {...stroke} strokeWidth={11} />
      <circle cx={16} cy={-132} r={16} fill={color} />
    </g>
  );
};

/** Xe đạp điện nhỏ nhìn ngang. (x, ground) = điểm giữa hai bánh chạm đất. */
export const EBike: React.FC<{ x: number; ground: number; opacity?: number }> = ({ x, ground, opacity = 1 }) => (
  <g data-mark="ebike" transform={`translate(${x}, ${ground})`} opacity={opacity}>
    <circle cx={-30} cy={-18} r={17} fill="none" stroke={colors.text} strokeWidth={5} />
    <circle cx={30} cy={-18} r={17} fill="none" stroke={colors.text} strokeWidth={5} />
    <path d="M-30,-18 L-6,-18 L14,-44 L30,-18 M-6,-18 L-14,-46 M14,-44 L10,-56" fill="none" stroke={colors.brandBlue} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    <rect x={-26} y={-42} width={20} height={14} rx={3} fill={colors.increase} />
    <path d="M-22,-50 L-6,-50" stroke={colors.text} strokeWidth={6} strokeLinecap="round" />
  </g>
);

/** Đồng hồ bấm giờ nhỏ (biểu tượng). */
const WatchIcon: React.FC = () => (
  <svg width={46} height={52}>
    <rect x={17} y={0} width={12} height={8} rx={2} fill={colors.text} />
    <circle cx={23} cy={30} r={19} fill="#FFFFFF" stroke={colors.text} strokeWidth={5} />
    <line x1={23} y1={30} x2={23} y2={17} stroke={colors.decrease} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

/** Hàng thẻ số liệu cuộc đua (b01, b10): thời gian + vận tốc trung bình. */
export const RaceStats: React.FC<{ time: number; avgOpacity: number; opacity?: number }> = ({ time, avgOpacity, opacity = 1 }) => (
  <>
    <Card style={{ left: 140, top: 128, padding: "14px 28px", display: "flex", alignItems: "center", gap: 18, opacity }}>
      <WatchIcon />
      <div data-text="card" style={{ ...label, fontSize: 40 }}>
        thời gian: <b style={{ fontWeight: 800 }}>{time.toFixed(2).replace(".", ",")} s</b>
      </div>
    </Card>
    <Card style={{ left: 640, top: 128, padding: "18px 30px", opacity: opacity * avgOpacity, translate: `${(1 - avgOpacity) * 30}px 0px` }}>
      <div data-text="card" style={{ ...label, fontSize: 40 }}>
        vận tốc trung bình cả bài: <b style={{ color: colors.accent, fontWeight: 800 }}>≈ 37,6 km/h</b>
      </div>
    </Card>
  </>
);

/** Khung ảnh polaroid 520×600; nội dung vẽ trong vùng ảnh 472×472, chú thích ở dải trắng dưới. */
export const Polaroid: React.FC<{
  left: number;
  top: number;
  scale?: number;
  tilt?: number;
  opacity?: number;
  caption?: string;
  children?: React.ReactNode;
}> = ({ left, top, scale = 1, tilt = -3, opacity = 1, caption, children }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: 520,
      height: 600,
      scale,
      transformOrigin: "top left",
      rotate: `${tilt}deg`,
      opacity,
      background: "#FFFFFF",
      borderRadius: 10,
      boxShadow: "0 14px 40px rgba(14, 16, 70, 0.18)",
    }}
  >
    <svg width={472} height={472} style={{ position: "absolute", left: 24, top: 24, borderRadius: 4 }}>
      {children}
    </svg>
    {caption ? (
      <div data-text="caption" style={{ ...label, position: "absolute", left: 0, right: 0, top: 512, textAlign: "center", fontSize: 40, fontWeight: 700 }}>
        {caption}
      </div>
    ) : null}
  </div>
);

/** Đèn giao thông nhỏ: đỏ khi `red` = true, xanh khi false. */
export const TrafficLight: React.FC<{ red: boolean; style?: React.CSSProperties }> = ({ red, style }) => (
  <svg width={46} height={104} style={style}>
    <rect x={2} y={2} width={42} height={100} rx={12} fill="#1E2240" />
    <circle cx={23} cy={30} r={13} fill={red ? "#FF4D4D" : "#4A2A2A"} />
    <circle cx={23} cy={72} r={13} fill={red ? "#1F3A2A" : "#3EE07A"} />
  </svg>
);

/** Dấu "?" lớn bật lên theo p (0 → 1). */
export const BigQuestion: React.FC<{ x: number; y: number; p: number; size?: number }> = ({ x, y, p, size = 130 }) => (
  <div
    data-text="question"
    style={{
      position: "absolute",
      left: x,
      top: y,
      fontFamily: fontText,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1,
      color: colors.accent,
      opacity: interpolate(p, [0, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      scale: interpolate(p, [0, 1], [0.4, 1]),
    }}
  >
    ?
  </div>
);
