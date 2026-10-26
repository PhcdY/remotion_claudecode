---
name: render
description: Render video Remotion ra out/<Môn>/Lớp …/<bài>/ và xuất phụ đề (srt, vtt, timeline.json), chạy trong agent riêng (Haiku). Chỉ dùng khi người dùng bảo render, hoặc gõ /render <slug> [bat-dau|tien-do|xong] [--id <compositionId>].
argument-hint: <slug> [bat-dau|tien-do|xong] [--id <compositionId>]
context: fork
agent: render-video
---

# Render + phụ đề (agent riêng)

Tham số: `$ARGUMENTS` — slug, chế độ (mặc định `bat-dau`), `--id` khi render bản giọng khác `<slug>-<hậu tố>` (mặc định id = slug).
Làm ở gốc project `D:\Video AI`. Không hỏi người dùng, không sửa code.

## Chế độ `bat-dau`

1. Kiểm: `src/videos/<slug>/Video.tsx` không còn `draft: true` trong `defaultProps`; `script.json` có `lop`, `chuong`, `bai`. Thiếu → dừng, báo lý do (không render bản đăng từ timeline nháp).
2. Lấy đường dẫn: `node scripts/out-path.mjs <slug> --id <id>` → `out/<Môn>/Lớp <lop>/<chuong>/<bai>/<id>.mp4`. Không ghi gì khác ra gốc `out/`.
3. Khởi động render **tách khỏi agent** (render 7000 frame mất ~15 phút, dài hơn thời gian một lệnh), ghi log vào scratchpad:
   ```
   nohup npx remotion render <id> "<đường dẫn mp4>" > "<scratchpad>/render-<id>.log" 2>&1 &
   ```
   Không dùng `--log=error` (mất dòng tiến độ).
4. Trả về: đường dẫn log, đường dẫn mp4, mốc thời gian (máy người dùng, 21/10/2026: 3:53 ≈ 7000 frame ≈ 14–15 phút; 2:49 ≈ 6–8 phút), và lệnh chờ để phiên chính chạy nền:
   ```
   until grep -qE "MB|rror" "<log>"; do sleep 20; done; tail -3 "<log>"
   ```

## Chế độ `tien-do`

Đọc dòng cuối log (frame đã render / tổng), trả về phần trăm và thời gian còn lại ước tính.

## Chế độ `xong`

1. Log báo lỗi → trả nguyên dòng lỗi cuối log, dừng.
2. Đo thời lượng: `node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe -v error -show_entries format=duration -of csv=p=0 "<mp4>"`.
3. Phụ đề: `node scripts/export-captions.mjs <slug> [--id <id>]` → `<id>.srt`, `.vtt`, `.timeline.json` cạnh video (từ `caption`, thiếu thì `speak`). Không in phụ đề lên hình.
4. Trả về: đường dẫn mp4 + srt, thời lượng. Phiên chính gửi file cho người dùng và nhắc một lần: cho 2–3 học sinh xem thử (skill `dung-video` › Bước 6). `out/` bị gitignore, không commit video.
