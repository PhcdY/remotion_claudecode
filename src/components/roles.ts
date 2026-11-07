import { colors } from "./theme";

/**
 * Màu theo VAI TRÒ, dùng chung mọi video (skill dung-video › quy tắc 11).
 * Một màu một nghĩa, giữ nguyên nghĩa giữa các video để người xem học được "màu này là gì".
 * Một cảnh dùng tối đa 5 màu nhấn (focus, up, down, warn, pairA, pairB); main/dim/chữ không tính.
 */
export const role = {
  /** đối tượng chính: đồ thị chính, vật chính */
  main: colors.curve,
  /** thứ đang được nói tới, kết quả chính, điểm đang xét */
  focus: colors.accent,
  /** tăng, dương — chỉ dùng cho nghĩa này */
  up: colors.increase,
  /** giảm, âm — chỉ dùng cho nghĩa này */
  down: colors.decrease,
  /** bẫy, chỗ dễ sai, va chạm */
  warn: colors.warn,
  /** đại lượng thứ nhất của một cặp (mẫu số, Δx, chiều ngang, thời gian trôi) */
  pairA: colors.c1,
  /** đại lượng thứ hai của cặp (tử số, Δy, chiều dọc, phần thay đổi) */
  pairB: colors.c2,
  /** đã hết vai trò, nền, mặt đất */
  dim: "#A9B1C7",
} as const;

export type Role = keyof typeof role;
