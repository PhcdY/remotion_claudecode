# Bài 5. Ứng dụng đạo hàm để giải quyết một số vấn đề liên quan đến thực tiễn
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 1) | **Chương I**: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Tốc độ thay đổi tức thời, bài toán tối ưu hoá, mô hình hoá toán học, hàm chi phí $C(x)$, chi phí biên $C'(x)$, hàm cầu $p(x)$, hàm doanh thu $R(x)$, doanh thu biên $R'(x)$, hàm lợi nhuận $P(x)$, lợi nhuận biên $P'(x)$.
* **Ký hiệu**:
  * Chuyển động: vị trí $s(t)$, vận tốc $v(t) = s'(t)$, gia tốc $a(t) = v'(t) = s''(t)$.
  * Kinh tế: $R(x) = x \cdot p(x)$, $P(x) = R(x) - C(x)$.
  * Hóa học - Sinh học: nồng độ $C(t)$, tốc độ phản ứng $C'(t)$; số lượng quần thể $P(t)$, tốc độ tăng trưởng $P'(t)$.

---

## 2. Các mô hình thực tiễn cốt lõi

### A. Ý nghĩa cơ học: Vận tốc và Gia tốc
* Nếu $s = s(t)$ là phương trình chuyển động của vật trên một đường thẳng:
  * Vận tốc tức thời tại thời điểm $t$: $v(t) = s'(t)$.
  * Gia tốc tức thời tại thời điểm $t$: $a(t) = v'(t) = s''(t)$.
  * *Dấu của vận tốc*: $v(t) > 0$ vật chuyển động theo chiều dương; $v(t) < 0$ vật chuyển động theo chiều âm; $v(t) = 0$ vật dừng lại tức thời hoặc đổi chiều.

### B. Ý nghĩa kinh tế: Khái niệm "Biên" (Marginal)
* **Chi phí biên $C'(x)$**: Xấp xỉ chi phí phát sinh để sản xuất thêm *một đơn vị hàng hóa tiếp theo* (sản phẩm thứ $x + 1$):
  $$C'(x) \approx C(x+1) - C(x)$$
* **Doanh thu $R(x)$ và Doanh thu biên $R'(x)$**:
  * Doanh thu từ việc bán $x$ sản phẩm với đơn giá $p(x)$: $R(x) = x \cdot p(x)$.
  * Doanh thu biên $R'(x) \approx R(x+1) - R(x)$ là doanh thu kiếm thêm từ việc bán thêm 1 sản phẩm.
* **Lợi nhuận tối đa**: Lợi nhuận $P(x) = R(x) - C(x)$. Đạt cực đại khi $P'(x) = 0 \Leftrightarrow R'(x) = C'(x)$ (Doanh thu biên bằng Chi phí biên).

### C. Quy trình giải bài toán tối ưu hoá thực tế (3 bước)
1. **Bước 1**: Xác định đại lượng $Q$ cần tối ưu (làm cho lớn nhất hoặc nhỏ nhất) và chọn biến số thích hợp $x$. Biểu diễn $Q$ thành hàm số theo $x$: $Q = Q(x)$ kèm tập xác định thực tế của $x$.
2. **Bước 2**: Tìm GTLN hoặc GTNN của hàm số $Q(x)$ trên miền xác định bằng công cụ đạo hàm ($Q'(x) = 0$, lập bảng biến thiên).
3. **Bước 3**: Đối chiếu điều kiện thực tế và kết luận câu trả lời.

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống bán vé sân vận động**:
  * Sức chứa sân vận động: 55 000 khán giả. Giá vé ban đầu: 100 nghìn đồng thì có 27 000 người mua.
  * Thăm dò: Cứ giảm 10 nghìn đồng giá vé thì số khán giả tăng thêm 3 000 người.
  * Lập hàm doanh thu theo giá vé $p$: $R(p) = -300p^2 + 57\,000p$.
  * Đạo hàm: $R'(p) = -600p + 57\,000 = 0 \Leftrightarrow p = 95$ nghìn đồng.
  * Kết luận: Đặt giá vé 95 nghìn đồng thì doanh thu đạt kỷ lục: 2,7075 tỷ đồng!
* **Tình huống người chèo thuyền qua sông**: Anh An chèo thuyền từ $A$ trên bờ sông sang điểm $B$ ở bờ bên kia. Vận tốc chèo thuyền $6\text{ km/h}$, vận tốc chạy bộ trên bờ $8\text{ km/h}$. Cần tìm điểm cập bờ để tổng thời gian di chuyển là ngắn nhất.

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **Quên điều kiện thực tế của biến số**: Ví dụ kích thước hình học $x > 0$, số lượng sản phẩm $x \in \mathbb{N}^*$, phần trăm $0 \leq p \leq 100$. Nếu nghiệm của đạo hàm nằm ngoài miền thực tế thì phải loại.
2. **Nhầm lẫn giữa "tốc độ" và "đại lượng"**: Đạo hàm luôn đo tốc độ thay đổi của đại lượng, chứ không phải bản thân đại lượng đó.
