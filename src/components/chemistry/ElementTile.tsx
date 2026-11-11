import "./mhchem";
import React from "react";
import { MathText } from "../MathText";
import { colors, fontText, tint } from "../theme";
import { element, formatMass } from "./elements";

/**
 * Một ô nguyên tố phóng to (kiểu ô trong bảng tuần hoàn SGK): số hiệu Z, ký hiệu, tên IUPAC, khối lượng.
 * Mọi cỡ chữ tính theo `size` → chữ không bao giờ to hơn ô. Tên dài (Phosphorus, Magnesium) tự thu nhỏ.
 * Số liệu lấy từ elements.ts, KHÔNG gõ tay số hiệu/khối lượng.
 *
 * Dùng: <ElementTile symbol="Na" left={160} top={260} size={300} color={role.focus} show={{ name: fadeIn(fr, L[1]) }} />
 */
export const ElementTile: React.FC<{
  symbol: string;
  left: number;
  top: number;
  /** cạnh ô (px). Ô đứng một mình nên 220–340 */
  size: number;
  color?: string;
  /** độ hiện (0–1) của từng phần, để mở dần từng thông tin theo lời đọc */
  show?: { z?: number; name?: number; mass?: number };
  /** tô viền đậm phần đang nói tới */
  focus?: "z" | "symbol" | "name" | "mass";
  opacity?: number;
}> = ({ symbol, left, top, size, color = colors.accent, show = {}, focus, opacity = 1 }) => {
  const e = element(symbol);
  const nameFont = Math.min(size * 0.13, (size * 0.82) / (e.name.length * 0.58));
  const part = (k: "z" | "symbol" | "name" | "mass"): React.CSSProperties =>
    focus === k ? { background: tint(color, 0.14), borderRadius: size * 0.04, padding: `0 ${size * 0.03}px`, color } : {};
  return (
    <div
      data-box="tile"
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        boxSizing: "border-box",
        borderRadius: size * 0.07,
        border: `${Math.max(3, size * 0.014)}px solid ${color}`,
        background: "#FFFFFF",
        boxShadow: `0 ${size * 0.03}px ${size * 0.08}px ${tint(color, 0.18)}`,
        fontFamily: fontText,
        color: colors.text,
        opacity,
      }}
    >
      <div data-text="tick" style={{ position: "absolute", left: size * 0.08, top: size * 0.06, fontSize: size * 0.12, fontWeight: 700, opacity: show.z ?? 1, ...part("z") }}>
        <MathText text={String(e.z)} />
      </div>
      <div
        data-text="label"
        style={{ position: "absolute", left: 0, right: 0, top: size * 0.22, textAlign: "center", fontSize: size * 0.3, fontWeight: 800, lineHeight: 1.1, color, ...part("symbol") }}
      >
        <MathText text={e.symbol} />
      </div>
      <div
        data-text="tick"
        style={{ position: "absolute", left: 0, right: 0, top: size * 0.6, textAlign: "center", fontSize: nameFont, fontWeight: 600, opacity: show.name ?? 1, ...part("name") }}
      >
        <MathText text={e.name} />
      </div>
      {e.mass !== undefined && (
        <div
          data-text="tick"
          style={{ position: "absolute", left: 0, right: 0, top: size * 0.78, textAlign: "center", fontSize: size * 0.11, color: colors.muted, opacity: show.mass ?? 1, ...part("mass") }}
        >
          <MathText text={formatMass(e.mass)} />
        </div>
      )}
    </div>
  );
};
