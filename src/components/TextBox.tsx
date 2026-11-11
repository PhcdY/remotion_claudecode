import React from "react";
import { fitFont } from "./fit";
import { MathText } from "./MathText";
import { colors, fontText, type FontKind } from "./theme";

/**
 * Ô/thẻ chứa chữ: cỡ chữ tính bằng `fitFont` (vừa hộp, không dưới MIN_FONT của loại chữ),
 * tự gắn data-box + data-text để check-layout đo được tràn.
 * Dùng cho mọi khung chứa chữ tự vẽ (ô bảng, thẻ tên, ô sơ đồ) thay vì div + fontSize gõ tay.
 * Hộp quá nhỏ cho cỡ tối thiểu → chữ giữ cỡ tối thiểu và check-layout báo "tràn khỏi khung chứa":
 * nới hộp hoặc bớt chữ, không thu nhỏ chữ.
 *
 * <TextBox left={200} top={300} width={180} height={90} text="$\ce{Na}$" border={role.focus} />
 */
export const TextBox: React.FC<{
  text: string;
  left: number;
  top: number;
  width: number;
  height: number;
  /** cỡ chữ tối đa; cỡ thật có thể nhỏ hơn để vừa hộp */
  maxFont?: number;
  /** số dòng tối đa được xuống dòng */
  maxLines?: number;
  color?: string;
  background?: string;
  border?: string;
  radius?: number;
  weight?: number;
  /** loại chữ (data-text) — quyết định cỡ tối thiểu (theme.ts › MIN_FONT) */
  kind?: FontKind;
  opacity?: number;
}> = ({
  text, left, top, width, height, maxFont = 56, maxLines = 1, color = colors.text,
  background = colors.panel, border = colors.panelBorder, radius = 16, weight = 700, kind = "label", opacity = 1,
}) => {
  const pad = 0.12;
  const f = fitFont(text, width * (1 - 2 * pad), height * (1 - 2 * pad), { kind, max: maxFont, maxLines, weight });
  return (
    <div
      data-box="textbox"
      style={{
        position: "absolute", left, top, width, height, boxSizing: "border-box", opacity,
        display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
        background, border: `3px solid ${border}`, borderRadius: radius,
      }}
    >
      <span
        data-text={kind}
        style={{ fontFamily: fontText, fontWeight: weight, color, lineHeight: 1.2, fontSize: f.size, whiteSpace: f.lines === 1 ? "nowrap" : "normal" }}
      >
        <MathText text={text} />
      </span>
    </div>
  );
};
