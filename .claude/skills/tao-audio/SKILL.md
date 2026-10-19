---
name: tao-audio
description: B2 của pipeline video toán — tạo giọng đọc từ src/videos/<slug>/script.json bằng Vivibe API (giọng clone của người dùng). Dùng khi kịch bản đã chốt và cần audio, hoặc gõ /tao-audio <slug>.
---

# B2 — Tạo audio từ kịch bản

Đầu vào: `src/videos/<slug>/script.json` (output của B1, đã được người dùng chốt).
Đầu ra: `public/audio/<slug>/` gồm `<beatId>-lNN.mp3` (mỗi dòng 1 file) + `manifest.json`.

Giọng chuẩn: **giọng clone của người dùng trên Vivibe**, gọi qua API bằng `scripts/vivibe_tts.py`. Mọi việc gọi API, chờ, tải, đổi WAV → MP3, ghi manifest đều do script làm — không gọi API tay, không tải file tay.
`scripts/tts.py` (Edge TTS) chỉ để test nhanh, không dùng cho video đăng.

## Yêu cầu giọng đọc

Giọng phải nghe như **một giáo viên đang giảng cho học sinh**: rõ, ấm, có nhịp, có nhấn vào ý chính, ngắt hơi theo cụm nghĩa. Không đều đều kiểu đọc máy, không ngắt giữa cụm từ.
Vivibe không có thẻ chỉnh tông; tông giọng đến từ mẫu clone, nhịp đến từ **`speak` ở B1**: dấu câu đặt đúng cụm nghĩa, câu ngắn. Đọc sai hay ngắt sai thì sửa `speak` ở B1 rồi tạo lại dòng đó, không chỉnh file audio.

## Cấu hình

1. API key: người dùng tự tạo ở vivibe.app/docs/api-keys và tự thêm `VIVIBE_API_KEY=...` vào `.env` ở gốc project (đã gitignore). **Không** hỏi, đọc, in hay ghi key ở bất kỳ đâu khác. Thiếu key thì script báo, nhắc người dùng.
2. **Giọng không cố định — hỏi người dùng mỗi lần chạy B2.** Chạy `python scripts/vivibe_tts.py --list-voices`, đưa danh sách tên giọng cho người dùng chọn. Không tự chọn, không lấy lại giọng của lần trước khi chưa hỏi. Giọng đã chọn truyền vào mọi lệnh của lần chạy đó bằng `--voice "<tên hoặc id>"`.
3. `speed` trong `scripts/tts_config.json` (0.5–2.0, mặc định 1.0). Chỉ đổi khi người dùng nghe xong thấy nhanh/chậm.
4. Đổi giọng hay `speed` làm cache mất hiệu lực → cả bài tạo lại (báo người dùng số ký tự trước). Cả bài một video phải cùng một giọng.

## Các bước

1. **Kiểm tra + báo chi phí:** `python scripts/vivibe_tts.py src/videos/<slug>/script.json --voice "<giọng>" --estimate`.
   Script duyệt cả kịch bản trước: dòng thiếu `speak` hay `speak` còn ký hiệu toán → dừng, báo người dùng sửa ở B1 (**không tự viết `speak`**).
   Hợp lệ thì in số dòng cần tạo và số ký tự (1 ký tự ≈ 1 credit). Báo người dùng con số này, chờ đồng ý.
2. **Nghe thử beat đầu:** `... --voice "<giọng>" --only b01`. Người dùng nghe ổn mới tạo phần còn lại. Ngắt sai → quay lại B1 sửa `speak`.
3. **Tạo cả bài:** cùng `--voice`, không có `--only`. Dòng nào đã có file khớp (cùng giọng, tốc độ, `speak`) thì bỏ qua.
4. Lỗi một dòng: đọc thông báo, báo người dùng. **Không chạy lại ngay để thử** — mỗi lần gửi là một lần trừ credit. Người dùng đồng ý thì `--only <beatId>-lNN`.
5. Báo cáo: số dòng đã tạo / lỗi, số ký tự đã gửi, tổng thời lượng audio (đo bằng `ffprobe` đi kèm Remotion, `node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe`).

## Quy ước file

- Mỗi dòng `lines[i]` của beat `bXX` → `bXX-l{i+1:02d}.mp3`, đọc trường `speak`.
- Không chèn thẻ điều khiển (như `<break>`) vào `speak`. Nhịp trong câu dựa vào dấu câu; nghỉ giữa các dòng/beat do B3 thêm (GAP_LINE, GAP_BEAT).
- Sửa một dòng ở B1 → chạy lại script với **đúng giọng đã dùng cho bài** (xem `voice_name` trong `manifest.json`, hỏi lại người dùng nếu muốn đổi); cache tự nhận ra dòng đổi.
- `manifest.json` giữ định dạng cũ (beat, line, file, hash, text + engine/voice/voice_name/speed) nên B3 không phải sửa. Dòng chưa có audio khớp kịch bản được script báo ở cuối.
- Các trường khác (`section`, `keyword`, `visual`, `title`, `exams`) bỏ qua — chúng dành cho B3.

## Ghi chú

- Không sửa file trong `public/audio/` bằng tay.
- `--force` tạo lại dòng được chọn dù cache khớp; chỉ dùng khi người dùng muốn một bản đọc khác.
