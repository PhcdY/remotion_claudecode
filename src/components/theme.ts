import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

// Theo style.md (brand 9Study). Màu đặt theo VAI TRÒ để visual trong script.json map vào.
export const colors = {
  bg: "#F6F8FE",
  bgEnd: "#FFFFFF",
  panel: "#FFFFFF",
  panelBorder: "#E4EAF6",
  grid: "#E4EAF6",
  axis: "#8A94AE",
  text: "#0E1046", // navy (chữ "Study" trong logo)
  muted: "#5E6785",
  brandBlue: "#4B87F4",
  brandIndigo: "#3D4AEF",
  accent: "#3D4AEF", // màu nhấn = chàm thương hiệu
  curve: "#4B87F4", // đồ thị chính = xanh thương hiệu
  increase: "#12A150", // tăng / f' > 0
  decrease: "#E5484D", // giảm / f' < 0
  warn: "#EA7A00", // màu cảnh báo
  c1: "#0E9F9A", // màu 1 (vd. mẫu số / Δx)
  c2: "#C026D3", // màu 2 (vd. tử số / Δy)
};

/** Màu hex + độ trong suốt. */
export const tint = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

export const shadow = "0 8px 24px rgba(61, 74, 239, 0.08)";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin", "latin-ext", "vietnamese"],
});

export const fontText = fontFamily;

// Bố cục (style.md › Vùng; skill dung-video › Quy tắc bố cục)
export const layout = {
  width: 1920,
  height: 1080,
  side: 90, // lề trái/phải tối thiểu
  logoTop: 34,
  logoHeight: 52,
  visualTop: 110,
  visualBottom: 820,
  /** vùng dành cho câu chốt (KeyTakeaway) ở đáy vùng hình */
  takeawayTop: 730,
  subtitleTop: 860,
  /** chế độ chữ trong cảnh (không dải phụ đề, skill dung-video): vùng hình kéo tới đây */
  sceneBottom: 1040,
  sceneTakeawayTop: 930,
  gap: 40, // khoảng hở tối thiểu giữa hai khối
};

// Cỡ chữ tối thiểu
export const fontSize = {
  subtitle: 52,
  subtitleMath: 48,
  takeaway: 56,
  label: 36,
  tick: 28,
};

/** Viền nền cho chữ HTML nằm gần nét vẽ. */
export const halo = (c = colors.bg) =>
  [
    `0 0 3px ${c}`,
    `0 0 6px ${c}`,
    `2px 2px 0 ${c}`,
    `-2px -2px 0 ${c}`,
    `2px -2px 0 ${c}`,
    `-2px 2px 0 ${c}`,
    `0 3px 0 ${c}`,
    `0 -3px 0 ${c}`,
    `3px 0 0 ${c}`,
    `-3px 0 0 ${c}`,
  ].join(", ");
