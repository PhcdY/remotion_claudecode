// Chỗ đặt file trong out/ (hoặc OUTPUT_DIR tùy biến trong .env):
//   out/<Môn>/Lớp <lop>/<chuong>/<bai>/<id>.mp4 (+ .srt .vtt .timeline.json) — video thành phẩm, theo lop/chuong/bai trong script.json
//   out/_lam-viec/<id>/stills/, storyboard/ — ảnh soát của agent; video không có lop/chuong/bai (lab, demo) cũng render vào đây
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const MON = {
  toan: "Toán",
  ly: "Vật lý",
  hoa: "Hóa học",
  sinh: "Sinh học",
  su: "Lịch sử",
  dia: "Địa lý",
  van: "Ngữ văn",
  ktpl: "GDKT & PL",
  gtktpl: "GDKT & PL",
  anh: "Tiếng Anh",
  tienganh: "Tiếng Anh",
};
const safe = (s) => String(s).normalize("NFC").replace(/[<>:"/\\|?*]/g, "-").replace(/[. ]+$/, "").trim();

export function getBaseOutputDir(root) {
  let envOut = process.env.OUTPUT_DIR;
  if (!envOut) {
    try {
      const envPath = path.join(root, ".env");
      if (existsSync(envPath)) {
        const envContent = readFileSync(envPath, "utf-8");
        const match = envContent.match(/^\s*OUTPUT_DIR\s*=\s*["']?([^"'\r\n]+)["']?/m);
        if (match && match[1]) envOut = match[1].trim();
      }
    } catch {}
  }
  return envOut ? path.resolve(envOut) : path.join(root, "out");
}

export const workDir = (root, id) => path.join(getBaseOutputDir(root), "_lam-viec", id);

// Thư mục bài của video; thiếu lop/chuong/bai thì về out/_lam-viec/<id>/ (missing = true)
export function videoDir(root, slug, id = slug) {
  const s = JSON.parse(readFileSync(path.join(root, "src/videos", slug, "script.json"), "utf-8"));
  if (s.lop == null || !s.chuong || !s.bai) return { dir: workDir(root, id), missing: true };
  const mon = MON[s.subject ?? "toan"] ?? s.subject;
  const outRoot = getBaseOutputDir(root);
  return { dir: path.join(outRoot, safe(mon), `Lớp ${s.lop}`, safe(s.chuong), safe(s.bai)), missing: false };
}
