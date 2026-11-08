# Bài 12. Tích phân
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 2) | **Chương IV**: Nguyên hàm và tích phân

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Tích phân, cận dưới ($a$), cận trên ($b$), hàm số dưới dấu tích phân ($f(x)$), biểu thức dưới dấu tích phân ($f(x)\,\mathrm{d}x$), biến tích phân ($x, t, u$), hình thang cong, công thức Newton - Leibniz.
* **Ký hiệu**:
  $$\int_a^b f(x)\,\mathrm{d}x = \left. F(x) \right|_a^b = F(b) - F(a)$$

---

## 2. Khái niệm cốt lõi & Định lý quan trọng

### A. Khái niệm hình thang cong & Định nghĩa tích phân
* **Hình thang cong**: Hình phẳng giới hạn bởi đồ thị hàm số $y = f(x)$ liên tục và không âm trên đoạn $[a; b]$, trục hoành $Ox$, và hai đường thẳng thẳng đứng $x = a, x = b$.
  * Diện tích hình thang cong được tính bởi: $S = F(b) - F(a)$, trong đó $F(x)$ là một nguyên hàm của $f(x)$.
* **Định nghĩa tích phân**: Cho $f(x)$ là hàm số liên tục trên đoạn $[a; b]$. Nếu $F(x)$ là một nguyên hàm của $f(x)$ trên $[a; b]$ thì hiệu số $F(b) - F(a)$ được gọi là **tích phân từ $a$ đến $b$** của hàm số $f(x)$:
  $$\int_a^b f(x)\,\mathrm{d}x = \left. F(x) \right|_a^b = F(b) - F(a)$$

### B. Quy ước và Tính chất của tích phân
* **Quy ước**:
  $$\int_a^a f(x)\,\mathrm{d}x = 0; \quad \int_a^b f(x)\,\mathrm{d}x = -\int_b^a f(x)\,\mathrm{d}x$$
* **Tính chất độc lập biến**:
  $$\int_a^b f(x)\,\mathrm{d}x = \int_a^b f(t)\,\mathrm{d}t = \int_a^b f(u)\,\mathrm{d}u$$
* **Các tính chất tuyến tính & cộng cận**:
  1. $\int_a^b k f(x)\,\mathrm{d}x = k \int_a^b f(x)\,\mathrm{d}x$ ($k$ là hằng số).
  2. $\int_a^b [f(x) \pm g(x)]\,\mathrm{d}x = \int_a^b f(x)\,\mathrm{d}x \pm \int_a^b g(x)\,\mathrm{d}x$.
  3. **Tính chất chèn cận (cộng cận)**: Với $c \in [a; b]$ (hoặc tổng quát với mọi $a, b, c$ thuộc tập xác định liên tục):
     $$\int_a^b f(x)\,\mathrm{d}x = \int_a^c f(x)\,\mathrm{d}x + \int_c^b f(x)\,\mathrm{d}x$$

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống ô tô đạp phanh dừng khẩn cấp**:
  * Một ô tô đang chạy với vận tốc ban đầu $20\text{ m/s}$ thì người lái phát hiện chướng ngại vật và đạp phanh.
  * Xe chuyển động chậm dần đều với vận tốc $v(t) = -40t + 20$ (m/s).
  * Ô tô dừng hẳn khi $v(t) = 0 \Leftrightarrow -40t + 20 = 0 \Leftrightarrow t = 0{,}5\text{ giây}$.
  * Quãng đường xe trượt đi từ lúc đạp phanh đến khi dừng hẳn là tích phân của hàm vận tốc:
    $$S = \int_0^{0{,}5} (-40t + 20)\,\mathrm{d}t = \left. \left(-20t^2 + 20t\right) \right|_0^{0{,}5} = -20(0{,}25) + 20(0{,}5) = 5\text{ mét}$$
* **Tình huống năng lượng tiêu thụ hoặc lượng nước xả qua cống**:
  * Lưu lượng nước chảy theo thời gian $q(t)$ qua miệng cống thủy lợi trong 4 giờ. Lượng nước tổng cộng là $\int_0^4 q(t)\,\mathrm{d}t$.

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **Phân biệt Nguyên hàm và Tích phân**:
   * *Nguyên hàm* $\int f(x)\,\mathrm{d}x$ là một **hàm số** (kèm hằng số $+C$).
   * *Tích phân* $\int_a^b f(x)\,\mathrm{d}x$ là một **con số thực cụ thể**, phụ thuộc vào cận $a, b$ và quy tắc hàm, không còn $+C$.
2. **Ý nghĩa hình học khi hàm số nhận giá trị âm**:
   * Nếu $f(x) \geq 0$ trên $[a; b]$, tích phân $\int_a^b f(x)\,\mathrm{d}x$ bằng diện tích hình thang cong.
   * Nếu $f(x) \leq 0$ trên $[a; b]$, tích phân sẽ mang **giá trị âm** (bằng số đối của diện tích).
3. **Bẫy chèn cận**: Đổi cận thì đổi dấu: $\int_b^a = -\int_a^b$.
