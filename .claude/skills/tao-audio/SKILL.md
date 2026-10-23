---
name: tao-audio
description: B2 của pipeline video giải thích bản chất (mọi môn) — tạo giọng đọc từ src/videos/<slug>/script.json bằng Vivibe API (giọng clone của người dùng). Dùng khi kịch bản đã chốt và cần audio, hoặc gõ /tao-audio <slug>.
---

# B2 — Tạo audio từ kịch bản

Đầu vào: `src/videos/<slug>/script.json` (output của B1, đã được người dùng chốt).
Đầu ra: `public/audio/<slug>/` gồm `<beatId>-lNN.mp3` (mỗi dòng 1 file) + `manifest.json`.

Giọng chuẩn: **giọng clone của người dùng trên Vivibe**, gọi qua API bằng `scripts/vivibe_tts.py`. Mọi việc gọi API, chờ, tải, đổi WAV → MP3, ghi manifest đều do script làm — không gọi API tay, không tải file tay.
`scripts/tts.py` (Edge TTS) chỉ để test nhanh, không dùng cho video đăng.

## Yêu cầu giọng đọc

Giọng phải nghe như **một giáo viên đang giảng cho học sinh**: rõ, ấm, có nhịp, có nhấn vào ý chính, ngắt hơi theo cụm nghĩa. Không đều đều kiểu đọc máy, không ngắt giữa cụm từ.
Vivibe không có thẻ chỉnh tông; tông giọng đến từ mẫu clone, nhịp đến từ **`speak` ở B1**: dấu câu đặt đúng cụm nghĩa, câu ngắn, `...` trước chỗ cần nhấn. Đọc sai hay ngắt sai thì sửa `speak` ở B1 rồi tạo lại dòng đó, không chỉnh file audio.

Đã test (19/10/2026, giọng clone): `...` cho cảm giác dừng rồi nhấn vào phần sau — người dùng chọn cách này. Nghe b01 thật: mỗi dấu câu giữa dòng dừng ≈ 0,3–0,4 s, dòng có 3 chỗ ngắt nghe vấp; `...` đặt giữa cụm chặt ("đo... kiểu gì") nghe gãy → quy tắc ngắt nghỉ ở skill `viet-kich-ban`. Thẻ `<break>` bị đọc sai (audio dài gấp đôi). Tách câu thành nhiều lần gọi rồi chèn khoảng lặng thì điều khiển được độ dài nghỉ nhưng không dùng.

## Cấu hình

1. API key: người dùng tự tạo ở vivibe.app/docs/api-keys và tự thêm `VIVIBE_API_KEY=...` vào `.env` ở gốc project (đã gitignore). **Không** hỏi, đọc, in hay ghi key ở bất kỳ đâu khác. Thiếu key thì script báo, nhắc người dùng.
2. **Giọng không cố định — hỏi người dùng mỗi lần chạy B2.** Chạy `python scripts/vivibe_tts.py --list-voices`, đưa danh sách tên giọng cho người dùng chọn. Không tự chọn, không lấy lại giọng của lần trước khi chưa hỏi. Giọng đã chọn truyền vào mọi lệnh của lần chạy đó bằng `--voice "<tên hoặc id>"`.
3. `speed` trong `scripts/tts_config.json` (0.5–2.0, mặc định 1.0) là tốc độ chung. Chỉ đổi khi người dùng nghe xong thấy cả bài nhanh/chậm.
   Beat có trường `"speed"` trong `script.json` thì đọc theo tốc độ đó (cache tính theo tốc độ từng dòng). **Không dùng để làm chậm đoạn giải thích**: đã thử 0.85 (22/10) → người dùng: "đừng thay đổi tốc độ nói thuần, cần thay đổi nhịp". Đoạn nào nhanh quá → quay lại B1 chia nhỏ thành nhiều câu ngắn (skill `viet-kich-ban` › câu trả lời "vì sao").
4. Đổi giọng hay `speed` làm cache mất hiệu lực → cả bài tạo lại (báo người dùng số ký tự trước). Cả bài một video phải cùng một giọng.

## Các bước

1. **Kiểm tra + báo chi phí:** `python scripts/check_script.py <slug>` (lỗi phải bằng 0; script in sẵn **danh sách dòng cần nghe thử**), rồi `python scripts/vivibe_tts.py src/videos/<slug>/script.json --voice "<giọng>" --estimate`.
   Script duyệt cả kịch bản trước: dòng thiếu `speak` hay `speak` còn ký hiệu toán → dừng, báo người dùng sửa ở B1 (**không tự viết `speak`**).
   Hợp lệ thì in số dòng cần tạo và số ký tự (1 ký tự ≈ 1 credit). Báo người dùng con số này, chờ đồng ý.
