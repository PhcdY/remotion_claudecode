import "./mhchem";
import React from "react";
import { MathText } from "../MathText";
import { colors, fontText, tint } from "../theme";
import { ELEMENTS, GROUP_OF_COLUMN, GroupName, PTElement, element } from "./elements";

/**
 * Bảng tuần hoàn dạng dài, đúng hình dạng SGK (gói môn Hóa › mục 7).
 * - Kích thước ô tự tính từ `width`; chữ trong ô luôn nhỏ hơn ô (ký hiệu ≤ 42% cạnh ô) → không bao giờ tràn ô.
 * - Nhấn mạnh bằng TÔ NỀN + VIỀN ô, không phóng to chữ.
 * - Tên nhóm theo SGK: IA…VIIIA, IIIB…IIB (VIIIB gộp 3 cột). Không hiện số cột 1–18.
 *
 * Dùng: <PeriodicTable left={180} top={150} width={1560} highlights={[{ period: 3, color: role.focus, opacity: o }]} />
 * Toạ độ một ô (để đặt nhãn/mũi tên): periodicCell("Na", { left, top, width }).
 */

export type PTHighlight = {
  /** tô các ô theo ký hiệu, vd. ["Li", "Na"] */
  cells?: string[];
  /** tô cả một chu kì (hàng ngang) 1–7 */
  period?: number;
  /** tô cả một nhóm (cột dọc) theo tên SGK, vd. "IA"; "VIIIB" tô cả 3 cột */
  group?: GroupName;
  color: string;
  /** 0→1 để hiện dần (dùng fadeIn) */
  opacity?: number;
};

export type PeriodicTableProps = {
  left: number;
  top: number;
  /** chiều rộng toàn bảng kể cả cột số chu kì; sân khấu chính nên ≥ 1500 */
  width: number;
  highlights?: PTHighlight[];
  /**
   * "auto" (mặc định): ô ≥ 60px thì hiện mọi ký hiệu, nhỏ hơn thì chỉ hiện ô được tô.
   * "highlighted": chỉ ô được tô; "none": không chữ; hoặc danh sách ký hiệu cụ thể.
   */
  symbols?: "auto" | "all" | "highlighted" | "none" | string[];
  /** hiện số hiệu Z nhỏ ở góc ô (chỉ khi ô ≥ 86px, nếu không sẽ quá nhỏ để đọc) */
  showZ?: boolean;
  /** hiện hai hàng lanthanide/actinide bên dưới (mặc định có) */
  showFBlock?: boolean;
  /** hiện nhãn nhóm phía trên, số chu kì bên trái (mặc định có; tên nhóm tự ẩn khi ô < 56px) */
  showAxes?: boolean;
  /** độ mờ các ô KHÔNG được tô (0–1). Mặc định 1; đặt 0.35 khi muốn dồn mắt vào ô được tô */
  dimOthers?: number;
  /** độ mờ cả bảng (hiện dần) */
  opacity?: number;
};

const GAP_RATIO = 0.08; // khe giữa hai ô so với cạnh ô

/** Kích thước tính sẵn — dùng để chia bố cục trước khi đặt bảng. */
export const periodicTableSize = (width: number, showFBlock = true, showAxes = true) => {
  const axisW = showAxes ? 0.75 : 0; // cột số chu kì, tính theo đơn vị ô
  const unit = width / (18 + axisW + 17 * GAP_RATIO);
  const cell = unit;
  const step = cell * (1 + GAP_RATIO);
  const headerH = showAxes ? cell * 0.6 : 0;
  const mainH = 7 * step;
  const fGap = showFBlock ? cell * 0.45 : 0;
  const fH = showFBlock ? 2 * step : 0;
  return { cell, step, axisW: axisW * cell, headerH, height: headerH + mainH + fGap + fH, fTop: headerH + mainH + fGap };
};

/** Toạ độ tâm + cạnh của một ô (toạ độ tuyệt đối trong khung 1920×1080). */
export const periodicCell = (symbol: string, t: { left: number; top: number; width: number; showFBlock?: boolean; showAxes?: boolean }) => {
  const e = element(symbol);
  const s = periodicTableSize(t.width, t.showFBlock ?? true, t.showAxes ?? true);
  const x = t.left + s.axisW + (e.col - 1) * s.step;
  const y = e.row <= 7 ? t.top + s.headerH + (e.row - 1) * s.step : t.top + s.fTop + (e.row - 8) * s.step;
  return { x, y, size: s.cell, cx: x + s.cell / 2, cy: y + s.cell / 2 };
};

const hits = (e: PTElement, h: PTHighlight) =>
  (h.cells?.includes(e.symbol) ?? false) ||
  (h.period !== undefined && e.period === h.period) ||
  (h.group !== undefined && e.group === h.group && e.block !== "f");

