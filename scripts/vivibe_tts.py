"""B2 — tạo giọng đọc bằng Vivibe API (giọng clone của người dùng).

Dùng:
    python scripts/vivibe_tts.py --list-voices
    python scripts/vivibe_tts.py src/videos/<slug>/script.json --voice "<tên hoặc id>" --estimate
    python scripts/vivibe_tts.py src/videos/<slug>/script.json --voice "<tên hoặc id>" --only b01
    python scripts/vivibe_tts.py src/videos/<slug>/script.json --voice "<tên hoặc id>"
    python scripts/vivibe_tts.py src/videos/<slug>/script.json --voice "<tên hoặc id>" --only b03-l02 --force

API key: biến môi trường VIVIBE_API_KEY, hoặc dòng `VIVIBE_API_KEY=...` trong .env ở gốc project.
Giọng: chọn mỗi lần chạy bằng --voice (người dùng báo). Tốc độ: scripts/tts_config.json (speed); beat có trường "speed" thì dùng tốc độ riêng của beat đó.
Hỗ trợ Multi-Voice: beat hoặc line có trường "voice" riêng thì sẽ dùng giọng riêng đó (phân vai đối thoại).

Hai thứ tiếng trong một dòng (gói anh.md › mục 5): đoạn <en>…</en> trong `speak` đọc bằng giọng tiếng Anh, phần còn lại
bằng giọng Việt. Giọng Anh: --en-voice, mặc định theo `englishVoice` trong tts_config.json (cùng giới với giọng Việt,
để câu không đổi từ giọng nữ sang giọng nam giữa chừng). Mỗi đoạn tạo riêng và lưu ở out/_lam-viec/<audio-dir>/doan-giong/,
nên chỉnh cách ghép không tốn credit. Ghép: cân độ to đoạn Anh theo giọng Việt của dòng, chèn nghỉ theo dấu câu ở chỗ
đổi giọng (scripts/song_ngu.py), ra một MP3 mỗi dòng. Manifest ghi mốc từng đoạn (`segments`) cho align_words.py.

Đầu ra: public/audio/<slug>/<beatId>-lNN.mp3 (mỗi dòng 1 file) + manifest.json.

Hành vi:
- Kiểm tra cả kịch bản trước khi gọi API: dòng trống, `speak` còn ký hiệu toán, thẻ <en> sai → dừng, không tốn credit.
- Cache: dòng có (voice, speed, speak) không đổi và đã có file thì bỏ qua. --force tạo lại các dòng được chọn.
- Không tự gửi lại job tạo giọng khi lỗi (mỗi lần gửi là một lần trừ credit); chỉ retry bước hỏi trạng thái / tải file.
- Vivibe chỉ cho mỗi tài khoản một job tại một thời điểm → tạo lần lượt từng dòng. Bị từ chối vì
  "export in progress" (job chưa được tạo, không trừ credit) thì chờ rồi gửi lại.
- Vivibe trả WAV → cắt lặng đầu/cuối, đổi sang MP3 bằng ffmpeg đi kèm Remotion. Ghi qua file tạm rồi rename.
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
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import song_ngu  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "scripts" / "tts_config.json"
API_URL = "https://api.lucylab.io/json-rpc"
POLL_EVERY = 2.5  # giây, theo khuyến nghị của Vivibe (2–3s)
POLL_TIMEOUT = 300  # giây cho mỗi dòng
BUSY_TIMEOUT = 120  # giây chờ khi tài khoản còn job khác đang chạy
# Cắt lặng thừa ở đầu và cuối file (giữ KEEP_EDGE giây) để nghỉ giữa các dòng do B3 quyết định.
SILENCE_DB, KEEP_EDGE = -45, 0.08
# Đoạn trong dòng ghép giọng giữ lặng mép ngắn hơn: khoảng nghỉ ở chỗ đổi giọng do song_ngu.gap_after quyết định.
SEG_EDGE = 0.02
# Độ to (LUFS) đo trên giọng Việt các bài đã làm (−17…−21): dòng chỉ có tiếng Anh cân về mức này.
NARRATOR_LUFS = -19.0
MAX_GAIN_DB = 10.0
MIX_VERSION = "mix2"  # đổi khi đổi cách ghép → dòng ghép được ghép lại từ đoạn đã lưu, không tốn credit
SAFE_ID = re.compile(r"^[A-Za-z0-9_-]+$")
LATEX_HINT = re.compile(r"[$\\^_{}]")

_VOICES_CACHE: list[dict] | None = None
_RESOLVED_CACHE: dict[str, tuple[str, str]] = {}


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


def find_tool(name: str) -> str:
    bundled = ROOT / "node_modules" / "@remotion" / "compositor-win32-x64-msvc" / f"{name}.exe"
    if bundled.exists():
        return str(bundled)
    found = shutil.which(name)
    if not found:
        sys.exit(f"Không tìm thấy {name} (chạy `npm install` để có bản đi kèm Remotion).")
    return found


def find_ffmpeg() -> str:
    return find_tool("ffmpeg")


def line_hash(voice: str, speed: float, speak: str) -> str:
    return hashlib.sha256(f"vivibe|{voice}|{speed}|{speak}".encode("utf-8")).hexdigest()[:16]


def submit(key: str, speak: str, voice: str, speed: float) -> dict:
    deadline = time.time() + BUSY_TIMEOUT
    while True:
        try:
            return rpc(key, "ttsLongText", {"text": speak, "userVoiceId": voice, "speed": speed})
        except ApiError as e:
            if "export in progress" not in str(e) or time.time() > deadline:
                raise
            time.sleep(POLL_EVERY)


def run_ffmpeg(ffmpeg: str, args: list[str]) -> None:
    res = subprocess.run([ffmpeg, "-y", "-loglevel", "error", *args], capture_output=True, text=True, encoding="utf-8", errors="replace")
    if res.returncode != 0:
        raise ApiError(f"ffmpeg lỗi: {res.stderr.strip()[:300]}")


def trim_filter(ffmpeg: str, wav: Path, keep: float = KEEP_EDGE) -> str:
    """Bộ lọc atrim bỏ lặng đầu/cuối (ffmpeg của Remotion không có silenceremove)."""
    res = subprocess.run(
        [ffmpeg, "-hide_banner", "-i", str(wav), "-af", f"silencedetect=n={SILENCE_DB}dB:d=0.05", "-f", "null", "-"],
        capture_output=True, text=True, encoding="utf-8", errors="replace",
    )
    log = res.stderr
    dur = re.search(r"Duration: (\d+):(\d+):([\d.]+)", log)
    if not dur:
        return "anull"
    total = int(dur[1]) * 3600 + int(dur[2]) * 60 + float(dur[3])
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    begin, end = 0.0, total
    if starts and starts[0] < 0.01 and ends:
        begin = max(0.0, ends[0] - keep)
    if starts and (len(ends) < len(starts) or ends[-1] >= total - 0.05) and starts[-1] > begin:
        end = min(total, starts[-1] + keep)
    return f"atrim=start={begin:.3f}:end={end:.3f},asetpts=PTS-STARTPTS"


def fetch_wav(key: str, speak: str, voice: str, speed: float, wav: Path) -> None:
    """Gửi một job Vivibe, chờ xong, tải WAV về `wav`."""
    job = submit(key, speak, voice, speed)
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

    download_err = None
    for attempt in range(1, 4):
        try:
            with urllib.request.urlopen(status["url"], timeout=120) as r:
                wav.write_bytes(r.read())
            if wav.stat().st_size >= 1000:
                download_err = None
                break
        except Exception as e:
            download_err = e
            time.sleep(2 * attempt)
    if download_err:
        raise ApiError(f"Không thể tải audio từ URL sau 3 lần thử: {download_err}")
    if wav.stat().st_size < 1000:
        raise ApiError(f"File tải về quá nhỏ ({wav.stat().st_size} byte)")


def synthesize(key: str, ffmpeg: str, speak: str, voice: str, speed: float, out: Path) -> None:
    wav = out.with_suffix(".tmp.wav")
    tmp = out.with_suffix(".tmp.mp3")
    try:
        fetch_wav(key, speak, voice, speed, wav)
        run_ffmpeg(ffmpeg, ["-i", str(wav), "-af", trim_filter(ffmpeg, wav), "-codec:a", "libmp3lame", "-q:a", "2", str(tmp)])
        os.replace(tmp, out)
    finally:
        wav.unlink(missing_ok=True)
        tmp.unlink(missing_ok=True)


# ---------- dòng ghép hai giọng ----------

def seg_hash(voice: str, speed: float, text: str) -> str:
    return hashlib.sha256(f"vivibe-seg|{voice}|{speed}|{text}".encode("utf-8")).hexdigest()[:16]


def seg_path(cache_dir: Path, voice: str, speed: float, text: str) -> Path:
    return cache_dir / f"{seg_hash(voice, speed, text)}.wav"


def make_segment(key: str, ffmpeg: str, text: str, voice: str, speed: float, cache_dir: Path) -> Path:
    """WAV của một đoạn (đã cắt lặng mép, 44,1 kHz mono). Đã có trong cache thì dùng lại, không gọi API."""
    target = seg_path(cache_dir, voice, speed, text)
    if target.exists():
        return target
    cache_dir.mkdir(parents=True, exist_ok=True)
    raw = target.with_suffix(".raw.wav")
    tmp = target.with_suffix(".tmp.wav")
    try:
        fetch_wav(key, text, voice, speed, raw)
        run_ffmpeg(ffmpeg, ["-i", str(raw), "-af", trim_filter(ffmpeg, raw, SEG_EDGE) + ",aresample=44100",
                            "-ac", "1", "-c:a", "pcm_s16le", str(tmp)])
        os.replace(tmp, target)
    finally:
        raw.unlink(missing_ok=True)
        tmp.unlink(missing_ok=True)
    return target


def loudness(ffmpeg: str, wav: Path) -> tuple[float | None, float]:
    """(LUFS tích hợp hoặc None nếu không đo được, đỉnh dBTP).
    LUFS cần cửa sổ 0,4 s: đoạn ngắn ("is", "S.") được nối lặp với chính nó tới ≥ 1,2 s rồi mới đo."""
    copies = max(1, -(-1.2 // max(wav_seconds(wav), 0.05)))
    copies = int(min(copies, 30))
    inputs = []
    for _ in range(copies):
        inputs += ["-i", str(wav)]
    graph = "".join(f"[{k}:a]" for k in range(copies)) + f"concat=n={copies}:v=0:a=1,loudnorm=print_format=json"
    res = subprocess.run([ffmpeg, "-hide_banner", *inputs, "-filter_complex", graph, "-f", "null", "-"],
                         capture_output=True, text=True, encoding="utf-8", errors="replace")
    m = re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", res.stderr)
    if not m:
        return None, 0.0
    info = json.loads(m.group(0))
    i, tp = float(info["input_i"]), float(info["input_tp"])
    return (i if i > -60 else None), tp


def wav_seconds(wav: Path) -> float:
    r = subprocess.run([find_tool("ffprobe"), "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(wav)],
                       capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


def mix_line(ffmpeg: str, parts: list[dict], out: Path) -> list[dict]:
    """Ghép các đoạn (dict: lang, text, wav, voice_name) thành một MP3. Trả về mốc từng đoạn cho manifest."""
    levels = [loudness(ffmpeg, p["wav"]) for p in parts]
    vi = [lv[0] for p, lv in zip(parts, levels) if p["lang"] == "vi" and lv[0] is not None]
    target = sum(vi) / len(vi) if vi else NARRATOR_LUFS
    inputs, chains, labels, marks, t = [], [], [], [], 0.0
    for k, (p, (lufs, peak)) in enumerate(zip(parts, levels)):
        gain = 0.0
        if p["lang"] == "en" and lufs is not None:
            gain = max(-MAX_GAIN_DB, min(MAX_GAIN_DB, target - lufs, -1.0 - peak))
        gap = song_ngu.gap_after(p["text"]) if k < len(parts) - 1 else 0.0
        dur = wav_seconds(p["wav"])
        marks.append({"lang": p["lang"], "text": p["text"], "voice_name": p["voice_name"], "start": round(t, 3), "end": round(t + dur, 3)})
        t += dur + gap
        inputs += ["-i", str(p["wav"])]
        chain = f"[{k}:a]aformat=sample_rates=44100:channel_layouts=mono,volume={gain:.2f}dB"
        if gap:
            chain += f",apad=pad_dur={gap:.3f}"
        chains.append(chain + f"[a{k}]")
        labels.append(f"[a{k}]")
    graph = ";".join(chains) + ";" + "".join(labels) + f"concat=n={len(parts)}:v=0:a=1[out]"
    tmp = out.with_suffix(".tmp.mp3")
    try:
        run_ffmpeg(ffmpeg, [*inputs, "-filter_complex", graph, "-map", "[out]", "-codec:a", "libmp3lame", "-q:a", "2", str(tmp)])
        os.replace(tmp, out)
    finally:
        tmp.unlink(missing_ok=True)
    return marks


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
    global _VOICES_CACHE
    if _VOICES_CACHE is None:
        _VOICES_CACHE = rpc(key, "getUserVoices", {"limit": 100, "page": 1}, retries=3).get("items", [])
    return _VOICES_CACHE


def resolve_voice(key: str, wanted: str) -> tuple[str, str]:
    """--voice nhận id hoặc tên giọng (không phân biệt hoa thường) → (id, tên)."""
    if wanted in _RESOLVED_CACHE:
        return _RESOLVED_CACHE[wanted]
    voices = fetch_voices(key)
    for v in voices:
        if wanted == v.get("id") or wanted.casefold() == str(v.get("name", "")).casefold():
            res = (v["id"], v.get("name", v["id"]))
            _RESOLVED_CACHE[wanted] = res
            return res
    names = ", ".join(f"{v.get('name')} ({v.get('id')})" for v in voices) or "không có"
    sys.exit(f"Không thấy giọng {wanted!r}. Giọng hiện có: {names}")


def english_voice_for(config: dict, vi_name: str, override: str | None) -> str:
    """Tên giọng Anh cho phần <en>: --en-voice, rồi bảng englishVoice theo giọng Việt, rồi mặc định."""
    if override:
        return override
    table = config.get("englishVoice") or {}
    return (table.get("theoGiongViet") or {}).get(vi_name) or table.get("macDinh") or "anh-female"


def list_voices(key: str) -> int:
    items = fetch_voices(key)
    if not items:
        print("Tài khoản chưa có giọng nào.")
        return 1
    for v in items:
        lang = v.get("modelInfo", {}).get("apiParams", {}).get("language", "vi")
        print(f"{v.get('id')}  {'✓' if v.get('isActive') else '✗'}  [{lang}]  {v.get('name')}")
    return 0


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8")  # console Windows mặc định cp1252
    ap = argparse.ArgumentParser(description="Tạo audio từng dòng cho script.json bằng Vivibe")
    ap.add_argument("script", type=Path, nargs="?")
    ap.add_argument("--voice", help="id hoặc tên giọng Vivibe mặc định cho lần chạy này (bắt buộc khi tạo)")
    ap.add_argument("--en-voice", help="giọng đọc các đoạn <en>…</en> (mặc định: englishVoice trong tts_config.json, cùng giới với --voice)")
    ap.add_argument("--list-voices", action="store_true", help="in danh sách giọng của tài khoản rồi thoát")
    ap.add_argument("--only", nargs="+", default=[], help="chỉ tạo các beat (b01) hoặc dòng (b01-l02) này")
    ap.add_argument("--estimate", action="store_true", help="chỉ đếm ký tự sẽ gửi, không gọi API")
    ap.add_argument("--force", action="store_true", help="tạo lại dòng được chọn dù đã có cache")
    ap.add_argument("--audio-dir", help="thư mục trong public/audio/ (mặc định = slug); dùng cho bản giọng khác, vd. <slug>-nu")
    args = ap.parse_args()

    key_api = load_api_key()
    if args.list_voices:
        return list_voices(key_api)
    if not args.script:
        ap.error("cần đường dẫn script.json")

    if not args.voice:
        ap.error("cần --voice <id hoặc tên giọng> (xem --list-voices)")
    config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    speed = float(config.get("speed", 1.0))
    default_voice, default_voice_name = resolve_voice(key_api, args.voice)

    data = load_script(args.script)
    audio_dir = args.audio_dir or data["slug"]
    out_dir = ROOT / "public" / "audio" / audio_dir
    seg_dir = ROOT / "out" / "_lam-viec" / audio_dir / "doan-giong"
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
        # Beat có thể chỉ định voice riêng
        b_voice, b_voice_name = default_voice, default_voice_name
        if beat.get("voice"):
            b_voice, b_voice_name = resolve_voice(key_api, str(beat["voice"]))

        for i, line in enumerate(beat["lines"], start=1):
            key = f"{beat['id']}-l{i:02d}"
            speak = (line.get("speak") or "").strip()
            if not speak:
                problems.append(f"{key}: thiếu 'speak'")
            elif LATEX_HINT.search(speak):
                problems.append(f"{key}: 'speak' còn ký hiệu toán: {speak!r}")
            problems += [f"{key}: {p}" for p in song_ngu.problems(speak)]

            # Dòng có thể chỉ định voice riêng (ưu tiên hơn beat)
            l_voice, l_voice_name = b_voice, b_voice_name
            if line.get("voice"):
                l_voice, l_voice_name = resolve_voice(key_api, str(line["voice"]))

            # tốc độ riêng của beat, mặc định theo tts_config.json
            sp = float(beat.get("speed", speed))
            row = {"beat": beat["id"], "line": i, "key": key, "speak": speak, "text": line.get("text", speak),
                   "speed": sp, "voice": l_voice, "voice_name": l_voice_name, "segs": None, "hash": line_hash(l_voice, sp, speak)}
            if song_ngu.has_en(speak) and not song_ngu.problems(speak):
                en_voice, en_name = resolve_voice(key_api, english_voice_for(config, l_voice_name, args.en_voice))
                row["segs"] = [
                    {"lang": lang, "text": text, "send": song_ngu.tts_text(lang, text),
                     "voice": en_voice if lang == "en" else l_voice, "voice_name": en_name if lang == "en" else l_voice_name}
                    for lang, text in song_ngu.segments(speak)
                ]
                row["hash"] = line_hash(f"{l_voice}+{en_voice}+{MIX_VERSION}", sp, speak)
            rows.append(row)
    if problems:
        print("Kịch bản chưa sẵn sàng — sửa ở B1 rồi chạy lại:")
        for p in problems:
            print("  ✗ " + p)
        return 1

    def selected(beat_id: str, key: str) -> bool:
        return not args.only or beat_id in args.only or key in args.only

    def cost(row: dict) -> list[tuple[str, int]]:
        """(giọng, số ký tự) sẽ gửi cho dòng này; đoạn đã lưu thì không tính."""
        if not row["segs"]:
            return [(row["voice_name"], len(row["speak"]))]
        return [(s["voice_name"], len(s["send"])) for s in row["segs"]
                if args.force or not seg_path(seg_dir, s["voice"], row["speed"], s["send"]).exists()]

    todo = []
    voice_counts: dict[str, int] = {}
    for row in rows:
        target = out_dir / f"{row['key']}.mp3"
        cached = old.get(target.name) == row["hash"] and target.exists()
        if selected(row["beat"], row["key"]) and (args.force or not cached):
            todo.append(row)
            for name, n in cost(row):
                voice_counts[name] = voice_counts.get(name, 0) + n

    chars = sum(voice_counts.values())
    mixed = sum(1 for r in todo if r["segs"])
    summary_voices = ", ".join(f"{v}: {c} ký tự" for v, c in voice_counts.items()) or f"{default_voice_name}: 0 ký tự"
    print(f"Giọng chính: {default_voice_name} · tốc độ: {speed} · {len(todo)} dòng cần tạo"
          + (f" ({mixed} dòng ghép giọng Anh–Việt)" if mixed else "") + f" · tổng {chars} ký tự ({summary_voices})")
    if args.estimate or not todo:
        return 0

    ffmpeg = find_ffmpeg()
    out_dir.mkdir(parents=True, exist_ok=True)
    failed: list[tuple[str, str]] = []
    seg_marks: dict[str, list[dict]] = {}

    for row in todo:
        target = out_dir / f"{row['key']}.mp3"
        try:
            if row["segs"]:
                parts = []
                for s in row["segs"]:
                    if args.force:
                        seg_path(seg_dir, s["voice"], row["speed"], s["send"]).unlink(missing_ok=True)
                    wav = make_segment(key_api, ffmpeg, s["send"], s["voice"], row["speed"], seg_dir)
                    parts.append({**s, "wav": wav})
                seg_marks[row["key"]] = mix_line(ffmpeg, parts, target)
                names = " + ".join(dict.fromkeys(s["voice_name"] for s in row["segs"]))
                print(f"✓ {row['key']}.mp3 [{names}]", flush=True)
            else:
                synthesize(key_api, ffmpeg, row["speak"], row["voice"], row["speed"], target)
                print(f"✓ {row['key']}.mp3 [{row['voice_name']}]", flush=True)
        except Exception as e:
            failed.append((row["key"], str(e)))

    old_entries: dict[str, dict] = {}
    if manifest_path.exists():
        try:
            old_entries = {e["file"]: e for e in json.loads(manifest_path.read_text("utf-8"))["lines"]}
        except (json.JSONDecodeError, KeyError):
            pass
    failed_keys = {k for k, _ in failed}
    todo_keys = {r["key"] for r in todo}
    entries, missing = [], []
    for row in rows:
        key = row["key"]
        target = out_dir / f"{key}.mp3"
        fresh = key in todo_keys and key not in failed_keys
        if not target.exists():
            missing.append((row["beat"], key, key))
            continue
        if not fresh and old.get(target.name) != row["hash"]:
            missing.append((row["beat"], key, f"{key} (audio cũ, lệch kịch bản/giọng)"))
        entry = {
            "beat": row["beat"],
            "line": row["line"],
            "file": target.name,
            "hash": row["hash"] if fresh else old.get(target.name),
            "voice": row["voice"],
            "voice_name": row["voice_name"],
            "text": row["text"],
        }
        segs = seg_marks.get(key) if fresh else (old_entries.get(target.name) or {}).get("segments")
        if segs:
            entry["segments"] = segs
        entries.append(entry)

    manifest = {
        "slug": data["slug"],
        "engine": "vivibe",
        "voice": default_voice,
        "voice_name": default_voice_name,
        "speed": speed,
        "lines": entries,
    }
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"\nTạo mới {len(todo) - len(failed)}, lỗi {len(failed)} → {out_dir.relative_to(ROOT)}")
    for k, why in failed:
        print(f"  ✗ {k}: {why}")
    shown = [label for b, k, label in missing if selected(b, k)]
    if shown:
        print("Chưa có audio khớp: " + ", ".join(shown))
    if len(missing) > len(shown):
        print(f"Ngoài phần đã chọn còn {len(missing) - len(shown)} dòng chưa có audio khớp kịch bản.")
    return 1 if failed or shown else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except ApiError as e:
        sys.exit(f"Lỗi Vivibe API: {e}")
