# Gói môn — mẫu cho môn mới

Lần đầu làm video một môn chưa có gói (`.agents/mon/<mon>.md`): chép file này thành gói mới, điền các mục dưới đây
**cùng người dùng** (hỏi ở bước dàn ý những điểm chưa rõ), rồi bổ sung sau mỗi video. Không tự đặt luật khi chưa có căn cứ;
chỗ chưa chắc ghi "chưa xác nhận".

## Đầu file (chép nguyên)
Đọc kèm skill `viet-kich-ban` (B1), `tao-audio` (B2), `dung-video` (B3). Luật ở đây **thêm vào** luật chung cho video <Môn> (`"subject": "<mon>"`). Chỉ dòng nào trong mục **"Thay luật chung"** mới thay luật chung (skill `viet-kich-ban` › mục 0 › Ba tầng luật).

## Thay luật chung
Chỉ thay được luật **tầng 2** (mặc định); sáu phép thử P0–P5 (tầng 1) không thay được, chỉ siết thêm. Mỗi dòng ghi ai chốt, ngày.

| Luật chung | Gói thay thành | Áp cho (mọi video / bài học / hiện tượng) | Lý do · ai chốt · ngày |
|---|---|---|---|
| (vd.) `viet-kich-ban` › Độ dài: 2:30–4:00 | tới 5:00 | bài học | … |

Không thay gì → ghi "Không có". Ngưỡng số (số cảnh, giây, ký tự) ghi thêm vào `thayLuat` của file máy đọc.

## File máy đọc `.agents/mon/<mon>.json` (khi môn có thuật ngữ cần chốt)
`check_script.py` đọc file này cho phép thử P4 "một khái niệm một tên". Mẫu đầy đủ: `.agents/mon/hoa.json`.
```json
{
  "thuatNgu": [
    {"khongDung": ["natri"], "dung": "sodium", "muc": "loi"},
    {"khongDung": ["sắt"], "dung": "iron", "muc": "canh-bao", "ngoaiLe": ["đường sắt"]},
    {"khongDung": ["chu kỳ"], "dung": "chu kì", "muc": "canh-bao", "truong": ["text", "keyword"]}
  ],
  "thayLuat": {"canhToiDa": 4, "bai-hoc": {"tongGiay": [150, 300]}}
}
```
- `khongDung`: các cách viết sai (chữ thường; "hoá"/"hóa", "thuỷ"/"thủy" tự khớp cả hai). `ngoaiLe`: cụm chứa từ đó mà vẫn đúng. `muc`: `loi` / `canh-bao`. `truong` (tuỳ chọn): chỉ kiểm trong `title`, `keyword`, `text`, `caption`, `speak` nào. `thongBao` (tuỳ chọn): câu báo, dùng `{noi}` `{truong}` `{tu}` `{dung}`. `regex` thay cho `khongDung`: chỉ người bảo trì dùng.
- `thayLuat` chỉ nhận: `canhToiDa`, `hienTuongToiDaGiay`, `giaiDapGiay`, `beatToiDaGiay`, `tongGiay`, `kyTu` (đặt chung, hoặc trong `bai-hoc` / `hien-tuong`).
- Sửa xong chạy `py scripts/check_script.py --goi <mon>`: soát chính gói (cột lời đọc / trên hình / ĐÚNG và khối code) có tự dùng từ mình cấm không.

## Tư duy kể chuyện & Trải nghiệm người xem (B1)
Không gò bó vào một công thức cố định hay một theme lặp đi lặp lại. Tùy vào bản chất bài học, tự do chọn cách tiếp cận hấp dẫn nhất. Mục tiêu tối thượng là **trải nghiệm người xem: dễ hiểu, hay, cuốn hút, tạo được khoảnh khắc "wow / à ra thế"**:
- **Góc vào bài (Hook) linh hoạt**: Có bài hợp với nghịch lý đời thực, có bài hợp với một câu hỏi tò mò, một tình huống bất ngờ, hay một bẫy tư duy quen thuộc.
- **Mạch dẫn tự nhiên**: Đi từ thứ người xem thấy/biết $\to$ gợi sự tò mò $\to$ tháo gỡ từng nút thắt một cách thuyết phục. Không nhảy bước, không nói vòng vo.
- **Nhịp điệu & Mood hình ảnh**: Tự điều chỉnh theo tính chất bài học (có bài sôi nổi trực quan, có bài sâu sắc chiêm nghiệm, có bài phân tích logic sắc sảo).

## Phạm vi kiến thức & Tài liệu tham khảo (B1)

- **Tài liệu tham khảo SGK chuẩn**: Lưu tại `references/<mon>/lop-<lop>/tap-<tap>/`. Thẻ bài học ("bài này phải có gì") theo mẫu `references/_mau-the-bai-hoc.md`. Khi viết kịch bản, AI BẮT BUỘC tra cứu file bài học tương ứng trong thư mục này trước để bám sát thuật ngữ, hoạt động khám phá và kiến thức chuẩn SGK.
- Chương trình, bộ SGK, thuật ngữ chuẩn (vd. SGK 2018 dùng danh pháp IUPAC cho Hóa).
- Kiến thức ngoài chương trình không dùng; công cụ của bài khác chỉ nói kết quả.
- Thứ học sinh nhớ (công thức, định nghĩa, sơ đồ) để neo bản chất vào.

## Mẫu dựng khái niệm (B1 + B3)
- Các loại hình chuẩn của môn và cách dựng không nhảy bước (vd. vectơ: gốc → hướng → độ dài; phản ứng: chất đầu → liên kết đứt → liên kết mới; quá trình sinh học: từng giai đoạn trên một sơ đồ cố định; Sử–Địa: bản đồ, dòng thời gian).
- Mẫu đã được người dùng khen (ghi video + beat).

## Số và đơn vị
- Môn có đại lượng vật lý (Lý, Hóa, Sinh, Địa): đơn vị **bắt buộc** theo luật chung; ghi thêm đơn vị đặc thù của môn và cách đọc.

## Đọc ký hiệu, tên riêng (B2)
- Ký hiệu, công thức, tên chất, tên riêng nước ngoài, thuật ngữ tiếng Anh: cách viết `speak`, đã nghe thử với giọng nào, kết quả.
- Dòng có thứ này → thêm `caption` và đưa vào danh sách nghe thử.

## Dựng hình (B3)
- Component dùng lại, công cụ hiển thị (vd. Hóa: KaTeX cần extension `mhchem` cho `\ce{...}`).

## Gợi ý điểm cần hỏi (chưa phải luật)
- **Lý**: vectơ lực/vận tốc vẽ thế nào; đơn vị và tiền tố; đồ thị có đơn vị ở tên trục.
- **Hóa**: danh pháp đọc tiếng Anh hay tiếng Việt; công thức cấu tạo hay mô hình phân tử; phương trình cân bằng.
- **Sinh**: sơ đồ quá trình cố định, từng bước sáng lên; tỉ lệ kích thước (tế bào, phân tử) có cần thể hiện.
- **Sử–Địa**: mốc thời gian, bản đồ (nguồn bản đồ đúng chủ quyền), số liệu có nguồn và năm.
- **Tiếng Anh**: giọng clone tiếng Việt đọc tiếng Anh có ổn không — nghe thử trước khi viết cả bài.
