import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MathText } from "./MathText";
import { colors, fontSize, fontText, layout, tint } from "./theme";

// Câu chốt của beat: hiện từ `from` (frame tương đối), nằm ở dải dưới của vùng hình.
export const KeyTakeaway: React.FC<{ text: string; from: number }> = ({ text, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - from, fps, config: { damping: 16, stiffness: 150 } });
  if (frame < from) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: layout.side,
        right: layout.side,
        top: layout.takeawayTop,
        height: layout.visualBottom - layout.takeawayTop,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: interpolate(pop, [0, 1], [0, 1]),
        translate: `0px ${(1 - pop) * 20}px`,
      }}
    >
      <div
        data-text="takeaway"
        style={{
          padding: "6px 40px",
          borderRadius: 18,
          borderLeft: `8px solid ${colors.accent}`,
          background: tint(colors.accent, 0.08),
          color: colors.accent,
          fontFamily: fontText,
          fontWeight: 800,
          fontSize: fontSize.takeaway,
          whiteSpace: "nowrap",
        }}
      >
        <MathText text={text} />
      </div>
    </div>
  );
};
