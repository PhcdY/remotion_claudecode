---
name: kiem-tra
description: Chạy kiểm tra máy cho một video (check_script, npm run lint, check-layout) trong agent riêng chạy Haiku, chỉ trả về lỗi/cảnh báo. Dùng khi phiên chính cần kiểm nhanh một video, hoặc gõ /kiem-tra <slug> [--draft].
argument-hint: <slug> [--draft] [--frames 120,450]
context: fork
agent: chay-kiem-tra
---

# Kiểm tra máy

Tham số: `$ARGUMENTS` (slug, có thể kèm `--draft` cho bản nháp chưa có audio, `--frames …`).

Chạy lần lượt ở gốc project (`D:\Video AI`):
1. `python scripts/check_script.py <slug>` (đặt `PYTHONIOENCODING=utf-8`).
2. `npm run lint`.
3. `node scripts/check-layout.mjs <slug> [--draft] [--frames …]` — chạy lâu, timeout 600000 ms. Ghi toàn bộ output vào file trong scratchpad.

Trả về, gọn:
- Mỗi lệnh: **sạch** hoặc số lỗi/cảnh báo.
- Nguyên văn các dòng LỖI (gom các dòng trùng nội dung, ghi beat/dòng nào bị); cảnh báo liệt kê ngắn.
- Đường dẫn file log đầy đủ.

Không sửa file nào, không đề xuất cách sửa dài dòng.
