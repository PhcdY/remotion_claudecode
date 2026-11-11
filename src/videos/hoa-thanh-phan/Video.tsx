import React from "react";
import { AbsoluteFill, Composition, Sequence, interpolate, useCurrentFrame } from "remotion";
import { BrandBackground } from "../../components/BrandFrame";
import { MathText, useKatexFonts } from "../../components/MathText";
import { ElectronBalance } from "../../components/chemistry/ElectronBalance";
import { NailInCopperSulfate } from "../../components/chemistry/NailInCopperSulfate";
import { OxidationFormula } from "../../components/chemistry/OxidationFormula";
import { RedoxRoleTable } from "../../components/chemistry/RedoxRoleTable";
import { ChemIntro, HERO_STACK } from "../../components/chemistry/ChemIntro";
import { ElementTile } from "../../components/chemistry/ElementTile";
import { MetalInWater } from "../../components/chemistry/MetalInWater";
import { PeriodicTable, periodicCell } from "../../components/chemistry/PeriodicTable";
import { LayoutProbe } from "../../components/LayoutProbe";
import { fadeIn } from "../../components/parts";
import { role } from "../../components/roles";
import { colors } from "../../components/theme";

// Phòng thử component Hóa (gói môn Hóa › mục 6–7). Không phải video đăng.
// 0 thumb (3 s) · 90 kim loại kiềm + nước (9 s) · 360 bảng tuần hoàn (5 s) · 510 ô nguyên tố (3 s).
// 600 đinh iron + CuSO4 · 720 số oxi hoá · 840 bảng vai trò · 960 cân electron.
// 1080–1229: THỬ CỠ NHỎ NHẤT / LỚN NHẤT của từng component (skill dung-video › quy tắc 4 — nghiệm thu component dùng chung).
//   1080 bảng 700 + 1000 · 1110 bảng 1740 có Z · 1140 ô nguyên tố 220/tên dài/340 · 1170 cốc hẹp + rộng · 1200 cốc đinh 400 + 560.
// Soát: node scripts/stills.mjs hoa-thanh-phan 0 130 200 330 470 560 700 800 940 1000 1070
// Nghiệm thu (phải 0 lỗi): node scripts/check-layout.mjs hoa-thanh-phan --frames 0,150,300,420,550,650,780,900,1020,1070,1095,1125,1155,1185,1215

const Thumb: React.FC = () => (
  <ChemIntro
    kicker="Bảng tuần hoàn"
    title="Vì sao có hàng và cột?"
    highlight={["hàng", "cột"]}
    hero={
      <PeriodicTable
        left={HERO_STACK.left + 170}
        top={HERO_STACK.top + 20}
        width={1400}
        showFBlock={false}
        symbols="highlighted"
        highlights={[
          { period: 3, color: colors.warn },
          { group: "IA", color: colors.brandIndigo },
        ]}
      />
    }
  />
);

const Metals: React.FC = () => (
  <AbsoluteFill>
    <MetalInWater metal="Li" left={190} top={230} width={440} start={20} indicator liquidLabel="nước + phenolphthalein" />
    <MetalInWater metal="Na" left={740} top={230} width={440} start={20} indicator liquidLabel="nước + phenolphthalein" />
    <MetalInWater metal="K" left={1290} top={230} width={440} start={20} indicator liquidLabel="nước + phenolphthalein" />
  </AbsoluteFill>
);

const T = { left: 180, top: 150, width: 1560 };
const Table: React.FC = () => {
  const fr = useCurrentFrame();
  const na = periodicCell("Na", T);
  return (
    <AbsoluteFill>
      <PeriodicTable
        {...T}
        dimOthers={0.55}
        highlights={[
          { period: 3, color: role.focus, opacity: fadeIn(fr, 10) },
          { group: "IA", color: colors.warn, opacity: fadeIn(fr, 40) },
        ]}
      />
      {/* ví dụ neo vào một ô: vòng tròn quanh Na */}
      <div
        data-deco
        style={{ position: "absolute", left: na.cx - na.size * 0.75, top: na.cy - na.size * 0.75, width: na.size * 1.5, height: na.size * 1.5, borderRadius: "50%", border: `4px solid ${colors.warn}`, opacity: fadeIn(fr, 70) }}
      />
    </AbsoluteFill>
  );
};

const Tile: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ElementTile symbol="Na" left={160} top={250} size={340} show={{ name: fadeIn(fr, 10), mass: fadeIn(fr, 30) }} focus="z" />
      <ElementTile symbol="P" left={620} top={250} size={340} color={colors.warn} />
      <PeriodicTable left={1060} top={300} width={720} symbols="highlighted" showFBlock={false} highlights={[{ cells: ["Na", "P"], color: role.focus }]} />
    </AbsoluteFill>
  );
};


