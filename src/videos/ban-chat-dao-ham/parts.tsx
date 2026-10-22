import React from "react";
import { interpolate } from "remotion";
import { Card } from "../../components/Card";
import { label, lerp } from "../../components/parts";
import { colors, fontSize, fontText } from "../../components/theme";

export { Tag, label, lerp } from "../../components/parts";

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

/** Thời điểm (s) Bolt qua vị trí m (hàm ngược của boltPos). */
export const boltTime = (m: number) => {
  if (m <= 0) return 0;
  if (m >= 100) return RACE_TIME;
  const i = Math.floor(m / 10);
  return SPLITS[i] + ((m - i * 10) / 10) * (SPLITS[i + 1] - SPLITS[i]);
};

/** Mét Bolt đứng hình trong câu hỏi và lúc giải đáp (gần chỗ đạt tốc độ lớn nhất). */
export const BOLT_STOP = 52;

// ---------------- Người chạy ----------------

/**
 * Người chạy vẽ giản lược (bóng một màu, không vẽ mặt), cao ~150px ở scale 1.
 * Toạ độ gốc (0, 0) = điểm chân chạm đất; mặt hướng sang phải khi facing = 1.
 * phase: pha sải chân (tăng theo quãng đường đã chạy). crouch: 0 → 1 cúi xuống (buộc dây giày).
 */