2. **Nghe thử beat đầu + các dòng cần nghe thử:** `... --voice "<giọng>" --only b01`, và thêm `--only <beatId>-lNN` cho mỗi dòng trong danh sách của `check_script.py`: dòng đọc ký hiệu/tên riêng (cách đọc theo gói môn `.claude/mon/<subject>.md`) và **dòng câu hỏi đoán** (giọng phải lên ở cuối câu; nghe ngang → B1 đổi thành câu dẫn khẳng định). Người dùng nghe ổn mới tạo phần còn lại. Ngắt sai hoặc đọc tách ký hiệu → quay lại B1 sửa `speak`.
   **Không bỏ bước này, kể cả khi người dùng bảo làm liền tới lúc xem thử.** Tạo b01 + các dòng ký hiệu, gửi file cho người dùng nghe (SendUserFile) rồi mới tạo cả bài; có thể dựng hình B3 song song trong lúc chờ. Đã gặp (22/10/2026, giọng nữ - c Nhi, video đơn điệu): bỏ nghe thử, tạo thẳng 58 dòng → nhiều dòng bị trùng, ríu; "h" đọc thành "hắc", "h của hai" dính; "x" nghe không hay → phải tạo lại. Đo tốc độ đọc (ký tự/giây) không bắt được lỗi trùng/ríu, chỉ tai người mới bắt được.
   Đã nghe thử (20/10/2026, giọng nam - c Bình): "x không" ($x_0$) bị đọc tách "x" … "không"; viết "ích-không" thì liền, **nhưng** "không" dính sang động từ phía sau ("ích-không ứng với" nghe thành "không ứng") → B1 phải đặt cụm có "không" ở cuối vế (quy tắc ở `viet-kich-ban`). Nghe lại sau khi đảo câu ("Tại ích-không, đạo hàm bằng mười.") → **đúng**, người dùng xác nhận. Khi nghe thử, vẫn để ý riêng chỗ này.
3. **Tạo cả bài:** cùng `--voice`, không có `--only`. Dòng nào đã có file khớp (cùng giọng, tốc độ, `speak`) thì bỏ qua.
   **Nghe lại sau khi tạo cả bài**: gửi lại (SendUserFile) đúng các file trong bài có đọc chữ cái/ký hiệu, kể cả dòng đã nghe thử ổn — mỗi lần tạo một khác. Đã gặp (22/10/2026): nghe thử ổn, nhưng bản trong bài đọc "f(x)" thừa âm cuối. Dòng lỗi → B1 đổi sang nói theo nghĩa, rồi `--only` dòng đó.
4. Lỗi một dòng: đọc thông báo, báo người dùng. **Không chạy lại ngay để thử** — mỗi lần gửi là một lần trừ credit. Người dùng đồng ý thì `--only <beatId>-lNN`.
5. Báo cáo: số dòng đã tạo / lỗi, số ký tự đã gửi, tổng thời lượng audio (đo bằng `ffprobe` đi kèm Remotion, `node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe`).
   Ước lượng thời lượng video = tổng audio + khoảng nghỉ của B3 (≈ 0,25s mỗi dòng, 0,6s mỗi beat, ~5s intro/outro). Ngoài khung 2:30 – 4:00 → báo người dùng trước khi sang B3; sửa bằng cách quay lại B1, không đổi `speed` để bù.

## Quy ước file

- Mỗi dòng `lines[i]` của beat `bXX` → `bXX-l{i+1:02d}.mp3`, đọc trường `speak`.
- Script cắt khoảng lặng thừa ở đầu và cuối mỗi file (giữ ~0,05 s), để nghỉ giữa các dòng chỉ do B3 quyết định và đều nhau.
- Không chèn thẻ điều khiển (như `<break>`) vào `speak`. Nhịp trong câu dựa vào dấu câu; nghỉ giữa các dòng/beat do B3 thêm (GAP_LINE, GAP_BEAT).
- Sửa một dòng ở B1 → chạy lại script với **đúng giọng đã dùng cho bài** (xem `voice_name` trong `manifest.json`, hỏi lại người dùng nếu muốn đổi); cache tự nhận ra dòng đổi.
- `manifest.json` giữ định dạng cũ (beat, line, file, hash, text + engine/voice/voice_name/speed) nên B3 không phải sửa. Dòng chưa có audio khớp kịch bản được script báo ở cuối.
- Các trường khác (`section`, `keyword`, `visual`, `title`, `exams`) bỏ qua — chúng dành cho B3.

## Bản giọng khác (không thay bản cũ)

Người dùng muốn thêm một bản đọc giọng khác bên cạnh bản đã có (vd. "làm thêm bản giọng nữ"):
- Tạo vào thư mục riêng: `python scripts/vivibe_tts.py src/videos/<slug>/script.json --voice "<giọng>" --audio-dir <slug>-<hậu tố>` (hậu tố ngắn: `nu`, `nam`…). Không sửa `script.json`, không chép kịch bản ra bản khác.
- Báo số ký tự (`--estimate` cùng `--audio-dir`) trước khi tạo; cả bài một giọng.
- B3 thêm một composition `<slug>-<hậu tố>` đọc audio từ thư mục đó (skill `dung-video` › Bản giọng khác). Thời lượng đo lại theo audio mới, không dùng lại timeline bản cũ.

## Ghi chú

- Không sửa file trong `public/audio/` bằng tay.
- `--force` tạo lại dòng được chọn dù cache khớp; chỉ dùng khi người dùng muốn một bản đọc khác.
- Vivibe chỉ cho một job mỗi tài khoản tại một thời điểm, nên script tạo lần lượt từng dòng (mỗi dòng vài giây). Cả bài nên chạy nền (`run_in_background`).
