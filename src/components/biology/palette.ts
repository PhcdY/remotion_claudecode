// Màu Sinh dùng chung cho mọi component sinh học — gói Sinh › Bảng màu (.agents/mon/sinh.md).
// Mỗi chất một SẮC màu riêng (không chỉ khác đậm nhạt — dung-video › quy tắc 11), giữ nguyên giữa các video.

export const SUBSTANCE = {
  /** O₂ — cùng nghĩa với máu giàu O₂ */
  o2: "#EF4444",
  /** CO₂ — cùng nghĩa với máu nghèo O₂ */
  co2: "#6366F1",
  /** chất dinh dưỡng (glucose, amino acid…) */
  nutrient: "#0D9488",
} as const;

export type Substance = keyof typeof SUBSTANCE;

export const BLOOD = { rich: SUBSTANCE.o2, poor: SUBSTANCE.co2 } as const;

/** Màu cơ quan: nhạt (fill) + nét đậm, tránh trùng sắc với ba màu chất ở trên. */
export const ORGAN = {
  body: { fill: "#EEF2FB", stroke: "#9AA8C7" },
  lung: { fill: "#FBD5DE", stroke: "#C2577A" },
  heart: { fill: "#F6C1CB", stroke: "#9F1239" },
  stomach: { fill: "#FBE3C8", stroke: "#B9732F" },
  intestine: { fill: "#FCEBC2", stroke: "#B7862B" },
  tissue: { fill: "#F3D3DF", stroke: "#A04870" },
  airway: { fill: "#E2E8F4", stroke: "#8592B3" },
} as const;

/** Thành phần phân tử (gói Sinh › Phân tử có tên; base A theo bảng màu DNA). */
export const MOLECULE = {
  adenine: "#3B82F6",
  ribose: "#64748B",
  phosphate: "#F97316",
  energy: "#FACC15",
  carbon: "#334155",
  rGroup: "#A855F7",
} as const;
