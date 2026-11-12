# Nhật ký phiên bản

Mỗi bản phát hành có một mục, bản mới nhất ở trên cùng. Người làm video hỏi Codex "bản này cập nhật gì" thì Codex đọc file này để trả lời.

**Cách viết** (cho người phát triển):
- Mỗi thay đổi người dùng cảm nhận được, khi merge vào `main-codex`, thêm một dòng vào mục `## Chưa phát hành`, đúng nhóm môn.
- Viết theo điều người làm video thấy hoặc làm được ("Thêm môn Sinh", "Chữ không còn tràn khỏi khung"). Không ghi tên file hay thuật ngữ code.
- Khi phát hành: đổi tiêu đề `## Chưa phát hành` thành `## Bản <số> — <YYYY-MM-DD>`, rồi tạo lại một mục `## Chưa phát hành` trống ở trên (xem `docs/git-branching.md` mục 4).
- Mỗi bản chia theo nhóm: `### Chung (mọi môn)` trước, rồi `### <Tên môn>` cho từng môn có thay đổi riêng. Trong mỗi nhóm có tối đa hai phần **Có gì mới**, **Sửa lỗi** (bỏ phần nào không có). Môn không có thay đổi riêng thì ghi một dòng nói rõ. Cuối bản là `### Cần làm sau khi cập nhật` (nếu có).

## Chưa phát hành

## Bản 2 — 2026-11-13

Bản đầu tiên làm việc với **Codex** (thay Gemini/Antigravity). Có thêm luật làm video chung cho mọi môn (sáu phép thử, bảng nội dung duyệt trước), bước soát bố cục bắt được nhiều lỗi hơn, và nâng cấp lớn cho Hóa, Sinh, Sử, Văn, Tiếng Anh.

### Chung (mọi môn)

**Có gì mới**
- Chuyển sang làm việc với **Codex**: Codex tự đọc quy chuẩn dự án, gói môn và các skill; gọi skill bằng `$ten-skill`. "Học sinh ảo" chạy như một trợ lý con riêng để nhận xét khách quan hơn.
- Tài liệu cho cộng tác viên viết lại theo Codex: cách cài, mở dự án, gọi skill, thu gọn hội thoại sau mỗi chặng, xem storyboard bằng trình duyệt.
- **Hỏi và đổi phiên bản ngay trong khung chat**: "đang dùng bản nào", "bản này cập nhật gì", "có bản mới chưa", "cập nhật bản mới nhất", "cập nhật lên bản 3", "chuyển sang bản <tên nhánh>", "quay lại bản cũ". Bài đang làm được cất giữ tự động khi đổi bản.
- Làm video theo **bài SGK**: trước khi viết, Codex trình **bảng nội dung** bằng lời thường (kiến thức nào, ở đoạn nào, hình gì) để bạn duyệt; không tự thu hẹp chủ đề hay bỏ ý. Có mẫu **thẻ bài học** chung cho mọi môn; kiểm tra kịch bản báo khi thiếu kiến thức của thẻ.
- Luật làm video gọn lại thành **sáu phép thử** dễ nhớ: đủ nội dung, không nhảy bước, biết đang xem gì, tắt tiếng vẫn hiểu, một khái niệm một tên, chữ đọc được.
- Luật **"thấy trước, gọi tên sau"**: mỗi ký hiệu, công thức chỉ hiện sau khi người xem đã thấy thứ nó gọi tên trên hình.
- Luật **hình và số tượng trưng**: hình chỉ để minh họa thì không cần nhãn; ảnh hoặc số liệu minh họa có ghi chú nhỏ ở góc; lời đọc không dừng lại giải thích "đây là mô hình". Kiểm tra kịch bản và bước soát bố cục tự chặn nhãn "Mô hình: …" kiểu cũ.
- Thấy cách hay hơn luật thì Codex **đề xuất ngoại lệ** để bạn duyệt, không im lặng làm khác. Bạn yêu cầu điều trái luật thì Codex nêu luật và lý do, đề xuất cách khác, hỏi lại; bạn vẫn muốn thì làm và ghi lại ngoại lệ đã duyệt.
- Câu định nghĩa viết bằng từ dễ hiểu; từ hay, từ hiếm chỉ dùng sau khi đã giải thích. Học sinh ảo báo khi gặp từ phải đoán nghĩa.
- Mỗi môn có danh sách thuật ngữ riêng để kiểm tra kịch bản soát cách gọi tên cho đồng nhất.
- Hình giữ **liền mạch khi camera đổi góc nhìn**. Trích dẫn ở lại đến hết lời phân tích, nhãn giới thiệu tắt sớm. Câu chốt ở đáy chỉ hiện khi người xem cần giữ lại một ý.
- Lời đọc có câu dài ngắn xen nhau và chỗ đổi giọng để nghe không đều đều; bước tạo giọng nghe thử cả đoạn đầu, đều đều thì sửa lời từ kịch bản.
- Hai thứ khác nghĩa trên cùng hình phải **khác hẳn màu**, không chỉ đậm nhạt. Bộ phận trong sơ đồ vẫn cần tên khi bộ phận cùng loại đã có nhãn hoặc hình giản lược khó nhận ra.
- Ảnh **chồng nhiều khung hình** để thấy ngay vật chuyển động đi tới đâu; bước soát bố cục kiểm suốt cả đoạn chuyển động chứ không chỉ một khung.
- Mọi môn dùng chung một ảnh mở đầu (logo + tiêu đề), không môn nào có ảnh mở đầu riêng.
- Góp ý về video làm ngoài dự án có chỗ ghi lại để Codex học theo.

