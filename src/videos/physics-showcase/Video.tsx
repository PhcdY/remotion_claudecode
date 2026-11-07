import React from "react";
import { AbsoluteFill, Composition, interpolate, Sequence, useCurrentFrame } from "remotion";
import { BrandBackground } from "../../components/BrandFrame";
import { MathText, useKatexFonts } from "../../components/MathText";
import { EnergyVessel } from "../../components/physics/EnergyVessel";
import { ElasticBand, MotionTape, ThreadTrace } from "../../components/physics/PhysicalEmbodiments";
import { PhysicsSpring } from "../../components/physics/PhysicsSpring";
import { PhysicsVector } from "../../components/physics/PhysicsVector";
import { role } from "../../components/roles";
import { colors, fontText, halo, layout } from "../../components/theme";

// ============================================================================
// HEADER CHUNG CHO MỖI CẢNH SHOWCASE
// ============================================================================
const SceneHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div style={{ position: "absolute", left: layout.side, top: 40, zIndex: 10 }}>
    <div
      style={{
        fontFamily: fontText,
        fontSize: 38,
        fontWeight: 800,
        color: colors.text,
        textShadow: halo("#FFFFFF"),
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 14,
          height: 38,
          borderRadius: 4,
          background: `linear-gradient(180deg, ${colors.brandBlue}, ${colors.brandIndigo})`,
        }}
      />
      <MathText text={title} />
    </div>
    <div
      style={{
        fontFamily: fontText,
        fontSize: 22,
        color: colors.muted,
        marginTop: 6,
        marginLeft: 30,
        fontWeight: 600,
      }}
    >
      <MathText text={subtitle} />
    </div>
  </div>
);

// ============================================================================
// CẢNH 1: ĐỘNG HỌC — QUÃNG ĐƯỜNG & ĐỘ DỊCH CHUYỂN (QUỸ ĐẠO CONG MỀM MẠI)
// ============================================================================
// Catmull-Rom spline interpolation cho đường cong mềm mại tự nhiên
const cr = (p0: number, p1: number, p2: number, p3: number, t: number) =>
  0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);

const CTRL_PTS: [number, number][] = [
  [300, 680],
  [450, 520],
  [640, 740],
  [860, 480],
  [1080, 690],
  [1280, 440],
  [1520, 580],
];

const CURVE_PTS: { x: number; y: number }[] = [];
{
  const Q = [CTRL_PTS[0], ...CTRL_PTS, CTRL_PTS[CTRL_PTS.length - 1]];
  const SEG = 30;
  for (let i = 1; i < Q.length - 2; i++) {
    for (let k = 0; k < SEG; k++) {
      const t = k / SEG;
      CURVE_PTS.push({
        x: cr(Q[i - 1][0], Q[i][0], Q[i + 1][0], Q[i + 2][0], t),
        y: cr(Q[i - 1][1], Q[i][1], Q[i + 1][1], Q[i + 2][1], t),
      });
    }
  }
  CURVE_PTS.push({ x: CTRL_PTS[CTRL_PTS.length - 1][0], y: CTRL_PTS[CTRL_PTS.length - 1][1] });
}

