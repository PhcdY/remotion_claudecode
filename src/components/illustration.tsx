import { interpolatePath } from "@remotion/paths";
import React, { useId } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { Layer, wander } from "./motion";
import { colors, fontText } from "./theme";

// Chất liệu minh hoạ dùng chung (.agents/chuan-thi-giac.md › 7, 8): nền có chiều sâu, ánh sáng, bóng mềm.
// Thứ làm hình hết "nhựa": lớp xa nhạt dần vào màu trời (phối cảnh không khí), mặt có chuyển sáng–tối,
// viền sáng ở mép đón sáng, bóng đổ mềm dưới vật, bụi sáng trôi chậm. Không thẻ trắng phẳng.

const hex = (c: string) => {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Pha hai màu hex: t = 0 → a, t = 1 → b. */
export const mix = (a: string, b: string, t: number) => {
  const A = hex(a);
  const B = hex(b);
  const v = A.map((x, i) => Math.round(x + (B[i] - x) * t));
  return `#${v.map((x) => x.toString(16).padStart(2, "0")).join("")}`;
};

export type Palette = {
  /** trời: trên → dưới */
  skyTop: string;
  skyBottom: string;
  /** quầng sáng nguồn (mặt trời, đèn) */
  glow: string;
  /** núi/khối nền: xa → gần */
  far: string;
  mid: string;
  near: string;
  /** bụi sáng */
  dust: string;
};

/** Bảng màu cảnh. Đều nền sáng hợp brand 9Study (chữ navy đọc rõ), trừ `dem`. */
export const PALETTES = {
  /** chiều muộn: trầm, hoài niệm — văn, sử */
  chieu: { skyTop: "#C7D0F3", skyBottom: "#FBE4D6", glow: "#FFD3A3", far: "#C9CCEB", mid: "#A9AEDD", near: "#8890CC", dust: "#FFF4E6" },
  /** trời sáng: trung tính — toán, lý, địa */
  troi: { skyTop: "#CFE0FF", skyBottom: "#F5F9FF", glow: "#FFFFFF", far: "#C6D8F8", mid: "#A9C2F1", near: "#89A8E8", dust: "#FFFFFF" },
  /** bình minh: tươi, mở đầu — sinh, hoá */
  binhMinh: { skyTop: "#D6E6FF", skyBottom: "#FFF1DA", glow: "#FFE2A8", far: "#CFE3D8", mid: "#A9D3C0", near: "#7FBFA4", dust: "#FFFFFF" },
  /** đêm: chiều sâu mạnh, chữ phải sáng màu — chỉ dùng khi cả cảnh cần (vũ trụ, nguyên tử) */
  dem: { skyTop: "#141A4D", skyBottom: "#2C3480", glow: "#6D7CFF", far: "#252E78", mid: "#1D2466", near: "#151B4F", dust: "#C9D2FF" },
} satisfies Record<string, Palette>;

/** Đường đồi mềm (tổng hai sóng sin pha ngẫu nhiên theo seed), trải rộng hơn khung để camera lia không lộ mép. */
const hillPath = (seed: string, baseY: number, amp: number) => {
  const p1 = random(seed + "a") * 6.28;
  const p2 = random(seed + "b") * 6.28;
  const f1 = 0.0016 + random(seed + "c") * 0.0012;
  const f2 = 0.004 + random(seed + "d") * 0.003;
  const pts: string[] = [];
  for (let x = -1400; x <= 3320; x += 40) {
    const y = baseY + amp * (0.65 * Math.sin(x * f1 + p1) + 0.35 * Math.sin(x * f2 + p2));
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M -1400 3000 L ${pts.join(" L ")} L 3320 3000 Z`;
};

const Hill: React.FC<{ seed: string; baseY: number; amp: number; color: string; sky: string; rim: string }> = ({
  seed,
  baseY,
  amp,
  color,
  sky,
  rim,
}) => {
  const id = useId().replace(/:/g, "");
  const d = hillPath(seed, baseY, amp);
  return (
    <svg data-deco width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        {/* trên đỉnh hơi ngả màu trời (sương), xuống dưới đậm dần */}
        <linearGradient id={`h${id}`} x1="0" y1={baseY - amp} x2="0" y2={baseY + 700} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={mix(color, sky, 0.25)} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#h${id})`} />
      {/* viền sáng mép trên: đón ánh sáng nguồn */}
      <path d={d} fill="none" stroke={rim} strokeWidth={3} strokeOpacity={0.55} />
    </svg>
  );
};

