# Hướng dẫn Sử dụng Google Antigravity IDE (Dành cho Cộng tác viên)

> **Antigravity IDE** là không gian làm việc chính (Môi trường phát triển tích hợp AI-first) của toàn bộ hệ sinh thái **Video AI**.
> Bạn sẽ dành hơn 95% thời gian làm việc trực tiếp trên giao diện này để trò chuyện với Trợ lý AI, duyệt kịch bản, xem trước video và kết xuất sản phẩm mà hầu như không cần thao tác với các công cụ bên ngoài.

---

## 1. Tổng quan Giao diện Antigravity (UI Layout)

Giao diện của Antigravity được thiết kế trực quan dựa trên nền tảng VS Code nhưng được tối ưu hóa toàn diện cho việc phối hợp làm việc cặp đôi giữa Người và AI (AI Pair-Programming):

```text
┌─────────────────┬───────────────────────────────┬─────────────────────────────┐
│  Thanh Công Cụ  │      Màn Hình Soạn Thảo       │      Khung Chat AI Panel    │
│  (Activity Bar) │       (Editor Canvas)         │       (Ctrl + L / Cmd + L)  │
│                 │                               │                             │
│ 📁 Explorer     │ - Xem/Sửa kịch bản script.json│ 💬 Cuộc trò chuyện chính    │
│ 🔍 Search       │ - Xem code đồ hoạ Remotion    │                             │
│ 🌿 Git Control  │ - So sánh thay đổi (Visual    │ ⚡ Slash commands (/...)    │
│ 💬 Chats History│   Diff Red/Green)             │ 📎 Đính kèm tệp / ảnh (@)   │
│ ⚙️ Settings     │                               │                             │
├─────────────────┴───────────────────────────────┴─────────────────────────────┤
│                       Bảng Điều Khiển Dưới (Terminal / Tasks)                 │
│  >_ Terminal    |  ⚙️ Background Tasks    |  ⚠️ Problems    |  📋 Output      │
└───────────────────────────────────────────────────────────────────────────────┘
```

### 1.1. Khung Chat Trợ lý AI (Cột bên phải — Quan trọng nhất)
- Là nơi bạn ra lệnh, thảo luận ý tưởng, duyệt kịch bản và xem kết quả.
- **Phím tắt mở nhanh**: Nhấn `Ctrl + L` (Windows) hoặc `Cmd + L` (macOS).

### 1.2. Màn hình Soạn thảo (Khu vực ở giữa)
- Hiển thị các file kịch bản `script.json`, tài liệu tham khảo SGK trong `references/`, hoặc các thành phần đồ hoạ chuyển động SVG/React trong `src/videos/<slug>/`.
- Tự động hiển thị màn hình so sánh **Visual Diff (Đỏ / Xanh)** mỗi khi AI sửa đổi code để bạn duyệt.

### 1.3. Thanh bên trái (Activity Bar)
- **Explorer (📁)**: Cây thư mục dự án (xem các bài học trong `src/videos/`, kịch bản, âm thanh).
- **Chat History (💬)**: Danh sách các phiên trò chuyện cũ với AI để bạn có thể xem lại bất kỳ lúc nào.
- **Source Control (🌿)**: Theo dõi các file đã sửa đổi.
- **Settings (⚙️)**: Cài đặt mô hình AI (Model) và quyền thực thi lệnh.

### 1.4. Bảng điều khiển phía dưới (Terminal / Background Tasks)
- **Terminal**: Nơi hiển thị các lệnh hệ thống khi chạy.
- **Background Tasks**: Nơi quản lý các tiến trình chạy ngầm (ví dụ: máy chủ xem trước Remotion Studio hoặc quá trình render video MP4).

---

## 2. Các Thao tác Cốt lõi Hàng ngày

### 2.1. Bắt đầu một Bài làm Video Mới (New Conversation)
1. Trên đỉnh của Khung Chat AI, nhấn vào biểu tượng **`+`** (hoặc nút **New Chat**).
2. Bạn sẽ có một phiên làm việc hoàn toàn mới, sạch sẽ bộ nhớ để bắt đầu một bài học mới từ Bước 1.

