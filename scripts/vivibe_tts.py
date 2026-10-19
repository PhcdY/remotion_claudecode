"""B2 — tạo giọng đọc bằng Vivibe API (giọng clone của người dùng).

Dùng:
    python scripts/vivibe_tts.py --list-voices
    python scripts/vivibe_tts.py src/videos/<slug>/script.json --voice "<tên hoặc id>" --estimate
    python scripts/vivibe_tts.py src/videos/<slug>/script.json --voice "<tên hoặc id>" --only b01
    python scripts/vivibe_tts.py src/videos/<slug>/script.json --voice "<tên hoặc id>"
    python scripts/vivibe_tts.py src/videos/<slug>/script.json --voice "<tên hoặc id>" --only b03-l02 --force

API key: biến môi trường VIVIBE_API_KEY, hoặc dòng `VIVIBE_API_KEY=...` trong .env ở gốc project.
Giọng: chọn mỗi lần chạy bằng --voice (người dùng báo). Tốc độ: scripts/tts_config.json (speed).

Đầu ra: public/audio/<slug>/<beatId>-lNN.mp3 (mỗi dòng 1 file) + manifest.json.

Hành vi:
- Kiểm tra cả kịch bản trước khi gọi API: dòng trống hoặc `speak` còn ký hiệu toán → dừng, không tốn credit.
- Cache: dòng có (voice, speed, speak) không đổi và đã có file thì bỏ qua. --force tạo lại các dòng được chọn.
- Không tự gửi lại job tạo giọng khi lỗi (mỗi lần gửi là một lần trừ credit); chỉ retry bước hỏi trạng thái / tải file.
- Vivibe trả WAV → đổi sang MP3 bằng ffmpeg đi kèm Remotion. Ghi qua file tạm rồi rename.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "scripts" / "tts_config.json"
API_URL = "https://api.lucylab.io/json-rpc"
POLL_EVERY = 2.5  # giây, theo khuyến nghị của Vivibe (2–3s)
POLL_TIMEOUT = 300  # giây cho mỗi dòng
WORKERS = 4
SAFE_ID = re.compile(r"^[A-Za-z0-9_-]+$")
LATEX_HINT = re.compile(r"[$\\^_{}]")


class ApiError(RuntimeError):
    pass


def load_api_key() -> str:
    key = os.environ.get("VIVIBE_API_KEY", "").strip()
    env = ROOT / ".env"
    if not key and env.exists():
        for raw in env.read_text(encoding="utf-8").splitlines():
            name, sep, value = raw.partition("=")
            if sep and name.strip() == "VIVIBE_API_KEY":
                key = value.strip().strip('"').strip("'")
    if not key:
        sys.exit("Thiếu API key: thêm dòng VIVIBE_API_KEY=... vào .env (tạo key ở vivibe.app/docs/api-keys).")
    return key


def rpc(key: str, method: str, payload: dict, retries: int = 1) -> dict:
    body = json.dumps({"method": method, "input": payload}).encode("utf-8")
    req = urllib.request.Request(
        API_URL,
        data=body,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "User-Agent": "video-ai-pipeline/1.0",
        },
    )
    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data = json.loads(r.read().decode("utf-8"))
            break
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", "replace")[:300]
            raise ApiError(f"{method}: HTTP {e.code} {detail}") from None
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt == retries:
                raise ApiError(f"{method}: lỗi mạng {e}") from None
            time.sleep(2**attempt)
    if data.get("error"):
        raise ApiError(f"{method}: {json.dumps(data['error'], ensure_ascii=False)[:300]}")
    return data.get("result") or {}


def find_ffmpeg() -> str:
    bundled = ROOT / "node_modules" / "@remotion" / "compositor-win32-x64-msvc" / "ffmpeg.exe"
    if bundled.exists():
        return str(bundled)
    found = shutil.which("ffmpeg")
    if not found:
        sys.exit("Không tìm thấy ffmpeg (chạy `npm install` để có bản đi kèm Remotion).")
    return found


def line_hash(voice: str, speed: float, speak: str) -> str:
    return hashlib.sha256(f"vivibe|{voice}|{speed}|{speak}".encode("utf-8")).hexdigest()[:16]


def synthesize(key: str, ffmpeg: str, speak: str, voice: str, speed: float, out: Path) -> None:
    job = rpc(key, "ttsLongText", {"text": speak, "userVoiceId": voice, "speed": speed})
    export_id = job.get("projectExportId")
    if not export_id:
        raise ApiError(f"ttsLongText không trả projectExportId: {job}")

    deadline = time.time() + POLL_TIMEOUT
    while True:
        status = rpc(key, "getExportStatus", {"projectExportId": export_id}, retries=3)
        state = status.get("state")
        if state == "completed" and status.get("url"):
            break
        if state == "failed":
            raise ApiError(f"Vivibe báo failed (export {export_id})")
        if time.time() > deadline:
            raise ApiError(f"Quá {POLL_TIMEOUT}s chưa xong (export {export_id}, state={state})")
        time.sleep(POLL_EVERY)

    wav = out.with_suffix(".tmp.wav")
    tmp = out.with_suffix(".tmp.mp3")
    try:
        with urllib.request.urlopen(status["url"], timeout=120) as r:
            wav.write_bytes(r.read())
        if wav.stat().st_size < 1000:
            raise ApiError(f"File tải về quá nhỏ ({wav.stat().st_size} byte)")
        res = subprocess.run(
            [ffmpeg, "-y", "-loglevel", "error", "-i", str(wav), "-codec:a", "libmp3lame", "-q:a", "2", str(tmp)],
            capture_output=True,
            text=True,
        )
        if res.returncode != 0:
            raise ApiError(f"ffmpeg lỗi: {res.stderr.strip()[:300]}")
        os.replace(tmp, out)
    finally:
        wav.unlink(missing_ok=True)
        tmp.unlink(missing_ok=True)


def load_script(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        sys.exit(f"Không thấy file: {path}")
    except json.JSONDecodeError as e:
        sys.exit(f"script.json sai cú pháp (dòng {e.lineno}): {e.msg}")
    if not SAFE_ID.match(str(data.get("slug", ""))):
        sys.exit(f"slug không hợp lệ: {data.get('slug')!r}")
    beats = data.get("beats")
    if not isinstance(beats, list) or not beats:
        sys.exit("script.json phải có mảng 'beats' không rỗng")
    for b in beats:
        if not SAFE_ID.match(str(b.get("id", ""))):
            sys.exit(f"beat id không hợp lệ: {b.get('id')!r}")
        if not isinstance(b.get("lines"), list) or not b["lines"]:
            sys.exit(f"beat {b['id']} không có 'lines'")
    return data


def fetch_voices(key: str) -> list[dict]:
    return rpc(key, "getUserVoices", {"limit": 100, "page": 1}, retries=3).get("items", [])


def resolve_voice(key: str, wanted: str) -> tuple[str, str]:
    """--voice nhận id hoặc tên giọng (không phân biệt hoa thường) → (id, tên)."""
    voices = fetch_voices(key)
    for v in voices:
        if wanted == v.get("id") or wanted.casefold() == str(v.get("name", "")).casefold():
            return v["id"], v.get("name", v["id"])
    names = ", ".join(f"{v.get('name')} ({v.get('id')})" for v in voices) or "không có"
    sys.exit(f"Không thấy giọng {wanted!r}. Giọng hiện có: {names}")


def list_voices(key: str) -> int:
    items = fetch_voices(key)
    if not items:
        print("Tài khoản chưa có giọng nào.")
        return 1
    for v in items:
        print(f"{v.get('id')}  {'✓' if v.get('isActive') else '✗'}  {v.get('name')}")
    return 0


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8")  # console Windows mặc định cp1252
    ap = argparse.ArgumentParser(description="Tạo audio từng dòng cho script.json bằng Vivibe")
    ap.add_argument("script", type=Path, nargs="?")
    ap.add_argument("--voice", help="id hoặc tên giọng Vivibe cho lần chạy này (bắt buộc khi tạo)")
    ap.add_argument("--list-voices", action="store_true", help="in danh sách giọng của tài khoản rồi thoát")
    ap.add_argument("--only", nargs="+", default=[], help="chỉ tạo các beat (b01) hoặc dòng (b01-l02) này")
    ap.add_argument("--estimate", action="store_true", help="chỉ đếm ký tự sẽ gửi, không gọi API")
    ap.add_argument("--force", action="store_true", help="tạo lại dòng được chọn dù đã có cache")
    args = ap.parse_args()

    if args.list_voices:
        return list_voices(load_api_key())
    if not args.script:
        ap.error("cần đường dẫn script.json")

    if not args.voice:
        ap.error("cần --voice <id hoặc tên giọng> (xem --list-voices)")
    config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    speed = float(config.get("speed", 1.0))
    key_api = load_api_key()
    voice, voice_name = resolve_voice(key_api, args.voice)

    data = load_script(args.script)
    out_dir = ROOT / "public" / "audio" / data["slug"]
    manifest_path = out_dir / "manifest.json"
    old: dict[str, str] = {}
    if manifest_path.exists():
        try:
            old = {e["file"]: e.get("hash") for e in json.loads(manifest_path.read_text("utf-8"))["lines"]}
        except (json.JSONDecodeError, KeyError):
            old = {}

    # Duyệt toàn bộ trước khi gọi API: lỗi kịch bản thì dừng, không tốn credit.
    rows, problems = [], []
    for beat in data["beats"]:
        for i, line in enumerate(beat["lines"], start=1):
            key = f"{beat['id']}-l{i:02d}"
            speak = (line.get("speak") or "").strip()
            if not speak:
                problems.append(f"{key}: thiếu 'speak'")
            elif LATEX_HINT.search(speak):
                problems.append(f"{key}: 'speak' còn ký hiệu toán: {speak!r}")
            rows.append((beat["id"], i, key, speak, line.get("text", speak)))
    if problems:
        print("Kịch bản chưa sẵn sàng — sửa ở B1 rồi chạy lại:")
        for p in problems:
            print("  ✗ " + p)
        return 1

    def selected(beat_id: str, key: str) -> bool:
        return not args.only or beat_id in args.only or key in args.only

    todo = []
    for beat_id, _, key, speak, _ in rows:
        target = out_dir / f"{key}.mp3"
        cached = old.get(target.name) == line_hash(voice, speed, speak) and target.exists()
        if selected(beat_id, key) and (args.force or not cached):
            todo.append((key, speak, target))

    chars = sum(len(s) for _, s, _ in todo)
    print(f"Giọng {voice_name} · tốc độ {speed} · {len(todo)} dòng cần tạo · {chars} ký tự (≈ {chars} credit)")
    if args.estimate or not todo:
        return 0

    ffmpeg = find_ffmpeg()
    out_dir.mkdir(parents=True, exist_ok=True)
    failed: list[tuple[str, str]] = []

    def run(item: tuple[str, str, Path]) -> None:
        key, speak, target = item
        try:
            synthesize(key_api, ffmpeg, speak, voice, speed, target)
            print(f"✓ {key}.mp3")
        except Exception as e:
            failed.append((key, str(e)))

    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        list(pool.map(run, todo))

    failed_keys = {k for k, _ in failed}
    entries, missing = [], []
    for beat_id, i, key, speak, text in rows:
        target = out_dir / f"{key}.mp3"
        h = line_hash(voice, speed, speak)
        fresh = any(k == key for k, _, _ in todo) and key not in failed_keys
        if not target.exists():
            missing.append(key)
            continue
        if not fresh and old.get(target.name) != h:
            missing.append(f"{key} (audio cũ, lệch kịch bản/giọng)")
        entries.append({"beat": beat_id, "line": i, "file": target.name, "hash": h if fresh else old.get(target.name), "text": text})

    manifest = {"slug": data["slug"], "engine": "vivibe", "voice": voice, "voice_name": voice_name, "speed": speed, "lines": entries}
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"\nTạo mới {len(todo) - len(failed)}, lỗi {len(failed)} → {out_dir.relative_to(ROOT)}")
    for k, why in failed:
        print(f"  ✗ {k}: {why}")
    if missing:
        print("Chưa có audio khớp: " + ", ".join(missing))
    return 1 if failed or missing else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except ApiError as e:
        sys.exit(f"Lỗi Vivibe API: {e}")
