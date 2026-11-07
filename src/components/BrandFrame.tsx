import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fontText, layout, tint } from "./theme";

// Khung chung 9Study (style.md › Khung chung): nền + logo + thanh tiến độ.

const DotCluster: React.FC<{ left: number; top: number; cols: number; rows: number; color: string }> = ({ left, top, cols, rows, color }) => (
  <svg data-deco width={cols * 22} height={rows * 22} style={{ position: "absolute", left, top }}>
    {Array.from({ length: rows }).map((_, r) =>
      Array.from({ length: cols }).map((__, c) => <circle key={`${r}-${c}`} cx={c * 22 + 4} cy={r * 22 + 4} r={3.2} fill={color} />),
    )}
  </svg>
);

export const BrandBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (speed: number, amp: number, phase = 0) => Math.sin(frame * speed + phase) * amp;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${colors.bgEnd} 0%, ${colors.bg} 55%, #EEF3FE 100%)`, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 760,
          height: 760,
          right: -300 + drift(0.006, 24),
          top: -360 + drift(0.005, 18, 1),
          borderRadius: "50%",
          background: `radial-gradient(circle at 40% 60%, ${tint(colors.brandBlue, 0.22)}, ${tint(colors.brandBlue, 0)} 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 680,
          height: 680,
          left: -320 + drift(0.005, 20, 2),
          bottom: -380 + drift(0.006, 16, 3),
          borderRadius: "50%",
          background: `radial-gradient(circle at 60% 40%, ${tint(colors.brandIndigo, 0.16)}, ${tint(colors.brandIndigo, 0)} 70%)`,
        }}
      />
      <DotCluster left={1760} top={40} cols={6} rows={4} color={tint(colors.brandBlue, 0.22)} />
      <DotCluster left={24} top={940} cols={5} rows={4} color={tint(colors.brandIndigo, 0.18)} />
    </AbsoluteFill>
  );
};

export const BrandLogo: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <Img
    src={staticFile("brand/logo-horizontal.png")}
    style={{ position: "absolute", left: layout.side, top: layout.logoTop, height: layout.logoHeight, opacity }}
  />
);

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: 0, bottom: 0, height: 6, width: "100%", background: tint(colors.brandBlue, 0.12) }}>
      <div
        style={{
          height: "100%",
          width: `${(100 * frame) / Math.max(1, durationInFrames - 1)}%`,
          background: `linear-gradient(90deg, ${colors.brandBlue}, ${colors.brandIndigo})`,
        }}
      />
    </div>
  );
};

/** Bọc toàn bộ video: nền ở dưới, nội dung ở giữa, logo + thanh tiến độ ở trên. */
export const BrandFrame: React.FC<{ children: React.ReactNode; logoFrom?: number; logoUntil?: number }> = ({
  children,
  logoFrom = 0,
  logoUntil = Infinity,
}) => {
  const frame = useCurrentFrame();
  const logo = interpolate(frame, [logoFrom, logoFrom + 10, logoUntil - 10, logoUntil], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        fontFamily: fontText,
        color: colors.text,
        scale: 0.987
      }}
    >
      <BrandBackground />
      <AbsoluteFill>{children}</AbsoluteFill>
      <BrandLogo opacity={logo} />
      <ProgressBar />
    </AbsoluteFill>
  );
};

/** Mở đầu: logo lớn + tiêu đề. Đặt trong Sequence riêng. */
export const BrandIntro: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 16 } });
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 40, opacity: out }}>
      <Img src={staticFile("brand/logo-horizontal.png")} style={{ height: 150, opacity: pop, scale: interpolate(pop, [0, 1], [0.9, 1]) }} />
      <div
        data-text="title"
        style={{
          fontFamily: fontText,
          fontWeight: 800,
          fontSize: 72,
          color: colors.text,
          opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};

/** Kết: logo + 9study.vn. */
export const BrandOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 36, opacity: pop }}>
      <Img src={staticFile("brand/logo-horizontal.png")} style={{ height: 170, scale: interpolate(pop, [0, 1], [0.92, 1]) }} />
      <div data-text="url" style={{ fontFamily: fontText, fontWeight: 700, fontSize: 48, color: colors.accent }}>
        9study.vn
      </div>
    </AbsoluteFill>
  );
};
