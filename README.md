# Video AI — Khung Sản Xuất Video Giải Thích Bản Chất (Remotion)

Hệ thống tự động hoá sản xuất video giáo dục giải thích bản chất đa môn học theo chuẩn GDPT 2018 (Toán, Lý, Hoá, Sinh, Sử, Địa, Văn, KTPL, Tiếng Anh) định dạng 16:9 (1920×1080, 30fps), làm cùng trợ lý AI Codex, giọng đọc tiếng Việt clone qua Vivibe TTS (hỗ trợ Roster 3 personas đa giọng và đa ngôn ngữ), từ điển phiên âm chuẩn hóa khoa học và đồ hoạ chuyển động toán học Remotion.

---

## 📚 Tài liệu Hướng dẫn

- **Dành cho Cộng tác viên (Chỉ cần duyệt từng bước)**: [docs/HUONG_DAN_CHO_USER.md](docs/HUONG_DAN_CHO_USER.md) — Hướng dẫn bắt đầu và quy trình 3 bước từ kịch bản đến video thành phẩm.
- **Hướng dẫn dùng Codex**: [docs/HUONG_DAN_CODEX.md](docs/HUONG_DAN_CODEX.md) — Cài đặt, mở dự án, gọi skill bằng `$ten-skill`, lệnh `/compact`, agent con `hoc-sinh-ao` và mẹo ra lệnh AI.
- **Đối chiếu bản Git vs Local & Xử lý Output**: [docs/LOCAL_VS_GIT_VA_OUTPUT.md](docs/LOCAL_VS_GIT_VA_OUTPUT.md) — Giải thích các file bị `.gitignore` và vị trí video xuất ra.
- **Quy định đặt tên nhánh Git & Quản lý Engine**: [docs/git-branching.md](docs/git-branching.md) — Chuẩn đặt tên nhánh và quy chuẩn Pull Request cho người phát triển framework.
- **Thư viện tài liệu SGK tham khảo**: [references/README.md](references/README.md) — Cấu trúc tài liệu SGK chuẩn theo môn/lớp.

---

## 🌟 Điểm Nổi bật

1. **Hệ sinh thái Đa môn học Toàn diện (GDPT 2018)**:
   - **Tự nhiên**: Toán (`toan`), Vật lí (`ly`), Hóa học (`hoa`), Sinh học (`sinh`).
   - **Xã hội**: Lịch sử (`su`), Địa lí (`dia`), Ngữ văn (`van`), GD Kinh tế và Pháp luật (`ktpl`).
   - **Ngoại ngữ**: Tiếng Anh (`anh` / `tienganh`) với mô hình 5 Archetypes Ngữ pháp nhận thức (*Cognitive Grammar*).
2. **Roster 3 Giọng đọc Vivibe TTS (Multi-Voice Engine)**:
   - `nam - c Bình`: Dứt khoát, logic, chặt chẽ — dành cho các môn Tự nhiên.
   - `nữ - c Nhi`: Ấm áp, truyền cảm, giàu cảm xúc — dành cho các môn Xã hội.
   - `anh-male`: Giọng bản xứ chuẩn IPA, song ngữ mượt mà — dành cho môn Tiếng Anh.
   - Hỗ trợ đổi giọng linh hoạt theo từng cảnh/dòng (`voice` field) và tự động khử giật đầu file.
3. **Từ điển Phiên âm Khoa học Tập trung (`scripts/phonetic_dict.json`)**:
   - Tự động chuẩn hóa cách phát âm danh pháp IUPAC, công thức cấu tạo hóa học, ký hiệu toán học, chữ viết tắt quốc tế (*ASEAN*, *UNCLOS*, *NATO*) và thuật ngữ khoa học đời thực.
4. **Quy trình 3 Trạm Tinh gọn (Local-First)**:
   - Bước 1 (Kịch bản) $\to$ Bước 2 (Duyệt hình Storyboard miễn phí) $\to$ Bước 3 (Tạo Audio TTS & Xuất MP4).

---

## ⚡ Bắt đầu Nhanh

```bash
# 1. Cài đặt thư viện
npm install

# 2. Cấu hình API key âm thanh (tạo file .env)
# VIVIBE_API_KEY=your_key_here

# 3. Mở Remotion Studio xem trước trực tiếp
npm run dev

# 4. Kiểm tra kịch bản video (0 lỗi trước khi tạo audio)
py scripts/check_script.py <slug>

# 5. Mở Codex ở thư mục gốc dự án rồi gọi skill, ví dụ: $viet-kich-ban
codex
```

---

## 🏗️ Cấu trúc Thư mục

- `AGENTS.md`: Quy chuẩn chung của dự án, Codex tự đọc khi mở thư mục.
- `.agents/`: Bộ kỹ năng (`skills/`: `viet-kich-ban`, `dung-video`, `tao-audio`, `hoc-sinh-ao`, `remotion-best-practices`), gói quy chuẩn từng môn học (`mon/`) và sổ tay kinh nghiệm thực chiến (`lessons.md`).
- `.codex/agents/`: Agent con của Codex (`hoc-sinh-ao.toml`: học sinh ảo soát kịch bản/storyboard).
- `docs/`: Toàn bộ tài liệu hướng dẫn sử dụng, quản lý output và quy định Git.
- `public/`: Tài nguyên tĩnh (logo 9Study, font chữ Plus Jakarta Sans).
- `references/`: Thư viện tài liệu SGK tham khảo chuẩn phân theo từng môn học.
- `scripts/`: Bộ script tự động hoá kiểm tra kịch bản, âm thanh TTS đa giọng, từ điển phiên âm và layout.
- `src/`: Mã nguồn Remotion (core components, theme, không gian 3D/2D, animation và các video compositions).
