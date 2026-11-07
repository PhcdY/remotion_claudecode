# Bài 1. Tính đơn điệu và cực trị của hàm số
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 1) | **Chương I**: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Đồng biến (hàm số tăng), nghịch biến (hàm số giảm), đơn điệu, cực trị, điểm cực đại, điểm cực tiểu, giá trị cực đại ($y_{CĐ}$ hoặc $f_{CĐ}$), giá trị cực tiểu ($y_{CT}$ hoặc $f_{CT}$), điểm cực trị của đồ thị hàm số $(x_0; f(x_0))$, bảng biến thiên.
* **Ký hiệu**: $y = f(x)$, $f'(x)$, $x_0$, khoảng $(a; b)$, đoạn $[a; b]$.

---

## 2. Khái niệm cốt lõi & Định lý quan trọng

### A. Tính đơn điệu của hàm số
* **Định nghĩa tổng quát**:
  * Hàm số $y = f(x)$ đồng biến trên $K$ nếu $\forall x_1, x_2 \in K, x_1 < x_2 \Rightarrow f(x_1) < f(x_2)$ (đồ thị đi lên từ trái sang phải).
  * Hàm số $y = f(x)$ nghịch biến trên $K$ nếu $\forall x_1, x_2 \in K, x_1 < x_2 \Rightarrow f(x_1) > f(x_2)$ (đồ thị đi xuống từ trái sang phải).
* **Mối liên hệ với đạo hàm**:
  * Nếu $f'(x) > 0$ với mọi $x \in K \Rightarrow f(x)$ đồng biến trên $K$.
  * Nếu $f'(x) < 0$ với mọi $x \in K \Rightarrow f(x)$ nghịch biến trên $K$.
  * *Mở rộng SGK*: Nếu $f'(x) \geq 0$ (hoặc $\leq 0$) với mọi $x \in K$ và $f'(x) = 0$ chỉ tại một số hữu hạn điểm thì hàm số đồng biến (nghịch biến) trên $K$.

### B. Cực trị của hàm số
* **Định nghĩa**:
  * $x_0$ là điểm cực đại nếu tồn tại khoảng $(x_0 - h; x_0 + h)$ sao cho $f(x) < f(x_0)$ với mọi $x \neq x_0$. Khi đó $f(x_0)$ là giá trị cực đại.
  * $x_0$ là điểm cực tiểu nếu tồn tại khoảng $(x_0 - h; x_0 + h)$ sao cho $f(x) > f(x_0)$ với mọi $x \neq x_0$. Khi đó $f(x_0)$ là giá trị cực tiểu.
* **Quy tắc dấu đạo hàm tìm cực trị**:
  * Nếu $f'(x)$ đổi dấu từ **dương sang âm** khi qua $x_0$ (từ trái sang phải) $\Rightarrow x_0$ là điểm cực đại.
  * Nếu $f'(x)$ đổi dấu từ **âm sang dương** khi qua $x_0$ $\Rightarrow x_0$ là điểm cực tiểu.
  * Nếu $f'(x)$ không đổi dấu khi qua $x_0$ (dù $f'(x_0) = 0$, ví dụ $y = x^3$) $\Rightarrow x_0$ **không phải** điểm cực trị.

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống mở đầu**: Chuyển động của chất điểm trên trục số nằm ngang với phương trình vị trí $s(t) = t^3 - 9t^2 + 15t, t \geq 0$.
  * Vận tốc $v(t) = s'(t) = 3t^2 - 18t + 15$.
  * Khi $v(t) > 0$ ($s'(t) > 0$): chất điểm chuyển động sang phải (hàm vị trí đồng biến).
  * Khi $v(t) < 0$ ($s'(t) < 0$): chất điểm chuyển động sang trái (hàm vị trí nghịch biến).
  * Điểm quay đầu chính là nơi vận tốc triệt tiêu $v(t) = 0$ (cực trị).

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **Phân biệt 3 khái niệm cực trị**:
   * *Điểm cực trị của hàm số*: là giá trị của $x$ ($x_0$).
   * *Giá trị cực trị (hoặc cực trị)*: là giá trị của $y$ ($f(x_0)$).
   * *Điểm cực trị của đồ thị hàm số*: là toạ độ điểm $(x_0; f(x_0))$ trên mặt phẳng toạ độ.
2. **Bẫy $f'(x_0) = 0$ chưa chắc là cực trị**: Cần điều kiện đủ là $f'(x)$ phải **đổi dấu** khi qua $x_0$.
3. **Cực trị mang tính địa phương**: Cực đại không nhất thiết là giá trị lớn nhất của cả hàm số; cực tiểu có thể lớn hơn cực đại ở khoảng khác.
