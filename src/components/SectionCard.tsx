import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fontText, shadow } from "./theme";

/** Section nào được hiện cho người xem (skill dung-video › Bước 2). */
export const VISIBLE_SECTIONS = ["TRONG ĐỀ THI", "BẪY THƯỜNG GẶP"];

/** Số giây thẻ mở beat chiếm (hình chính vào sau mốc này). */
export const SECTION_CARD_SECONDS = 1.2;

// Thẻ mở beat: chữ to giữa vùng hình, ~1,2 giây rồi biến mất.
export const SectionCard: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const end = SECTION_CARD_SECONDS * fps;
  const o = interpolate(frame, [0, 6, end - 8, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isTrap = label === "BẪY THƯỜNG GẶP";
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 330,
        display: "flex",
        justifyContent: "center",
        opacity: o,
        scale: interpolate(frame, [0, 10], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}
    >
      <div
        data-text="section"
        style={{
          padding: "28px 64px",
          borderRadius: 28,
          border: `4px solid ${isTrap ? colors.warn : colors.accent}`,
          color: isTrap ? colors.warn : colors.accent,
          background: colors.panel,
          boxShadow: shadow,
          fontFamily: fontText,
          fontWeight: 700,
          fontSize: 84,
          letterSpacing: 6,
        }}
      >
        {label}
      </div>
    </div>
  );
};
