import React from "react";
import { Card } from "../../components/Card";
import { AutoLabelItem, AutoLabels, Rect, segmentObstacles, textObstacle } from "../../components/labels";
import { MathText } from "../../components/MathText";
import { role } from "../../components/roles";
import { Arrow, Dot, Plane, Pt, RightMark, Seg } from "../../components/space";
import { colors, tint } from "../../components/theme";

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
export const P3D = (v: V3): Pt => [
  OX - v[0] * K * COS30 + v[1] * K,
  OY + v[0] * K * SIN30 - v[2] * K,
];

const add3 = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const lerp3 = (a: V3, b: V3, t: number): V3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];

// Helper nhãn AutoLabels
const lab = (
  id: string,
  at: Pt,
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
// 2. TRẠNG THÁI CẢNH 1 (BUỒNG LÁI / RADAR)
// ==========================================

export interface StScene1 {
  radarOp: number;
  planeX: number; // Tọa độ máy bay
  planeY: number;
  planeAngle: number; // Góc xoay máy bay (deg)
  engineVecOp: number; // Mũi tên vận tốc động cơ v1
  windVecOp: number;   // Mũi tên gió tạt v2
  actualVecOp: number; // Mũi tên vận tốc thực tế v
  flightDisplayOp: number; // Bảng điện tử buồng lái
  parallelogramOp: number; // Khung hình bình hành nét đứt
  calcStepsOp: number;     // 3 bước cộng hiển thị trên bảng
  safeStatusOp: number;    // Trạng thái an toàn kết thúc
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

  // Đầu mút vector trên màn hình radar
  const v1Tip: Pt = [px + 240, py];
  const v2Dx = -20;
  const v2Dy = 70;
  const v2Tip: Pt = [px + v2Dx, py + v2Dy];
  const vActualTip: Pt = [v1Tip[0] + v2Dx, v1Tip[1] + v2Dy];

  const obstacles: Rect[] = [
    { x: px - 80, y: py - 60, w: 160, h: 120 }, // Vùng an toàn quanh máy bay
    { x: 1200, y: 150, w: 660, h: 620 }, // Bảng điều khiển góc phải
  ];

  const labels: AutoLabelItem[] = [
    lab("v1", [px + 200, py - 40], "$\\vec{v}_1 = (800;\\, 0;\\, 0)$", st.engineVecOp, role.focus, {
      prefer: ["ne", "n"],
      size: 38,
      phases: ["b01", "b02", "b10"],
    }),
    lab("v2", [px - 60, py + 50], "$\\vec{v}_2 = (-40;\\, 60;\\, 10)$", st.windVecOp, role.warn, {
      prefer: ["sw"],
      size: 36,
      phases: ["b01", "b02", "b10"],
    }),
    lab("v_actual", [vActualTip[0] + 30, vActualTip[1] + 25], "$\\vec{v} = (760;\\, 60;\\, 10)$", st.actualVecOp, role.up, {
      prefer: ["se", "e"],
      size: 40,
      phases: ["b01", "b02", "b10"],
    }),
  ];

  return (
    <div style={{ position: "absolute", inset: 0, opacity: st.radarOp }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* Nền màn hình định vị Radar */}
        <g opacity={st.radarOp}>
          <circle cx={960} cy={540} r={460} fill="none" stroke={role.main} strokeWidth={1.5} strokeDasharray="6 6" opacity={0.3} />
          <circle cx={960} cy={540} r={320} fill="none" stroke={role.main} strokeWidth={1.5} strokeDasharray="6 6" opacity={0.4} />
          <circle cx={960} cy={540} r={180} fill="none" stroke={role.main} strokeWidth={1.5} opacity={0.35} />
          <line x1={500} y1={540} x2={1420} y2={540} stroke={role.main} strokeWidth={1.5} opacity={0.3} />
          <line x1={960} y1={120} x2={960} y2={960} stroke={role.main} strokeWidth={1.5} opacity={0.3} />
        </g>

        {/* Khung hình bình hành nét đứt */}
        {st.parallelogramOp > 0 && (
          <g opacity={st.parallelogramOp}>
            <polygon
              points={`${px},${py} ${v1Tip[0]},${v1Tip[1]} ${vActualTip[0]},${vActualTip[1]} ${v2Tip[0]},${v2Tip[1]}`}
              fill={tint(role.warn, 0.08)}
              stroke={role.warn}
              strokeWidth={2.5}
              strokeDasharray="8 6"
            />
          </g>
        )}

        {/* Mũi tên vận tốc động cơ v1 (dùng component Arrow chuẩn) */}
        <Arrow a={[px, py]} b={v1Tip} color={role.focus} w={5} o={st.engineVecOp} arrowSize={15} />

        {/* Mũi tên gió v2 */}
        <Arrow a={[px, py]} b={v2Tip} color={role.warn} w={4.5} o={st.windVecOp} arrowSize={14} />

        {/* Mũi tên vận tốc thực tế v */}
        <Arrow a={[px, py]} b={vActualTip} color={role.up} w={6} o={st.actualVecOp} arrowSize={18} />

        {/* Biểu tượng máy bay xoay đúng hướng vận tốc tức thời */}
        <Plane x={px} y={py} deg={st.planeAngle} s={0.72} color={role.focus} o={st.radarOp} />
      </svg>

      {/* Nhãn tự động tránh nhau */}
      <AutoLabels items={labels} obstacles={obstacles} />

      {/* Bảng điện tử buồng lái (Flight Display) bên phải */}
      {st.flightDisplayOp > 0 && (
        <Card
          group="flight-display"
          style={{
            right: 80,
            top: 200,
            width: 640,
            padding: "32px 36px",
            border: `2px solid ${role.focus}`,
            boxSizing: "border-box",
            opacity: st.flightDisplayOp,
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 800, color: role.focus, letterSpacing: 1.5, marginBottom: 16 }}>
            FLIGHT COMPUTER — VECTOR SUM
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, fontWeight: 700 }}>
              <span style={{ color: role.focus }}><MathText text="$\\vec{v}_1$ (động cơ):" /></span>
              <span style={{ color: colors.text, whiteSpace: "nowrap" }}><MathText text="$(800;\\, 0;\\, 0)$" /></span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, fontWeight: 700 }}>
              <span style={{ color: role.warn }}><MathText text="$\\vec{v}_2$ (gió tạt):" /></span>
              <span style={{ color: colors.text, whiteSpace: "nowrap" }}><MathText text="$(-40;\\, 60;\\, 10)$" /></span>
            </div>

            <div
              style={{
                marginTop: 8,
                padding: "16px 20px",
                backgroundColor: tint(role.up, 0.12),
                borderRadius: 16,
                border: `2px solid ${role.up}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 28,
                fontWeight: 800,
                color: role.up,
                whiteSpace: "nowrap",
              }}
            >
              <span><MathText text="$\\vec{v} = \\vec{v}_1 + \\vec{v}_2$:" /></span>
              <span><MathText text="$(760;\\, 60;\\, 10)$" /></span>
            </div>

            {st.calcStepsOp > 0 && (
              <div
                style={{
                  marginTop: 6,
                  padding: "12px 18px",
                  backgroundColor: colors.bg,
                  borderRadius: 12,
                  fontSize: 22,
                  fontWeight: 600,
                  color: colors.muted,
                  opacity: st.calcStepsOp,
                }}
              >
                <div>• Trục Ox: 800 + (-40) = 760</div>
                <div>• Trục Oy: 0 + 60 = 60</div>
                <div>• Trục Oz: 0 + 10 = 10</div>
              </div>
            )}

            {st.safeStatusOp > 0 && (
              <div
                style={{
                  marginTop: 8,
                  padding: "12px 18px",
                  backgroundColor: tint(role.up, 0.16),
                  borderRadius: 12,
                  color: role.up,
                  fontSize: 24,
                  fontWeight: 800,
                  textAlign: "center",
                  opacity: st.safeStatusOp,
                }}
              >
                ✓ TÍNH TOÁN TỨC THÌ — HẠ CÁNH AN TOÀN
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

// ==========================================
// 3. TRẠNG THÁI CẢNH 2 (KHÔNG GIAN Oxyz & PHÉP TOÁN)
// ==========================================

export interface StScene2 {
  stageOp: number;
  axesOp: number;          // Hệ trục Oxyz
  unitVectorsOp: number;   // Vectơ đơn vị i, j, k
  vectorUOp: number;       // Vectơ u = (3; 4; 4)
  uStep: number;           // 0: u(x; y; z), 1: u ngắn gọn
  uDashedOp: number;       // Nét dóng toạ độ bám sát u
  vSlide: number;          // 0: ở gốc O, 1: tịnh tiến trượt sang ngọn u
  vectorVOp: number;       // Vectơ v = (2; 3; -1)
  vWalkStepsOp: number;    // Nét dóng bước đi của v
  sumFormulaOp: number;    // Thẻ công thức cộng
  sumVectorOp: number;     // Vectơ tổng u + v
  negVectorVOp: number;    // Vectơ đối -v
  diffVectorOp: number;    // Thẻ công thức trừ
  scalarKOp: number;       // Nhân số k: k*u
  // Tích vô hướng
  dotProductFormulaOp: number; // Khai triển 9 số hạng
  dotCrossTermsFadeOp: number; // 6 số hạng tích chéo = 0
  dotSquareTermsOp: number;    // 3 số hạng cùng trục = 1
  dotResultFormulaOp: number;  // u . v = x1x2 + y1y2 + z1z2
  // Độ dài & vuông góc
  lengthFormulaOp: number;     // |u| = sqrt(...)
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
  uStep: 0,
  uDashedOp: 0,
  vSlide: 0,
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
  perpendicularOp: 0,
  trapCompareCardOp: 0,
  summaryCardOp: 0,
};

export const Scene2: React.FC<{ st: StScene2 }> = ({ st }) => {
  if (st.stageOp <= 0) return null;

  // Tọa độ vector mẫu chuẩn hình học:
  const uPos: V3 = [3, 4, 4];
  const vPos: V3 = [2, 3, -1];
  const sumPos: V3 = [uPos[0] + vPos[0], uPos[1] + vPos[1], uPos[2] + vPos[2]]; // [5, 7, 3]
  const kuPos: V3 = [uPos[0] * 1.5, uPos[1] * 1.5, uPos[2] * 1.5];

  const PO = P3D([0, 0, 0]);
  const uTip = P3D(uPos);
  const uFloor = P3D([uPos[0], uPos[1], 0]);
  const uOnX = P3D([uPos[0], 0, 0]);
  const uOnY = P3D([0, uPos[1], 0]);

  // Hoạt hoạ tịnh tiến mượt mà của v: trượt từ gốc O sang ngọn u
  const vBase3 = lerp3([0, 0, 0], uPos, st.vSlide);
  const vBase = P3D(vBase3);
  const vTip = P3D(add3(vBase3, vPos));
  const vMid = mid(vBase, vTip);

  // Vectơ đối -v
  const negVTip = P3D(add3(uPos, [-vPos[0], -vPos[1], -vPos[2]]));
  const negVMid = mid(uTip, negVTip);

  // Đăng ký trục toạ độ và các đường nét chính làm vật cản để nhãn không bao giờ cắt qua
  const obstacles: Rect[] = [
    ...segmentObstacles(PO[0] - 40, PO[1] + 20, P3D([5.8, 0, 0])[0], P3D([5.8, 0, 0])[1], 6), // Trục Ox
    ...segmentObstacles(PO[0] + 20, PO[1], P3D([0, 7.6, 0])[0], P3D([0, 7.6, 0])[1], 6), // Trục Oy
    ...segmentObstacles(PO[0], PO[1] - 20, P3D([0, 0, 6.4])[0], P3D([0, 0, 6.4])[1], 6), // Trục Oz
  ];

  if (st.sumFormulaOp > 0 || st.dotProductFormulaOp > 0) {
    obstacles.push(textObstacle(1180, 120, 680, 720)); // Khu vực thẻ công thức góc phải
  }

  const labels: AutoLabelItem[] = [
    {
      id: "axis_x",
      phases: ["b03", "b04", "b05", "b06", "b07", "b08"],
      x: P3D([5.5, 0, 0])[0],
      y: P3D([5.5, 0, 0])[1],
      text: "$x$",
      color: role.main,
      opacity: st.axesOp,
      prefer: ["sw"],
    },
    {
      id: "axis_y",
      phases: ["b03", "b04", "b05", "b06", "b07", "b08"],
      x: P3D([0, 7.3, 0])[0],
      y: P3D([0, 7.3, 0])[1],
      text: "$y$",
      color: role.main,
      opacity: st.axesOp,
      prefer: ["n"],
    },
    {
      id: "axis_z",
      phases: ["b03", "b04", "b05", "b06", "b07", "b08"],
      x: P3D([0, 0, 6.2])[0],
      y: P3D([0, 0, 6.2])[1],
      text: "$z$",
      color: role.main,
      opacity: st.axesOp,
      prefer: ["n"],
    },
    {
      id: "origin_O",
      phases: ["b03", "b04", "b05", "b06", "b07", "b08"],
      x: PO[0] - 26,
      y: PO[1] - 18,
      text: "$O$",
      color: colors.muted,
      opacity: st.axesOp,
      prefer: ["nw"],
      size: 38,
    },
    {
      id: "vec_i",
      phases: ["b03"],
      x: P3D([1.2, 0, 0])[0],
      y: P3D([1.2, 0, 0])[1],
      text: "$\\vec{i}$",
      color: role.focus,
      opacity: st.unitVectorsOp,
      prefer: ["sw"],
    },
    {
      id: "vec_j",
      phases: ["b03", "b06", "b07"],
      x: P3D([0, 1.2, 0])[0],
      y: P3D([0, 1.2, 0])[1],
      text: "$\\vec{j}$",
      color: role.focus,
      opacity: st.unitVectorsOp,
      prefer: ["n"],
    },
    {
      id: "vec_k",
      phases: ["b03"],
      x: P3D([0, 0, 1.2])[0],
      y: P3D([0, 0, 1.2])[1],
      text: "$\\vec{k}$",
      color: role.focus,
      opacity: st.unitVectorsOp,
      prefer: ["e"],
    },
    {
      id: "vec_u_coords",
      phases: ["b03"],
      x: uTip[0],
      y: uTip[1],
      text: "$\\vec{u}(x;\\,y;\\,z)$",
      color: role.focus,
      opacity: st.vectorUOp * (1 - st.uStep),
      prefer: ["ne", "n"],
      size: 40,
    },
    {
      id: "vec_u",
      phases: ["b04", "b05", "b06", "b07", "b08"],
      x: uTip[0],
      y: uTip[1],
      text: "$\\vec{u}$",
      color: role.focus,
      opacity: st.vectorUOp * st.uStep,
      prefer: ["nw", "n"],
      size: 40,
    },
    {
      id: "vec_v",
      phases: ["b04"],
      x: vMid[0],
      y: vMid[1],
      text: "$\\vec{v}$",
      color: role.warn,
      opacity: st.vectorVOp,
      prefer: ["e", "ne"],
      size: 38,
    },
    {
      id: "vec_sum",
      phases: ["b04"],
      x: P3D(sumPos)[0],
      y: P3D(sumPos)[1],
      text: "$\\vec{u} + \\vec{v}$",
      color: role.up,
      opacity: st.sumVectorOp,
      prefer: ["ne", "e"],
      size: 40,
    },
    {
      id: "vec_neg_v",
      phases: ["b05"],
      x: negVMid[0],
      y: negVMid[1],
      text: "$-\\vec{v}$",
      color: role.warn,
      opacity: st.negVectorVOp,
      prefer: ["w", "sw"],
      size: 38,
    },
    {
      id: "vec_ku",
      phases: ["b05"],
      x: P3D(kuPos)[0],
      y: P3D(kuPos)[1],
      text: "$k\\vec{u}$",
      color: role.focus,
      opacity: st.scalarKOp,
      prefer: ["ne", "e"],
      size: 40,
    },
  ];

  // Vectơ vuông góc b08
  const pU = P3D([3.5, 0, 0]);
  const pV = P3D([0, 4.5, 0]);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: st.stageOp }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* Hệ trục tọa độ Oxyz */}
        {st.axesOp > 0 && (
          <g opacity={st.axesOp}>
            {/* Trục Ox, Oy, Oz chuẩn Arrow */}
            <Arrow a={PO} b={P3D([5.8, 0, 0])} color={role.main} w={3.5} arrowSize={13} />
            <Arrow a={PO} b={P3D([0, 7.6, 0])} color={role.main} w={3.5} arrowSize={13} />
            <Arrow a={PO} b={P3D([0, 0, 6.4])} color={role.main} w={3.5} arrowSize={13} />

            {/* Gốc O */}
            <Dot p={PO} r={6} color={role.main} />
          </g>
        )}

        {/* Vectơ đơn vị i, j, k */}
        {st.unitVectorsOp > 0 && (
          <g opacity={st.unitVectorsOp}>
            <Arrow a={PO} b={P3D([1, 0, 0])} color={role.focus} w={4.5} arrowSize={12} />
            <Arrow a={PO} b={P3D([0, 1, 0])} color={role.focus} w={4.5} arrowSize={12} />
            <Arrow a={PO} b={P3D([0, 0, 1])} color={role.focus} w={4.5} arrowSize={12} />
          </g>
        )}

        {/* Nét dóng toạ độ 3D bám sát đỉnh vectơ u (không vẽ khung hộp thừa) */}
        {st.uDashedOp > 0 && (
          <g opacity={st.uDashedOp}>
            <Seg a={uTip} b={uFloor} color={role.focus} w={2.5} dash="6 4" />
            <Seg a={uFloor} b={uOnX} color={role.main} w={2} dash="6 4" />
            <Seg a={uFloor} b={uOnY} color={role.main} w={2} dash="6 4" />
            <Dot p={uFloor} r={5} color={role.focus} />
          </g>
        )}

        {/* Vectơ u */}
        {st.vectorUOp > 0 && (
          <Arrow a={PO} b={uTip} color={role.focus} w={5.5} o={st.vectorUOp} arrowSize={16} />
        )}

        {/* Hoạt hoạ tịnh tiến vectơ v (trượt từ gốc O sang ngọn u) */}
        {st.vectorVOp > 0 && (
          <g opacity={st.vectorVOp}>
            {/* Vệt dời nét đứt mờ nối từ gốc O */}
            <Seg a={PO} b={vBase} color={role.warn} w={2.5} dash="6 4" o={st.vSlide * 0.75} />
            {/* Vectơ v đang trượt */}
            <Arrow a={vBase} b={vTip} color={role.warn} w={5} arrowSize={15} />
            <Dot p={vBase} r={5} color={role.warn} />
          </g>
        )}

        {/* Vectơ tổng u + v */}
        {st.sumVectorOp > 0 && (
          <Arrow a={PO} b={P3D(sumPos)} color={role.up} w={6} o={st.sumVectorOp} arrowSize={18} />
        )}

        {/* Vectơ đối -v */}
        {st.negVectorVOp > 0 && (
          <g opacity={st.negVectorVOp}>
            <Arrow a={uTip} b={negVTip} color={role.warn} w={5} arrowSize={15} />
            <Dot p={negVTip} r={5} color={role.warn} />
          </g>
        )}

        {/* Vectơ kéo dài k*u */}
        {st.scalarKOp > 0 && (
          <Arrow a={PO} b={P3D(kuPos)} color={role.focus} w={6} o={st.scalarKOp} arrowSize={18} />
        )}

        {/* Hai vectơ vuông góc minh hoạ b08 (sạch sẽ, không dính khung hộp cũ) */}
        {st.perpendicularOp > 0 && (
          <g opacity={st.perpendicularOp}>
            <Arrow a={PO} b={pU} color={role.focus} w={5.5} arrowSize={16} />
            <Arrow a={PO} b={pV} color={role.up} w={5.5} arrowSize={16} />
            <RightMark v={PO} d1={sub(pU, PO)} d2={sub(pV, PO)} s={28} color={role.up} />
          </g>
        )}
      </svg>

      {/* Nhãn neo tự động */}
      <AutoLabels items={labels} obstacles={obstacles} />

      {/* BẢNG CÔNG THỨC PHÉP CỘNG / TRỪ / NHÂN SỐ K */}
      {st.sumFormulaOp > 0 && (
        <Card
          group="sum-card"
          style={{
            right: 80,
            top: 180,
            width: 660,
            padding: "32px 36px",
            border: `2px solid ${role.focus}`,
            opacity: st.sumFormulaOp,
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800, color: role.focus, marginBottom: 14 }}>
            QUY TẮC CỘNG DỒN TỪNG TRỤC
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: colors.text, whiteSpace: "nowrap" }}>
              <MathText text="$\\vec{u} = x_1\\vec{i} + y_1\\vec{j} + z_1\\vec{k}$" />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: colors.text, whiteSpace: "nowrap" }}>
              <MathText text="$\\vec{v} = x_2\\vec{i} + y_2\\vec{j} + z_2\\vec{k}$" />
            </div>
            <div
              style={{
                marginTop: 4,
                padding: "12px 16px",
                backgroundColor: tint(role.up, 0.12),
                borderRadius: 14,
                border: `1.5px solid ${role.up}`,
                fontSize: 28,
                fontWeight: 800,
                color: role.up,
                whiteSpace: "nowrap",
              }}
            >
              <MathText text="$\\vec{u} + \\vec{v} = (x_1+x_2;\\, y_1+y_2;\\, z_1+z_2)$" />
            </div>

            {st.diffVectorOp > 0 && (
              <div
                style={{
                  padding: "12px 16px",
                  backgroundColor: tint(role.main, 0.08),
                  borderRadius: 14,
                  border: `1.5px solid ${role.main}`,
                  fontSize: 27,
                  fontWeight: 800,
                  color: colors.text,
                  whiteSpace: "nowrap",
                  opacity: st.diffVectorOp,
                }}
              >
                <MathText text="$\\vec{u} - \\vec{v} = (x_1-x_2;\\, y_1-y_2;\\, z_1-z_2)$" />
              </div>
            )}

            {st.scalarKOp > 0 && (
              <div
                style={{
                  padding: "12px 16px",
                  backgroundColor: tint(role.focus, 0.1),
                  borderRadius: 14,
                  border: `1.5px solid ${role.focus}`,
                  fontSize: 28,
                  fontWeight: 800,
                  color: role.focus,
                  whiteSpace: "nowrap",
                  opacity: st.scalarKOp,
                }}
              >
                <MathText text="$k\\vec{u} = (kx;\\, ky;\\, kz)$" />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* BẢNG CÔNG THỨC TÍCH VÔ HƯỚNG */}
      {st.dotProductFormulaOp > 0 && (
        <Card
          group="dot-card"
          style={{
            right: 80,
            top: 180,
            width: 700,
            padding: "32px 36px",
            border: `2px solid ${role.focus}`,
            opacity: st.dotProductFormulaOp,
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800, color: role.focus, marginBottom: 14 }}>
            BẢN CHẤT TÍCH VÔ HƯỚNG
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: colors.text, whiteSpace: "nowrap" }}>
              <MathText text="$\\vec{u} \\cdot \\vec{v} = (x_1\\vec{i} + y_1\\vec{j} + z_1\\vec{k}) \\cdot (x_2\\vec{i} + y_2\\vec{j} + z_2\\vec{k})$" />
            </div>

            {st.dotCrossTermsFadeOp > 0 && (
              <div
                style={{
                  padding: "12px 16px",
                  backgroundColor: tint(role.warn, 0.08),
                  borderRadius: 12,
                  border: `1.5px solid ${role.warn}`,
                  fontSize: 25,
                  fontWeight: 700,
                  color: role.warn,
                  opacity: st.dotCrossTermsFadeOp,
                  whiteSpace: "nowrap",
                }}
              >
                <span>6 cặp vuông góc: </span>
                <MathText text="$\\vec{i}\\cdot\\vec{j} = \\vec{j}\\cdot\\vec{k} = \\vec{k}\\cdot\\vec{i} = 0$" />
              </div>
            )}

            {st.dotSquareTermsOp > 0 && (
              <div
                style={{
                  padding: "12px 16px",
                  backgroundColor: tint(role.main, 0.08),
                  borderRadius: 12,
                  border: `1.5px solid ${role.main}`,
                  fontSize: 25,
                  fontWeight: 700,
                  color: colors.text,
                  opacity: st.dotSquareTermsOp,
                  whiteSpace: "nowrap",
                }}
              >
                <span>3 cặp cùng trục: </span>
                <MathText text="$\\vec{i}^2 = \\vec{j}^2 = \\vec{k}^2 = 1$" />
              </div>
            )}

            {st.dotResultFormulaOp > 0 && (
              <div
                style={{
                  marginTop: 6,
                  padding: "14px 20px",
                  backgroundColor: tint(role.up, 0.12),
                  borderRadius: 14,
                  border: `2px solid ${role.up}`,
                  fontSize: 29,
                  fontWeight: 800,
                  color: role.up,
                  opacity: st.dotResultFormulaOp,
                  whiteSpace: "nowrap",
                }}
              >
                <MathText text="$\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2 + z_1 z_2$" />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* THẺ HỆ QUẢ ĐỘ DÀI & VUÔNG GÓC (b08) */}
      {st.lengthFormulaOp > 0 && (
        <Card
          group="length-card"
          style={{
            right: 80,
            top: 220,
            width: 660,
            padding: "32px 36px",
            border: `2px solid ${role.up}`,
            opacity: st.lengthFormulaOp,
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800, color: role.up, marginBottom: 14 }}>
            HỆ QUẢ TÍCH VÔ HƯỚNG
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: colors.text, whiteSpace: "nowrap" }}>
              <MathText text="$|\\vec{u}| = \\sqrt{x^2 + y^2 + z^2}$" />
            </div>

            {st.perpendicularOp > 0 && (
              <div
                style={{
                  marginTop: 6,
                  padding: "14px 18px",
                  backgroundColor: tint(role.up, 0.12),
                  borderRadius: 14,
                  border: `2px solid ${role.up}`,
                  fontSize: 27,
                  fontWeight: 800,
                  color: role.up,
                  opacity: st.perpendicularOp,
                  whiteSpace: "nowrap",
                }}
              >
                <MathText text="$\\vec{u} \\perp \\vec{v} \\Leftrightarrow x_1 x_2 + y_1 y_2 + z_1 z_2 = 0$" />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* THẺ BẪY THƯỜNG GẶP (ĐÚNG / SAI) */}
      {st.trapCompareCardOp > 0 && (
        <div
          data-box="trap-card"
          style={{
            position: "absolute",
            left: "50%",
            top: 220,
            transform: "translateX(-50%)",
            width: 860,
            padding: "36px 44px",
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
            border: `2.5px solid ${role.warn}`,
            opacity: st.trapCompareCardOp,
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 800, color: role.warn, textAlign: "center", marginBottom: 24 }}>
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
              <div style={{ fontSize: 24, fontWeight: 800, color: role.warn }}>
                SAI ✗ (Nhầm sang Vectơ)
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: colors.text, whiteSpace: "nowrap" }}>
                <MathText text="$\\vec{u} \\cdot \\vec{v} = (x_1 x_2;\\, y_1 y_2;\\, z_1 z_2)$" />
              </div>
              <div style={{ fontSize: 21, color: colors.muted }}>
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
              <div style={{ fontSize: 24, fontWeight: 800, color: role.up }}>
                ĐÚNG ✓ (Một con số thực)
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: role.up, whiteSpace: "nowrap" }}>
                <MathText text="$\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2 + z_1 z_2$" />
              </div>
              <div style={{ fontSize: 21, color: colors.muted }}>
                Kết quả là một số <MathText text="$\\in \\mathbb{R}$" />, không có ngoặc!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* THẺ TỔNG KẾT 4 PHÉP TOÁN */}
      {st.summaryCardOp > 0 && (
        <Card
          group="summary-card"
          style={{
            left: "50%",
            top: 200,
            transform: "translateX(-50%)",
            width: 920,
            padding: "36px 44px",
            border: `2.5px solid ${role.focus}`,
            opacity: st.summaryCardOp,
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 800, color: role.focus, textAlign: "center", marginBottom: 24 }}>
            BỐN PHÉP TOÁN VECTƠ BẰNG TOẠ ĐỘ
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", backgroundColor: colors.bg, borderRadius: 12, fontSize: 28, fontWeight: 700 }}>
              <span>Phép cộng:</span>
              <MathText text="$\\vec{u} + \\vec{v} = (x+x';\\, y+y';\\, z+z')$" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", backgroundColor: colors.bg, borderRadius: 12, fontSize: 28, fontWeight: 700 }}>
              <span>Phép trừ:</span>
              <MathText text="$\\vec{u} - \\vec{v} = (x-x';\\, y-y';\\, z-z')$" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", backgroundColor: colors.bg, borderRadius: 12, fontSize: 28, fontWeight: 700 }}>
              <span>Nhân số k:</span>
              <MathText text="$k\\vec{u} = (kx;\\, ky;\\, kz)$" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", backgroundColor: tint(role.up, 0.14), borderRadius: 12, fontSize: 29, fontWeight: 800, color: role.up, border: `1.5px solid ${role.up}` }}>
              <span>Tích vô hướng:</span>
              <MathText text="$\\vec{u} \\cdot \\vec{v} = x x' + y y' + z z'$" />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
