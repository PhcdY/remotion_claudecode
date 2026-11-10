# Chuẩn thị giác chung — video không ra "slide", không nhựa, không nhàm

Áp dụng cho **mọi môn**. Đọc ở B1 (khi viết `visual`, `images`) và B3 (trước khi dựng, khi soát storyboard).
Gói môn `.agents/mon/<mon>.md` chỉ thêm hình đặc thù của môn. Gói môn nói khác về **bố cục, cỡ chữ, thẻ, ảnh** thì chuẩn này thắng.
Góp ý gốc và lý do: `.agents/lessons.md` (10/11/2026).

**(B)** = bắt buộc, `check_script.py` / `check-layout.mjs` bắt được phần lớn. **(KN)** = khuyến nghị, dùng khi hợp.

## Vì sao video đang trông như slide

Chẩn đoán từ ảnh góp ý 10/11/2026 (video Văn "Bác ơi!"):

| Người xem thấy | Nguyên nhân trong hệ thống |
|---|---|
| Khung trắng to, đầu khung có nhãn màu + tiêu đề → như một trang PowerPoint | `StagePanel` vẽ hộp trắng bao cả khung, kèm badge 18px và tiêu đề 28px |
| Thẻ mới đè thẳng lên thẻ cũ | Luật cũ "thẻ Bẫy là lớp phủ, làm mờ sân khấu phía sau"; bộ kiểm không so khung với khung |
| Chữ bé tí, hơn nửa khung trống | Luật 06/11 cho chữ trong thẻ 20–23px để "không rớt dòng" (trái với sàn 36px); bộ kiểm chỉ đo chữ có `data-text`, chữ trong thẻ lọt lưới |
| Gạch đầu dòng câu dài ("Trả lời: …", "Hậu quả: …") | Đưa lời đọc lên thẻ. Chữ lặp lời đọc làm người xem nhớ kém hơn (redundancy) |
| Kịch bản tả ảnh, video không có ảnh | Không bước nào lấy ảnh; B3 không có file nên lặng lẽ bỏ |

## 1. Cả khung là sân khấu, không phải trang slide (B)

- Hình chính đặt **thẳng lên nền** `BrandFrame`. Không hộp trắng bao cả khung, không dải tiêu đề hay badge ở đầu khung, không tên phần thường trực. Chỉ 3 section (`TRONG ĐỀ THI`, `BẪY THƯỜNG GẶP`, `GIẢI ĐÁP`) hiện thành thẻ mở beat ~1,2 s rồi biến mất.
- **Thẻ** (khối nền trắng bo góc) chỉ dùng khi nội dung là một **vật dạng tờ**: tờ đề thi, trang sách, phiếu trả lời, bảng số. Tối đa 2 thẻ cùng lúc, đặt cạnh nhau; không lồng thẻ trong thẻ.
- Mỗi frame phải có **một hình hoặc một vật lớn đang kể chuyện** (đồ thị, sa bàn, câu thơ cỡ lớn đang bị mổ xẻ, ảnh tư liệu), không chỉ có khối chữ.
- **Phép thử slide**: dán một frame bất kỳ vào PowerPoint. Nhìn không ra đó là video → làm lại.

## 2. Thứ mới phải có chỗ, không đè lên thứ cũ (B)

Mỗi lần thêm một khối lớn (thẻ, ảnh, hình mới), chọn **một** trong ba cách:

| Cách | Làm thế nào | Dùng khi |
|---|---|---|
| **Nhường chỗ** | Khối cũ dịch hoặc thu nhỏ sang một bên (`spring`, 0,6–0,8 s), khối mới vào chỗ trống | Cần so sánh cũ với mới (Đúng/Sai, trước/sau) |
| **Thay chỗ** | Khối cũ ra hẳn (mờ + dịch) **xong** thì khối mới vào cùng vị trí | Cũ đã hết vai trò |
| **Đẩy camera** | Cả sân khấu trượt hoặc zoom sang vùng mới đã vẽ sẵn | Đi tiếp trong cùng một thế giới (câu thơ → chữ cần soi, bản đồ → một vùng) |

