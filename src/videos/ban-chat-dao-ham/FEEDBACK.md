# Feedback chờ sửa — ban-chat-dao-ham

Quy trình: người dùng nêu từng vấn đề → sửa skill trước → gom lại sửa video một lần.

| # | Vấn đề | Đã sửa skill | Đã sửa video |
|---|---|---|---|
| 1 | b01: badge "đúng một khoảnh khắc" vắt ngang viền đồng hồ; kim đè số 40; bố cục lệch (nửa phải trống); dấu `?` sát đồng hồ; dòng phụ đề trước nhỏ và sát → bỏ hẳn | ✅ dung-video › Quy tắc bố cục 1–4 | ✅ |
| 2 | Tag section (trái) và keyword (phải) hiện thường trực, người xem không hiểu để làm gì; thẻ "phóng to ×2" đứng riêng vô nghĩa; zoom b03 trông như đang bẻ thẳng đường cong | ✅ dung-video › Bước 2 + Quy tắc 5–6; viet-kich-ban › keyword/section/visual; CLAUDE.md schema | ✅ |
| 3 | b09: chữ trùng — "cực đại" đè điểm và đường đứt nét, "dốc nhất, không phải đỉnh" đè đường cong, điểm đè số trục −1 và 3 | ✅ dung-video › Quy tắc 1 (đặt nhãn, halo, số trục) + kiểm chồng lấn bằng code | ✅ |
| 4 | Audio đọc đều, ngắt sai chỗ, không giống người → đổi sang ElevenLabs **qua MCP**, giọng giảng bài | ✅ tao-audio (quy trình MCP); viet-kich-ban › "Viết speak cho tai nghe"; CLAUDE.md B2 | ✅ |
| 5 | Kịch bản: hướng ổn nhưng nối sang toán vội, người xem khó hiểu. **Giữ 2–3 phút**, không nhồi bài tập — một hàm ví dụ là đủ; thiếu chỗ thì cắt ý | ✅ viet-kich-ban › cầu nối ví dụ→toán, tiền đề, hàm ví dụ, "một ý chính", Độ dài 2–3 phút, "những ý đã cắt" | ✅ |
| 6 | Đổi giọng sang **Vivibe** (giọng clone của người dùng, qua API key), bỏ hẳn ElevenLabs | ✅ tao-audio viết lại; `scripts/vivibe_tts.py` thay `save_audio.py`; CLAUDE.md B2 | ✅ |
| 7 | Giọng thiếu ngắt nghỉ/nhấn, chỉ giao text cho API, hơi buồn ngủ. Đã test 4 cách trên Vivibe → chọn `...` (dừng rồi nhấn) | ✅ viet-kich-ban › "Viết speak cho tai nghe" (`...`, từ nối), giọng có nhấn nhá; tao-audio › kết quả test | ✅ |
| 8 | Mở/kết: luôn mở bằng một hiện tượng/ứng dụng thật chưa có lời giải (fun fact), cuối video giải nó bằng kiến thức vừa học | ✅ viet-kich-ban › yêu cầu 1, 5 (`HIỆN TƯỢNG`, `GIẢI ĐÁP`, phải có nguồn); dung-video › thẻ `GIẢI ĐÁP`, dùng lại hình mở đầu | ✅ |
| 9 | 2:13 hơi ngắn → 2:30–3:00 | ✅ viet-kich-ban › Độ dài (≈ 2400–2900 ký tự); tao-audio + dung-video › kiểm thời lượng; CLAUDE.md | ✅ |
| 10 | Không bỏ qua bản chất: ví dụ ↔ khái niệm phải đi tới nơi, định nghĩa xuất hiện; người xem luôn biết đang xem gì (không cần nói bài SGK nào) | ✅ viet-kich-ban › yêu cầu 8, 9 | ✅ |
| 11 | Thiếu chú thích: "15 m/s" không nói là vận tốc trung bình, cột "Trung bình", $s=5t^2$ không giải thích ký hiệu, bóng không nhãn; 2 bóng ở 0 và 1,25 m đè nhau | ✅ viet-kich-ban › quy tắc `text`/`visual` + phép thử tắt tiếng; dung-video › Quy tắc bố cục 7 + mục kiểm tra (8) | ✅ |
| 12 | Chữ thừa: nhãn "xe đạp điện: tối đa 25 km/h" dài, xe bé; nhãn "đoạn 60 → 70 m: 0,81 s · tốc độ ≈ 44 km/h" lặp số trên thước; badge "vận tốc trung bình cả bài" còn treo; phụ đề chép nguyên lời đọc | ✅ viet-kich-ban › `text` (ghi chú ngắn, ký hiệu, không lặp), `visual` (nhãn ≤ 5 từ, gỡ thông tin hết vai trò); dung-video › Quy tắc 4 (cỡ vật), 7, 8 | ✅ |
| 13 | b04: bảng nhảy 15 → 10,5 → 10,05 mà vạch tím "rơi thêm" đứng yên; nhãn tím tràn ra ngoài khung | ✅ viet-kich-ban › yêu cầu 12, `visual`; dung-video › Quy tắc 8 (chữ trong khung), 9 (số đổi ⇔ hình đổi); check-layout `data-box` | ✅ |
| 14 | Voice: "x không" bị đọc tách "x" … "không" | ✅ viet-kich-ban › bảng đọc + lưu ý ký hiệu có chỉ số; tao-audio › nghe thử dòng có ký hiệu. Đã nghe thử: "ích-không" đọc liền, nhưng "không" dính sang động từ sau ("không ứng") → cụm có "không" phải đứng cuối vế; nghe lại sau khi đảo câu: **đúng** (20/10) | ✅ |
| 15 | b05: trục số mới, điểm 15/10,5/10,05 tự hiện liên tục, khó hiểu; tổng thể hình hiện nhiều, nhanh, nhưng không giải thích | ✅ viet-kich-ban › yêu cầu 12, Style 3; dung-video › Quy tắc 9 | ✅ |
| 16 | b08/b09: người leo núi trên đồ thị không rõ là gì; nên có đường chạy, người chạy bên dưới theo tốc độ (nhanh ở đỉnh $f'$, dừng nhưng không quay đầu) | ✅ viet-kich-ban › yêu cầu 4, 11, `visual` (nhân vật có vai trò); dung-video › Quy tắc 10 | ✅ |
| 17 | Nhảy ví dụ liên tục (Bolt → bóng rơi → trục số → $x^3-3x$ → đồ thị $f'$); nên bám một ví dụ | ✅ viet-kich-ban › yêu cầu 11 (≤ 3 cảnh, cảnh mới mọc từ cảnh cũ), dàn ý | ✅ |
| 18 | Công thức hiện xong không quay lại hình: cần chỉ $f(x_0)$, $f(x)-f(x_0)$… là gì trên đồ thị | ✅ viet-kich-ban › yêu cầu 8 (giải phẫu công thức), dàn ý; dung-video › Quy tắc 10 | ✅ |
| 19 | Kết phải trả lời đúng câu hỏi mở đầu bằng số cụ thể: tốc độ tức thời lớn nhất của Bolt là bao nhiêu, và đó chính là đạo hàm | ✅ viet-kich-ban › yêu cầu 5 (đáp án cụ thể có nguồn, số mở–kết nhất quán) + checklist | ✅ |
| 20 | Kết phải nghe như kết, không như đang định nói tiếp: một câu kết luận "Vậy…" | ✅ viet-kich-ban › yêu cầu 5 + checklist; dung-video › Bước 2 (hình đứng yên ở dòng cuối, giữ hết TAIL) | ✅ |
| 21 | Đường chạy xoay thành trục, người chạy nằm ngang: "siêu lạ mắt, không hiểu gì" | ✅ viet-kich-ban › yêu cầu 11 (không phép biến hình, cầu nối bảng số → chấm điểm → đồ thị), `visual`; dung-video › Quy tắc 9 | ✅ (demo) |
| 22 | Dòng "$s$: m · $t$: s" không biết để làm gì | ✅ viet-kich-ban › `text` (chú giải đọc lên có nghĩa, không viết tắt); dung-video › Quy tắc 7 | ✅ (demo) |
| 23 | Đổi sang mô hình $s=t^2$ đột ngột, người xem tưởng là Bolt; bước khó phải nói chậm | ✅ viet-kich-ban › yêu cầu 11 (beat riêng cho đổi mô hình, "không phải Bolt", vài số trước công thức, nhãn "mô hình"), "Bước khó" | ✅ (demo) |
| 24 | Cát tuyến, tiếp tuyến không được định nghĩa; nên dùng zoom | ✅ viet-kich-ban › yêu cầu 12 (khái niệm mới định nghĩa bằng hình, tiếp tuyến bằng kính lúp, "A chính là B" phải cho thấy); dung-video › Quy tắc 6, 10 | ✅ (demo) |
| 25 | Đối chiếu đồ thị nhảy bước: chưa hiểu $f(x)$, $f(x_0)$ đã chỉ đoạn $f(x)-f(x_0)$ "giữa trời"; phải kẻ hai cột dọc rồi mới trừ | ✅ viet-kich-ban › "Không nhảy bước" (Bối cảnh), yêu cầu 8 (từng ký hiệu đơn trước, dựng phép tính từ thành phần), checklist theo dõi người xem; dung-video › Quy tắc 10 | ✅ (demo) |
| 26 | Được tăng thời lượng; ưu tiên tuyệt đối là người xem hiểu, không bị lạc | ✅ viet-kich-ban › Bối cảnh + Độ dài (2:30–4:00, ≈ 2700–4300 ký tự, 8–14 beat); dung-video, tao-audio, CLAUDE.md | ✅ (demo) |
| 27 | (tự rà) Phần đề thi b14–b15 giữ từ bản cũ, nhảy bước: dùng đồ thị $f'$ (một hàm) khi video mới dạy $f'(x_0)$ là một số; đổi sang hàm khác và "vận tốc âm = chạy lùi" không được giới thiệu | ✅ viet-kich-ban › yêu cầu 4 (chuyển sang đề thi là bước khó: một số → một hàm, đổi hàm, giá trị âm), Bước 2 (sửa một phần thì rà cả beat giữ nguyên), yêu cầu 6 | ⬜ |

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

## Việc cần làm khi sửa video (vấn đề 12–18)
Vấn đề 15–18 là lỗi cấu trúc kịch bản → **quay lại B1** (duyệt dàn ý trước), không vá trên video cũ.
- Một ví dụ xuyên suốt: người chạy (mở bằng số liệu Bolt, tính toán bằng mô hình quãng đường $s(t)$ của người chạy, nói rõ là mô hình). Bỏ bóng rơi, trục số b05, người leo núi b08, đèn giao thông b09.
- Tối đa ~3 cảnh: đường chạy → đồ thị $s(t)$ mọc ra phía trên đường chạy → công thức đặt cạnh đồ thị.
- Giải phẫu định nghĩa đạo hàm trên đồ thị $s(t)$, mỗi dòng một cụm: $x_0$, $f(x_0)$, $f(x)-f(x_0)$, $x-x_0$, thương = độ dốc cát tuyến, $\lim$ = cát tuyến → tiếp tuyến.
- Rút ngắn khoảng thời gian: đoạn tô trên đường chạy/đoạn trên đồ thị co lại **cùng lúc** với số vận tốc trung bình nhảy; mỗi mức co một dòng.
- Phần đề thi: đồ thị $f'$ = vận tốc người chạy, đường chạy bên dưới: chạy nhanh nhất ở đỉnh $f'$, dừng rồi quay đầu tại nghiệm đổi dấu (cực trị), dừng mà không quay đầu tại nghiệm kép.
- `text` viết lại thành ghi chú ngắn bằng ký hiệu; nhãn hình ≤ 5 từ; gỡ badge hết vai trò; vật minh hoạ đủ cỡ (bỏ xe đạp nếu không đủ chỗ).
- `speak`: ký hiệu có chỉ số viết "ích-không" và đặt cuối vế, sau là dấu câu (hoặc nói theo nghĩa); B2 nghe thử các dòng này trước.
- Kết (vấn đề 19–20): mở bằng trung bình cả bài 37,6 km/h, kết bằng tốc độ tức thời lớn nhất đo bằng laser 12,32 m/s ≈ 44,4 km/h quanh mét 52 (Štuhec et al. 2023, Bioengineering 10:1254); dòng cuối là câu "Vậy…" khép lại câu hỏi.
- `scripts/check-layout.mjs` + component: thêm `data-box` cho thẻ/ô bảng, báo chữ tràn khung.

## Việc cần làm khi sửa video (vấn đề 21–26)
Lỗi cấu trúc kịch bản → **quay lại B1**, duyệt dàn ý trước (đánh dấu bước khó, đi từng dòng theo dõi người xem).
- Bỏ cảnh xoay đường chạy. Cầu nối sang đồ thị: beat riêng đổi sang mô hình ("không phải Bolt", người chạy tưởng tượng màu khác + nhãn "mô hình"), vài số trước (1 s → 1 m, 2 s → 4 m, 3 s → 9 m) thành bảng nhỏ → chấm điểm lên hệ trục thời gian–quãng đường (trục nằm đúng tư thế) → nối thành đồ thị; nói "mỗi điểm nghĩa là…".
- Bỏ chú giải "$s$: m · $t$: s"; đơn vị nằm ở tên trục.
- Định nghĩa cát tuyến (hai điểm sáng trước, rồi đường qua chúng), độ dốc (tam giác ngang 1 s – lên 11 m → 11 m mỗi giây), rồi mới "độ dốc = vận tốc trung bình". Tiếp tuyến bằng kính lúp quanh A.
- Giải phẫu định nghĩa: $f(5)=25$ nghĩa là gì → cột $f(x_0)$ → điểm $x$ thứ hai → cột $f(x)$ → kẻ ngang, phần chênh = $f(x)-f(x_0)$ → khoảng giữa hai chân cột = $x-x_0$ → thương → giới hạn. Mỗi bước một dòng.
- Thời lượng dự kiến tăng lên ~3:30–4:00.

## Trạng thái (17/10/2026)
Đã làm lại video theo cả 5 vấn đề + khung 9Study (style.md) + hook quả bóng rơi + giọng ElevenLabs (Nguyễn Khoái, [calm]).
check-layout: 0 chồng lấn / 60 frame. Thời lượng ≈ 2:13.

## Trạng thái (19/10/2026)
Làm lại theo vấn đề 6–11: kịch bản mở bằng cú chạy 9,58 s của Bolt (số liệu arXiv:0911.1952), beat `GIẢI ĐÁP` cuối dùng lại hình đường chạy; giọng Vivibe (nam - c Bình), ngắt nghỉ theo quy tắc mới; chú thích đủ (trục, bảng, ký hiệu); `SectionCard` hiện thêm `GIẢI ĐÁP`; `check-layout` bắt cả vật minh hoạ chồng nhau.
check-layout: 0 chồng lấn / 78 frame. Thời lượng ≈ 2:43.

## Trạng thái (20/10/2026)
Làm lại theo vấn đề 12–20: kịch bản mới 11 beat, một ví dụ xuyên suốt (người chạy): đường chạy dựng đứng thành trục $s$ của đồ thị $s=t^2$, giải phẫu định nghĩa đạo hàm trên đồ thị (cụm công thức và phần hình sáng cùng màu), phần đề thi bằng đồ thị vận tốc + người chạy (quay đầu ở $x=1$, dừng buộc dây giày ở $x=4$), kết bằng số laser 12,32 m/s ≈ 44,4 km/h (Štuhec et al. 2023) và câu "Vậy…".
`text` thành ghi chú ngắn (nhiều dòng để trống); `check-layout` kiểm thêm chữ tràn khung (`data-box`).
check-layout: 0 chồng lấn / 78 frame. Thời lượng 2:49.

## Trạng thái (20/10/2026, bản demo theo vấn đề 21–26)
Kịch bản 16 beat: beat riêng đổi sang mô hình (người chạy tưởng tượng màu xanh, nhãn "mô hình", bảng 2/4/6 s trước công thức), bảng → chấm điểm → nối đồ thị (không xoay hình), cát tuyến và độ dốc định nghĩa trên tam giác, kính lúp ×10 → ×100 cho tiếp tuyến, giải phẫu định nghĩa theo thứ tự $x_0$ → cột $f(x_0)$ → $x$ → cột $f(x)$ → phần chênh → khoảng chân cột → cát tuyến → giới hạn.
check-layout: 0 chồng lấn / 110 frame. Thời lượng 3:53. Chưa render, xem trong Studio.

## Việc cần làm khi sửa video (vấn đề 27)
- Trước b14: thêm bước "một số → một hàm": với người chạy mô hình $s=t^2$, đo vận tốc tức thời lúc 1, 2, 3… s (2, 4, 6… m/s), chấm thành đồ thị vận tốc $v = 2t$, gọi nó là $f'$.
- b14: nói rõ đây là một đề bài / người chạy khác; một dòng riêng cho "vận tốc âm = chạy lùi" (người chạy quay mặt, đi ngược) trước khi suy ra $f$ giảm.

