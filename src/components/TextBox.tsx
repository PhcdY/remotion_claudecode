import React from "react";
import { MathText } from "./MathText";
import { colors, fontText } from "./theme";

/**
 * Cỡ chữ để `text` nằm gọn trong hộp w × h (phép thử P5 "chữ đọc được" — skill dung-video › mục 0).
 * Ước lượng theo số ký tự nhìn thấy (công thức $...$ tính theo phần chữ), không đo DOM → ổn định giữa các frame.
 * Kết quả ≤ `max`; nhỏ hơn `min` thì trả `min` — khi đó hộp quá chật: bớt chữ hoặc nới hộp,
 * check-layout sẽ báo "tràn khỏi khung chứa" vì TextBox gắn sẵn data-box.
 */
export const fitFontSize = (
  text: string,
  w: number,
  h: number,
  { max = 56, min = 36, lines = 1, charW = 0.6, pad = 0.12 }: { max?: number; min?: number; lines?: number; charW?: number; pad?: number } = {},
) => {
  const visible = text.replace(/\$([^$]*)\$/g, (_, m: string) => m.replace(/\\[a-zA-Z]+/g, "").replace(/[{}^_\\]/g, ""));
  const perLine = Math.max(1, Math.ceil(visible.length / lines));
  const byWidth = (w * (1 - 2 * pad)) / (perLine * charW);
  const byHeight = (h * (1 - 2 * pad)) / (lines * 1.25);
  return Math.max(min, Math.floor(Math.min(max, byWidth, byHeight)));
};

/**
 * Ô/thẻ chứa chữ: tự tính cỡ chữ theo cỡ hộp, tự gắn data-box + data-text để check-layout đo được tràn.
 * Dùng cho mọi khung chứa chữ tự vẽ (ô bảng, thẻ tên, ô sơ đồ) thay vì div + fontSize gõ tay.
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
  /** cỡ tối thiểu theo loại chữ (dung-video › quy tắc 4): nhãn 36, text của dòng 44 */
  minFont?: number;
  lines?: number;
  color?: string;
  background?: string;
  border?: string;
  radius?: number;
  weight?: number;
  /** loại chữ cho check-layout (data-text): "label" mặc định */
  kind?: string;
  opacity?: number;
}> = ({
  text, left, top, width, height, maxFont = 56, minFont = 36, lines = 1, color = colors.text,
  background = colors.panel, border = colors.panelBorder, radius = 16, weight = 700, kind = "label", opacity = 1,
}) => (
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
      style={{
        fontFamily: fontText, fontWeight: weight, color, lineHeight: 1.2,
        fontSize: fitFontSize(text, width, height, { max: maxFont, min: minFont, lines }),
        whiteSpace: lines === 1 ? "nowrap" : "normal",
      }}
    >
      <MathText text={text} />
    </span>
  </div>
);
