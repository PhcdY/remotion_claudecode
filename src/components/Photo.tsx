import React from "react";
import { Img, getStaticFiles, interpolate, staticFile, useCurrentFrame } from "remotion";
import { colors, fontText, shadow } from "./theme";

/**
 * Ảnh tư liệu / ảnh minh hoạ (.agents/chuan-thi-giac.md › 5).
 * File đặt ở public/images/<slug>/<file>, khai báo trong trường `images` của beat (script.json).
 * Thiếu file → vẽ ô đỏ "THIẾU ẢNH" cỡ lớn (gắn data-missing-image để check-layout báo lỗi),
 * không bao giờ lặng lẽ bỏ ảnh.
 */
export const Photo: React.FC<{
  /** đường dẫn trong public/, vd. "images/bac-oi/bac-ho-1969.jpg" */
  src: string;
  /** mô tả ảnh (hiện trong ô THIẾU ẢNH để biết cần xin ảnh gì) */
  alt: string;
  left: number;
  top: number;
  width: number;
  height: number;
  /** nhãn nhỏ ở góc dưới phải ảnh: nguồn ảnh hoặc "Ảnh minh họa" */
  credit?: string;
  /** frame (tương đối trong beat) bắt đầu trôi phóng; mặc định 0 */
  from?: number;
  /** số frame trôi phóng hết từ zoom[0] tới zoom[1]; mặc định 300 (10 s) */
  drift?: number;
  /** mức phóng đầu → cuối (Ken Burns rất chậm); mặc định [1, 1.06] */
  zoom?: [number, number];
  /** điểm ảnh giữ cố định khi phóng, theo % (0–100); mặc định giữa ảnh */
  focus?: [number, number];
  objectFit?: "cover" | "contain";
  opacity?: number;
  radius?: number;
}> = ({
  src,
  alt,
  left,
  top,
  width,
  height,
  credit,
  from = 0,
  drift = 300,
  zoom = [1, 1.06],
  focus = [50, 50],
  objectFit = "cover",
  opacity = 1,
  radius = 20,
}) => {
  const frame = useCurrentFrame();
  const clean = src.replace(/^\/+/, "");
  const exists = getStaticFiles().some((f) => f.name === clean);
  const scale = interpolate(frame, [from, from + drift], zoom, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const box: React.CSSProperties = {
    position: "absolute",
    left,
    top,
    width,
    height,
    boxSizing: "border-box",
    borderRadius: radius,
    overflow: "hidden",
    opacity,
  };

  if (!exists) {
    return (
      <div
        data-box
        data-missing-image={clean}
        style={{
          ...box,
          background: "#FDECEC",
          border: `6px dashed ${colors.decrease}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 32,
          fontFamily: fontText,
          color: colors.decrease,
          textAlign: "center",
        }}
      >
        <div data-text="label" style={{ fontSize: 56, fontWeight: 800 }}>
          THIẾU ẢNH
        </div>
        <div data-text="label" style={{ fontSize: 36, fontWeight: 600, color: colors.text }}>
          {alt}
        </div>
        <div data-text="note" style={{ fontSize: 24, color: colors.muted }}>
          public/{clean}
        </div>
      </div>
    );
  }

  return (
    <div data-mark="photo" style={{ ...box, boxShadow: shadow }}>
      <Img
        src={staticFile(clean)}
        style={{
          width: "100%",
          height: "100%",
          objectFit,
          transform: `scale(${scale})`,
          transformOrigin: `${focus[0]}% ${focus[1]}%`,
        }}
      />
      {credit ? (
        <div
          data-text="note"
          style={{
            position: "absolute",
            right: 14,
            bottom: 10,
            padding: "2px 10px",
            borderRadius: 8,
            background: "rgba(255, 255, 255, 0.78)",
            fontFamily: fontText,
            fontSize: 22,
            fontWeight: 400,
            color: colors.muted,
          }}
        >
          {credit}
        </div>
      ) : null}
    </div>
  );
};