**Sửa lỗi**
- Các ý liệt kê không còn hiện chồng lên nhau: chỗ của từng ý được chia sẵn, bước soát bố cục tự báo khi hai khối đè nhau.
- Nhãn gắn vào vật đang chuyển động (thuyền, xe, người) không còn giật hay nhảy chỗ.
- Chữ trong hộp luôn vừa khung **và** không nhỏ hơn cỡ tối thiểu; cỡ chữ tối thiểu thống nhất một con số cho mọi chỗ (trước đây lệch nhau).
- Các lớp hình chuyển động (sóng trong lòng sông, bọt khí trong cốc, bào quan trong tế bào) không còn lệch ra ngoài lớp chứa.
- Bước soát bố cục bắt thêm: công thức lỗi hiện chữ đỏ, công thức chưa hiện thành công thức, nhãn "mô hình" thừa, chữ to hơn ô/khung chứa nó.
- Bước soát bố cục không còn báo nhầm "dồn cụm" hay "nửa khung trống" khi trên hình có bảng/sơ đồ không ghi chữ.
- Phép thử "tắt tiếng vẫn hiểu" nói rõ là hiểu **nhờ hình**, không phải nhờ ghi thêm chữ; kiểm tra kịch bản báo khi một dòng chỉ thêm chữ mà hình đứng yên.
- Từ khóa trong thẻ bài học phải là cụm lời thường (không công thức, ký hiệu), nên kiểm tra không còn báo thiếu kiến thức sai.
- Công thức có chỉ số ở giữa (H₂O, H₂SO₄) không còn bị mất chữ phía sau trên nhãn.

### Toán

**Có gì mới**
- Vật thật đặt lên hệ trục (máy bay, tàu, vệ tinh trên Oxy/Oxyz) dùng **tọa độ đẹp, số trơn**, không kèm dòng quy đổi kiểu "(đơn vị: 100 m)" hay nhãn "mô hình". Cần nói độ cao, khoảng cách thật thì nói thẳng bằng đơn vị thật ("cao 10.000 m").
- Luật riêng của Toán về số và đơn vị (mô hình trừu tượng dùng số trơn) được ghi rõ là ngoại lệ của luật chung, không còn mâu thuẫn.
- Video Toán dùng được mọi cải tiến ở mục Chung: bảng nội dung theo bài SGK, thẻ bài học, "thấy trước, gọi tên sau" cho từng công thức, bước soát bố cục báo công thức lỗi.

### Vật lí

**Có gì mới**
- Video lý giải công thức đi từ **hiện tượng trước, công thức sau**; công thức được hiện ở bất cứ đâu trong video (bỏ luật "chỉ ở 20% cuối"), miễn mọi đại lượng trong nó đã thấy trên hình.
- Luật "vẽ đủ chi tiết, không khối sơ sài" chỉ áp cho vật chính của cảnh; vật phụ dạng nhóm (đám đông, dãy xe ở xa) được vẽ đơn giản như biểu tượng.
- Clip thử về **quán tính**: dùng cửa sổ và sàn xe làm mốc để thấy người trong xe chuyển động thế nào.

