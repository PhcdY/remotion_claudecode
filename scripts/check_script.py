"""Kiểm script.json theo các luật máy kiểm được (skill viet-kich-ban › Bước 3).

Dùng:
    python scripts/check_script.py <slug>
    python scripts/check_script.py src/videos/<slug>/script.json
    python scripts/check_script.py --goi <mon>     (người bảo trì: gói môn có tự dùng từ mình cấm không)

Luật chung theo sáu phép thử P0–P5 (skill viet-kich-ban › mục 0). Phần riêng từng môn đọc từ .agents/mon/<mon>.json
(bảng thuật ngữ chốt, ngưỡng "thayLuat") và thẻ bài học references/<môn>/lop-<lớp>/**/bai-<NN>-*.md.
LỖI: phải sửa trước khi sang B2/B3 (thoát mã 1). Lỗi có [mã] ở cuối được bỏ qua khi người dùng đã duyệt
ngoại lệ ("ngoaiLeDaDuyet" trong script.json).
CẢNH BÁO: luật style — sửa, hoặc ghi lý do giữ trong báo cáo.
CẦN NGHE THỬ: dòng B2 phải gửi người dùng nghe trước khi tạo cả bài.
Các luật cần đọc hiểu (không nhảy bước, đúng toán, nhịp hình…) vẫn kiểm bằng checklist trong skill.
"""

from __future__ import annotations

import json
import re
import unicodedata
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MON_DIR = ROOT / ".agents" / "mon"
PHONETIC_DICT_PATH = ROOT / "scripts" / "phonetic_dict.json"

# Nạp từ điển phiên âm chuẩn
PHONETIC_DICT = {}
if PHONETIC_DICT_PATH.exists():
    try:
        PHONETIC_DICT = json.loads(PHONETIC_DICT_PATH.read_text(encoding="utf-8"))
    except Exception:
        pass

# Đề xuất giọng theo phân loại môn học
SUBJECT_VOICE_ROSTER = {
    "toan": ("nam - c Bình", "Môn Tự nhiên — giọng dứt khoát, logic"),
    "ly": ("nam - c Bình", "Môn Tự nhiên — giọng dứt khoát, khoa học"),
    "hoa": ("nam - c Bình", "Môn Tự nhiên — phát âm chuẩn thuật ngữ IUPAC"),
    "tin": ("nam - c Bình", "Môn Tự nhiên — tư duy thuật toán"),
    "su": ("nữ - c Nhi", "Môn Xã hội — truyền cảm, giàu cảm xúc"),
    "dia": ("nữ - c Nhi", "Môn Xã hội — biểu cảm, gần gũi"),
    "van": ("nữ - c Nhi", "Môn Xã hội — ngân vang, lắng đọng"),
    "ktpl": ("nữ - c Nhi", "Môn Xã hội — rõ ràng, đĩnh đạc"),
    "sinh": ("nam - c Bình", "Môn Tự nhiên — giọng dứt khoát, logic"),
    "anh": ("anh-male", "Môn Ngoại ngữ — mô hình đa ngôn ngữ chuẩn ngữ âm IPA"),
    "gtktpl": ("nữ - c Nhi", "Môn Xã hội — rõ ràng, đĩnh đạc (alias của ktpl)"),
    "tienganh": ("anh-male", "Môn Ngoại ngữ — mô hình đa ngôn ngữ chuẩn ngữ âm IPA (alias của anh)"),
}

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
# dấu hiệu một dòng `show` gói nhiều thay đổi
MULTI_CHANGE = re.compile(r"\b(rồi|sau đó|tiếp theo|đồng thời|cùng lúc)\b|;|\+|→.*→")

# Ký hiệu / Công thức Hóa học thô cấm xuất hiện trong speak
RAW_CHEM = re.compile(r"\b(CH3COOH|C2H5OH|CH3COOC2H5|H2SO4|HCl|HNO3|NaOH|KOH|Fe2O3|FeO|Fe3O4|Al2O3|NaCl|CaCO3|CO2|SO2|CH4|C2H6|C2H4|C2H2|C6H6)\b", re.IGNORECASE)
# Chữ viết tắt môn Sử/Địa/Khoa học cần phiên âm có gạch nối
RAW_ABBR = re.compile(r"\b(ASEAN|NATO|UNESCO|WTO|DNA|RNA|APEC|TCN|SCN)\b")

