import "./mhchem";
import React from "react";
import { interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { MathText } from "../MathText";
import { colors, fontText } from "../theme";
import { element } from "./elements";

/**
 * Kim loại kiềm thả vào cốc nước — gói môn Hóa › mục 6.2 ("cùng kiểu, khác mức độ").
 * Mỗi kim loại có dấu hiệu THẬT riêng (theo thí nghiệm SGK), để người xem thấy được khác biệt mà không cần lời:
 *   Li: nổi, giữ nguyên hình miếng, sủi bọt đều và chậm, trôi chậm, dung dịch hồng chậm.
 *   Na: nổi, chảy thành giọt tròn sáng, chạy nhanh trên mặt nước (có vệt), sủi mạnh, có làn hơi, hồng nhanh.
 *   K : như Na nhưng mạnh hơn nữa, bốc cháy ngọn lửa màu tím hồng (lilac), hồng rất nhanh.
 * Ký hiệu nằm trên miếng kim loại + thẻ tên "Sodium (Na)" trên cốc → người xem luôn biết cốc nào là chất nào.
 *
 * Dùng: <MetalInWater metal="Na" left={1000} top={220} width={460} start={L[1]} indicator />
 * `start`: frame (trong beat) lúc thả miếng kim loại. Trước `start` miếng kim loại treo phía trên cốc.
 */

export type AlkaliMetal = "Li" | "Na" | "K";

const BEHAVIOR: Record<
  AlkaliMetal,
  { bubbles: number; speed: number; roam: number; melt: boolean; flame?: string; pinkSec: number; mist: boolean; shrinkTo: number; trail: boolean }
> = {
  Li: { bubbles: 7, speed: 0.5, roam: 0.07, melt: false, pinkSec: 7, mist: false, shrinkTo: 0.85, trail: false },
  Na: { bubbles: 18, speed: 2.1, roam: 0.3, melt: true, pinkSec: 2.5, mist: true, shrinkTo: 0.6, trail: true },
  K: { bubbles: 28, speed: 3.1, roam: 0.33, melt: true, flame: "#B57EDC", pinkSec: 1.2, mist: true, shrinkTo: 0.5, trail: true },
};

const WATER = "#CFE4FB";
const PINK = "#EC4899"; // phenolphthalein trong dung dịch base
const METAL = "#B8C2CE";

/** Vị trí miếng kim loại (toạ độ trong khung SVG của component) ở giây t sau khi thả. */
const metalAt = (metal: AlkaliMetal, t: number, W: number, surfaceY: number) => {
  const b = BEHAVIOR[metal];
  const cx = W / 2;
  if (t < 0) return { x: cx, y: surfaceY - W * 0.32 };
  const fall = Math.min(1, t / 0.4);
  const y = interpolate(fall, [0, 1], [surfaceY - W * 0.32, surfaceY - 4]);
  const r = Math.max(0, t - 0.4);
  const x = cx + b.roam * W * (0.7 * Math.sin(r * b.speed * 1.7) + 0.3 * Math.sin(r * b.speed * 2.9 + 1));
  return { x, y };
};

/** Toạ độ tuyệt đối của miếng kim loại (để neo nhãn/mũi tên). */
export const metalInWaterAnchor = (p: { metal: AlkaliMetal; left: number; top: number; width?: number; start: number }, frame: number, fps: number) => {
  const W = p.width ?? 420;
  const surfaceY = 0.42 * W;
  const m = metalAt(p.metal, (frame - p.start) / fps, W, surfaceY);
  return { x: p.left + m.x, y: p.top + TAG_H + m.y };
};

const TAG_H = 76;

export const MetalInWater: React.FC<{
  metal: AlkaliMetal;
  left: number;
  top: number;
  /** bề rộng cốc (px), nên 360–520. Tổng cao ≈ 1,25 × width + 130 */
  width?: number;
  start: number;
  /** có nhỏ phenolphthalein: dung dịch chuyển hồng khi base tạo thành */
  indicator?: boolean;
  /** chữ dưới cốc, vd. "nước + phenolphthalein" */
  liquidLabel?: string;
  /** màu thẻ tên (theo vai trò trong cảnh) */
  color?: string;
  opacity?: number;
}> = ({ metal, left, top, width: W = 420, start, indicator = false, liquidLabel, color = colors.accent, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = BEHAVIOR[metal];
  const t = (frame - start) / fps;
  const r = Math.max(0, t - 0.4); // thời gian phản ứng
  const H = W * 1.0;
  const surfaceY = 0.42 * W;
  const beakerTop = 0.18 * W;
  const m = metalAt(metal, t, W, surfaceY);
  const base = W * 0.2; // cỡ miếng kim loại
  const shrink = interpolate(r, [0, 10], [1, b.shrinkTo], { extrapolateRight: "clamp" });
  const melt = b.melt ? interpolate(r, [0, 0.6], [0, 1], { extrapolateRight: "clamp" }) : 0;
  const mw = base * shrink * interpolate(melt, [0, 1], [1, 0.62]);
  const mh = base * shrink * interpolate(melt, [0, 1], [0.45, 0.62]);
  const pink = indicator ? interpolate(r, [0, b.pinkSec], [0, 1], { extrapolateRight: "clamp" }) : 0;
  const liquid = interpolateColors(pink, [0, 1], [WATER, PINK]);
  const active = r > 0;
  const symFont = Math.max(28, Math.min(mh * 0.62, mw * 0.42));

  // bọt khí H2 quanh miếng kim loại: số bọt và tốc độ theo mức độ phản ứng
  const bubbles = active
    ? Array.from({ length: b.bubbles }).map((_, i) => {
        const seed = (i * 73) % 97;
        const life = 0.6 + (seed % 5) * 0.12;
        const ph = ((r * b.speed * 0.9 + seed / 13) % life) / life; // 0→1
        const ang = (seed / 97) * Math.PI * 2;
        const dist = mw * 0.55 + ph * W * 0.06;
        return { x: m.x + Math.cos(ang) * dist, y: m.y - ph * W * 0.05 + Math.sin(ang) * W * 0.012, r: (W / 420) * (3.5 + (seed % 4) * 1.3), o: 1 - ph };
      })
    : [];
  const trail = b.trail && active ? [0.08, 0.16, 0.24].map((d) => metalAt(metal, t - d, W, surfaceY)) : [];
  const flick = Math.sin(frame * 0.9) * 0.08 + Math.sin(frame * 1.7) * 0.05;

  return (
    <div data-box="lab" style={{ position: "absolute", left, top, width: W, height: TAG_H + H + 60, opacity, fontFamily: fontText }}>
      <div
        data-box="tag"
        style={{
          position: "absolute",
          left: W * 0.1,
          right: W * 0.1,
          top: 0,
          height: TAG_H - 16,
          borderRadius: 14,
          border: `3px solid ${color}`,
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div data-text="label" style={{ fontSize: 36, fontWeight: 800, color }}>
          <MathText text={`${element(metal).name} (${metal})`} />
        </div>
      </div>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: TAG_H, overflow: "visible" }}>
        {/* nước */}
        <path
          d={`M ${W * 0.12} ${surfaceY} L ${W * 0.88} ${surfaceY} L ${W * 0.88} ${H - 18} Q ${W * 0.88} ${H - 4} ${W * 0.84} ${H - 4} L ${W * 0.16} ${H - 4} Q ${W * 0.12} ${H - 4} ${W * 0.12} ${H - 18} Z`}
          fill={liquid}
          opacity={0.85}
        />
        <line x1={W * 0.12} y1={surfaceY} x2={W * 0.88} y2={surfaceY} stroke={interpolateColors(pink, [0, 1], ["#7FB2EE", "#DB2777"])} strokeWidth={3} />
        {/* làn hơi trắng phía trên (Na, K) */}
        {b.mist &&
          active &&
          [0, 1, 2].map((i) => {
            const ph = ((r * 0.7 + i / 3) % 1);
            return <circle key={i} cx={m.x + (i - 1) * W * 0.05} cy={m.y - W * 0.04 - ph * W * 0.12} r={W * (0.025 + ph * 0.03)} fill="#FFFFFF" opacity={0.55 * (1 - ph)} stroke="#E2E8F0" />;
          })}
        {/* vệt chạy trên mặt nước (Na, K) */}
        {trail.map((p, i) => (
          <ellipse key={i} cx={p.x} cy={surfaceY - 2} rx={mw * (0.5 - i * 0.1)} ry={mh * 0.3} fill={METAL} opacity={0.28 - i * 0.08} />
        ))}
        {/* bọt khí hydrogen */}
        {bubbles.map((q, i) => (
          <circle key={i} cx={q.x} cy={q.y} r={q.r} fill="#FFFFFF" stroke="#94A3B8" strokeWidth={1.2} opacity={Math.max(0, q.o)} />
        ))}
        {/* ngọn lửa tím (K) */}
        {b.flame && active && (
          <path
            d={`M ${m.x - mw * 0.45} ${m.y - mh * 0.3} Q ${m.x - mw * 0.5} ${m.y - mh * 1.6} ${m.x} ${m.y - mh * (2.6 + flick * 4)} Q ${m.x + mw * 0.5} ${m.y - mh * 1.6} ${m.x + mw * 0.45} ${m.y - mh * 0.3} Z`}
            fill={b.flame}
            opacity={interpolate(r, [0, 0.4], [0, 0.85], { extrapolateRight: "clamp" })}
          />
        )}
        {/* miếng kim loại: hình hộp (Li, hoặc Na/K trước khi chảy) → giọt tròn (Na/K) */}
        <rect
          x={m.x - mw / 2}
          y={m.y - mh / 2}
          width={mw}
          height={mh}
          rx={interpolate(melt, [0, 1], [5, mh / 2])}
          fill={METAL}
          stroke="#64748B"
          strokeWidth={2}
        />
        <rect x={m.x - mw * 0.32} y={m.y - mh * 0.34} width={mw * 0.3} height={mh * 0.16} rx={mh * 0.08} fill="#FFFFFF" opacity={0.75} />
        {/* thành cốc */}
        <path
          d={`M ${W * 0.08} ${beakerTop} L ${W * 0.12} ${beakerTop + 8} L ${W * 0.12} ${H - 18} Q ${W * 0.12} ${H} ${W * 0.16} ${H} L ${W * 0.84} ${H} Q ${W * 0.88} ${H} ${W * 0.88} ${H - 18} L ${W * 0.88} ${beakerTop + 8} L ${W * 0.92} ${beakerTop}`}
          fill="none"
          stroke="#94A3B8"
          strokeWidth={5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <line x1={W * 0.82} y1={beakerTop + 40} x2={W * 0.82} y2={H - 40} stroke="#FFFFFF" strokeWidth={5} opacity={0.7} strokeLinecap="round" />
      </svg>
      {/* ký hiệu trên miếng kim loại */}
      <div
        data-text="tick"
        style={{
          position: "absolute",
          left: m.x - 60,
          width: 120,
          top: TAG_H + m.y - symFont * 0.62,
          textAlign: "center",
          fontSize: symFont,
          fontWeight: 800,
          lineHeight: 1.2,
          color: colors.text,
        }}
      >
        <MathText text={metal} />
      </div>
      {liquidLabel && (
        <div data-text="label" style={{ position: "absolute", left: 0, right: 0, top: TAG_H + H + 12, textAlign: "center", fontSize: 30, fontWeight: 600, color: colors.muted }}>
          <MathText text={liquidLabel} />
        </div>
      )}
    </div>
  );
};
