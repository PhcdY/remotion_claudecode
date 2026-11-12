import React, { useId } from "react";

// Vùng chứa cho các lớp hình ăn khớp nhau (skill dung-video › quy tắc 13).
//
// Một cảnh có nhiều lớp (đất, lòng sông, sóng; cốc, nước, bọt khí; tế bào, bào quan…) thì
// hình của mỗi vùng được khai báo MỘT lần (`d`), mọi lớp bên trong lấy hình từ đó:
//   - `children` (sóng, mặt nước dâng, dòng chảy, hạt): tự bị cắt theo hình vùng — lệch bao nhiêu cũng không thò ra;
//   - `edge`: đường mép vẽ ĐÈ lên trên cùng, che chỗ nối giữa vùng và lớp bên trong;
//   - vật phải nằm TRỌN trong vùng mà không được cắt (cá, thuyền, bào quan): đặt ngoài `children`,
//     gắn `data-inside="<id>"` → `check-layout` kiểm theo hình thật của vùng, ở nhiều frame.
//
// Thứ tự lớp trong một Region: mặt vùng → lớp bên trong (đã cắt) → mép.

export type RegionProps = {
  /** Tên vùng, duy nhất trong cảnh (vd. "song", "dat", "coc"). Vật bên trong gắn data-inside="<id>". */
  id: string;
  /** Hình vùng, toạ độ SVG (lấy từ hàm scale chung của cảnh, không gõ tay ở từng lớp). */
  d: string;
  fill?: string;
  /** Mép vẽ đè lên trên lớp bên trong. */
  edge?: { color: string; width: number };
  opacity?: number;
  /** Lớp chuyển động bên trong vùng — bị cắt theo `d`. */
  children?: React.ReactNode;
};

export const Region: React.FC<RegionProps> = ({ id, d, fill = "none", edge, opacity = 1, children }) => {
  // useId trả về ":r1:" — dấu ":" làm hỏng url(#…), nên đổi thành ký tự an toàn
  const clipId = `region-${id}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id={clipId}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill={fill} data-region={id} />
      {children ? (
        <g clipPath={`url(#${clipId})`} data-region-clip={id}>
          {children}
        </g>
      ) : null}
      {edge ? <path d={d} fill="none" stroke={edge.color} strokeWidth={edge.width} strokeLinejoin="round" data-deco="" /> : null}
    </g>
  );
};