### 2.2. Chọn Model AI Phù hợp
Ở góc dưới hoặc trên khung chat, bạn có thể chọn Model AI hoạt động:
- **Gemini Flash (Mặc định)**: Tốc độ phản hồi cực nhanh, xử lý mượt mà cho việc lên kịch bản, chỉnh sửa nhãn chữ, đổi màu và giải đáp thắc mắc.
- **Gemini Pro (Khi cần suy luận sâu)**: Dành cho các bài toán hình học Oxyz phức tạp, tính toán toạ độ không gian, chứng minh công thức khó hoặc phản biện sư phạm chuyên sâu.

### 2.3. Đính kèm Tài nguyên vào Khung Chat bằng `@` (Mentions)
Thay vì phải sao chép văn bản thủ công, bạn chỉ cần gõ ký tự `@` trong khung chat:
- Gõ `@script.json`: Gắn trực tiếp file kịch bản của bài đang làm vào câu lệnh.
- Gõ `@references/toan/...`: Dẫn chứng nhanh tài liệu bài học SGK tương ứng.
- **Kéo thả ảnh chụp màn hình**: Bạn có thể chụp ảnh màn hình lỗi hiển thị hoặc sơ đồ bài tập trong sách và **dán trực tiếp (`Ctrl + V`) hoặc kéo thả** vào khung chat để AI nhìn thấy và sửa ngay.

### 2.4. Sử dụng các Lệnh Tắt Thông minh (Slash Commands)
Chỉ cần gõ dấu gạch chéo `/` vào ô nhập tin nhắn, danh sách lệnh tắt tiện lợi sẽ hiện ra:
- **`/viet-kich-ban`**: Kích hoạt kỹ năng viết kịch bản bản chất chuẩn SGK.
- **`/dung-video`**: Kích hoạt quy trình dựng hình nháp và storyboard.
- **`/tao-audio`**: Kích hoạt quy trình tạo giọng đọc Vivibe TTS chuẩn 3 personas.
- **`/compact`**: Thu gọn bộ nhớ ngữ cảnh của AI sau khi chốt xong mỗi bước, giúp cuộc trò chuyện không bị đầy token hay chậm chạp.
- **`/plan`**: Yêu cầu AI lập kế hoạch chi tiết trước khi triển khai các bài phức tạp.

---

## 3. Cách Tương tác với AI Khi Dựng Video (Không Cần Gõ Code)

Điểm mạnh nhất của Antigravity là bạn **không cần mở cửa sổ lệnh bên ngoài**. Trợ lý AI có thể tự động thực thi các công cụ thay cho bạn:

### 3.1. Nhờ AI mở Trình xem trước Video (Preview Remotion Studio)
Thay vì phải mở Terminal gõ `npm run dev`:
- Bạn chỉ cần nhắn vào khung chat:  
  > *"Mở preview Remotion Studio giúp tôi nhé."*
- **Điều gì sẽ diễn ra?**
  1. AI tự động khởi động máy chủ Remotion dưới dạng một **Background Task** (Tiến trình chạy nền).
  2. AI gửi link `http://localhost:3000` ngay trong chat.
  3. Bạn nhấn vào link, trình duyệt sẽ mở Remotion Studio để bạn bấm nút Play xem video chuyển động thực tế.
  4. Bạn vẫn có thể tiếp tục chat với AI mà không làm gián đoạn máy chủ xem trước!

### 3.2. Nhờ AI Chụp ảnh Storyboard Toàn cảnh
Nếu bạn muốn lướt nhanh toàn bộ các phân cảnh từ đầu đến cuối mà không cần xem chuyển động:
- Nhắn vào khung chat:  
  > *"Chụp ảnh storyboard toàn bộ các cảnh gửi cho tôi xem."*
- AI sẽ tự động kích hoạt script kết xuất ảnh ghép tại `out/_lam-viec/<slug>/storyboard.png` và hiển thị trực tiếp để bạn duyệt.

### 3.3. Duyệt Sửa Đổi (Visual Diff Review)
Khi bạn yêu cầu AI sửa toạ độ vector, đổi màu sắc hay sửa chữ nhãn:
- AI sẽ tạo ra các khối sửa đổi hiển thị màu:
  - **Màu đỏ**: Dòng code/kịch bản cũ bị xoá.
  - **Màu xanh**: Dòng code/kịch bản mới được thêm vào.