# --- Bảng thuật ngữ chốt + ngưỡng của gói môn (file máy đọc .agents/mon/<mon>.json) ---
# Phép thử P4 "một khái niệm một tên" (skill viet-kich-ban › mục 0). Cách viết file: .agents/mon/_mau.md › File máy đọc.
W_ = r"(?<![\wÀ-ỹ])"
_W = r"(?![\wÀ-ỹ])"
TERM_FIELDS = ("title", "keyword", "text", "caption", "speak")
_ACCENT = {"oá": "óa", "oà": "òa", "oả": "ỏa", "oã": "õa", "oạ": "ọa", "uý": "úy", "uỳ": "ùy", "uỷ": "ủy", "uỹ": "ũy", "uỵ": "ụy"}

# Ngưỡng mặc định (tầng 2 — gói môn được thay trong "thayLuat"; luật tầng 1 không có khóa ở đây nên không tắt được)
DEFAULTS = {
    "canhToiDa": 3, "hienTuongToiDaGiay": 20, "giaiDapGiay": [15, 30], "beatToiDaGiay": 40,
    "tongGiay": [TOTAL_MIN, TOTAL_MAX], "kyTu": [CHARS_MIN, CHARS_MAX],
}
DEFAULTS_BY_LOAI = {"bai-hoc": {"canhToiDa": 5}}
LOAI = ("bai-hoc", "hien-tuong")
# video bài học được mở bằng hiện tượng, câu đề thi hoặc cách hiểu sai (viet-kich-ban › Video bài học)
HOOK_SECTIONS_BAI_HOC = {"HIỆN TƯỢNG", "CÂU HỎI", "TRONG ĐỀ THI", "BẪY THƯỜNG GẶP", "GỐC RỄ"}
EXAM_SECTIONS = {"TRONG ĐỀ THI", "BẪY THƯỜNG GẶP"}
# P3: lời so sánh → hình phải cho thấy đúng chỗ giống/khác (danh sách để soát stills, không tính lỗi)
COMPARE = re.compile(
    W_ + r"(giống|khác nhau|khác hẳn|khác với|mạnh hơn|yếu hơn|nhanh hơn|chậm hơn|lớn hơn|nhỏ hơn|nhiều hơn|ít hơn"
    r"|cao hơn|thấp hơn|tương tự|so với|cùng kiểu)" + _W,
    re.IGNORECASE,
)
MAX_WAIVERS = 2
# Hình/số tượng trưng: không nhãn "mô hình", lời đọc không giải thích "đây là mô hình" (viet-kich-ban › Hình và số tượng trưng,
# người dùng chốt 10/11/2026). Cần ghi chú thì nhãn nhỏ "Số liệu minh họa" / "Ảnh minh họa" ghi trong visual.
MODEL_LABEL = re.compile(r"mô hình\s+(giản lược|minh ho[ạa]|đơn giản)|không phải số liệu thật|^\s*mô hình\s*(:|$)|mô hình\s*[,:]?\s*không phải", re.IGNORECASE)
MODEL_SPEAK = re.compile(r"(đây là|chỉ là|dùng) (một )?mô hình|tình huống giả định|không phải số liệu (thật|của)|để dễ hình dung", re.IGNORECASE)
MODEL_HINT = "bỏ nhãn; số dễ tưởng là thật thì nhãn nhỏ 'Số liệu minh họa' ghi trong visual (viet-kich-ban › Hình và số tượng trưng)"


def norm_vi(t: str) -> str:
    """Chữ thường + đưa 'hoá'/'hóa' (hai kiểu bỏ dấu) về một dạng, để so cụm từ."""
    t = unicodedata.normalize("NFC", t).lower()
    for a, b in _ACCENT.items():
        t = t.replace(a, b)
    return re.sub(r"\s+", " ", t)


def vi_pattern(phrase: str) -> str:
    """Cụm chữ thường → regex: khoảng trắng co giãn, chấp nhận cả 'hoá'/'hóa', 'thuỷ'/'thủy'."""
    p = re.escape(norm_vi(phrase.strip()))
    p = p.replace(r"\ ", r"\s+")
    for a, b in _ACCENT.items():
        p = p.replace(b, f"(?:{a}|{b})")
    return p