- **Cấm** vẽ khối mới chồng lên khối cũ còn hiện, kể cả khi khối cũ đã bị làm mờ. Hai khối cùng hiện cách nhau ≥ 40px. `check-layout` báo lỗi "khung chồng khung".
- Trước khi code một beat, phác 3 trạng thái: **đầu beat / sau dòng có thay đổi lớn nhất / cuối beat**. Mỗi trạng thái cân trong khung, không khối nào đè khối nào. Cách chuyển giữa chúng là một trong ba cách trên.

## 3. Chữ to, ít chữ (B)

Người xem nhiều bằng điện thoại: khung 1080 thu còn ~400px chiều cao. Chuẩn phụ đề truyền hình HD lấy sàn ~44px và cỡ 1/20–1/10 chiều cao khung (54–108px).

| Vai | Cỡ |
|---|---|
| **Chữ chính của frame**: câu trích dẫn, đáp án, công thức chính, con số kết luận | **72–120px** |
| Câu chốt `keyword`, thẻ mở beat | ≥ 56px |
| `text` của dòng, nhãn, chữ trong thẻ | 40–56px; **sàn tuyệt đối 36px** |
| Số trên trục, vạch chia | 28–32px |
| Nhãn nhỏ "Ảnh minh họa", nguồn ảnh | 22–24px |

- Không vừa thì **bớt chữ hoặc nới khung**, không thu chữ. Luật cũ "chữ trong thẻ 20–23px + `nowrap`" đã bỏ.
- **Không gạch đầu dòng, không câu đầy đủ.** Thẻ có tối đa 1 tiêu đề + 2 cụm, mỗi cụm ≤ 6 từ. Lời đọc đã nói thì màn hình không chép lại.
- Nội dung kiểu "Trả lời: … / Hậu quả: …" phải thành **hình**. Ví dụ: câu trả lời sáo rỗng hiện mờ, bị một vệt gạch đỏ quét qua, mũi tên chỉ tới "0 điểm" cỡ lớn.
- Hai bậc chữ liền nhau chênh nhau ≥ 1,5 lần (vd. 96 → 56 → 36), để mắt biết đọc gì trước.

## 4. Lấp đầy khung có chủ đích (B)

- Từ dòng 1 của mỗi beat, khung bao nội dung (không tính nền, logo) phủ **≥ 45% vùng hình**. Thứ trọng tâm là thứ lớn nhất trên khung.
- Trọng tâm đặt quanh tâm khung hoặc trên đường 1/3. Chỗ trống quanh trọng tâm là chỗ thở; nửa khung trắng trơn thì không.
- `check-layout` cảnh báo "nội dung chỉ phủ …%" và "không có trọng tâm đủ lớn".

## 5. Ảnh có quy trình, không được lặng lẽ biến mất (B)

- **B1**: `visual` nhắc tới ảnh chụp, chân dung, ảnh tư liệu, bức tranh → beat có trường `images` (schema ở skill `viet-kich-ban`). `check_script.py` báo lỗi nếu thiếu.
- **Trước B3**: liệt kê ảnh chưa có trong `public/images/<slug>/` rồi xin người dùng. Có thể đề xuất ảnh tự do bản quyền (vd. Wikimedia Commons, kèm giấy phép), nhưng chỉ tải khi người dùng đồng ý. Không tự vẽ SVG sơ sài thay ảnh, không bỏ ảnh.
- **B3** dựng ảnh bằng `Photo` (`src/components/Photo.tsx`): ảnh lớn (≥ 40% vùng hình, hoặc tràn hẳn nửa khung), trôi phóng rất chậm (Ken Burns), nhãn nguồn hoặc "Ảnh minh họa" nhỏ ở góc ảnh. Thiếu file thì `Photo` vẽ ô đỏ "THIẾU ẢNH" cỡ lớn, `check-layout` báo lỗi, nên không render được bản đăng mà thiếu ảnh.
- Ảnh phải **giải thích được**: đúng người, đúng vật, đúng sự kiện đang nói. Ảnh để trang trí làm người xem nhớ kém hơn (seductive details).

## 6. Chuyển động có chủ đích, hình không "chết", không "nhựa" (KN)

