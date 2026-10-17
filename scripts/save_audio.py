"""Lưu audio ElevenLabs (tạo qua connector MCP) về project + ghi manifest.json.

Dùng:
    python scripts/save_audio.py src/videos/<slug>/script.json <bang-url.json>

<bang-url.json>: { "b01-l01": "<url mp3>", ... } — có thể chỉ chứa một số dòng (tạo lại từng dòng).
Đầu ra: public/audio/<slug>/<beatId>-lNN.mp3 + manifest.json (định dạng giống scripts/tts.py).
"""

import hashlib
import json
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    script_path, urls_path = Path(sys.argv[1]), Path(sys.argv[2])
    script = json.loads(script_path.read_text(encoding="utf-8"))
    urls = json.loads(urls_path.read_text(encoding="utf-8"))
    config_path = ROOT / "scripts" / "tts_config.json"
    config = json.loads(config_path.read_text(encoding="utf-8")) if config_path.exists() else {}

    out_dir = ROOT / "public" / "audio" / script["slug"]
    out_dir.mkdir(parents=True, exist_ok=True)

    lines, missing, saved = [], [], 0
    for beat in script["beats"]:
        for i, line in enumerate(beat["lines"], start=1):
            key = f"{beat['id']}-l{i:02d}"
            file = out_dir / f"{key}.mp3"
            if key in urls:
                with urllib.request.urlopen(urls[key], timeout=60) as r:
                    data = r.read()
                if len(data) < 1000:
                    print(f"✗ {key}: file quá nhỏ ({len(data)} byte), kiểm tra URL")
                    return 1
                file.write_bytes(data)
                saved += 1
                print(f"✓ {key}.mp3")
            if not file.exists():
                missing.append(key)
            speak = line.get("speak", line["text"])
            lines.append(
                {
                    "beat": beat["id"],
                    "line": i,
                    "file": f"{key}.mp3",
                    "hash": hashlib.sha1(speak.encode("utf-8")).hexdigest()[:16],
                    "text": line["text"],
                }
            )

    manifest = {
        "slug": script["slug"],
        "engine": "elevenlabs-mcp",
        "voice": config.get("voice_id"),
        "model": config.get("model_id"),
        "lines": lines,
    }
    (out_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\nĐã lưu {saved} file → {out_dir.relative_to(ROOT)}")
    if missing:
        print("Thiếu audio: " + ", ".join(missing))
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
