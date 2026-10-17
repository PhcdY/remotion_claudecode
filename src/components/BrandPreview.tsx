import React from "react";
import { Composition, Sequence, useCurrentFrame } from "remotion";
import { BeatShell, ramp } from "./BeatShell";
import { BrandFrame, BrandIntro, BrandOutro } from "./BrandFrame";
import { useKatexFonts } from "./MathText";
import { Axes, FunctionPlot, Plot, PlotLabel, Point, TangentLine, makeScale } from "./plot";
import { colors, fontText, shadow } from "./theme";
import { ZoomInset } from "./ZoomInset";

// Composition mẫu để duyệt khung chung (style.md). Không thuộc video nào.

const S = makeScale({ xMin: 0, xMax: 3.5, yMin: 0, yMax: 12, width: 760, height: 480 });
const sq = (x: number) => x * x;

const DemoVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const z = Math.pow(60, ramp(frame, 50, 170));
  return (
    <>
      <Plot
        scale={S}
        left={200}
        top={190}
        overlay={
          <PlotLabel scale={S} x={2} y={4} dx={-20} dy={-28} anchor="right" color={colors.accent}>
            A(2; 4)
          </PlotLabel>
        }
      >
        <Axes scale={S} xTicks={[1, 2, 3]} yTicks={[4, 8, 12]} />
        <FunctionPlot scale={S} f={sq} />
        <Point scale={S} x={2} y={4} />
      </Plot>
      <ZoomInset base={S} baseLeft={200} baseTop={190} f={sq} x0={2} y0={4} z={z} left={1150} top={190} width={560} height={420}>
        {(s) => <TangentLine scale={s} x0={2} y0={4} slope={4} color={colors.accent} width={4} opacity={ramp(frame, 150, 170)} />}
      </ZoomInset>
      <div
        data-text="card"
        style={{
          position: "absolute",
          left: 1150,
          top: 640,
          width: 560,
          padding: "14px 28px",
          background: colors.panel,
          border: `2px solid ${colors.panelBorder}`,
          borderRadius: 24,
          boxShadow: shadow,
          fontFamily: fontText,
          fontWeight: 600,
          fontSize: 36,
          color: colors.text,
          opacity: 0,
        }}
      />
    </>
  );
};

const BrandPreview: React.FC = () => {
  useKatexFonts();
  return (
    <BrandFrame logoFrom={48} logoUntil={300}>
      <Sequence durationInFrames={48}>
        <BrandIntro title="Đạo hàm thật ra đo cái gì?" />
      </Sequence>
      <Sequence from={48} durationInFrames={252}>
        <BeatShell
          section="TRONG ĐỀ THI"
          keyword="Nhìn đủ gần thì thẳng"
          lines={[
            { text: "Phóng to quanh điểm A, đường cong gần như thẳng.", startFrame: 40 },
            { text: "Độ dốc của đoạn thẳng ấy là $f'(2)=4$.", startFrame: 170 },
          ]}
        >
          <Sequence from={36} layout="none">
            <DemoVisual />
          </Sequence>
        </BeatShell>
      </Sequence>
      <Sequence from={300}>
        <BrandOutro />
      </Sequence>
    </BrandFrame>
  );
};

export const BrandPreviewComposition: React.FC = () => (
  <Composition id="brand-preview" component={BrandPreview} durationInFrames={360} fps={30} width={1920} height={1080} />
);
