// Kiểm chồng lấn chữ/điểm trên hình (skill dung-video › Bước 4).
// Dùng: node scripts/check-layout.mjs <slug> [--frames 120,450] [--draft] [--motion <bước>] [--no-motion]
//        [--props '{"labLoi":true}'] [--browser <đường-dẫn-chrome>]
// Mặc định kiểm 2 frame mỗi dòng: giữa dòng và ngay trước khi dòng kết thúc. --draft: timeline nháp (chưa có audio).
// Lớp ăn khớp (dung-video › quy tắc 13): dòng nào có vật gắn data-inside thì kiểm thêm suốt dòng, mỗi <bước> frame
//   (mặc định 6, tức 5 lần/giây), vì sóng, hạt, vật đang chạy có thể lệch ra ngoài vùng đúng ở frame không được chụp.
//   --no-motion: bỏ lượt này (chạy nhanh khi đang sửa chữ).
// LỖI (chặn): chồng lấn, sát, tràn khung, lấn vùng, chữ nhỏ, nhãn xa vật, vật lệch ra ngoài vùng của nó.
// CẢNH BÁO (không chặn): khung lệch / nửa khung trống, quá nhiều chữ mới trong một dòng (> 8 từ),
//   "lướt qua" (vật gắn data-moving chồng thoáng qua thứ khác — soát bằng ảnh tĩnh rằng lần chồng ≤ ~0,5 s).
import { bundleProject } from "./lib/bundle.mjs";
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

const serveUrl = await bundleProject(root);
const extraProps = opt("--props") ? JSON.parse(opt("--props")) : {};
const inputProps = { ...extraProps, layoutCheck: true, ...(args.includes("--draft") ? { draft: true } : {}) };
const motionStep = Math.max(1, Number(opt("--motion") ?? 6));
const motionOn = !args.includes("--no-motion");
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
      const line = { where: `${b.id} dòng ${i + 1}`, start: l.startFrame, end: l.endFrame };
      frames.push({ frame: mid, where: `${line.where} (giữa)`, line });
      frames.push({ frame: Math.max(l.startFrame, l.endFrame - 2), where: `${line.where} (cuối)`, line });
    });
  }
}

const probe = async (frame) => {
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
  return result;
};

const NEW_WORDS_MAX = 8;
let total = 0;
const warnings = [];
let prevTexts = null;
const motionLines = new Map(); // dòng có vật data-inside → kiểm thêm suốt dòng
for (const { frame, where, line } of frames) {
  const result = await probe(frame);
  if (result === null) {
    console.log(`? ${where} [${frame}]: không đọc được kết quả đo`);
    total++;
    continue;
  }
  const all = Array.isArray(result) ? result : [...result.issues, ...(result.inside?.issues ?? [])];
  if (line && result.inside?.count) motionLines.set(line.where, line);
  // "lướt qua": vật đang chạy (data-moving) chồng thoáng qua — chỉ cảnh báo, soát bằng ảnh tĩnh rằng nó ngắn (≤ ~0,5 s)
  for (const r of all.filter((r) => r.startsWith("lướt qua"))) warnings.push(`${where} [${frame}]: ${r}`);
  const issues = all.filter((r) => !r.startsWith("lướt qua"));
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

// --- lượt chuyển động: vật data-inside có lệch khỏi vùng ở frame nào trong dòng không ---
let motionFrames = 0;
if (motionOn && motionLines.size) {
  const sampled = new Set(frames.map((f) => f.frame));
  for (const line of motionLines.values()) {
    const bad = new Map(); // vật → { frames, worst }
    for (let fr = line.start; fr < line.end; fr += motionStep) {
      if (sampled.has(fr)) continue;
      const result = await probe(fr);
      motionFrames++;
      for (const msg of result?.inside?.issues ?? []) {
        const key = msg.split(":")[0];
        const n = Number((msg.match(/: (\d+)\//) ?? [])[1] ?? 0);
        const cur = bad.get(key) ?? { frames: [], worst: { n: -1 } };
        cur.frames.push(fr);
        if (n > cur.worst.n) cur.worst = { n, fr, msg };
        bad.set(key, cur);
      }
    }
    for (const { frames: frs, worst } of bad.values()) {
      total++;
      const list = frs.length > 6 ? `${frs.slice(0, 6).join(", ")}… (${frs.length} frame)` : frs.join(", ");
      console.log(`✗ ${line.where} (chuyển động) — lệch ở frame ${list}; nặng nhất [${worst.fr}]:`);
      console.log(`    ${worst.msg}`);
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
Không có lỗi bố cục (${frames.length} frame${motionFrames ? ` + ${motionFrames} frame chuyển động` : ""}).`);
process.exit(total ? 1 : 0);
