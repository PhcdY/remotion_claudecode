import { Circle, Highlight, StrikeThrough, Underline } from "@remotion/rough-notation";
import React from "react";
import { colors, fontText } from "./theme";

// Đánh dấu kiểu vẽ tay lên chữ và hình (.agents/chuan-thi-giac.md › 6–8): vệt bút dạ, gạch, khoanh, gạch chân
// (@remotion/rough-notation), mũi tên vẽ dần, con dấu. Thay cho thẻ gạch đầu dòng: thay đổi xảy ra ngay trên vật đang nói.
// Mọi `progress` (0 → 1) tính từ useCurrentFrame() bằng tween/interpolate, không tự chạy theo thời gian.

type MarkProps = { progress: number; color?: string; seed?: number; children: React.ReactNode; style?: React.CSSProperties };

/** Vệt bút dạ vẽ tay quét SAU chữ (chữ vẫn đọc rõ). Bọc quanh một từ/cụm: <Marker progress={…}>đi</Marker>. */
export const Marker: React.FC<MarkProps> = ({ progress, color = "#FFD166", seed = 1, children, style }) => (
  <Highlight progress={progress} color={color} seed={seed} iterations={2} style={{ display: "inline-block", ...style }}>
    {children}
  </Highlight>
);

/** Gạch tay qua câu sai, đáp án bị loại (3 nét, hơi lệch như tay gạch). */
export const Strike: React.FC<MarkProps & { width?: number }> = ({
  progress,
  color = colors.decrease,
  seed = 2,
  width = 8,
  children,
  style,
}) => (
  <StrikeThrough progress={progress} color={color} seed={seed} strokeWidth={width} iterations={3} style={{ display: "inline-block", ...style }}>
    {children}
  </StrikeThrough>
);

/** Khoanh tròn vẽ tay quanh từ, số, chi tiết cần chú ý. */
export const Ring: React.FC<MarkProps & { width?: number }> = ({
  progress,
  color = colors.accent,
  seed = 3,
  width = 6,
  children,
  style,
}) => (
  <Circle progress={progress} color={color} seed={seed} strokeWidth={width} iterations={2} padding={{ left: 18, right: 18, top: 10, bottom: 10 }} style={{ display: "inline-block", ...style }}>
    {children}
  </Circle>
);

/** Gạch chân vẽ tay (nhấn một cụm khi lời đọc nói tới). */
export const UnderlineMark: React.FC<MarkProps & { width?: number }> = ({
  progress,
  color = colors.accent,
  seed = 4,
  width = 6,
  children,
  style,
}) => (
  <Underline progress={progress} color={color} seed={seed} strokeWidth={width} iterations={2} style={{ display: "inline-block", ...style }}>
    {children}
  </Underline>
);

/**
 * Mũi tên cong vẽ dần từ `from` tới `to` (px, cùng hệ toạ độ với lớp chứa). Đầu mũi tên dừng cách đích `gap` px
 * (dung-video › khoảng dừng mũi tên ≥ 24px) và chỉ hiện khi nét đã chạy tới.
 */
export const DrawArrow: React.FC<{
  from: [number, number];
  to: [number, number];
  progress: number;
  bend?: number;
  color?: string;
  width?: number;
  gap?: number;
}> = ({ from, to, progress, bend = 0.25, color = colors.text, width = 6, gap = 24 }) => {
  const [x1, y1] = from;
  const dx = to[0] - x1;
  const dy = to[1] - y1;
  const len = Math.hypot(dx, dy) || 1;
  // điểm cuối lùi lại `gap` px khỏi đích
  const x2 = to[0] - (dx / len) * gap;
  const y2 = to[1] - (dy / len) * gap;
  // điểm điều khiển lệch vuông góc để nét cong tự nhiên
  const cx = (x1 + x2) / 2 - (dy / len) * len * bend;
  const cy = (y1 + y2) / 2 + (dx / len) * len * bend;
  const p = Math.max(0, Math.min(1, progress));
  const ang = (Math.atan2(y2 - cy, x2 - cx) * 180) / Math.PI;
  const head = width * 4;
  return (
    <svg data-deco width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path
        d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
      <path
        d={`M ${-head} ${-head * 0.6} L 0 0 L ${-head} ${head * 0.6}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={`translate(${x2} ${y2}) rotate(${ang})`}
        opacity={p > 0.92 ? (p - 0.92) / 0.08 : 0}
      />
    </svg>
  );
};

/**
 * Con dấu đóng xuống (kết luận, điểm số): phóng từ to xuống đúng cỡ có nảy, nghiêng nhẹ, viền đôi.
 * `t` là giá trị từ `pop(frame, start, fps)`.
 */
export const Stamp: React.FC<{
  x: number;
  y: number;
  t: number;
  text: string;
  color?: string;
  size?: number;
  rotate?: number;
}> = ({ x, y, t, text, color = colors.decrease, size = 110, rotate = -8 }) => (
  <div
    data-text="stamp"
    style={{
      position: "absolute",
      left: x,
      top: y,
      translate: "-50% -50%",
      scale: String(1.8 - 0.8 * t),
      opacity: Math.min(1, t * 1.6),
      rotate: `${rotate}deg`,
      padding: `${size * 0.08}px ${size * 0.28}px`,
      border: `${Math.round(size * 0.07)}px solid ${color}`,
      outline: `${Math.round(size * 0.03)}px solid ${color}`,
      outlineOffset: Math.round(size * 0.05),
      borderRadius: size * 0.18,
      color,
      fontFamily: fontText,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1,
      whiteSpace: "nowrap",
      letterSpacing: "0.02em",
    }}
  >
    {text}
  </div>
);
