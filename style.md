# Style video 9Study

Nguồn: `D:\9study\context\9Study Brand Guideline.pdf` (Logo, Color palette, Typography, Hierarchy).
Code: màu/font/bố cục ở `src/components/theme.ts`, khung nền ở `src/components/BrandFrame.tsx`.

## Tinh thần

Sáng, sạch, hiện đại, giống giao diện 9study.vn: nền trắng ngả xanh rất nhạt, khối trắng bo góc, điểm nhấn xanh thương hiệu. Hình toán là nhân vật chính; khung chỉ làm nền, không tranh chú ý.

## Màu

| Vai trò | Mã | Ghi chú |
|---|---|---|
| Xanh thương hiệu (Blue) | `#4B87F4` | đường đồ thị chính |
| Chàm thương hiệu (Indigo) | `#3D4AEF` | **màu nhấn**: câu chốt, điểm quan trọng, tiếp tuyến |
| Navy (chữ chính) | `#0E1046` | lấy từ chữ "Study" trong logo |
| Chữ phụ | `#5E6785` | |
| Nền | `#F6F8FE` → `#FFFFFF` | gradient rất nhẹ |
| Khối/thẻ | `#FFFFFF`, viền `#E4EAF6` | bo 24px, bóng rất nhẹ ánh chàm |
| Lưới / trục | `#E4EAF6` / `#8A94AE` | |
| Tăng (f' > 0) | `#12A150` | |
| Giảm (f' < 0) | `#E5484D` | |
| Cảnh báo | `#EA7A00` | bẫy, chỗ dễ sai |
| Màu 1 / Màu 2 | `#0E9F9A` / `#C026D3` | tách hai đại lượng (Δx / Δy, mẫu / tử) |

Tint thương hiệu (80/60/40/20%) dùng cho nền khối và mảng trang trí, không dùng cho chữ.

## Chữ

- Font: **Plus Jakarta Sans** (theo brand). Phân cấp: ExtraBold 800 = tiêu đề / câu chốt; Bold 700 = tiêu đề phụ, thẻ mở beat; SemiBold 600 = nhãn, chữ trong cảnh; Regular 400 = chú thích, số trục.
- Công thức: KaTeX, cùng màu chữ navy.
- Cỡ tối thiểu theo skill `dung-video` › Quy tắc bố cục.

## Khung chung (`BrandFrame`)

- **Nền**: gradient trắng → xanh rất nhạt; hai mảng tròn mờ tint xanh/chàm ở góc trên phải và dưới trái (nằm một phần ngoài khung, trôi rất chậm); vài cụm chấm lưới nhỏ ở góc. Không hoạ tiết nào lấn vào vùng hình chính.
- **Logo**: logo ngang (`public/brand/logo-horizontal.png`) góc trên trái, cao 52px (rộng ≈ 144px, ≥ 120px tối thiểu của brand), giữ vùng an toàn. Đây là thành phần thường trực duy nhất. Không đổi màu, không kéo giãn, không thêm hiệu ứng (brand › Incorrect usage).
- **Thanh tiến độ**: vạch 6px sát đáy khung, gradient xanh → chàm, cho người xem biết video đã đi tới đâu.
- **Mở đầu** (~1,6 s): logo lớn giữa khung + tiêu đề video (ExtraBold), rồi vào hook.
- **Kết** (~2,5 s): logo + `9study.vn`.

## Vùng (cập nhật cho skill `dung-video`)

| Vùng | y |
|---|---|
| Logo | 30 – 90 (chỉ góc trái, x ≤ 260) |
| Hình | 110 – 1040 (câu chốt ở dải 950 – 1040); video cũ: hình 110 – 820, phụ đề 860 – 1040 |
| Thanh tiến độ | 1074 – 1080 |

## Thẻ, Khối & Sân khấu Toàn khung (Stage Guidelines)

- **Sân khấu Toàn khung (Hero Stage Canvas)**: Toàn bộ khung 1920×1080 là sân khấu. Sân khấu hình ảnh chính (đồ thị, sa bàn, sơ đồ thể chế, mô hình tế bào, phòng thí nghiệm) BẮT BUỘC chiếm tối thiểu 75% diện tích khả dụng (rộng ≥ 1500px, cao ≥ 750px; dùng `StagePanel` trong `src/components/Card.tsx`). CẤM TUYỆT ĐỐI co cụm nội dung chính vào một chiếc Card/Box con nhỏ (800–1000px) lọt thỏm ở giữa màn hình.
- **Thẻ thông tin phụ (SideCard, Bẫy, Tổng kết)**: Đặt ở góc phải hoặc xuất hiện tạm thời, nền trắng hoặc dark slate, viền bo 24px, bóng `0 8px 24px rgba(61,74,239,0.08)`. Bắt buộc có `boxSizing: "border-box"` và chiều rộng ≥ 620px.
- **Câu chốt (KeyTakeaway)**: nền tint chàm 8%, vạch trái chàm 8px, chữ chàm ExtraBold ở dải đáy 930–1040.
- **Thẻ mở beat**: nền trắng, viền chàm (hoặc cam với `BẪY THƯỜNG GẶP`), chữ Bold.
- **An toàn biên (Zero Cut-Off)**: Mọi chữ phải cách mép video ≥ 30px. Khi điểm neo ở $x > 1400$px, chữ bắt buộc neo hướng Tây (anchor left) phát triển ngược vào trong lòng màn hình.
- **Mũi tên tác động**: Dừng cách mục tiêu ≥ 24px, nhãn đặt tại gốc hoặc giữa thân mũi tên, cấm đè lên ngọn.
- **Universal MathText**: 100% text hiển thị phải qua `<MathText />`. Môn xã hội dùng Unicode `→`, cấm gõ `$\to$`.
