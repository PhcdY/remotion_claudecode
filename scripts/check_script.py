"""Kiểm script.json theo các luật máy kiểm được (skill viet-kich-ban › Bước 3).

Dùng:
    python scripts/check_script.py <slug>
    python scripts/check_script.py src/videos/<slug>/script.json

LỖI: phải sửa trước khi sang B2/B3 (thoát mã 1).
CẢNH BÁO: luật style — sửa, hoặc ghi lý do giữ trong báo cáo.
CẦN NGHE THỬ: dòng B2 phải gửi người dùng nghe trước khi tạo cả bài.
Các luật cần đọc hiểu (không nhảy bước, đúng toán, nhịp hình…) vẫn kiểm bằng checklist trong skill.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MON_DIR = ROOT / ".claude" / "mon"

# Ước lượng thời lượng (khớp src/components/timeline.ts và đo giọng Vivibe ≈ 20 ký tự/giây)
CHARS_PER_SEC = 20
INTRO, LEAD_IN, GAP_LINE, GAP_BEAT, TAIL, OUTRO = 1.6, 0.3, 0.25, 0.6, 1.0, 2.5
TOTAL_MIN, TOTAL_MAX = 150, 240
CHARS_MIN, CHARS_MAX = 2700, 4300

SECTIONS = {
    "HIỆN TƯỢNG", "CÂU HỎI", "GỐC RỄ", "TRỰC GIÁC", "BẢN CHẤT", "ĐỊNH NGHĨA",
    "CÔNG THỨC", "VÍ DỤ", "TRONG ĐỀ THI", "BẪY THƯỜNG GẶP", "GIẢI ĐÁP", "TỔNG KẾT",
}
SAFE_ID = re.compile(r"^[a-z0-9_-]+$")
MATH = re.compile(r"\$[^$]*\$")
SPEAK_SYMBOLS = re.compile(r"[$\\^_{}=+/'√<>]")
PRONOUNS = re.compile(r"\b(bạn|các em|chúng ta|mình|tôi)\b", re.IGNORECASE)
# "trăm m" làm đơn vị: "(trăm m)", "4 trăm m". Không bắt "một trăm mét" trong speak (đó là số 100).
FAKE_UNITS = re.compile(r"(?:\(\s*|\d\s*)(trăm|chục)\s*(m|mét|km|giây|s|phút)\b", re.IGNORECASE)
UNIT = r"(km/h|m/s²|m/s|km|cm|mm|kg|mg|ml|m|s|h|°C)"
UNIT_GLUED = re.compile(r"\d" + UNIT + r"(?![\wÀ-ỹ/])")
UNIT_IN_MATH = re.compile(r"\d\s*(?:\\[,;:!]|~)?\s*" + UNIT + r"(?![A-Za-z])")
# chữ cái Latin đứng riêng (trừ "y" — từ tiếng Việt) hoặc phiên âm ký hiệu kiểu "ích-không" → nên có caption + nghe thử
PHONETIC = re.compile(r"(?<![\wÀ-ỹ-])[a-xzA-XZ](?![\wÀ-ỹ-])|[\wÀ-ỹ]+-(không|n|một|hai)\b|đen-ta|lô-ga|lốc nê", re.IGNORECASE)
CLOSERS = ("Vậy", "Nói gọn", "Đó là lý do", "Tóm lại", "Nói cách khác")


def words(s: str) -> list[str]:
    """Từ của một chuỗi, mỗi cụm $...$ tính một từ."""
    return MATH.sub(" M ", s).split()


def visible_len(text: str) -> int:
    """Độ dài chữ nhìn thấy: bỏ $ và lệnh LaTeX."""
    def strip(m: re.Match) -> str:
        inner = m.group(0)[1:-1]
        inner = re.sub(r"\\[a-zA-Z]+", "", inner)
        return re.sub(r"[{}^_\\$]", "", inner)
    return len(MATH.sub(strip, text))


def is_pure_math(text: str) -> bool:
    t = text.strip()
    return bool(t) and MATH.fullmatch(t) is not None


def breaks(speak: str) -> int:
    s = speak.strip().replace("...", "…")
    s = re.sub(r"[.?!…]+$", "", s)
    return len(re.findall(r"[,.:;?!…]", s))


def load(arg: str) -> tuple[Path, dict]:
    p = Path(arg)
    if not p.suffix:
        p = ROOT / "src" / "videos" / arg / "script.json"
    if not p.exists():
        sys.exit(f"Không thấy {p}")
    try:
        return p, json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        sys.exit(f"LỖI: {p} không phải JSON hợp lệ: {e}")


def main() -> int:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    path, s = load(sys.argv[1])
    errors: list[str] = []
    warns: list[str] = []
    listen: list[str] = []

    slug = s.get("slug", "")
    if not SAFE_ID.match(slug):
        errors.append(f"slug '{slug}' chỉ được chữ thường, số, '-', '_'")
    if not s.get("title"):
        errors.append("thiếu title")
    subject = s.get("subject")
    if subject is None:
        warns.append("thiếu 'subject' (mặc định toan)")
        subject = "toan"
    if not (MON_DIR / f"{subject}.md").exists():
        errors.append(f"không có gói môn .claude/mon/{subject}.md — tạo từ _mau.md cùng người dùng")

    beats = s.get("beats") or []
    if not beats:
        errors.append("không có beat nào")
        beats = []

    total_chars = 0
    total_sec = INTRO + LEAD_IN + TAIL + OUTRO + GAP_BEAT * max(len(beats) - 1, 0)
    beat_secs: list[tuple[str, str, float]] = []

    for bi, b in enumerate(beats):
        bid = b.get("id", f"#{bi + 1}")
        where = bid
        if not SAFE_ID.match(str(bid)):
            errors.append(f"{where}: id chỉ được chữ thường, số, '-', '_'")
        elif bid != f"b{bi + 1:02d}":
            warns.append(f"{where}: id nên là b{bi + 1:02d} (liên tục; đổi id thì phải tạo lại audio)")
        for field in ("section", "keyword", "visual"):
            if not b.get(field):
                errors.append(f"{where}: thiếu {field}")
        sec = b.get("section", "")
        if sec and sec not in SECTIONS:
            errors.append(f"{where}: section '{sec}' không có trong danh sách nhãn")
        kw = b.get("keyword", "")
        if len(words(kw)) > 6:
            warns.append(f"{where}: keyword {len(words(kw))} từ (> 6): {kw}")
        if "speed" in b:
            warns.append(f"{where}: có 'speed' — làm chậm bằng chia nhỏ dòng, không đặt speed")
        gap = b.get("lineGap", GAP_LINE)
        if gap > 0.5:
            warns.append(f"{where}: lineGap {gap} > 0,5")
        visual = b.get("visual", "")
        if visual and not re.match(r"\s*(CẢNH|Giữ CẢNH|Quay lại)", visual):
            warns.append(f"{where}: visual nên mở bằng 'CẢNH n — …' hoặc 'Giữ CẢNH n.'")
        if FAKE_UNITS.search(visual):
            errors.append(f"{where}: visual dùng đơn vị tự chế ('{FAKE_UNITS.search(visual).group(0)}')")

        lines = b.get("lines") or []
        if not lines:
            errors.append(f"{where}: không có dòng nào")
            continue
        if len(lines) > 8:
            warns.append(f"{where}: {len(lines)} dòng (> 8) — cân nhắc tách beat")
        dots = 0
        bsec = 0.0
        for li, line in enumerate(lines):
            w = f"{bid}-l{li + 1:02d}"
            text = line.get("text")
            speak = (line.get("speak") or "").strip()
            if text is None:
                errors.append(f"{w}: thiếu trường text (để \"\" nếu không có chữ)")
                text = ""
            if not speak:
                errors.append(f"{w}: thiếu speak")
                continue

            # --- speak ---
            if SPEAK_SYMBOLS.search(speak):
                errors.append(f"{w}: speak còn ký hiệu '{SPEAK_SYMBOLS.search(speak).group(0)}' — viết bằng chữ")
            if FAKE_UNITS.search(text):
                errors.append(f"{w}: đơn vị tự chế ('{FAKE_UNITS.search(text).group(0)}') — dùng đơn vị có thật hoặc số trơn")
            dots += speak.count("...")
            nb = breaks(speak)
            if nb > 2:
                warns.append(f"{w}: {nb} chỗ ngắt giữa dòng (≤ 2, nên 1): {speak}")
            for sent in re.split(r"[.?!…]+", speak.replace("...", "…")):
                if len(sent.split()) > 20:
                    warns.append(f"{w}: câu {len(sent.split())} từ (> 20): {sent.strip()}")
            if re.search(r"\?\s*(Và|Mà|Còn)\b", speak):
                warns.append(f"{w}: mở câu bằng Và/Mà/Còn ngay sau câu hỏi")
            m = PRONOUNS.search(speak)
            if m:
                warns.append(f"{w}: xưng hô '{m.group(0)}' — giọng trung tính")
            if PHONETIC.search(speak):
                listen.append(f"{w} (đọc ký hiệu): {speak}")
                if not line.get("caption"):
                    warns.append(f"{w}: speak có phiên âm ký hiệu ('{PHONETIC.search(speak).group(0)}') — thêm caption")

            pause = line.get("pauseAfter")
            if pause is not None:
                if pause > 2:
                    warns.append(f"{w}: pauseAfter {pause} > 2 s")
                if "?" not in speak:
                    warns.append(f"{w}: pauseAfter chỉ dùng sau câu hỏi đoán")
                else:
                    listen.append(f"{w} (câu hỏi đoán — giọng lên cuối câu?): {speak}")

            # --- text ---
            if text:
                if not is_pure_math(text) and visible_len(text) > 40:
                    warns.append(f"{w}: text dài {visible_len(text)} ký tự (≤ ~35): {text}")
                if text.rstrip().endswith("."):
                    warns.append(f"{w}: text là ghi chú, không dấu chấm cuối: {text}")
                outside = MATH.sub(" ", text)
                if UNIT_GLUED.search(outside):
                    warns.append(f"{w}: thiếu khoảng trắng giữa số và đơn vị: {text}")
                for chunk in MATH.findall(text):
                    if UNIT_IN_MATH.search(chunk) and "\\text" not in chunk:
                        warns.append(f"{w}: đơn vị nằm trong $...$ — đặt ngoài: {text}")
                        break
                if "→" in text and re.search(r"bài sau|tức là", text):
                    warns.append(f"{w}: mũi tên → chỉ dùng đúng nghĩa (suy ra, dồn về): {text}")
                if text.strip() == speak.strip():
                    warns.append(f"{w}: text chép nguyên speak")

            chars = len(speak)
            total_chars += chars
            bsec += chars / CHARS_PER_SEC + (pause or 0) + (gap if li > 0 else 0)

        if dots > 1:
            warns.append(f"{bid}: '...' dùng {dots} lần (≤ 1 mỗi beat)")
        if (lines[-1].get("text") or "").strip() and kw:
            warns.append(f"{bid}: dòng cuối có text trong khi keyword hiện cùng lúc — để text \"\"")
        beat_secs.append((bid, sec, bsec))
        total_sec += bsec

    # --- cấu trúc cả bài ---
    if beats:
        if beats[0].get("section") != "HIỆN TƯỢNG":
            warns.append("beat đầu không phải HIỆN TƯỢNG")
        if not any(b.get("section") == "GIẢI ĐÁP" for b in beats):
            warns.append("không có beat GIẢI ĐÁP")
        last = (beats[-1].get("lines") or [{}])[-1].get("speak", "").strip()
        if last:
            if "?" in last:
                warns.append(f"dòng cuối video là câu hỏi — phải là câu kết luận: {last}")
            if len(last.split()) > 15:
                warns.append(f"dòng cuối video {len(last.split())} từ (≤ ~15): {last}")
            if not last.replace("...", "").lstrip().startswith(CLOSERS):
                warns.append(f"dòng cuối video nên mở bằng từ khép lại ({', '.join(CLOSERS)}): {last}")
    for bid, sec, bsec in beat_secs:
        if bsec > 40:
            warns.append(f"{bid}: ước tính {bsec:.0f} s (> 40 s) — tách beat")
        if sec == "HIỆN TƯỢNG" and bsec > 20:
            warns.append(f"{bid}: HIỆN TƯỢNG ước tính {bsec:.0f} s (≤ 20 s)")
        if sec == "GIẢI ĐÁP" and not 15 <= bsec <= 30:
            warns.append(f"{bid}: GIẢI ĐÁP ước tính {bsec:.0f} s (15–30 s)")
    if not CHARS_MIN <= total_chars <= CHARS_MAX:
        warns.append(f"tổng {total_chars} ký tự speak (nên {CHARS_MIN}–{CHARS_MAX})")
    if not TOTAL_MIN <= total_sec <= TOTAL_MAX:
        warns.append(f"thời lượng ước tính {total_sec // 60:.0f}:{total_sec % 60:02.0f} (nên 2:30–4:00)")

    # --- in kết quả ---
    rel = path.relative_to(ROOT) if path.is_relative_to(ROOT) else path
    n_lines = sum(len(b.get("lines") or []) for b in beats)
    print(f"{rel}: {len(beats)} beat, {n_lines} dòng, {total_chars} ký tự speak, ước tính {total_sec // 60:.0f}:{total_sec % 60:02.0f}")
    for title, items in (("LỖI", errors), ("CẢNH BÁO", warns), ("CẦN NGHE THỬ", listen)):
        if items:
            print(f"\n{title} ({len(items)})")
            for it in items:
                print(f"  - {it}")
    print(f"\n{len(errors)} lỗi, {len(warns)} cảnh báo.")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.exit(main())
