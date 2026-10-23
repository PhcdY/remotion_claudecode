"""Tra thời điểm trong video → beat, dòng, lời đang đọc (để đối chiếu góp ý "phút 1:23 khó hiểu" hoặc chỗ người xem bỏ đi).

Dùng:
    python scripts/beat_at.py <compositionId> 1:23 2:05 95.5
Cần out/<compositionId>.timeline.json — tạo bằng `node scripts/export-captions.mjs <slug> [--id <compositionId>]`
(đúng bản đã render; sửa kịch bản/audio thì tạo lại).
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def seconds(s: str) -> float:
    parts = [float(p.replace(",", ".")) for p in s.split(":")]
    t = 0.0
    for p in parts:
        t = t * 60 + p
    return t


def mmss(t: float) -> str:
    return f"{int(t // 60)}:{t % 60:04.1f}"


def main() -> int:
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    cid = sys.argv[1]
    p = ROOT / "out" / f"{cid}.timeline.json"
    if not p.exists():
        sys.exit(f"Không thấy {p.relative_to(ROOT)} — chạy: node scripts/export-captions.mjs <slug> --id {cid}")
    data = json.loads(p.read_text(encoding="utf-8"))
    lines = data["lines"]
    for arg in sys.argv[2:]:
        t = seconds(arg)
        # dòng đang đọc, hoặc dòng vừa đọc xong nếu t rơi vào khoảng nghỉ
        cur = None
        for ln in lines:
            if ln["start"] <= t:
                cur = ln
        if cur is None:
            print(f"{arg}: trước dòng đầu (intro)")
            continue
        state = "đang đọc" if t <= cur["end"] else "khoảng nghỉ sau"
        i = lines.index(cur)
        print(f"{arg} ({mmss(t)}): {cur['beat']} dòng {cur['line']} [{cur['section']}] — {state} ({mmss(cur['start'])}–{mmss(cur['end'])})")
        print(f"    lời:  {cur['speak']}")
        if cur.get("show"):
            print(f"    hình: {cur['show']}")
        if cur.get("text"):
            print(f"    chữ:  {cur['text']}")
        if i > 0:
            prev = lines[i - 1]
            print(f"    trước đó ({prev['beat']} dòng {prev['line']}): {prev['speak']}")
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.exit(main())
