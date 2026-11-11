import { MIN_FONT, type FontKind } from "./theme";

/**
 * Cỡ chữ theo HAI giới hạn (phép thử P5 "chữ đọc được" — skill dung-video › quy tắc 4):
 *   - dưới: không nhỏ hơn MIN_FONT[kind] (đọc được);
 *   - trên: nằm gọn trong hộp w × h (không tràn).
 * Khi hộp quá nhỏ để thoả cả hai, hàm trả `fits: false` — component PHẢI xử lý rõ ràng
 * (đưa chữ ra ngoài có đường dẫn, xuống dòng, bỏ dòng phụ, hoặc nới hộp), không được lặng lẽ
 * thu nhỏ dưới mức tối thiểu hay để chữ tràn hộp. Ước lượng bằng độ rộng ký tự, không đo DOM
 * → ổn định giữa các frame; check-layout là bước đo thật cuối cùng.
 */

const NARROW = /[iIl1.,:;!|'()[\]\s]/;
const WIDE = /[MWmw]/;

/** Độ rộng ước lượng (px) của `text` ở cỡ `px` — font Plus Jakarta Sans; công thức $…$ tính theo phần chữ. */
export const textWidth = (text: string, px: number, weight = 600) => {
  const visible = text.replace(/\$([^$]*)\$/g, (_, m: string) => m.replace(/\\[a-zA-Z]+/g, "").replace(/[{}^_\\]/g, ""));
  let em = 0;
  for (const ch of visible) {
    if (ch === " ") em += 0.28;
    else if (NARROW.test(ch)) em += 0.3;
    else if (WIDE.test(ch)) em += 0.86;
    else if (ch >= "A" && ch <= "Z") em += 0.7;
    else em += 0.58;
  }
  return em * px * (weight >= 700 ? 1.06 : 1);
};

export type Fit = { size: number; fits: boolean; lines: number };

/**
 * Cỡ chữ lớn nhất ≤ `max` để `text` nằm trong w × h (tối đa `maxLines` dòng), không nhỏ hơn MIN_FONT[kind].
 * `fits: false` → ở cỡ tối thiểu vẫn không vừa hộp.
 */
export const fitFont = (
  text: string,
  w: number,
  h: number,
  { kind = "label", max = 56, maxLines = 1, weight = 600, lineHeight = 1.2 }: { kind?: FontKind; max?: number; maxLines?: number; weight?: number; lineHeight?: number } = {},
): Fit => {
  const min = MIN_FONT[kind];
  for (let lines = 1; lines <= maxLines; lines++) {
    const unit = textWidth(text, 1, weight) / lines; // độ rộng mỗi dòng ở cỡ 1px (chia đều, ước lượng)
    const byW = unit > 0 ? w / unit : max;
    const byH = h / (lines * lineHeight);
    const size = Math.floor(Math.min(max, byW, byH));
    if (size >= min) return { size, fits: true, lines };
  }
  return { size: min, fits: false, lines: maxLines };
};

/** Chiều cao một khối chữ (px) — để xếp các dòng theo chiều cao thật, không theo % cố định. */
export const blockHeight = (size: number, lines = 1, lineHeight = 1.2) => size * lineHeight * lines;

/** Khoảng hở tối thiểu giữa hai khối chữ (check-layout báo "sát" khi < 12px). */
export const TEXT_GAP = 14;
