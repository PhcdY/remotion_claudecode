"""Lời đọc hai thứ tiếng: đoạn tiếng Anh trong `speak` được bọc <en>…</en> (gói anh.md › mục 5).

    "speak": "Động từ <en>play</en> chỉ cần thêm <en>s</en>."

- B2 (vivibe_tts.py) đọc đoạn <en> bằng giọng tiếng Anh, phần còn lại bằng giọng Việt, rồi ghép thành một file mỗi dòng.
- Phụ đề, cue, words.json dùng lời đã bỏ thẻ (`plain`). Sửa luật bỏ thẻ ở đây thì sửa cả `src/components/timeline.ts`
  (speakTokens) và `scripts/export-captions.mjs`.
"""

from __future__ import annotations

import re

TAG = re.compile(r"</?en>")
EN = re.compile(r"<en>(.*?)</en>", re.S)
VI_MARK = re.compile(r"[À-ỹđĐ]")
PUNCT_ONLY = re.compile(r"^[\s.,:;?!…\"'“”‘’()\-–—]*$")

# Nghỉ ở chỗ đổi giọng (giây), theo dấu câu ngay trước chỗ đổi.
GAP_NO_PUNCT = 0.14   # giữa cụm: "Động từ | play | chỉ cần…" — đủ tách từ mẫu, không gãy câu
GAP_COMMA = 0.30      # sau , ; :
GAP_SENTENCE = 0.45   # sau . ? ! …


def has_en(speak: str) -> bool:
    return "<en>" in (speak or "")


def plain(speak: str) -> str:
    """Lời đọc bỏ thẻ <en> — dùng cho phụ đề, cue, đếm ký tự."""
    return TAG.sub("", speak or "")


def problems(speak: str) -> list[str]:
    """Lỗi cú pháp thẻ <en> trong một speak."""
    out = []
    depth = 0
    for m in re.finditer(r"<(/?)en>|<[^>]*>", speak or ""):
        if m.group(0) not in ("<en>", "</en>"):
            out.append(f"thẻ lạ '{m.group(0)}' — chỉ dùng <en>…</en>")
            continue
        depth += -1 if m.group(1) else 1
        if depth not in (0, 1):
            out.append("thẻ <en> lồng nhau hoặc đóng thiếu")
            break
    if depth and not out:
        out.append("thẻ <en> mở mà chưa đóng")
    for m in EN.finditer(speak or ""):
        inner = m.group(1)
        if not re.search(r"[A-Za-z]", inner):
            out.append(f"đoạn <en>{inner}</en> không có chữ tiếng Anh")
        elif VI_MARK.search(inner):
            out.append(f"đoạn <en>{inner}</en> có chữ tiếng Việt — chỉ bọc phần tiếng Anh")
    return out


def segments(speak: str) -> list[tuple[str, str]]:
    """[(lang, text)] theo thứ tự đọc. Dấu câu đứng riêng được gộp vào đoạn trước để không gửi một đoạn rỗng."""
    out: list[tuple[str, str]] = []
    pos = 0
    pieces: list[tuple[str, str]] = []
    for m in EN.finditer(speak or ""):
        pieces.append(("vi", speak[pos:m.start()]))
        pieces.append(("en", m.group(1)))
        pos = m.end()
    pieces.append(("vi", (speak or "")[pos:]))
    for lang, text in pieces:
        text = text.strip()
        # dấu câu mở đầu đoạn (", là tính từ") thuộc về đoạn trước: "happy," — để nghỉ đúng chỗ
        lead = re.match(r"^[.,:;?!…]+", text)
        if lead and out:
            out[-1] = (out[-1][0], out[-1][1] + lead.group(0))
            text = text[lead.end():].strip()
        if not text:
            continue
        if PUNCT_ONLY.match(text):
            if out:
                out[-1] = (out[-1][0], out[-1][1] + text)
            continue
        if out and out[-1][0] == lang:
            out[-1] = (lang, out[-1][1] + " " + text)
        else:
            out.append((lang, text))
    return out


def gap_after(text: str) -> float:
    """Nghỉ chèn sau một đoạn khi đoạn sau đổi giọng."""
    t = text.rstrip(" \"'”’)")
    if re.search(r"(\.\.\.|[.?!…])$", t):
        return GAP_SENTENCE
    if re.search(r"[,;:]$", t):
        return GAP_COMMA
    return GAP_NO_PUNCT


def tts_text(lang: str, text: str) -> str:
    """Chữ gửi cho giọng đọc. Chữ cái đứng riêng trong đoạn Anh ("s") viết hoa để giọng Anh đọc tên chữ /es/."""
    if lang == "en" and re.fullmatch(r"[A-Za-z][.?!,]?", text.strip()):
        return text.strip()[0].upper() + "."
    return text
