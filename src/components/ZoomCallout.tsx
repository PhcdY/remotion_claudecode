import React from "react";
import { Easing, interpolate } from "remotion";
import { colors } from "./theme";

/**
 * Cửa sổ soi (kính lúp) cho hình KHÔNG phải đồ thị: vòng soi trên vật thật + hai đường dẫn tới khung phóng to.
 * Hình gốc vẫn ở trên màn hình làm khung định vị (gói Sinh › "Không thả dù người xem"; dung-video › thực đơn
 * "Cơ chế bên trong"). Đồ thị hàm số thì dùng ZoomInset.
 *
 * Nội dung khung (children) vẽ theo toạ độ TRANG, cùng `box` (vd. <CapillaryExchange {...box} />).
 * progress: 0–0,35 vòng soi hiện trên vật; 0,35–1 đường dẫn vươn ra và khung hiện.
 *
 *   <ZoomCallout source={{ ...soi.tissue, r: soi.r }} box={{ left: 1080, top: 200, width: 720, height: 520 }} progress={p}>
 *     <CapillaryExchange left={1080} top={200} width={720} height={520} site="tissue" flows={...} />
 *   </ZoomCallout>
 */
export const ZoomCallout: React.FC<{
  source: { x: number; y: number; r: number };
  box: { left: number; top: number; width: number; height: number };
  progress: number;
  color?: string;
  children?: React.ReactNode;
}> = ({ source, box, progress, color = colors.brandIndigo, children }) => {
  if (progress <= 0) return null;
  const e = Easing.inOut(Easing.cubic);
  const ring = e(interpolate(progress, [0, 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const grow = e(interpolate(progress, [0.35, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const { left, top, width, height } = box;
  const cx = left + width / 2;
  const cy = top + height / 2;
  // hai góc khung phía vật nguồn
  const dx = source.x - cx;
  const dy = source.y - cy;
  const horiz = Math.abs(dx) / width > Math.abs(dy) / height;
  const sideX = dx < 0 ? left : left + width;
  const sideY = dy < 0 ? top : top + height;
  const corners = horiz
    ? [{ x: sideX, y: top }, { x: sideX, y: top + height }]
    : [{ x: left, y: sideY }, { x: left + width, y: sideY }];
  const from = (c: { x: number; y: number }) => {
    const L = Math.hypot(c.x - source.x, c.y - source.y) || 1;
    return { x: source.x + (source.r * (c.x - source.x)) / L, y: source.y + (source.r * (c.y - source.y)) / L };
  };
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
        <circle cx={source.x} cy={source.y} r={source.r * ring} fill="none" stroke={color} strokeWidth={5} />
        {grow > 0
          ? corners.map((c, i) => {
              const a = from(c);
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={a.x + (c.x - a.x) * grow}
                  y2={a.y + (c.y - a.y) * grow}
                  stroke={color}
                  strokeOpacity={0.55}
                  strokeWidth={3}
                />
              );
            })
          : null}
      </svg>
      {grow > 0 ? (
        <div
          data-extent=""
          style={{
            position: "absolute",
            left,
            top,
            width,
            height,
            opacity: grow,
            background: colors.panel,
            border: `4px solid ${color}`,
            borderRadius: 28,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: -left - 4, top: -top - 4, width: 1920, height: 1080 }}>{children}</div>
        </div>
      ) : null}
    </>
  );
};
