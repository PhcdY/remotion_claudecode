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
import { AnatomyMap } from "../../components/biology/AnatomyMap";
import { StomaCell } from "../../components/biology/StomaCell";
import { HeartPump } from "../../components/biology/HeartPump";
import { NeuronSynapse } from "../../components/biology/NeuronSynapse";
import { DNAHelix } from "../../components/biology/DNAHelix";
import { colors, fontText, halo, layout } from "../../components/theme";

// Header chung phong cách 9Study cho từng cảnh showcase
const SceneHeader: React.FC<{ title: string; subtitle: string; tagColor?: string }> = ({
  title,
  subtitle,
  tagColor = colors.brandBlue,
}) => (
  <div style={{ position: "absolute", left: layout.side, top: 40, zIndex: 10 }}>
    <div
      style={{
        fontFamily: fontText,
        fontSize: 34,
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
          background: `linear-gradient(180deg, ${tagColor}, ${colors.brandIndigo})`,
        }}
      />
      <MathText text={title} />
    </div>
    <div
      style={{
        fontFamily: fontText,
        fontSize: 20,
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

// Hộp đúc kết quy luật ở đáy màn hình
const RuleCard: React.FC<{ text: string; color?: string }> = ({
  text,
  color = "#10B981",
}) => (
  <div
    style={{
      position: "absolute",
      bottom: 40,
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "rgba(255, 255, 255, 0.96)",
      backdropFilter: "blur(8px)",
      border: `2px solid ${color}`,
      boxShadow: "0 8px 24px rgba(14, 16, 70, 0.08)",
      padding: "12px 32px",
      borderRadius: 24,
      display: "flex",
      alignItems: "center",
      gap: 14,
      zIndex: 20,
    }}
  >
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}`,
      }}
    />
    <span
      style={{
        fontFamily: fontText,
        fontSize: 18,
        fontWeight: 800,
        color: colors.text,
        letterSpacing: "-0.01em",
      }}
    >
      <MathText text={text} />
    </span>
  </div>
);

// ============================================================================
// CẢNH 1: CƠ QUAN THỰC VẬT — CƠ CHẾ ĐÓNG MỞ KHÍ KHỔNG (0 - 3.3s)
// ============================================================================
const Scene1Stoma: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mở dần từ frame 10 đến 60
  const openProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  return (
    <AbsoluteFill>
      <SceneHeader
        title="1. Cơ quan Thực vật: Khí khổng & Thoát hơi nước"
        subtitle="Thành ngoài mỏng dãn dài kéo cong thành trong dày $\to$ Lỗ khí mở toang"
        tagColor="#10B981"
      />

      <AnatomyMap
        organ="leaf"
        label="Thực vật • Chiếc lá"
        subLabel="Biểu bì mặt dưới lá"
        highlightColor="#10B981"
      />

      <div
        style={{
          position: "absolute",
          top: 140,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <StomaCell openProgress={openProgress} width={700} height={520} />
      </div>

      <RuleCard
        text="Khi tế bào hút no nước: Thành ngoài căng phồng $\to$ kéo cong thành trong $\to$ Lỗ khí mở"
        color="#10B981"
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// CẢNH 2: CƠ QUAN ĐỘNG VẬT — CHU KÌ TIM & VAN MỘT CHIỀU (3.3 - 6.6s)
// ============================================================================
const Scene2Heart: React.FC = () => {
  const frame = useCurrentFrame();

  // Chu kì tim chạy liên tục theo frame
  const cycleProgress = (frame / 24) % 1;

  return (
    <AbsoluteFill>
      <SceneHeader
        title="2. Cơ quan Động vật: Chu kì Tim & Van một chiều"
        subtitle="Van nhĩ - thất sập khít khi tâm thất co, ngăn tuyệt đối dòng máu trào ngược"
        tagColor="#EF4444"
      />

      <AnatomyMap
        organ="heart"
        label="Hệ Tuần Hoàn • Quả Tim"
        subLabel="Chu kì tim 4 buồng (0.8s)"
        highlightColor="#EF4444"
      />

      <div
        style={{
          position: "absolute",
          top: 140,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <HeartPump cycleProgress={cycleProgress} width={680} height={540} />
      </div>

      <RuleCard
        text="Pha co thất ($0.3s$): Van nhĩ-thất đóng chặt, van tổ chim mở $\to$ Tống máu vào động mạch"
        color="#EF4444"
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// CẢNH 3: HỆ THẦN KINH & CẢM ỨNG — SYNAPSE VÀ XUNG ĐIỆN (6.6 - 10.0s)
// ============================================================================
const Scene3Synapse: React.FC = () => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [5, 60], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const dnaRotate = (frame * 0.02) % 1;

  return (
    <AbsoluteFill>
      <SceneHeader
        title="3. Hệ Thần Kinh & Di Truyền: Synapse Hóa Học & DNA"
        subtitle="Xung điện kích hoạt bọc hóa chất khuếch tán qua khe synapse để truyền tín hiệu"
        tagColor="#F59E0B"
      />

      <AnatomyMap
        organ="brain"
        label="Hệ Thần Kinh • Nơron"
        subLabel="Truyền tin qua Synapse"
        highlightColor="#F59E0B"
      />

      {/* Bên trái: Diễn hoạt Synapse truyền tin */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 120,
        }}
      >
        <NeuronSynapse progress={progress} width={680} height={500} />
      </div>

      {/* Bên phải: Cấu trúc xoắn kép DNA phân tử */}
      <div
        style={{
          position: "absolute",
          top: 150,
          right: 120,
        }}
      >
        <DNAHelix progress={dnaRotate} width={500} height={460} numBasePairs={8} />
      </div>

      <RuleCard
        text="Điện thế hoạt động ($+30mV$) $\to$ giải phóng Acetylcholine qua khe synapse $\to$ mở kênh thụ thể"
        color="#F59E0B"
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// ROOT SHOWCASE COMPONENT
// ============================================================================
export const BiologyShowcase: React.FC = () => {
  useKatexFonts();

  return (
    <AbsoluteFill>
      <BrandBackground />

      {/* Cảnh 1: Frames 0 - 99 (0.0s - 3.3s) - Chú ý không để from={0} để tuân thủ rule @remotion/from-0 */}
      <Sequence durationInFrames={100}>
        <Scene1Stoma />
      </Sequence>

      {/* Cảnh 2: Frames 100 - 199 (3.3s - 6.6s) */}
      <Sequence from={100} durationInFrames={100}>
        <Scene2Heart />
      </Sequence>

      {/* Cảnh 3: Frames 200 - 299 (6.6s - 10.0s) */}
      <Sequence from={200} durationInFrames={100}>
        <Scene3Synapse />
      </Sequence>
    </AbsoluteFill>
  );
};

export const BiologyShowcaseComposition: React.FC = () => {
  return (
    <Composition
      id="biology-showcase"
      component={BiologyShowcase}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