export const RunnerFigure: React.FC<{
  phase?: number;
  facing?: number;
  crouch?: number;
  color?: string;
}> = ({ phase = 0, facing = 1, crouch = 0, color = colors.text }) => {
  const sw = Math.sin(phase) * (1 - crouch);
  const leg = (a: number, knee: number) => {
    const hipY = -62;
    const kx = Math.sin(a) * 34;
    const ky = hipY + Math.cos(a) * 34;
    const fx = kx + Math.sin(a - knee) * 34;
    const fy = ky + Math.cos(a - knee) * 34;
    return `M0,${hipY} L${kx},${ky} L${fx},${fy}`;
  };
  const arm = (a: number) => {
    const sx = 6;
    const sy = -104;
    const ex = sx + Math.sin(a) * 26;
    const ey = sy + Math.cos(a) * 26;
    return `M${sx},${sy} L${ex},${ey} L${ex + Math.sin(a + 1.4) * 24},${ey + Math.cos(a + 1.4) * 24}`;
  };
  const stroke = { fill: "none", stroke: color, strokeWidth: 13, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  // cúi: hạ hông, gập người về phía trước
  const squash = 1 - 0.3 * crouch;
  return (
    <g transform={`scale(${facing}, 1)`}>
      <g transform={`scale(1, ${squash}) skewX(${-28 * crouch})`}>
        <path d={leg(0.7 * sw + 0.9 * crouch, 0.15 + 1.1 * Math.max(0, -sw) + 1.4 * crouch)} {...stroke} />
        <path d={leg(-0.7 * sw + 0.5 * crouch, 0.15 + 1.1 * Math.max(0, sw) + 1.6 * crouch)} {...stroke} />
        <path d="M0,-62 L10,-110" {...stroke} strokeWidth={18} />
        <path d={arm(-0.9 * sw - 1.6 * crouch)} {...stroke} strokeWidth={11} />
        <path d={arm(0.9 * sw - 1.4 * crouch)} {...stroke} strokeWidth={11} />
        <circle cx={16} cy={-132} r={16} fill={color} />
      </g>
    </g>
  );
};

// ---------------- Đường chạy 100 m nằm ngang ----------------

export const TRACK = { left: 200, width: 1320, top: 470, laneH: 70 };
/** px trên 1 m của đường chạy */
export const PX_PER_M = TRACK.width / 100;
/** Toạ độ trang của mét m trên đường chạy. */
export const mx = (m: number) => TRACK.left + m * PX_PER_M;
/** Mép dưới làn chạy (vị trí mặc định, cảnh 1). */
export const TRACK_BASE = TRACK.top + TRACK.laneH;

/** Vị trí đường chạy: cảnh 1 (giữa khung) và cảnh 2 (thấp, nhỏ, dưới đồ thị). */
export type TrackPose = { top: number; h: number; runnerScale: number };
export const POSE_MAIN: TrackPose = { top: TRACK.top, h: TRACK.laneH, runnerScale: 1 };
export const POSE_LOW: TrackPose = { top: 600, h: 50, runnerScale: 0.72 };
export const lerpPose = (a: TrackPose, b: TrackPose, t: number): TrackPose => ({
  top: lerp(a.top, b.top, t),
  h: lerp(a.h, b.h, t),
  runnerScale: lerp(a.runnerScale, b.runnerScale, t),
});
/** Chân người chạy nằm trong làn, cách mép dưới 30% bề cao làn. */
const footY = (p: TrackPose) => p.top + p.h * 0.6;

export const Track: React.FC<{
  pose?: TrackPose;
  ticks?: number;
  highlight?: { from: number; to: number; opacity: number; color?: string };
  /** chấm "điểm đo" ở mỗi vạch 10 m */
  dataDots?: number;
  /** dấu "?" giữa các chấm đo */
  gapMarks?: number;
  /** chấm vị trí laser (mét) */
  laserDots?: number[];
  runner?: { m: number; color?: string; facing?: number; opacity?: number; name?: string; nameOpacity?: number; glow?: number };
  opacity?: number;
}> = ({ pose = POSE_MAIN, ticks = 1, highlight, dataDots = 0, gapMarks = 0, laserDots, runner, opacity = 1 }) => {
  const { top, h } = pose;
  const base = top + h;
  const mid = top + h / 2;
  const foot = footY(pose);
  const sc = pose.runnerScale;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", opacity }}>
      <rect x={mx(0) - 30} y={top} width={TRACK.width + 60} height={h} rx={10} fill="#E07A5A" />
      <line x1={mx(0)} x2={mx(0)} y1={top} y2={base} stroke="#FFFFFF" strokeWidth={6} />
      <line x1={mx(100)} x2={mx(100)} y1={top} y2={base} stroke="#FFFFFF" strokeWidth={6} strokeDasharray="10 8" />
      {highlight && highlight.opacity > 0 ? (
        <rect
          x={mx(highlight.from)}
          y={top - 6}
          width={Math.max(4, (highlight.to - highlight.from) * PX_PER_M)}
          height={h + 12}
          fill={highlight.color ?? colors.c1}
          fillOpacity={0.5}
          stroke={highlight.color ?? colors.c1}
          strokeWidth={3}
          opacity={highlight.opacity}
        />
      ) : null}
      {laserDots?.map((m, i) => <circle key={i} cx={mx(m)} cy={mid} r={2.2} fill="#FFFFFF" />)}
      {dataDots > 0
        ? Array.from({ length: 11 }).map((_, i) => (
            <circle key={i} data-mark="point" cx={mx(i * 10)} cy={mid} r={11} fill={colors.c2} stroke="#FFFFFF" strokeWidth={4} opacity={dataDots} />
          ))
        : null}
      {gapMarks > 0
        ? Array.from({ length: 10 }).map((_, i) =>
            // bỏ dấu "?" ngay cạnh người chạy
            runner && Math.abs(i * 10 + 5 - runner.m) < 6 ? null : (
            <text key={i} data-text="gap" x={mx(i * 10 + 5)} y={mid + 12} textAnchor="middle" fontFamily={fontText} fontWeight={800} fontSize={fontSize.label} fill="#FFFFFF" opacity={gapMarks}>
              ?
            </text>
          ))
        : null}
      <g opacity={ticks}>
        {Array.from({ length: 11 }).map((_, i) => (
          <g key={i}>
            <line x1={mx(i * 10)} x2={mx(i * 10)} y1={base + 6} y2={base + 20} stroke={colors.axis} strokeWidth={3} />
            <text data-text="tick" x={mx(i * 10)} y={base + 48} textAnchor="middle" fontFamily={fontText} fontSize={fontSize.tick} fill={colors.muted}>
              {i * 10}
            </text>
          </g>
        ))}
        <text data-text="axis" x={mx(100) + 40} y={base + 48} fontFamily={fontText} fontWeight={600} fontSize={fontSize.label} fill={colors.text}>
          quãng đường (m)
        </text>
      </g>
      {runner && (runner.opacity ?? 1) > 0 ? (
        <g opacity={runner.opacity ?? 1}>
          {runner.glow ? (
            <circle cx={mx(runner.m) + 8 * sc} cy={foot - 75 * sc} r={100 * sc} fill="none" stroke={colors.accent} strokeWidth={6} opacity={runner.glow} />
          ) : null}
          <g data-mark="runner" transform={`translate(${mx(runner.m)}, ${foot}) scale(${sc})`}>
            <RunnerFigure phase={runner.m * 0.9} facing={runner.facing ?? 1} color={runner.color} />
          </g>
          {runner.name ? (
            // đường chạy nhỏ (cảnh 2): tên đặt cạnh đầu để không chạm đồ thị phía trên
            <text
              data-text="label"
              x={sc < 0.9 ? mx(runner.m) + 44 : mx(runner.m) + 16 * sc}
              y={sc < 0.9 ? foot - 92 * sc : foot - 170 * sc - 8}
              textAnchor={sc < 0.9 ? "start" : "middle"}
              fontFamily={fontText}
              fontWeight={800}
              fontSize={fontSize.label}
              fill={runner.color ?? colors.text}
              opacity={runner.nameOpacity ?? 1}
            >
              {runner.name}
            </text>
          ) : null}
        </g>
      ) : null}
    </svg>
  );
};
/** Toạ độ trang của đỉnh đầu người chạy đang đứng ở mét m trên đường chạy (cảnh 1). */
export const headTop = (m: number) => ({ x: mx(m) + 16, y: footY(POSE_MAIN) - 150 });

