import "./mhchem";
import React from "react";
import { textWidth } from "../fit";
import { AutoLabels, textObstacle, type AutoLabelItem, type Rect } from "../labels";
import { MathText } from "../MathText";
import { MIN_FONT, colors, fontText, tint } from "../theme";
import { ELEMENTS, GROUP_OF_COLUMN, GroupName, PTElement, element } from "./elements";

/**
 * Bảng tuần hoàn dạng dài, đúng hình dạng SGK (gói môn Hóa › mục 7).
 * - Kích thước ô tự tính từ `width`. Mọi chữ theo HAI giới hạn (skill dung-video › quy tắc 4): vừa ô/khung VÀ không dưới
 *   MIN_FONT (ký hiệu, số chu kì, tên nhóm ≥ 28px). Ô quá nhỏ cho cỡ đọc được (bảng rộng < ~1340px) → ký hiệu KHÔNG vẽ trong ô;
 *   ô được tô (hoặc `symbols` liệt kê) có tên đặt ngoài bảng, tự có đường dẫn. Tên nhóm/chu kì không vừa cũng vậy.
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
  /** hiện số hiệu Z ở góc ô — chỉ khi ô chứa được cả Z và ký hiệu ở cỡ đọc được (bảng rộng ≳ 1700px); nhỏ hơn dùng ElementTile */
  showZ?: boolean;
  /** hiện hai hàng lanthanide/actinide bên dưới (mặc định có) */
  showFBlock?: boolean;
  /** hiện nhãn nhóm phía trên, số chu kì bên trái (mặc định có). Không vừa ở 28px → chỉ nhóm/chu kì đang tô được ghi, đặt ngoài bảng */
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
  const gap = cell * GAP_RATIO;
  // Ký hiệu trong ô: 42% cạnh ô, nhưng không dưới cỡ đọc được → ô nhỏ thì đưa tên ra ngoài
  const symFont = Math.round(cell * 0.42);
  const symInCell = symFont >= MIN_FONT.tick;
  // Số chu kì, tên nhóm, số hiệu Z: không dưới MIN_FONT.tick
  const axisFont = Math.max(MIN_FONT.tick, Math.round(cell * 0.32));
  const zFont = MIN_FONT.tick;
  const zOn = showZ && symInCell && zFont * 1.15 + symFont + 8 <= cell * 0.92;

  const shown = (e: PTElement, lit: boolean) => {
    if (symbols === "none") return false;
    if (symbols === "all") return true;
    if (symbols === "highlighted") return lit;
    if (Array.isArray(symbols)) return symbols.includes(e.symbol);
    return symInCell || lit;
  };

  // nhãn nhóm: VIIIB gộp cột 8–10
  const headers: { label: string; col: number; span: number }[] = [];
  for (let c = 1; c <= 18; c++) {
    if (c === 9 || c === 10) continue;
    headers.push({ label: GROUP_OF_COLUMN[c], col: c, span: c === 8 ? 3 : 1 });
  }
  const groupLit = (g: string) => highlights.filter((h) => h.group === g);
  const headerW = (span: number) => span * step - gap;
  // tên nhóm hiện trong hàng đầu khi MỌI tên vừa ô ở cỡ đọc được; không thì ghi ngoài bảng cho nhóm đang tô
  const headersFit =
    showAxes && axisFont * 1.2 <= s.headerH + gap && headers.every((h) => textWidth(h.label, axisFont, 800) <= headerW(h.span));
  const periodsFit = showAxes && axisFont * 1.2 <= cell && textWidth("7", axisFont, 800) <= s.axisW - cell * 0.15;

  // Tên đặt NGOÀI bảng (có đường dẫn) cho thứ không vừa trong bảng — vật được tô luôn có tên (phép thử P2)
  const outside: AutoLabelItem[] = [];
  const litOf = (e: PTElement) => highlights.filter((h) => hits(e, h));
  const opOf = (l: PTHighlight[]) => l.reduce((m, x) => Math.max(m, x.opacity ?? 1), 0);
  if (!symInCell) {
    for (const e of ELEMENTS) {
      if (!showFBlock && e.row > 7) continue;
      const lit = litOf(e);
      const o = opOf(lit);
      const listed = Array.isArray(symbols) && symbols.includes(e.symbol);
      // chỉ ô được tô RIÊNG (`cells`) mới cần ký hiệu; ô sáng vì cả nhóm/chu kì được tô thì tên nhóm/chu kì đã nói nó là gì
      const own = lit.filter((h) => h.cells?.includes(e.symbol));
      const want = listed || (symbols !== "none" && !Array.isArray(symbols) && opOf(own) > 0.05);
      if (!want) continue;
      const c = periodicCell(e.symbol, { left, top, width, showFBlock, showAxes });
      outside.push({
        id: `pt-${e.symbol}`,
        x: c.cx,
        y: c.cy,
        text: e.symbol,
        color: lit.length ? lit[lit.length - 1].color : colors.text,
        weight: 800,
        opacity: (listed ? 1 : Math.max(opOf(own), 0) || o) * opacity,
      });
    }
  }
  if (showAxes && !headersFit) {
    for (const h of headers) {
      const lit = groupLit(h.label);
      const o = opOf(lit);
      if (o <= 0.05) continue;
      const x = left + s.axisW + (h.col - 1) * step + headerW(h.span) / 2;
      outside.push({ id: `pt-g-${h.label}`, x, y: top + s.headerH, text: `nhóm ${h.label}`, color: lit[0].color, weight: 800, opacity: o * opacity, prefer: ["n"], anchor: "region" });
    }
  }
  if (showAxes && !periodsFit) {
    for (let p = 1; p <= 7; p++) {
      const lit = highlights.filter((h) => h.period === p);
      const o = opOf(lit);
      if (o <= 0.05) continue;
      const y = top + s.headerH + (p - 1) * step + cell / 2;
      outside.push({ id: `pt-p-${p}`, x: left + s.axisW, y, text: `chu kì ${p}`, color: lit[0].color, weight: 800, opacity: o * opacity, prefer: ["w"], anchor: "region" });
    }
  }

  // Vật cản cho tên đặt ngoài: ô đang tô (để tên nằm cạnh, không che ô) + cột số chu kì / hàng tên nhóm nếu đang hiện.
  // Tên được nằm đè lên các ô trống mờ — ở bảng nhỏ các ô đó không có chữ — nên luôn đặt sát ô của mình.
  const obstacles: Rect[] = [];
  for (const e of ELEMENTS) {
    if (!showFBlock && e.row > 7) continue;
    if (opOf(litOf(e)) <= 0.05 && !(Array.isArray(symbols) && symbols.includes(e.symbol))) continue;
    const c = periodicCell(e.symbol, { left, top, width, showFBlock, showAxes });
    obstacles.push({ x: c.x, y: c.y, w: c.size, h: c.size, pad: 4 });
  }
  if (periodsFit) obstacles.push(textObstacle(left, top + s.headerH, s.axisW, 7 * step));
  if (headersFit) obstacles.push(textObstacle(left + s.axisW, top, width - s.axisW, s.headerH));

  return (
    <>
    <div data-group="periodic-table" data-extent style={{ position: "absolute", left, top, width, height: s.height, opacity, fontFamily: fontText }}>
      {headersFit &&
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
                width: headerW(h.span),
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
      {periodsFit &&
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
        const showSym = symInCell && shown(e, o > 0.05);
        return (
          <div
            key={e.z}
            data-box={showSym ? "cell" : undefined}
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
            }}
          >
            {zOn && (
              <div data-text="tick" style={{ position: "absolute", left: cell * 0.08, top: cell * 0.03, fontSize: zFont, lineHeight: 1.15, color: colors.muted }}>
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
                  marginTop: zOn ? zFont * 1.15 : 0,
                }}
              >
                <MathText text={e.symbol} />
              </div>
            )}
          </div>
        );
      })}
    </div>
    {outside.length > 0 && <AutoLabels items={outside} obstacles={obstacles} />}
    </>
  );
};

/** Kiểm nhanh khi chia bố cục: bảng rộng `width` có chứa được ký hiệu trong ô ở cỡ đọc được không. */
export const periodicSymbolsFit = (width: number, showFBlock = true, showAxes = true) =>
  Math.round(periodicTableSize(width, showFBlock, showAxes).cell * 0.42) >= MIN_FONT.tick;
