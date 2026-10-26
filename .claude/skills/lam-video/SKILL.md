---
name: lam-video
description: Làm trọn một video giải thích bản chất trong MỘT lượt, tự quyết mọi bước (kịch bản → storyboard → audio giọng nữ c Nhi → dựng → render), không dừng hỏi người dùng; các bước nặng chạy trong agent riêng đúng model. Chỉ dùng khi người dùng gõ /lam-video <chủ đề + ý bản chất> hoặc nói rõ muốn làm trọn tự động.
argument-hint: <chủ đề + ý bản chất> [lớp/bài nếu có]
disable-model-invocation: true
---

# Làm trọn video, tự quyết (chế độ tự động)

Đề bài: `$ARGUMENTS`

Người dùng **giao toàn quyền tới lúc ra video** để thử chất lượng pipeline khi chạy một mạch. Cả quy trình nằm trong **lượt này**: không kết thúc lượt, không hỏi, không chờ duyệt (trừ điểm dừng cứng cuối file).

## Model: chỉ agent riêng mới đổi được model

Đo 26/10/2026: ghi `model:` trong skill **không** đổi model của phiên chính. Vì vậy phiên chính (Opus) chỉ viết kịch bản và điều phối; việc nặng giao cho skill chạy trong agent riêng (`context: fork`), mỗi lần gọi là một agent mới, đọc lại từ file, không mang theo hội thoại.

| # | Ai làm | Model | Làm gì |
|---|---|---|---|
| 1 | phiên chính theo skill `viet-kich-ban` | Opus | Tìm ý → dàn ý (ghi vào AUTO-LOG) → `script.json` → gọt, `check_script` 0 lỗi; gọi agent `hoc-sinh-ao` (Sonnet), sửa |
| 2 | skill `dung-video` với `<slug> nhap` | Sonnet (agent `dung-hinh`) | Dựng mọi beat bản nháp, kiểm tra, storyboard + `--review` |
| 3 | phiên chính gọi agent `hoc-sinh-ao` | Sonnet | Soát thư mục `review/` (mỗi ảnh một lần) |
| 4 | skill `dung-video` với `<slug> sua: <danh sách>` | Sonnet | Sửa chỗ *nặng*/*vừa* về hình, kiểm lại |
| 5 | skill `tao-audio` với `<slug> nữ - c Nhi ca-bai` | Sonnet low (agent `tao-giong`) | Tạo cả bài, `align_words` |
| 6 | skill `dung-video` với `<slug> hoan-thien` | Sonnet | Bỏ `draft`, kiểm tra thời gian thật, ảnh từng dòng, soát toán, thời lượng |
| 7 | skill `render` với `<slug> bat-dau`, rồi phiên chính chạy nền lệnh chờ agent trả về, xong gọi `render` với `<slug> xong` | Haiku (agent `render-video`) | Render, phụ đề |

Giao việc cho agent bằng tham số ngắn + đường dẫn file (`script.json`, `AUTO-LOG.md`); agent không thấy hội thoại. Đọc báo cáo của agent, kiểm kết quả (file, log) trước khi sang bước sau. Lỗi cấu trúc kịch bản agent báo → phiên chính sửa `script.json` (tối đa **một** vòng quay lại cho cả video) rồi gọi lại bước dựng.

## Thay cho mọi chỗ "hỏi / chờ duyệt / báo người dùng" trong các skill

| Chỗ trong skill | Chế độ tự động |
|---|---|
| Thiếu ý bản chất → hỏi chọn góc | Tự chọn góc học sinh hay hiểu sai nhất, ghi lý do |
| Dàn ý: chờ duyệt | Viết dàn ý ra `src/videos/<slug>/AUTO-LOG.md`, tự phản biện một vòng (hook có thật, có gây tò mò, mỗi bước "vì sao" có nhảy không) rồi đi tiếp |
| Hiện tượng không tìm được nguồn → báo | Chọn phương án dự phòng có nguồn |
| `script.json` / thư mục video đã tồn tại → hỏi ghi đè | **Không ghi đè**: slug mới thêm hậu tố `-auto` (`-auto2`…) |
| `lop` / `chuong` / `bai` | Tự điền theo SGK Kết nối tri thức (hoặc theo đề bài) |
| Người dùng chốt kịch bản / duyệt storyboard | `check_script` 0 lỗi, học sinh ảo không còn chỗ *nặng*, kiểm tra máy sạch; tự sửa chỗ *vừa* |
| Chọn giọng | Giọng **nữ - c Nhi**: `tao-audio` chế độ `liet-ke`, chọn giọng có tên chứa "Nhi". Không có hoặc nhiều hơn một → điểm dừng cứng |
| Báo số ký tự, chờ đồng ý credit | `tao-audio` chế độ `uoc-tinh`, ghi số ký tự vào log rồi tạo luôn, **trừ** khi > 8000 ký tự → điểm dừng cứng |
| Nghe thử b01 + dòng ký hiệu | Không có tai người: tạo cả bài. Liệt kê các dòng lẽ ra phải nghe thử vào log và báo cáo cuối, gửi kèm các file đó |
| Lỗi một dòng audio | `tao-audio` chế độ `dong <id>` **đúng một lần**; vẫn lỗi → ghi log, đi tiếp nếu vẫn dựng được (thiếu dòng → điểm dừng cứng) |
| Thời lượng ngoài 2:30–4:00 | Ở B1: cắt/thêm ý phụ. Sau B2 còn lệch → ghi log, vẫn render |
| Góp ý, `FEEDBACK.md`, sửa skill, `lessons.md` | Không làm. Chỉ ghi vào log những luật trong skill thấy làm video kém đi |
| Gửi storyboard cho người dùng | Không gửi giữa chừng; đường dẫn storyboard để trong báo cáo cuối |

Mọi quyết định thay người dùng ghi **một dòng** vào `src/videos/<slug>/AUTO-LOG.md` (bước · quyết định · lý do).

## Không đổi (an toàn và chất lượng)

- Agent dựng không sửa `text`/`speak`; muốn sửa thì phiên chính sửa `script.json` theo skill `viet-kich-ban`.
- Soát toán trên hình vẫn bắt buộc.
- Không commit, không push, không xoá video/audio của bài khác. Không đụng `.env`.
- Không dùng `scripts/tts.py` (Edge TTS) thay giọng clone.

## Điểm dừng cứng

Không tìm thấy đúng một giọng "Nhi" · ước tính > 8000 ký tự · thiếu `VIVIBE_API_KEY` hoặc hết credit · thiếu file audio sau khi chạy lại · lệnh cứ bị chặn. Khi dừng: ghi log, báo người dùng đang ở bước nào và lệnh nào để chạy tiếp.

## Báo cáo cuối (sau khi render xong)

1. Đường dẫn video + phụ đề, thời lượng.
2. Ý bản chất, hiện tượng mở đầu, số beat.
3. Quyết định quan trọng đã tự đưa ra (tóm từ `AUTO-LOG.md`, ≤ 8 dòng).
4. Học sinh ảo đã bắt gì, đã sửa gì; còn gì chưa sửa.
5. **Dòng audio cần nghe lại** (đã gửi file) và chỗ nghi ngờ khác.
6. Đường dẫn storyboard.
