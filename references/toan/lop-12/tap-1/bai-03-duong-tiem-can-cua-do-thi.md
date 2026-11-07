# Bài 3. Đường tiệm cận của đồ thị hàm số
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 1) | **Chương I**: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Đường tiệm cận ngang, đường tiệm cận đứng, đường tiệm cận xiên, khoảng cách từ điểm trên đồ thị đến đường thẳng.
* **Ký hiệu**:
  * Tiệm cận ngang: $y = y_0$
  * Tiệm cận đứng: $x = x_0$
  * Tiệm cận xiên: $y = ax + b$ ($a \neq 0$)

---

## 2. Khái niệm cốt lõi & Điều kiện xác định

### A. Tiệm cận ngang ($y = y_0$)
* **Bản chất trực giác**: Khi $x$ tiến ra xa vô tận ($+\infty$ hoặc $-\infty$), đồ thị hàm số ngày càng ép sát vào đường thẳng nằm ngang $y = y_0$.
* **Định nghĩa**: Đường thẳng $y = y_0$ được gọi là tiệm cận ngang của đồ thị hàm số $y = f(x)$ nếu thỏa mãn ít nhất một trong hai điều kiện:
  $$\lim_{x \to +\infty} f(x) = y_0 \quad \text{hoặc} \quad \lim_{x \to -\infty} f(x) = y_0$$

### B. Tiệm cận đứng ($x = x_0$)
* **Bản chất trực giác**: Khi $x$ tiến dần về giá trị $x_0$ (thường là nghiệm của mẫu số làm hàm không xác định), đồ thị hàm số phóng vọt lên cao vô cùng ($+\infty$) hoặc tụt sâu xuống vô cùng ($-\infty$).
* **Định nghĩa**: Đường thẳng $x = x_0$ được gọi là tiệm cận đứng của đồ thị hàm số $y = f(x)$ nếu thỏa mãn ít nhất một trong bốn điều kiện:
  $$\lim_{x \to x_0^+} f(x) = +\infty; \quad \lim_{x \to x_0^+} f(x) = -\infty; \quad \lim_{x \to x_0^-} f(x) = +\infty; \quad \lim_{x \to x_0^-} f(x) = -\infty$$

### C. Tiệm cận xiên ($y = ax + b, a \neq 0$)
* **Bản chất trực giác**: Khi $x \to \pm\infty$, hàm phân thức bậc 2 chia bậc 1 tách thành một đường thẳng cộng với một phần dư triệt tiêu về 0: $f(x) = (ax + b) + \frac{r}{g(x)}$.
* **Định nghĩa**: Đường thẳng $y = ax + b$ ($a \neq 0$) là tiệm cận xiên nếu:
  $$\lim_{x \to +\infty} [f(x) - (ax + b)] = 0 \quad \text{hoặc} \quad \lim_{x \to -\infty} [f(x) - (ax + b)] = 0$$
* **Công thức tìm hệ số $a, b$ tổng quát**:
  $$a = \lim_{x \to \pm\infty} \frac{f(x)}{x}, \quad b = \lim_{x \to \pm\infty} [f(x) - ax]$$

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống mở đầu (Khối lượng chất phóng xạ còn lại)**:
  * Khối lượng chất phóng xạ còn lại sau $t$ ngày phân rã: $m(t) = 15e^{-0,012t}$.
  * Khi $t \to +\infty$, khối lượng $m(t) \to 0$ nhưng không bao giờ bằng 0 tuyệt đối $\to$ đường $m = 0$ (trục hoành) là tiệm cận ngang.
* **Tình huống chi phí khử độc hồ nước**:
  * Chi phí loại bỏ $p\%$ chất độc hại: $C(p) = \frac{45p}{100 - p}$ (triệu đồng), với $0 \leq p < 100$.
  * Khi muốn loại bỏ gần như tuyệt đối ($p \to 100^-$), chi phí $C(p) \to +\infty$ $\to$ đường thẳng $p = 100$ là tiệm cận đứng (thể hiện không thể nào dọn sạch $100\%$ chất độc bằng một ngân sách hữu hạn).

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **Tiệm cận ngang có thể bị đồ thị cắt qua**: Nhiều học sinh lầm tưởng đồ thị "không bao giờ được chạm vào tiệm cận". Thực tế, tiệm cận ngang chỉ mô tả xu hướng ở **vô cực** ($x \to \pm\infty$), ở khoảng hữu hạn đồ thị hoàn toàn có thể cắt tiệm cận ngang nhiều lần.
2. **Nghiệm của mẫu số chưa chắc là tiệm cận đứng**: Nếu tử số cũng triệt tiêu tại điểm đó và rút gọn được thì không có tiệm cận đứng (ví dụ $y = \frac{x^2 - 1}{x - 1} = x + 1$ với $x \neq 1$, chỉ là điểm khuyết chứ không phải tiệm cận).
