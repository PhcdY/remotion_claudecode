// Xuất nhiều ảnh tĩnh với một lần bundle (skill dung-video › Bước 4).
// Dùng: node scripts/stills.mjs <compositionId> <frame> [frame...] [--scale 0.5]
//       node scripts/stills.mjs <compositionId> --onion <từ>-<đến> [--count 8] [--scale 0.5]
//       thêm --props '<json>' để truyền inputProps (vd. {"draft":true})
// Ảnh ra: out/_lam-viec/<compositionId>/stills/f<frame>.png
//
// --onion (ảnh chồng nhiều frame — soát lớp ăn khớp, dung-video › quy tắc 13): chồng <count> frame đều nhau trong
//   khoảng <từ>–<đến> lên một ảnh onion-<từ>-<đến>.png. Phần đứng yên giữ nét; phần chuyển động hiện thành vệt
//   và được tô hồng, nên thấy ngay sóng/hạt/vật đi tới đâu (vd. vệt hồng của sóng nằm trên bờ đất = lệch).
import { bundleProject } from "./lib/bundle.mjs";
import { workDir } from "./lib/paths.mjs";
import { decodePng, encodePng } from "./lib/png.mjs";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const take = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args.splice(i, 2)[1] : undefined;
};
const scale = Number(take("--scale") ?? 0.5);
const onion = take("--onion");
const count = Math.max(2, Number(take("--count") ?? 8));
const inputProps = JSON.parse(take("--props") ?? "{}"); // vd. --props '{"draft":true}'
const [id, ...frameArgs] = args;
const usage = "Dùng: node scripts/stills.mjs <compositionId> <frame> [frame...] [--scale 0.5]\n     node scripts/stills.mjs <compositionId> --onion <từ>-<đến> [--count 8]";
if (!id || (frameArgs.length === 0 && !onion)) {
  console.error(usage);
  process.exit(2);
}
let range = null;
if (onion) {
  const m = onion.match(/^(\d+)-(\d+)$/);
  if (!m || Number(m[2]) <= Number(m[1])) {
    console.error(`--onion cần dạng <từ>-<đến>, vd. 300-420 (nhận: ${onion})\n${usage}`);
    process.exit(2);
  }
  range = [Number(m[1]), Number(m[2])];
}

const root = path.resolve(import.meta.dirname, "..");
const localChrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browserOpts = existsSync(localChrome) ? { browserExecutable: localChrome, chromeMode: "chrome-for-testing" } : {};
const outDir = path.join(workDir(root, id), "stills");
mkdirSync(outDir, { recursive: true });

const serveUrl = await bundleProject(root);
const browser = await openBrowser("chrome", browserOpts);
const composition = await selectComposition({ serveUrl, id, inputProps, puppeteerInstance: browser, ...browserOpts });
console.log(`${id}: ${composition.durationInFrames} frame`);
for (const f of frameArgs.map(Number)) {
  const output = path.join(outDir, `f${String(f).padStart(5, "0")}.png`);
  await renderStill({ serveUrl, composition, frame: f, output, scale, inputProps, puppeteerInstance: browser, ...browserOpts });
  console.log(`✓ ${path.relative(root, output)}`);
}

if (range) {
  const [a, b] = range;
  const last = Math.min(b, composition.durationInFrames - 1);
  const picks = [...new Set(Array.from({ length: count }, (_, i) => Math.round(a + ((last - a) * i) / (count - 1))))];
  let sum = null;
  let lumMin = null;
  let lumMax = null;
  let size = null;
  for (const f of picks) {
    const { buffer } = await renderStill({ serveUrl, composition, frame: f, imageFormat: "png", scale, inputProps, puppeteerInstance: browser, ...browserOpts });
    const img = decodePng(buffer);
    if (!sum) {
      size = { width: img.width, height: img.height };
      sum = new Float32Array(img.data.length);
      lumMin = new Float32Array(img.width * img.height).fill(255);
      lumMax = new Float32Array(img.width * img.height);
    }
    for (let p = 0, i = 0; i < img.data.length; i += 4, p++) {
      sum[i] += img.data[i];
      sum[i + 1] += img.data[i + 1];
      sum[i + 2] += img.data[i + 2];
      const l = 0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2];
      if (l < lumMin[p]) lumMin[p] = l;
      if (l > lumMax[p]) lumMax[p] = l;
    }
  }
  const n = picks.length;
  const out = new Uint8Array(sum.length);
  const MOVING = 18; // độ chênh sáng tối thiểu giữa các frame để coi là "có chuyển động"
  for (let p = 0, i = 0; i < out.length; i += 4, p++) {
    let r = sum[i] / n;
    let g = sum[i + 1] / n;
    let bl = sum[i + 2] / n;
    if (lumMax[p] - lumMin[p] > MOVING) {
      // tô hồng phần chuyển động
      r = r * 0.55 + 236 * 0.45;
      g = g * 0.55 + 64 * 0.45;
      bl = bl * 0.55 + 160 * 0.45;
    }
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = bl;
    out[i + 3] = 255;
  }
  const output = path.join(outDir, `onion-${a}-${last}.png`);
  writeFileSync(output, encodePng({ ...size, data: out }));
  console.log(`✓ ${path.relative(root, output)} (chồng ${n} frame: ${picks.join(", ")}; hồng = phần chuyển động)`);
}
await browser.close({ silent: true });
