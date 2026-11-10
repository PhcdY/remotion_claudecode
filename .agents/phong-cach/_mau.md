# Phong cách — <tên>

> Một câu: phong cách này trông thế nào. Mẫu tham chiếu: 1–2 video/kênh, ghi rõ học gì.

Gói phong cách là luật **nhìn** (chất liệu, màu, chữ, chuyển động, máy). Luật **nội dung** ở gói môn, luật chung ở `.agents/chuan-thi-giac.md` (chuẩn chung thắng khi nói khác về bố cục, cỡ chữ, thẻ, ảnh).
Tạo phong cách mới cùng người dùng: chép file này, điền đủ 10 mục, dựng một cảnh thử ~15 s trong `src/videos/lab-thanh-phan/` hoặc một demo riêng, người dùng duyệt rồi mới dùng cho video thật.

## 1. Bản chất, và không phải là gì
- Một đoạn: cái gì làm nên phong cách này.
- **Không phải**: 2–3 phong cách gần giống mà dễ trượt sang (vd. "không phải slide thuyết trình", "không phải infographic tĩnh").

## 2. Chất liệu
Hình làm bằng gì (khối vector có sáng tối, nét phấn, mực loang, giấy…), có bóng không, có hạt không, chiều sâu thế nào.

## 3. Logic màu
Bảng màu (mã hex), màu nào mang nghĩa gì; quan hệ với `role` (`src/components/roles.ts`) và brand 9Study (`style.md`).

## 4. Chữ
Font (chỉ font có giấy phép mở, nạp qua `@remotion/google-fonts`), cỡ theo thang của chuẩn chung, chữ vào khung thế nào.

## 5. Chuyển động
Đường cong (`EASE.out`, có nảy hay không), tốc độ, chuyển động phụ (trôi, thở), thứ gì không bao giờ làm.

## 6. Ngữ pháp máy
Bảng các cú máy hợp phong cách (tên · dùng khi nào). Một "vốn từ", không phải một lộ trình cố định.

## 7. Khoảnh khắc riêng (gợi ý cho "à ra thế")
Danh sách 4–8 khoảnh khắc chỉ phong cách này làm được, mỗi cái kèm "hợp với nội dung kiểu…".

## 8. Lỗi hay gặp của phong cách
Cái dễ hỏng → cách tránh.

## 9. Đồ nghề
Component dùng chung (`src/components/…`) và cách gọi; thiếu gì thì ghi để bổ sung.

## 10. Biên độ biến tấu
Những gì nên đổi giữa các video (bảng màu cảnh, hướng sáng, đường máy, hình mở…) để video sau không lặp video trước (chuẩn chung › 8, phép thử 4/6).
