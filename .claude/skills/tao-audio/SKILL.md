---
name: tao-audio
description: B2 của pipeline video toán — tạo giọng đọc từ src/videos/<slug>/script.json bằng connector ElevenLabs (MCP). Dùng khi kịch bản đã chốt và cần audio, hoặc gõ /tao-audio <slug>.
---

# B2 — Tạo audio từ kịch bản

Đầu vào: `src/videos/<slug>/script.json` (output của B1, đã được người dùng chốt).
Đầu ra: `public/audio/<slug>/` gồm `<beatId>-lNN.mp3` (mỗi dòng 1 file) + `manifest.json`.

Giọng chuẩn: **ElevenLabs qua connector MCP** (các tool `creative_*`). Không dùng API key hay gọi API trực tiếp. `scripts/tts.py` (Edge TTS) chỉ còn để test nhanh, không dùng cho video đăng.

## Yêu cầu giọng đọc

Giọng phải nghe như **một giáo viên đang giảng cho học sinh**: rõ, ấm, có nhịp, có nhấn vào ý chính, ngắt hơi theo cụm nghĩa. Không đều đều kiểu đọc máy, không ngắt giữa cụm từ.
Ngắt nghỉ phụ thuộc **trước hết vào `speak`** ở B1: dấu câu đặt đúng cụm nghĩa, câu ngắn. Đọc sai hay ngắt sai thì sửa `speak` ở B1 rồi tạo lại dòng đó, không chỉnh file audio.

## Cấu hình giọng (làm một lần, dùng chung mọi video)

1. `creative_list_voices` với `languages: ["vi"]`, `use_cases: ["informative_educational"]` (nới bộ lọc nếu ít kết quả) → chọn 3–4 giọng hợp vai giảng bài.
2. Kiểm model hỗ trợ tiếng Việt bằng `creative_get_model_guide` (không đoán theo trí nhớ). Mặc định thử `eleven_v4`.
3. Cho các giọng đọc cùng **một beat thật** của kịch bản (`generations_count: 1` mỗi giọng). Người dùng nghe rồi chọn. Không tự chốt giọng.
4. Lưu `voice_id`, `model_id` đã chọn vào `scripts/tts_config.json`.
5. Tông chuẩn là **giọng tài liệu**: điềm tĩnh, rõ ràng, không quá vui hay quảng cáo. Giọng gốc lệch tông thì đặt `style_tags` trong config (vd. `"[calm]"`, chỉ với model hỗ trợ audio tag như `eleven_v4`/`eleven_v3`). Thẻ này ghép vào đầu `prompt` lúc tạo, **không** ghi vào `speak`.

## Các bước

1. Kiểm tra `script.json` tồn tại và hợp lệ. Thiếu `speak` ở dòng nào thì báo, **không tự viết thêm** — sửa kịch bản là việc của B1. `speak` còn ký hiệu toán thì báo người dùng sửa ở B1.
2. `creative_create_flow` một flow cho video này; mọi dòng tạo trong cùng flow.
3. **Báo chi phí trước:** gọi `creative_generate_speech` với `estimate_only: true` cho một dòng, nhân ra cả bài, báo người dùng số credit dự kiến và chờ đồng ý.
4. **Nghe thử beat đầu:** tạo các dòng của beat đầu trước. Người dùng nghe ổn mới tạo phần còn lại. Chỗ ngắt sai → quay lại B1 sửa `speak`.
5. Tạo từng dòng: `creative_generate_speech` với `prompt` = `style_tags` (nếu có) + `speak` của dòng, `voice_id`/`model_id` từ `scripts/tts_config.json`, `generations_count: 1`, cùng `flow_id`. Mỗi dòng một lần gọi (B3 cần mốc thời gian từng dòng). **Không gọi lại để thử lại** — mỗi lần gọi là một lần trừ credit. Lỗi thì báo người dùng.
6. Chờ xong bằng `creative_get_flow_run_status` (khi không có view tự theo dõi), lấy đường dẫn file kết quả của từng dòng (`creative_get_flow` / `creative_get_available_assets` → `preview_url`). URL hết hạn nhanh nên lưu ngay.
7. Lưu file về project bằng script (không tải tay):
   ```
   python scripts/save_audio.py src/videos/<slug>/script.json <bảng-url.json>
   ```
   `<bảng-url.json>` = `{ "b01-l01": "<url>", ... }`. Script tải về `public/audio/<slug>/<beatId>-lNN.mp3`, ghi `manifest.json` cùng định dạng cũ (beat, line, file, text, kèm voice/model) và báo thiếu dòng nào. Lần đầu tải file trong phiên thì hỏi người dùng trước.
8. Báo cáo: số dòng đã tạo / lỗi, credit đã dùng, tổng thời lượng audio, link flow để người dùng nghe lại trên canvas.

## Quy ước file

- Mỗi dòng `lines[i]` của beat `bXX` → `bXX-l{i+1:02d}.mp3`. Đọc trường `speak` (không có thì dùng `text`).
- Không chèn thẻ điều khiển (như `<break>`) vào `speak`. Nhịp trong câu dựa vào dấu câu; nghỉ giữa các dòng/beat do B3 thêm (GAP_LINE, GAP_BEAT).
- Sửa một dòng ở B1 → chỉ tạo lại dòng đó, chạy lại `save_audio.py` cho dòng đó.
- Các trường khác (`section`, `keyword`, `visual`, `title`, `exams`) bỏ qua — chúng dành cho B3.
- Định dạng đầu ra giữ nguyên nên B3 không phải sửa.

## Ghi chú

- Không sửa file trong `public/audio/` bằng tay.