const Scene1Kinematics: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 50], [0, 1], { extrapolateRight: "clamp" });

  const currentIndex = Math.min(
    Math.floor(progress * (CURVE_PTS.length - 1)),
    CURVE_PTS.length - 1
  );

  const activePoints = CURVE_PTS.slice(0, currentIndex + 1);
  const target = CURVE_PTS[currentIndex];
  const origin = CURVE_PTS[0];

  // Các mốc strobe đều đặn
  const strobeIndices = [0, 30, 60, 90, 120, 150];
  const strobePositions = strobeIndices
    .filter((idx) => idx <= currentIndex)
    .map((idx) => CURVE_PTS[idx]);

  return (
    <AbsoluteFill>
      <SceneHeader
        title="1. Động học: Quãng đường $s$ vs Độ dịch chuyển $\vec{d}$"
        subtitle="Quỹ đạo ngoằn ngoèo thực tế: Sợi chỉ uốn lượn $s$ chỉ có dài thêm — Dây chun căng thẳng $\vec{d}$ nối mốc với vật"
      />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* Sợi chỉ quãng đường mềm mại */}
        <ThreadTrace
          points={activePoints}
          spoolPosition={{ x: origin.x - 36, y: origin.y + 10 }}
          color={role.pairA}
          strokeWidth={6}
          label="Quãng đường $s$"
        />

        {/* Dây chun độ dịch chuyển */}
        <ElasticBand
          origin={origin}
          target={target}
          color={role.focus}
          strokeWidth={8}
          label="Độ dịch chuyển $\vec{d}$"
          pulseRate={0.4}
        />

        {/* Thước đo vệt chuyển động qua từng mốc thời gian */}
        <MotionTape positions={strobePositions} color={colors.text} />

        {/* Vật chính đang di chuyển */}
        <g transform={`translate(${target.x}, ${target.y})`}>
          <circle cx={0} cy={0} r={18} fill={role.main} stroke="#FFFFFF" strokeWidth={3} />
          <circle cx={0} cy={0} r={7} fill="#FFFFFF" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// CẢNH 2: ĐỘNG LỰC HỌC — PHÂN TÍCH LỰC (ANIMATION TỪNG BƯỚC KHÔNG DÍNH KHỐI)
