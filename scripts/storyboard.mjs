// Storyboard: mỗi dòng một ảnh tĩnh (lúc thay đổi của dòng đã hiện đủ) + lời đọc, ghép thành một trang HTML
// để người dùng duyệt hình TRƯỚC khi tạo audio (skill dung-video › Bước 2b).
// Dùng: node scripts/storyboard.mjs <compositionId> [--slug <slug>] [--real] [--scale 0.4] [--beats b03,b04] [--review]
//   mặc định chế độ nháp (thời gian ước tính, không cần audio); --real: dùng audio thật đã có.
//   --review: bản rút gọn cho agent hoc-sinh-ao — MỖI BEAT MỘT ẢNH NHỎ (cuối beat, scale 0.3) + review.md có lời đọc,
//   ra out/_lam-viec/<id>/storyboard/review/; không đụng tới index.html. Lý do: 24/10/2026 agent xem 67 ảnh cỡ 0.5,
//   mở lại mỗi ảnh ~20 lần, tốn 68% token cả phiên.
// Ra: out/_lam-viec/<id>/storyboard/index.html (ảnh nhúng sẵn, mở thẳng trong trình duyệt).
import { bundleProject } from "./lib/bundle.mjs";
import { workDir } from "./lib/paths.mjs";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
};
const id = args[0];
if (!id || id.startsWith("--")) {
  console.error("Dùng: node scripts/storyboard.mjs <compositionId> [--slug <slug>] [--real] [--scale 0.4] [--beats b01,b02]");
  process.exit(2);
}
const slug = opt("--slug", id);
const real = args.includes("--real");
const scale = Number(opt("--scale", "0.4"));
const only = opt("--beats", "")?.split(",").filter(Boolean) ?? [];
const review = args.includes("--review");

const root = path.resolve(import.meta.dirname, "..");
const script = JSON.parse(readFileSync(path.join(root, "src/videos", slug, "script.json"), "utf-8"));
const localChrome = process.env.REMOTION_CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browserOpts = existsSync(localChrome) ? { browserExecutable: localChrome, chromeMode: "chrome-for-testing" } : {};
const outDir = path.join(workDir(root, id), "storyboard");
mkdirSync(outDir, { recursive: true });

const inputProps = real ? {} : { draft: true };
const serveUrl = await bundleProject(root);
const browser = await openBrowser("chrome", browserOpts);
const composition = await selectComposition({ serveUrl, id, inputProps, puppeteerInstance: browser, ...browserOpts });
const { timeline } = composition.props;

if (review) {
  const rdir = path.join(outDir, "review");
  mkdirSync(rdir, { recursive: true });
  const rscale = Number(opt("--scale", "0.3"));
  const md = [`# ${script.title} — storyboard rút gọn (mỗi beat một ảnh: cuối beat)`, ""];
  for (const tb of timeline.beats) {
    if (only.length && !only.includes(tb.id)) continue;
    const sb = script.beats.find((b) => b.id === tb.id);
    const last = tb.lines[tb.lines.length - 1];
    const frame = Math.max(last.startFrame, last.endFrame - 2);
    await renderStill({ serveUrl, composition, frame, inputProps, output: path.join(rdir, `${tb.id}.png`), scale: rscale, puppeteerInstance: browser, ...browserOpts });
    md.push(`## ${tb.id} — ảnh ${tb.id}.png · câu chốt: ${sb.keyword}`);
    sb.lines.forEach((l, i) => {
      md.push(`${i + 1}. lời: ${l.speak}`);
      md.push(`   hình đổi: ${l.show ?? ""}${l.text ? ` · chữ hiện: ${l.text}` : ""}`);
    });
    md.push("");
    process.stdout.write(`\r${tb.id}`);
  }
  writeFileSync(path.join(rdir, "review.md"), md.join("\n"), "utf-8");
  await browser.close({ silent: true });
  console.log(`\n✓ ${path.relative(root, rdir)}`);
  process.exit(0);
}

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const sections = [];
let n = 0;
for (const tb of timeline.beats) {
  if (only.length && !only.includes(tb.id)) continue;
  const sb = script.beats.find((b) => b.id === tb.id);
  const cards = [];
  for (const [i, tl] of tb.lines.entries()) {
    const frame = Math.max(tl.startFrame, tl.endFrame - 2);
    const file = path.join(outDir, `${tb.id}-l${String(i + 1).padStart(2, "0")}.png`);
    await renderStill({ serveUrl, composition, frame, inputProps, output: file, scale, puppeteerInstance: browser, ...browserOpts });
    const img = readFileSync(file).toString("base64");
    const line = sb.lines[i];
    cards.push(`<figure>
  <img src="data:image/png;base64,${img}" alt="${tb.id} dòng ${i + 1}">
  <figcaption>
    <b>Dòng ${i + 1}</b> <span class="t">${(frame / composition.fps).toFixed(1)} s</span>
    ${line.show ? `<p class="show">hình: ${esc(line.show)}${line.at ? ` · chữ gắn: ${esc(line.at)}` : ""}</p>` : ""}
    ${line.text ? `<p class="text">chữ: ${esc(line.text)}</p>` : ""}
    <p class="speak">${esc(line.speak)}</p>
  </figcaption>
</figure>`);
    n++;
    process.stdout.write(`\r${n} ảnh`);
  }
  sections.push(`<section>
  <h2>${esc(tb.id)} · ${esc(sb.section)}${sb.scene !== undefined ? ` · cảnh ${esc(sb.scene)}` : ""}</h2>
  <p class="kw">câu chốt: ${esc(sb.keyword)}</p>
  <details><summary>visual</summary><p>${esc(sb.visual)}</p></details>
  <div class="grid">${cards.join("\n")}</div>
</section>`);
}
await browser.close({ silent: true });

const html = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Storyboard — ${esc(script.title)}</title>
<style>
  :root { color-scheme: light; --navy:#0E1046; --muted:#5E6785; --line:#E4EAF6; --accent:#3D4AEF; }
  body { margin:0; padding:24px 16px 64px; background:#F6F8FE; color:var(--navy); font:15px/1.5 system-ui, sans-serif; }
  h1 { font-size:22px; margin:0 0 4px; } .note { color:var(--muted); margin:0 0 24px; }
  section { margin:0 0 36px; } h2 { font-size:18px; margin:0; } .kw { color:var(--accent); font-weight:600; margin:2px 0 6px; }
  details { color:var(--muted); margin-bottom:10px; } details p { margin:6px 0; max-width:1100px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(360px, 1fr)); gap:14px; }
  figure { margin:0; background:#fff; border:1px solid var(--line); border-radius:14px; overflow:hidden; }
  img { display:block; width:100%; height:auto; border-bottom:1px solid var(--line); }
  figcaption { padding:8px 12px 10px; } figcaption p { margin:4px 0 0; }
  .t { color:var(--muted); font-size:13px; } .show { color:var(--muted); font-size:13px; } .text { font-family:ui-monospace, monospace; font-size:13px; }
</style></head><body>
<h1>Storyboard — ${esc(script.title)}</h1>
<p class="note">${real ? "Thời gian theo audio thật." : "Bản nháp: thời gian ước tính theo số chữ, chưa có giọng đọc."} Mỗi ảnh là cuối dòng, lúc thay đổi của dòng đã hiện đủ. ${n} ảnh.</p>
${sections.join("\n")}
</body></html>`;
writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
console.log(`\n✓ ${path.relative(root, path.join(outDir, "index.html"))}`);
