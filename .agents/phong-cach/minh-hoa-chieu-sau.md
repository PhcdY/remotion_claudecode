# Phong cách — Minh hoạ chiều sâu

> Thế giới vector có ánh sáng và chiều sâu, máy luôn đi, vật luôn sống; chữ ít và to, sinh ra từ chính hình.
> Mẫu tham chiếu: các video giải thích dựng bằng minh hoạ vector (kiểu Kurzgesagt — In a Nutshell). **Học**: phối cảnh không khí (lớp xa nhạt dần), viền sáng, máy đẩy/kéo/lia nhiều lớp, ẩn dụ hình cho khái niệm trừu tượng, chuyển cảnh bằng chính vật. **Không lấy**: nhân vật (chim…), thiết kế, bảng màu đặc trưng, logo, font của họ.

Mặc định cho video mới mọi môn, trừ khi người dùng chọn phong cách khác. Đọc kèm `.agents/chuan-thi-giac.md`.

## 1. Bản chất, và không phải là gì
Mỗi cảnh là **một nơi chốn** có trời, đất, ánh sáng; khái niệm trừu tượng được biến thành **vật** đặt trong nơi chốn đó (câu thơ thành con đường, lực thành dòng chảy, phân tử thành viên bi có khối). Camera là người dẫn chuyện thứ hai.
- **Không phải** slide thuyết trình: không khung trắng có tiêu đề, không thẻ gạch đầu dòng.
- **Không phải** infographic phẳng: không khối màu đặc không sáng tối, không mọi thứ cùng một lớp.
- **Không phải** hoạt hình trẻ con: không mặt cười dán lên mọi vật, không nảy loạn xạ.

## 2. Chất liệu
- Khối vector có **chuyển sáng–tối** (gradient nhẹ cùng tông, sáng ở phía nguồn sáng), **viền sáng** 2–3px ở mép đón sáng, **bóng đổ mềm** dưới vật (`GroundShadow`), không viền đen.
- **Phối cảnh không khí**: lớp càng xa càng nhạt, ngả về màu trời (`Backdrop` tự làm cho đồi; vật tự vẽ ở xa thì `mix(màu, trời, 0,3–0,6)`).
- Bụi sáng trôi chậm ở lớp giữa; quầng sáng (`Glow`) sau trọng tâm.
- Thẻ chỉ khi nội dung là tờ giấy thật; câu nói, câu trả lời dùng `Bubble` (bong bóng có khối), không dùng hộp chữ nhật.

## 3. Logic màu
- Bảng màu cảnh từ `PALETTES` (`src/components/illustration.tsx`): `troi` (Toán, Lý, Địa), `binhMinh` (Sinh, Hoá, mở đầu), `chieu` (Văn, Sử, hoài niệm), `dem` (vũ trụ, nguyên tử; chữ sáng màu). Một cảnh một bảng.
- Màu nghĩa vẫn theo `role`: `focus` chàm cho thứ đang nói, `up`/`down` chỉ cho tăng/giảm, `warn` cho bẫy. Vệt highlight vàng ấm `#FFD166`.
- Trọng tâm đậm và bão hoà nhất khung; hậu cảnh nhạt, ít bão hoà.

## 4. Chữ
- Chữ giao diện: Plus Jakarta Sans (brand). Trích dẫn văn học, câu nói nhân vật: một font có chân (vd. Lora, Noto Serif — Google Fonts, có tiếng Việt).
- Thang cỡ chữ theo chuẩn chung. Chữ chính hiện từng từ (`Words`) hoặc **sinh ra từ hình** (bay ra từ vật, hiện theo vệt quét), không bật cả khối.
- Chữ đặt trên nền thoáng của bầu trời hoặc có quầng sáng phía sau, không đặt trên vùng nhiều chi tiết.

## 5. Chuyển động
- Vào: `pop` có nảy nhẹ cho vật bật ra; `EASE.out` cho vật dịch chỗ; `EASE.inOut` cho camera. Không tuyến tính, không chỉ mờ dần tại chỗ.
- Chuyển động phụ luôn có: vật lơ lửng `bob` (biên độ 4–8px, chu kỳ 3–5 s, lệch pha giữa các vật), máy thở (`Camera drift`), bụi trôi.
- Theo trước – làm – theo sau: vật sắp lao đi thì lùi nhẹ trước; vật dừng thì nảy nhẹ một nhịp.
- Không bao giờ: xoay vòng vô cớ, rung cả khung, hiệu ứng chớp sáng.