// ---------------- Biểu tượng ----------------

/** Thẻ đồng hồ bấm giờ: biểu tượng + số giây. */
export const Stopwatch: React.FC<{ time: number; left: number; top: number; opacity?: number }> = ({ time, left, top, opacity = 1 }) => (
  <Card style={{ left, top, padding: "14px 30px", display: "flex", alignItems: "center", gap: 18, opacity }}>
    <svg width={46} height={52}>
      <rect x={17} y={0} width={12} height={8} rx={2} fill={colors.text} />
      <circle cx={23} cy={30} r={19} fill="#FFFFFF" stroke={colors.text} strokeWidth={5} />
      <line x1={23} y1={30} x2={23 + 13 * Math.sin((time / 60) * 2 * Math.PI * 6)} y2={30 - 13 * Math.cos((time / 60) * 2 * Math.PI * 6)} stroke={colors.decrease} strokeWidth={4} strokeLinecap="round" />
    </svg>
    <div data-text="card" style={{ ...label, fontSize: 48, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
      {time.toFixed(2).replace(".", ",")} s
    </div>
  </Card>
);

/** Máy laser trên chân máy (≈ 90×120px); (x, y) = điểm giữa đáy chân máy. */
export const LaserIcon: React.FC<{ x: number; y: number; opacity?: number }> = ({ x, y, opacity = 1 }) => (
  <g data-mark="laser" transform={`translate(${x}, ${y})`} opacity={opacity}>
    <path d="M0,-58 L-30,0 M0,-58 L30,0 M0,-58 L0,0" stroke={colors.text} strokeWidth={6} strokeLinecap="round" />
    <rect x={-40} y={-112} width={80} height={52} rx={10} fill={colors.text} />
    <circle cx={34} cy={-86} r={12} fill={colors.decrease} />
    <rect x={-28} y={-102} width={36} height={8} rx={4} fill="#FFFFFF" opacity={0.5} />
  </g>
);

/** Dấu "?" lớn bật lên theo p (0 → 1). */
export const BigQuestion: React.FC<{ x: number; y: number; p: number; size?: number }> = ({ x, y, p, size = 130 }) => (
  <div
    data-text="question"
    style={{
      position: "absolute",
      left: x,
      top: y,
      translate: "-50% 0",
      fontFamily: fontText,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1,
      color: colors.accent,
      opacity: interpolate(p, [0, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      scale: interpolate(p, [0, 1], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    }}
  >
    ?
  </div>
);