### Hóa học

**Có gì mới**
- Gói Hóa viết lại theo góp ý cộng tác viên: các luật bắt buộc kèm ví dụ sai/đúng, mỗi loại khái niệm có kiểu hình bắt buộc, thứ tự "hạt trước, ký hiệu sau" cho từng khái niệm.
- Video Hóa theo bài SGK có sẵn **thẻ bài học** Hóa 10 Bài 5 (cấu tạo bảng tuần hoàn) và Bài 13 (phản ứng oxi hoá – khử).
- **Bảng tuần hoàn** đúng hình SGK, **ô nguyên tố** phóng to, thí nghiệm **kim loại kiềm thả vào nước** (lithium, sodium, potassium phản ứng mạnh yếu khác nhau, có thẻ tên).
- Hình cho **phản ứng oxi hoá – khử**: công thức ghi số oxi hoá trên từng nguyên tố (tự kiểm tổng), bảng chất khử / chất oxi hoá dễ nhầm, cái cân electron nhường = nhận, đinh iron trong dung dịch copper(II) sulfate.
- **Tên chất**: lời đọc dùng tên Việt quen (natri, axit axetic, butin), còn chữ trên hình và phụ đề luôn là tên quốc tế IUPAC (sodium, acetic acid, butyne); nhóm gọi là IA…VIIIA. Kiểm tra kịch bản báo khi phụ đề/hình còn tên Việt kiểu cũ, khi lời đọc dùng tên tiếng Anh, khi gọi "nhóm 1…18". Cách đọc "clo-rin", "clo-rai", "clo-rích" được chấp nhận.
- Phương trình hóa học viết bằng cú pháp hóa học chuẩn hiển thị đúng ngay, không cần cài thêm.
- Có phòng thử riêng để xem toàn bộ hình dựng sẵn của Hóa ở cỡ nhỏ nhất và lớn nhất.

**Sửa lỗi**
- Chữ trong bảng tuần hoàn, ô nguyên tố, cốc thí nghiệm luôn đủ to để đọc mà không tràn ô; ô quá nhỏ thì tên ô được tô ghi ngay cạnh ô; tên dài tự xuống dòng.
- Bỏ ảnh mở đầu riêng của Hóa (chưa qua duyệt), dùng ảnh mở đầu chung như mọi môn.

### Sinh học

**Có gì mới**
- Hình dựng sẵn: **cơ thể người** nhìn thẳng với cơ quan đúng vị trí, mạch máu và đường đi của thức ăn, oxygen, carbon dioxide; **cửa sổ soi** vào mao mạch ở mô, phổi, ruột; **phân tử** glucose (phân giải thành carbon dioxide), ATP (tách nhóm phosphate), amino acid, chuỗi tinh bột và protein.
- Cửa sổ phóng to (soi vào một chi tiết) dùng được cho mọi hình, không riêng đồ thị.
- Gói Sinh có luật mới cho video trao đổi chất: vẽ đủ đường trao đổi với môi trường, mỗi chất một màu riêng, sơ đồ cơ thể nhiều quá trình hiện lần lượt.

**Sửa lỗi**
- Video Sinh về cơ thể rõ hơn: mọi cơ quan được nhắc tới đều có tên đặt đúng trên cơ quan; mỗi quá trình hiện lần lượt với màu khác hẳn nhau, mũi tên đi từ ngoài cơ thể theo mạch máu tới tế bào; glucose, ATP, amino acid vẽ theo cấu trúc thật giản lược thay cho các cục tròn.

### Lịch sử

**Có gì mới**
- Video Sử dùng **nền sáng** như các môn khác; không khí trang trọng đến từ màu nhấn, bản đồ và tư liệu.
- Hướng dẫn lên cảnh kiểu đồ họa chuyển động: bản đồ phủ khung, camera dịch và zoom trên cùng một sân khấu, tách người và đạo cụ khỏi phông để diễn hoạt, mở vùng soi ngay trên ảnh hiện vật.
- Một hành động (tàu tiến, quân rút…) được chạy qua nhiều dòng lời đọc để thấy trọn diễn biến.
- Bản thử **eo Malacca**, **Bạch Đằng** và bốn cảnh về trích dẫn, ngoại giao, cải cách, văn minh.

