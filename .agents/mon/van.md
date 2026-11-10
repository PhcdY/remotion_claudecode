# Gói môn — Ngữ văn (ĐGNL & GDPT 2018)

Đọc kèm skill `viet-kich-ban` (B1), `tao-audio` (B2), `dung-video` (B3). Tài liệu này là **quy chuẩn cốt lõi** kết nối giữa **Biên kịch Văn (Non-tech)** và **Hệ thống Dựng Video (Tech Builder)**.
Bài học kinh nghiệm thực tế ghi tại: `.agents/lessons.md`.

---

## 1. Tư duy kể chuyện & Trải nghiệm người xem (B1)

> [!IMPORTANT]
> **Video Văn không phải slide chữ.** Người xem thật (10/11/2026) chê video Văn "toàn thẻ chữ, như đọc bài giảng, đọc slide". Mỗi video Văn cần **một hình trung tâm**: một vật để các ý gắn vào, biến đổi theo lời giảng.
> Cảm xúc vẫn do câu chữ của tác giả và giọng đọc gánh vác. Hình giúp người xem **thấy** cấu trúc, mạch ý và hình ảnh của tác phẩm.

**Mẫu được khen — "ngôi đền nghị luận"** (bài: ba yếu tố của văn nghị luận):
- Mái đền ghi "Bài văn nghị luận" lơ lửng, chưa có gì đỡ. Ba khung cột trống, đánh số 1–2–3, hiện ra.
- Từng cột dựng lên **đúng lúc giọng đọc gọi tên**: Luận điểm (biểu tượng tâm bia), Lí lẽ (mắt xích), Dẫn chứng (tờ tài liệu có dấu tích).
- Đủ ba cột thì mái hạ xuống, đặt vững, hiện nhãn "Vững ✓". Đó là khoảnh khắc "à ra thế": thiếu một cột thì bài văn đổ.
- Chữ chỉ là nhãn dán lên bộ phận của vật (tên cột, tính chất), không có thẻ chữ đứng riêng.

### Ba loại hình, chọn theo việc cần giải thích

1. **Hình tượng trưng cho khái niệm, cấu trúc** (dùng nhiều nhất): biến thứ trừu tượng (bố cục bài, quan hệ giữa các ý, mạch cảm xúc) thành một **vật quen thuộc có bộ phận**.
   - Gợi ý: ngôi nhà/đền (móng, cột, mái), cây (gốc → thân → cành), cầu thang (các bậc tăng dần), cán cân (hai vế đối lập), dòng sông (mạch chảy, khúc rẽ), xích/bánh răng (ý này kéo theo ý kia), la bàn/tấm bản đồ (hướng đi của bài).
   - **Mỗi bộ phận = đúng một ý**; bộ phận hiện ra đúng lúc lời gọi tên; khi đủ ý thì vật "đứng vững / chạy được / tới nơi", đó là câu chốt.
   - Theo loại 1 của skill `viet-kich-ban` › Hình và số tượng trưng: không gọi là "mô hình", không chú giải.
2. **Minh họa hình ảnh trong tác phẩm**: khi phân tích ngữ liệu có hình ảnh cụ thể (con thuyền, vầng trăng, dòng sông, ngọn đèn, mái tóc mẹ…).
   - Vẽ **chính hình ảnh đó** theo kiểu **tranh phẳng nhiều chi tiết**, đặt cạnh câu thơ chứa nó. Người xem thật (10/11/2026) chê bản icon trơn (thuyền = một hình bán nguyệt, người = khối tròn) là "quá đơn giản"; bản được duyệt có:
     - **chất liệu đọc được**: gỗ có vân/ván ghép, tre có nan đan, lá nón có gân, vải có nếp/hoa văn; mỗi vật 2–3 sắc độ cùng màu (sáng/vừa/tối), không đổ bóng hiện thực;
     - **chi tiết nhận diện văn hoá**: con đò có mui tre và mái chèo, bến có cọc và dây buộc, áo cánh – quần xắn – tay nải, áo dài có tà trước/tà sau, nón lá có quai, tóc dài;
     - **chuyển động nhỏ có nghĩa**: thuyền nhấp nhô, chèo khua khi thuyền đi, tà áo bay, bước chân; dừng khi vật đứng yên;
     - **người không vẽ mặt** (không mắt, mũi, miệng): đầu màu da + tóc/nón, dáng người và hướng nhìn kể chuyện (người ở lại quay về phía thuyền đi);
     - màu áo/viền của nhân vật là màu vai trò của vật tượng trưng cho họ (thuyền ↔ người ra đi cùng màu), để nối hai tầng nghĩa.
     - Mẫu: `src/videos/demo-van-an-du/Video.tsx` (ẩn dụ "Thuyền về có nhớ bến chăng"; thành phần `Boat`, `Dock`, `Boy`, `Girl`).
   - Từ trong câu và chi tiết trên hình **sáng cùng lúc, cùng màu** ("trăng" sáng ↔ vầng trăng hiện ra).
   - Hình đổi theo nghĩa: thuyền nhỏ dần khi đọc "xa", trăng khuyết dần thành tròn, đèn tắt khi câu thơ nói sự mất mát.
   - **Tránh**: người có khuôn mặt, biểu cảm chi tiết, phong cảnh tả thực nhiều lớp. Vẽ những thứ này bằng code dễ thành ngô nghê. Cần cảnh như thật (chân dung tác giả, tranh minh họa) thì dùng ảnh có sẵn do người dùng gửi (có quyền dùng), đặt trong `public/`, kèm nhãn nhỏ "Ảnh minh họa" (loại 2).