## 6. Ngữ pháp máy
| Cú máy | Dùng khi |
|---|---|
| Đẩy chậm vào chi tiết | soi một từ, một số, một bộ phận đang nói |
| Kéo ra lộ toàn cảnh / lộ tỉ lệ | cho thấy chi tiết nằm trong cái lớn hơn; khoảnh khắc "à ra thế" |
| Lia ngang sang vùng mới | sang ý tiếp theo trong cùng thế giới (thay cho vẽ chồng) |
| Lia dọc (lên trời / xuống đất) | đổi cấp: hiện tượng ↔ cơ chế, đời thường ↔ ký hiệu |
| Theo vật | vật di chuyển theo quy luật (chữ bay, hạt chạy, quân tiến) |
| Chui vào chi tiết | chuyển cảnh: máy đẩy vào một vật tới khi nó lấp khung, ra ở cảnh mới |
| Máy thở | mọi đoạn hình đứng > 3 s |

Mỗi video ≥ 4 kiểu, một cảnh đinh.

## 7. Khoảnh khắc riêng (gợi ý)
- **Chữ bay thành lời giải**: một từ trong câu (thơ, định nghĩa) tách ra, bay xuống, lớn lên thành kết luận — hợp với Văn, định nghĩa Toán.
- **Kéo ra lộ tỉ lệ**: tưởng là cả thế giới, máy kéo ra thấy nó chỉ là một điểm trong cái lớn hơn — hợp với Địa, Sinh (tế bào → cơ thể), Lý (hạt → vật).
- **Biến hình vật**: vật đời thường thành ký hiệu môn học (con dốc thành đồ thị, dòng người thành vectơ) — hợp với cầu nối ví dụ → ký hiệu. Giới hạn (`dung-video` › quy tắc 6, 9): vật giữ tư thế quen thuộc, không xoay, gập hay cuộn hình; người xem luôn thấy cái gì thành cái gì (hình cũ còn mờ làm mốc trong lúc biến), lời đọc gọi tên lúc biến.
- **Hai thế giới cạnh nhau**: máy lia giữa "cách nghĩ sai" và "cách nghĩ đúng" dựng như hai nơi chốn — hợp với BẪY THƯỜNG GẶP.
- **Ánh sáng đổi**: cả cảnh chuyển từ chiều sang đêm hoặc sáng lên khi lời giải hiện — hợp với GIẢI ĐÁP.
- **Con dấu kết luận**: `Stamp` đóng xuống sau khi lập luận xong (điểm số, đúng/sai).

## 8. Lỗi hay gặp của phong cách
- Nền đẹp nhưng nội dung nhỏ → trọng tâm vẫn phải ≥ 1/3 chiều cao khung ở khoảnh khắc chính.
- Bụi, quầng sáng quá đậm thành rối → bụi ≤ 40 hạt, độ mờ ≤ 0,7; quầng sáng chỉ sau một trọng tâm.
- Mọi thứ cùng nảy → nảy chỉ cho vật bật vào; dịch chỗ dùng `EASE.out`.
- Chữ trên đồi, trên vùng chi tiết → dời lên trời hoặc thêm `Glow`.
- Máy đi liên tục không nghỉ → mỗi cú máy xong phải có ≥ 1 s đứng (chỉ thở).

## 9. Đồ nghề
- `src/components/motion.tsx`: `Camera` (có nhoè chuyển động lúc máy đi), `Layer`, `Shot`, `EASE`, `tween`, `pop`, `bob`, `wander` (trôi hữu cơ), `Words`, `CountUp`.
- `src/components/illustration.tsx`: `Backdrop`, `PALETTES`, `mix`, `Glow`, `GroundShadow`, `Bubble`, `MorphShape`.
- `src/components/annotate.tsx`: `Marker`, `Strike`, `Ring`, `UnderlineMark` (vẽ tay), `DrawArrow`, `Stamp`.
- `src/components/Photo.tsx`: ảnh tư liệu; `src/components/LottieAsset.tsx`: hoạt hình Lottie làm sẵn.
- Gói Remotion đã cài, dùng trực tiếp khi cần: `@remotion/shapes` (hình cơ bản), `@remotion/transitions` (chuyển cảnh — chưa nối vào `ExplainerVideo`, chuyển cảnh trong video vẫn dựng bằng máy).
- Chưa có: kho hình vector/Lottie có giấy phép (ghi nguồn khi thêm); âm thanh.

## 10. Biên độ biến tấu
Đổi giữa các video: bảng màu cảnh, hướng và màu nguồn sáng, độ cao chân trời, ẩn dụ của hình trung tâm, cảnh đinh, đường máy, hình kết. Giữ: chất liệu, thang chữ, đường cong chuyển động.