**Sửa lỗi**
- Bản đồ và hiện vật giữ liền mạch qua các đoạn zoom; nhãn tên phe, nhân vật chỉ hiện lúc cần đọc rồi tắt.
- Ghi rõ bộ hình sa bàn, hồ sơ, cải cách, cán cân lực lượng của Sử **chưa có trong bản chính**; Codex kiểm trước khi dùng, không báo lỗi khó hiểu.

### Ngữ văn

**Có gì mới**
- Video Văn sinh động hơn, không còn toàn thẻ chữ như slide: mỗi video có một **hình trung tâm** để các ý gắn vào (kiểu "ngôi đền ba trụ cột"), có minh họa cảnh trong tác phẩm, có phép thử "slide chữ" để tự soát.
- Minh họa theo kiểu **tranh phẳng nhiều chi tiết** (đò mui tre, áo dài, nón lá…), có video mẫu ẩn dụ "Thuyền về có nhớ bến chăng".
- Clip thử "Cảnh ngày xuân": hai câu thơ hiện trực tiếp trên nền trời, font tiếng Việt có chân nạp sẵn.
- Video Văn dùng **nền sáng** như các môn khác.

**Sửa lỗi**
- Trích dẫn thơ, văn ở lại trên hình đến hết lời phân tích, không biến mất giữa chừng.

### Tiếng Anh

**Có gì mới**
- Từ, cụm, câu mẫu tiếng Anh được **đọc nguyên văn bằng giọng Anh thật**, ghép liền với giọng Việt trong cùng một câu ("Động từ *play* chỉ cần thêm *s*").
- Giọng Anh tự chọn **cùng giới** với giọng Việt thuyết minh (nữ – c Nhi hoặc nam – c Bình), cùng độ to; chỗ đổi giọng nghỉ ngắn dài theo dấu câu nên nghe liền.
- Phụ đề hiện câu sạch, không có ký hiệu đánh dấu; chữ cái đứng riêng đọc theo tên chữ (*s* đọc /es/); thuật ngữ ngữ pháp vẫn nói tiếng Việt như SGK; nghĩa tiếng Việt nói sau ví dụ gốc.

**Sửa lỗi**
- Không còn dịch câu mẫu sang tiếng Việt ("chỉ chơi", "câu cô ấy vui") hay đọc "be" thành "bê".
- Kiểm tra kịch bản báo ngay khi có từ tiếng Anh chưa đánh dấu hoặc câu mẫu bị dịch.

### Địa lí, Kinh tế và Pháp luật

- Không có thay đổi riêng trong bản này; hai môn dùng toàn bộ cải tiến ở mục Chung (bảng nội dung, thẻ bài học, sáu phép thử, soát bố cục).

### Cần làm sau khi cập nhật

- Dùng **Codex** thay cho Gemini/Antigravity: cài theo `docs/HUONG_DAN_CODEX.md`. Nhánh chính đổi tên thành `main-codex`.
- Từ bản 1 lên bản 2 phải cập nhật bằng tay một lần (bản 1 chưa có skill đổi bản). Từ bản 2 trở đi chỉ cần nói với Codex "cập nhật bản mới nhất".
- Video dựng trước 10/11/2026 còn nhãn "Mô hình: …" sẽ bị kiểm tra kịch bản báo lỗi. Muốn render lại nguyên bản thì đồng ý để Codex ghi ngoại lệ, không cần sửa video.

## Bản 1 — 2026-11-08

Bản ổn định đầu tiên (tag `v1.0.0`), làm việc với Gemini/Antigravity.

### Có gì mới
- Gói môn mới: Lý, Hoá, Sinh, Sử, Địa, Văn, Kinh tế và Pháp luật, Tiếng Anh, kèm tài liệu SGK tham khảo theo chương trình GDPT 2018.
- Ba giọng đọc Vivibe (nam, nữ, tiếng Anh), đổi giọng theo từng cảnh hoặc từng câu.
- Từ điển phiên âm: đọc đúng công thức hoá học, ký hiệu toán, chữ viết tắt.
- Quy trình 3 bước: kịch bản → duyệt hình nháp (miễn phí) → tạo giọng đọc và xuất video.

### Sửa lỗi
- Chữ không còn tràn khỏi khung hoặc đè lên hình, nhãn không còn chồng nhau.
- Công thức toán không còn bị rung.
