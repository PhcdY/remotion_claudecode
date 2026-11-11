import "./mhchem";
import React from "react";
import { TEXT_GAP, blockHeight, fitFont, textWidth } from "../fit";
import { MathText } from "../MathText";
import { MIN_FONT, colors, fontText, tint } from "../theme";
import { element, formatMass } from "./elements";

/**
 * Một ô nguyên tố phóng to (kiểu ô trong bảng tuần hoàn SGK): số hiệu Z, ký hiệu, tên IUPAC, khối lượng.
 * Cỡ chữ theo HAI giới hạn (skill dung-video › quy tắc 4): vừa ô VÀ không dưới MIN_FONT (Z, tên, khối lượng ≥ 28px,
 * ký hiệu ≥ 36px). Các dòng xếp theo chiều cao chữ thật, cách nhau ≥ TEXT_GAP — không đặt theo % cố định.
 * Ô nhỏ hơn cỡ tối thiểu để mọi dòng đọc được (`elementTileMinSize`) → ô tự nới tới cỡ đó (tên dài như
 * Praseodymium cần ô to hơn); dùng `elementTileMinSize` khi chia bố cục.
 * Số liệu lấy từ elements.ts, KHÔNG gõ tay số hiệu/khối lượng.
 *
 * Dùng: <ElementTile symbol="Na" left={160} top={260} size={300} color={role.focus} show={{ name: fadeIn(fr, L[1]) }} />
 */

const PAD = 0.06; // lề trên/dưới so với cạnh ô
const NAME_W = 0.84; // bề ngang dành cho tên so với cạnh ô
const LH = 1.15;

/** Cạnh ô nhỏ nhất mà tên nguyên tố còn nằm vừa ở cỡ đọc được (≥ 220). */
export const elementTileMinSize = (symbol: string) =>
  Math.max(220, Math.ceil(textWidth(element(symbol).name, MIN_FONT.tick, 600) / NAME_W) + 2);

type Layout = { size: number; z: number; sym: number; name: number; mass: number | null; tops: { z: number; sym: number; name: number; mass: number } };

const layoutTile = (symbol: string, requested: number, withMass: boolean): Layout => {
  const e = element(symbol);
  const size = Math.max(requested, elementTileMinSize(symbol));
  const inner = size * (1 - 2 * PAD);
  const z = Math.max(MIN_FONT.tick, Math.round(size * 0.12));
  const name = fitFont(e.name, size * NAME_W, size, { kind: "tick", max: Math.round(size * 0.13), weight: 600 }).size;
  const solve = (mass: number | null) => {
    const fixed = blockHeight(z, 1, LH) + blockHeight(name, 1, LH) + (mass ? blockHeight(mass, 1, LH) + TEXT_GAP : 0) + 2 * TEXT_GAP;
    return Math.min(Math.round(size * 0.3), Math.floor((inner - fixed) / LH));
  };
  let mass: number | null = withMass && e.mass !== undefined ? Math.max(MIN_FONT.tick, Math.round(size * 0.11)) : null;
  let sym = solve(mass);
  if (sym < MIN_FONT.label && mass !== null) {
    mass = null; // không đủ chỗ cho 4 dòng đọc được → bỏ dòng khối lượng, không nhồi
    sym = solve(null);
  }
  sym = Math.max(sym, MIN_FONT.label);
  // xếp dọc, phần dư chia đều trên/dưới
  const used = blockHeight(z, 1, LH) + blockHeight(sym, 1, LH) + blockHeight(name, 1, LH) + (mass ? blockHeight(mass, 1, LH) + TEXT_GAP : 0) + 2 * TEXT_GAP;
  let y = size * PAD + Math.max(0, (inner - used) / 2);
  const tz = y;
  y += blockHeight(z, 1, LH) + TEXT_GAP;
  const ts = y;
  y += blockHeight(sym, 1, LH) + TEXT_GAP;
  const tn = y;
  y += blockHeight(name, 1, LH) + TEXT_GAP;
  return { size, z, sym, name, mass, tops: { z: tz, sym: ts, name: tn, mass: y } };
};

export const ElementTile: React.FC<{
  symbol: string;
  left: number;
  top: number;
  /** cạnh ô (px), nên 220–340. Nhỏ hơn `elementTileMinSize(symbol)` thì ô tự nới tới cỡ đó */
  size: number;
  color?: string;
  /** độ hiện (0–1) của từng phần, để mở dần từng thông tin theo lời đọc */
  show?: { z?: number; name?: number; mass?: number };
  /** tô viền đậm phần đang nói tới */
  focus?: "z" | "symbol" | "name" | "mass";
  /** false: không có dòng khối lượng */
  showMass?: boolean;
  opacity?: number;
}> = ({ symbol, left, top, size: requested, color = colors.accent, show = {}, focus, showMass = true, opacity = 1 }) => {
  const e = element(symbol);
  const L = layoutTile(symbol, requested, showMass);
  const size = L.size;
  const part = (k: "z" | "symbol" | "name" | "mass"): React.CSSProperties =>
    focus === k ? { background: tint(color, 0.14), borderRadius: size * 0.04, padding: `0 ${size * 0.03}px`, color } : {};
  const row = (topPx: number, fontSize: number): React.CSSProperties => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: topPx,
    textAlign: "center",
    fontSize,
    lineHeight: LH,
    whiteSpace: "nowrap",
  });
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
      <div data-text="tick" style={{ ...row(L.tops.z, L.z), left: size * 0.08, right: "auto", textAlign: "left", fontWeight: 700, opacity: show.z ?? 1, ...part("z") }}>
        <MathText text={String(e.z)} />
      </div>
      <div data-text="label" style={{ ...row(L.tops.sym, L.sym), fontWeight: 800, color, ...part("symbol") }}>
        <MathText text={e.symbol} />
      </div>
      <div data-text="tick" style={{ ...row(L.tops.name, L.name), fontWeight: 600, opacity: show.name ?? 1, ...part("name") }}>
        <MathText text={e.name} />
      </div>
      {L.mass !== null && e.mass !== undefined && (
        <div data-text="tick" style={{ ...row(L.tops.mass, L.mass), color: colors.muted, opacity: show.mass ?? 1, ...part("mass") }}>
          <MathText text={formatMass(e.mass)} />
        </div>
      )}
    </div>
  );
};