const Nail: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill>
      <NailInCopperSulfate left={260} top={170} width={520} progress={interpolate(fr, [10, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <div data-text="label" style={{ position: "absolute", left: 860, top: 470, fontSize: 56, color: colors.text, fontFamily: "inherit" }}>
        <MathText text="$\ce{Fe + CuSO4 -> FeSO4 + Cu}$" />
      </div>
    </AbsoluteFill>
  );
};

const Formulas: React.FC = () => {
  const fr = useCurrentFrame();
  const show = { ox: fadeIn(fr, 10), sum: fadeIn(fr, 40) };
  return (
    <AbsoluteFill>
      <OxidationFormula left={200} top={170} parts={[{ el: "O", n: 2, ox: 0 }]} show={show} />
      <OxidationFormula left={900} top={170} parts={[{ el: "H", n: 2, ox: 1 }, { el: "S", ox: 6 }, { el: "O", n: 4, ox: -2 }]} show={show} focus={["S"]} />
      <OxidationFormula left={200} top={600} parts={[{ el: "S", ox: 6 }, { el: "O", n: 4, ox: -2 }]} charge={-2} show={show} focus={["S"]} />
      <OxidationFormula left={900} top={600} parts={[{ el: "N", ox: -3 }, { el: "H", n: 4, ox: 1 }]} charge={1} show={show} focus={["N"]} />
    </AbsoluteFill>
  );
};

const Roles: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <RedoxRoleTable
      left={360}
      top={170}
      reducer="$\ce{Fe}$"
      oxidant="$\ce{Cu^2+}$"
      rows={[1, fadeIn(fr, 10), fadeIn(fr, 25), fadeIn(fr, 40), fadeIn(fr, 55)]}
      trap={fr > 80}
    />
  );
};

const Balance: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <ElectronBalance
      left={460}
      top={260}
      give={6}
      take={6}
      giveLabel="$\ce{CO}$ nhường"
      takeLabel="$\ce{Fe2O3}$ nhận"
      show={{ give: fadeIn(fr, 10), take: fadeIn(fr, 60) }}
    />
  );
};

// --- Thử cỡ nhỏ nhất / lớn nhất (không dùng trong video; để check-layout bắt lỗi khi ai sửa component) ---
const StressTables: React.FC = () => (
  <AbsoluteFill>
    <PeriodicTable left={90} top={170} width={700} symbols="highlighted" highlights={[{ cells: ["Na", "Fe"], color: role.focus }, { group: "VIIA", color: colors.warn }]} />
    <PeriodicTable left={830} top={520} width={1000} showFBlock={false} symbols="highlighted" highlights={[{ period: 3, color: colors.warn }, { cells: ["K"], color: role.focus }]} />
  </AbsoluteFill>
);
const StressBigTable: React.FC = () => (
  <AbsoluteFill>
    <PeriodicTable left={90} top={200} width={1740} showFBlock={false} showZ highlights={[{ group: "IA", color: colors.brandIndigo }, { period: 3, color: colors.warn }]} />
  </AbsoluteFill>
);
const StressTiles: React.FC = () => (
  <AbsoluteFill>
    <ElementTile symbol="Na" left={120} top={300} size={220} />
    <ElementTile symbol="Pr" left={420} top={300} size={220} />
    <ElementTile symbol="Rf" left={800} top={300} size={260} showMass={false} />
    <ElementTile symbol="P" left={1260} top={300} size={340} focus="name" />
  </AbsoluteFill>
);
const StressBeakers: React.FC = () => (
  <AbsoluteFill>
    <MetalInWater metal="K" left={120} top={180} width={360} start={5} indicator liquidLabel="nước cất + vài giọt phenolphthalein" />
    <MetalInWater metal="Na" left={560} top={180} width={520} start={5} indicator liquidLabel="nước" />
    <NailInCopperSulfate left={1180} top={180} width={400} progress={0.5} />
  </AbsoluteFill>
);
const StressNail: React.FC = () => (
  <AbsoluteFill>
    <NailInCopperSulfate left={300} top={150} width={560} progress={1} />
    <MetalInWater metal="Li" left={1100} top={180} width={440} start={5} liquidLabel="dung dịch sau phản ứng có màu hồng nhạt" />
  </AbsoluteFill>
);

const Lab: React.FC = () => {
  useKatexFonts();
  return (
    <AbsoluteFill>
      <BrandBackground />
      <Sequence durationInFrames={90}>
        <Thumb />
      </Sequence>
      <Sequence from={90} durationInFrames={270}>
        <Metals />
      </Sequence>
      <Sequence from={360} durationInFrames={150}>
        <Table />
      </Sequence>
      <Sequence from={510} durationInFrames={90}>
        <Tile />
      </Sequence>
      <Sequence from={600} durationInFrames={120}>
        <Nail />
      </Sequence>
      <Sequence from={720} durationInFrames={120}>
        <Formulas />
      </Sequence>
      <Sequence from={840} durationInFrames={120}>
        <Roles />
      </Sequence>
      <Sequence from={960} durationInFrames={120}>
        <Balance />
      </Sequence>
      <Sequence from={1080} durationInFrames={30}>
        <StressTables />
      </Sequence>
      <Sequence from={1110} durationInFrames={30}>
        <StressBigTable />
      </Sequence>
      <Sequence from={1140} durationInFrames={30}>
        <StressTiles />
      </Sequence>
      <Sequence from={1170} durationInFrames={30}>
        <StressBeakers />
      </Sequence>
      <Sequence from={1200} durationInFrames={30}>
        <StressNail />
      </Sequence>
      {/* đo bố cục khi chạy check-layout --frames … (không ảnh hưởng render thường); chế độ chữ trong cảnh */}
      <div data-layout="scene" style={{ display: "none" }} />
      <LayoutProbe />
    </AbsoluteFill>
  );
};

export const HoaThanhPhanComposition: React.FC = () => (
  <Composition id="hoa-thanh-phan" component={Lab} durationInFrames={1230} fps={30} width={1920} height={1080} />
);
