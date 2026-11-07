# AUTO-LOG — toi-uu-lon-nhom

Người dùng chọn hướng lon nước ngọt + ý bản chất "mọi bài tối ưu: đưa về một biến rồi xét hàm số", bảo chạy thẳng (theo quy trình `/lam-video`, mỗi bước gọi skill để đúng model).

## Dàn ý (B1)

- **slug** `toi-uu-lon-nhom` · **tiêu đề** "Lon nhôm nên cao bao nhiêu?" · Toán 12 · Chương I · Bài 5. Ứng dụng đạo hàm để giải quyết một số vấn đề liên quan đến thực tiễn.
- **Chuỗi**: bài trước (`cuc-tri-gtln-gtnn`) dạy: GTLN/GTNN nằm ở chỗ $f'=0$ (bên trong) hoặc đầu mút. Mới: lập hàm từ bài toán thực tế; ràng buộc đưa hai ẩn về một biến. Để dành: bài toán tối ưu nhiều ràng buộc / chi phí khác nhau (chỉ nhắc ở giải đáp).
- **Hiện tượng**: lon nước ngọt cao gần gấp đôi bề ngang (Wikipedia "Drink can": 12,3 cm × 6,6 cm). Câu hỏi: cùng 330 ml, lon cao bao nhiêu, rộng bao nhiêu thì tốn ít nhôm nhất? Đáp án: vỏ dày đều → cao = bề ngang ≈ 7,5 cm ($r \approx 3{,}74$). Lon thật cao hơn: một lý do là nắp, đáy dày hơn thân (Wikipedia: "the side of the can is thinner than either the top and bottom areas, where stiffness is required").
  - Ba phép thử: đúng bậc (đạo hàm + GTNN lớp 12) ✓ · cần kiến thức (lẽ thường không đoán ra cao = ngang) ✓ · đại lượng hiển nhiên (nhôm ↔ diện tích vỏ, nói rõ là mô hình vỏ dày đều) ✓.
  - Dự phòng: chó Elvis (Pennings 2003, CMJ 34(3), $y = 0{,}144x$) · hộp không nắp cắt góc tấm bìa.
