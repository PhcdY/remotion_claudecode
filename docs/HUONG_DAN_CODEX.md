# Hướng dẫn Dùng Codex (Dành cho Cộng tác viên)

> **Codex** (của OpenAI) là trợ lý AI bạn trò chuyện cùng để làm video: lên kịch bản, dựng hình, tạo giọng đọc và render.
> Codex tự đọc quy chuẩn dự án trong `AGENTS.md` và các skill trong `.agents/skills/`, nên bạn chỉ cần nói bằng tiếng Việt tự nhiên và duyệt từng bước.
>
> Tài liệu chính thức (cập nhật nhất): <https://developers.openai.com/codex>

---

## 1. Chọn cách dùng Codex

Codex có nhiều "vỏ" dùng chung một tài khoản; chọn một trong hai cách sau:

| Cách dùng | Hợp với ai | Ghi chú |
| :--- | :--- | :--- |
| **Extension Codex trong VS Code** (Khuyên dùng) | Người mới, muốn vừa chat vừa xem cây thư mục, xem file AI sửa | Cài VS Code trước, rồi cài extension **Codex** của OpenAI |
| **Codex CLI** (chạy trong Terminal) | Người quen dùng Terminal | Gõ `codex` trong thư mục dự án là bắt đầu |

Cả hai đều cần đăng nhập bằng **tài khoản ChatGPT** (gói có Codex) hoặc API key OpenAI.

---

## 2. Cài đặt (Chỉ làm 1 lần)

> Cần cài trước Node.js, Git, Python theo mục 1.1 của [Hướng dẫn cho cộng tác viên](HUONG_DAN_CHO_USER.md).