3. **Mổ xẻ trên câu chữ**: vệt highlight, tách vế, khung ngữ pháp (mục 3.1). Dùng khi chính câu chữ là bài học (biện pháp tu từ, phép đối, lỗi câu).
   - Kể cả khi đó, câu văn là **một phần của cảnh**, không phải cả màn hình là thẻ chữ: ghép với hình ảnh của từ đang phân tích (loại 2) hoặc với hình trung tâm (loại 1).

### Phép thử "slide chữ"
- Chụp ảnh giữa một beat bất kỳ, tắt tiếng: nếu chỉ thấy các khối chữ xếp hàng thì **chưa đạt**. Phải có ít nhất một vật/hình mà chữ gắn vào.
- Ngữ liệu trên màn hình: tối đa 1–2 câu thơ/vế câu cùng lúc (mục 2).

---

## 2. Phạm vi kiến thức & Tài liệu tham khảo (B1)

- **Tài liệu tham khảo chuẩn**: Lưu tại `references/van/` gồm SGK 2018 (Kết nối tri thức, Cánh diều, Chân trời sáng tạo) và Đề thi Đánh giá năng lực (HSA, VNUHCM, SPT).
- Khi viết kịch bản, AI và Biên kịch **BẮT BUỘC tra cứu ngữ liệu trong thư mục này** để đảm bảo trích dẫn chính xác 100% nguyên văn bản tác phẩm, không nhớ mang máng hay sai lệch câu chữ.
- **Quy chuẩn trích dẫn ngữ liệu**:
  - Mỗi dòng hiển thị trên màn hình chỉ chứa 1 câu thơ, 1 vế câu hoặc 1 cụm từ then chốt (≤ 35 ký tự).
  - Tuyệt đối không bê nguyên cả khổ thơ hay đoạn văn 5–7 dòng lên màn hình (gây quá tải thị giác).
  - Tác phẩm hoặc ngữ liệu lạ phải ghi rõ tác giả trong nhãn nhỏ.

### Lời giảng và định nghĩa: dễ hiểu trước, từ hay sau
Luật chung ở skill `viet-kich-ban` › Style › Lời định nghĩa. Riêng Văn dễ mắc vì từ ngữ văn chương hay, nhưng **câu định nghĩa phải hiểu ngay khi nghe một lần**.
- Thuật ngữ SGK (cấu tứ, thi pháp, ngữ liệu, nhãn tự, biền ngẫu, luận điểm…) là thứ cần dạy: nói nghĩa bằng lời thường **trước**, rồi mới gọi tên.
- Từ văn chương hiếm (dư ba, chằn chặn, chiêm nghiệm, tầng sâu, mạch ngầm, hàm súc…) được dùng khi phân tích, đọc tác phẩm; **không dùng trong câu định nghĩa** hay câu giải thích lần đầu một khái niệm.

| Không viết | Viết |
| :--- | :--- |
| "Cấu tứ là sự tổ chức nội tại mang tính chỉnh thể của tứ thơ." | "Cấu tứ là cách nhà thơ sắp xếp ý và hình ảnh để dẫn tới điều muốn nói." |
| "Phép đối tạo nên sự cân xứng chằn chặn." | "Phép đối đặt hai vế cạnh nhau, dài bằng nhau, ý tương ứng với nhau." |

---

## 3. Mẫu dựng khái niệm (B1 + B3)

Các thao tác dưới đây dùng **bên trong** một cảnh có hình trung tâm (mục 1), không thay cho nó.

### 3.1. Thao tác trên từ ngữ & câu
* **Vệt quét highlight**:
  - Khi giọng đọc phân tích một từ quan trọng (từ hay nhất của câu thơ, từ Hán Việt, từ dùng sai): vệt màu quét qua từ đó, một nhãn neo (`AutoLabels`) bật lên bên cạnh nói nghĩa của nó. Từ có hình ảnh → chi tiết tương ứng trên hình sáng cùng lúc.
* **Tách vế & căn đối xứng**:
  - Dành cho *phép đối (thơ Đường luật, câu đối, văn biền ngẫu)*: câu thơ tách làm hai vế, trượt sang hai bên và gióng thẳng hàng từng chữ (4 ∥ 4) để thấy các từ đứng cặp với nhau.
