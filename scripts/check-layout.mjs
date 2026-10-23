// Kiểm chồng lấn chữ/điểm trên hình (skill dung-video › Bước 4).
// Dùng: node scripts/check-layout.mjs <slug> [--frames 120,450] [--draft] [--browser <đường-dẫn-chrome>]
// Mặc định kiểm 2 frame mỗi dòng: giữa dòng và ngay trước khi dòng kết thúc. --draft: timeline nháp (chưa có audio).
// LỖI (chặn): chồng lấn, sát, tràn khung, lấn vùng, chữ nhỏ, nhãn xa vật.
// CẢNH BÁO (không chặn): khung lệch / nửa khung trống, quá nhiều chữ mới trong một dòng (> 8 từ).
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
const inputProps = { layoutCheck: true, ...(args.includes("--draft") ? { draft: true } : {}) };
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

const NEW_WORDS_MAX = 8;
let total = 0;
const warnings = [];
let prevTexts = null;
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
    continue;
  }
  const issues = Array.isArray(result) ? result : result.issues;
  if (issues.length) {
    total += issues.length;
    console.log(`✗ ${where} [${frame}]`);
    for (const r of issues) console.log(`    ${r}`);
  }
  if (!Array.isArray(result)) {
    for (const w of result.warns) warnings.push(`${where} [${frame}]: ${w}`);
    // chữ mới so với cuối dòng trước (chỉ so ở frame cuối dòng)
    if (where.endsWith("(cuối)")) {
      if (prevTexts) {
        const before = new Set(prevTexts.map((t) => t.k));
        const added = result.texts.filter((t) => !before.has(t.k));
        const n = added.reduce((a, t) => a + t.n, 0);
        if (n > NEW_WORDS_MAX) warnings.push(`${where} [${frame}]: ${n} từ mới trên hình (> ${NEW_WORDS_MAX}): ${added.map((t) => t.k).join(" | ")}`);
      }
      prevTexts = result.texts;
    }
  }
}
await browser.close({ silent: true });
if (warnings.length) {
  console.log(`
CẢNH BÁO (${warnings.length}, không chặn — soát bằng mắt):`);
  for (const w of warnings) console.log(`  - ${w}`);
}
console.log(total ? `
${total} vấn đề.` : `
Không có lỗi bố cục (${frames.length} frame).`);
process.exit(total ? 1 : 0);