- Bạn có thể xem ngay sự thay đổi, kiểm tra tính đúng đắn trước khi đồng ý lưu lại.

---

## 4. Quản lý Quyền Thực thi & Phê duyệt Lệnh (Permissions)

Vì Antigravity có khả năng đọc/ghi file và chạy các script tự động trên máy bạn, hệ thống được trang bị cơ chế bảo mật rõ ràng:

1. **Hộp thoại Chấp thuận Lệnh (Command Approval)**:
   - Khi AI cần chạy các script kiểm tra (như `py scripts/check_script.py` hay lệnh tạo audio Vivibe TTS), Antigravity sẽ hiển thị thông báo yêu cầu bạn xác nhận (`Allow` / `Proceed`).
   - Bạn chỉ cần bấm nút đồng ý để AI tiếp tục công việc.
2. **Cài đặt Tự động Phê duyệt (Auto-Proceed)**:
   - Nếu bạn muốn làm việc nhanh mà không phải bấm nút duyệt từng lệnh an toàn:
   - Vào `Settings` (⚙️) $\to$ Tìm mục **Tool Execution Policy** $\to$ Chọn `always-proceed` (hoặc `proceed-in-sandbox`).

---

## 5. Bảng Phím tắt "Thần thánh" Thường Dùng Nhất

| Phím tắt (Windows/Linux) | Phím tắt (macOS) | Tính năng |
| :--- | :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>L</kbd> | <kbd>Cmd</kbd> + <kbd>L</kbd> | **Bật / Tắt Khung Chat AI** (Dùng liên tục hàng ngày) |
| <kbd>Ctrl</kbd> + <kbd>I</kbd> | <kbd>Cmd</kbd> + <kbd>I</kbd> | **Inline Edit**: Bôi đen một đoạn text/code và yêu cầu AI sửa tại chỗ |
| <kbd>Ctrl</kbd> + <kbd>J</kbd> | <kbd>Cmd</kbd> + <kbd>J</kbd> | **Bật / Tắt Bảng Điều Khiển Dưới** (Terminal / Tasks) |
| <kbd>Ctrl</kbd> + <kbd>P</kbd> | <kbd>Cmd</kbd> + <kbd>P</kbd> | **Mở file nhanh** (Tìm tên file kịch bản, component trong nháy mắt) |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> | **Tìm kiếm toàn bộ dự án** (Tra cứu thuật ngữ, bài học cũ) |
| <kbd>Tab</kbd> | <kbd>Tab</kbd> | **Chấp nhận gợi ý hoàn thành** (Autocomplete / Supercomplete) |
| <kbd>Esc</kbd> | <kbd>Esc</kbd> | Huỷ bỏ gợi ý / Đóng cửa sổ pop-up |

---

## 6. Mẹo Vàng Làm Việc Đạt Hiệu Quả Tối Đa với Antigravity

1. **Một Video = Một Phiên Chat Mới**:
   - Khi bắt đầu một bài học mới, hãy luôn bấm `+` để mở phiên chat mới. Điều này giúp AI tập trung 100% ngữ cảnh vào bài học đó mà không bị lẫn toạ độ hay công thức của bài học trước.
2. **Luôn sử dụng `/compact` sau mỗi Bước**:
   - Sau khi chốt Bước 1 (Kịch bản xong), gõ `/compact`.
   - Sau khi duyệt Bước 2 (Duyệt hình storyboard xong), gõ `/compact`.
   - Điều này giúp dọn dẹp các đoạn hội thoại thử nghiệm nháp, giữ ngữ cảnh ngắn gọn, giúp AI chạy siêu tốc và tiết kiệm chi phí token.
3. **Mô tả bằng Ngôn ngữ Tự nhiên & Trực giác**:
   - Bạn không cần nói ngôn ngữ lập trình. Thay vì nói *"hãy sửa file beats.tsx dòng 45 tăng giá trị x"*, bạn chỉ cần nói:  
     > *"Ở cảnh 2, đẩy chữ cực đại sang bên phải khoảng 3cm và đổi màu thành xanh chàm giúp tôi."*  
   - AI trong Antigravity đã được huấn luyện đầy đủ hệ thống quy chuẩn của dự án để tự tìm file và sửa chính xác toạ độ cho bạn!
