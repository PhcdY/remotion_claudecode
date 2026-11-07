# Video AI — Khung Sản Xuất Video Giải Thích Bản Chất (Remotion)

Hệ thống tự động hoá sản xuất video giáo dục giải thích bản chất (Toán, Lý, Hoá, Sinh, Sử, Địa...) định dạng 16:9 (1920×1080, 30fps), tích hợp AI Agent, giọng đọc tiếng Việt clone qua Vivibe TTS và đồ hoạ chuyển động toán học Remotion.

---

## 📚 Tài liệu Hướng dẫn

- **Dành cho Creator / User (Chỉ cần prompt)**: [docs/HUONG_DAN_CHO_USER.md](docs/HUONG_DAN_CHO_USER.md) — Quy trình 3 trạm từ kịch bản đến video thành phẩm.
- **Đối chiếu bản Git vs Local & Xử lý Output**: [docs/LOCAL_VS_GIT_VA_OUTPUT.md](docs/LOCAL_VS_GIT_VA_OUTPUT.md) — Giải thích các file bị `.gitignore` và vị trí video xuất ra.
- **Quy định đặt tên nhánh Git & Quản lý Engine**: [docs/git-branching.md](docs/git-branching.md) — Chuẩn đặt tên nhánh cho lập trình viên phát triển framework.
- **Thư viện tài liệu SGK tham khảo**: [references/README.md](references/README.md) — Cấu trúc tài liệu SGK chuẩn theo môn/lớp.

---

## ⚡ Bắt đầu Nhanh

```bash
# 1. Cài đặt thư viện
npm install

# 2. Cấu hình API key âm thanh (tạo file .env)
# VIVIBE_API_KEY=your_key_here

# 3. Mở Remotion Studio xem trước trực tiếp
npm run dev

# 4. Kiểm tra kịch bản video
py scripts/check_script.py <slug>
```

---

## 🏗️ Cấu trúc Thư mục

- `.agents/`: Bộ kỹ năng (Skills) và Agent hỗ trợ quy trình dựng video.
- `.gemini/`: Gói quy chuẩn từng môn học (`mon/`) và sổ tay kinh nghiệm (`lessons.md`).
- `docs/`: Toàn bộ tài liệu hướng dẫn sử dụng và quản lý hệ thống.
- `public/`: Tài nguyên tĩnh (logo 9Study, font chữ Plus Jakarta Sans).
- `references/`: Thư viện tài liệu SGK tham khảo chuẩn phân theo từng môn.
- `scripts/`: Bộ script tự động hoá kiểm tra kịch bản, âm thanh TTS, alignment mốc thời gian và layout.
- `src/`: Mã nguồn Remotion (core components, theme, animation và các video compositions).
