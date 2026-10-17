// Kiểm chồng lấn chữ/điểm trên hình (skill dung-video › Bước 4).
// Dùng: node scripts/check-layout.mjs <slug> [--frames 120,450] [--browser <đường-dẫn-chrome>]
// Mặc định kiểm 2 frame mỗi dòng: giữa dòng và ngay trước khi dòng kết thúc.
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { existsSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const slug = args[0];
if (!slug) {
  console.error("Thiếu slug. Dùng: node scripts/check-layout.mjs <slug>");
  process.exit(2);
}
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const root = path.resolve(import.meta.dirname, "..");
const localChrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browserExecutable = opt("--browser") ?? (existsSync(localChrome) ? localChrome : null);
const browserOpts = browserExecutable ? { browserExecutable, chromeMode: "chrome-for-testing" } : {};

const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "public") });
const inputProps = { layoutCheck: true };
const browser = await openBrowser("chrome", browserOpts);
const composition = await selectComposition({ serveUrl, id: slug, inputProps, puppeteerInstance: browser, ...browserOpts });

const timeline = composition.props.timeline;
let frames = [];
if (opt("--frames")) {
  frames = opt("--frames").split(",").map((f) => ({ frame: Number(f), where: `frame ${f}` }));
} else {
  for (const b of timeline.beats) {
    b.lines.forEach((l, i) => {
      const mid = Math.round((l.startFrame + l.endFrame) / 2);
      frames.push({ frame: mid, where: `${b.id} dòng ${i + 1} (giữa)` });
      frames.push({ frame: Math.max(l.startFrame, l.endFrame - 2), where: `${b.id} dòng ${i + 1} (cuối)` });
    });
  }
}

let total = 0;
for (const { frame, where } of frames) {
  let result = null;
  await renderStill({
    serveUrl,
    composition,
    frame,
    inputProps,
    output: null,
    puppeteerInstance: browser,
    onBrowserLog: (log) => {
      if (log.text.startsWith("LAYOUT_RESULT ")) result = JSON.parse(log.text.slice("LAYOUT_RESULT ".length));
    },
    ...browserOpts,
  });
  if (result === null) {
    console.log(`? ${where} [${frame}]: không đọc được kết quả đo`);
    total++;
  } else if (result.length) {
    total += result.length;
    console.log(`✗ ${where} [${frame}]`);
    for (const r of result) console.log(`    ${r}`);
  }
}
await browser.close({ silent: true });
console.log(total ? `\n${total} vấn đề.` : `\nKhông có chồng lấn (${frames.length} frame).`);
process.exit(total ? 1 : 0);
