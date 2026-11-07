# Bài 2. Giá trị lớn nhất và giá trị nhỏ nhất của hàm số
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 1) | **Chương I**: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Giá trị lớn nhất (GTLN), giá trị nhỏ nhất (GTNN), tập xác định $D$, đoạn $[a; b]$, bài toán tối ưu.
* **Ký hiệu**:
  * $\max_{x \in D} f(x)$ hoặc $\max_D f(x)$
  * $\min_{x \in D} f(x)$ hoặc $\min_D f(x)$

---

## 2. Khái niệm cốt lõi & Phương pháp tính

### A. Định nghĩa chuẩn
* Số $M$ là GTLN của $y = f(x)$ trên tập $D$ nếu:
  1. $f(x) \leq M$ với mọi $x \in D$.
  2. Tồn tại ít nhất một điểm $x_0 \in D$ sao cho $f(x_0) = M$.
* Số $m$ là GTNN của $y = f(x)$ trên tập $D$ nếu:
  1. $f(x) \geq m$ với mọi $x \in D$.
  2. Tồn tại ít nhất một điểm $x_0 \in D$ sao cho $f(x_0) = m$.
* *Lưu ý*: Nếu thiếu điều kiện "dấu bằng xảy ra" (tồn tại $x_0$) thì $M$ và $m$ chỉ là cận trên/cận dưới chứ không phải GTLN/GTNN.

### B. Phương pháp tìm GTLN, GTNN trên một đoạn $[a; b]$ (Không cần lập bảng biến thiên)
Cho hàm số $y = f(x)$ liên tục trên đoạn $[a; b]$ và có đạo hàm trên khoảng $(a; b)$:
1. Tìm các điểm $x_1, x_2, \dots, x_n \in (a; b)$ mà tại đó $f'(x) = 0$ hoặc $f'(x)$ không tồn tại.
2. Tính các giá trị: $f(a), f(b), f(x_1), \dots, f(x_n)$.
3. So sánh: Số lớn nhất trong các số trên là $\max_{[a; b]} f(x)$, số nhỏ nhất là $\min_{[a; b]} f(x)$.

### C. Tìm GTLN, GTNN trên khoảng $(a; b)$ hoặc nửa khoảng
* Lập bảng biến thiên của hàm số trên miền đang xét $\to$ quan sát xu hướng của đồ thị để kết luận $\max, \min$ (chú ý xét giới hạn ở các đầu mút vô cực hoặc điểm gián đoạn).

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống mở đầu (Bài toán cắt góc tấm bìa)**:
  * Từ tấm bìa carton hình vuông cạnh $60\text{ cm}$, cắt bỏ 4 hình vuông nhỏ bằng nhau cạnh $x$ ở 4 góc rồi gập lên thành chiếc hộp không nắp dạng hình hộp chữ nhật.
  * Đáy là hình vuông cạnh $60 - 2x$, chiều cao hộp là $x$ ($0 < x < 30$).
  * Thể tích chiếc hộp: $V(x) = (60 - 2x)^2 \cdot x = 4x^3 - 240x^2 + 3600x\text{ (cm}^3\text{)}$.
  * Đạo hàm: $V'(x) = 12x^2 - 480x + 3600 = 0 \Leftrightarrow x = 10$ hoặc $x = 30$ (loại).
  * Kết luận: Cắt góc $10\text{ cm}$ thì thể tích hộp đạt cực đại $16\,000\text{ cm}^3$ (tương đương $16\text{ lít}$).
* **Ứng dụng khác**:
  * Tốc độ lây lan của dịch bệnh $N(t) = -t^3 + 12t^2$.
  * Tối ưu hóa chi phí sản xuất bình hình trụ dung tích $1\text{ lít}$ với lượng vật liệu ít nhất.

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **Phân biệt Cực đại/Cực tiểu và GTLN/GTNN**:
   * Cực trị là tính chất cục bộ (so với các điểm lân cận).
   * GTLN/GTNN là tính chất toàn cục trên toàn bộ tập xác định đang xét.
   * GTLN trên một đoạn có thể rơi vào đầu mút biên ($a$ hoặc $b$), trong khi điểm cực trị không bao giờ nằm ở đầu mút của đoạn.
2. **Quên kiểm tra điều kiện tồn tại $x_0$**: Ví dụ hàm $y = \frac{1}{x}$ trên $(0; +\infty)$ luôn $> 0$ nhưng không có GTNN vì không có $x$ nào để $y = 0$.
