import React from "react";
import { MathText } from "./MathText";
import { Dir, LabelSpec, Rect, placeLabels, estimateLabel } from "./labelLayout";
import { Scale } from "./plot";
import { colors, fontSize as FS, fontText, halo } from "./theme";

// Nhãn neo vào vật, tự tránh nhau (skill dung-video › quy tắc 1, 12). Phần tính vị trí: labelLayout.ts.
// Vị trí tính trên TẤT CẢ nhãn của cảnh (kể cả nhãn chưa hiện) nên nhãn không nhảy chỗ khi nhãn khác hiện ra.

export type { Dir, Rect } from "./labelLayout";
export { LEADER_FROM, axesObstacles, curveObstacles, estimateLabel, placeLabels, segmentObstacles, textObstacle } from "./labelLayout";

export type AutoLabelItem = {
  id: string;
  /** điểm neo, toạ độ toán (với scale) hoặc px trong khung chứa (khi không có scale) */
  x: number;
  y: number;
  text: string;
  color?: string;
  size?: number;
  weight?: number;
  opacity?: number;
  prefer?: Dir[];
  /**
   * Nhãn đổi chữ tại cùng chỗ qua nhiều bước (vd. ["$f'(3) = 0$", "đỉnh", "giá trị cực đại: $6$"]);
   * step là bước hiện tại, số lẻ = đang chuyển (1,4 → 40% bước 2). Khi có steps thì text bị bỏ qua.
   * Khung tính theo chữ dài nhất nên nhãn không xê dịch khi đổi chữ.
   */
  steps?: string[];
  step?: number;
  /** giai đoạn nhãn hiện (vd. ["b02"]): hai nhãn không chung giai đoạn thì không chặn nhau. Thiếu = mọi lúc */
  phases?: string[];
  /** "point" (mặc định): neo vào một chấm nhìn thấy; "region": neo vào đoạn cong/khoảng, không chấm nào để gán nhầm */
  anchor?: "point" | "region";
};

/**
 * Một nhóm nhãn neo vào vật trong cùng một khung (overlay của <Plot> hoặc một khung px bất kỳ).
 * obstacles: vật cản (px trong khung) — curveObstacles / axesObstacles / segmentObstacles / textObstacle.
 */
export const AutoLabels: React.FC<{
  items: AutoLabelItem[];
  scale?: Scale;
  obstacles?: Rect[];
  /** vùng nhãn được phép nằm (px trong khung); mặc định khung Plot nới 80px mỗi phía */
  bounds?: Rect;
}> = ({ items, scale, obstacles = [], bounds }) => {
  const px = (it: AutoLabelItem) => (scale ? { ax: scale.x(it.x), ay: scale.y(it.y) } : { ax: it.x, ay: it.y });
  const texts = (it: AutoLabelItem) => it.steps ?? [it.text];
  const size = (it: AutoLabelItem) => {
    const all = texts(it).map((t) => estimateLabel(t, it.size ?? FS.label));
    return { w: Math.max(...all.map((a) => a.w)), h: Math.max(...all.map((a) => a.h)) };
  };
  const specs: LabelSpec[] = items.map((it) => ({ id: it.id, ...px(it), ...size(it), prefer: it.prefer, phases: it.phases, anchor: it.anchor }));
  /** độ mờ của từng chữ trong steps tại bước hiện tại */
  const mix = (it: AutoLabelItem) => {
    const ts = texts(it);
    const st = Math.min(Math.max(it.step ?? 0, 0), ts.length - 1);
    const lo = Math.floor(st);
    return ts.map((t, i) => [t, i === lo ? 1 - (st - lo) : i === lo + 1 ? st - lo : 0] as const);
  };
  const b = bounds ?? (scale ? { x: -80, y: -80, w: scale.width + 160, h: scale.height + 160 } : { x: 0, y: 0, w: 1920, h: 1040 });
  const pos = placeLabels(specs, obstacles, b);
  return (
    <>
      {items.map((it, i) => {
        const o = it.opacity ?? 1;
        if (o <= 0) return null;
        const p = pos[it.id];
        const { ax, ay } = specs[i];
        const color = it.color ?? colors.text;
        // đường dẫn: từ điểm neo tới mép gần nhất của khung nhãn
        const ex = Math.max(p.cx - p.w / 2, Math.min(ax, p.cx + p.w / 2));
        const ey = Math.max(p.cy - p.h / 2, Math.min(ay, p.cy + p.h / 2));
        return (
          <React.Fragment key={it.id}>
            <div data-anchor-for={it.id} style={{ position: "absolute", left: ax, top: ay, width: 1, height: 1 }} />
            {p.leader ? (
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: o * 0.7 }} width={1} height={1}>
                <line x1={ax} y1={ay} x2={ex} y2={ey} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
              </svg>
            ) : null}
            {mix(it).map(([t, k], si) =>
              t && o * k > 0 ? (
                <div
                  key={si}
                  data-text="label"
                  data-label-id={it.id}
                  style={{
                    position: "absolute",
                    left: p.cx,
                    top: p.cy,
                    translate: "-50% -50%",
                    whiteSpace: "nowrap",
                    fontFamily: fontText,
                    fontWeight: it.weight ?? 600,
                    fontSize: it.size ?? FS.label,
                    color,
                    opacity: o * k,
                    textShadow: halo(),
                  }}
                >
                  <MathText text={t} />
                </div>
              ) : null,
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
