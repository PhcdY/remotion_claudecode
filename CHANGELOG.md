# Nhật ký phiên bản

Mỗi bản phát hành có một mục, bản mới nhất ở trên cùng. Người làm video hỏi Codex "bản này cập nhật gì" thì Codex đọc file này để trả lời.

**Cách viết** (cho người phát triển):
- Mỗi thay đổi người dùng cảm nhận được, khi merge vào `main-codex`, thêm một dòng vào mục `## Chưa phát hành`.
- Viết theo điều người làm video thấy hoặc làm được ("Thêm môn Sinh", "Chữ không còn tràn khỏi khung"). Không ghi tên file hay thuật ngữ code.
- Khi phát hành: đổi tiêu đề `## Chưa phát hành` thành `## Bản <số> — <YYYY-MM-DD>`, rồi tạo lại một mục `## Chưa phát hành` trống ở trên (xem `docs/git-branching.md` mục 4).
- Mỗi mục có tối đa 3 phần: **Có gì mới**, **Sửa lỗi**, **Cần làm sau khi cập nhật** (bỏ phần nào không có).

## Chưa phát hành

### Có gì mới
- Chuyển sang làm việc với **Codex**: Codex tự đọc quy chuẩn dự án và các skill, gọi skill bằng `$ten-skill`.
- Tài liệu cho cộng tác viên viết lại theo Codex.
- Luật mới về **hình và số tượng trưng**: hình chỉ để minh hoạ thì không cần nhãn, số liệu minh hoạ có ghi chú nhỏ ở góc. Bỏ kiểu dừng lại giải thích "đây là mô hình".
- Hỏi và đổi phiên bản ngay trong khung chat Codex: "đang dùng bản nào", "bản này cập nhật gì", "có bản mới chưa", "cập nhật bản mới nhất", "cập nhật lên bản 3", "quay lại bản cũ". Bài đang làm được cất giữ tự động khi đổi bản.
- Video **Văn** sinh động hơn: mỗi video có một hình trung tâm để các ý gắn vào (kiểu "ngôi đền ba trụ cột"), có minh họa hình ảnh trong tác phẩm bằng nét vẽ đơn giản, không còn toàn thẻ chữ như slide.
- Văn và Sử dùng nền sáng như các môn khác.
- Câu định nghĩa được viết bằng từ dễ hiểu; từ hay, từ hiếm chỉ dùng sau khi đã giải thích xong.
- Video **Hóa** có ảnh mở đầu mới: hình chính của chủ đề (vd. bảng tuần hoàn đang sáng một hàng, một cột) và 1–2 từ khóa đổi màu, to hơn.
- Hóa có sẵn bảng tuần hoàn đúng hình SGK (chữ luôn nằm gọn trong ô), ô nguyên tố phóng to, và thí nghiệm kim loại kiềm thả vào nước (lithium, sodium, potassium phản ứng mạnh yếu khác nhau, có thẻ tên).
- Kiểm tra kịch bản Hóa tự báo tên chất kiểu cũ (natri, axit…) và cách gọi nhóm "nhóm 1" — dùng tên IUPAC tiếng Anh và nhóm IA…VIIIA cho đồng nhất.
- Video **Hóa** theo bài SGK: trước khi viết, Codex trình bảng nội dung (kiến thức nào, ở đoạn nào, hình gì) để bạn duyệt; không tự thu hẹp chủ đề hay bỏ ý. Có sẵn "thẻ bài học" cho Hóa 10 Bài 5 và Bài 13, kiểm tra kịch bản báo khi thiếu kiến thức của thẻ.
- Hóa có thêm hình cho phản ứng oxi hoá – khử: công thức ghi số oxi hoá trên từng nguyên tố (tự kiểm tổng), bảng chất khử / chất oxi hoá dễ nhầm, cái cân electron nhường = nhận, đinh iron trong dung dịch copper(II) sulfate.
- Minh họa Văn theo kiểu tranh phẳng nhiều chi tiết (đò mui tre, áo dài, nón lá…), có video mẫu "Thuyền về có nhớ bến chăng".
- Mọi môn: làm video theo **bài SGK** thì Codex trình bảng nội dung (kiến thức nào, ở đoạn nào, hình gì) để bạn duyệt trước, không tự thu hẹp chủ đề; có mẫu "thẻ bài học" chung, kiểm tra kịch bản báo khi thiếu kiến thức của thẻ. Luật làm video gọn lại thành sáu phép thử dễ nhớ (đủ nội dung, không nhảy bước, biết đang xem gì, tắt tiếng vẫn hiểu, một khái niệm một tên, chữ đọc được). Thấy cách hay hơn luật thì Codex đề xuất để bạn duyệt, không im lặng làm khác.

### Sửa lỗi
- Các ý liệt kê không còn hiện chồng lên nhau: chỗ của từng ý được chia sẵn, và bước soát bố cục tự báo khi hai khối đè nhau.
- Nhãn gắn vào vật đang chuyển động (thuyền, xe, người) không còn giật hay nhảy chỗ.
- Bước soát bố cục tự bắt thêm: công thức bị lỗi hiện chữ đỏ, công thức chưa hiện thành công thức, nhãn "mô hình" thừa, chữ to hơn ô/khung chứa nó.

### Cần làm sau khi cập nhật
- Dùng Codex thay cho Gemini/Antigravity (xem `docs/HUONG_DAN_CODEX.md`).

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
