import "./mhchem";
import React from "react";
import { MathText } from "../MathText";
import { colors, fontText, tint } from "../theme";

/**
 * Công thức có ghi SỐ OXI HOÁ trên từng nguyên tố (kiểu SGK: dấu trước, số sau, đặt phía trên ký hiệu)
 * + dòng phép cộng kiểm tra tổng (= 0 với phân tử, = điện tích với ion). Gói môn Hóa › mục 6.7.
 * Component TỰ CỘNG và báo lỗi khi tổng sai → không dựng được ví dụ sai số.
 * Dùng font chữ chung của video (fontText), không đổi font.
 *
 * Dùng:
 *   <OxidationFormula left={300} top={300} parts={[{ el: "H", n: 2, ox: 1 }, { el: "S", ox: 6 }, { el: "O", n: 4, ox: -2 }]}
 *     show={{ ox: fadeIn(fr, L[1]), sum: fadeIn(fr, L[2]) }} focus={["S"]} />
 *   Ion: parts={[{ el: "S", ox: 6 }, { el: "O", n: 4, ox: -2 }]} charge={-2}
 *   Đơn chất: parts={[{ el: "O", n: 2, ox: 0 }]}
 */

export type OxPart = { el: string; n?: number; ox: number };

/** +2, −2, 0 (dấu trừ chuẩn U+2212) — cách viết số oxi hoá. */
export const formatOx = (v: number) => (v === 0 ? "0" : v > 0 ? `+${v}` : `−${Math.abs(v)}`);
/** 2+, 2−, + , − — cách viết điện tích ion (dấu sau). */
export const formatCharge = (q: number) => (Math.abs(q) === 1 ? "" : String(Math.abs(q))) + (q > 0 ? "+" : "−");

export const oxSumText = (parts: OxPart[], charge = 0) =>
  parts.map((p) => ((p.n ?? 1) > 1 ? `${p.n}·(${formatOx(p.ox)})` : `(${formatOx(p.ox)})`)).join(" + ") + ` = ${formatOx(charge)}`;

export const OxidationFormula: React.FC<{
  parts: OxPart[];
  /** điện tích ion (bỏ trống = phân tử trung hoà) */
  charge?: number;
  left: number;
  top: number;
  /** cỡ chữ ký hiệu, mặc định 110 */
  fontSize?: number;
  /** độ hiện của số oxi hoá và dòng tổng (0–1) */
  show?: { ox?: number; sum?: number };
  /** nguyên tố cần nhấn (vd. nguyên tố đổi số oxi hoá) */
  focus?: string[];
  color?: string;
  focusColor?: string;
  opacity?: number;
}> = ({ parts, charge = 0, left, top, fontSize = 110, show = {}, focus = [], color = colors.accent, focusColor = colors.warn, opacity = 1 }) => {
  const total = parts.reduce((s, p) => s + (p.n ?? 1) * p.ox, 0);
  if (total !== charge) {
    throw new Error(`OxidationFormula: tổng số oxi hoá ${oxSumText(parts, total)} nhưng điện tích là ${formatOx(charge)} — kiểm lại số oxi hoá`);
  }
  const oxFont = Math.round(fontSize * 0.42);
  const subFont = Math.round(fontSize * 0.6);
  const sumFont = Math.max(40, Math.round(fontSize * 0.4));
  return (
    <div data-group="ox-formula" style={{ position: "absolute", left, top, fontFamily: fontText, color: colors.text, opacity }}>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        {parts.map((p, i) => {
          const f = focus.includes(p.el);
          const c = f ? focusColor : color;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <div
                data-text="label"
                style={{
                  fontSize: oxFont,
                  fontWeight: 800,
                  color: c,
                  opacity: show.ox ?? 1,
                  lineHeight: 1.1,
                  padding: `2px ${oxFont * 0.2}px`,
                  borderRadius: 10,
                  background: f ? tint(focusColor, 0.12) : "transparent",
                  marginBottom: fontSize * 0.04,
                  minWidth: fontSize * 0.5,
                  textAlign: "center",
                }}
              >
                <MathText text={formatOx(p.ox)} />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", lineHeight: 1 }}>
                <div data-text="label" style={{ fontSize, fontWeight: 700, color: f ? focusColor : colors.text }}>
                  <MathText text={p.el} />
                </div>
                {(p.n ?? 1) > 1 && (
                  <div data-text="label" style={{ fontSize: subFont, fontWeight: 700, transform: `translateY(${fontSize * 0.18}px)` }}>
                    <MathText text={String(p.n)} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {charge !== 0 && (
          <div data-text="label" style={{ fontSize: subFont, fontWeight: 700, alignSelf: "flex-start", marginTop: oxFont * 1.3, marginLeft: 4 }}>
            <MathText text={formatCharge(charge)} />
          </div>
        )}
      </div>
      <div data-text="label" style={{ fontSize: sumFont, fontWeight: 600, color: colors.muted, marginTop: fontSize * 0.28, opacity: show.sum ?? 0, whiteSpace: "nowrap" }}>
        <MathText text={oxSumText(parts, charge)} />
      </div>
    </div>
  );
};
