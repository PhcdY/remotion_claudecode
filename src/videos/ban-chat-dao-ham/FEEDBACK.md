# Feedback chờ sửa — ban-chat-dao-ham

Quy trình: người dùng nêu từng vấn đề → sửa skill trước → gom lại sửa video một lần.

| # | Vấn đề | Đã sửa skill | Đã sửa video |
|---|---|---|---|
| 1 | b01: badge "đúng một khoảnh khắc" vắt ngang viền đồng hồ; kim đè số 40; bố cục lệch (nửa phải trống); dấu `?` sát đồng hồ; dòng phụ đề trước nhỏ và sát → bỏ hẳn | ✅ dung-video › Quy tắc bố cục 1–4 | ✅ |
| 2 | Tag section (trái) và keyword (phải) hiện thường trực, người xem không hiểu để làm gì; thẻ "phóng to ×2" đứng riêng vô nghĩa; zoom b03 trông như đang bẻ thẳng đường cong | ✅ dung-video › Bước 2 + Quy tắc 5–6; viet-kich-ban › keyword/section/visual; CLAUDE.md schema | ✅ |
| 3 | b09: chữ trùng — "cực đại" đè điểm và đường đứt nét, "dốc nhất, không phải đỉnh" đè đường cong, điểm đè số trục −1 và 3 | ✅ dung-video › Quy tắc 1 (đặt nhãn, halo, số trục) + kiểm chồng lấn bằng code | ✅ |
| 4 | Audio đọc đều, ngắt sai chỗ, không giống người → đổi sang ElevenLabs **qua MCP**, giọng giảng bài | ✅ tao-audio (quy trình MCP); viet-kich-ban › "Viết speak cho tai nghe"; CLAUDE.md B2 | ✅ |
| 5 | Kịch bản: hướng ổn nhưng nối sang toán vội, người xem khó hiểu. **Giữ 2–3 phút**, không nhồi bài tập — một hàm ví dụ là đủ; thiếu chỗ thì cắt ý | ✅ viet-kich-ban › cầu nối ví dụ→toán, tiền đề, hàm ví dụ, "một ý chính", Độ dài 2–3 phút, "những ý đã cắt" | ✅ |
| 6 | Đổi giọng sang **Vivibe** (giọng clone của người dùng, qua API key), bỏ hẳn ElevenLabs | ✅ tao-audio viết lại; `scripts/vivibe_tts.py` thay `save_audio.py`; CLAUDE.md B2 | ❌ |
| 7 | Giọng thiếu ngắt nghỉ/nhấn, chỉ giao text cho API, hơi buồn ngủ. Đã test 4 cách trên Vivibe → chọn `...` (dừng rồi nhấn) | ✅ viet-kich-ban › "Viết speak cho tai nghe" (`...`, từ nối), giọng có nhấn nhá; tao-audio › kết quả test | ❌ |
| 8 | Mở/kết: luôn mở bằng một hiện tượng/ứng dụng thật chưa có lời giải (fun fact), cuối video giải nó bằng kiến thức vừa học | ✅ viet-kich-ban › yêu cầu 1, 5 (`HIỆN TƯỢNG`, `GIẢI ĐÁP`, phải có nguồn); dung-video › thẻ `GIẢI ĐÁP`, dùng lại hình mở đầu | ❌ |
| 9 | 2:13 hơi ngắn → 2:30–3:00 | ✅ viet-kich-ban › Độ dài (≈ 2400–2900 ký tự); tao-audio + dung-video › kiểm thời lượng; CLAUDE.md | ❌ |
| 10 | Không bỏ qua bản chất: ví dụ ↔ khái niệm phải đi tới nơi, định nghĩa xuất hiện; người xem luôn biết đang xem gì (không cần nói bài SGK nào) | ✅ viet-kich-ban › yêu cầu 8, 9 | ❌ |
| 11 | Thiếu chú thích: "15 m/s" không nói là vận tốc trung bình, cột "Trung bình", $s=5t^2$ không giải thích ký hiệu, bóng không nhãn; 2 bóng ở 0 và 1,25 m đè nhau | ✅ viet-kich-ban › quy tắc `text`/`visual` + phép thử tắt tiếng; dung-video › Quy tắc bố cục 7 + mục kiểm tra (8) | ❌ |