- **Hình trung tâm**: lon do bán kính điều khiển (chiều cao tự co giãn để giữ 330 ml) + đồ thị $S(r)$ là tổng một đường đi lên (nắp đáy) và một đường đi xuống (thân). **"À ra thế"**: b05–b06 (chọn $r$ là $h$ bị buộc → hai ẩn thành một hàm) và b07 (cộng hai xu hướng ngược → có đáy).
- **Cảnh**: 1 lon + công thức (b01–b06) → 2 đồ thị + lon nhỏ do $r$ điều khiển (b07–b10) → 3 so sánh lon / cốc / lon thật (b11–b12).
- **Đường hiểu**: diện tích hình trụ (lớp 9) + GTNN bằng đạo hàm (bài trước) → nhôm ↔ diện tích (mô hình) → ràng buộc thể tích buộc $h$ theo $r$ (BƯỚC KHÓ) → thay vào được $S(r)$ (BƯỚC KHÓ) → đồ thị có đáy → $S'=0$ → $h = 2r$ → bốn bước chung → áp dụng cốc không nắp. Sau video: giải được bài tối ưu hình học/chi phí kiểu "thể tích cho trước, vật liệu ít nhất".
- **Chuỗi vì sao**: chọn $r$=3 → $h$=11,7; $r$=4 → $h$=6,6 (bị buộc) → $h = 330/(\pi r^2)$ → thân $= 660/r$ → $S$ chỉ còn $r$ → hàm một biến → bài trước.
- **Cách hiểu sai**: "muốn ít nhôm thì thu nhỏ lon" → lon không còn đủ 330 ml → phải giữ thể tích (b02).
- **Đề thi**: có — cốc hình trụ không nắp 330 ml: $S = \pi r^2 + 660/r$, $r = h \approx 4{,}72$; hình so sánh lon ($h=2r$) cạnh cốc ($h=r$).
- **Beat**: b01 HIỆN TƯỢNG · b02 GỐC RỄ (thu nhỏ lon) · b03 TRỰC GIÁC (gầy tốn thân, béo tốn nắp đáy) · b04 CÔNG THỨC (mô hình + $S$) · b05–b06 BẢN CHẤT (ràng buộc → một biến) · b07 TRỰC GIÁC (đồ thị, hai thành phần) · b08 BẢN CHẤT ($S'=0$) · b09 BẢN CHẤT ($h=2r$) · b10 BẢN CHẤT (bốn bước) · b11 TRONG ĐỀ THI (cốc) · b12 GIẢI ĐÁP.
- **Ý đã cắt**: số lon sản xuất mỗi năm (không có nguồn chắc); mô hình nắp dày gấp $k$ lần ($h = 2kr$) — chỉ nói định tính; phần "tốc độ thay đổi" của bài SGK (đã có ở video đạo hàm).

## Tự phản biện dàn ý
- Hook có thật? Tỉ lệ 12,3/6,6 ≈ 1,9 là lon 355 ml (Mỹ); lon 330 ml cũng cao ~11,5, rộng 6,6 → nói "gần gấp đôi", không đưa số lon thật lên hình.
- Lon thật không trùng mô hình → nói thẳng ở giải đáp, có nguồn, tránh để người xem nghĩ nhà sản xuất "làm sai".
- Bước nhảy dễ có: thay $h$ vào $S$ (rút gọn $2\pi r h = 660/r$) → tách dòng riêng, `lineGap` 0,5.

## Quyết định
- B1 · tiêu đề/slug tự đặt · thư mục chưa tồn tại.
- B1 · không dùng câu hỏi đoán: đáy đồ thị không đoán được bằng mắt so với các mốc sẵn có; giữ một câu hỏi mở đầu.
- B1 · giữ cảnh báo b05-l02 ($V = \pi r^2 h = 330$): chữ h bị hiểu nhầm là đơn vị giờ; 330 là số trong công thức, đơn vị nói ở dòng sau (330 ml = 330 cm³).
- B1 · học sinh ảo (nặng): b06 rút gọn 2πrh → 660/r tách 3 dòng (viết phép nhân, triệt π và r, 2·330); b08 giải S'=0 thêm dòng r³ = 165/π rồi căn bậc ba; b09 bỏ câu "thể tích nào cũng h = 2r" (chưa chứng minh), thay bằng thay số vào h = 330/(πr²).
- B1 · học sinh ảo (vừa): b07 nói tên trục bằng lời; b08 thêm "hai đầu vọt lên nên đáy bên trong"; b05 nói số h tính từ thể tích; b12 nối "nắp tốn hơn → làm nắp nhỏ → lon gầy".
- B1 · giữ: b11 cốc chỉ đưa r ≈ 4,72 (lặp đúng các bước của lon, video đã làm mẫu cách giải); số 355/402 ở b07 giữ vì có chấm trên đồ thị.
- B1 · xong: 12 beat, 66 dòng, 4028 ký tự, ước tính 3:50, check_script 0 lỗi.
- B3 nháp · lon vẽ theo thang cm → px chung mỗi cảnh, chiều cao luôn tính từ h = 330/(πr²) (lon là nhân vật do r điều khiển); lon thật vẽ r = 3,05, h ≈ 11,3 (vẫn 330 cm³, tỉ lệ ≈ 1,85).
- B3 nháp · màu: thân = pairA, nắp-đáy = pairB, focus cho kết quả, up/down cho hai bên đáy, warn cho "không đủ 330 ml".
- B3 nháp · nhãn "mô hình: vỏ dày đều" chỉ giữ trong b04 (visual ghi giữ hết cảnh 1) để không chiếm chỗ nhãn r, h ở b05–b06.
- B3 nháp · lon ở cảnh 2 tắt trong b08 (thẻ công thức cần chỗ) và b10 (thẻ bốn bước); b09 lon phóng to gấp đôi tỉ lệ (r = 3,74 ở tỉ lệ cũ quá nhỏ).
- B3 nháp · tự thêm chú thích: nhãn "lon thật" (b12), "h = 2r" cạnh lon ở b11 dòng 6 để so với "h = r" của cốc.
- B3 nháp · giữ cảnh báo: b03 dòng 1–2 nửa trái trống (một lon gầy ở giữa là chủ ý); b10 dòng 3 có 9 từ mới (nhãn bước + công thức).
- B3 nháp · check-layout --draft 0 lỗi, lint sạch.
- B3 nháp · học sinh ảo (storyboard) → đã sửa hình: chú thích màu "thân" / "nắp, đáy" ở b03; mũi tên hai đầu đồ thị vọt lên (b08 dòng 2); nét đứt từ điểm r = 2, r = 7 xuống trục (b07); trũng đậm hơn; mốc bài trước chữ đậm; bước 1, 3, 4 ở b10 bớt mờ; nhãn cốc dời sang trái cốc; chữ r không đè chấm tâm.
- B3 nháp · không sửa (thuộc lời, B1 đã cân nhắc): đạo hàm của 660/r chỉ nói kết quả (gói Toán: không dạy công cụ bài khác); số 355/402/4,72 chỉ nêu kết quả, có hình làm nguyên nhân (điểm trên đồ thị, lon co giãn); "ngang = 2r" không thêm chữ (text trong kịch bản đã chốt, nhãn h = 2r có sẵn).
- B3 nháp · storyboard: out/_lam-viec/toi-uu-lon-nhom/storyboard/index.html — xong, sang B2.
- B2 · giọng 'nữ - c Nhi' (bZ26Wn8YhQJq7aJ912aBsf) · 66 dòng · 4028 ký tự · tạo luôn (< 8000)
- B2 · b12-l03 lỗi mạng, chạy lại 1 lần: ok · tổng audio 206.7840000000001s · align_words xong
- B3 hoàn thiện · bỏ draft; manifest khớp 66/66; lint + check-layout (thời gian thật) 0 lỗi; ảnh từng dòng: out/_lam-viec/toi-uu-lon-nhom/storyboard/ (--real); thời lượng ≈ 3:55
- Render · 7052 frame, 3:55, 17,2 MB · phụ đề srt/vtt/timeline 66 câu