export const PeriodicTable: React.FC<PeriodicTableProps> = ({
  left,
  top,
  width,
  highlights = [],
  symbols = "auto",
  showZ = false,
  showFBlock = true,
  showAxes = true,
  dimOthers = 1,
  opacity = 1,
}) => {
  const s = periodicTableSize(width, showFBlock, showAxes);
  const { cell, step } = s;
  const symFont = Math.round(cell * 0.42);
  const zFont = Math.round(cell * 0.24);
  const axisFont = Math.max(22, Math.round(cell * 0.3));
  const zOn = showZ && cell >= 86;
  // ô < 56px (bảng rộng < ~1100px): tên nhóm không đủ chỗ → ẩn; bảng nhỏ chỉ để định vị, nhãn đặt ngoài bằng AutoLabels
  const headersOn = showAxes && cell >= 56;

  const shown = (e: PTElement, lit: boolean) => {
    if (symbols === "none") return false;
    if (symbols === "all") return true;
    if (symbols === "highlighted") return lit;
    if (Array.isArray(symbols)) return symbols.includes(e.symbol);
    return cell >= 60 || lit;
  };

  // nhãn nhóm: VIIIB gộp cột 8–10
  const headers: { label: string; col: number; span: number }[] = [];
  for (let c = 1; c <= 18; c++) {
    if (c === 9 || c === 10) continue;
    headers.push({ label: GROUP_OF_COLUMN[c], col: c, span: c === 8 ? 3 : 1 });
  }
  const groupLit = (g: string) => highlights.filter((h) => h.group === g);

  return (
    <div data-group="periodic-table" style={{ position: "absolute", left, top, width, height: s.height, opacity, fontFamily: fontText }}>
      {headersOn &&
        headers.map((h) => {
          const lit = groupLit(h.label);
          const o = lit.reduce((m, x) => Math.max(m, x.opacity ?? 1), 0);
          return (
            <div
              key={h.label + h.col}
              data-text="tick"
              style={{
                position: "absolute",
                left: s.axisW + (h.col - 1) * step,
                width: h.span * step - cell * GAP_RATIO,
                top: 0,
                height: s.headerH,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: axisFont,
                fontWeight: o > 0.5 ? 800 : 600,
                color: o > 0.5 ? lit[0].color : colors.muted,
                whiteSpace: "nowrap",
              }}
            >
              <MathText text={h.label} />
            </div>
          );
        })}
      {showAxes &&
        [1, 2, 3, 4, 5, 6, 7].map((p) => {
          const lit = highlights.find((h) => h.period === p && (h.opacity ?? 1) > 0.5);
          return (
            <div
              key={`p${p}`}
              data-text="tick"
              style={{
                position: "absolute",
                left: 0,
                width: s.axisW - cell * 0.15,
                top: s.headerH + (p - 1) * step,
                height: cell,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                fontSize: axisFont,
                fontWeight: lit ? 800 : 600,
                color: lit ? lit.color : colors.muted,
              }}
            >
              <MathText text={String(p)} />
            </div>
          );
        })}
      {/* ô giữ chỗ cho họ lanthanide/actinide ở nhóm IIIB */}
      {showFBlock &&
        [6, 7].map((p) => (
          <div
            key={`f${p}`}
            style={{
              position: "absolute",
              left: s.axisW + 2 * step,
              top: s.headerH + (p - 1) * step,
              width: cell,
              height: cell,
              borderRadius: cell * 0.14,
              border: `2px dashed ${colors.panelBorder}`,
              opacity: dimOthers,
            }}
          />
        ))}
      {ELEMENTS.filter((e) => showFBlock || e.row <= 7).map((e) => {
        const lit = highlights.filter((h) => hits(e, h));
        const o = lit.reduce((m, x) => Math.max(m, x.opacity ?? 1), 0);
        const c = lit.length ? lit[lit.length - 1].color : colors.brandBlue;
        const x = s.axisW + (e.col - 1) * step;
        const y = e.row <= 7 ? s.headerH + (e.row - 1) * step : s.fTop + (e.row - 8) * step;
        const showSym = shown(e, o > 0.05);
        return (
          <div
            key={e.z}
            data-box="cell"
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: cell,
              height: cell,
              borderRadius: cell * 0.14,
              boxSizing: "border-box",
              background: o > 0 ? tint(c, 0.08 + 0.14 * o) : "#F3F6FD",
              border: `${o > 0 ? 3 : 1.5}px solid ${o > 0 ? tint(c, 0.35 + 0.65 * o) : colors.panelBorder}`,
              opacity: o > 0 ? 1 : dimOthers,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {zOn && (
              <div data-text="note" style={{ position: "absolute", left: cell * 0.1, top: cell * 0.04, fontSize: zFont, color: colors.muted }}>
                <MathText text={String(e.z)} />
              </div>
            )}
            {showSym && (
              <div
                data-text="tick"
                style={{
                  fontSize: symFont,
                  lineHeight: 1,
                  fontWeight: o > 0.5 ? 800 : 600,
                  color: o > 0.5 ? c : colors.text,
                  marginTop: zOn ? cell * 0.12 : 0,
                }}
              >
                <MathText text={e.symbol} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