- Vào/ra bằng `spring` (`damping: 200` cho chuyển động êm) hoặc easing cubic. Không chạy tuyến tính, không chỉ hiện mờ dần tại chỗ.
- Hướng vào có nghĩa: thứ tiếp theo trong mạch vào theo chiều đọc; thứ bị loại rơi xuống hoặc lùi về sau.
- Vật đã có trên khung thì **biến thành** vật mới (đổi màu, tách đôi, dịch tới chỗ mới) thay vì tắt đi rồi bật cái khác, như các phép biến hình của 3Blue1Brown.
- Khung đứng yên quá ~4 s thì có chuyển động nền rất nhẹ: ảnh trôi phóng, camera trôi 1–2%, vệt highlight quét.
- Vẫn giữ: **mỗi dòng tối đa một thay đổi chính** (skill `dung-video` › quy tắc 9).
- Đồ nghề (`src/components/motion.tsx`, `annotate.tsx`, dựng trên các gói Remotion chính thức): `tween`/`EASE` (đường cong chuẩn), `pop` (bật vào có nảy), `bob` (trôi lên–xuống), `wander` (trôi hữu cơ, `@remotion/noise`), `Words` (chữ hiện từng từ), `CountUp` (số chạy), `Camera blur` (nhoè lúc máy đi, `@remotion/motion-blur`), `Marker` / `Strike` / `Ring` / `UnderlineMark` (bút dạ, gạch, khoanh, gạch chân vẽ tay, `@remotion/rough-notation`), `DrawArrow` (mũi tên cong vẽ dần, tự dừng cách đích 24px), `Stamp` (con dấu kết luận). Dùng đồ có sẵn trước khi tự viết.
- `check-layout` cảnh báo **khung đứng yên** quá ~4 s (không vật nào nhúc nhích).

## 7. Có thứ bậc và chiều sâu, không phải mọi thứ là một lớp thẻ trắng (KN)

- Ba lớp: **hậu cảnh** (nhỏ, nhạt, mờ) · **trọng tâm** (to, đậm, màu nhấn) · **chú thích** (nhỏ, sát vật).
- Thứ hết vai trò **lùi về hậu cảnh** (mờ ~0,3, thu ~0,9) thay vì đứng ngang hàng với thứ đang nói.
- Một màu nhấn đậm cho trọng tâm. Không tô nền màu cho mọi thẻ; thẻ nào cũng nền trắng bóng nhẹ thì cả khung thành "nhựa".
- Đồ nghề: `Backdrop` (nền nhiều lớp: lớp xa nhạt dần vào màu trời, viền sáng mép đồi, bụi sáng trôi), `Glow` (quầng sáng sau trọng tâm), `GroundShadow` (bóng mềm dưới vật), `Bubble` (bong bóng lời có khối), `MorphShape` (hình biến dần thành hình khác, `@remotion/paths`) trong `src/components/illustration.tsx`; `LottieAsset` (`src/components/LottieAsset.tsx`): hoạt hình vector làm sẵn từ `public/lottie/`, cùng quy trình như ảnh (luật 5: có giấy phép, ghi nguồn ở `public/lottie/CREDITS.md`, thiếu file thì báo đỏ). Hình dựng sẵn khác: `@remotion/shapes` (tròn, sao, đa giác…).

## 8. Đạo diễn: chống rập khuôn, chống nhàm (B ở B1, KN ở B3)

Đẹp từng khung chưa đủ; video nhàm vì **ý tưởng hình rập khuôn, máy đứng yên, nhịp đều**. Phần này phỏng theo phương pháp đạo diễn của [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) (MIT), viết lại cho video giáo dục 2:30–4:00 có giọng đọc dẫn nhịp.

**Ở B1 (dàn ý), bắt buộc:**

