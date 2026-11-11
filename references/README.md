# Thư viện Tài liệu Tham khảo SGK (References)

Thư mục này chứa toàn bộ tài liệu tóm tắt kiến thức, định nghĩa, bài tập và ví dụ chuẩn theo chương trình Sách Giáo Khoa (SGK 2018 - Kết nối tri thức với cuộc sống), được phân loại rõ ràng theo từng môn học để phục vụ việc viết kịch bản video AI.

---

## Danh mục Môn học Hiện có

| Môn học | Thư mục Tham khảo | Phạm vi & Nội dung Cung cấp |
| :--- | :--- | :--- |
| **Toán học** | [**`references/toan/`**](./toan/README.md) | Tổng quan Lớp 10, 11, 12; Trọn bộ 19 bài SGK Toán 12 KNTT (Tập 1 & Tập 2). |
| **Vật lí** | [**`references/ly/`**](./ly/README.md) | Tổng quan Lớp 10, 11, 12; Bảng ánh xạ video AI 9Study ⟷ SGK KNTT & TSA/HSA. |
| **Hóa học** | [**`references/hoa/`**](./hoa/README.md) | Đề thi THPT 2026; Tổng quan Lớp 10, 11, 12; Bảng ánh xạ video AI ⟷ SGK GDPT 2018. |
| **Sinh học** | [**`references/sinh/`**](./sinh/README.md) | Tổng quan Lớp 10, 11, 12; Bảng ánh xạ video AI 9Study ⟷ SGK KNTT (Cơ quan & Cơ chế sống). |
| **Địa lí** | [**`references/dia/`**](./dia/README.md) | Đề thi THPT 2026; Tổng quan Lớp 10, 11, 12; Các chuyên đề Địa lí 12. |
| **Lịch sử** | [**`references/su/`**](./su/README.md) | Đề thi THPT 2026; Tổng quan Lớp 10, 11, 12; Các chuyên đề Lịch sử 11, 12. |
| **Ngữ văn** | [**`references/van/`**](./van/README.md) | Đề thi THPT 2026; Tổng quan Lớp 10, 11, 12; Các bài học Ngữ văn 11. |
| **GD Kinh tế & Pháp luật** | [**`references/ktpl/`**](./ktpl/README.md) | Đề thi THPT 2026; Bảng ma trận chuyên đề Kinh tế & Pháp luật, Micro Case Studies. |
| **Tiếng Anh** | [**`references/anh/`**](./anh/README.md) | Đề thi THPT 2026; 5 Archetypes Ngữ pháp nhận thức & Danh mục chủ điểm cốt lõi. |

---

## Cấu trúc Thư mục

Tài liệu được phân cấp theo mô hình:
```text
references/
├── <môn>/                  # Mã môn: toan, ly, hoa, sinh, su, dia...
│   ├── lop-10/             # Lớp 10
│   ├── lop-11/             # Lớp 11
│   ├── lop-12/             # Lớp 12
│   │   ├── tap-1/          # Tập 1
│   │   │   ├── bai-01-tinh-don-dieu-va-cuc-tri.md
│   │   │   ├── bai-02-gia-tri-lon-nhat-va-nho-nhat.md
│   │   │   └── ...
│   │   └── tap-2/          # Tập 2 (nếu có)
│   └── raw_pdf/            # (Bị .gitignore) Chứa file PDF SGK gốc rất nặng, chỉ lưu trữ ở local
└── README.md
```

---

## Nguyên tắc Sử dụng đối với AI & Creator

1. **AI BẮT BUỘC đọc tài liệu tham khảo trước**:
   - Khi nhận đề bài viết kịch bản một bài học (ví dụ: Toán 12 Bài 8), AI phải tự động tìm và đọc file `references/toan/lop-12/tap-1/bai-08-bieu-thuc-toa-do-cac-phep-toan-vecto.md`.
   - Bám sát: Thuật ngữ chính thống, hoạt động khởi động, câu hỏi khám phá, ví dụ tiêu biểu và ký hiệu chuẩn SGK.

2. **Thẻ bài học — "bài này phải có gì"** (video bài học, mọi môn):
   - File `bai-<NN>-….md` của một bài có mục `## Từ khóa kiểm tra` là **thẻ bài học**: kiến thức lõi K1…, bẫy thi T1…, ví dụ đã kiểm số, hook gợi ý, gợi ý chia video. `scripts/check_script.py` đọc thẻ và báo **lỗi** khi kịch bản thiếu mục nào (trừ mục người dùng đã duyệt bỏ).
   - Mẫu: [`_mau-the-bai-hoc.md`](./_mau-the-bai-hoc.md). Đã có: Hóa 10 Bài 5, Bài 13.
   - Bài chưa có thẻ → agent soạn theo mẫu (thêm các mục của mẫu vào file tóm tắt SGK nếu đã có), ghi "Trạng thái: chờ duyệt", đưa người dùng duyệt trước khi viết kịch bản.

3. **Quy định về file PDF gốc (`raw_pdf/`)**:
   - File PDF gốc (hàng chục đến hàng trăm MB) được lưu trong thư mục `raw_pdf/` ở máy cá nhân và được `.gitignore` để không làm nặng kho Git.
   - Chỉ các file `.md` đã trích xuất nội dung tinh gọn mới được commit lên Git.
