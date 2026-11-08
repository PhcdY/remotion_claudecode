import React from "react";
import {
  AbsoluteFill,
  Composition,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BrandBackground } from "../../components/BrandFrame";
import { MathText, useKatexFonts } from "../../components/MathText";
import { Atom } from "../../components/chemistry/Atom";
import { ChemicalBond } from "../../components/chemistry/ChemicalBond";
import { LabGlassware } from "../../components/chemistry/LabGlassware";
import { colors, fontText, halo, layout } from "../../components/theme";

// Header chung phong cách 9Study cho từng cảnh showcase
const SceneHeader: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => (
  <div style={{ position: "absolute", left: layout.side, top: 40, zIndex: 10 }}>
    <div
      style={{
        fontFamily: fontText,
        fontSize: 36,
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
          width: 12,
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
        fontSize: 21,
        color: colors.muted,
        marginTop: 6,
        marginLeft: 28,
        fontWeight: 600,
      }}
    >
      <MathText text={subtitle} />
    </div>
  </div>
);

// ============================================================================
// CẢNH 1: TAM GIÁC JOHNSTONE (ỐNG NGHIỆM VĨ MÔ & KÍNH LÚP SOI VI MÔ)
// ============================================================================
const Scene1Johnstone: React.FC = () => {
  const frame = useCurrentFrame();

  const liquidProgress = interpolate(frame, [0, 45], [0.35, 0.75], {
    extrapolateRight: "clamp",
  });
  const liquidColor = interpolate(frame, [10, 50], [0, 1], {
    extrapolateRight: "clamp",
  }) > 0.5 ? "#2563EB" : "#38BDF8";

  const lensZoom = interpolate(frame, [15, 45], [0.6, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <SceneHeader
        title="1. Tam giác Johnstone — Từ Vĩ mô (Ống nghiệm) soi sâu vào Vi mô"
        subtitle="Hiện tượng mắt thấy (đổi màu, bọt khí) được giải thích bằng chuyển động của ion và phân tử"
      />

      {/* SVG Canvas sân khấu chính */}
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        {/* 1. DỤNG CỤ THÍ NGHIỆM VĨ MÔ BÊN TRÁI */}
        <g transform="translate(420, 260)">
          <LabGlassware
            type="test-tube"
            x={0}
            y={0}
            width={120}
            height={460}
            liquidLevel={liquidProgress}
            liquidColor={liquidColor}
            liquidOpacity={0.7}
            bubbles={true}
            label="Ống nghiệm: Dung dịch đổi màu & sủi tọt"
          />

          {/* Vòng tròn tiêu điểm soi trên ống nghiệm */}
          <circle
            cx={0}
            cy={280}
            r={30}
            fill="none"
            stroke="#F59E0B"
            strokeWidth={3}
            strokeDasharray="6, 6"
          />

          {/* Đường gióng kính lúp sang vùng vi mô bên phải */}
          <line
            x1={30}
            y1={280}
            x2={420}
            y2={120}
            stroke="#CBD5E1"
            strokeWidth={2}
            strokeDasharray="4, 4"
          />
          <line
            x1={30}
            y1={280}
            x2={420}
            y2={440}
            stroke="#CBD5E1"
            strokeWidth={2}
            strokeDasharray="4, 4"
          />
        </g>

        {/* 2. CỬA SỔ KÍNH LÚP VI MÔ BÊN PHẢI (SUBMICROSCOPIC INSET) */}
        <g transform={`translate(1300, 540) scale(${lensZoom})`}>
          {/* Vành kính lúp */}
          <circle
            cx={0}
            cy={0}
            r={240}
            fill="#F8FAFC"
            stroke="#3B82F6"
            strokeWidth={6}
            style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.12))" }}
          />

          {/* Phân tử nước bao quanh */}
          {/* H2O phân tử 1 */}
          <g transform="translate(-110, -90)">
            <ChemicalBond from={{ x: 0, y: 0 }} to={{ x: -26, y: 24 }} width={4} />
            <ChemicalBond from={{ x: 0, y: 0 }} to={{ x: 26, y: 24 }} width={4} />
            <Atom element="O" x={0} y={0} scale={0.75} vibrate={1.2} />
            <Atom element="H" x={-26} y={24} scale={0.75} vibrate={1.2} />
            <Atom element="H" x={26} y={24} scale={0.75} vibrate={1.2} />
          </g>

          {/* H2O phân tử 2 */}
          <g transform="translate(120, 110)">
            <ChemicalBond from={{ x: 0, y: 0 }} to={{ x: -24, y: -26 }} width={4} />
            <ChemicalBond from={{ x: 0, y: 0 }} to={{ x: 26, y: -24 }} width={4} />
            <Atom element="O" x={0} y={0} scale={0.75} vibrate={1.2} />
            <Atom element="H" x={-24} y={-26} scale={0.75} vibrate={1.2} />
            <Atom element="H" x={26} y={-24} scale={0.75} vibrate={1.2} />
          </g>

          {/* Ion Cu2+ trung tâm phát sáng mạnh */}
          <Atom
            element="Cu"
            x={0}
            y={0}
            scale={1.25}
            charge="2+"
            glow="#3B82F6"
            vibrate={2}
            label="Ion Cu²⁺ (Hiđrat hóa)"
          />

          {/* Các nhóm OH- đang bay đến tiếp cận */}
          <Atom
            element="O"
            x={-120 + Math.sin(frame * 0.1) * 10}
            y={50}
            scale={0.9}
            charge="-"
            vibrate={1.5}
            glow="#EF4444"
          />
          <Atom
            element="O"
            x={110 - Math.sin(frame * 0.1) * 10}
            y={-60}
            scale={0.9}
            charge="-"
            vibrate={1.5}
            glow="#EF4444"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// CẢNH 2: BẢNG MÀU CPK QUỐC TẾ & HÌNH HỌC PHÂN TỬ
// ============================================================================
const Scene2CPKMolecules: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill>
      <SceneHeader
        title="2. Chuẩn màu CPK quốc tế & Cấu trúc hình học phân tử"
        subtitle="Nhận diện trực quan không cần nhãn: Carbon (xám than), Oxygen (đỏ), Hydrogen (trắng), Nitrogen (lam)"
      />

      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* PHÂN TỬ 1: NƯỚC (H2O - Góc gấp khúc 104.5 độ) */}
        <g transform={`translate(320, 560) scale(${spr})`}>
          <ChemicalBond from={{ x: 0, y: -20 }} to={{ x: -75, y: 55 }} width={8} />
          <ChemicalBond from={{ x: 0, y: -20 }} to={{ x: 75, y: 55 }} width={8} />
          <Atom element="O" x={0} y={-20} scale={1.3} glow="#EF4444" />
          <Atom element="H" x={-75} y={55} scale={1.2} />
          <Atom element="H" x={75} y={55} scale={1.2} />
          <text
            x={0}
            y={140}
            textAnchor="middle"
            fill="#1E293B"
            fontSize={22}
            fontWeight="bold"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            H₂O (Góc 104.5°)
          </text>
        </g>

        {/* PHÂN TỬ 2: KHÍ CACBONIC (CO2 - Thẳng hàng 180 độ, liên kết đôi) */}
        <g transform={`translate(740, 560) scale(${spr})`}>
          <ChemicalBond
            from={{ x: 0, y: 0 }}
            to={{ x: -110, y: 0 }}
            type="double"
            width={7}
          />
          <ChemicalBond
            from={{ x: 0, y: 0 }}
            to={{ x: 110, y: 0 }}
            type="double"
            width={7}
          />
          <Atom element="C" x={0} y={0} scale={1.3} />
          <Atom element="O" x={-110} y={0} scale={1.25} />
          <Atom element="O" x={110} y={0} scale={1.25} />
          <text
            x={0}
            y={140}
            textAnchor="middle"
            fill="#1E293B"
            fontSize={22}
            fontWeight="bold"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            CO₂ (Thẳng hàng 180°)
          </text>
        </g>

        {/* PHÂN TỬ 3: METHANE (CH4 - Tứ diện đều) */}
        <g transform={`translate(1160, 560) scale(${spr})`}>
          <ChemicalBond from={{ x: 0, y: 0 }} to={{ x: 0, y: -90 }} width={7} />
          <ChemicalBond from={{ x: 0, y: 0 }} to={{ x: -80, y: 60 }} width={7} />
          <ChemicalBond from={{ x: 0, y: 0 }} to={{ x: 80, y: 60 }} width={7} />
          <ChemicalBond from={{ x: 0, y: 0 }} to={{ x: -20, y: 85 }} width={7} type="ionic" />
          <Atom element="C" x={0} y={0} scale={1.3} glow="#334155" />
          <Atom element="H" x={0} y={-90} scale={1.05} />
          <Atom element="H" x={-80} y={60} scale={1.05} />
          <Atom element="H" x={80} y={60} scale={1.05} />
          <Atom element="H" x={-20} y={85} scale={0.9} />
          <text
            x={0}
            y={140}
            textAnchor="middle"
            fill="#1E293B"
            fontSize={22}
            fontWeight="bold"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            CH₄ (Tứ diện 109.5°)
          </text>
        </g>

        {/* PHÂN TỬ 4: ETHANOL (C2H5OH - Hữu cơ có nhóm chức -OH) */}
        <g transform={`translate(1580, 560) scale(${spr})`}>
          <ChemicalBond from={{ x: -90, y: 0 }} to={{ x: 0, y: 0 }} width={7} />
          <ChemicalBond from={{ x: 0, y: 0 }} to={{ x: 80, y: -30 }} width={7} />
          <ChemicalBond from={{ x: 80, y: -30 }} to={{ x: 135, y: 20 }} width={7} />
          {/* C1 */}
          <Atom element="C" x={-90} y={0} scale={1.15} />
          {/* C2 */}
          <Atom element="C" x={0} y={0} scale={1.15} />
          {/* Nhóm -OH */}
          <Atom element="O" x={80} y={-30} scale={1.2} glow="#EF4444" />
          <Atom element="H" x={135} y={20} scale={1.05} />
          <text
            x={20}
            y={140}
            textAnchor="middle"
            fill="#1E293B"
            fontSize={22}
            fontWeight="bold"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            C₂H₅OH (Ethanol)
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// CẢNH 3: CƠ CHẾ PHẢN ỨNG — VA CHẠM, BẺ GÃY & TÁI TẠO LIÊN KẾT (2H2 + O2 -> 2H2O)
// ============================================================================
const Scene3Reaction: React.FC = () => {
  const frame = useCurrentFrame();

  // Pha 1: Lao vào nhau va chạm (frame 0 -> 24)
  // Pha 2: Chớp sáng đứt liên kết (frame 24 -> 32)
  // Pha 3: Tái tổ hợp thành 2 phân tử nước bay ra (frame 32 -> 59)
  const isPreReaction = frame < 26;
  const isFlash = frame >= 24 && frame <= 30;

  // Tọa độ H2 phân tử A
  const h2Ax = interpolate(frame, [0, 24], [400, 850], { extrapolateRight: "clamp" });
  // Tọa độ H2 phân tử B
  const h2Bx = interpolate(frame, [0, 24], [400, 850], { extrapolateRight: "clamp" });
  // Tọa độ O2
  const o2x = interpolate(frame, [0, 24], [1450, 1070], { extrapolateRight: "clamp" });

  // Sau phản ứng: 2 phân tử H2O bay ra 2 phía
  const water1x = interpolate(frame, [30, 55], [960, 650], { extrapolateRight: "clamp" });
  const water1y = interpolate(frame, [30, 55], [540, 420], { extrapolateRight: "clamp" });
  const water2x = interpolate(frame, [30, 55], [960, 1270], { extrapolateRight: "clamp" });
  const water2y = interpolate(frame, [30, 55], [540, 660], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneHeader
        title="3. Cơ chế phản ứng — Va chạm, Bẻ gãy & Tái tạo liên kết"
        subtitle="2H₂ + O₂ → 2H₂O: Nguyên tử được bảo toàn, liên kết cũ bẻ gãy để tái tổ hợp bền vững hơn"
      />

      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* HIỆU ỨNG CHỚP SÁNG TỎA NHIỆT KHI VA CHẠM HOẠT HÓA */}
        {isFlash && (
          <circle
            cx={960}
            cy={540}
            r={180}
            fill="#FEF08A"
            opacity={0.8}
            style={{ filter: "blur(20px)" }}
          />
        )}

        {isPreReaction ? (
          // TRƯỚC PHẢN ỨNG: CHẤT THAM GIA ĐANG LAO VÀO VA CHẠM
          <>
            {/* Phân tử H2 thứ nhất */}
            <g transform={`translate(${h2Ax}, 440)`}>
              <ChemicalBond from={{ x: -28, y: 0 }} to={{ x: 28, y: 0 }} width={6} />
              <Atom element="H" x={-28} y={0} scale={1.1} />
              <Atom element="H" x={28} y={0} scale={1.1} />
            </g>

            {/* Phân tử H2 thứ hai */}
            <g transform={`translate(${h2Bx}, 640)`}>
              <ChemicalBond from={{ x: -28, y: 0 }} to={{ x: 28, y: 0 }} width={6} />
              <Atom element="H" x={-28} y={0} scale={1.1} />
              <Atom element="H" x={28} y={0} scale={1.1} />
            </g>

            {/* Phân tử O2 liên kết đôi */}
            <g transform={`translate(${o2x}, 540)`}>
              <ChemicalBond
                from={{ x: 0, y: -45 }}
                to={{ x: 0, y: 45 }}
                type="double"
                width={7}
              />
              <Atom element="O" x={0} y={-45} scale={1.3} glow="#EF4444" />
              <Atom element="O" x={0} y={45} scale={1.3} glow="#EF4444" />
            </g>
          </>
        ) : (
          // SAU PHẢN ỨNG: 2 PHÂN TỬ NƯỚC (H2O) HÌNH THÀNH VÀ BAY RA
          <>
            {/* Phân tử Nước 1 */}
            <g transform={`translate(${water1x}, ${water1y})`}>
              <ChemicalBond from={{ x: 0, y: -15 }} to={{ x: -55, y: 40 }} width={7} />
              <ChemicalBond from={{ x: 0, y: -15 }} to={{ x: 55, y: 40 }} width={7} />
              <Atom element="O" x={0} y={-15} scale={1.25} glow="#EF4444" />
              <Atom element="H" x={-55} y={40} scale={1.1} />
              <Atom element="H" x={55} y={40} scale={1.1} />
              <text
                x={0}
                y={95}
                textAnchor="middle"
                fill="#2563EB"
                fontSize={20}
                fontWeight="bold"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                H₂O (Mới tạo thành)
              </text>
            </g>

            {/* Phân tử Nước 2 */}
            <g transform={`translate(${water2x}, ${water2y})`}>
              <ChemicalBond from={{ x: 0, y: 15 }} to={{ x: -55, y: -40 }} width={7} />
              <ChemicalBond from={{ x: 0, y: 15 }} to={{ x: 55, y: -40 }} width={7} />
              <Atom element="O" x={0} y={15} scale={1.25} glow="#EF4444" />
              <Atom element="H" x={-55} y={-40} scale={1.1} />
              <Atom element="H" x={55} y={-40} scale={1.1} />
              <text
                x={0}
                y={85}
                textAnchor="middle"
                fill="#2563EB"
                fontSize={20}
                fontWeight="bold"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                H₂O (Mới tạo thành)
              </text>
            </g>
          </>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// CẢNH 4: PHẢN ỨNG OXI HÓA – KHỬ & CHUYỂN GIAO ELECTRON (Zn + Cu2+ -> Zn2+ + Cu)
// ============================================================================
const Scene4Redox: React.FC = () => {
  const frame = useCurrentFrame();

  const eProgress = interpolate(frame, [10, 38], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Tọa độ electron bắn theo đường cầu vồng từ Zn sang Cu
  const startX = 650;
  const endX = 1270;
  const currentEx = startX + (endX - startX) * eProgress;
  const arcY = 520 - Math.sin(eProgress * Math.PI) * 160;

  const znOx = eProgress > 0.85 ? "+2" : "0";
  const cuOx = eProgress > 0.85 ? "0" : "+2";
  const cuGlow = eProgress > 0.85 ? "#D97706" : "#2563EB";

  return (
    <AbsoluteFill>
      <SceneHeader
        title="4. Phản ứng Oxi hóa – Khử — Chuyển dịch hạt Electron"
        subtitle="Khử cho – O nhận: Kẽm nhường 2e (số oxh tăng), Đồng nhận 2e (số oxh giảm)"
      />

      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* Đường cung quỹ đạo bay của electron */}
        <path
          d="M 650 520 Q 960 200 1270 520"
          fill="none"
          stroke="#FCD34D"
          strokeWidth={3}
          strokeDasharray="8, 8"
          opacity={0.6}
        />

        {/* NGUYÊN TỬ KẼM (Zn) BÊN TRÁI - CHẤT KHỬ */}
        <g transform="translate(650, 520)">
          <Atom
            element="Zn"
            x={0}
            y={0}
            scale={1.5}
            oxidationState={znOx}
            label="Kẽm (Zn: Chất khử nhường 2e)"
          />
        </g>

        {/* ION ĐỒNG (Cu) BÊN PHẢI - CHẤT OXI HÓA */}
        <g transform="translate(1270, 520)">
          <Atom
            element="Cu"
            x={0}
            y={0}
            scale={1.5}
            oxidationState={cuOx}
            glow={cuGlow}
            label="Đồng (Cu: Chất oxi hóa nhận 2e)"
          />
        </g>

        {/* 2 HẠT ELECTRON (e-) PHÁT SÁNG BAY QUA */}
        {eProgress > 0 && eProgress < 1 && (
          <g transform={`translate(${currentEx}, ${arcY})`}>
            <circle cx={-12} cy={0} r={14} fill="#F59E0B" />
            <circle cx={12} cy={0} r={14} fill="#F59E0B" />
            <circle
              cx={0}
              cy={0}
              r={36}
              fill="#FBBF24"
              opacity={0.4}
              style={{ filter: "blur(6px)" }}
            />
            <text
              x={-12}
              y={5}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize={14}
              fontWeight="bold"
            >
              e⁻
            </text>
            <text
              x={12}
              y={5}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize={14}
              fontWeight="bold"
            >
              e⁻
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// CẢNH 5: THÍ NGHIỆM TRÁNG BẠC TOLLENS (LỚP GƯƠNG BẠC BÁM THÀNH ỐNG NGHIỆM)
// ============================================================================
const Scene5Tollens: React.FC = () => {
  const frame = useCurrentFrame();

  const mirrorProgress = interpolate(frame, [10, 48], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <SceneHeader
        title="5. Thí nghiệm thực nghiệm — Phản ứng tráng gương bạc Tollens"
        subtitle="R-CHO + 2[Ag(NH₃)₂]OH → Khử ion Ag⁺ tạo lớp gương bạc sáng bóng bám lên thành ống nghiệm"
      />

      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* ỐNG NGHIỆM BÊN TRÁI TRÁNG BẠC */}
        <g transform="translate(560, 260)">
          <LabGlassware
            type="test-tube"
            x={0}
            y={0}
            width={130}
            height={480}
            liquidLevel={0.7}
            liquidColor="#E2E8F0"
            liquidOpacity={0.5}
            bubbles={mirrorProgress > 0.3}
            mirrorLayer={{
              color: "#CBD5E1",
              thickness: mirrorProgress * 7,
            }}
            label="Ống nghiệm: Lớp bạc Ag phủ đều"
          />

          {/* Biểu tượng ngọn lửa đun nóng nhẹ */}
          <g transform="translate(0, 540)">
            <ellipse cx={0} cy={0} rx={16} ry={24} fill="#F97316" opacity={0.8} />
            <ellipse cx={0} cy={4} rx={10} ry={16} fill="#FACC15" />
            <text
              x={0}
              y={44}
              textAnchor="middle"
              fill="#EA580C"
              fontSize={16}
              fontWeight="bold"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Đun ấm nhẹ (t°)
            </text>
          </g>
        </g>

        {/* THUYẾT MINH & CÔNG THỨC BẢN CHẤT BÊN PHẢI */}
        <g transform="translate(1200, 480)">
          {/* Card giải thích cơ chế */}
          <rect
            x={-340}
            y={-140}
            width={680}
            height={280}
            rx={16}
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth={2}
            style={{ filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.06))" }}
          />

          <text
            x={0}
            y={-90}
            textAnchor="middle"
            fill="#1E293B"
            fontSize={24}
            fontWeight="bold"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Bản chất phản ứng tráng bạc
          </text>

          <text
            x={0}
            y={-45}
            textAnchor="middle"
            fill="#475569"
            fontSize={18}
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Aldehyde bị oxi hóa: R-CHO → R-COONH₄
          </text>

          <text
            x={0}
            y={-10}
            textAnchor="middle"
            fill="#059669"
            fontSize={19}
            fontWeight="bold"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Phức [Ag(NH₃)₂]⁺ bị khử: Ag⁺ + 1e → Ag (kết tủa bạc sáng)
          </text>

          <line x1={-280} y1={25} x2={280} y2={25} stroke="#E2E8F0" strokeWidth={1.5} />

          <text
            x={0}
            y={70}
            textAnchor="middle"
            fill="#2563EB"
            fontSize={21}
            fontWeight="bold"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            1 mol R-CHO sinh ra 2 mol Ag kim loại
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// COMPOSITION CHÍNH: 10 GIÂY = 300 FRAMES (5 CẢNH, MỖI CẢNH 60 FRAMES)
// ============================================================================
export const ChemistryShowcase: React.FC = () => {
  useKatexFonts();

  return (
    <AbsoluteFill>
      <BrandBackground />

      {/* Cảnh 1: Frames 0 - 59 (0.0s - 2.0s) */}
      <Sequence durationInFrames={60}>
        <Scene1Johnstone />
      </Sequence>

      {/* Cảnh 2: Frames 60 - 119 (2.0s - 4.0s) */}
      <Sequence from={60} durationInFrames={60}>
        <Scene2CPKMolecules />
      </Sequence>

      {/* Cảnh 3: Frames 120 - 179 (4.0s - 6.0s) */}
      <Sequence from={120} durationInFrames={60}>
        <Scene3Reaction />
      </Sequence>

      {/* Cảnh 4: Frames 180 - 239 (6.0s - 8.0s) */}
      <Sequence from={180} durationInFrames={60}>
        <Scene4Redox />
      </Sequence>

      {/* Cảnh 5: Frames 240 - 300 (8.0s - 10.0s) */}
      <Sequence from={240} durationInFrames={60}>
        <Scene5Tollens />
      </Sequence>
    </AbsoluteFill>
  );
};

export const ChemistryShowcaseComposition: React.FC = () => {
  return (
    <Composition
      id="chemistry-showcase"
      component={ChemistryShowcase}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