* **Bóc tách tầng nghĩa**:
  - Dành cho *biện pháp tu từ (ẩn dụ, hoán dụ, tượng trưng)*: dưới từ ngữ gốc hiện nghĩa thứ hai (nghĩa ngầm). Mũi tên nối hai tầng, nhãn nói điểm giống nhau. Có thể vẽ cả hai vật (vd. "mặt trời" thật ↔ người con).
* **Khung ngữ pháp**:
  - Dành cho *sửa lỗi câu, câu thiếu chủ – vị, lỗi quan hệ từ*: câu văn được đóng khung thành các khối nòng cốt ($S$ – $V$). Thành phần trạng ngữ ($TN$) thừa hoặc sai làm gãy câu hiện bằng màu cảnh báo.

### 3.2. Thao tác trên mạch ý & bố cục
* **Đường nối các từ khóa**:
  - Dành cho *cấu tứ bài thơ, phép liên kết câu/đoạn*: các câu thơ/câu văn đặt trên bố cục thoáng; đường nối mảnh hiện dần từ từ khóa câu 1 sang từ khóa câu 3, câu 4, để thấy các câu "móc" vào nhau thế nào.
* **Bốn phần của thơ Đường (Đề – Thực – Luận – Kết)**:
  - Bốn tầng, mỗi tầng một việc: Mở ra khung cảnh → Tả cận cảnh → Suy nghĩ rộng ra → Khép lại cảm xúc. Nên gắn lên hình trung tâm (bốn bậc thang, bốn đoạn đường…), không xếp thành bốn thẻ.
* **Bảng thuộc tính & loại trừ**:
  - Dành cho *dạng bài ĐGNL (chọn từ không cùng nhóm, tìm lỗi logic)*: 4 phương án xếp thành hàng hoặc lưới 2×2 cố định, dòng quét thuộc tính sáng lên, tích xanh các từ đạt, gạch đỏ từ lệch tiêu chí.

### 3.3. Liệt kê nhiều ý
Luật chung ở skill `dung-video` › quy tắc 3 (liệt kê). Với Văn: ưu tiên **gắn mỗi ý vào một bộ phận của hình trung tâm** (cột, bậc, cành). Không có hình phù hợp thì xếp hàng/cột cố định, chừa sẵn chỗ cho mọi ý, ý sau không đè lên ý trước.

---

## 4. Số và đơn vị

Môn Văn **không có đại lượng vật lý**, áp dụng các quy chuẩn sau:
- **Số đếm câu/dòng thơ**: Viết chữ số Ả Rập trong `text` và `caption` (vd: "câu 3 và 4", "nhịp 2/2/3"), trong `speak` viết rõ chữ ("câu ba và bốn", "nhịp hai hai ba").
- **Thế kỷ & Thời kỳ lịch sử**: Viết số La Mã trong `text` (vd: "Thế kỷ XX", "giai đoạn 1930–1945"), trong `speak` đọc thuần Việt ("thế kỷ hai mươi").
- **Năm sáng tác / Năm sinh mất**: Đặt trong ngoặc đơn nhỏ cạnh tên tác giả/tác phẩm (vd: *Nguyễn Du (1765–1820)*).

---

## 5. Đọc ký hiệu, tên riêng (B2)

1. **Ngắt nhịp thơ & nhịp câu**:
   - Bắt buộc dùng dấu phẩy `,` hoặc `...` để ép giọng đọc AI ngắt đúng nhịp thơ (2/2/3, 4/3, 3/3).
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

- **Thành phần dùng chung cho Văn: chưa có.** (Bản trước của gói này liệt kê `TextDissector`, `SplitPoemVerse`, `AttributeMatrix`, `ConnectingNetwork` nhưng chưa ai dựng.) Dựng ngay trong thư mục video; thứ cần lần hai thì chuyển vào `src/components/van/` và ghi tên vào mục này. Ứng viên đầu tiên: con đò, bến nước, người ra đi, cô gái áo dài nón lá trong `src/videos/demo-van-an-du/`.
- Nhãn gắn vào vật đang chuyển động (thuyền trôi, người đi): neo `AutoLabels` theo **cả** dao động nhỏ của vật (nhấp nhô), và vật cản của vật đó cũng đi theo, để nhãn dính vào vật.
- Dùng lại: `AutoLabels` (nhãn neo), `StagePanel`/`Card` (`src/components/Card.tsx`), `MathText` (mọi chữ hiển thị).
- Hình trung tâm vẽ bằng SVG/khối phẳng, cỡ theo quy tắc 1 và 4 của `dung-video` (sân khấu toàn khung, vật chính ≥ 140px).
- **Màu sắc & Typography**:
  - Nền theo brand như mọi môn (`style.md`): nền sáng, chữ navy. Không dùng nền tối toàn khung.
  - Màu nhấn theo vai trò `role` (`src/components/roles.ts`); vệt highlight là nền màu nhạt dưới chữ (vàng nhạt hoặc xanh ngọc nhạt), chữ vẫn navy để dễ đọc.
  - Font chữ: Plus Jakarta Sans làm chủ đạo; trích dẫn thơ/văn có thể điểm xuyết kiểu Serif trang trọng.
