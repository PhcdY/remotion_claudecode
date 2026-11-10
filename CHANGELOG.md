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
