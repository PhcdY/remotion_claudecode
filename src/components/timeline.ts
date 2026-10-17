import { ALL_FORMATS, Input, UrlSource } from "mediabunny";
import { staticFile } from "remotion";

// Hằng số nhịp (giây) — chỉnh ở đây.
export const FPS = 30;
export const INTRO = 1.6; // BrandIntro
export const LEAD_IN = 0.3;
export const GAP_LINE = 0.25;
export const GAP_BEAT = 0.6;
export const TAIL = 1.0;
export const OUTRO = 2.5; // BrandOutro

export type ScriptLine = { text: string; speak?: string };
export type ScriptBeat = {
  id: string;
  section: string;
  keyword: string;
  visual: string;
  lines: ScriptLine[];
};
export type Script = { slug: string; title: string; beats: ScriptBeat[] };

type ManifestLine = { beat: string; line: number; file: string; text: string };
type Manifest = { slug: string; lines: ManifestLine[] };

export type TLine = { text: string; startFrame: number; endFrame: number; audioSrc: string };
export type TBeat = { id: string; startFrame: number; endFrame: number; lines: TLine[] };
export type Timeline = { beats: TBeat[]; introFrames: number; outroStart: number; durationInFrames: number };

const getAudioDuration = async (src: string) => {
  const input = new Input({ formats: ALL_FORMATS, source: new UrlSource(src) });
  try {
    return await input.computeDuration();
  } finally {
    input.dispose();
  }
};

/** Đối chiếu script với manifest, đo độ dài audio, tính timeline. */
export const buildTimeline = async (script: Script): Promise<Timeline> => {
  const base = `audio/${script.slug}`;
  const res = await fetch(staticFile(`${base}/manifest.json`));
  if (!res.ok) throw new Error(`Không đọc được ${base}/manifest.json — chạy B2 (scripts/tts.py) trước.`);
  const manifest = (await res.json()) as Manifest;

  const problems: string[] = [];
  const entries = script.beats.map((b) =>
    b.lines.map((l, i) => {
      const m = manifest.lines.find((x) => x.beat === b.id && x.line === i + 1);
      if (!m) problems.push(`${b.id} dòng ${i + 1}: thiếu trong manifest`);
      else if (m.text !== l.text) problems.push(`${b.id} dòng ${i + 1}: text lệch manifest`);
      return m;
    }),
  );
  if (problems.length) {
    throw new Error(`script.json không khớp audio, chạy lại B2:\n${problems.join("\n")}`);
  }

  const durations = await Promise.all(
    entries.map((beat) =>
      Promise.all(beat.map((m) => getAudioDuration(staticFile(`${base}/${(m as ManifestLine).file}`)))),
    ),
  );

  const f = (sec: number) => Math.round(sec * FPS);
  let t = INTRO + LEAD_IN;
  const beats: TBeat[] = script.beats.map((b, bi) => {
    if (bi > 0) t += GAP_BEAT;
    const lines = b.lines.map((l, li) => {
      if (li > 0) t += GAP_LINE;
      const start = t;
      t += durations[bi][li];
      return {
        text: l.text,
        startFrame: f(start),
        endFrame: f(t),
        audioSrc: staticFile(`${base}/${(entries[bi][li] as ManifestLine).file}`),
      };
    });
    return { id: b.id, startFrame: lines[0].startFrame, endFrame: 0, lines };
  });

  const introFrames = f(INTRO);
  const outroStart = f(t + TAIL);
  const durationInFrames = Math.ceil((t + TAIL + OUTRO) * FPS);
  // Beat kéo dài tới lúc beat sau bắt đầu (gồm khoảng nghỉ); beat đầu từ hết intro, beat cuối tới outro.
  beats.forEach((b, i) => {
    if (i === 0) b.startFrame = introFrames;
    b.endFrame = i + 1 < beats.length ? beats[i + 1].startFrame : outroStart;
  });

  return { beats, introFrames, outroStart, durationInFrames };
};