// ============================================================================
const Scene2Forces: React.FC = () => {
  const frame = useCurrentFrame();

  const angleDeg = 30;
  const angleRad = (angleDeg * Math.PI) / 180;
  const rampOrigin = { x: 380, y: 780 };
  const rampLength = 980;
  const rampEnd = {
    x: rampOrigin.x + rampLength * Math.cos(angleRad),
    y: rampOrigin.y - rampLength * Math.sin(angleRad),
  };

  // Vật đặt tại vị trí đẹp trên mặt dốc
  const distOnRamp = 480;
  const blockCenter = {
    x: rampOrigin.x + distOnRamp * Math.cos(angleRad),
    y: rampOrigin.y - distOnRamp * Math.sin(angleRad) - 30,
  };

  // Phân tích lực theo tiến trình sư phạm (từng lực xuất hiện mượt mà)
  // Bước 1 (fr 5 - 18): Trọng lực P xuất hiện
  const pProg = interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Bước 2 (fr 20 - 32): Phân tích P thành Px và Py
  const compProg = interpolate(frame, [20, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Bước 3 (fr 34 - 44): Phản lực N xuất hiện cân bằng Py
  const nProg = interpolate(frame, [34, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Bước 4 (fr 46 - 56): Lực kéo Fk và ma sát Fms xuất hiện
  const fProg = interpolate(frame, [46, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneHeader
        title="2. Động lực học: Phân tích lực trên mặt phẳng nghiêng"
        subtitle="Dựng từng bước: Trọng lực $\vec{P} \to$ phân tích thành $(\vec{P}_x, \vec{P}_y) \to$ phản lực $\vec{N}$ cân bằng $\vec{P}_y \to$ lực kéo $\vec{F}_k$ và $\vec{F}_{ms}$"
      />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* Mặt phẳng nghiêng */}
        <polygon
          points={`${rampOrigin.x},${rampOrigin.y} ${rampEnd.x},${rampEnd.y} ${rampEnd.x},${rampOrigin.y}`}
          fill="#EBF1FE"
          stroke={colors.axis}
          strokeWidth={3}
        />
        {/* Ký hiệu góc nghiêng alpha = 30 độ */}
        <path
          d={`M ${rampOrigin.x + 80} ${rampOrigin.y} A 80 80 0 0 0 ${rampOrigin.x + 80 * Math.cos(angleRad)} ${rampOrigin.y - 80 * Math.sin(angleRad)}`}
          fill="none"
          stroke={colors.text}
          strokeWidth={2}
        />
        <text x={rampOrigin.x + 100} y={rampOrigin.y - 14} fontSize={22} fill={colors.text} fontWeight="bold">
          α = 30°
        </text>

        {/* Khối vật trượt */}
        <g transform={`translate(${blockCenter.x}, ${blockCenter.y}) rotate(${-angleDeg})`}>
          <rect
            x={-55}
            y={-30}
            width={110}
            height={60}
            rx={8}
            fill="#FFFFFF"
            stroke={colors.text}
            strokeWidth={3}
          />
          <text
            x={0}
            y={8}
            textAnchor="middle"
            fontFamily={fontText}
            fontSize={22}
            fontWeight="bold"
            fill={colors.text}
          >
            m
          </text>
        </g>

        {/* 1. Trọng lực P thẳng đứng hướng xuống */}
        <PhysicsVector
          from={blockCenter}
          length={180}
          angleDeg={90}
          color={role.warn}
          strokeWidth={7}
          label="\vec{P}"
          labelSide="right"
          progress={pProg}
          opacity={pProg}
        />

        {/* 2. Thành phần Py vuông góc mặt dốc */}
        <PhysicsVector
          from={blockCenter}
          length={180 * Math.cos(angleRad)}
          angleDeg={90 + angleDeg}
          color={role.warn}
          strokeWidth={5}
          dashed
          label="\vec{P}_y"
          labelSide="bottom"
          progress={compProg}
          opacity={compProg}
        />

        {/* 2. Thành phần Px dọc mặt dốc xuống dưới */}
        <PhysicsVector
          from={blockCenter}
          length={180 * Math.sin(angleRad)}
          angleDeg={180 - angleDeg}
          color={role.warn}
          strokeWidth={5}
          dashed
          label="\vec{P}_x"
          labelSide="bottom"
          progress={compProg}
          opacity={compProg}
        />

        {/* 3. Phản lực N cân bằng Py */}
        <PhysicsVector
          from={blockCenter}
          length={180 * Math.cos(angleRad)}
          angleDeg={-90 + angleDeg}
          color={role.pairB}
          strokeWidth={6}
          label="\vec{N}"
          labelSide="top"
          progress={nProg}
          opacity={nProg}
        />

        {/* 4. Lực ma sát Fms cản trở chuyển động */}
        <PhysicsVector
          from={blockCenter}
          length={70}
          angleDeg={180 - angleDeg}
          color={role.down}
          strokeWidth={5}
          label="\vec{F}_{ms}"
          labelSide="top"
          progress={fProg}
          opacity={fProg}
        />

        {/* 4. Lực kéo Fk kéo vật lên dốc */}
        <PhysicsVector
          from={blockCenter}
          length={220}
          angleDeg={-angleDeg}
          color={role.focus}
          strokeWidth={7}
          label="\vec{F}_k"
          labelSide="top"
          progress={fProg}
          opacity={fProg}
        />
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// CẢNH 3: DAO ĐỘNG ĐIỀU HÒA — CON LẮC LÒ XO & PHA
// ============================================================================
const Scene3Oscillation: React.FC = () => {
  const frame = useCurrentFrame();
  const omega = 0.12;
  const amplitude = 220;

  // Dao động x = A * cos(omega * t)
  const xOffset = amplitude * Math.cos(omega * frame);
  const velocity = -amplitude * omega * Math.sin(omega * frame);
  const acceleration = -amplitude * omega * omega * Math.cos(omega * frame);

  const vtcbX = 720;
  const centerY = 580;
  const blockX = vtcbX + xOffset;

  return (
    <AbsoluteFill>
      <SceneHeader
        title="3. Dao động điều hòa: Con lắc lò xo & Vectơ $\vec{v}, \vec{a}$"
        subtitle="Vận tốc $\vec{v}$ cực đại khi qua VTCB; Gia tốc $\vec{a}$ luôn hướng về VTCB và đổi chiều tại biên"
      />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* Trục tọa độ ngang Ox */}
        <line
          x1={260}
          y1={centerY + 60}
          x2={1180}
          y2={centerY + 60}
          stroke={colors.axis}
          strokeWidth={2}
        />
        {/* Vạch O (VTCB) */}
        <line
          x1={vtcbX}
          y1={centerY + 45}
          x2={vtcbX}
          y2={centerY + 75}
          stroke={colors.text}
          strokeWidth={3}
        />
        <text x={vtcbX} y={centerY + 105} textAnchor="middle" fontSize={22} fill={colors.text} fontWeight="bold">
          O (VTCB)
        </text>
        {/* Vạch -A và +A */}
        <line
          x1={vtcbX - amplitude}
          y1={centerY + 50}
          x2={vtcbX - amplitude}
          y2={centerY + 70}
          stroke={colors.muted}
          strokeWidth={2}
        />
        <text x={vtcbX - amplitude} y={centerY + 100} textAnchor="middle" fontSize={20} fill={colors.muted}>
          -A
        </text>
        <line
          x1={vtcbX + amplitude}
          y1={centerY + 50}
          x2={vtcbX + amplitude}
          y2={centerY + 70}
          stroke={colors.muted}
          strokeWidth={2}
        />
        <text x={vtcbX + amplitude} y={centerY + 100} textAnchor="middle" fontSize={20} fill={colors.muted}>
          +A
        </text>

        {/* Lò xo gắn tường */}
        <PhysicsSpring
          from={{ x: 260, y: centerY }}
          to={{ x: blockX - 35, y: centerY }}
          coils={12}
          width={32}
          color={colors.text}
          strokeWidth={4}
          hasWallMount
          wallSide="left"
        />

        {/* Khối vật m dao động */}
        <rect
          x={blockX - 35}
          y={centerY - 35}
          width={70}
          height={70}
          rx={10}
          fill={role.main}
          stroke={colors.text}
          strokeWidth={3}
        />
        <text
          x={blockX}
          y={centerY + 8}
          textAnchor="middle"
          fontSize={24}
          fill="#FFFFFF"
          fontWeight="bold"
        >
          m
        </text>

        {/* Vectơ vận tốc v */}
        <PhysicsVector
          from={{ x: blockX, y: centerY - 60 }}
          length={Math.abs(velocity) * 8}
          angleDeg={velocity >= 0 ? 0 : 180}
          color={role.focus}
          strokeWidth={6}
          label="\vec{v}"
          labelSide="top"
        />

        {/* Vectơ gia tốc a */}
        <PhysicsVector
          from={{ x: blockX, y: centerY + 60 }}
          length={Math.abs(acceleration) * 60}
          angleDeg={acceleration >= 0 ? 0 : 180}
          color={role.warn}
          strokeWidth={6}
          label="\vec{a}"
          labelSide="bottom"
        />

        {/* Vòng tròn pha lượng giác bên phải */}
        <g transform="translate(1500, 580)">
          <circle cx={0} cy={0} r={140} fill="#FFFFFF" stroke={colors.axis} strokeWidth={2} />
          <line x1={-160} y1={0} x2={160} y2={0} stroke={colors.axis} strokeWidth={2} />
          <line x1={0} y1={-160} x2={0} y2={160} stroke={colors.axis} strokeWidth={2} />
          {/* Bán kính quay */}
          <line
            x1={0}
            y1={0}
            x2={140 * Math.cos(omega * frame)}
            y2={-140 * Math.sin(omega * frame)}
            stroke={role.pairB}
            strokeWidth={4}
          />
          <circle
            cx={140 * Math.cos(omega * frame)}
            cy={-140 * Math.sin(omega * frame)}
            r={10}
            fill={role.pairB}
          />
          {/* Đường gióng hình chiếu xuống trục Ox */}
          <line
            x1={140 * Math.cos(omega * frame)}
            y1={-140 * Math.sin(omega * frame)}
            x2={140 * Math.cos(omega * frame)}
            y2={0}
            stroke={colors.axis}
            strokeDasharray="4 4"
            strokeWidth={2}
          />
          <circle cx={140 * Math.cos(omega * frame)} cy={0} r={8} fill={role.focus} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// CẢNH 4: BẢO TOÀN CƠ NĂNG — CHUẨN XÁC TOÁN HỌC (VẬT NẰM CHÍNH XÁC TRÊN MẶT TRƯỢT)
// ============================================================================
// Phương trình máng trượt parabol chuẩn (lòng chảo cong lên 2 bên):
// Đáy ở (x0, yBottom) = (680, 720), 2 mép ở độ cao y = 440
const TRACK_X0 = 680;
const TRACK_Y_BOTTOM = 720;
const TRACK_H = 280;
const TRACK_L = 360;
const BALL_R = 22;

const trackY = (x: number) => {
  const norm = (x - TRACK_X0) / TRACK_L;
  return TRACK_Y_BOTTOM - TRACK_H * (norm * norm);
};

const trackSlope = (x: number) => {
  return (-2 * TRACK_H * (x - TRACK_X0)) / (TRACK_L * TRACK_L);
};

const Scene4Energy: React.FC = () => {
  const frame = useCurrentFrame();

  // Dao động điều hòa của toạ độ x của quả bóng trong lòng chảo
  const t = frame * 0.1;
  const currentX = TRACK_X0 + (TRACK_L - 30) * Math.sin(t);
  const currentY = trackY(currentX);
  const slope = trackSlope(currentX);

  // Vectơ pháp tuyến hướng vào trong lòng chảo (hướng lên trên)
  const normLen = Math.hypot(slope, 1);
  const normX = slope / normLen;
  const normY = -1 / normLen; // trong hệ SVG, y hướng xuống nên hướng lên là -

  // Tâm quả bóng luôn nằm chính xác ở khoảng cách đúng bằng bán kính R bên trong lòng máng!
  const ballCenterX = currentX + normX * BALL_R;
  const ballCenterY = currentY + normY * BALL_R;

  // Tính tỉ lệ động năng: cực đại khi chạm đáy (currentY = 720), bằng 0 tại 2 mép dốc (currentY = 440)
  const kineticRatio = Math.max(0, Math.min(1, (currentY - (TRACK_Y_BOTTOM - TRACK_H)) / TRACK_H));

  // Vẽ đường máng cong parabol bằng 50 phân đoạn mượt
  const trackPathPoints: string[] = [];
  for (let step = 0; step <= 50; step++) {
    const px = TRACK_X0 - TRACK_L + (step / 50) * (2 * TRACK_L);
    const py = trackY(px);
    trackPathPoints.push(step === 0 ? `M ${px} ${py}` : `L ${px} ${py}`);
  }
  const trackPath = trackPathPoints.join(" ");

  // Hướng vectơ vận tốc tiếp tuyến với đường cong theo chiều chuyển động
  const vx = Math.cos(t);
  const tangentAngle = (Math.atan2(vx * slope, vx) * 180) / Math.PI;

  return (
    <AbsoluteFill>
      <SceneHeader
        title="4. Cơ năng: Chuyển hóa tuần hoàn giữa Động năng và Thế năng"
        subtitle="Quả bóng trượt tiếp tuyến chuẩn xác: Đáy máng $W_đ$ cực đại $\to$ Đỉnh dốc $W_t$ cực đại — Tổng $W = \text{const}$"
      />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* Máng cong trượt parabol chuẩn */}
        <path
          d={trackPath}
          fill="none"
          stroke={colors.axis}
          strokeWidth={6}
          strokeLinecap="round"
        />

        {/* Quả cầu trượt tiếp xúc mặt máng */}
        <circle
          cx={ballCenterX}
          cy={ballCenterY}
          r={BALL_R}
          fill={role.main}
          stroke={colors.text}
          strokeWidth={3}
        />

        {/* Vectơ vận tốc tiếp tuyến */}
        <PhysicsVector
          from={{ x: ballCenterX, y: ballCenterY }}
          length={kineticRatio * 150}
          angleDeg={tangentAngle}
          color={role.focus}
          strokeWidth={6}
          label="\vec{v}"
        />

        {/* Bình năng lượng 2 ngăn Wđ - Wt */}
        <EnergyVessel
          x={1400}
          y={400}
          width={220}
          height={320}
          kineticRatio={kineticRatio}
          kineticColor={role.focus}
          potentialColor={role.pairA}
        />
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// CẢNH 5: ĐIỆN TRƯỜNG & HẠT TĂNG TỐC (VECTƠ KHÔNG ĐÈ LÊN CHỮ q+)
// ============================================================================
const Scene5ElectricField: React.FC = () => {
  const frame = useCurrentFrame();
  const accel = interpolate(frame, [0, 50], [0, 1], { extrapolateRight: "clamp" });

  const startX = 530;
  const endX = 1420;
  const particleX = startX + (endX - startX) * (accel * accel); // chuyển động nhanh dần đều x ~ t^2
  const particleY = 560;
  const particleR = 24;

  return (
    <AbsoluteFill>
      <SceneHeader
        title="5. Điện trường đều: Tăng tốc hạt mang điện giữa hai bản tụ"
        subtitle="Lực điện $\vec{F} = q\vec{E}$ không đổi truyền gia tốc làm hạt chuyển động nhanh dần đều ($s \sim t^2$)"
      />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* Bản cực dương (+) bên trái */}
        <rect x={440} y={320} width={30} height={460} rx={6} fill="#E5484D" />
        {Array.from({ length: 6 }).map((_, i) => (
          <text key={i} x={455} y={380 + i * 70} textAnchor="middle" fill="#FFFFFF" fontSize={26} fontWeight="bold">
            +
          </text>
        ))}

        {/* Bản cực âm (-) bên phải */}
        <rect x={1450} y={320} width={30} height={460} rx={6} fill="#4B87F4" />
        {Array.from({ length: 6 }).map((_, i) => (
          <text key={i} x={1465} y={380 + i * 70} textAnchor="middle" fill="#FFFFFF" fontSize={30} fontWeight="bold">
            -
          </text>
        ))}

        {/* Các đường sức điện trường E song song cách đều */}
        {[380, 470, 560, 650, 740].map((lineY) => (
          <g key={lineY} opacity={0.65}>
            <line
              x1={480}
              y1={lineY}
              x2={1440}
              y2={lineY}
              stroke={colors.axis}
              strokeWidth={3}
              strokeDasharray="8 6"
            />
            {/* Mũi tên chỉ chiều E */}
            <polygon
              points={`1000,${lineY} 985,${lineY - 7} 985,${lineY + 7}`}
              fill={colors.axis}
            />
          </g>
        ))}
        <text x={960} y={360} textAnchor="middle" fontSize={26} fill={colors.axis} fontWeight="bold">
          Điện trường đều E
        </text>

        {/* Hạt mang điện q > 0 */}
        <circle cx={particleX} cy={particleY} r={particleR} fill={role.focus} stroke="#FFFFFF" strokeWidth={3} />
        <text
          x={particleX}
          y={particleY + 8}
          textAnchor="middle"
          fontSize={22}
          fill="#FFFFFF"
          fontWeight="bold"
        >
          q+
        </text>

        {/* Lực điện F = qE xuất phát từ mép ngoài của hạt, TUYỆT ĐỐI KHÔNG ĐÈ LÊN CHỮ q+ */}
        <PhysicsVector
          from={{ x: particleX + particleR, y: particleY }}
          length={140}
          angleDeg={0}
          color={role.focus}
          strokeWidth={7}
          label="\vec{F} = q\vec{E}"
          labelSide="top"
          originDot={false}
        />

        {/* Thước vệt gia tốc Strobe phía dưới */}
        <MotionTape
          positions={[
            { x: startX, y: 780 },
            { x: startX + 36, y: 780 },
            { x: startX + 144, y: 780 },
            { x: startX + 324, y: 780 },
            { x: startX + 576, y: 780 },
            { x: startX + 900, y: 780 },
          ]}
          color={colors.text}
        />
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// COMPOSITION CHÍNH: SHOWCASE VẬT LÍ (10 GIÂY = 300 FRAMES)
// ============================================================================
export const PhysicsShowcase: React.FC = () => {
  useKatexFonts();

  return (
    <AbsoluteFill>
      <BrandBackground />

      {/* Cảnh 1: Frames 0 - 59 (2 giây) */}
      <Sequence durationInFrames={60}>
        <Scene1Kinematics />
      </Sequence>

      {/* Cảnh 2: Frames 60 - 119 (2 giây) */}
      <Sequence from={60} durationInFrames={60}>
        <Scene2Forces />
      </Sequence>

      {/* Cảnh 3: Frames 120 - 179 (2 giây) */}
      <Sequence from={120} durationInFrames={60}>
        <Scene3Oscillation />
      </Sequence>

      {/* Cảnh 4: Frames 180 - 239 (2 giây) */}
      <Sequence from={180} durationInFrames={60}>
        <Scene4Energy />
      </Sequence>

      {/* Cảnh 5: Frames 240 - 299 (2 giây) */}
      <Sequence from={240} durationInFrames={60}>
        <Scene5ElectricField />
      </Sequence>
    </AbsoluteFill>
  );
};

export const PhysicsShowcaseComposition: React.FC = () => (
  <Composition
    id="physics-showcase"
    component={PhysicsShowcase}
    durationInFrames={300}
    fps={30}
    width={1920}
    height={1080}
  />
);
