import React from "react";
import { interpolate, interpolateColors } from "remotion";
import { MathText } from "../MathText";
import { colors, fontText } from "../theme";
import "./mhchem";

/**
 * Đinh iron nhúng trong dung dịch copper(II) sulfate — hiện tượng thật của phản ứng oxi hoá – khử (Hóa 10 Bài 13).
 * Theo `progress` 0 → 1: phần đinh ngập trong dung dịch phủ dần lớp copper đỏ nâu; dung dịch nhạt dần từ xanh lam
 * sang xanh lục rất nhạt (Cu²⁺ hết dần, Fe²⁺ tạo thành). Có thẻ tên trên đinh và chữ dưới cốc (gói Hóa › 6.2).
 *
 * Dùng: <NailInCopperSulfate left={700} top={180} width={480} progress={interpolate(fr, [L[1], L[3]], [0, 1], clamp)} />
 */
const BLUE = "#4F94E8";
const PALE_GREEN = "#D9EDCF";
const IRON = "#8A94A6";
const COPPER = "#B4532A";

export const NailInCopperSulfate: React.FC<{
  left: number;
  top: number;
  /** bề rộng cốc, nên 400–560. Tổng cao ≈ 1,3 × width + 120 */
  width?: number;
  /** 0 = vừa nhúng, 1 = đã phủ dày lớp copper, dung dịch nhạt màu */
  progress: number;
  /** chữ trên đinh và dưới cốc */
  nailLabel?: string;
  liquidLabel?: string;
  /** dòng thứ hai dưới cốc: công thức */
  liquidFormula?: string;
  color?: string;
  opacity?: number;
}> = ({ left, top, width: W = 480, progress, nailLabel = "đinh iron ($\\ce{Fe}$)", liquidLabel = "dung dịch copper(II) sulfate", liquidFormula = "$\\ce{CuSO4}$", color = colors.accent, opacity = 1 }) => {
  const p = Math.max(0, Math.min(1, progress));
  const H = W * 1.0;
  const TOP = 110; // chỗ cho thẻ tên
  const surface = H * 0.3;
  const liquid = interpolateColors(p, [0, 1], [BLUE, PALE_GREEN]);
  const nailX = W * 0.5;
  const nailW = W * 0.07;
  const nailTop = -W * 0.08;
  const nailBottom = H * 0.86;
  const coat = interpolate(p, [0, 1], [0, nailW * 0.28]);
  const coatO = interpolate(p, [0, 0.15, 1], [0, 0.6, 1]);
  return (
    <div data-box="lab" style={{ position: "absolute", left, top, width: W, height: TOP + H + 110, fontFamily: fontText, opacity }}>
      <div
        data-box="tag"
        style={{
          position: "absolute",
          left: W * 0.05,
          right: W * 0.05,
          top: 0,
          height: 64,
          borderRadius: 14,
          border: `3px solid ${color}`,
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div data-text="label" style={{ fontSize: 36, fontWeight: 800, color }}>
          <MathText text={nailLabel} />
        </div>
      </div>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: TOP, overflow: "visible" }}>
        <path
          d={`M ${W * 0.12} ${surface} L ${W * 0.88} ${surface} L ${W * 0.88} ${H - 18} Q ${W * 0.88} ${H - 4} ${W * 0.84} ${H - 4} L ${W * 0.16} ${H - 4} Q ${W * 0.12} ${H - 4} ${W * 0.12} ${H - 18} Z`}
          fill={liquid}
          opacity={0.9}
        />
        {/* đinh: mũ + thân + mũi */}
        <rect x={nailX - nailW * 1.6} y={nailTop} width={nailW * 3.2} height={nailW * 0.7} rx={6} fill={IRON} stroke="#5B6474" strokeWidth={2} />
        <path d={`M ${nailX - nailW / 2} ${nailTop} L ${nailX + nailW / 2} ${nailTop} L ${nailX + nailW / 2} ${nailBottom} L ${nailX} ${nailBottom + nailW * 1.4} L ${nailX - nailW / 2} ${nailBottom} Z`} fill={IRON} stroke="#5B6474" strokeWidth={2} />
        {/* lớp copper chỉ trên phần ngập trong dung dịch */}
        <path
          d={`M ${nailX - nailW / 2 - coat} ${surface + 4} L ${nailX + nailW / 2 + coat} ${surface + 4} L ${nailX + nailW / 2 + coat} ${nailBottom} L ${nailX} ${nailBottom + nailW * 1.4 + coat} L ${nailX - nailW / 2 - coat} ${nailBottom} Z`}
          fill={COPPER}
          opacity={coatO}
        />
        <line x1={W * 0.12} y1={surface} x2={W * 0.88} y2={surface} stroke={interpolateColors(p, [0, 1], ["#2F6FC4", "#9CC48A"])} strokeWidth={3} />
        <path
          d={`M ${W * 0.08} ${H * 0.06} L ${W * 0.12} ${H * 0.06 + 8} L ${W * 0.12} ${H - 18} Q ${W * 0.12} ${H} ${W * 0.16} ${H} L ${W * 0.84} ${H} Q ${W * 0.88} ${H} ${W * 0.88} ${H - 18} L ${W * 0.88} ${H * 0.06 + 8} L ${W * 0.92} ${H * 0.06}`}
          fill="none"
          stroke="#94A3B8"
          strokeWidth={5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <line x1={W * 0.8} y1={H * 0.35} x2={W * 0.8} y2={H - 40} stroke="#FFFFFF" strokeWidth={5} opacity={0.6} strokeLinecap="round" />
      </svg>
      <div data-text="label" style={{ position: "absolute", left: 0, right: 0, top: TOP + H + 14, textAlign: "center", fontSize: 30, fontWeight: 600, color: colors.muted }}>
        <MathText text={liquidLabel} />
      </div>
      {liquidFormula && (
        <div data-text="label" style={{ position: "absolute", left: 0, right: 0, top: TOP + H + 56, textAlign: "center", fontSize: 36, color: colors.text }}>
          <MathText text={liquidFormula} />
        </div>
      )}
    </div>
  );
};