1. **Mẫu tham chiếu trước khi nghĩ hình.** Chọn 1–2 video giải thích được khen hợp với chủ đề và phong cách. Ghi hai dòng: *học gì* (bố cục, nhịp, cách máy đi, logic màu, cách chuyển cảnh) và *không lấy gì* (nhân vật, thiết kế, hình cụ thể, logo, font của họ). Mẫu tham chiếu nâng chất lượng hơn mọi luật khác.
2. **Ba hướng hình, rồi mới chọn.** Với hình trung tâm và với mỗi cảnh: nghĩ 3 ẩn dụ hình khác hẳn nhau (vd. câu thơ "Bác đã đi rồi": *chữ "đi" bị soi dưới kính* / *con đường hoàng hôn chữ đi xa dần* / *hai cách đọc cùng một câu đặt cạnh nhau*). Chấm theo: thấy ngay ý bản chất · dựng được bằng đồ nghề hiện có · khác video trước. Ý đầu tiên nghĩ ra thường là lối mòn. "Thẻ + chữ" không bao giờ là một hướng hình.
3. **Một khoảnh khắc chỉ hoạt hình làm được**, đặt đúng khoảnh khắc "à ra thế": vật biến thành vật khác, camera lộ ra tỉ lệ thật, một chữ bay từ câu thơ xuống thành lời giải… Gói phong cách có danh sách gợi ý.
4. **Đường máy**: liệt kê các cú máy của cả video (mục dưới), đánh dấu **một cảnh đinh**: cú máy người xem nhớ (kéo ra lộ tỉ lệ, một cú máy liền đi qua cả lập luận, chuyển cảnh bằng chính vật).

**Ngữ pháp máy (B3):**

- Mỗi video **≥ 4 kiểu máy khác nhau** và có thay đổi cỡ khung thật (toàn cảnh / trung / cận / soi chi tiết). Đồ nghề: `Camera` + `Layer` (`src/components/motion.tsx`): đẩy vào, kéo ra, lia, theo vật, chiều sâu nhiều lớp (lớp xa trôi chậm hơn lớp gần).
- Mỗi cú máy có **lý do**: đẩy vào để soi chi tiết đang nói, kéo ra để thấy quan hệ, lia sang vùng mới thay vì vẽ chồng (luật 2).
- **Chuyển cảnh dựng bằng chính hình**: vật cảnh trước thành vật cảnh sau, máy chui vào một chi tiết rồi ra ở cảnh mới. Tránh mờ dần mặc định và cắt cụt. Không có khung trống lúc chuyển.
- Ở khoảnh khắc chính, trọng tâm cao **≥ 1/3 chiều cao khung**.

**Nhịp (B1 + B3):**

- **Nhịp phải đổi.** Video đều một tốc độ là hỏng: xen đoạn nhanh (nhiều thay đổi nhỏ, dòng ngắn) với đoạn chậm (một hình đứng lâu, máy trôi chậm); có ít nhất một chỗ tăng tốc hoặc chậm lại rõ.
- **Một nhịp thở** ngay trước khoảnh khắc "à ra thế": hình đứng, giọng nghỉ (`pauseAfter`), rồi mới lật.
- **Đủ thời gian để hiểu**: chỗ sai, phản ví dụ, bẫy được chiếu đủ lâu; chữ mới đứng yên ít nhất ≈ (số ký tự ÷ 15 + 1,5) giây trước khi bị đổi hay gỡ.

**Phép thử "không lặp video trước"** (B3, trước khi giao storyboard): so với video gần nhất cùng môn trên 6 yếu tố: *hình trung tâm · hình mở đầu · cảnh đinh · đường máy · bảng màu cảnh · hình kết*. **Ít nhất 4/6 phải khác.** Khung nội dung (hiện tượng → giải đáp) giữ nguyên theo `viet-kich-ban`; cái phải khác là cách *nhìn*.

**Lỗi hay gặp nhất** (soát ở mọi storyboard):
1. Vật chính quá nhỏ, quá xa hoặc dính mép khung.
2. Màu chồng màu (chữ đỏ trên nền đỏ), hoặc quá tối để đọc.
3. Chữ che vật chính.
4. Chỗ sai, bẫy, phản ví dụ chiếu quá nhanh, không kịp hiểu.
5. Khung trống lúc chuyển cảnh.
6. Hiệu ứng bám vật (quầng sáng, vệt highlight, khung soi) không còn bám đúng vật sau khi camera đi.

