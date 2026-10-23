// Xuất phụ đề đầy đủ (skill dung-video › Bước 5) — file riêng, không in lên hình.
// Dùng: node scripts/export-captions.mjs <slug> [--id <compositionId>]
// Ra: out/<id>.srt và out/<id>.vtt. Chữ lấy từ `caption` của dòng, thiếu thì `speak`; mốc thời gian từ timeline thật (độ dài audio).
import { bundle } from "@remotion/bundler";
import { openBrowser, selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const slug = args[0];
if (!slug) {
  console.error("Dùng: node scripts/export-captions.mjs <slug> [--id <compositionId>]");
  process.exit(2);
}
const ii = args.indexOf("--id");
const id = ii >= 0 ? args[ii + 1] : slug;

const root = path.resolve(import.meta.dirname, "..");
const script = JSON.parse(readFileSync(path.join(root, "src/videos", slug, "script.json"), "utf-8"));
const localChrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browserOpts = existsSync(localChrome) ? { browserExecutable: localChrome, chromeMode: "chrome-for-testing" } : {};

const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "public") });
const browser = await openBrowser("chrome", browserOpts);
const composition = await selectComposition({ serveUrl, id, puppeteerInstance: browser, ...browserOpts });
await browser.close({ silent: true });

const { fps } = composition;
const timeline = composition.props.timeline;
const cues = [];
for (const tb of timeline.beats) {
  const sb = script.beats.find((b) => b.id === tb.id);
  if (!sb) throw new Error(`Không thấy beat ${tb.id} trong script.json`);
  tb.lines.forEach((tl, i) => {
    const line = sb.lines[i];
    const text = (line.caption ?? line.speak ?? "").replace(/\.\.\./g, " ").replace(/\s+/g, " ").trim();
    if (text) cues.push({ start: tl.startFrame / fps, end: tl.endFrame / fps, text });
  });
}

const stamp = (sec, sep) => {
  const ms = Math.round(sec * 1000);
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)}${sep}${p(ms % 1000, 3)}`;
};
const srt = cues.map((c, i) => `${i + 1}\n${stamp(c.start, ",")} --> ${stamp(c.end, ",")}\n${c.text}\n`).join("\n");
const vtt = "WEBVTT\n\n" + cues.map((c) => `${stamp(c.start, ".")} --> ${stamp(c.end, ".")}\n${c.text}\n`).join("\n");

const outDir = path.join(root, "out");
mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, `${id}.srt`), srt, "utf-8");
writeFileSync(path.join(outDir, `${id}.vtt`), vtt, "utf-8");
console.log(`✓ out/${id}.srt, out/${id}.vtt — ${cues.length} câu`);
