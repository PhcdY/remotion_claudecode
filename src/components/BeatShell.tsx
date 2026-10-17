import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { KeyTakeaway } from "./KeyTakeaway";
import { SECTION_CARD_SECONDS, SectionCard, VISIBLE_SECTIONS } from "./SectionCard";
import { Subtitle, SubtitleLine } from "./Subtitle";

/**
 * Thời điểm (frame, tương đối với beat) bắt đầu / kết thúc từng dòng.
 * T0: frame hình chính bắt đầu (sau thẻ mở beat nếu có, ngược lại 0).
 */
export type BeatProps = { L: number[]; E: number[]; T0: number };

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 trong khoảng frame [a, b]. */
export const ramp = (frame: number, a: number, b: number, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, [a, Math.max(b, a + 1)], [0, 1], { ...clamp, easing });

/** Số frame thẻ mở beat chiếm (0 nếu section không hiện cho người xem). */
export const introFrames = (section: string, fps: number) =>
  VISIBLE_SECTIONS.indexOf(section) >= 0 ? Math.round(SECTION_CARD_SECONDS * fps) : 0;

/** Khung chung của một beat: thẻ mở beat (nếu có) + hình + câu chốt + phụ đề. */
export const BeatShell: React.FC<{
  section: string;
  keyword: string;
  lines: SubtitleLine[];
  children: React.ReactNode;
}> = ({ section, keyword, lines, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const t0 = introFrames(section, fps);
  const fade = interpolate(frame, [0, 8, durationInFrames - 8, durationInFrames], [0, 1, 1, 0], clamp);
  const visualIn = t0 > 0 ? interpolate(frame, [t0 - 6, t0 + 6], [0, 1], clamp) : 1;
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <AbsoluteFill style={{ opacity: visualIn }}>{children}</AbsoluteFill>
      {t0 > 0 ? <SectionCard label={section} /> : null}
      <KeyTakeaway text={keyword} from={lines[lines.length - 1].startFrame} />
      <Subtitle lines={lines} />
    </AbsoluteFill>
  );
};
