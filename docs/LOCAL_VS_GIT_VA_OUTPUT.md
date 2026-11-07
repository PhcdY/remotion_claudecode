# Hướng dẫn: Bản Clone Git vs Bản Local & Cách Xử lý Output

Tài liệu này giải thích chi tiết cho các thành viên trong nhóm và Creator về:
1. Những thành phần **bị thiếu** khi bạn `git clone` dự án từ GitHub về máy tính cá nhân so với bản local đầy đủ (do cơ chế `.gitignore`).
2. Cách thiết lập/khôi phục lại các thành phần đó một cách nhanh chóng.
3. **Quy trình xử lý file đầu ra (Output)** sau khi video được sản xuất xong.

---

## 1. Bảng Đối chiếu: Bản Git Clone vs Bản Local Đầy đủ

Khi bạn clone dự án từ GitHub về, Git chỉ tải về **mã nguồn và bộ quy chuẩn**. Các file nặng, file bí mật cá nhân và file sinh tự động đều đã được chặn lại bởi file [.gitignore](file:///d:/Video%20AI/.gitignore).

| Thành phần bị thiếu trên Git | Lý do bị chặn (`.gitignore`) | Cách xử lý / Khôi phục ở máy Local |
| :--- | :--- | :--- |
| **`node_modules/`** | Thư mục thư viện cài đặt rất nặng (~300MB - 500MB), không bao giờ đưa lên Git. | Mở Terminal và gõ: `npm install` để tự động tải lại toàn bộ. |
| **`.env`** | Chứa API key bí mật (`VIVIBE_API_KEY`). Đưa lên GitHub sẽ bị lộ chìa khoá ra ngoài và mất tiền credit. | Tự tạo file `.env` ở thư mục gốc và dán key của bạn vào: `VIVIBE_API_KEY=your_key`. |
| **`public/audio/`** | Chứa hàng trăm file `.mp3` giọng đọc AI sinh tự động từ Vivibe TTS. | Không cần commit lên Git. Khi làm bài nào, AI hoặc bạn chỉ cần chạy script `py scripts/vivibe_tts.py ...` (Trạm 3) là tự sinh lại file audio chuẩn. |
| **`out/`** | Chứa video `.mp4` đã render và ảnh storyboard (dung lượng hàng GB). | Xuất hiện tự động khi bạn chạy lệnh xuất ảnh storyboard (`scripts/storyboard.mjs`) hoặc render video (`remotion render`). **Mẹo**: Cấu hình `OUTPUT_DIR="D:/Thư_mục_ngoài"` trong `.env` để video tự lưu ra ổ riêng/Google Drive. |
| **`references/**/raw_pdf/` & `*.pdf`** | Sách giáo khoa gốc dạng PDF rất nặng (hàng trăm MB). | Chỉ lưu file PDF ở máy cá nhân để tham khảo khi cần. Toàn bộ nội dung cốt lõi đã được trích xuất thành các file `.md` siêu nhẹ và có sẵn trên Git trong thư mục `references/<môn>/...`. |
| **`.gemini/worktrees/`** | Thư mục không gian làm việc tạm thời khi AI chạy song song. | Là thư mục rác tạm thời, không cần khôi phục. |
| **`dist/`, `__pycache__/`** | File build tạm thời của JavaScript và bộ đệm Python. | Tự sinh khi thực thi lệnh. |

---

## 2. Quy trình Xử lý File Đầu ra (Output Management)

Toàn bộ sản phẩm kết xuất trong quá trình sản xuất video đều nằm gọn trong thư mục `out/`.

### 2.1. Cấu trúc của thư mục `out/`
```text
out/
├── _lam-viec/                           # Thư mục dành cho quá trình kiểm tra & duyệt hình
│   └── <slug>/                          # Tên bài học (ví dụ: bieu-thuc-toa-do-phep-toan-vecto)
│       ├── storyboard.png               # Ảnh ghép toàn bộ các cảnh trong video từ đầu đến cuối
│       └── stills/                      # Các ảnh chụp frame quan trọng để kiểm tra chữ/layout
│
└── <Môn>/                               # Thư mục chứa VIDEO THÀNH PHẨM (Ví dụ: Toan)
    └── Lớp <lop>/<Chương>/<Bài>/
        ├── <slug>.mp4                   # File video Full HD 1080p, 30fps hoàn chỉnh
        ├── <slug>.srt                   # File phụ đề chuẩn
        └── <slug>.timeline.json         # Dữ liệu mốc thời gian từng câu/từ
```

---

### 2.2. Người dùng cần xử lý Output thế nào?

1. **Giai đoạn duyệt (Trạm 2)**:
   - Bạn mở file `out/_lam-viec/<slug>/storyboard.png` để kiểm tra toàn bộ màu sắc, vị trí đồ thị, vector và chữ.
   - Nếu phát hiện chỗ nào chưa ưng ý (chữ che hình, màu nhạt), bạn yêu cầu AI sửa trực tiếp trên code trước khi tốn credit tạo giọng đọc.

2. **Giai đoạn nhận video thành phẩm (Trạm 3)**:
   - Khi render xong, video nằm tại `out/<Môn>/Lớp <lop>/.../<slug>.mp4` (hoặc thư mục `OUTPUT_DIR` bên ngoài nếu bạn đã cấu hình trong `.env`).
   - **Tự động lưu ra ổ cá nhân / Google Drive**: Chỉ cần thêm dòng sau vào `.env`:
     ```env
     OUTPUT_DIR="D:/Video_Thanh_Pham" 
     # hoặc: OUTPUT_DIR="G:/My Drive/9Study_Videos"
     ```
     Remotion sẽ tự động xuất thẳng file `.mp4` và phụ đề vào thư mục này, không cần kéo tay!
   - Nếu không dùng `OUTPUT_DIR`, bạn copy file `.mp4` từ `out/` ra ổ cá nhân/kênh phân phối.

3. **Dọn dẹp giải phóng ổ cứng (Clean-up)**:
   - Thư mục `out/` có thể xoá bất cứ lúc nào khi ổ cứng bị đầy.
   - **Không sợ mất dữ liệu**: Toàn bộ kịch bản, animation, toạ độ toán học và logic video đều được lưu trữ vĩnh viễn trong `src/videos/<slug>/`. Bất cứ khi nào bạn muốn xuất lại video, chỉ cần chạy một lệnh render là có lại video y hệt trong vài phút!
