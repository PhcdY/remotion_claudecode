import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MathText } from "../MathText";
import { colors } from "../theme";
import { fontQuote } from "./useVanQuoteFont";

/** Một cụm được bôi trong dòng. `at`: frame giọng đọc tới cụm; `off`: frame vệt bôi tắt (không có thì giữ). */
export type QuoteMark = { phrase: string; color: string; at: number; off?: number };

export type QuoteLine = {
  text: string;
  /** frame dòng hiện */
  from: number;
  /** frame dòng rút đi (không có thì giữ tới hết beat) */
  to?: number;
  /** hàng hiển thị, để dòng sau thế chỗ dòng đã rút */
  slot?: number;
  marks?: QuoteMark[];
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
const prog = (f: number, a: number, d: number) => interpolate(f, [a, a + d], [0, 1], { ...clamp, easing: ease });

type Segment = { text: string; mark?: QuoteMark };

const splitLine = (text: string, marks: QuoteMark[]) => {
  const found = marks
    .map((mark) => {
      const i = text.indexOf(mark.phrase);
      if (i < 0) throw new Error(`QuoteMarker: cụm bôi "${mark.phrase}" không có trong câu "${text}"`);
      return { mark, i };
    })
    .sort((a, b) => a.i - b.i);
  const out: Segment[] = [];
  let last = 0;
  for (const { mark, i } of found) {
    if (i < last) continue;
    if (i > last) out.push({ text: text.slice(last, i) });
    out.push({ text: mark.phrase, mark });
    last = i + mark.phrase.length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
};

/** Mức vệt bôi đang bật (0..1) tại frame f. */
const markLevel = (f: number, m: QuoteMark) => prog(f, m.at, 13) * (m.off === undefined ? 1 : 1 - prog(f, m.off, 10));

/**
 * Câu gốc theo cách "đọc, bôi, rút" (gói Văn › mục 3.4): dòng hiện theo giọng đọc, vệt màu chạy qua cụm key,
 * phần còn lại mờ đi, rồi cả dòng rút. Tối đa 2 dòng cùng lúc, mỗi dòng ≤ 35 ký tự: do kịch bản bảo đảm.
 */
export const QuoteMarker: React.FC<{
  lines: QuoteLine[];
  left?: number;
  top: number;
  width?: number;
  fontSize?: number;
  center?: boolean;
}> = ({ lines, left = 150, top, width = 1400, fontSize = 58, center = false }) => {
  const frame = useCurrentFrame();
  const rowHeight = Math.round(fontSize * 1.72);
  return (
    <>
      {lines.map((line, index) => {
        const enter = prog(frame, line.from, 12);
        const exit = line.to === undefined ? 0 : prog(frame, line.to, 13);
        const opacity = enter * (1 - exit);
        if (opacity <= 0) return null;
        const marks = line.marks ?? [];
        const dim = marks.reduce((max, m) => Math.max(max, markLevel(frame, m)), 0);
        return (
          <div
            key={`${line.text}-${index}`}
            style={{
              position: "absolute",
              left,
              top: top + (line.slot ?? index) * rowHeight,
              width,
              opacity,
              translate: `${-26 * exit}px ${(1 - enter) * 14}px`,
              textAlign: center ? "center" : "left",
              fontFamily: fontQuote,
              fontWeight: 600,
              fontSize,
              lineHeight: 1.26,
              color: colors.text,
              whiteSpace: "pre",
              textShadow: "0 0 18px rgba(255,255,255,.9), 0 0 5px rgba(255,255,255,.7)",
            }}
          >
            <span data-text="label" style={{ display: "inline-block", fontSize }}>
              {splitLine(line.text, marks).map((segment, i) => {
                if (!segment.mark) {
                  return <MathText key={i} text={segment.text} style={{ opacity: 1 - 0.58 * dim }} />;
                }
                const level = markLevel(frame, segment.mark);
                return (
                  <span
                    key={i}
                    style={{
                      backgroundImage: `linear-gradient(${segment.mark.color}, ${segment.mark.color})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: `${level * 100}% 70%`,
                      backgroundPosition: "0 74%",
                      borderRadius: 7,
                      padding: "0 8px",
                      margin: "0 -8px",
                      textShadow: level > 0.3 ? "none" : undefined,
                    }}
                  >
                    <MathText text={segment.text} />
                  </span>
                );
              })}
            </span>
          </div>
        );
      })}
    </>
  );
};
