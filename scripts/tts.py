"""
TTS tạm cho pipeline video toán — dùng Edge TTS (miễn phí, không cần API key).

Cách dùng:
    pip install edge-tts
    python scripts/tts.py src/videos/dao-ham/script.json
    python scripts/tts.py src/videos/dao-ham/script.json --voice vi-VN-NamMinhNeural --rate +10%

Đầu vào: script.json dạng
{
  "slug": "dao-ham",
  "beats": [
    {
      "id": "b01",
      "section": "CÂU HỎI",
      "keyword": "Nhưng TẠI SAO?",
      "lines": [
        { "text": "Đạo hàm $f'(x)$ là gì?", "speak": "Đạo hàm f phẩy x là gì?" }
      ]
    }
  ]
}

Đầu ra:
    public/audio/<slug>/<beatId>-l<NN>.mp3     (mỗi dòng 1 file)
    public/audio/<slug>/manifest.json          (danh sách file theo thứ tự, Remotion đọc file này)

Hành vi:
- Cache: dòng nào có (voice, rate, speak) không đổi thì bỏ qua, không gọi lại.
- Lỗi mạng: retry 3 lần, backoff tăng dần. Dòng vẫn lỗi thì báo cuối, exit code 1.
- Ghi file qua file tạm rồi rename → không bao giờ để lại mp3 hỏng nửa chừng.

Giới hạn / lưu ý:
- Edge TTS là endpoint KHÔNG chính thức của Microsoft Edge "Read Aloud": có thể bị chặn/đổi
  bất cứ lúc nào, và không có điều khoản cho dùng thương mại → CHỈ DÙNG ĐỂ TEST pipeline.
- Tiếng Việt chỉ có 2 giọng: vi-VN-HoaiMyNeural (nữ), vi-VN-NamMinhNeural (nam).
- Khi chuyển sang ElevenLabs: chỉ cần thay hàm synthesize(), cấu trúc file giữ nguyên.
"""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import os
import re
import sys
from pathlib import Path

try:
    import edge_tts
except ImportError:
    sys.exit("Thiếu thư viện: chạy `pip install edge-tts` trước.")

DEFAULT_VOICE = "vi-VN-HoaiMyNeural"
MAX_RETRIES = 3
SAFE_ID = re.compile(r"^[A-Za-z0-9_-]+$")  # chặn path traversal qua slug/beat id
LATEX_HINT = re.compile(r"[$\\^_{}]")       # dấu hiệu chữ toán lọt vào lời đọc


def line_hash(voice: str, rate: str, speak: str) -> str:
    return hashlib.sha256(f"{voice}|{rate}|{speak}".encode("utf-8")).hexdigest()[:16]


async def synthesize(text: str, voice: str, rate: str, out: Path) -> None:
    """Gọi TTS và ghi mp3 an toàn (file tạm → rename)."""
    tmp = out.with_suffix(".tmp")
    last_err: Exception | None = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            await edge_tts.Communicate(text, voice, rate=rate).save(str(tmp))
            if tmp.stat().st_size == 0:
                raise RuntimeError("TTS trả về file rỗng")
            os.replace(tmp, out)
            return
        except Exception as e:  # mạng, rate limit, endpoint đổi...
            last_err = e
            tmp.unlink(missing_ok=True)
            if attempt < MAX_RETRIES:
                await asyncio.sleep(2 ** attempt)
    raise RuntimeError(f"Thất bại sau {MAX_RETRIES} lần: {last_err}")


def load_script(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        sys.exit(f"Không thấy file: {path}")
    except json.JSONDecodeError as e:
        sys.exit(f"script.json sai cú pháp (dòng {e.lineno}): {e.msg}")

    slug = data.get("slug", "")
    if not SAFE_ID.match(slug):
        sys.exit(f"slug không hợp lệ: {slug!r} (chỉ dùng chữ, số, - và _)")
    beats = data.get("beats")
    if not isinstance(beats, list) or not beats:
        sys.exit("script.json phải có mảng 'beats' không rỗng")
    for b in beats:
        if not SAFE_ID.match(str(b.get("id", ""))):
            sys.exit(f"beat id không hợp lệ: {b.get('id')!r}")
        if not isinstance(b.get("lines"), list) or not b["lines"]:
            sys.exit(f"beat {b['id']} không có 'lines'")
    return data


async def main() -> int:
    ap = argparse.ArgumentParser(description="Tạo audio từng dòng cho script.json")
    ap.add_argument("script", type=Path)
    ap.add_argument("--voice", default=DEFAULT_VOICE)
    ap.add_argument("--rate", default="+0%", help="tốc độ đọc, vd +10%% hoặc -5%%")
    ap.add_argument("--out-root", type=Path, default=Path("public/audio"))
    ap.add_argument("--force", action="store_true", help="bỏ cache, tạo lại toàn bộ")
    args = ap.parse_args()

    data = load_script(args.script)
    out_dir = args.out_root / data["slug"]
    out_dir.mkdir(parents=True, exist_ok=True)

    manifest_path = out_dir / "manifest.json"
    old = {}
    if manifest_path.exists() and not args.force:
        try:
            old = {e["file"]: e.get("hash") for e in json.loads(manifest_path.read_text("utf-8"))["lines"]}
        except (json.JSONDecodeError, KeyError):
            old = {}  # manifest hỏng → coi như không có cache

    entries, failed, made, skipped = [], [], 0, 0
    for beat in data["beats"]:
        for i, line in enumerate(beat["lines"], start=1):
            speak = (line.get("speak") or line.get("text") or "").strip()
            fname = f"{beat['id']}-l{i:02d}.mp3"
            if not speak:
                failed.append((fname, "dòng trống"))
                continue
            if LATEX_HINT.search(speak):
                print(f"⚠️  {fname}: lời đọc có ký hiệu toán, TTS sẽ đọc sai → viết ra chữ trong 'speak': {speak!r}")

            h = line_hash(args.voice, args.rate, speak)
            target = out_dir / fname
            if old.get(fname) == h and target.exists():
                skipped += 1
            else:
                try:
                    await synthesize(speak, args.voice, args.rate, target)
                    made += 1
                    print(f"✓ {fname}")
                except Exception as e:
                    failed.append((fname, str(e)))
                    continue
            entries.append({"beat": beat["id"], "line": i, "file": fname, "hash": h, "text": line.get("text", speak)})

    manifest_path.write_text(
        json.dumps({"slug": data["slug"], "voice": args.voice, "lines": entries}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"\nTạo mới {made}, dùng cache {skipped}, lỗi {len(failed)} → {out_dir}")
    for f, why in failed:
        print(f"  ✗ {f}: {why}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