def load_goi(subject: str) -> tuple[dict, list[str]]:
    """Đọc .agents/mon/<mon>.json; trả về (dữ liệu, các lỗi định dạng)."""
    f = MON_DIR / f"{subject}.json"
    if not f.exists():
        return {}, []
    try:
        data = json.loads(f.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        return {}, [f"{f.relative_to(ROOT)} không phải JSON hợp lệ: {e}"]
    probs = []
    for k in (data.get("thayLuat") or {}):
        if k in LOAI:
            for kk in data["thayLuat"][k]:
                if kk not in DEFAULTS:
                    probs.append(f"{f.name} › thayLuat.{k}: khóa '{kk}' không có (chỉ thay được: {', '.join(DEFAULTS)})")
        elif k not in DEFAULTS:
            probs.append(f"{f.name} › thayLuat: khóa '{k}' không có (chỉ thay được: {', '.join(DEFAULTS)})")
    rules = []
    for i, r in enumerate(data.get("thuatNgu") or []):
        if r.get("regex"):
            try:
                rx = re.compile(r["regex"], re.IGNORECASE)
            except re.error as e:
                probs.append(f"{f.name} › thuatNgu[{i}]: regex lỗi: {e}")
                continue
        elif r.get("khongDung"):
            rx = re.compile(W_ + "(" + "|".join(vi_pattern(w) for w in r["khongDung"]) + ")" + _W, re.IGNORECASE)
        else:
            probs.append(f"{f.name} › thuatNgu[{i}]: cần 'khongDung' hoặc 'regex'")
            continue
        if r.get("muc", "loi") not in ("loi", "canh-bao"):
            probs.append(f"{f.name} › thuatNgu[{i}]: muc phải là 'loi' hoặc 'canh-bao'")
        ex = [re.compile(vi_pattern(e), re.IGNORECASE) for e in r.get("ngoaiLe") or []]
        code = r.get("ma") or "thuat-ngu:" + (r.get("khongDung") or ["?"])[0].strip().lower().replace(" ", "-")
        rules.append({**r, "_rx": rx, "_ex": ex, "_ma": code})
    data["_rules"] = rules
    return data, probs


def limits(goi: dict, loai: str | None) -> dict:
    lim = dict(DEFAULTS)
    lim.update(DEFAULTS_BY_LOAI.get(loai or "", {}))
    tl = goi.get("thayLuat") or {}
    lim.update({k: v for k, v in tl.items() if k in DEFAULTS})
    lim.update({k: v for k, v in (tl.get(loai or "") or {}).items() if k in DEFAULTS})
    return lim


def term_hits(rules: list[dict], field: str, value: str):
    """Mỗi luật báo tối đa một lần cho một trường: (luật, chữ trúng)."""
    if not value:
        return
    plain = MATH.sub(" ", value)
    for r in rules:
        if r.get("truong") and field not in r["truong"]:
            continue
        spans = [m.span() for e in r["_ex"] for m in e.finditer(plain)]
        for m in r["_rx"].finditer(plain):
            a, b = m.span(1) if r.get("khongDung") else m.span(0)
            if any(s <= a and b <= e for s, e in spans):
                continue
            yield r, m.group(1) if r.get("khongDung") else m.group(0)
            break


def check_terms(rules: list[dict], where: str, field: str, value: str, errors: list[str], warns: list[str]) -> None:
    for r, hit in term_hits(rules, field, value):
        tpl = r.get("thongBao") or "{noi}: {truong} dùng '{tu}' — thuật ngữ chốt của môn: {dung}"
        msg = tpl.format(noi=where, truong=field, tu=hit, dung=r.get("dung", "")) + f" [{r['_ma']}]"
        (errors if r.get("muc", "loi") == "loi" else warns).append(msg)


# --- Hóa: chỉ những gì gắn với font/thumb/mhchem (gói hoa.md › 6.1, 6.9) — thuật ngữ đã ở .agents/mon/hoa.json ---
HOA_SUPERSCRIPT = re.compile(r"[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]")


# --- Thẻ bài học (references/_mau-the-bai-hoc.md) — phép thử P0 "đúng và đủ nội dung đã duyệt" ---
def subject_has_cards(subject: str) -> bool:
    base = ROOT / "references" / subject
    return base.exists() and any("## Từ khóa kiểm tra" in f.read_text(encoding="utf-8") for f in base.rglob("bai-*.md"))


def lesson_card(subject: str, s: dict) -> tuple[Path | None, list[tuple[str, str, list[str]]]]:
    """Thẻ = file references/<môn>/lop-<lop>/**/bai-<NN>-*.md có mục '## Từ khóa kiểm tra'. Trả về (thẻ, các mục)."""
    m = re.search(r"Bài\s*(\d+)", str(s.get("bai", "")))
    lop = s.get("lop")
    if not m or not lop:
        return None, []
    base = ROOT / "references" / subject / f"lop-{lop}"
    hits = sorted(base.rglob(f"bai-{int(m.group(1)):02d}-*.md")) if base.exists() else []
    cards = [h for h in hits if "## Từ khóa kiểm tra" in h.read_text(encoding="utf-8")]
    if not cards:
        return None, []
    card = cards[0]
    items: list[tuple[str, str, list[str]]] = []
    section = card.read_text(encoding="utf-8").split("## Từ khóa kiểm tra", 1)[1]
    for line in section.splitlines():
        mm = re.match(r"\s*-\s*([KT]\d+)\s+([^:]+):\s*(.+)", line)
        if mm:
            items.append((mm.group(1), mm.group(2).strip(), [a.strip() for a in mm.group(3).split("|") if a.strip()]))
    return card, items


def card_traps(card: Path) -> list[str]:
    """Mã bẫy thi T1, T2… trong mục '## 2. Bẫy thi' của thẻ."""
    txt = card.read_text(encoding="utf-8")
    m = re.search(r"^##\s*2\.\s*Bẫy thi(.*?)(?=^##\s)", txt, re.S | re.M)
    return re.findall(r"^\s*[-|]\s*\**(T\d+)\b", m.group(1), re.M) if m else []


# --- D2: gói môn tự soát theo chính bảng thuật ngữ của nó (py scripts/check_script.py --goi <mon>) ---
GOI_COLS = re.compile(r"speak|lời đọc|trên hình|đúng|^dùng", re.IGNORECASE)


def check_goi(subject: str) -> list[str]:
    goi, probs = load_goi(subject)
    md = MON_DIR / f"{subject}.md"
    if not md.exists():
        return probs + [f"không có {md.relative_to(ROOT)}"]
    rules = goi.get("_rules") or []
    out = list(probs)
    header: list[str] | None = None
    in_code = False
    for n, line in enumerate(md.read_text(encoding="utf-8").splitlines(), 1):
        st = line.strip()
        if st.startswith("```"):
            in_code = not in_code
            continue
        cells: list[tuple[str, str]] = []
        if in_code:
            cells = [("khối code", re.sub(r"\S*/\S*", " ", st))]  # bỏ đường dẫn file
        elif st.startswith("|"):
            row = [c.strip() for c in st.strip("|").split("|")]
            if header is None:
                header = row
                continue
            if all(re.fullmatch(r":?-+:?", c) for c in row if c):
                continue
            cells = [(h, c) for h, c in zip(header, row) if GOI_COLS.search(h.strip("*` ")) and "không" not in h.lower()]
        else:
            header = None
        for col, val in cells:
            field = "speak" if re.search(r"speak|lời đọc", col, re.IGNORECASE) else "text"
            for r, hit in term_hits(rules, field, val):
                before = norm_vi(val[: max(0, norm_vi(val).find(norm_vi(hit)))][-30:])
                if re.search(r"không|cấm|tránh|sai", before):
                    continue  # câu đang cấm chính từ đó ("Không bao giờ 'nhóm 1'")
                out.append(f"{md.name} dòng {n}, cột '{col}': có '{hit}' — bảng thuật ngữ chốt của chính gói ghi {r.get('dung', '')} [{r['_ma']}]")
    return out


def tokens_in(phrase: str, speak: str) -> bool:
    """Cụm có nằm nguyên văn trong lời đọc không (tách từ như scripts/align_words.py)."""
    strip = re.compile(r"^[\"'“”‘’(\[]+|[\"'“”‘’)\],.:;?!…]+$")
    tok = lambda s: [w for w in (strip.sub("", r).lower() for r in s.replace("...", "…").split()) if w]
    p, t = tok(phrase), tok(speak)
    return bool(p) and any(t[i:i + len(p)] == p for i in range(len(t) - len(p) + 1))


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
    if sys.argv[1] == "--goi":
        if len(sys.argv) < 3:
            sys.exit("Dùng: python scripts/check_script.py --goi <mon>")
        probs = check_goi(sys.argv[2])
        print(f"Gói {sys.argv[2]}: {len(probs)} chỗ cần soát (gói tự mâu thuẫn với bảng thuật ngữ / thayLuat lạ)")
        for p in probs:
            print(f"  - {p}")
        return 1 if probs else 0
    path, s = load(sys.argv[1])
    errors: list[str] = []
    warns: list[str] = []
    listen: list[str] = []
    compare: list[str] = []
    approved: list[str] = []

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
        errors.append(f"không có gói môn {MON_DIR.relative_to(ROOT)}/{subject}.md — tạo từ _mau.md cùng người dùng")
    if s.get("lop") is None or not s.get("chuong") or not s.get("bai"):
        warns.append("thiếu lop/chuong/bai (theo SGK) → video render vào out/_lam-viec/ thay vì thư mục bài")
    loai = s.get("loai")
    if loai is not None and loai not in LOAI:
        errors.append(f"loai '{loai}' không hợp lệ — chỉ 'bai-hoc' hoặc 'hien-tuong' (viet-kich-ban › Loại video)")
        loai = None
    goi, goi_probs = load_goi(subject)
    errors += [f"gói môn: {p}" for p in goi_probs]
    lim = limits(goi, loai)

    # Gợi ý voice theo môn học
    rec_voice = SUBJECT_VOICE_ROSTER.get(subject)
    voice_hint = f"Môn '{subject}' — Đề xuất giọng: '{rec_voice[0]}' ({rec_voice[1]})" if rec_voice else ""

    beats = s.get("beats") or []
    if not beats:
        errors.append("không có beat nào")
        beats = []
    # định dạng mới (23/10/2026): scene ở beat, show/at ở từng dòng
    v2 = any("show" in l for b in beats for l in (b.get("lines") or []))
    if beats and not v2:
        warns.append("kịch bản định dạng cũ: chưa có scene/show/at (bỏ qua nếu là video cũ)")
    scenes: list[int] = []

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
        if MODEL_LABEL.search(MATH.sub(" ", kw)):
            errors.append(f"{where}: keyword là nhãn \"mô hình\" ('{kw}') — {MODEL_HINT} [mo-hinh]")
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
        if v2:
            sc = b.get("scene")
            if not isinstance(sc, int):
                errors.append(f"{where}: thiếu scene (số cảnh, khớp 'CẢNH n' trong visual)")
            else:
                scenes.append(sc)
                m = re.search(r"CẢNH\s*(\d+)", visual)
                if m and int(m.group(1)) != sc:
                    warns.append(f"{where}: scene {sc} nhưng visual ghi CẢNH {m.group(1)}")
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

            # --- Kiểm tra phiên âm Toán học bắt buộc ---
            hit_vec = re.search(r"\b(vectơ|véc tơ|véc-tơ)\s+[A-Z]\s+[A-Z]\b", speak)
            if hit_vec:
                errors.append(f"{w}: vectơ tên ghép viết rời ('{hit_vec.group(0)}') — Vivibe sẽ đọc sai kiểu tiếng Anh ('O me'); phải viết gạch nối phiên âm như 'véc-tơ ô-mờ', 'véc-tơ a-mờ'")
            hit_j = re.search(r"\b(vectơ|véc tơ|véc-tơ)\s+gi\b|\b(vectơ|véc tơ|véc-tơ)\s+j\b", speak, re.IGNORECASE)
            if hit_j:
                errors.append(f"{w}: vectơ đơn vị j viết là '{hit_j.group(0)}' — Vivibe đọc thành 'giây'; phải viết là 'véc-tơ di'")
            hit_prime = re.search(r"\b[A-Za-z]\s+phẩy\b|\b[A-Za-z]'\b", speak)
            if hit_prime:
                errors.append(f"{w}: ký hiệu phẩy viết là '{hit_prime.group(0)}' — Vivibe đọc sai ('êm phẩy'); phải viết phiên âm như 'mờ-phẩy', 'a-phẩy'")
            hit_end_point = re.search(r"\bđiểm\s+[A-Z][.?!]", speak)
            if hit_end_point:
                warns.append(f"{w}: điểm đứng cuối câu ('{hit_end_point.group(0)}') — Vivibe dễ nuốt âm; nên viết phiên âm như 'điểm mờ.'")

            # --- Kiểm tra Hóa học & Công thức phân tử / cấu tạo (GDPT 2018) ---
            hit_chem = RAW_CHEM.search(speak)
            if hit_chem:
                errors.append(f"{w}: speak chứa công thức hóa học thô ('{hit_chem.group(0)}') — Vivibe sẽ đọc vẹt từng chữ; phải viết phiên âm tên chất (xem scripts/phonetic_dict.json)")

            # Kiểm tra danh pháp IUPAC Hóa học viết nguyên tiếng Anh chưa phiên âm
            if PHONETIC_DICT and "hoa" in PHONETIC_DICT:
                iupac_map = PHONETIC_DICT["hoa"].get("iupac_terms", {})
                for term, info in iupac_map.items():
                    if re.search(rf"\b{re.escape(term)}\b", speak, re.IGNORECASE):
                        warns.append(f"{w}: speak chứa danh pháp tiếng Anh '{term}' — nên viết phiên âm gạch nối '{info['speak']}' để giọng đọc mượt mà")
                        listen.append(f"{w} (thuật ngữ IUPAC): {speak}")

            # --- Kiểm tra chữ viết tắt Lịch sử/Địa lý/Khoa học ---
            hit_abbr = RAW_ABBR.search(speak)
            if hit_abbr:
                errors.append(f"{w}: chữ viết tắt '{hit_abbr.group(0)}' trong speak — phải viết phiên âm gạch nối (vd. 'A-xê-an', 'Na-tô') để AI không đọc đánh vần")

            # --- Kiểm tra tên danh nhân nước ngoài môn Sử/Địa ---
            if PHONETIC_DICT and "su_dia" in PHONETIC_DICT:
                names_map = PHONETIC_DICT["su_dia"].get("names", {})
                for nm, info in names_map.items():
                    if re.search(rf"\b{re.escape(nm)}\b", speak, re.IGNORECASE):
                        warns.append(f"{w}: tên nước ngoài '{nm}' — nên viết phiên âm SGK '{info['speak']}' trong speak")
                        listen.append(f"{w} (tên riêng nước ngoài): {speak}")

            for k in ("text", "caption"):
                if MODEL_LABEL.search(MATH.sub(" ", line.get(k) or "")):
                    errors.append(f"{w}: {k} là nhãn \"mô hình\" ('{line.get(k)}') — {MODEL_HINT} [mo-hinh]")
            mm_ = MODEL_SPEAK.search(speak)
            if mm_:
                warns.append(f"{w}: speak giải thích hình/số tượng trưng ('{mm_.group(0)}') — người xem tự hiểu, bỏ câu này: {speak}")

            mc = COMPARE.search(speak)
            if mc:
                compare.append(f"{w} ('{mc.group(1)}'): {speak}  ← show: {line.get('show') or '—'}")

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

            # --- show / at (định dạng mới) ---
            if v2:
                show = (line.get("show") or "").strip()
                if not show:
                    errors.append(f"{w}: thiếu show (thay đổi trên hình ở dòng này; không đổi thì ghi 'giữ nguyên')")
                elif MULTI_CHANGE.search(re.sub(r"\([^)]*\)|\[[^\]]*\]", "", show)):
                    hit = MULTI_CHANGE.search(re.sub(r"\([^)]*\)|\[[^\]]*\]", "", show)).group(0)
                    warns.append(f"{w}: show có vẻ nhiều hơn một thay đổi ('{hit}'): {show}")
                if text and not (line.get("at") or "").strip():
                    errors.append(f"{w}: có text nhưng thiếu at (chữ gắn vào vật nào)")
            cue = (line.get("cue") or "").strip()
            if cue:
                if not tokens_in(cue, speak):
                    errors.append(f"{w}: cue '{cue}' không có trong speak (phải là cụm nguyên văn của lời đọc)")
                if not line.get("show"):
                    warns.append(f"{w}: có cue nhưng không có show (cue là lúc thay đổi trên hình vào)")

            # --- text ---
            if text:
                if '\t' in text or '\x0b' in text or '\x0c' in text:
                    errors.append(f"{w}: text chứa ký tự điều khiển ẩn (tab/vtab) do gõ thiếu escape lệnh LaTeX (ví dụ '\\to' thành '\\t' + 'o') — sửa thành '\\\\to' hoặc dùng ký tự Unicode '→': {repr(text)}")
                if re.search(r'\$\s*o\s*\$', text):
                    errors.append(f"{w}: text có lỗi rụng lệnh LaTeX '$ o$' — sửa thành ký tự Unicode '→' hoặc '\\\\to': {text}")
                if subject in ('su', 'dia', 'van', 'ktpl', 'gtktpl') and re.search(r'\$\\to\$|\$\\rightarrow\$', text):
                    warns.append(f"{w}: môn xã hội nên dùng trực tiếp ký tự Unicode '→' thay vì LaTeX '$\\to$' để typography mượt mà: {text}")
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

    # --- P4 thuật ngữ chốt: mọi môn có .agents/mon/<mon>.json ---
    rules = goi.get("_rules") or []
    if rules:
        def fields_of(where: str, pairs: list[tuple[str, str]]) -> None:
            for field, value in pairs:
                check_terms(rules, where, field, value, errors, warns)
                if subject == "hoa" and field != "speak" and HOA_SUPERSCRIPT.search(value or ""):
                    errors.append(f"{where}: {field} dùng ký tự mũ Unicode ('{HOA_SUPERSCRIPT.search(value).group(0)}') — font không có glyph, hiện vỡ. Viết $\\ce{{Cu^2+}}$ (hoa.md › 6.9)")
        fields_of("title", [("title", s.get("title", ""))])
        for bi, b in enumerate(beats):
            bid = b.get("id", f"#{bi + 1}")
            fields_of(bid, [("keyword", b.get("keyword", ""))])
            for li, line in enumerate(b.get("lines") or []):
                fields_of(f"{bid}-l{li + 1:02d}", [(f, line.get(f) or "") for f in ("text", "caption", "speak")])

    # --- Hóa: thumb và mhchem (gói hoa.md › 6.1, 6.9) ---
    if subject == "hoa":
        video_tsx = path.parent / "Video.tsx"
        if video_tsx.exists() and "ChemIntro" not in video_tsx.read_text(encoding="utf-8"):
            warns.append("Video.tsx chưa dùng ChemIntro (thumb có hình chính + từ khóa nổi bật) — hoa.md › mục 6.1")
        # \ce cần extension mhchem: nạp khi import bất kỳ thứ gì từ components/chemistry
        raw = json.dumps(s, ensure_ascii=False)
        tsx = "".join(f.read_text(encoding="utf-8") for f in path.parent.glob("*.tsx"))
        if "\\ce{" in raw and tsx and "components/chemistry" not in tsx:
            errors.append("script dùng \\ce{...} nhưng video chưa import gì từ components/chemistry → \\ce hiện thành chữ lỗi đỏ (hoa.md › 6.9)")

    # --- P0 độ phủ theo thẻ bài học (mọi môn; viet-kich-ban › Bảng nội dung, references/_mau-the-bai-hoc.md) ---
    card, items = lesson_card(subject, s)
    if card is None:
        if loai == "bai-hoc" or (loai is None and subject_has_cards(subject)):
            warns.append(
                f"chưa có thẻ bài học cho '{s.get('bai', '?')}' (references/{subject}/lop-<lop>/bai-<NN>-*.md có mục '## Từ khóa kiểm tra') — "
                f"soạn theo references/_mau-the-bai-hoc.md, ghi 'chờ duyệt', cho người dùng duyệt trước khi làm Bảng nội dung"
            )
    else:
        corpus_parts = [s.get("title", "")]
        for b in beats:
            corpus_parts.append(b.get("keyword", ""))
            for line in b.get("lines") or []:
                corpus_parts += [line.get(k) or "" for k in ("text", "caption", "speak")]
        corpus = norm_vi(" ".join(corpus_parts))
        skipped = {norm_vi(x) for x in s.get("boQuaDaDuyet", [])}
        covered = {norm_vi(k): v for k, v in (s.get("daPhuDaDuyet") or {}).items()}
        for kid, name, alts in items:
            keys = (norm_vi(kid), norm_vi(f"{kid} {name}"))
            if any(k in skipped for k in keys):
                continue
            hit = next((covered[k] for k in keys if k in covered), None)
            if hit is not None:
                approved.append(f"{kid} {name}: đã duyệt là có, nói bằng cách khác — {hit}")
                continue
            if not any(norm_vi(a) in corpus for a in alts):
                msg = (
                    f"thiếu kiến thức của thẻ bài học {card.name}: {kid} {name} (kịch bản cần có một trong: {' | '.join(alts)}). "
                    f"CHỈ KHI người dùng đã duyệt: bỏ mục → thêm \"{kid} {name}\" (hoặc \"{kid}\") vào \"boQuaDaDuyet\"; "
                    f"đã có nhưng nói bằng lời khác → \"daPhuDaDuyet\": {{\"{kid}\": \"beat nào, nói thế nào\"}}"
                )
                (warns if loai == "hien-tuong" else errors).append(msg)
        if loai == "bai-hoc":
            traps = [t for t in card_traps(card) if norm_vi(t) not in skipped]
            n_exam = sum(1 for b in beats if b.get("section") in EXAM_SECTIONS)
            if traps and n_exam < len(traps):
                warns.append(
                    f"thẻ có {len(traps)} bẫy thi ({', '.join(traps)}) mà chỉ {n_exam} beat TRONG ĐỀ THI/BẪY THƯỜNG GẶP — "
                    f"bẫy nào gộp vào beat khác thì phải có hình riêng thấy rõ sai/đúng (P3), ghi ở Bảng nội dung"
                )

    # --- video bài học: tiêu đề chứa tên bài (viet-kich-ban › Video bài học) ---
    if loai == "bai-hoc" and s.get("bai"):
        ten_bai = re.sub(r"^\s*Bài\s*\d+\s*[.:]\s*", "", s["bai"])
        if ten_bai and norm_vi(ten_bai) not in norm_vi(s.get("title", "")):
            warns.append(f"video bài học: title nên chứa tên bài '{ten_bai}' (hook chỉ là cửa vào, không thay chủ đề)")

    # --- lối thoát: ngoại lệ người dùng đã duyệt (viet-kich-ban › mục 0, Lối thoát) ---
    waivers = {norm_vi(k): v for k, v in (s.get("ngoaiLeDaDuyet") or {}).items()}
    if waivers:
        kept = []
        for e in errors:
            mm = re.search(r"\[([^\]]+)\]$", e)
            loc = e.split(":", 1)[0]
            key = next((k for k in (norm_vi(f"{loc} {mm.group(1)}"), norm_vi(mm.group(1))) if k in waivers), None) if mm else None
            if key is not None:
                approved.append(f"{e} — ngoại lệ đã duyệt: {waivers[key]}")
            else:
                kept.append(e)
        errors = kept
        if len(waivers) > MAX_WAIVERS:
            warns.append(f"{len(waivers)} ngoại lệ đã duyệt (> {MAX_WAIVERS}) — luật có thể đang sai: báo người bảo trì sửa luật thay vì duyệt tiếp")

    # --- cấu trúc cả bài (ngưỡng: tầng 2, gói môn thay được trong thayLuat) ---
    if len(set(scenes)) > lim["canhToiDa"]:
        warns.append(f"{len(set(scenes))} cảnh (nên ≤ {lim['canhToiDa']}): {sorted(set(scenes))}")
    if beats:
        first = beats[0].get("section")
        if loai == "bai-hoc" and first not in HOOK_SECTIONS_BAI_HOC:
            warns.append(f"beat đầu là {first} — video bài học mở bằng hiện tượng, câu đề thi hoặc cách hiểu sai")
        elif loai != "bai-hoc" and first != "HIỆN TƯỢNG":
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
    g0, g1 = lim["giaiDapGiay"]
    for bid, sec, bsec in beat_secs:
        if bsec > lim["beatToiDaGiay"]:
            warns.append(f"{bid}: ước tính {bsec:.0f} s (> {lim['beatToiDaGiay']} s) — tách beat")
        if sec == "HIỆN TƯỢNG" and bsec > lim["hienTuongToiDaGiay"]:
            warns.append(f"{bid}: HIỆN TƯỢNG ước tính {bsec:.0f} s (≤ {lim['hienTuongToiDaGiay']} s)")
        if sec == "GIẢI ĐÁP" and not g0 <= bsec <= g1:
            warns.append(f"{bid}: GIẢI ĐÁP ước tính {bsec:.0f} s ({g0}–{g1} s)")
    c0, c1 = lim["kyTu"]
    t0, t1 = lim["tongGiay"]
    split_hint = " — video bài học: không tự cắt mục của thẻ/bẫy thi; đề xuất tách video cho người dùng chọn" if loai == "bai-hoc" else ""
    if not c0 <= total_chars <= c1:
        warns.append(f"tổng {total_chars} ký tự speak (nên {c0}–{c1})" + (split_hint if total_chars > c1 else ""))
    if not t0 <= total_sec <= t1:
        warns.append(
            f"thời lượng ước tính {total_sec // 60:.0f}:{total_sec % 60:02.0f} (nên {t0 // 60}:{t0 % 60:02d}–{t1 // 60}:{t1 % 60:02d})"
            + (split_hint if total_sec > t1 else "")
        )

    # --- in kết quả ---
    rel = path.relative_to(ROOT) if path.is_relative_to(ROOT) else path
    n_lines = sum(len(b.get("lines") or []) for b in beats)
    print(f"{rel}: {len(beats)} beat, {n_lines} dòng, {total_chars} ký tự speak, ước tính {total_sec // 60:.0f}:{total_sec % 60:02.0f}")
    loai_txt = loai or '(chưa ghi "loai" — coi là hiện tượng; video bài học ghi "loai": "bai-hoc")'
    card_txt = f" · thẻ bài học: {card.relative_to(ROOT)}" if card else ""
    print(f"Loại video: {loai_txt}{card_txt}")
    if voice_hint:
        print(f"👉 Gợi ý Voice: {voice_hint}")
    if rules:
        n_goi = len(check_goi(subject))
        if n_goi:
            print(f"ℹ Gói {subject} có {n_goi} chỗ tự mâu thuẫn với bảng thuật ngữ của nó — người bảo trì chạy: py scripts/check_script.py --goi {subject}")

    for title, items in (
        ("LỖI", errors), ("CẢNH BÁO", warns), ("CẦN NGHE THỬ", listen),
        ("CẦN SOÁT HÌNH — lời so sánh (P3: stills không tiếng phải thấy đúng chỗ giống/khác)", compare),
        ("ĐÃ DUYỆT (không tính lỗi)", approved),
    ):
        if items:
            print(f"\n{title} ({len(items)})")
            for it in items:
                print(f"  - {it}")
    print(f"\n{len(errors)} lỗi, {len(warns)} cảnh báo.")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.exit(main())
