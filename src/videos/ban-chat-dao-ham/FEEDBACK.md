# Feedback chờ sửa — ban-chat-dao-ham

Quy trình: người dùng nêu từng vấn đề → sửa skill trước → gom lại sửa video một lần.

| # | Vấn đề | Đã sửa skill | Đã sửa video |
|---|---|---|---|
| 1 | b01: badge "đúng một khoảnh khắc" vắt ngang viền đồng hồ; kim đè số 40; bố cục lệch (nửa phải trống); dấu `?` sát đồng hồ; dòng phụ đề trước nhỏ và sát → bỏ hẳn | ✅ dung-video › Quy tắc bố cục 1–4 | ✅ |
| 2 | Tag section (trái) và keyword (phải) hiện thường trực, người xem không hiểu để làm gì; thẻ "phóng to ×2" đứng riêng vô nghĩa; zoom b03 trông như đang bẻ thẳng đường cong | ✅ dung-video › Bước 2 + Quy tắc 5–6; viet-kich-ban › keyword/section/visual; CLAUDE.md schema | ✅ |
| 3 | b09: chữ trùng — "cực đại" đè điểm và đường đứt nét, "dốc nhất, không phải đỉnh" đè đường cong, điểm đè số trục −1 và 3 | ✅ dung-video › Quy tắc 1 (đặt nhãn, halo, số trục) + kiểm chồng lấn bằng code | ✅ |
| 4 | Audio đọc đều, ngắt sai chỗ, không giống người → đổi sang ElevenLabs **qua MCP**, giọng giảng bài | ✅ tao-audio (quy trình MCP); viet-kich-ban › "Viết speak cho tai nghe"; CLAUDE.md B2 | ✅ |
| 5 | Kịch bản: hướng ổn nhưng nối sang toán vội, người xem khó hiểu. **Giữ 2–3 phút**, không nhồi bài tập — một hàm ví dụ là đủ; thiếu chỗ thì cắt ý | ✅ viet-kich-ban › cầu nối ví dụ→toán, tiền đề, hàm ví dụ, "một ý chính", Độ dài 2–3 phút, "những ý đã cắt" | ✅ |

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

## Trạng thái (17/10/2026)
Đã làm lại video theo cả 5 vấn đề + khung 9Study (style.md) + hook quả bóng rơi + giọng ElevenLabs (Nguyễn Khoái, [calm]).
check-layout: 0 chồng lấn / 60 frame. Thời lượng ≈ 2:13.
