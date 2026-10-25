// In đường dẫn file render của video (tạo sẵn thư mục) — dùng trong lệnh render:
//   npx remotion render <id> "$(node scripts/out-path.mjs <slug> --id <id>)"
// Ra: out/<Môn>/Lớp <lop>/<chuong>/<bai>/<id>.mp4 theo script.json (thiếu lop/chuong/bai → out/_lam-viec/<id>/<id>.mp4).
import { mkdirSync } from "node:fs";
import path from "node:path";
import { videoDir } from "./lib/paths.mjs";

const args = process.argv.slice(2);
const slug = args[0];
if (!slug) {
  console.error("Dùng: node scripts/out-path.mjs <slug> [--id <compositionId>] [--ext mp4]");
  process.exit(2);
}
const opt = (name, def) => (args.includes(name) ? args[args.indexOf(name) + 1] : def);
const id = opt("--id", slug);
const root = path.resolve(import.meta.dirname, "..");
const { dir, missing } = videoDir(root, slug, id);
if (missing) console.error(`(script.json của ${slug} thiếu lop/chuong/bai → ra out/_lam-viec/)`);
mkdirSync(dir, { recursive: true });
console.log(path.relative(root, path.join(dir, `${id}.${opt("--ext", "mp4")}`)).replaceAll("\\", "/"));
