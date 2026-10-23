import { Audio } from "@remotion/media";
import React from "react";
import { CalculateMetadataFunction, Sequence, useVideoConfig } from "remotion";
import { BeatProps, BeatShell, introFrames } from "./BeatShell";
import { BrandFrame, BrandIntro, BrandOutro } from "./BrandFrame";
import { LayoutProbe } from "./LayoutProbe";
import { useKatexFonts } from "./MathText";
import { colors, fontText } from "./theme";
import { Script, Timeline, buildTimeline } from "./timeline";

// Khung chung của một video giải thích (video mới từ 23/10/2026; video cũ giữ Video.tsx riêng).
// Một video chỉ cần: script.json, beats.tsx (mỗi beat một component), và vài dòng đăng ký Composition.

export type ExplainerProps = {
  timeline: Timeline | null;
  /** thư mục audio trong public/audio/ (bản giọng khác); mặc định = slug */
  audioDir?: string;
  /** chưa có audio: thời gian ước tính theo số ký tự speak (storyboard trước B2) */
  draft?: boolean;
};

export const explainerMetadata =
  (script: Script): CalculateMetadataFunction<ExplainerProps> =>
  async ({ props }) => {
    const timeline = await buildTimeline(script, props.audioDir, Boolean(props.draft));
    return { durationInFrames: timeline.durationInFrames, props: { ...props, timeline } };
  };

export const ExplainerVideo: React.FC<{
  script: Script;
  timeline: Timeline | null;
  beats: Record<string, React.FC<BeatProps>>;
  draft?: boolean;
  /** true: dải phụ đề kiểu cũ; mặc định chữ sống trong cảnh */
  subtitle?: boolean;
}> = ({ script, timeline, beats, draft = false, subtitle = false }) => {
  useKatexFonts();
  const { fps } = useVideoConfig();
  if (!timeline) return null;
  const sceneOf = (i: number) => script.beats[i]?.scene;

  return (
    <BrandFrame logoFrom={timeline.introFrames} logoUntil={timeline.outroStart}>
      <Sequence name="intro" durationInFrames={timeline.introFrames}>
        <BrandIntro title={script.title} />
      </Sequence>
      {timeline.beats.map((b, i) => {
        const Visual = beats[b.id];
        const sb = script.beats[i];
        if (!Visual) throw new Error(`Chưa có component cho beat ${b.id}`);
        const rel = b.lines.map((l) => ({ text: l.text, startFrame: l.startFrame - b.startFrame }));
        const scene = sceneOf(i);
        const sameAsPrev = scene !== undefined && scene === sceneOf(i - 1);
        const sameAsNext = scene !== undefined && scene === sceneOf(i + 1);
        return (
          <Sequence key={b.id} name={b.id} from={b.startFrame} durationInFrames={b.endFrame - b.startFrame}>
            <BeatShell
              section={sb.section}
              keyword={sb.keyword}
              lines={rel}
              subtitle={subtitle}
              sceneIn={!sameAsPrev}
              sceneOut={!sameAsNext}
            >
              <Visual
                L={rel.map((l) => l.startFrame)}
                E={b.lines.map((l) => l.endFrame - b.startFrame)}
                T0={introFrames(sb.section, fps)}
              />
            </BeatShell>
          </Sequence>
        );
      })}
      <Sequence name="outro" from={timeline.outroStart}>
        <BrandOutro />
      </Sequence>
      {timeline.beats.map((b) =>
        b.lines.map((l, li) =>
          l.audioSrc ? (
            <Sequence key={`${b.id}-a${li}`} name={`${b.id} audio ${li + 1}`} from={l.startFrame} layout="none">
              <Audio src={l.audioSrc} />
            </Sequence>
          ) : null,
        ),
      )}
      {draft ? <DraftBadge /> : null}
      <LayoutProbe />
    </BrandFrame>
  );
};

/** Góc trên phải khi dựng nháp: nhắc thời gian đang là ước tính. */
const DraftBadge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      right: 40,
      top: 40,
      padding: "4px 16px",
      borderRadius: 999,
      background: colors.warn,
      color: "#fff",
      fontFamily: fontText,
      fontWeight: 700,
      fontSize: 24,
    }}
  >
    NHÁP · thời gian ước tính
  </div>
);
