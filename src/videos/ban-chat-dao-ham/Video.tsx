import { Audio } from "@remotion/media";
import React from "react";
import { Composition, Sequence, useVideoConfig } from "remotion";
import { BeatProps, BeatShell, introFrames } from "../../components/BeatShell";
import { BrandFrame, BrandIntro, BrandOutro } from "../../components/BrandFrame";
import { LayoutProbe } from "../../components/LayoutProbe";
import { useKatexFonts } from "../../components/MathText";
import { FPS } from "../../components/timeline";
import {
  Beat01,
  Beat02,
  Beat03,
  Beat04,
  Beat05,
  Beat06,
  Beat07,
  Beat08,
  Beat09,
  Beat10,
  Beat11,
  Beat12,
  Beat13,
  Beat14,
  Beat15,
  Beat16,
} from "./beats";
import { VideoProps, calculateMetadata, script } from "./timeline";

const BEATS: Record<string, React.FC<BeatProps>> = {
  b01: Beat01,
  b02: Beat02,
  b03: Beat03,
  b04: Beat04,
  b05: Beat05,
  b06: Beat06,
  b07: Beat07,
  b08: Beat08,
  b09: Beat09,
  b10: Beat10,
  b11: Beat11,
  b12: Beat12,
  b13: Beat13,
  b14: Beat14,
  b15: Beat15,
  b16: Beat16,
};

export const BanChatDaoHam: React.FC<VideoProps> = ({ timeline }) => {
  useKatexFonts();
  const { fps } = useVideoConfig();
  if (!timeline) return null;

  return (
    <BrandFrame logoFrom={timeline.introFrames} logoUntil={timeline.outroStart}>
      <Sequence name="intro" durationInFrames={timeline.introFrames}>
        <BrandIntro title={script.title} />
      </Sequence>
      {timeline.beats.map((b, i) => {
        const Visual = BEATS[b.id];
        const sb = script.beats[i];
        const rel = b.lines.map((l) => ({ text: l.text, startFrame: l.startFrame - b.startFrame }));
        return (
          <Sequence key={b.id} name={b.id} from={b.startFrame} durationInFrames={b.endFrame - b.startFrame}>
            <BeatShell section={sb.section} keyword={sb.keyword} lines={rel}>
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
        b.lines.map((l, li) => (
          <Sequence key={`${b.id}-a${li}`} name={`${b.id} audio ${li + 1}`} from={l.startFrame} layout="none">
            <Audio src={l.audioSrc} />
          </Sequence>
        )),
      )}
      <LayoutProbe />
    </BrandFrame>
  );
};

export const BanChatDaoHamComposition: React.FC = () => (
  <Composition
    id="ban-chat-dao-ham"
    component={BanChatDaoHam}
    durationInFrames={300}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{ timeline: null }}
    calculateMetadata={calculateMetadata}
  />
);
