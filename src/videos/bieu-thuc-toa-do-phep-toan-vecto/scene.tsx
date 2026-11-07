import React from "react";
import { AutoLabelItem, AutoLabels, Rect } from "../../components/labels";
import { MathText } from "../../components/MathText";
import { role } from "../../components/roles";
import { colors, fontText, tint } from "../../components/theme";

// ==========================================
// 1. HỆ TỌA ĐỘ VÀ CHIẾU PHỐI CẢNH 3D CHUẨN SGK
// ==========================================

export type V3 = [number, number, number]; // [x, y, z]

const OX = 480;
const OY = 680;
const K = 68; // px mỗi đơn vị không gian
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

// Chiếu Cavalier chuẩn SGK:
// Ox xiên trước-trái 30°, Oy ngang sang phải, Oz thẳng đứng lên
export const P3D = (v: V3): [number, number] => [
  OX - v[0] * K * COS30 + v[1] * K,
  OY + v[0] * K * SIN30 - v[2] * K,
];

// Helper nhãn AutoLabels
const lab = (
  id: string,
  at: [number, number],
  text: string,
  o: number,
  color: string = colors.text,
  extra: Partial<AutoLabelItem> = {}
): AutoLabelItem => ({
  id,
  x: at[0],
  y: at[1],
  text,
  color,
  opacity: o,
  size: 36,
  ...extra,
});

// ==========================================
// 2. CÁC ĐỐI TƯỢNG ĐỒ HỌA 3D (SVG)
// ==========================================

const Line3D: React.FC<{
  a: V3;
  b: V3;
  color: string;
  w?: number;
  o?: number;
  dash?: boolean;
}> = ({ a, b, color, w = 3.5, o = 1, dash }) => {
  if (o <= 0) return null;
  const [x1, y1] = P3D(a);
  const [x2, y2] = P3D(b);
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={w}
      opacity={o}
      strokeDasharray={dash ? "8 6" : undefined}
      strokeLinecap="round"
    />
  );
};

export const Arrow3D: React.FC<{
  a: V3;
  b: V3;
  color: string;
  w?: number;
  o?: number;
  arrowSize?: number;
}> = ({ a, b, color, w = 4.5, o = 1, arrowSize = 14 }) => {
  if (o <= 0) return null;
  const [x1, y1] = P3D(a);
  const [x2, y2] = P3D(b);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 5) return null;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;

  const tipX = x2;
  const tipY = y2;
  const baseLen = arrowSize * 1.5;
  const baseW = arrowSize * 0.75;
  const baseX = tipX - ux * baseLen;
  const baseY = tipY - uy * baseLen;
  const leftX = baseX + px * baseW;
  const leftY = baseY + py * baseW;
  const rightX = baseX - px * baseW;
  const rightY = baseY - py * baseW;

  return (
    <g opacity={o}>
      <line
        x1={x1}
        y1={y1}
        x2={baseX}
        y2={baseY}
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
      />
      <polygon
        points={`${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`}
        fill={color}
      />
    </g>
  );
};

const Dot3D: React.FC<{
  pos: V3;
  r?: number;
  color?: string;
  o?: number;
}> = ({ pos, r = 7, color = role.focus, o = 1 }) => {
  if (o <= 0) return null;
  const [px, py] = P3D(pos);
  return (
    <g opacity={o}>
      <circle cx={px} cy={py} r={r + 3} fill={colors.bg} />
      <circle cx={px} cy={py} r={r} fill={color} />
    </g>
  );
};

