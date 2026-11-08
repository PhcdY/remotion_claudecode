# Bài 13. Ứng dụng hình học của tích phân
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 2) | **Chương IV**: Nguyên hàm và tích phân

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Diện tích hình phẳng, thể tích vật thể, mặt cắt vuông góc với trục $Ox$, diện tích thiết diện $S(x)$, khối tròn xoay, trục quay $Ox$.
* **Ký hiệu**:
  * Diện tích hình phẳng: $S$.
  * Thể tích: $V$.
  * Thiết diện: $S(x)$ với $x \in [a; b]$.

---

## 2. Khái niệm cốt lõi & Công thức tính toán

### A. Tính diện tích hình phẳng
1. **Hình phẳng giới hạn bởi đồ thị $y = f(x)$, trục hoành $Ox$ và hai đường thẳng $x = a, x = b$**:
   $$S = \int_a^b |f(x)|\,\mathrm{d}x$$
   *Phương pháp phá dấu giá trị tuyệt đối*: Tìm nghiệm của phương trình $f(x) = 0$ trên $(a; b)$, chia nhỏ tích phân thành các khoảng trên đó $f(x)$ không đổi dấu.
2. **Hình phẳng giới hạn bởi hai đồ thị $y = f(x)$, $y = g(x)$ và hai đường thẳng $x = a, x = b$**:
   $$S = \int_a^b |f(x) - g(x)|\,\mathrm{d}x$$
   *Nếu $f(x) \geq g(x)$ trên toàn bộ $[a; b]$*: $S = \int_a^b [f(x) - g(x)]\,\mathrm{d}x$ (đồ thị trên trừ đồ thị dưới).

### B. Tính thể tích vật thể theo thiết diện
* Cho một vật thể nằm giữa hai mặt phẳng vuông góc với trục $Ox$ tại $x = a$ và $x = b$ ($a < b$).
* Cắt vật thể bởi mặt phẳng vuông góc với trục $Ox$ tại điểm có hoành độ $x \in [a; b]$, thiết diện thu được có diện tích là $S(x)$ (giả sử $S(x)$ liên tục trên $[a; b]$).
* Thể tích $V$ của vật thể được tính theo công thức:
  $$V = \int_a^b S(x)\,\mathrm{d}x$$

### C. Tính thể tích khối tròn xoay quanh trục $Ox$
* Cho hình phẳng giới hạn bởi đồ thị hàm số $y = f(x)$ liên tục trên đoạn $[a; b]$, trục hoành $Ox$, và hai đường thẳng $x = a, x = b$.
* Khi quay hình phẳng này xung quanh trục $Ox$, ta được một **khối tròn xoay**.
* Thiết diện cắt bởi mặt phẳng vuông góc với $Ox$ tại $x$ là một hình tròn có bán kính $r = |f(x)|$, do đó diện tích thiết diện là $S(x) = \pi [f(x)]^2$.
* Công thức thể tích khối tròn xoay:
  $$V = \pi \int_a^b [f(x)]^2\,\mathrm{d}x$$

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống nguồn gốc công thức thể tích thời cấp 2**:
  * Ở THCS và lớp 11 ta đã công nhận công thức thể tích khối nón ($V = \frac{1}{3}\pi r^2 h$), khối chóp ($V = \frac{1}{3}Bh$), khối cầu ($V = \frac{4}{3}\pi R^3$).
  * Nhờ tích phân, ta có thể chứng minh tường minh và tổng quát mọi công thức thể tích này mà không cần chia cắt hình phức tạp.
  * *Ví dụ khối cầu*: Quay nửa hình tròn $y = \sqrt{R^2 - x^2}$ ($x \in [-R; R]$) quanh trục $Ox$:
    $$V = \pi \int_{-R}^R (R^2 - x^2)\,\mathrm{d}x = \left. \pi \left(R^2 x - \frac{x^3}{3}\right) \right|_{-R}^R = \frac{4}{3}\pi R^3$$
* **Tình huống đo thể tích thùng rượu vang / lều bạt parabol**:
  * Đường cong thân thùng rượu có dạng parabol, quay quanh trục đối xứng tạo nên thể tích chứa rượu chính xác đến từng mililit.

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **Bẫy quên số $\pi$ trong thể tích khối tròn xoay**: Rất nhiều học sinh viết $V = \int_a^b [f(x)]^2\,\mathrm{d}x$ mà quên nhân hệ số $\pi$ ở ngoài!
2. **Bẫy quên bình phương hàm số $[f(x)]^2$**: Lẫn lộn giữa công thức diện tích ($\int |f|$) và thể tích khối tròn xoay ($\pi \int f^2$).
3. **Bẫy khi có 2 hàm số quay quanh $Ox$**: Khối tròn xoay giới hạn bởi hai đồ thị $y = f(x)$ và $y = g(x)$ có thể tích $V = \pi \int_a^b |f(x)^2 - g(x)^2|\,\mathrm{d}x$, **tuyệt đối không phải** $\pi \int (f(x) - g(x))^2\,\mathrm{d}x$.
