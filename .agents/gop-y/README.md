# Góp ý cho video không có nguồn trong repo

Video do CTV dựng trên máy riêng (nguồn `src/videos/<slug>/` không có ở đây) thì không ghi được `FEEDBACK.md` cạnh video.
Ghi góp ý vào **`.agents/gop-y/<slug>.md`**, chép từ `_mau.md`. Video có nguồn trong repo vẫn dùng `src/videos/<slug>/FEEDBACK.md`.

Quy trình như mọi góp ý (AGENTS.md › Workflow bước 4):
1. Mỗi góp ý một dòng: thời điểm/beat (nếu biết), lời góp ý gốc, **họ lỗi** (mục lục ở đầu `.agents/lessons.md`), phép thử bị trượt (P0–P5).
2. Tìm gốc rễ: luật nào thiếu, mơ hồ hay mâu thuẫn; có chặn được bằng `check_script` / `check-layout` / component không.
3. Sửa skill hoặc gói môn, ghi cột "đã sửa skill", thêm một mục vào `.agents/lessons.md`.
4. Video của CTV: gửi lại cho CTV danh sách cần sửa (cột "cần sửa video").
