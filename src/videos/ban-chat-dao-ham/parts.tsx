import React from "react";
import { colors, fontText } from "../../components/theme";

/** Ảnh polaroid chụp quả bóng đang rơi (b01, b09). Kích thước gốc 520×600. */
export const BallPhoto: React.FC<{
  left: number;
  top: number;
  scale?: number;
  tilt?: number;
  opacity?: number;
  children?: React.ReactNode; // vẽ thêm trong vùng ảnh (toạ độ 0..472)
}> = ({ left, top, scale = 1, tilt = -3, opacity = 1, children }) => (
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
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE2FF" />
          <stop offset="1" stopColor="#F2F7FF" />
        </linearGradient>
        <radialGradient id="ball" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#FFC56B" />
          <stop offset="1" stopColor="#E8790C" />
        </radialGradient>
      </defs>
      <rect width={472} height={472} fill="url(#sky)" />
      {[-26, 0, 26].map((dx, i) => (
        <line key={i} x1={236 + dx} y1={70 + i * 6} x2={236 + dx} y2={170} stroke={colors.brandBlue} strokeOpacity={0.35} strokeWidth={5} strokeLinecap="round" />
      ))}
      <circle data-mark="ball" cx={236} cy={236} r={58} fill="url(#ball)" stroke="#B85E06" strokeWidth={3} />
      <path d="M190,214 Q236,190 282,214" fill="none" stroke="#B85E06" strokeWidth={3} opacity={0.6} />
      <path d="M186,258 Q236,284 286,258" fill="none" stroke="#B85E06" strokeWidth={3} opacity={0.6} />
      {children}
    </svg>
  </div>
);

/** Đồng hồ bấm giờ dừng ở `label`. */
export const Stopwatch: React.FC<{ label: string; size?: number }> = ({ label, size = 180 }) => {
  const c = size / 2;
  return (
    <svg width={size} height={size + 20} style={{ overflow: "visible" }}>
      <rect x={c - 16} y={0} width={32} height={18} rx={4} fill={colors.text} />
      <circle cx={c} cy={c + 16} r={c - 8} fill="#FFFFFF" stroke={colors.text} strokeWidth={8} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={c + Math.sin(a) * (c - 22)}
            y1={c + 16 - Math.cos(a) * (c - 22)}
            x2={c + Math.sin(a) * (c - 32)}
            y2={c + 16 - Math.cos(a) * (c - 32)}
            stroke={colors.axis}
            strokeWidth={4}
          />
        );
      })}
      <line x1={c} y1={c + 16} x2={c} y2={34} stroke={colors.decrease} strokeWidth={6} strokeLinecap="round" />
      <circle cx={c} cy={c + 16} r={8} fill={colors.text} />
      <text x={c} y={c + 62} textAnchor="middle" fontFamily={fontText} fontWeight={800} fontSize={30} fill={colors.text}>
        {label}
      </text>
    </svg>
  );
};

/** Đèn giao thông nhỏ: đỏ khi `red` = true, xanh khi false. */
export const TrafficLight: React.FC<{ red: boolean; style?: React.CSSProperties }> = ({ red, style }) => (
  <svg width={46} height={104} style={style}>
    <rect x={2} y={2} width={42} height={100} rx={12} fill="#1E2240" />
    <circle cx={23} cy={30} r={13} fill={red ? "#FF4D4D" : "#4A2A2A"} />
    <circle cx={23} cy={72} r={13} fill={red ? "#1F3A2A" : "#3EE07A"} />
  </svg>
);
