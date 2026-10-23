"""Mốc thời gian từng từ trong audio của từng dòng (skill dung-video › cue) — không cần nhận dạng giọng nói.

Đã biết sẵn lời đọc (`speak`), nên chỉ cần căn: dò khoảng lặng trong file (ffmpeg silencedetect),
ghép khoảng lặng với dấu câu của `speak` (chỗ giọng ngắt), rồi trong mỗi đoạn chia đều theo số âm tiết.
Sai số thường ~0,1–0,3 s: đủ để hình đổi đúng lúc giọng nói tới một cụm từ.

Dùng:
    python scripts/align_words.py <slug> [--audio-dir <thư mục trong public/audio>]
Ra: public/audio/<audio-dir>/words.json  { "b03-l02": { "dur": 3.1, "words": [{ "w": "điểm", "s": 0.05 }, ...] } }
Tách từ khớp với `speakTokens` trong src/components/timeline.ts — sửa một bên thì sửa cả hai.
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NOISE_DB = -35
MIN_SILENCE = 0.1
BOUNDARY = re.compile(r"[,.:;?!…]+$")
STRIP = re.compile(r"^[\"'“”‘’(\[]+|[\"'“”‘’)\],.:;?!…]+$")


def tool(name: str) -> str:
    bundled = ROOT / "node_modules" / "@remotion" / "compositor-win32-x64-msvc" / f"{name}.exe"
    if bundled.exists():
        return str(bundled)
    found = shutil.which(name)
    if not found:
        sys.exit(f"Không tìm thấy {name} (chạy `npm install`).")
    return found


def speak_tokens(speak: str) -> list[dict]:
    """[{w, syl, brk}] — w: từ đã bỏ dấu câu, chữ thường; syl: số âm tiết; brk: sau từ có dấu ngắt."""
    out = []
    for raw in speak.replace("...", "…").split():
        brk = bool(BOUNDARY.search(raw))
        w = STRIP.sub("", raw).lower()
        if not w:
            if out and brk:
                out[-1]["brk"] = True
            continue
        out.append({"w": w, "syl": max(1, len([p for p in w.split("-") if p])), "brk": brk})
    if out:
        out[-1]["brk"] = False  # cuối dòng không tính là chỗ ngắt giữa dòng
    return out


def duration(path: Path) -> float:
    r = subprocess.run([tool("ffprobe"), "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                       capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


def silences(path: Path, dur: float) -> list[tuple[float, float]]:
    r = subprocess.run([tool("ffmpeg"), "-hide_banner", "-nostats", "-i", str(path), "-af",
                        f"silencedetect=noise={NOISE_DB}dB:d={MIN_SILENCE}", "-f", "null", "-"],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    res = []
    for i, s in enumerate(starts):
        e = ends[i] if i < len(ends) else dur
        if s > 0.08 and e < dur - 0.08:  # bỏ lặng ở đầu/cuối file
            res.append((s, e))
    return res


def align(speak: str, path: Path) -> dict:
    toks = speak_tokens(speak)
    dur = duration(path)
    if not toks:
        return {"dur": dur, "words": []}
    sil = silences(path, dur)
    t0, t1 = 0.03, max(0.06, dur - 0.03)
    total = sum(t["syl"] for t in toks)
    # chỗ ngắt theo dấu câu: chỉ số âm tiết tích luỹ sau từ có dấu ngắt
    cum, bounds = 0, []
    for t in toks:
        cum += t["syl"]
        if t["brk"]:
            bounds.append(cum)
    # ghép mỗi chỗ ngắt với khoảng lặng gần thời điểm dự kiến nhất (theo thứ tự, không dùng lại)
    knots = [(0, t0, t0)]  # (âm tiết, lúc đoạn trước kết thúc, lúc đoạn này bắt đầu)
    used = -1
    for b in bounds:
        expect = t0 + (t1 - t0) * b / total
        best = None
        for i in range(used + 1, len(sil)):
            mid = (sil[i][0] + sil[i][1]) / 2
            if abs(mid - expect) <= 0.35 * (t1 - t0) and (best is None or abs(mid - expect) < abs((sil[best][0] + sil[best][1]) / 2 - expect)):
                best = i
        if best is not None:
            used = best
            knots.append((b, sil[best][0], sil[best][1]))
    knots.append((total, t1, t1))
    # nội suy tuyến tính theo âm tiết trong từng đoạn giữa hai mốc
    words, acc = [], 0
    for t in toks:
        for k in range(len(knots) - 1):
            a, b = knots[k], knots[k + 1]
            if a[0] <= acc < b[0] or (k == len(knots) - 2):
                start = a[2] + (b[1] - a[2]) * (acc - a[0]) / max(1, b[0] - a[0])
                break
        words.append({"w": t["w"], "s": round(start, 3)})
        acc += t["syl"]
    return {"dur": round(dur, 3), "words": words}


def main() -> int:
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    slug = args[0]
    audio_dir = args[args.index("--audio-dir") + 1] if "--audio-dir" in args else slug
    script = json.loads((ROOT / "src" / "videos" / slug / "script.json").read_text(encoding="utf-8"))
    base = ROOT / "public" / "audio" / audio_dir
    manifest = json.loads((base / "manifest.json").read_text(encoding="utf-8"))
    files = {(m["beat"], m["line"]): m["file"] for m in manifest["lines"]}
    out, missing = {}, []
    for b in script["beats"]:
        for i, line in enumerate(b["lines"], start=1):
            f = files.get((b["id"], i))
            if not f or not (base / f).exists():
                missing.append(f"{b['id']}-l{i:02d}")
                continue
            out[f"{b['id']}-l{i:02d}"] = align(line["speak"], base / f)
    (base / "words.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"✓ public/audio/{audio_dir}/words.json — {len(out)} dòng" + (f"; thiếu audio: {', '.join(missing)}" if missing else ""))
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.exit(main())
