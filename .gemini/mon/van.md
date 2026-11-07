# Gói môn — Ngữ văn (ĐGNL & GDPT 2018)

Đọc kèm skill `viet-kich-ban` (B1), `tao-audio` (B2), `dung-video` (B3). Tài liệu này là **quy chuẩn cốt lõi** kết nối giữa **Biên kịch Văn (Non-tech)** và **Hệ thống Dựng Video (Tech Builder)**.
Bài học kinh nghiệm thực tế ghi tại: `.gemini/lessons.md`.

---

## 1. Tư duy kể chuyện & Trải nghiệm người xem (B1)

> [!IMPORTANT]
> **Không cố vẽ tranh để gợi cảm xúc**: Chúng ta là hệ thống đồ họa mã nguồn (Remotion/SVG), không phải studio họa sĩ vẽ tay. Mọi nỗ lực vẽ tranh tả thực hay cố tạo không khí cảm xúc đều sẽ dẫn đến hình ảnh nửa mùa, ngô nghê và nghiệp dư.
> **Cảm xúc để cho câu từ của tác giả và giọng đọc gánh vác.**
> **Hình ảnh trên màn hình có MỘT NHIỆM VỤ DUY NHẤT: Làm SÁNG RÕ cơ chế, cấu trúc và mạch ngầm tư duy để người xem hiểu bản chất và làm được bài thi.**

### 3 Nguyên tắc Bất biến:
1. **Văn bản là Trung tâm (Text as the Hero)**:
   - Thay vì vẽ tranh minh họa, hãy đưa chính **câu chữ, ngữ liệu** lên màn hình với Typography tinh tế, trang trọng, tương phản cao và cực kỳ dễ đọc.
2. **Mổ xẻ trực tiếp trên câu chữ (In-situ Breakdown)**:
   - Tương tác trực tiếp lên dòng text: Vệt highlight quét qua từ khóa quan trọng; tách đôi vế câu để lộ phép đối; đổi màu từ ngữ để chỉ ra nghĩa chuyển; đóng khung thành phần nòng cốt.
3. **Mạch ngầm hiển hiện (Visualizing Hidden Connections)**:
   - Dùng các đường nối vector thanh mảnh, nhãn neo (`AutoLabels`), và sơ đồ cấu trúc để biến những thứ "vô hình" (mạch ý, cấu tứ, phép liên kết, lỗi logic) thành thứ **mắt thấy được rõ ràng**.

---

## 2. Phạm vi kiến thức & Tài liệu tham khảo (B1)

- **Tài liệu tham khảo chuẩn**: Lưu tại `references/van/` gồm SGK 2018 (Kết nối tri thức, Cánh diều, Chân trời sáng tạo) và Đề thi Đánh giá năng lực (HSA, VNUHCM, SPT).
- Khi viết kịch bản, AI và Biên kịch **BẮT BUỘC tra cứu ngữ liệu trong thư mục này** để đảm bảo trích dẫn chính xác 100% nguyên văn bản tác phẩm, không nhớ mang máng hay sai lệch câu chữ.
- **Quy chuẩn trích dẫn ngữ liệu**:
  - Mỗi dòng hiển thị trên màn hình chỉ chứa 1 câu thơ, 1 vế câu hoặc 1 cụm từ then chốt ($\le 35$ ký tự).
  - Tuyệt đối không bê nguyên cả khổ thơ hay đoạn văn 5–7 dòng lên màn hình (gây quá tải thị giác).
  - Tác phẩm hoặc ngữ liệu lạ phải ghi rõ tác giả trong nhãn nhỏ.

---

## 3. Mẫu dựng khái niệm (B1 + B3)

Biên kịch non-tech khi viết kịch bản chỉ cần chọn các thao tác mổ xẻ văn bản trực quan dưới đây:

### 3.1. Thao tác Mổ xẻ Từ ngữ & Câu (Word & Syntax Operations)
* **Vệt quét Highlight (Kinetic Scanner)**:
  - Khi giọng đọc phân tích một từ ngữ đắt giá (nhãn thần câu thơ, từ Hán Việt, lỗi sai dùng từ): Vệt màu sáng quét qua từ đó, một nhãn neo (`AutoLabels`) bật lên bên cạnh giải thích bản chất.
* **Tách vế & Căn đối xứng (Spatial Splitting)**:
  - Dành cho *Phép Đối (Thơ Đường luật, câu đối, văn biền ngẫu)*: Câu thơ tự động tách làm hai vế, trượt sang hai bên và căn gióng thẳng hàng dọc ($4 \parallel 4$) để người xem thấy ngay sự cân đối chằn chặn của thanh điệu và từ loại.
* **Bóc tách Tầng nghĩa (Semantic Unlayering)**:
  - Dành cho *Biện pháp Tu từ (Ẩn dụ, Hoán dụ, Tượng trưng)*: Bên dưới từ ngữ gốc xuất hiện một tầng nghĩa ngầm thứ hai (suy ra bản chất). Mũi tên liên kết chỉ rõ nét tương đồng giữa hai tầng nghĩa.
