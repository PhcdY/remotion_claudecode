import "./mhchem";
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MathText } from "../MathText";
import { colors, fontText, layout, tint } from "../theme";

/**
 * Ảnh mở đầu (thumb) cho video Hóa — gói môn Hóa › mục 6.
 * Thay BrandIntro (chỉ logo + một dòng chữ cùng màu). Có:
 *   1. HÌNH CHÍNH của đúng thứ ghi trong tiêu đề (bảng tuần hoàn, ống nghiệm, phân tử…) — đặt vào `hero`;
 *   2. tiêu đề ngắn, 1–2 TỪ KHÓA đổi màu + to hơn (`highlight`);
 *   3. hiện đủ ngay từ frame 0 (nền tảng hay lấy frame đầu làm ảnh bìa) — không fade-in.
 *
 * Dùng trong Video.tsx:
 *   <ExplainerVideo ... intro={<ChemIntro kicker="Bảng tuần hoàn" title="Vì sao có hàng và cột?" highlight={["hàng", "cột"]}
 *      hero={<PeriodicTable left={HERO_STACK.left + 170} top={HERO_STACK.top} width={1400} showFBlock={false} symbols="highlighted"
 *              highlights={[{ period: 3, color: colors.brandIndigo }, { group: "IA", color: colors.warn }]} />} />} />
 */

/** Vùng dành cho hình chính (toạ độ tuyệt đối) — layout "stack": chữ trên, hình dưới. */
export const HERO_STACK = { left: 90, top: 400, width: 1740, height: 620 };
/** layout "side": chữ trái, hình phải. */
export const HERO_SIDE = { left: 900, top: 140, width: 930, height: 880 };

/** Màu từ khóa mặc định: cam + chàm. Nền và logo đã mang thương hiệu, từ khóa được dùng màu nổi khác (không chỉ xanh brand). */
const DEFAULT_HL = [colors.warn, colors.brandIndigo, colors.c2];

type Seg = { text: string; hl: number };

/** Tách tiêu đề thành đoạn thường / đoạn từ khóa (không phân biệt hoa thường, khớp nguyên cụm). */
const splitTitle = (title: string, words: string[]): Seg[] => {
  const segs: Seg[] = [];
  const lower = title.toLowerCase();
  let i = 0;
  while (i < title.length) {
    let best = -1;
    let bestAt = title.length;
    words.forEach((w, k) => {
      const at = lower.indexOf(w.toLowerCase(), i);
      if (at >= 0 && at < bestAt) {
        bestAt = at;
        best = k;
      }
    });
    if (best < 0) {
      segs.push({ text: title.slice(i), hl: -1 });
      break;
    }
    if (bestAt > i) segs.push({ text: title.slice(i, bestAt), hl: -1 });
    segs.push({ text: title.slice(bestAt, bestAt + words[best].length), hl: best });
    i = bestAt + words[best].length;
  }
  return segs;
};

export const ChemIntro: React.FC<{
  /** dòng nhỏ phía trên: tên bài/chủ đề, vd. "Bảng tuần hoàn" (≤ 30 ký tự) */
  kicker?: string;
  /** câu hỏi chính, ngắn (≤ 40 ký tự), vd. "Vì sao có hàng và cột?" */
  title: string;
  /** 1–2 từ khóa nằm nguyên văn trong title */
  highlight: string[];
  /** màu từng từ khóa (mặc định cam, chàm) */
  highlightColors?: string[];
  /** hình chính, đặt bằng toạ độ tuyệt đối trong HERO_STACK / HERO_SIDE */
  hero: React.ReactNode;
  layout?: "stack" | "side";
}> = ({ kicker, title, highlight, highlightColors = DEFAULT_HL, hero, layout: mode = "stack" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const missing = highlight.filter((w) => !title.toLowerCase().includes(w.toLowerCase()));
  if (missing.length) throw new Error(`ChemIntro: từ khóa ${missing.join(", ")} không nằm trong title "${title}"`);
  const segs = splitTitle(title, highlight);
  const side = mode === "side";
  const titleFont = side ? 84 : 96;
  const box: React.CSSProperties = side
    ? { left: layout.side, top: 200, width: 760 }
    : { left: layout.side, right: layout.side, top: 130, textAlign: "center" };
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Img src={staticFile("brand/logo-horizontal.png")} style={{ position: "absolute", left: layout.side, top: layout.logoTop, height: layout.logoHeight }} />
      <div style={{ position: "absolute", ...box, fontFamily: fontText, color: colors.text }}>
        {kicker && (
          <div data-text="label" style={{ fontSize: 44, fontWeight: 700, color: colors.muted, marginBottom: 12 }}>
            <MathText text={kicker} />
          </div>
        )}
        <div data-text="title" style={{ fontSize: titleFont, fontWeight: 800, lineHeight: 1.15 }}>
          {segs.map((s, i) =>
            s.hl < 0 ? (
              <MathText key={i} text={s.text} />
            ) : (
              <span
                key={i}
                style={{
                  color: highlightColors[s.hl % highlightColors.length],
                  fontSize: titleFont * 1.18,
                  fontWeight: 900,
                  backgroundImage: `linear-gradient(transparent 68%, ${tint(highlightColors[s.hl % highlightColors.length], 0.2)} 68%)`,
                  padding: "0 6px",
                }}
              >
                <MathText text={s.text} />
              </span>
            ),
          )}
        </div>
      </div>
      {hero}
    </AbsoluteFill>
  );
};
