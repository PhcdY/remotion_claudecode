import React from "react";
import { AutoLabelItem, AutoLabels, Rect, textObstacle } from "../../components/labels";
import { MathText } from "../../components/MathText";
import { lerp } from "../../components/parts";
import { role } from "../../components/roles";
import { colors, fontText, halo, tint } from "../../components/theme";

// ==========================================
// 1. HÌNH HỌC VÀ PHÉP CHIẾU 3D CHUẨN SGK TOÁN 12
// ==========================================

export type V3 = [number, number, number]; // [x: hoành, y: tung, z: cao]

// Tọa độ gốc O và góc phối cảnh chuẩn Cabinet/Cavalier:
// Trục Oy nằm ngang sang phải, Oz thẳng đứng lên trên, Ox xiên chéo 30° xuống phía trước-trái.
const OX = 680;
const OY = 720;
const K = 64; // px mỗi đơn vị
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

export const P3D = (v: V3): [number, number] => [
  OX - v[0] * K * COS30 + v[1] * K,
  OY + v[0] * K * SIN30 - v[2] * K,
];

// Helper tạo nhãn AutoLabel gọn gàng
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

// Component chữ cố định đẹp mắt
const Fixed: React.FC<{
  x: number;
  y: number;
  text: string;
  o: number;
  size?: number;
  color?: string;
  weight?: number;
  anchor?: "center" | "left" | "right";
}> = ({ x, y, text, o, size = 38, color = colors.text, weight = 700, anchor = "center" }) => {
  if (o <= 0) return null;
  const tr =
    anchor === "center"
      ? "-50% -50%"
      : anchor === "left"
      ? "0% -50%"
      : "-100% -50%";
  return (
    <div
      data-text="fixed"
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: tr,
        fontFamily: fontText,
        fontWeight: weight,
        fontSize: size,
        color,
        opacity: o,
        textShadow: halo(),
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}
    >
      <MathText text={text} />
    </div>
  );
};

// ==========================================
// 2. CÁC NÉT VẼ SVG 3D
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
      strokeOpacity={o}
      strokeDasharray={dash ? "10 8" : undefined}
      strokeLinecap="round"
    />
  );
};

const Arrow3D: React.FC<{
  a: V3;
  b: V3;
  t?: number;
  color: string;
  o?: number;
  w?: number;
  dash?: boolean;
  head?: number;
}> = ({ a, b, t = 1, color, o = 1, w = 4.5, dash, head = 22 }) => {
  if (o <= 0 || t <= 0.01) return null;
  const p1 = P3D(a);
  const target = P3D(b);
  const x1 = p1[0];
  const y1 = p1[1];
  const x2 = lerp(x1, target[0], t);
  const y2 = lerp(y1, target[1], t);
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 1) return null;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const H = Math.min(head, len * 0.5);
  const hx = x2 - ux * H;
  const hy = y2 - uy * H;
  const hw = H * 0.42;

  return (
    <g opacity={o}>
      <line
        x1={x1}
        y1={y1}
        x2={hx + ux * 2}
        y2={hy + uy * 2}
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
        strokeDasharray={dash ? "12 8" : undefined}
      />
      <polygon
        points={`${x2},${y2} ${hx - uy * hw},${hy + ux * hw} ${hx + uy * hw},${hy - ux * hw}`}
        fill={color}
      />
    </g>
  );
};

const RightAngleMark: React.FC<{
  o: [number, number];
  u: [number, number];
  v: [number, number];
  size?: number;
  color: string;
  op?: number;
}> = ({ o, u, v, size = 18, color, op = 1 }) => {
  if (op <= 0) return null;
  const p1 = [o[0] + u[0] * size, o[1] + u[1] * size];
  const p2 = [o[0] + (u[0] + v[0]) * size, o[1] + (u[1] + v[1]) * size];
  const p3 = [o[0] + v[0] * size, o[1] + v[1] * size];
  return (
    <path
      d={`M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]}`}
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      opacity={op}
    />
  );
};