* **Khung chịu lực Ngữ pháp (Syntax Wireframe)**:
  - Dành cho *Sửa lỗi câu, câu thiếu chủ - vị, lỗi quan hệ từ*: Câu văn được đóng khung thành các khối nòng cốt ($S$ - $V$). Thành phần Trạng ngữ ($TN$) thừa hoặc sai làm gãy kết cấu hiển thị rõ ràng bằng màu cảnh báo.

### 3.2. Thao tác Mạch liên kết & Cấu tứ (Macro Structure)
* **Mạng lưới Mạch ngầm (Connecting Vectors)**:
  - Dành cho *Cấu tứ trong thơ, Các phép liên kết câu/đoạn*: Các câu thơ/câu văn được bố trí trên một bố cục trang nhã. Những đường line vector phát sáng tự động nối từ từ khóa ở câu 1 sang từ khóa ở câu 3, câu 4 $\to$ Làm lộ ra mạng lưới cấu tứ mà mắt thường đọc lướt không nhìn ra được.
* **Ống kính 4 tầng (4-Step Lens)**:
  - Dành cho *Bố cục Thơ Đường (Đề - Thực - Luận - Kết)*: Khung 4 tầng hiển thị rõ ràng từng chức năng: Mở không gian $\to$ Cận cảnh tả thực $\to$ Nâng tầm chiêm nghiệm $\to$ Khép lại dư ba.
* **Ma trận Thuộc tính & Loại trừ (Attribute Grid)**:
  - Dành cho *Dạng bài ĐGNL (Chọn từ không cùng nhóm, tìm lỗi logic)*: Bảng ma trận 4 phương án, dòng quét thuộc tính sáng lên, đánh dấu tích xanh các từ đạt chuẩn và gạch đỏ từ bị lệch tiêu chí.

---

## 4. Số và đơn vị

Môn Văn **không có đại lượng vật lý**, áp dụng các quy chuẩn sau:
- **Số đếm câu/dòng thơ**: Viết chữ số Ả Rập trong `text` và `caption` (vd: "câu 3 và 4", "nhịp 2/2/3"), trong `speak` viết rõ chữ ("câu ba và bốn", "nhịp hai hai ba").
- **Thế kỷ & Thời kỳ lịch sử**: Viết số La Mã trong `text` (vd: "Thế kỷ XX", "giai đoạn 1930–1945"), trong `speak` đọc thuần Việt ("thế kỷ hai mươi").
- **Năm sáng tác / Năm sinh mất**: Đặt trong ngoặc đơn nhỏ cạnh tên tác giả/tác phẩm (vd: *Nguyễn Du (1765–1820)*).

---

## 5. Đọc ký hiệu, tên riêng (B2)

1. **Ngắt nhịp thơ & nhịp câu**:
   - Bắt buộc dùng dấu phẩy `,` hoặc `...` để ép giọng đọc AI ngắt đúng nhịp thi pháp (2/2/3, 4/3, 3/3).
2. **Khoảng dừng (`pauseAfter`)**:
   - Thêm `"pauseAfter": 1.5` sau các câu hỏi tư duy hoặc trước khi công bố đáp án đúng.
3. **Phiên âm chuẩn xác**:
   - Tên tác giả nước ngoài, thuật ngữ phiên âm thuần Việt trong `speak` (để AI đọc đúng) và viết chuẩn trong `caption` (để học sinh xem):

| Tên / Thuật ngữ | Viết trong `text` / `caption` | Viết trong `speak` | Ghi chú |
| :--- | :--- | :--- | :--- |
| Shakespeare | Shakespeare | Sếch-xpia | Đã kiểm tra Vivibe |
| Victor Hugo | Victor Hugo | Huy-gô | Đọc quen thuộc |
| Chủ ngữ / Vị ngữ | $S$ / $V$ | chủ ngữ, vị ngữ | CẤM viết "ét", "vê" |
| Ẩn dụ chuyển đổi cảm giác | Ẩn dụ CĐCG | ẩn dụ chuyển đổi cảm giác | Đọc đầy đủ |

---

## 6. Dựng hình (B3)

- **Bộ Core Components chuyên dụng môn Văn** nằm tại `src/components/van/`:
  - `TextDissector`: Component hiển thị câu văn với các vệt quét highlight động và nhãn neo `AutoLabels`.
  - `SplitPoemVerse`: Tách và căn gióng đối xứng hai vế câu thơ tự động bằng CSS Grid/Flex.
  - `AttributeMatrix`: Bảng 4 thẻ trắc nghiệm ĐGNL có hiệu ứng quét laser và đánh dấu tích xanh/gạch đỏ.
  - `ConnectingNetwork`: Vẽ các đường line SVG cong mượt nối các từ khóa theo mốc audio `cue`.
- **Màu sắc & Typography**:
  - Font chữ: Plus Jakarta Sans làm chủ đạo; trích dẫn thơ/văn có thể điểm xuyết kiểu Serif trang trọng.
  - Nền tối giản (`#0F172A` hoặc `#1E293B`), chữ trắng/xám sáng, màu highlight dùng vàng amber (`#F59E0B`) hoặc xanh ngọc (`#10B981`) để tập trung mắt nhìn.