## Việc cần làm khi sửa video (vấn đề 1)
- `Subtitle`: chỉ hiện dòng đang đọc.
- `Speedometer`: số ghi ngoài vòng vạch, kim ngắn hơn vòng vạch.
- `KeywordPill`, nhãn, chữ trong thẻ: nâng lên đúng cỡ tối thiểu (badge/nhãn 36px, số trục 28px).
- b01: badge đặt ngoài viền đồng hồ; đồng hồ ở giữa, trượt sang trái khi các thẻ vào; `?` cách ≥ 40px.
- Soát lại mọi beat theo các mục kiểm tra bố cục.

## Việc cần làm khi sửa video (vấn đề 2)
- Bỏ `SectionLabel` thường trực → `SectionCard`: chỉ b06 (BẪY THƯỜNG GẶP) và b09 (TRONG ĐỀ THI) có thẻ mở beat ~1,2s.
- Bỏ `KeywordPill` góc phải → `KeyTakeaway`: câu chốt to trong vùng hình, hiện từ dòng cuối mỗi beat.
- Bỏ các thẻ thông số đứng riêng: "phóng to ×N" (b03), thẻ vận tốc b02 → chuyển thành nhãn sát cát tuyến.
- b03: làm `ZoomInset` kiểu kính lúp (hình gốc + khung soi co dần + ô phóng có vạch chia số).
- Mở rộng vùng hình lên y = 70 vì không còn hàng tag phía trên.

## Việc cần làm khi sửa video (vấn đề 3)
- Viết `scripts/check-layout.mjs` (bundle → mở frame trong Chrome → lấy khung bao `data-text` / `data-mark` → báo cặp chồng nhau).
- Gắn `data-text` / `data-mark` trong `PlotLabel`, `Axes`, `Point`, `KeyTakeaway`…; thêm halo cho chữ.
- `Axes`: tham số ẩn/dời số vạch chia bị điểm che.

## Việc cần làm khi sửa video (vấn đề 4)
- Chọn giọng qua connector ElevenLabs (lọc tiếng Việt, đọc thử 1 beat, người dùng chọn) → `scripts/tts_config.json`.
- Viết `scripts/save_audio.py` (bảng url → tải mp3 + ghi manifest cùng định dạng).
- Báo credit dự kiến, nghe thử beat đầu rồi mới tạo cả bài.

## Việc cần làm khi sửa video (vấn đề 5)
- Viết lại kịch bản theo skill mới (quay lại B1, duyệt dàn ý trước), vẫn 2–3 phút: một ý bản chất chính, cầu nối ví dụ → toán có bảng tương ứng + thay số, một hàm ví dụ cho phần đề thi; cắt bớt ý (vd. b07 s→v→a hoặc b08 hộp giấy) để có chỗ giải thích chậm.
- Sau đó tạo lại audio (B2) và dựng lại (B3) theo mọi quy tắc ở trên.

## Việc cần làm khi sửa video (vấn đề 6)
- ✅ Người dùng đã thêm `VIVIBE_API_KEY` vào `.env`. Giọng không cố định: hỏi người dùng mỗi lần chạy B2 (`--voice`).
- Tạo lại toàn bộ audio bằng `scripts/vivibe_tts.py` (estimate → nghe thử b01 → cả bài), rồi soát lại B3 (thời lượng đổi theo audio mới).

## Việc cần làm khi sửa video (vấn đề 7–11)
- Viết lại kịch bản theo skill mới (B1, duyệt dàn ý trước): chọn hiện tượng thật có nguồn cho beat `HIỆN TƯỢNG` + beat `GIẢI ĐÁP` dùng lại hình đó; định nghĩa đạo hàm hiện đầy đủ rồi gắn lại với ví dụ quả bóng; mọi số kèm đại lượng + đơn vị, ký hiệu có chú giải; `speak` có `...` trước chỗ nhấn; nhắm 2400–2900 ký tự.
- `SectionCard`: thêm `GIẢI ĐÁP` vào `VISIBLE_SECTIONS`.
- Ảnh hoạt nghiệm b02: trục ghi "quãng đường $s$ (m)", nhãn từng bóng, bỏ/dàn bóng ở 0 và 1,25 m, gắn `data-mark` cho bóng; bảng ghi "Vận tốc trung bình (m/s)".
- Tạo lại audio (B2, hỏi giọng), dựng lại (B3), soát phép thử tắt tiếng + thời lượng 2:30–3:00.

## Trạng thái (17/10/2026)
Đã làm lại video theo cả 5 vấn đề + khung 9Study (style.md) + hook quả bóng rơi + giọng ElevenLabs (Nguyễn Khoái, [calm]).
check-layout: 0 chồng lấn / 60 frame. Thời lượng ≈ 2:13.
