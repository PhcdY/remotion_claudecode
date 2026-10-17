import "katex/dist/katex.min.css";
import "./katex-fix.css";
import katex from "katex";
import React, { useEffect, useMemo, useState } from "react";
import { continueRender, delayRender } from "remotion";

const KATEX_FONTS = [
  "400 40px KaTeX_Main",
  "700 40px KaTeX_Main",
  "italic 400 40px KaTeX_Main",
  "italic 400 40px KaTeX_Math",
  "400 40px KaTeX_AMS",
  "400 40px KaTeX_Size1",
  "400 40px KaTeX_Size2",
];

// Chặn render cho tới khi font KaTeX load xong (gọi một lần ở composition gốc).
export const useKatexFonts = () => {
  const [handle] = useState(() => delayRender("Đang load font KaTeX"));
  useEffect(() => {
    Promise.all(KATEX_FONTS.map((f) => document.fonts.load(f)))
      .then(() => continueRender(handle))
      .catch((err) => {
        console.error(err);
        continueRender(handle);
      });
  }, [handle]);
};

export const Tex: React.FC<{
  tex: string;
  display?: boolean;
  style?: React.CSSProperties;
}> = ({ tex, display = false, style }) => {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        output: "html",
        trust: false,
      }),
    [tex, display],
  );
  return <span style={style} dangerouslySetInnerHTML={{ __html: html }} />;
};

type Part = { math: boolean; value: string };

export const splitMath = (text: string): Part[] => {
  const parts: Part[] = [];
  const re = /\$([^$]+)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ math: false, value: text.slice(last, m.index) });
    parts.push({ math: true, value: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ math: false, value: text.slice(last) });
  return parts;
};

// Dòng chỉ gồm một công thức $...$
export const isPureMath = (text: string) => /^\s*\$[^$]+\$\s*$/.test(text);

// Chữ thường + công thức inline trong $...$
export const MathText: React.FC<{ text: string; style?: React.CSSProperties }> = ({
  text,
  style,
}) => {
  if (isPureMath(text)) {
    return <Tex tex={splitMath(text)[0].value} display style={style} />;
  }
  return (
    <span style={style}>
      {splitMath(text).map((p, i) =>
        p.math ? <Tex key={i} tex={p.value} /> : <span key={i}>{p.value}</span>,
      )}
    </span>
  );
};