**Âm thanh (chưa áp dụng):** phim tham chiếu coi âm thanh là một nửa (nhạc, tiếng động theo hành động, khoảng lặng trước khoảnh khắc chính). Pipeline hiện chưa có nhạc nền (tạm bỏ 23/10/2026); đây là chỗ hổng lớn còn lại của cảm giác "nhàm", cần người dùng quyết riêng.

## 9. Gói phong cách (B1 chọn, B3 theo)

Mỗi video chọn **một phong cách** trong `.agents/phong-cach/` (trường `style` của `script.json`). Gói phong cách là luật *nhìn* (chất liệu, màu, chữ, chuyển động, máy, khoảnh khắc riêng), gói môn là luật *nội dung* của môn. Phong cách nào cũng có mục **"không phải là"** và **"biên độ biến tấu"** để video sau không lặp video trước. Tạo phong cách mới từ `_mau.md` cùng người dùng.

## Phép thử mỗi ảnh storyboard (B3, Bước 2b)

1. Che hết chữ: còn thấy một hình hoặc vật lớn đang kể chuyện không?
2. Có khối nào đè lên khối nào không?
3. Xem ảnh thu nhỏ 30% (như trên điện thoại): đọc được mọi chữ không?
4. Có câu nào trên hình chép lại lời đọc không?
5. Kịch bản nhắc ảnh: ảnh có trên hình không?
6. Dán vào PowerPoint thì có lẫn với một slide không?
7. Xem lướt cả dãy ảnh: máy có đổi cỡ khung, có ≥ 4 kiểu máy, nhịp có chỗ nhanh chỗ chậm không? Có ≥ 4/6 yếu tố khác video trước không?

## Nguồn

- Mayer, nguyên tắc học đa phương tiện (coherence, signaling, spatial contiguity, redundancy): [Cambridge Handbook of Multimedia Learning](https://cambridge.org/core/books/cambridge-handbook-of-multimedia-learning/principles-for-reducing-extraneous-processing-in-multimedia-learning/F29A19FCD34C542806F736E0661C05F5), [tóm tắt Mayer 2020](https://ugc.futurelearn.com/uploads/files/7d/d6/7dd6188d-c343-4311-b064-ac98d2c95abc/Multimedia_Principles._R._E._Mayer__2020.pdf).
- Chữ lặp lời đọc làm nhớ và vận dụng kém hơn: [Mayer, Heiser & Lonn 2001](https://www.csus.edu/indiv/e/eppersonm/hist107/documents/mayer,%20heiser,%20&%20lonn%20(2001).pdf); chữ ngắn trong sơ đồ thì không bị ảnh hưởng: [Yue, Bjork & Bjork 2013](https://sites.lifesci.ucla.edu/psych-bjorklab/wp-content/uploads/sites/13/2016/07/YueBjorkBjork2013_redundancy.pdf).
- Chi tiết hấp dẫn nhưng không liên quan (ảnh trang trí) làm học kém: [Brom & Hannemann, tổng hợp](https://ksvi.mff.cuni.cz/amulab/wp-content/uploads/2018/11/MultimLn3_BromHannemann_181117.pdf).
- Cỡ chữ trên video: [tổng hợp hướng dẫn phụ đề, sàn HD ~44px, 1/20–1/10 chiều cao khung](https://subanana.com/en-HK/blog/four-points-to-note-when-creating-video-subtitle).
- Kurzgesagt phác ẩn dụ hình và **cách chuyển giữa các ý** trước khi vẽ: [Our video process](https://kurzgesagt.org/youtube/).
- 3Blue1Brown dựng bằng phép biến hình nối liền thay vì cắt cảnh: [How I animate 3Blue1Brown](https://www.3blue1brown.com/lessons/manim-demo/).
- Phương pháp đạo diễn (mẫu tham chiếu, ba cấu trúc, khoảnh khắc riêng, ≥ 4 kiểu máy, nhịp đổi, phép thử không lặp, danh sách lỗi) và cấu trúc gói phong cách: [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar), file `DIRECTOR.md` và `styles/*/STYLE.md` (MIT, © 2026 LemoLab), phỏng lại cho video giáo dục có giọng đọc.