/** Bụi sáng trôi lên rất chậm, lớn nhỏ khác nhau (gần thì to, mờ hơn). */
const Dust: React.FC<{ color: string; count: number; seed: string }> = ({ color, count, seed }) => {
  const frame = useCurrentFrame();
  return (
    <svg data-deco width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {Array.from({ length: count }).map((_, i) => {
        const r = 2 + random(`${seed}r${i}`) * 5;
        const speed = 0.15 + random(`${seed}s${i}`) * 0.35;
        const x0 = -300 + random(`${seed}x${i}`) * 2520;
        const span = 1500;
        const y = 1300 - ((random(`${seed}y${i}`) * span + frame * speed) % span);
        const x = x0 + wander(frame, `${seed}${i}`, 18, 0.005).x;
        const o = 0.25 + random(`${seed}o${i}`) * 0.45;
        return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={o} />;
      })}
    </svg>
  );
};

/**
 * Nền cảnh có chiều sâu, đặt trong `Camera` (trước nội dung): trời cố định, quầng sáng, 3 lớp đồi xa → gần lia chậm dần,
 * bụi sáng. `horizon`: độ cao chân trời (y, toạ độ thế giới). `hills={false}` cho cảnh không cần mặt đất (vũ trụ, chữ thuần).
 */
export const Backdrop: React.FC<{
  palette?: Palette;
  horizon?: number;
  /** vị trí quầng sáng (toạ độ màn hình) */
  sun?: [number, number];
  hills?: boolean;
  seed?: string;
}> = ({ palette = PALETTES.troi, horizon = 820, sun = [1450, 700], hills = true, seed = "canh" }) => {
  const P = palette;
  return (
    <>
      <Layer depth={0}>
        {/* lớp depth 0 dính vào màn hình nên chỉ cần phủ đúng khung */}
        <AbsoluteFill data-deco style={{ background: `linear-gradient(180deg, ${P.skyTop} 0%, ${P.skyBottom} 78%)` }} />
        <div
          data-deco
          style={{
            position: "absolute",
            left: sun[0] - 700,
            top: sun[1] - 700,
            width: 1400,
            height: 1400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${P.glow}CC 0%, ${P.glow}55 30%, ${P.glow}00 68%)`,
          }}
        />
      </Layer>
      {hills ? (
        <>
          <Layer depth={0.25}>
            <Hill seed={`${seed}1`} baseY={horizon - 40} amp={70} color={P.far} sky={P.skyBottom} rim={P.glow} />
          </Layer>
          <Layer depth={0.45}>
            <Hill seed={`${seed}2`} baseY={horizon + 60} amp={60} color={P.mid} sky={P.skyBottom} rim={P.glow} />
          </Layer>
          <Layer depth={0.7}>
            <Hill seed={`${seed}3`} baseY={horizon + 180} amp={50} color={P.near} sky={P.skyBottom} rim={P.glow} />
          </Layer>
        </>
      ) : null}
      <Layer depth={0.6}>
        <Dust color={P.dust} count={36} seed={seed} />
      </Layer>
    </>
  );
};

/**
 * Hình biến dần thành hình khác (@remotion/paths › interpolatePath): con dốc → đồ thị, giọt nước → hình tròn…
 * `from`, `to`: chuỗi path SVG cùng hệ toạ độ; progress 0 → 1. Giữ mốc: trong lúc biến, `ghost` vẽ mờ hình gốc
 * để người xem thấy cái gì thành cái gì (dung-video › quy tắc 6, 9).
 */
export const MorphShape: React.FC<{
  from: string;
  to: string;
  progress: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  ghost?: boolean;
}> = ({ from, to, progress, fill = "none", stroke = colors.text, strokeWidth = 6, ghost = true }) => {
  const p = Math.max(0, Math.min(1, progress));
  const d = p <= 0 ? from : p >= 1 ? to : interpolatePath(p, from, to);
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {ghost && p > 0 && p < 1 ? (
        <path data-deco d={from} fill="none" stroke={stroke} strokeWidth={strokeWidth} opacity={0.25 * (1 - p)} />
      ) : null}
      <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** Quầng sáng mềm phía sau trọng tâm (báo cho mắt "nhìn vào đây"). */
export const Glow: React.FC<{ x: number; y: number; r: number; color: string; opacity?: number }> = ({
  x,
  y,
  r,
  color,
  opacity = 1,
}) => (
  <div
    data-deco
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      opacity,
      background: `radial-gradient(circle, ${color}99 0%, ${color}33 40%, ${color}00 70%)`,
    }}
  />
);

/** Bóng đổ mềm dưới vật đứng/lơ lửng (càng cao bóng càng nhỏ, nhạt). */
export const GroundShadow: React.FC<{ x: number; y: number; w: number; lift?: number }> = ({ x, y, w, lift = 0 }) => {
  const k = 1 / (1 + lift / 120);
  return (
    <div
      data-deco
      style={{
        position: "absolute",
        left: x - (w * k) / 2,
        top: y - 14 * k,
        width: w * k,
        height: 28 * k,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(14,16,70,0.28) 0%, rgba(14,16,70,0) 70%)",
        opacity: k,
      }}
    />
  );
};

/**
 * Bong bóng lời (câu nói, câu trả lời của học sinh) — vật có khối: mặt chuyển sáng–tối, viền sáng, đuôi chỉ người nói,
 * bóng đổ mềm bên dưới. Chữ bên trong ≥ 40px.
 */
export const Bubble: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  tail?: "left" | "right";
  rotate?: number;
  opacity?: number;
  grey?: number;
  lift?: number;
  children: React.ReactNode;
}> = ({ x, y, w, h, color = "#FFFFFF", tail = "left", rotate = 0, opacity = 1, grey = 0, lift = 0, children }) => {
  const id = useId().replace(/:/g, "");
  const r = Math.min(40, h / 2);
  const tx = tail === "left" ? w * 0.22 : w * 0.78;
  const tailPath = `M ${tx - 26} ${h - 2} L ${tx + (tail === "left" ? -46 : 46)} ${h + 46} L ${tx + 26} ${h - 2} Z`;
  return (
    <>
      <GroundShadow x={x} y={y + h / 2 + 90} w={w * 0.8} lift={lift} />
      <div
        data-box
        style={{
          position: "absolute",
          left: x - w / 2,
          top: y - h / 2 - lift,
          width: w,
          height: h,
          rotate: `${rotate}deg`,
          opacity,
          filter: grey > 0 ? `grayscale(${grey}) brightness(${1 - grey * 0.05})` : undefined,
        }}
      >
        <svg width={w} height={h + 50} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <defs>
            <linearGradient id={`b${id}`} x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0" stopColor={mix(color, "#FFFFFF", 0.6)} />
              <stop offset="1" stopColor={mix(color, colors.brandIndigo, 0.08)} />
            </linearGradient>
          </defs>
          <path d={tailPath} fill={mix(color, colors.brandIndigo, 0.08)} />
          <rect x={0} y={0} width={w} height={h} rx={r} fill={`url(#b${id})`} />
          {/* mép trên đón sáng, mép dưới hơi tối: có khối, không phẳng */}
          <rect x={1.5} y={1.5} width={w - 3} height={h - 3} rx={r} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeOpacity={0.9} />
          <rect x={0} y={0} width={w} height={h} rx={r} fill="none" stroke={mix(color, colors.brandIndigo, 0.18)} strokeWidth={2} />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 36px",
            boxSizing: "border-box",
            textAlign: "center",
            fontFamily: fontText,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};