// Icon máy bay tinh tế
const AirplaneIcon: React.FC<{
  x: number;
  y: number;
  angleDeg: number;
  scale?: number;
  o?: number;
  color?: string;
}> = ({ x, y, angleDeg, scale = 1, o = 1, color = role.focus }) => {
  if (o <= 0) return null;
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${angleDeg}) scale(${scale})`}
      opacity={o}
      pointerEvents="none"
    >
      <circle cx={0} cy={0} r={28} fill={color} opacity={0.15} />
      <path
        d="M 0 -22 L 6 -6 L 24 2 L 24 7 L 6 4 L 4 18 L 10 22 L 10 25 L 0 23 L -10 25 L -10 22 L -4 18 L -6 4 L -24 7 L -24 2 L -6 -6 Z"
        fill={color}
        stroke="#ffffff"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </g>
  );
};

// ==========================================
// 3. TRẠNG THÁI CẢNH 1 (BUỒNG LÁI / RADAR)
// ==========================================

export interface StScene1 {
  radarOp: number;
  planeX: number; // Tọa độ máy bay
  planeY: number;
  planeAngle: number;
  engineVecOp: number; // Mũi tên vận tốc động cơ v1
  windVecOp: number;   // Mũi tên gió tạt v2
  actualVecOp: number; // Mũi tên vận tốc thực tế v
  flightDisplayOp: number; // Bảng điện tử buồng lái
  parallelogramOp: number; // Khung hình bình hành nét đứt
  calcStepsOp: number; // Chi tiết 3 phép tính cộng
  safeStatusOp: number; // Nhãn hạ cánh an toàn
}

export const ZERO1: StScene1 = {
  radarOp: 0,
  planeX: 420,
  planeY: 540,
  planeAngle: 0,
  engineVecOp: 0,
  windVecOp: 0,
  actualVecOp: 0,
  flightDisplayOp: 0,
  parallelogramOp: 0,
  calcStepsOp: 0,
  safeStatusOp: 0,
};

export const Scene1: React.FC<{ st: StScene1 }> = ({ st }) => {
  if (st.radarOp <= 0) return null;

  const px = st.planeX;
  const py = st.planeY;

  // Điểm đầu mũi tên v1 (800 km/h: dài 260px sang phải)
  const v1TipX = px + 260;
  const v1TipY = py;

  // Vectơ gió v2 (-40; 60; 10): lệch trái 20px, xuống 70px
  const v2Dx = -20;
  const v2Dy = 70;
  const v2TipX = px + v2Dx;
  const v2TipY = py + v2Dy;

  // Vectơ tổng hợp v = v1 + v2
  const vActualTipX = v1TipX + v2Dx;
  const vActualTipY = v1TipY + v2Dy;

  const obstacles: Rect[] = [
    { x: px - 80, y: py - 60, w: 160, h: 120 },
    { x: 1200, y: 180, w: 600, h: 480 },
  ];

  const labels: AutoLabelItem[] = [
    lab("v1", [px + 140, py - 40], "$\\vec{v}_1 = (800; 0; 0)$", st.engineVecOp, role.focus, {
      prefer: ["n"],
      size: 38,
    }),
    lab("v2", [px - 60, py + 50], "$\\vec{v}_2 = (-40; 60; 10)$", st.windVecOp, role.warn, {
      prefer: ["sw"],
      size: 36,
    }),
    lab("v_actual", [vActualTipX + 20, vActualTipY + 20], "$\\vec{v} = (760; 60; 10)$", st.actualVecOp, role.up, {
      prefer: ["se"],
      size: 40,
    }),
  ];

  return (
    <div style={{ position: "absolute", inset: 0, opacity: st.radarOp }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* Nền radar và vạch tọa độ định hướng buồng lái mờ */}
        <g opacity={0.35}>
          <circle cx={960} cy={540} r={280} fill="none" stroke={role.main} strokeWidth={1.5} strokeDasharray="6 6" />
          <circle cx={960} cy={540} r={480} fill="none" stroke={role.main} strokeWidth={1.5} strokeDasharray="8 8" />
          <line x1={200} y1={540} x2={1720} y2={540} stroke={role.main} strokeWidth={1.5} />
          <line x1={960} y1={120} x2={960} y2={960} stroke={role.main} strokeWidth={1.5} />
        </g>

        {/* Khung hình bình hành nét đứt (quy tắc hình học 3D) */}
        {st.parallelogramOp > 0 && (
          <g opacity={st.parallelogramOp}>
            <polygon
              points={`${px},${py} ${v1TipX},${v1TipY} ${vActualTipX},${vActualTipY} ${v2TipX},${v2TipY}`}
              fill={tint(role.warn, 0.08)}
              stroke={role.warn}
              strokeWidth={2.5}
              strokeDasharray="8 6"
            />
          </g>
        )}

        {/* Mũi tên vận tốc động cơ v1 */}
        {st.engineVecOp > 0 && (
          <g opacity={st.engineVecOp}>
            <line
              x1={px}
              y1={py}
              x2={v1TipX}
              y2={v1TipY}
              stroke={role.focus}
              strokeWidth={5}
              strokeLinecap="round"
            />
            <polygon
              points={`${v1TipX},${v1TipY} ${v1TipX - 16},${v1TipY - 8} ${v1TipX - 16},${v1TipY + 8}`}
              fill={role.focus}
            />
          </g>
        )}

        {/* Mũi tên gió v2 */}
        {st.windVecOp > 0 && (
          <g opacity={st.windVecOp}>
            <line
              x1={px}
              y1={py}
              x2={v2TipX}
              y2={v2TipY}
              stroke={role.warn}
              strokeWidth={4.5}
              strokeLinecap="round"
            />
            <polygon
              points={`${v2TipX},${v2TipY} ${v2TipX + 16},${v2TipY - 5} ${v2TipX + 8},${v2TipY - 16}`}
              fill={role.warn}
            />
          </g>
        )}

        {/* Mũi tên vận tốc thực tế v */}
        {st.actualVecOp > 0 && (
          <g opacity={st.actualVecOp}>
            <line
              x1={px}
              y1={py}
              x2={vActualTipX}
              y2={vActualTipY}
              stroke={role.up}
              strokeWidth={6}
              strokeLinecap="round"
            />
            <polygon
              points={`${vActualTipX},${vActualTipY} ${vActualTipX - 18},${vActualTipY - 8} ${vActualTipX - 14},${vActualTipY + 10}`}
              fill={role.up}
            />
          </g>
        )}

        {/* Biểu tượng máy bay */}
        <AirplaneIcon x={px} y={py} angleDeg={st.planeAngle} scale={1.2} />
      </svg>

      {/* Nhãn tự động tránh nhau */}
      <AutoLabels items={labels} obstacles={obstacles} />

      {/* Bảng điện tử buồng lái (Flight Display) bên phải */}
      {st.flightDisplayOp > 0 && (
        <div
          data-box="flight-display"
          style={{
            position: "absolute",
            right: 100,
            top: 140,
            width: 580,
            padding: "24px 32px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 20,
            boxShadow: "0 18px 48px rgba(15, 23, 42, 0.12)",
            border: `2px solid ${role.focus}`,
            opacity: st.flightDisplayOp,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontFamily: fontText,
              fontSize: 26,
              fontWeight: 800,
              color: role.focus,
              letterSpacing: "0.06em",
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            Hệ thống lái tự động (FMS)
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: colors.text }}>
              Động cơ: <MathText text="$\vec{v}_1 = (800; 0; 0)$" />
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: role.warn }}>
              Gió tạt: <MathText text="$\vec{v}_2 = (-40; 60; 10)$" />
            </div>

            {st.calcStepsOp > 0 && (
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 16,
                  borderTop: `2px dashed ${colors.panelBorder}`,
                  opacity: st.calcStepsOp,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 30, color: colors.muted }}>
                  Trục x: <MathText text="$800 + (-40) = 760$" />
                </div>
                <div style={{ fontSize: 30, color: colors.muted }}>
                  Trục y: <MathText text="$0 + 60 = 60$" />
                </div>
                <div style={{ fontSize: 30, color: colors.muted }}>
                  Trục z: <MathText text="$0 + 10 = 10$" />
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: 14,
                padding: "16px 20px",
                backgroundColor: tint(role.up, 0.12),
                borderRadius: 14,
                border: `1.5px solid ${role.up}`,
                fontSize: 34,
                fontWeight: 800,
                color: role.up,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>Vận tốc thực:</span>
              <MathText text="$\vec{v} = (760; 60; 10)$" />
            </div>

            {st.safeStatusOp > 0 && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 28,
                  fontWeight: 700,
                  color: role.up,
                  textAlign: "center",
                  opacity: st.safeStatusOp,
                }}
              >
                ✓ Bù gió tự động — Hạ cánh chuẩn xác
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. TRẠNG THÁI CẢNH 2 (HỆ TOẠ ĐỘ Oxyz & CÁC PHÉP TOÁN)
// ==========================================

export interface StScene2 {
  stageOp: number;
  axesOp: number;
  unitVectorsOp: number; // i, j, k
  vectorUOp: number;     // u = (x, y, z)
  uWalkStepsOp: number;  // 3 bước đi dọc 3 trục
  // Phép cộng u + v
  vectorVOp: number;     // v nối tiếp ngọn u
  vWalkStepsOp: number;  // các bước đi của v
  sumFormulaOp: number;  // u + v = (x1+x2; ...)
  sumVectorOp: number;   // Vectơ tổng nối từ O đến ngọn v
  // Phép trừ và phép nhân số k
  negVectorVOp: number;  // -v nối tiếp ngọn u cho phép trừ
  diffVectorOp: number;  // u - v = (x1-x2; ...)
  scalarKOp: number;     // k u = (kx; ky; kz)
  // Tích vô hướng
  dotProductFormulaOp: number; // Biểu thức khai triển 9 số hạng
  dotCrossTermsFadeOp: number; // 6 số hạng chéo triệt tiêu về 0
  dotSquareTermsOp: number;    // 3 số hạng bình phương = 1
  dotResultFormulaOp: number;  // u . v = x1x2 + y1y2 + z1z2
  // Độ dài & vuông góc
  lengthFormulaOp: number;     // |u| = sqrt(...)
  boxContainerOp: number;      // Hình hộp chữ nhật
  perpendicularOp: number;     // u vuông góc v <=> u.v = 0
  // Thẻ so sánh Đúng/Sai (Bẫy thường gặp)
  trapCompareCardOp: number;
  // Tổng kết 4 phép toán
  summaryCardOp: number;
}

export const ZERO2: StScene2 = {
  stageOp: 0,
  axesOp: 0,
  unitVectorsOp: 0,
  vectorUOp: 0,
  uWalkStepsOp: 0,
  vectorVOp: 0,
  vWalkStepsOp: 0,
  sumFormulaOp: 0,
  sumVectorOp: 0,
  negVectorVOp: 0,
  diffVectorOp: 0,
  scalarKOp: 0,
  dotProductFormulaOp: 0,
  dotCrossTermsFadeOp: 0,
  dotSquareTermsOp: 0,
  dotResultFormulaOp: 0,
  lengthFormulaOp: 0,
  boxContainerOp: 0,
  perpendicularOp: 0,
  trapCompareCardOp: 0,
  summaryCardOp: 0,
};

export const Scene2: React.FC<{ st: StScene2 }> = ({ st }) => {
  if (st.stageOp <= 0) return null;

  // Tọa độ vector mẫu chuẩn hình học:
  // u = (3; 4; 4)
  const uPos: V3 = [3, 4, 4];
  // v = (2; 3; -1)
  const vPos: V3 = [2, 3, -1];
  // u + v = (5; 7; 3)
  const sumPos: V3 = [uPos[0] + vPos[0], uPos[1] + vPos[1], uPos[2] + vPos[2]];
  // Trung điểm của v để neo nhãn chính xác
  const vMid: V3 = [uPos[0] + vPos[0] / 2, uPos[1] + vPos[1] / 2, uPos[2] + vPos[2] / 2];
  // k*u với k = 1.5
  const kuPos: V3 = [uPos[0] * 1.5, uPos[1] * 1.5, uPos[2] * 1.5];

  const obstacles: Rect[] = [
    { x: OX - 100, y: OY - 60, w: 140, h: 100 }, // Gốc O
    { x: 1220, y: 120, w: 620, h: 680 }, // Khu vực thẻ công thức góc phải
  ];

  const labels: AutoLabelItem[] = [
    lab("axis_x", P3D([5.5, 0, 0]), "$x$", st.axesOp, role.main, { prefer: ["sw"] }),
    lab("axis_y", P3D([0, 7.3, 0]), "$y$", st.axesOp, role.main, { prefer: ["n"] }),
    lab("axis_z", P3D([0, 0, 6.2]), "$z$", st.axesOp, role.main, { prefer: ["n"] }),
    lab("vec_i", P3D([1.2, 0, 0]), "$\\vec{i}$", st.unitVectorsOp, role.focus, { prefer: ["sw"] }),
    lab("vec_j", P3D([0, 1.2, 0]), "$\\vec{j}$", st.unitVectorsOp, role.focus, { prefer: ["n"] }),
    lab("vec_k", P3D([0, 0, 1.2]), "$\\vec{k}$", st.unitVectorsOp, role.focus, { prefer: ["w"] }),
    lab("vec_u", P3D(uPos), "$\\vec{u}(x; y; z)$", st.vectorUOp, role.focus, { prefer: ["ne"], size: 38 }),
    lab("vec_v", P3D(vMid), "$\\vec{v}$", st.vectorVOp, role.warn, { prefer: ["e"], size: 36 }),
    lab("vec_sum", P3D(sumPos), "$\\vec{u} + \\vec{v}$", st.sumVectorOp, role.up, { prefer: ["ne"], size: 38 }),
    lab("vec_ku", P3D(kuPos), "$k\\vec{u}$", st.scalarKOp, role.focus, { prefer: ["ne"], size: 38 }),
  ];

  return (
    <div style={{ position: "absolute", inset: 0, opacity: st.stageOp }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* Hệ trục tọa độ Oxyz */}
        {st.axesOp > 0 && (
          <g opacity={st.axesOp}>
            {/* Trục Ox */}
            <Arrow3D a={[0, 0, 0]} b={[5.8, 0, 0]} color={role.main} w={3.5} />
            {/* Trục Oy */}
            <Arrow3D a={[0, 0, 0]} b={[0, 7.6, 0]} color={role.main} w={3.5} />
            {/* Trục Oz */}
            <Arrow3D a={[0, 0, 0]} b={[0, 0, 6.4]} color={role.main} w={3.5} />

            {/* Gốc O */}
            <Dot3D pos={[0, 0, 0]} r={6} color={role.main} />
            <text
              x={OX - 32}
              y={OY + 24}
              fontFamily={fontText}
              fontWeight={800}
              fontSize={32}
              fill={role.main}
            >
              O
            </text>
          </g>
        )}

        {/* Ba vectơ đơn vị i, j, k */}
        {st.unitVectorsOp > 0 && (
          <g opacity={st.unitVectorsOp}>
            <Arrow3D a={[0, 0, 0]} b={[1, 0, 0]} color={role.focus} w={5.5} arrowSize={16} />
            <Arrow3D a={[0, 0, 0]} b={[0, 1, 0]} color={role.focus} w={5.5} arrowSize={16} />
            <Arrow3D a={[0, 0, 0]} b={[0, 0, 1]} color={role.focus} w={5.5} arrowSize={16} />
          </g>
        )}

        {/* Các bước đi dời tọa độ của vectơ u: O -> (x,0,0) -> (x,y,0) -> (x,y,z) */}
        {st.uWalkStepsOp > 0 && (
          <g opacity={st.uWalkStepsOp}>
            <Line3D a={[0, 0, 0]} b={[uPos[0], 0, 0]} color={role.focus} w={4} dash />
            <Line3D a={[uPos[0], 0, 0]} b={[uPos[0], uPos[1], 0]} color={role.focus} w={4} dash />
            <Line3D a={[uPos[0], uPos[1], 0]} b={uPos} color={role.focus} w={4} dash />
            <Dot3D pos={[uPos[0], uPos[1], 0]} r={5} color={role.focus} />
          </g>
        )}

        {/* Vectơ u */}
        {st.vectorUOp > 0 && (
          <g opacity={st.vectorUOp}>
            <Arrow3D a={[0, 0, 0]} b={uPos} color={role.focus} w={6} arrowSize={18} />
            <Dot3D pos={uPos} r={8} color={role.focus} />
          </g>
        )}

        {/* Vectơ v nối tiếp từ ngọn của u */}
        {st.vectorVOp > 0 && (
          <g opacity={st.vectorVOp}>
            <Arrow3D a={uPos} b={sumPos} color={role.warn} w={5} arrowSize={16} />
            <Dot3D pos={sumPos} r={7} color={role.warn} />
          </g>
        )}

        {/* Các bước đi của v nối tiếp trên 3 trục */}
        {st.vWalkStepsOp > 0 && (
          <g opacity={st.vWalkStepsOp}>
            <Line3D a={[uPos[0], 0, 0]} b={[sumPos[0], 0, 0]} color={role.warn} w={3.5} dash />
            <Line3D a={[uPos[0], uPos[1], 0]} b={[sumPos[0], sumPos[1], 0]} color={role.warn} w={3.5} dash />
            <Line3D a={uPos} b={sumPos} color={role.warn} w={3.5} dash />
          </g>
        )}

        {/* Vectơ tổng u + v nối từ gốc O đến ngọn v */}
        {st.sumVectorOp > 0 && (
          <g opacity={st.sumVectorOp}>
            <Arrow3D a={[0, 0, 0]} b={sumPos} color={role.up} w={6.5} arrowSize={20} />
          </g>
        )}

        {/* Vectơ đối -v nối từ ngọn u cho phép trừ u - v */}
        {st.negVectorVOp > 0 && (
          <g opacity={st.negVectorVOp}>
            <Arrow3D
              a={uPos}
              b={[uPos[0] - vPos[0], uPos[1] - vPos[1], uPos[2] - vPos[2]]}
              color={role.warn}
              w={5}
              arrowSize={16}
            />
            <Arrow3D
              a={[0, 0, 0]}
              b={[uPos[0] - vPos[0], uPos[1] - vPos[1], uPos[2] - vPos[2]]}
              color={role.main}
              w={5}
            />
          </g>
        )}

        {/* Vectơ co giãn k*u */}
        {st.scalarKOp > 0 && (
          <g opacity={st.scalarKOp}>
            <Arrow3D a={[0, 0, 0]} b={kuPos} color={role.focus} w={7} arrowSize={20} />
            <Dot3D pos={kuPos} r={9} color={role.focus} />
            <Line3D a={uPos} b={kuPos} color={role.focus} w={3} dash />
          </g>
        )}

        {/* Khung hình hộp chữ nhật bao quanh u để minh họa độ dài */}
        {st.boxContainerOp > 0 && (
          <g opacity={st.boxContainerOp}>
            <Line3D a={[uPos[0], 0, 0]} b={[uPos[0], uPos[1], 0]} color={role.main} w={2} dash />
            <Line3D a={[0, uPos[1], 0]} b={[uPos[0], uPos[1], 0]} color={role.main} w={2} dash />
            <Line3D a={[0, 0, uPos[2]]} b={[uPos[0], 0, uPos[2]]} color={role.main} w={2} dash />
            <Line3D a={[0, 0, uPos[2]]} b={[0, uPos[1], uPos[2]]} color={role.main} w={2} dash />
            <Line3D a={[uPos[0], 0, uPos[2]]} b={uPos} color={role.main} w={2} dash />
            <Line3D a={[0, uPos[1], uPos[2]]} b={uPos} color={role.main} w={2} dash />
            <Line3D a={[uPos[0], uPos[1], 0]} b={uPos} color={role.main} w={2} dash />
          </g>
        )}

        {/* Hai vectơ u và v vuông góc */}
        {st.perpendicularOp > 0 && (
          <g opacity={st.perpendicularOp}>
            {/* Vectơ vuông góc mẫu: u = (3; 0; 0) và w = (0; 4; 0) */}
            <Arrow3D a={[0, 0, 0]} b={[3.5, 0, 0]} color={role.focus} w={6} />
            <Arrow3D a={[0, 0, 0]} b={[0, 4.5, 0]} color={role.up} w={6} />
            {/* Ký hiệu góc vuông */}
            <path
              d={`M ${P3D([0.6, 0, 0])[0]} ${P3D([0.6, 0, 0])[1]} L ${P3D([0.6, 0.6, 0])[0]} ${P3D([0.6, 0.6, 0])[1]} L ${P3D([0, 0.6, 0])[0]} ${P3D([0, 0.6, 0])[1]}`}
              fill="none"
              stroke={role.up}
              strokeWidth={3}
            />
          </g>
        )}
      </svg>

      {/* Nhãn neo tự động */}
      <AutoLabels items={labels} obstacles={obstacles} />

      {/* BẢNG CÔNG THỨC PHÉP CỘNG / TRỪ / NHÂN SỐ K */}
      {st.sumFormulaOp > 0 && (
        <div
          data-box="sum-card"
          style={{
            position: "absolute",
            right: 70,
            top: 120,
            width: 610,
            padding: "18px 24px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 18,
            boxShadow: "0 18px 48px rgba(15, 23, 42, 0.14)",
            border: `2px solid ${role.focus}`,
            opacity: st.sumFormulaOp,
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800, color: role.focus, marginBottom: 10 }}>
            QUY TẮC CỘNG DỒN TỪNG TRỤC
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: colors.text }}>
              <MathText text="$\\vec{u} = x_1\\vec{i} + y_1\\vec{j} + z_1\\vec{k}$" />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: colors.text }}>
              <MathText text="$\\vec{v} = x_2\\vec{i} + y_2\\vec{j} + z_2\\vec{k}$" />
            </div>
            <div
              style={{
                marginTop: 2,
                padding: "10px 14px",
                backgroundColor: tint(role.up, 0.12),
                borderRadius: 12,
                border: `1.5px solid ${role.up}`,
                fontSize: 29,
                fontWeight: 800,
                color: role.up,
                whiteSpace: "nowrap",
              }}
            >
              <MathText text="$\\vec{u} + \\vec{v} = (x_1+x_2; y_1+y_2; z_1+z_2)$" />
            </div>

            {st.diffVectorOp > 0 && (
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: tint(role.main, 0.08),
                  borderRadius: 12,
                  border: `1.5px solid ${role.main}`,
                  fontSize: 28,
                  fontWeight: 800,
                  color: colors.text,
                  whiteSpace: "nowrap",
                  opacity: st.diffVectorOp,
                }}
              >
                <MathText text="$\\vec{u} - \\vec{v} = (x_1-x_2; y_1-y_2; z_1-z_2)$" />
              </div>
            )}

            {st.scalarKOp > 0 && (
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: tint(role.focus, 0.1),
                  borderRadius: 12,
                  border: `1.5px solid ${role.focus}`,
                  fontSize: 28,
                  fontWeight: 800,
                  color: role.focus,
                  whiteSpace: "nowrap",
                  opacity: st.scalarKOp,
                }}
              >
                <MathText text="$k\\vec{u} = (kx; ky; kz)$" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* BẢNG GIẢI PHẪU TÍCH VÔ HƯỚNG (9 SỐ HẠNG & TRIỆT TIÊU 6 TÍCH CHÉO) */}
      {st.dotProductFormulaOp > 0 && (
        <div
          data-box="dot-card"
          style={{
            position: "absolute",
            right: 60,
            top: 90,
            width: 610,
            maxHeight: 640,
            overflow: "hidden",
            padding: "16px 20px",
            backgroundColor: "rgba(255, 255, 255, 0.96)",
            borderRadius: 18,
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.16)",
            border: `2px solid ${role.focus}`,
            opacity: st.dotProductFormulaOp,
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 800, color: role.focus, marginBottom: 6 }}>
            BẢN CHẤT TÍCH VÔ HƯỚNG
          </div>

          <div style={{ fontSize: 22, color: colors.text, marginBottom: 6 }}>
            Khai triển phân phối 9 số hạng:
          </div>

          {/* Công thức phân phối */}
          <div
            style={{
              padding: "6px 10px",
              backgroundColor: colors.bg,
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 700,
              color: colors.text,
              whiteSpace: "nowrap",
              marginBottom: 6,
            }}
          >
            <MathText text="$(x_1\\vec{i} + y_1\\vec{j} + z_1\\vec{k}) \\cdot (x_2\\vec{i} + y_2\\vec{j} + z_2\\vec{k})$" />
          </div>

          {/* Khối triệt tiêu 6 tích chéo */}
          <div
            style={{
              padding: "6px 10px",
              backgroundColor: st.dotCrossTermsFadeOp > 0 ? tint(role.warn, 0.12) : colors.bg,
              borderRadius: 8,
              border: `1.5px solid ${st.dotCrossTermsFadeOp > 0 ? role.warn : colors.panelBorder}`,
              marginBottom: 6,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, color: role.warn, marginBottom: 2 }}>
              6 cặp khác trục vuông góc:
            </div>
            <div style={{ fontSize: 23, fontWeight: 800, color: role.warn }}>
              <MathText text="$\\vec{i} \\cdot \\vec{j} = \\vec{j} \\cdot \\vec{k} = \\vec{k} \\cdot \\vec{i} = 0$" />
            </div>
          </div>

          {/* Khối 3 cặp cùng trục = 1 */}
          <div
            style={{
              padding: "6px 10px",
              backgroundColor: st.dotSquareTermsOp > 0 ? tint(role.focus, 0.1) : colors.bg,
              borderRadius: 8,
              border: `1.5px solid ${st.dotSquareTermsOp > 0 ? role.focus : colors.panelBorder}`,
              marginBottom: 6,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, color: role.focus, marginBottom: 2 }}>
              3 cặp cùng trục:
            </div>
            <div style={{ fontSize: 23, fontWeight: 800, color: role.focus }}>
              <MathText text="$\\vec{i}^2 = \\vec{j}^2 = \\vec{k}^2 = 1$" />
            </div>
          </div>

          {/* Kết quả tinh giản */}
          {st.dotResultFormulaOp > 0 && (
            <div
              style={{
                padding: "8px 12px",
                backgroundColor: tint(role.up, 0.14),
                borderRadius: 8,
                border: `2px solid ${role.up}`,
                fontSize: 27,
                fontWeight: 800,
                color: role.up,
                textAlign: "center",
                opacity: st.dotResultFormulaOp,
              }}
            >
              <MathText text="$\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2 + z_1 z_2$" />
            </div>
          )}
        </div>
      )}

      {/* BẢNG ĐỘ DÀI & VUÔNG GÓC */}
      {st.lengthFormulaOp > 0 && (
        <div
          data-box="len-card"
          style={{
            position: "absolute",
            right: 100,
            top: 220,
            width: 660,
            padding: "28px 34px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 20,
            boxShadow: "0 18px 48px rgba(15, 23, 42, 0.14)",
            border: `2px solid ${role.focus}`,
            opacity: st.lengthFormulaOp,
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 800, color: role.focus, marginBottom: 16 }}>
            HỆ QUẢ CỐT LÕI
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                padding: "16px 20px",
                backgroundColor: tint(role.focus, 0.1),
                borderRadius: 14,
                border: `1.5px solid ${role.focus}`,
                fontSize: 34,
                fontWeight: 800,
                color: role.focus,
              }}
            >
              <MathText text="$|\\vec{u}| = \\sqrt{x^2 + y^2 + z^2}$" />
            </div>

            {st.perpendicularOp > 0 && (
              <div
                style={{
                  padding: "16px 20px",
                  backgroundColor: tint(role.up, 0.12),
                  borderRadius: 14,
                  border: `1.5px solid ${role.up}`,
                  fontSize: 32,
                  fontWeight: 800,
                  color: role.up,
                  opacity: st.perpendicularOp,
                }}
              >
                <MathText text="$\\vec{u} \\perp \\vec{v} \\Leftrightarrow x_1 x_2 + y_1 y_2 + z_1 z_2 = 0$" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* THẺ SO SÁNH ĐÚNG/SAI (BẪY THƯỜNG GẶP) */}
      {st.trapCompareCardOp > 0 && (
        <div
          data-box="trap-card"
          style={{
            position: "absolute",
            left: "50%",
            top: 200,
            transform: "translateX(-50%)",
            width: 1040,
            padding: "32px 40px",
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            borderRadius: 24,
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.2)",
            border: `2.5px solid ${role.warn}`,
            opacity: st.trapCompareCardOp,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: role.warn,
              textAlign: "center",
              marginBottom: 24,
              letterSpacing: "0.04em",
            }}
          >
            BẪY THƯỜNG GẶP: KẾT QUẢ LÀ VECTƠ HAY CON SỐ?
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Khối Sai */}
            <div
              style={{
                padding: "20px 24px",
                backgroundColor: tint(role.warn, 0.08),
                borderRadius: 16,
                border: `2px solid ${role.warn}`,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxSizing: "border-box",
              }}
            >
              <div style={{ fontSize: 25, fontWeight: 800, color: role.warn }}>
                SAI ✗ (Nhầm sang Vectơ)
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: colors.text, whiteSpace: "nowrap" }}>
                <MathText text="$\\vec{u} \\cdot \\vec{v} = (x_1 x_2; y_1 y_2; z_1 z_2)$" />
              </div>
              <div style={{ fontSize: 23, color: colors.muted }}>
                Đóng ngoặc tròn tọa độ là sai bản chất!
              </div>
            </div>

            {/* Khối Đúng */}
            <div
              style={{
                padding: "20px 24px",
                backgroundColor: tint(role.up, 0.1),
                borderRadius: 16,
                border: `2px solid ${role.up}`,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxSizing: "border-box",
              }}
            >
              <div style={{ fontSize: 25, fontWeight: 800, color: role.up }}>
                ĐÚNG ✓ (Một con số thực)
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: role.up, whiteSpace: "nowrap" }}>
                <MathText text="$\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2 + z_1 z_2$" />
              </div>
              <div style={{ fontSize: 23, color: colors.muted }}>
                Kết quả là một số <MathText text="$\\in \\mathbb{R}$" />, không có ngoặc!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* THẺ TỔNG KẾT 4 PHÉP TOÁN */}
      {st.summaryCardOp > 0 && (
        <div
          data-box="summary-card"
          style={{
            position: "absolute",
            left: "50%",
            top: 200,
            transform: "translateX(-50%)",
            width: 960,
            padding: "36px 48px",
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            borderRadius: 24,
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.2)",
            border: `2.5px solid ${role.focus}`,
            opacity: st.summaryCardOp,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: role.focus,
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            BỐN PHÉP TOÁN VECTƠ BẰNG TOẠ ĐỘ
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 20px",
                backgroundColor: colors.bg,
                borderRadius: 12,
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              <span>Phép cộng:</span>
              <MathText text="$\\vec{u} + \\vec{v} = (x+x'; y+y'; z+z')$" />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 20px",
                backgroundColor: colors.bg,
                borderRadius: 12,
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              <span>Phép trừ:</span>
              <MathText text="$\\vec{u} - \\vec{v} = (x-x'; y-y'; z-z')$" />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 20px",
                backgroundColor: colors.bg,
                borderRadius: 12,
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              <span>Nhân số k:</span>
              <MathText text="$k\\vec{u} = (kx; ky; kz)$" />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 20px",
                backgroundColor: tint(role.up, 0.14),
                borderRadius: 12,
                fontSize: 30,
                fontWeight: 800,
                color: role.up,
                border: `1.5px solid ${role.up}`,
              }}
            >
              <span>Tích vô hướng:</span>
              <MathText text="$\\vec{u} \\cdot \\vec{v} = x x' + y y' + z z'$" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
