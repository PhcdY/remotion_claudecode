import { Lottie, type LottieAnimationData } from "@remotion/lottie";
import React, { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, getStaticFiles, staticFile } from "remotion";
import { colors, fontText } from "./theme";

/**
 * Hoạt hình vector làm sẵn (Lottie .json) — nhân vật, icon động, hiệu ứng — từ public/lottie/<file>.json.
 * Chỉ dùng file có giấy phép rõ (ghi nguồn + giấy phép cạnh file, vd. public/lottie/CREDITS.md).
 * Thiếu file → ô đỏ "THIẾU LOTTIE" (data-missing-image để check-layout báo lỗi), không lặng lẽ bỏ.
 */
export const LottieAsset: React.FC<{
  /** đường dẫn trong public/, vd. "lottie/chim-bay.json" */
  src: string;
  alt: string;
  left: number;
  top: number;
  width: number;
  height: number;
  loop?: boolean;
  playbackRate?: number;
  opacity?: number;
}> = ({ src, alt, left, top, width, height, loop = true, playbackRate = 1, opacity = 1 }) => {
  const clean = src.replace(/^\/+/, "");
  const exists = getStaticFiles().some((f) => f.name === clean);
  const [data, setData] = useState<LottieAnimationData | null>(null);
  const [handle] = useState(() => (exists ? delayRender(`Nạp Lottie ${clean}`) : null));

  useEffect(() => {
    if (handle === null) return;
    fetch(staticFile(clean))
      .then((r) => r.json())
      .then((json: LottieAnimationData) => {
        setData(json);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [clean, handle]);

  const box: React.CSSProperties = { position: "absolute", left, top, width, height, opacity };

  if (!exists) {
    return (
      <div
        data-box
        data-missing-image={clean}
        style={{
          ...box,
          boxSizing: "border-box",
          border: `6px dashed ${colors.decrease}`,
          borderRadius: 20,
          background: "#FDECEC",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          fontFamily: fontText,
          color: colors.decrease,
          textAlign: "center",
          padding: 24,
        }}
      >
        <div data-text="label" style={{ fontSize: 48, fontWeight: 800 }}>
          THIẾU LOTTIE
        </div>
        <div data-text="label" style={{ fontSize: 36, fontWeight: 600, color: colors.text }}>
          {alt}
        </div>
      </div>
    );
  }
  if (!data) return null;
  return (
    <div data-mark="lottie" style={box}>
      <Lottie animationData={data} loop={loop} playbackRate={playbackRate} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};
