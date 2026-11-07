// Chỗ đặt file trong out/:
//   out/<Môn>/Lớp <lop>/<chuong>/<bai>/<id>.mp4 (+ .srt .vtt .timeline.json) — video thành phẩm, theo lop/chuong/bai trong script.json
//   out/_lam-viec/<id>/stills/, storyboard/ — ảnh soát của agent; video không có lop/chuong/bai (lab, demo) cũng render vào đây
import { readFileSync } from "node:fs";
import path from "node:path";

const MON = { toan: "Toán", ly: "Vật lý", hoa: "Hóa học", sinh: "Sinh học", su: "Lịch sử", dia: "Địa lý" };
const safe = (s) => String(s).normalize("NFC").replace(/[<>:"/\\|?*]/g, "-").replace(/[. ]+$/, "").trim();

export const workDir = (root, id) => path.join(root, "out", "_lam-viec", id);

// Thư mục bài của video; thiếu lop/chuong/bai thì về out/_lam-viec/<id>/ (missing = true)
export function videoDir(root, slug, id = slug) {
  const s = JSON.parse(readFileSync(path.join(root, "src/videos", slug, "script.json"), "utf-8"));
  if (s.lop == null || !s.chuong || !s.bai) return { dir: workDir(root, id), missing: true };
  const mon = MON[s.subject ?? "toan"] ?? s.subject;
  return { dir: path.join(root, "out", safe(mon), `Lớp ${s.lop}`, safe(s.chuong), safe(s.bai)), missing: false };
}
