import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { MathText, isPureMath } from "./MathText";
import { colors, fontSize, fontText, layout } from "./theme";

export type SubtitleLine = { text: string; startFrame: number };

// Phụ đề: chỉ hiện dòng đang đọc. startFrame tính tương đối với Sequence chứa nó.
export const Subtitle: React.FC<{ lines: SubtitleLine[] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  let current = -1;
  lines.forEach((l, i) => {
    if (frame >= l.startFrame) current = i;
  });
  if (current < 0) return null;

  const cur = lines[current];
  const appear = interpolate(frame - cur.startFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: layout.side,
        right: layout.side,
        top: layout.subtitleTop,
        bottom: 1080 - 1040,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: fontText,
        textAlign: "center",
      }}
    >
      <div
        key={current}
        data-text="subtitle"
        data-zone="subtitle"
        style={{
          fontSize: isPureMath(cur.text) ? fontSize.subtitleMath : fontSize.subtitle,
          fontWeight: 600,
          color: colors.text,
          opacity: appear,
          translate: `0px ${(1 - appear) * 16}px`,
        }}
      >
        <MathText text={cur.text} style={{ display: "inline-block" }} />
      </div>
    </div>
  );
};
