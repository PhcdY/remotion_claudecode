# Thẻ bài học — <Môn> <lớp>, Bài <NN>. <Tên bài đúng như SGK>

> Mẫu chung cho mọi môn. Chép thành `references/<môn>/lop-<lớp>/bai-<NN>-<ten-khong-dau>.md` (được đặt trong `tap-1/`, `tap-2/`).
> `NN` hai chữ số, khớp `"bai": "Bài <số>. …"` trong `script.json`. Thẻ mẫu đã dùng thật: `references/hoa/lop-10/bai-13-phan-ung-oxi-hoa-khu.md`.
> **Trạng thái: chờ duyệt** — agent soạn thẻ ghi dòng này; người dùng/CTV môn duyệt xong thì đổi thành "đã duyệt <ngày>, <ai>".
> Cách dùng: skill `viet-kich-ban` › Thẻ bài học, Bảng nội dung. Agent KHÔNG tự bỏ mục nào; muốn bỏ hay tách video thì nêu ở Bảng nội dung cho người dùng duyệt.

## 1. Kiến thức lõi (video bài học phải có đủ)
| # | Mục | Nội dung chuẩn (theo SGK, ký hiệu chuẩn SGK) |
|---|---|---|
| K1 | <tên ngắn> | <định nghĩa / quy tắc / định luật, viết đúng như SGK> |
| K2 | … | … |

## 2. Bẫy thi (mỗi bẫy cần hình riêng cho thấy cách sai và cách đúng — phép thử P3)
| # | Bẫy | Cách nghĩ sai thường gặp | Đúng |
|---|---|---|---|
| T1 | <tên ngắn> | <học sinh hay nghĩ gì> | <đúng là gì, câu nhớ nếu có> |
| T2 | … | … | … |

(Ngoại lệ hiếm gặp, chỉ nêu khi người dùng duyệt: …)

## 3. Ví dụ đã kiểm số (dùng nguyên, không tự đổi)
| Loại | Ví dụ | Kết quả | Phép kiểm |
|---|---|---|---|
| <trường hợp 1> | … | … | <phép tính kiểm lại, ghi đủ> |

Mỗi trường hợp của một quy tắc nên có ít nhất một ví dụ (để dựng "nhiều ví dụ khác loại đặt cạnh nhau").

## 4. Hiện tượng / hook gợi ý
- <hiện tượng thật có nguồn, hoặc câu đề thi, hoặc cách hiểu sai phổ biến> — hook chỉ là cửa vào (≤ 20 s); tiêu đề video chứa tên bài.

## 5. Gợi ý chia video (nếu không vừa 4:00 — người dùng chọn)
- Video A "<tên>": K1–K… + T…
- Video B "<tên>": K…–K… + T…

## Từ khóa kiểm tra
<!-- check_script.py đọc mục này: mỗi dòng "- <mã> <tên>: cụm1 | cụm2". Kịch bản (speak/text/caption/keyword/title) phải chứa ít nhất một cụm.
     Không phân biệt hoa/thường và "hoá"/"hóa". Mã là K… (kiến thức lõi) hoặc T… (bẫy thi).
     Chọn cụm mà lời giảng tự nhiên sẽ nói ra; ghi vài cách nói (cụm1 | cụm2) để không ép câu đọc gượng.
     Mục đã duyệt bỏ: script.json › "boQuaDaDuyet"; có trong video nhưng nói bằng lời khác: "daPhuDaDuyet". -->
- K1 <tên>: <cụm> | <cách nói khác>
- K2 <tên>: <cụm>
- T1 <tên>: <cụm>