const PlaneIcon: React.FC<{
  x: number;
  y: number;
  angle?: number;
  color: string;
  size?: number;
  op?: number;
}> = ({ x, y, angle = 0, color, size = 32, op = 1 }) => {
  if (op <= 0) return null;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle}) scale(${size / 24})`} opacity={op}>
      <path
        d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth={1}
      />
    </g>
  );
};

// ==========================================
// 3. ĐỊNH NGHĨA STATE CỦA 2 CẢNH
// ==========================================

export type StScene1 = {
  radarOp: number;
  planeA_t: number;
  planeB_t: number;
  planeLabelsOp: number; // Chỉ hiện khi máy bay đang bay vào (b01_l1)
  contactOp: number;      // 10:15 trùng khít (b01_l2)
  safeCircleOp: number;   // AN TOÀN (b01_l3)
  grid2DOp: number;       // Chuyển sang lưới Oxy (b02)
  coords2DOp: number;     // (40; 60) tại điểm giao (b02_l2)
  dist2DOp: number;       // Đông 40 km, Bắc 60 km (b02_l3)
};

export const ZERO1: StScene1 = {
  radarOp: 0,
  planeA_t: 0,
  planeB_t: 0,
  planeLabelsOp: 0,
  contactOp: 0,
  safeCircleOp: 0,
  grid2DOp: 0,
  coords2DOp: 0,
  dist2DOp: 0,
};

export type StScene2 = {
  // Sân khấu chính 3D
  stageOp: number;         // Độ mờ chung của toàn bộ trục 3D (giảm khi hiện Thẻ b10/b11)
  tiltTo3D: number;
  axesOxyOp: number;
  axisOzOp: number;
  rightAnglesOp: number;
  unitVectorsOp: number;
  unitLabelsOp: number;

  // Hai máy bay lơ lửng b03
  planesAB_b03Op: number;
  verticalArrowOp: number;

  // Điểm M và định nghĩa tọa độ b06
  pointMOp: number;
  walkStepX: number;
  walkStepY: number;
  walkStepZ: number;
  vectorOMOp: number;
  vecOMTextOp: number;

  // Hình hộp chữ nhật b07
  boxMeshOp: number;
  projectMprimeOp: number;
  zZeroOp: number;

  // Hai máy bay A và B b08, b09
  planesAB3DOp: number;
  planeCoordsOp: number;
  altitudesOp: number;
  diff300mOp: number;
  safeICAOOp: number;

  // Thẻ bài đề thi b10 và bẫy b11
  examCardOp: number;
  examAnswerOp: number;
  trapCardOp: number;

  // Tổng kết b12
  summaryAllOp: number;
};

export const ZERO2: StScene2 = {
  stageOp: 1,
  tiltTo3D: 0,
  axesOxyOp: 0,
  axisOzOp: 0,
  rightAnglesOp: 0,
  unitVectorsOp: 0,
  unitLabelsOp: 0,
  planesAB_b03Op: 0,
  verticalArrowOp: 0,
  pointMOp: 0,
  walkStepX: 0,
  walkStepY: 0,
  walkStepZ: 0,
  vectorOMOp: 0,
  vecOMTextOp: 0,
  boxMeshOp: 0,
  projectMprimeOp: 0,
  zZeroOp: 0,
  planesAB3DOp: 0,
  planeCoordsOp: 0,
  altitudesOp: 0,
  diff300mOp: 0,
  safeICAOOp: 0,
  examCardOp: 0,
  examAnswerOp: 0,
  trapCardOp: 0,
  summaryAllOp: 0,
};

// ==========================================
// 4. RENDER CẢNH 1 — MÀN HÌNH RADAR 2D
// ==========================================

export const Scene1: React.FC<{ st: StScene1 }> = ({ st }) => {
  // Gốc tọa độ Oxy 2D chuẩn và điểm giao máy bay
  const ox2d = 560;
  const oy2d = 780;
  // Điểm giao ứng với (40 km Đông, 60 km Bắc):
  // 40 km * 10 = 400px; 60 km * 4 = 240px
  const cx = ox2d + 400; // 960
  const cy = oy2d - 240; // 540

  // Máy bay A bay từ góc trên trái (600, 240) vào tâm (960, 540)
  const ax = lerp(600, cx, st.planeA_t);
  const ay = lerp(240, cy, st.planeA_t);

  // Máy bay B bay từ góc dưới phải (1320, 840) vào tâm (960, 540)
  const bx = lerp(1320, cx, st.planeB_t);
  const by = lerp(840, cy, st.planeB_t);

  const labels: AutoLabelItem[] = [
    // Nhãn 2 máy bay khi bắt đầu bay (b01_l1)
    lab("planeA", [ax, ay], "Chuyến bay A", st.planeLabelsOp, role.focus, {
      prefer: ["nw", "w"],
      phases: ["b01"],
    }),
    lab("planeB", [bx, by], "Chuyến bay B", st.planeLabelsOp, role.pairB, {
      prefer: ["se", "e"],
      phases: ["b01"],
    }),

    // Nhãn 10:15 trùng khít (b01_l2)
    lab("contact", [cx, cy], "10:15 trùng khít", st.contactOp, role.down, {
      prefer: ["n", "ne"],
      weight: 700,
      size: 38,
      phases: ["b01"],
    }),

    // Nhãn AN TOÀN (b01_l3)
    lab("safe", [cx, cy + 45], "AN TOÀN", st.safeCircleOp, role.up, {
      prefer: ["s", "se"],
      weight: 700,
      size: 36,
      phases: ["b01"],
    }),

    // Nhãn tọa độ (40; 60) tại điểm giao (b02_l2) — đặt chếch góc Đông Bắc xa điểm giao để không đè icon
    lab("coords2D", [cx + 50, cy - 35], "$(40; 60)$", st.coords2DOp, colors.text, {
      prefer: ["e", "ne"],
      weight: 700,
      size: 38,
      phases: ["b02"],
    }),

    // Nhãn 40 km hướng Đông (b02_l3)
    lab("distEast", [cx, oy2d], "Đông: $40\\text{ km}$", st.dist2DOp, role.focus, {
      prefer: ["s", "se"],
      weight: 600,
      phases: ["b02"],
    }),

    // Nhãn 60 km hướng Bắc (b02_l3)
    lab("distNorth", [ox2d, cy], "Bắc: $60\\text{ km}$", st.dist2DOp, role.focus, {
      prefer: ["w", "nw"],
      weight: 600,
      phases: ["b02"],
    }),
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* Khung màn hình Radar bo góc nền đậm sang trọng */}
        <rect
          x={360}
          y={100}
          width={1200}
          height={880}
          rx={28}
          fill="#0F172A"
          stroke="#334155"
          strokeWidth={4}
          opacity={st.radarOp}
        />

        {/* Các vòng tròn cự ly radar (mờ dần khi sang b02) */}
        {st.radarOp > 0 && st.grid2DOp < 0.95 && (
          <g opacity={st.radarOp * (1 - st.grid2DOp)}>
            {[120, 240, 360, 460].map((r, idx) => (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="#38BDF8"
                strokeWidth={1.5}
                strokeOpacity={0.25}
                strokeDasharray="6 6"
              />
            ))}
            <line x1={cx - 480} y1={cy} x2={cx + 480} y2={cy} stroke="#38BDF8" strokeWidth={1.5} strokeOpacity={0.3} />
            <line x1={cx} y1={cy - 420} x2={cx} y2={cy + 420} stroke="#38BDF8" strokeWidth={1.5} strokeOpacity={0.3} />
          </g>
        )}

        {/* Lưới tọa độ Oxy 2D phẳng b02 */}
        {st.grid2DOp > 0 && (
          <g opacity={st.grid2DOp}>
            {/* Lưới phụ nhẹ */}
            {[200, 400, 600].map((dx) => (
              <line key={dx} x1={ox2d + dx} y1={oy2d + 40} x2={ox2d + dx} y2={oy2d - 540} stroke="#334155" strokeWidth={1} strokeDasharray="4 4" />
            ))}
            {[120, 240, 360, 480].map((dy) => (
              <line key={dy} x1={ox2d - 40} y1={oy2d - dy} x2={ox2d + 760} y2={oy2d - dy} stroke="#334155" strokeWidth={1} strokeDasharray="4 4" />
            ))}

            {/* Trục Ox (Đông) */}
            <line x1={ox2d - 30} y1={oy2d} x2={ox2d + 780} y2={oy2d} stroke="#94A3B8" strokeWidth={3} />
            <polygon points={`${ox2d + 795},${oy2d} ${ox2d + 775},${oy2d - 7} ${ox2d + 775},${oy2d + 7}`} fill="#94A3B8" />

            {/* Trục Oy (Bắc) */}
            <line x1={ox2d} y1={oy2d + 30} x2={ox2d} y2={oy2d - 560} stroke="#94A3B8" strokeWidth={3} />
            <polygon points={`${ox2d},${oy2d - 575} ${ox2d - 7},${oy2d - 555} ${ox2d + 7},${oy2d - 555}`} fill="#94A3B8" />

            {/* Điểm gốc O */}
            <circle cx={ox2d} cy={oy2d} r={5} fill="#FFFFFF" />

            {/* Đường dóng vuông góc từ điểm giao xuống 2 trục */}
            <line x1={cx} y1={cy} x2={cx} y2={oy2d} stroke={role.focus} strokeWidth={2.5} strokeDasharray="8 6" />
            <line x1={cx} y1={cy} x2={ox2d} y2={cy} stroke={role.focus} strokeWidth={2.5} strokeDasharray="8 6" />

            {/* Dấu chấm trên 2 trục */}
            <circle cx={cx} cy={oy2d} r={7} fill={role.focus} />
            <circle cx={ox2d} cy={cy} r={7} fill={role.focus} />
          </g>
        )}

        {/* Vệt bay cắt chéo b01 */}
        {st.planeA_t > 0 && (
          <line x1={600} y1={240} x2={ax} y2={ay} stroke={role.focus} strokeWidth={3} strokeOpacity={0.4} strokeDasharray="6 4" />
        )}
        {st.planeB_t > 0 && (
          <line x1={1320} y1={840} x2={bx} y2={by} stroke={role.pairB} strokeWidth={3} strokeOpacity={0.4} strokeDasharray="6 4" />
        )}

        {/* Hai máy bay A & B — mờ dần khi chuyển sang hệ toạ độ phẳng b02 để lộ toạ độ rõ ràng */}
        <g opacity={Math.max(0, 1 - st.grid2DOp * 1.5)}>
          <circle cx={ax} cy={ay} r={8} fill={role.focus} filter="drop-shadow(0 0 8px #3D4AEF)" />
          <circle cx={bx} cy={by} r={8} fill={role.pairB} filter="drop-shadow(0 0 8px #C026D3)" />
          <PlaneIcon x={ax} y={ay} angle={40} color={role.focus} size={30} />
          <PlaneIcon x={bx} y={by} angle={-140} color={role.pairB} size={30} />
        </g>

        {/* Điểm giao toạ độ tại tâm (40; 60) lúc b02 */}
        {st.grid2DOp > 0 && (
          <circle cx={cx} cy={cy} r={7} fill={role.pairB} filter="drop-shadow(0 0 8px #C026D3)" opacity={st.grid2DOp} />
        )}

        {/* Vòng an toàn b01_l3 */}
        {st.safeCircleOp > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={54}
            fill="none"
            stroke={role.up}
            strokeWidth={4}
            strokeDasharray="8 6"
            opacity={st.safeCircleOp}
          />
        )}
      </svg>

      {/* Tên trục cố định không nhảy chỗ */}
      {st.grid2DOp > 0 && (
        <>
          <Fixed x={ox2d + 820} y={oy2d} text="$Ox\text{ (Đông)}$" o={st.grid2DOp} size={28} color="#94A3B8" anchor="left" />
          <Fixed x={ox2d + 30} y={oy2d - 575} text="$Oy\text{ (Bắc)}$" o={st.grid2DOp} size={28} color="#94A3B8" anchor="left" />
          <Fixed x={ox2d - 25} y={oy2d + 25} text="$O$" o={st.grid2DOp} size={32} color="#94A3B8" anchor="center" />
          <Fixed x={1480} y={145} text="Mặt phẳng $Oxy$" o={st.grid2DOp} size={32} color={role.focus} anchor="right" />
        </>
      )}

      <AutoLabels items={labels} />
    </div>
  );
};

// ==========================================
// 5. RENDER CẢNH 2 — KHÔNG GIAN BẦU TRỜI 3D
// ==========================================

export const Scene2: React.FC<{ st: StScene2 }> = ({ st }) => {
  const O: V3 = [0, 0, 0];
  const X_LEN = 6.2;
  const Y_LEN = 8.5;
  const Z_LEN = 6.5;

  // Điểm M cho định nghĩa b06
  const mx = 2.6;
  const my = 4.6;
  const mz = 4.0;
  const M: V3 = [mx, my, mz];
  const M_floor: V3 = [mx, my, 0];
  const P_x: V3 = [mx, 0, 0];
  const P_y: V3 = [0, my, 0];

  // Hai máy bay A và B lúc 10:15 trong 3D (b03, b08, b09, b12)
  // Đặt ở y = 6.6 để cách xa trục Oz hơn 300px, đảm bảo nhãn không bao giờ chạm trục
  const ab_x = 2.0;
  const ab_y = 6.6;
  const A_plane: V3 = [ab_x, ab_y, 3.2];
  const B_plane: V3 = [ab_x, ab_y, 5.0];
  const AB_floor: V3 = [ab_x, ab_y, 0];

  // Pixel tọa độ
  const [ox_px, oy_px] = P3D(O);
  const [m_px_x, m_px_y] = P3D(M);
  const [mf_px_x, mf_px_y] = P3D(M_floor);
  const [a_px_x, a_px_y] = P3D(A_plane);
  const [b_px_x, b_px_y] = P3D(B_plane);
  const [abf_px_x, abf_px_y] = P3D(AB_floor);
  const [xEnd_x, xEnd_y] = P3D([X_LEN, 0, 0]);
  const [yEnd_x, yEnd_y] = P3D([0, Y_LEN, 0]);
  const [zEnd_x, zEnd_y] = P3D([0, 0, Z_LEN]);

  // Vật cản khi có thẻ đề thi hoặc bẫy xuất hiện
  const obst: Rect[] = [];
  if (st.examCardOp > 0) {
    obst.push(textObstacle(1180, 160, 560, 360));
  }
  if (st.trapCardOp > 0) {
    obst.push(textObstacle(1180, 540, 560, 320));
  }

  // Danh sách nhãn AutoLabels chia theo từng phase độc lập (chỉ cho các chú thích ngữ cảnh)
  const labels: AutoLabelItem[] = [
    // b03: Hướng thẳng đứng
    lab("vertDir", P3D([0, 0, 3.5]), "Hướng thẳng đứng", st.verticalArrowOp, role.warn, {
      prefer: ["e", "ne"],
      phases: ["b03"],
    }),

    // b04: 3 dấu góc vuông
    lab("rightAnglesDesc", [ox_px + 80, oy_px - 80], "Ba trục đôi một vuông góc", st.rightAnglesOp, role.focus, {
      prefer: ["ne", "e"],
      weight: 700,
      phases: ["b04"],
    }),

    // b07: Hình hộp và hình chiếu M'
    lab("pointMprime", [mf_px_x, mf_px_y], "$M'(x; y; 0)$", st.projectMprimeOp, role.focus, {
      prefer: ["s", "se"],
      weight: 700,
      phases: ["b07"],
    }),
    lab("zZero", [mf_px_x + 10, (m_px_y + mf_px_y) / 2], "$z = 0$", st.zZeroOp, role.warn, {
      prefer: ["e", "ne"],
      phases: ["b07"],
    }),

    // b08: Toạ độ và độ cao chi tiết máy bay A và B
    lab("planeA_coord", [a_px_x, a_px_y], "$A(40; 60; 100)$", st.planeCoordsOp, role.focus, {
      prefer: ["e", "ne"],
      weight: 700,
      phases: ["b08"],
    }),
    lab("planeB_coord", [b_px_x, b_px_y], "$B(40; 60; 103)$", st.planeCoordsOp, role.pairB, {
      prefer: ["e", "ne"],
      weight: 700,
      phases: ["b08"],
    }),
    lab("altA", [a_px_x + 24, a_px_y + 10], "cao $10.000\\text{ m}$", st.altitudesOp, role.focus, {
      prefer: ["se", "e"],
      phases: ["b08"],
    }),
    lab("altB", [b_px_x + 24, b_px_y + 10], "cao $10.300\\text{ m}$", st.altitudesOp, role.pairB, {
      prefer: ["ne", "e"],
      phases: ["b08"],
    }),
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* Sân khấu hình học 3D */}
      <svg
        width={1920}
        height={1080}
        style={{
          position: "absolute",
          inset: 0,
          opacity: st.stageOp,
        }}
      >
        {/* Nền sàn tọa độ Oxy 3D */}
        <polygon
          points={`${ox_px},${oy_px} ${xEnd_x},${xEnd_y} ${P3D([X_LEN, Y_LEN, 0])[0]},${P3D([X_LEN, Y_LEN, 0])[1]} ${yEnd_x},${yEnd_y}`}
          fill={tint(role.focus, 0.05)}
          stroke={role.focus}
          strokeWidth={1.5}
          strokeDasharray="6 6"
          opacity={st.axesOxyOp}
        />

        {/* Lưới sàn phụ nhẹ */}
        {st.axesOxyOp > 0 &&
          [2, 4, 6].map((i) => (
            <React.Fragment key={i}>
              <Line3D a={[i, 0, 0]} b={[i, Y_LEN, 0]} color={role.focus} w={1} o={st.axesOxyOp * 0.2} />
              <Line3D a={[0, i, 0]} b={[X_LEN, i, 0]} color={role.focus} w={1} o={st.axesOxyOp * 0.2} />
            </React.Fragment>
          ))}

        {/* Trục Ox (hoành) và Oy (tung) */}
        {st.axesOxyOp > 0 && (
          <>
            <Arrow3D a={O} b={[X_LEN + 0.6, 0, 0]} color={colors.text} w={4.5} o={st.axesOxyOp} />
            <Arrow3D a={O} b={[0, Y_LEN + 0.6, 0]} color={colors.text} w={4.5} o={st.axesOxyOp} />
          </>
        )}

        {/* Trục Oz (cao) */}
        {st.axisOzOp > 0 && (
          <Arrow3D a={O} b={[0, 0, Z_LEN + 0.6]} color={role.focus} w={5} o={st.axisOzOp} />
        )}

        {/* Mũi tên hướng thẳng đứng ban đầu b03 */}
        {st.verticalArrowOp > 0 && (
          <Arrow3D a={[0, 0, 0.5]} b={[0, 0, 4.5]} color={role.warn} w={5.5} o={st.verticalArrowOp} />
        )}

        {/* 3 dấu góc vuông tại gốc O */}
        {st.rightAnglesOp > 0 && (
          <>
            <RightAngleMark o={P3D(O)} u={[-COS30, SIN30]} v={[1, 0]} size={22} color={colors.muted} op={st.rightAnglesOp} />
            <RightAngleMark o={P3D(O)} u={[1, 0]} v={[0, -1]} size={22} color={colors.muted} op={st.rightAnglesOp} />
            <RightAngleMark o={P3D(O)} u={[0, -1]} v={[-COS30, SIN30]} size={22} color={colors.muted} op={st.rightAnglesOp} />
          </>
        )}

        {/* Ba vectơ đơn vị i, j, k b05 */}
        {st.unitVectorsOp > 0 && (
          <>
            <Arrow3D a={O} b={[1, 0, 0]} color={role.focus} w={6.5} head={24} o={st.unitVectorsOp} />
            <Arrow3D a={O} b={[0, 1, 0]} color={role.pairA} w={6.5} head={24} o={st.unitVectorsOp} />
            <Arrow3D a={O} b={[0, 0, 1]} color={role.warn} w={6.5} head={24} o={st.unitVectorsOp} />
          </>
        )}

        {/* Đường đi ziczac 3 bước bằng VECTƠ có mũi tên b06 */}
        {st.walkStepX > 0 && (
          <Arrow3D a={O} b={P_x} color={role.focus} w={5.5} head={22} o={st.walkStepX} />
        )}
        {st.walkStepY > 0 && (
          <Arrow3D a={P_x} b={M_floor} color={role.pairA} w={5.5} head={22} o={st.walkStepY} />
        )}
        {st.walkStepZ > 0 && (
          <Arrow3D a={M_floor} b={M} color={role.warn} w={5.5} head={22} o={st.walkStepZ} />
        )}

        {/* Vectơ OM b06 */}
        {st.vectorOMOp > 0 && (
          <Arrow3D a={O} b={M} color={role.down} w={6} head={28} o={st.vectorOMOp} />
        )}

        {/* Khung hình hộp chữ nhật b07 */}
        {st.boxMeshOp > 0 && (
          <g opacity={st.boxMeshOp}>
            {/* Đáy trên */}
            <Line3D a={[0, 0, mz]} b={[mx, 0, mz]} color={colors.muted} w={2} dash o={0.5} />
            <Line3D a={[0, 0, mz]} b={[0, my, mz]} color={colors.muted} w={2} dash o={0.5} />
            <Line3D a={[mx, 0, mz]} b={M} color={colors.muted} w={2} dash o={0.6} />
            <Line3D a={[0, my, mz]} b={M} color={colors.muted} w={2} dash o={0.6} />

            {/* Các cột đứng */}
            <Line3D a={P_x} b={[mx, 0, mz]} color={colors.muted} w={2} dash o={0.5} />
            <Line3D a={P_y} b={[0, my, mz]} color={colors.muted} w={2} dash o={0.5} />
            <Line3D a={M_floor} b={M} color={role.focus} w={3.5} dash o={0.9} />
          </g>
        )}

        {/* Điểm M và hình chiếu M' */}
        {st.pointMOp > 0 && (
          <circle cx={m_px_x} cy={m_px_y} r={9} fill={role.down} filter="drop-shadow(0 0 10px #E5484D)" />
        )}
        {st.projectMprimeOp > 0 && (
          <circle cx={mf_px_x} cy={mf_px_y} r={8} fill={role.focus} stroke="#FFFFFF" strokeWidth={2} />
        )}

        {/* Máy bay A và B trong 3D b03 & b08-b09 */}
        {(st.planesAB_b03Op > 0 || st.planesAB3DOp > 0) && (
          <g opacity={Math.max(st.planesAB_b03Op, st.planesAB3DOp)}>
            {/* Cột thẳng đứng dóng chung xuống sàn */}
            <Line3D a={AB_floor} b={B_plane} color={role.warn} w={3.5} dash o={0.8} />
            <circle cx={abf_px_x} cy={abf_px_y} r={7} fill="#64748B" />

            {/* Máy bay A */}
            <circle cx={a_px_x} cy={a_px_y} r={9} fill={role.focus} filter="drop-shadow(0 0 8px #3D4AEF)" />
            <PlaneIcon x={a_px_x} y={a_px_y} angle={35} color={role.focus} size={30} />

            {/* Máy bay B */}
            <circle cx={b_px_x} cy={b_px_y} r={9} fill={role.pairB} filter="drop-shadow(0 0 8px #C026D3)" />
            <PlaneIcon x={b_px_x} y={b_px_y} angle={-145} color={role.pairB} size={30} />

            {/* Thước đo khoảng cách thẳng đứng 300m */}
            {st.diff300mOp > 0 && (
              <g opacity={st.diff300mOp}>
                <line x1={a_px_x + 24} y1={a_px_y} x2={b_px_x + 24} y2={b_px_y} stroke={role.warn} strokeWidth={4} />
                <line x1={a_px_x + 12} y1={a_px_y} x2={a_px_x + 36} y2={a_px_y} stroke={role.warn} strokeWidth={3} />
                <line x1={b_px_x + 12} y1={b_px_y} x2={b_px_x + 36} y2={b_px_y} stroke={role.warn} strokeWidth={3} />
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Tên trục và các nhãn toán học cố định không bị va chạm đè trục */}
      {st.axesOxyOp > 0 && (
        <>
          <Fixed x={xEnd_x - 35} y={xEnd_y + 25} text="$Ox$" o={st.axesOxyOp * st.stageOp} size={38} color={colors.text} anchor="center" />
          <Fixed x={yEnd_x + 35} y={yEnd_y} text="$Oy$" o={st.axesOxyOp * st.stageOp} size={38} color={colors.text} anchor="left" />
          {/* Gốc O đặt ở góc trên-trái (vùng trống giữa trục Oz và phần mở rộng Ox), cách xa góc giao để không chạm nét */}
          <Fixed x={ox_px - 48} y={oy_px - 32} text="$O$" o={st.axesOxyOp * st.stageOp} size={38} color={colors.text} anchor="center" />
        </>
      )}
      {st.axisOzOp > 0 && (
        <Fixed x={zEnd_x} y={zEnd_y - 35} text="$Oz$" o={st.axisOzOp * st.stageOp} size={38} color={role.focus} anchor="center" />
      )}

      {/* b03: Nhãn sàn Oxy và máy bay A, B trong không gian (cách xa icon và nét vẽ) */}
      {st.tiltTo3D > 0 && st.axisOzOp === 0 && (
        <Fixed x={P3D([3.2, 3.0, 0])[0]} y={P3D([3.2, 3.0, 0])[1]} text="Mặt phẳng $Oxy$" o={st.tiltTo3D * (1 - st.axisOzOp)} size={28} color={colors.muted} anchor="center" />
      )}
      {st.planesAB_b03Op > 0 && (
        <>
          <Fixed x={a_px_x + 50} y={a_px_y - 12} text="Máy bay A" o={st.planesAB_b03Op * st.stageOp} size={28} color={role.focus} anchor="left" />
          <Fixed x={b_px_x + 50} y={b_px_y - 12} text="Máy bay B" o={st.planesAB_b03Op * st.stageOp} size={28} color={role.pairB} anchor="left" />
        </>
      )}

      {/* b05: Ba vectơ đơn vị i, j, k (chuẩn SGK Toán 12, vecK đặt bên PHẢI trục Oz để cách biệt hoàn toàn với gốc O bên TRÁI) */}
      {st.unitLabelsOp > 0 && (
        <>
          <Fixed x={P3D([1.1, 0, 0])[0] - 32} y={P3D([1.1, 0, 0])[1] + 26} text="$\vec{i}$" o={st.unitLabelsOp * st.stageOp} size={34} color={role.focus} anchor="center" />
          <Fixed x={P3D([0, 1.0, 0])[0] + 15} y={P3D([0, 1.0, 0])[1] + 25} text="$\vec{j}$" o={st.unitLabelsOp * st.stageOp} size={34} color={role.pairA} anchor="center" />
          {/* vecK đặt ở bên phải trục Oz, cách trục 28px, tách biệt 100% với gốc O ở góc Tây Bắc */}
          <Fixed x={ox_px + 28} y={oy_px - 45} text="$\vec{k}$" o={st.unitLabelsOp * st.stageOp} size={34} color={role.warn} anchor="left" />
        </>
      )}

      {/* b06: Ba bước đi bộ bằng vectơ và công thức OM (đặt bên phải điểm M, KHÔNG bao giờ bị trục Oz đè qua) */}
      {st.walkStepX > 0 && st.vectorOMOp === 0 && (
        <Fixed x={P3D([mx * 0.4, 0, 0])[0] - 38} y={P3D([mx * 0.4, 0, 0])[1] + 32} text="$x\vec{i}$" o={st.walkStepX * st.stageOp} size={30} color={role.focus} anchor="center" />
      )}
      {st.walkStepY > 0 && st.vectorOMOp === 0 && (
        <Fixed x={P3D([mx, my * 0.5, 0])[0]} y={P3D([mx, my * 0.5, 0])[1] + 30} text="$y\vec{j}$" o={st.walkStepY * st.stageOp} size={30} color={role.pairA} anchor="center" />
      )}
      {st.walkStepZ > 0 && st.vectorOMOp === 0 && (
        <Fixed x={P3D([mx, my, mz * 0.5])[0] + 32} y={P3D([mx, my, mz * 0.5])[1]} text="$z\vec{k}$" o={st.walkStepZ * st.stageOp} size={30} color={role.warn} anchor="left" />
      )}

      {/* Điểm M và công thức vecOM: tách bạch theo phương đứng ở bên phải điểm M */}
      {st.pointMOp > 0 && (
        <Fixed x={m_px_x + 25} y={m_px_y + 12} text="$M(x; y; z)$" o={st.pointMOp * st.stageOp} size={32} color={role.down} anchor="left" />
      )}
      {st.vecOMTextOp > 0 && (
        <Fixed x={m_px_x + 32} y={m_px_y - 48} text="$\vec{OM} = x\vec{i} + y\vec{j} + z\vec{k}$" o={st.vecOMTextOp * st.stageOp} size={34} color={role.down} anchor="left" />
      )}

      {/* b09: Giải đáp ICAO — chỉ hiển thị 300m và chuẩn an toàn, các chữ cũ đã được ẩn */}
      {st.diff300mOp > 0 && (
        <Fixed x={a_px_x + 40} y={(a_px_y + b_px_y) / 2} text="$300\text{ m}$" o={st.diff300mOp * st.stageOp} size={36} color={role.warn} anchor="left" />
      )}
      {st.safeICAOOp > 0 && (
        <Fixed x={a_px_x + 40} y={b_px_y - 35} text="Chuẩn phân cách ICAO" o={st.safeICAOOp * st.stageOp} size={28} color={role.up} anchor="left" />
      )}

      {/* AutoLabels chỉ cho các yếu tố hình học ngữ cảnh */}
      <AutoLabels items={labels} obstacles={obst} />

      {/* ==================================================== */}
      {/* THẺ ĐỀ THI b10 (HTML Overlay biệt lập, sắc nét, không đè) */}
      {/* ==================================================== */}
      {st.examCardOp > 0 && (
        <div
          data-deco="true"
          style={{
            position: "absolute",
            right: 80,
            top: 190,
            width: 620,
            boxSizing: "border-box",
            background: "#FFFFFF",
            padding: "30px 36px",
            borderRadius: 24,
            border: `3px solid ${role.focus}`,
            boxShadow: "0 20px 40px -10px rgba(61, 74, 239, 0.15)",
            opacity: st.examCardOp,
          }}
        >
          <div style={{ color: role.focus, fontWeight: 800, fontSize: 24, letterSpacing: 1.2, marginBottom: 14 }}>
            TRONG ĐỀ THI
          </div>
          <div style={{ fontSize: 30, color: colors.text, fontWeight: 600, marginBottom: 16 }}>
            Cho điểm <MathText text="$M(2; -3; 5)$" />
          </div>
          <div style={{ fontSize: 26, color: colors.muted, lineHeight: 1.4, display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
            <span>Chiếu lên mặt phẳng</span>
            <span><MathText text="$(Oyz)\text{:}$" /></span>
          </div>

          <div style={{ marginTop: 20, minHeight: 60, display: "flex", alignItems: "center" }}>
            {st.examAnswerOp > 0 ? (
              <div
                style={{
                  background: tint(role.up, 0.1),
                  border: `2px solid ${role.up}`,
                  borderRadius: 14,
                  padding: "12px 20px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 34, fontWeight: 800, color: role.up }}>
                  <MathText text="$M_1(0; -3; 5)$" style={{ color: role.up }} />
                </span>
                <span style={{ fontSize: 28, color: role.up, fontWeight: 700 }}>✓</span>
              </div>
            ) : (
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 700,
                  color: role.warn,
                  background: tint(role.warn, 0.1),
                  padding: "8px 24px",
                  borderRadius: 12,
                }}
              >
                ?
              </div>
            )}
          </div>

          {st.examAnswerOp > 0 && (
            <div
              style={{
                marginTop: 20,
                fontSize: 24,
                color: role.up,
                fontWeight: 700,
                borderTop: "1px dashed #CBD5E1",
                paddingTop: 16,
              }}
            >
              Mẹo nhớ: Chiếu lên đâu, giữ chữ đó!
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* THẺ BẪY THƯỜNG GẶP b11 (HTML Overlay biệt lập, sạch sẽ) */}
      {/* ==================================================== */}
      {st.trapCardOp > 0 && (
        <div
          data-deco="true"
          style={{
            position: "absolute",
            right: 80,
            top: 190,
            width: 640,
            boxSizing: "border-box",
            background: "#FFFBEB",
            padding: "30px 36px",
            borderRadius: 24,
            border: `3px solid ${role.warn}`,
            boxShadow: "0 20px 40px -10px rgba(217, 119, 6, 0.15)",
            opacity: st.trapCardOp,
          }}
        >
          <div style={{ color: role.warn, fontWeight: 800, fontSize: 24, letterSpacing: 1.2, marginBottom: 14 }}>
            BẪY THƯỜNG GẶP
          </div>
          <div style={{ fontSize: 26, color: colors.text, fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
            <span>Chiếu</span>
            <span><MathText text="$M(2; -3; 5)$" /></span>
            <span>lên trục</span>
            <span><MathText text="$Ox\text{:}$" /></span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "18px 0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: tint(role.down, 0.08),
                border: `1.5px solid ${tint(role.down, 0.4)}`,
                borderRadius: 14,
                padding: "10px 18px",
              }}
            >
              <span style={{ fontSize: 25, color: colors.text, fontWeight: 600 }}>
                Chỉ ghi số <strong style={{ color: role.down, fontSize: 30, marginLeft: 4 }}>2</strong>
              </span>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: role.down,
                  background: tint(role.down, 0.18),
                  padding: "4px 12px",
                  borderRadius: 8,
                }}
              >
                SAI ✗
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: tint(role.up, 0.08),
                border: `1.5px solid ${tint(role.up, 0.4)}`,
                borderRadius: 14,
                padding: "10px 18px",
              }}
            >
              <span style={{ fontSize: 25, color: colors.text, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                <span>Tọa độ chuẩn:</span>
                <span style={{ fontSize: 30, fontWeight: 800, color: role.up }}>
                  <MathText text="$(2; 0; 0)$" style={{ color: role.up }} />
                </span>
              </span>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: role.up,
                  background: tint(role.up, 0.18),
                  padding: "4px 12px",
                  borderRadius: 8,
                }}
              >
                ĐÚNG ✓
              </span>
            </div>
          </div>

          <div
            style={{
              fontSize: 23,
              color: colors.text,
              fontWeight: 600,
              borderTop: "1px dashed #FDE68A",
              paddingTop: 16,
              lineHeight: 1.4,
            }}
          >
            Trong không gian 3D: Điểm luôn phải có đủ bộ ba con số!
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* THẺ TỔNG KẾT b12 (Cột bên phải, cân đối hoàn hảo) */}
      {/* ==================================================== */}
      {st.summaryAllOp > 0 && (
        <div
          data-deco="true"
          style={{
            position: "absolute",
            right: 80,
            top: 180,
            width: 680,
            boxSizing: "border-box",
            background: "#FFFFFF",
            padding: "30px 36px",
            borderRadius: 24,
            border: `3px solid ${role.focus}`,
            boxShadow: "0 20px 40px -10px rgba(61, 74, 239, 0.15)",
            opacity: st.summaryAllOp,
          }}
        >
          <div style={{ color: role.focus, fontWeight: 800, fontSize: 24, letterSpacing: 1.2, marginBottom: 16 }}>
            TỔNG KẾT BẢN CHẤT
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: colors.text,
              marginBottom: 16,
              whiteSpace: "nowrap",
            }}
          >
            <MathText text="$M(x; y; z) \Leftrightarrow \vec{OM} = x\vec{i} + y\vec{j} + z\vec{k}$" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: "1px dashed #CBD5E1", paddingTop: 16 }}>
            <div style={{ fontSize: 22, color: role.focus, fontWeight: 700, whiteSpace: "nowrap" }}>
              <MathText text="✓ Ba trục $Ox, Oy, Oz$ đôi một vuông góc" />
            </div>
            <div style={{ fontSize: 22, color: role.pairA, fontWeight: 700, whiteSpace: "nowrap" }}>
              <MathText text="✓ Ba thước đo chuẩn $\vec{i}, \vec{j}, \vec{k}$" />
            </div>
            <div style={{ fontSize: 22, color: role.up, fontWeight: 700, whiteSpace: "nowrap" }}>
              <MathText text="✓ Chiều cao $z$ độc lập hoàn toàn với mặt đất!" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
