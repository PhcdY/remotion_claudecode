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

export type ScriptLine = {
  text: string;
  speak?: string;
  caption?: string;
  /** nghỉ thêm sau dòng (giây), vd. sau câu hỏi đoán */
  pauseAfter?: number;
  /** thay đổi trên hình ở dòng này (định dạng mới) */
  show?: string;
  /** cụm từ trong speak: thay đổi `show` vào đúng lúc giọng nói tới cụm này */
  cue?: string;
};
export type ScriptBeat = {
  id: string;
  /** số cảnh (CẢNH n). Hai beat liền nhau cùng cảnh: hình không mờ đi ở ranh giới */
  scene?: number;
  section: string;
  keyword: string;
  visual: string;
  lines: ScriptLine[];
  /** khoảng nghỉ riêng giữa các dòng của beat (giây), vd. đoạn giải thích khó; mặc định GAP_LINE */
  lineGap?: number;
};
export type Script = { slug: string; title: string; beats: ScriptBeat[] };

type ManifestLine = { beat: string; line: number; file: string; text: string };
type Manifest = { slug: string; lines: ManifestLine[] };

/** Một từ của lời đọc, s: giây tính từ đầu file audio của dòng. */
export type Word = { w: string; s: number };
/** Từ của dòng trên timeline, f: frame tuyệt đối. */
export type TWord = { w: string; f: number };
export type TLine = { text: string; startFrame: number; endFrame: number; audioSrc: string; words: TWord[] };
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

/** Tốc độ đọc ước tính của giọng Vivibe (đo 19–22/10/2026), dùng cho timeline nháp. */
export const DRAFT_CHARS_PER_SEC = 20;

const STRIP = /^["'“”‘’([]+|["'“”‘’)\],.:;?!…]+$/g;

/** Tách từ của lời đọc — khớp speak_tokens trong scripts/align_words.py (sửa một bên thì sửa cả hai). */
export const speakTokens = (speak: string) => {
  const out: { w: string; syl: number }[] = [];
  for (const raw of speak.replace(/\.\.\./g, "…").split(/\s+/)) {
    const w = raw.replace(STRIP, "").toLowerCase();
    if (!w) continue;
    out.push({ w, syl: Math.max(1, w.split("-").filter(Boolean).length) });
  }
  return out;
};

/** Mốc từ ước tính (chưa căn audio): chia đều theo âm tiết trên độ dài dòng. */
const estimateWords = (speak: string, dur: number): Word[] => {
  const toks = speakTokens(speak);
  const total = toks.reduce((a, t) => a + t.syl, 0) || 1;
  let acc = 0;
  return toks.map((t) => {
    const s = 0.03 + ((dur - 0.06) * acc) / total;
    acc += t.syl;
    return { w: t.w, s };
  });
};

/** Vị trí từ đầu tiên của cụm `phrase` trong danh sách từ (-1 nếu không thấy). */
export const findPhrase = (words: { w: string }[], phrase: string) => {
  const p = speakTokens(phrase).map((t) => t.w);
  if (!p.length) return -1;
  for (let i = 0; i + p.length <= words.length; i++) {
    if (p.every((w, k) => words[i + k].w === w)) return i;
  }
  return -1;
};

/**
 * Đối chiếu script với manifest, đo độ dài audio, tính timeline.
 * audioDir: thư mục audio trong public/audio/ (mặc định = slug; khác slug khi dùng giọng khác).
 * draft: chưa có audio (storyboard trước B2) → độ dài mỗi dòng ước tính theo số ký tự `speak`, không có audioSrc.
 */
export const buildTimeline = async (script: Script, audioDir = script.slug, draft = false): Promise<Timeline> => {
  if (draft) {
    const durations = script.beats.map((b) =>
      b.lines.map((l) => Math.max(1, (l.speak ?? l.text).length / DRAFT_CHARS_PER_SEC)),
    );
    return layoutTimeline(script, durations, () => "", (bi, li, dur) => estimateWords(script.beats[bi].lines[li].speak ?? "", dur));
  }
  const base = `audio/${audioDir}`;
  const res = await fetch(staticFile(`${base}/manifest.json`));
  if (!res.ok) throw new Error(`Không đọc được ${base}/manifest.json — chạy B2 (skill tao-audio) trước.`);
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
  // mốc từng từ (scripts/align_words.py); thiếu thì ước tính theo âm tiết
  let aligned: Record<string, { words: Word[] }> = {};
  try {
    const wr = await fetch(staticFile(`${base}/words.json`));
    if (wr.ok) aligned = (await wr.json()) as Record<string, { words: Word[] }>;
  } catch {
    aligned = {};
  }
  return layoutTimeline(
    script,
    durations,
    (bi, li) => staticFile(`${base}/${(entries[bi][li] as ManifestLine).file}`),
    (bi, li, dur) => {
      const b = script.beats[bi];
      const key = `${b.id}-l${String(li + 1).padStart(2, "0")}`;
      const speak = b.lines[li].speak ?? "";
      const a = aligned[key]?.words;
      // words.json cũ (speak đã đổi) → số từ lệch → bỏ, dùng ước tính
      return a && a.length === speakTokens(speak).length ? a : estimateWords(speak, dur);
    },
  );
};

/** Xếp dòng/beat theo độ dài từng dòng (giây) và các khoảng nghỉ. */
const layoutTimeline = (
  script: Script,
  durations: number[][],
  audioSrc: (bi: number, li: number) => string,
  wordsOf: (bi: number, li: number, dur: number) => Word[],
): Timeline => {
  const f = (sec: number) => Math.round(sec * FPS);
  let t = INTRO + LEAD_IN;
  const beats: TBeat[] = script.beats.map((b, bi) => {
    if (bi > 0) t += GAP_BEAT;
    const lines = b.lines.map((l, li) => {
      if (li > 0) t += b.lineGap ?? GAP_LINE;
      const start = t;
      t += durations[bi][li];
      const line = {
        text: l.text,
        startFrame: f(start),
        endFrame: f(t),
        audioSrc: audioSrc(bi, li),
        words: wordsOf(bi, li, durations[bi][li]).map((w) => ({ w: w.w, f: f(start + w.s) })),
      };
      t += Math.min(Math.max(l.pauseAfter ?? 0, 0), 2);
      return line;
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
