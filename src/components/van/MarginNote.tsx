import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MathText } from "../MathText";
import { MIN_FONT, colors, fontText } from "../theme";
import { fontQuote } from "./useVanQuoteFont";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const prog = (f: number, a: number, d: number) =>
  interpolate(f, [a, a + d], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });

/** Nét gạch tay dưới chữ, vẽ dần từ trái sang phải theo `progress` (0..1). */
export const BrushLine: React.FC<{ ink: string; progress: number; width?: number }> = ({ ink, progress, width = 3.4 }) => (
  <svg
    viewBox="0 0 200 14"
    preserveAspectRatio="none"
    style={{ display: "block", width: "100%", height: 14, clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }}
  >
    <path
      d="M2 9 C 42 3, 92 12, 132 6 S 182 5, 198 8"
      fill="none"
      stroke={ink}
      strokeWidth={width}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

/**
 * Nhãn ghi chú bên lề (gói Văn › mục 3.4), thay cho tag dạng thẻ: đường dẫn mảnh từ vật tới chữ,
 * tên in Serif có màu, nét gạch tay vẽ dần dưới tên. Không nền, không viền hộp.
 * `from`: điểm trên vật; `to`: nơi đường dẫn dừng, chữ đặt ngay sau điểm này.
 */
export const MarginNote: React.FC<{
  from: [number, number];
  to: [number, number];
  title: string;
  sub?: string;
  /** màu đậm của khái niệm: chữ, đường dẫn, nét gạch */
  ink: string;
  at: number;
  out?: number;
  /** chữ nằm bên phải (mặc định) hay bên trái điểm `to` */
  side?: "right" | "left";
  /** độ cong đường dẫn (px, âm là cong ngược) */
  bend?: number;
  titleSize?: number;
  /** làm mờ cả nhãn khi không phải nhãn đang nói tới */
  dim?: number;
}> = ({ from, to, title, sub, ink, at, out, side = "right", bend = -46, titleSize = 60, dim = 0 }) => {
  const frame = useCurrentFrame();
  const line = prog(frame, at, 15);
  const reveal = prog(frame, at + 9, 14);
  const stroke = prog(frame, at + 17, 14);
  const gone = out === undefined ? 0 : prog(frame, out, 12);
  const opacity = (1 - gone) * (1 - dim);
  if (line <= 0 || opacity <= 0) return null;
  const mx = (from[0] + to[0]) / 2;
  const my = (from[1] + to[1]) / 2 + bend;
  const textStyle: React.CSSProperties =
    side === "right" ? { left: to[0] + 18 } : { right: 1920 - to[0] + 18, textAlign: "right" };
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity, pointerEvents: "none" }}>
        <path
          d={`M ${from[0]} ${from[1]} Q ${mx} ${my} ${to[0]} ${to[1]}`}
          fill="none"
          stroke={ink}
          strokeWidth={3}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - line}
        />
        <circle cx={from[0]} cy={from[1]} r={8 * Math.min(1, line * 3)} fill={ink} />
      </svg>
      <div
        style={{
          position: "absolute",
          top: to[1] - titleSize * 0.72,
          opacity: opacity * reveal,
          translate: `${(side === "right" ? -1 : 1) * (1 - reveal) * 16}px 0`,
          ...textStyle,
        }}
      >
        <div style={{ display: "inline-block", position: "relative" }}>
          <div
            data-text="label"
            style={{
              fontFamily: fontQuote,
              fontWeight: 600,
              fontSize: titleSize,
              lineHeight: 1.16,
              color: ink,
              whiteSpace: "nowrap",
              textShadow: "0 0 16px rgba(255,255,255,.95), 0 0 5px rgba(255,255,255,.85)",
            }}
          >
            <MathText text={title} />
          </div>
          <BrushLine ink={ink} progress={stroke} />
        </div>
        {sub ? (
          <div
            data-text="label"
            style={{
              marginTop: 5,
              fontFamily: fontText,
              fontWeight: 600,
              fontSize: MIN_FONT.label,
              color: colors.text,
              whiteSpace: "nowrap",
              textShadow: "0 0 14px rgba(255,255,255,.95), 0 0 4px rgba(255,255,255,.85)",
            }}
          >
            <MathText text={sub} />
          </div>
        ) : null}
      </div>
    </>
  );
};