### 2.1. Extension trong VS Code
1. Cài [VS Code](https://code.visualstudio.com/).
2. Mở VS Code → thanh bên trái chọn **Extensions** (`Ctrl + Shift + X`) → tìm **Codex** (nhà phát hành OpenAI) → **Install**.
3. Bấm biểu tượng Codex ở thanh bên → **Sign in** → đăng nhập tài khoản ChatGPT.

### 2.2. Codex CLI
```bash
npm install -g @openai/codex
codex --version
```
Lần đầu chạy `codex`, chọn đăng nhập bằng ChatGPT và làm theo trình duyệt.

> [!NOTE]
> Trên Windows, nếu cài hoặc chạy Codex gặp lỗi, làm theo mục Windows trong tài liệu chính thức ở trên.

---

## 3. Mở dự án

- **VS Code**: `File` → `Open Folder...` → chọn thư mục `Video AI` đã clone → mở khung Codex ở thanh bên.
- **CLI**:
  ```bash
  cd "D:\Projects\Video AI"
  codex
  ```

Codex phải được mở **đúng ở thư mục gốc dự án** (nơi có `AGENTS.md`). Mở sai thư mục thì Codex không thấy quy chuẩn và skill.

Những gì Codex tự nạp khi mở dự án:

| Thành phần | Vị trí | Vai trò |
| :--- | :--- | :--- |
| Quy chuẩn chung | `AGENTS.md` | Quy trình, schema `script.json`, quy tắc dựng video |
| Skill | `.agents/skills/` | `viet-kich-ban`, `dung-video`, `tao-audio`, `hoc-sinh-ao`, `remotion-best-practices` |
| Gói môn | `.agents/mon/<môn>.md` | Luật riêng từng môn (skill tự đọc khi cần) |
| Sổ tay kinh nghiệm | `.agents/lessons.md` | Bài học rút ra từ các video trước |
| Agent con | `.codex/agents/hoc-sinh-ao.toml` | "Học sinh ảo" soát kịch bản/storyboard |

---

## 4. Gọi skill bằng `$ten-skill`

Mỗi trạm của quy trình có một skill. Gõ `$` trong ô chat để hiện danh sách, hoặc gõ thẳng:

| Gõ | Khi nào |
| :--- | :--- |
| `$viet-kich-ban` | Bước 1: lên ý, dàn ý, viết `script.json` |
| `$dung-video <slug>` | Dựng bản nháp + storyboard, rồi hoàn thiện video sau khi có audio |
| `$tao-audio <slug>` | Tạo giọng đọc Vivibe (tốn credit) |

Ví dụ:
> `$viet-kich-ban` Bài "Đạo hàm và tiếp tuyến", Toán 12. Hiện tượng: xe đang chạy, đồng hồ tốc độ chỉ gì ở đúng một thời điểm?

Bạn cũng có thể không gõ `$`: nói tự nhiên ("viết kịch bản bài…", "dựng nháp video…") thì Codex thường tự chọn đúng skill. Gõ `$` chỉ để chắc chắn.

---

## 5. Agent con "Học sinh ảo" (`hoc-sinh-ao`)

- Là một **agent con** định nghĩa ở `.codex/agents/hoc-sinh-ao.toml`: đóng vai học sinh THPT trung bình xem video lần đầu, chỉ ra chỗ nhảy bước, chỗ khó hiểu. Nó **chỉ đọc**, không sửa file.
- Skill `viet-kich-ban` (soát kịch bản) và `dung-video` (soát storyboard) **tự giao việc** cho agent này; bạn không cần làm gì thêm.
- Muốn tự gọi thêm một lượt, nhắn rõ là giao cho agent con và nói **tiền đề** (học sinh đã học gì):
  > Giao cho agent con `hoc-sinh-ao` đọc `src/videos/<slug>/script.json`. Tiền đề: đã học giới hạn, chưa học đạo hàm.
- Skill `hoc-sinh-ao` không tự kích hoạt ngầm, để Codex giao việc cho agent con riêng thay vì tự đóng vai ngay trong cuộc trò chuyện chính (agent con không thấy dàn ý nên phản biện khách quan hơn).

---

## 6. Lệnh `/` hay dùng

Gõ `/` trong ô chat để xem danh sách lệnh của bản Codex bạn đang dùng. Hay dùng nhất:

| Lệnh | Tác dụng |
| :--- | :--- |
| `/compact` | Thu gọn cuộc trò chuyện. **Gõ sau khi xong mỗi trạm** (chốt kịch bản, duyệt storyboard, có audio) để AI nhanh và đỡ tốn lượt dùng |
| `/new` | Bắt đầu cuộc trò chuyện mới (dùng khi làm video mới) |
| `/diff` | Xem những gì Codex vừa sửa (CLI) |

---

## 7. Quyền chạy lệnh

Codex sửa file và chạy lệnh trên máy bạn, nên có chế độ phê duyệt:
- Chế độ mặc định: Codex tự đọc/sửa file và chạy lệnh **trong thư mục dự án**; việc cần mạng hoặc ra ngoài thư mục thì hỏi bạn trước.
- Bước tạo audio (`scripts/vivibe_tts.py`) gọi API Vivibe qua mạng → Codex sẽ hỏi. Đọc lệnh rồi đồng ý.
- Đổi chế độ bằng lệnh `/` tương ứng (xem danh sách khi gõ `/`) hoặc trong cài đặt của extension. Không nên chọn chế độ toàn quyền nếu bạn chưa hiểu rõ.

---

## 8. Xem video và storyboard

- **Remotion Studio (xem chuyển động)**: mở một Terminal riêng (trong VS Code: `Ctrl + J`) tại thư mục dự án, chạy:
  ```bash
  npm run dev
  ```
  rồi mở <http://localhost:3000>. Để Terminal đó chạy suốt lúc làm; Codex sửa code thì Studio tự cập nhật.
- **Storyboard (xem nhanh mọi cảnh)**: nhờ Codex chạy storyboard (skill `dung-video` tự làm ở bước nháp). Kết quả ở `out/_lam-viec/<id>/storyboard/index.html`, mở bằng trình duyệt.

---

## 9. Đính kèm file và ảnh

- Gõ `@` rồi tên file để chỉ đúng file cho Codex (ví dụ `@script.json`, `@references/toan/...`).
- Ảnh chụp màn hình lỗi hiển thị hoặc hình trong SGK: dán (`Ctrl + V`) hoặc kéo thả vào ô chat.

---

## 10. Mẹo làm việc

1. **Một video = một cuộc trò chuyện mới** (`/new` hoặc nút tạo cuộc trò chuyện mới). AI không lẫn số liệu của bài trước.
2. **`/compact` sau mỗi trạm**: sau khi chốt kịch bản, sau khi duyệt storyboard, sau khi có audio.
3. **Nói bằng hình, không cần nói bằng code**: thay vì "sửa beats.tsx dòng 45", hãy nói
   > Ở cảnh 2, đẩy nhãn "cực đại" sang phải một chút và đổi sang màu chàm.
4. **Góp ý được ghi lại**: góp ý của bạn được ghi vào `src/videos/<slug>/FEEDBACK.md`; bài học chung vào `.agents/lessons.md` để các video sau không lặp lỗi.
