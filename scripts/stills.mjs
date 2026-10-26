// Xuất nhiều ảnh tĩnh với một lần bundle (skill dung-video › Bước 4).
// Dùng: node scripts/stills.mjs <compositionId> <frame> [frame...] [--scale 0.5]
// Ảnh ra: out/_lam-viec/<compositionId>/stills/f<frame>.png
import { bundleProject } from "./lib/bundle.mjs";
import { workDir } from "./lib/paths.mjs";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const si = args.indexOf("--scale");
const scale = si >= 0 ? Number(args.splice(si, 2)[1]) : 0.5;
const [id, ...frameArgs] = args;
if (!id || frameArgs.length === 0) {
  console.error("Dùng: node scripts/stills.mjs <compositionId> <frame> [frame...] [--scale 0.5]");
  process.exit(2);
}

const root = path.resolve(import.meta.dirname, "..");
const localChrome = process.env.REMOTION_BROWSER ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browserOpts = existsSync(localChrome) ? { browserExecutable: localChrome, chromeMode: "chrome-for-testing" } : {};
const outDir = path.join(workDir(root, id), "stills");
mkdirSync(outDir, { recursive: true });

const serveUrl = await bundleProject(root);
const browser = await openBrowser("chrome", browserOpts);
const composition = await selectComposition({ serveUrl, id, puppeteerInstance: browser, ...browserOpts });
console.log(`${id}: ${composition.durationInFrames} frame`);
for (const f of frameArgs.map(Number)) {
  const output = path.join(outDir, `f${String(f).padStart(5, "0")}.png`);
  await renderStill({ serveUrl, composition, frame: f, output, scale, puppeteerInstance: browser, ...browserOpts });
  console.log(`✓ ${path.relative(root, output)}`);
}
await browser.close({ silent: true });
