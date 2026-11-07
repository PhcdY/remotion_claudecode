# Bài 4. Khảo sát sự biến thiên và vẽ đồ thị của hàm số
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 1) | **Chương I**: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Khảo sát hàm số, sơ đồ khảo sát, bảng biến thiên, tâm đối xứng, trục đối xứng, điểm uốn, điểm đặc biệt, hàm đa thức bậc ba, hàm phân thức hữu tỉ bậc nhất trên bậc nhất ($y = \frac{ax+b}{cx+d}$), hàm phân thức hữu tỉ bậc hai trên bậc nhất ($y = \frac{ax^2+bx+c}{px+q}$).
* **Ký hiệu**: $y = f(x)$, $f'(x)$, $f''(x)$, tâm đối xứng $I(x_0; y_0)$.

---

## 2. Sơ đồ khảo sát chuẩn SGK

### A. Quy trình 3 bước tổng quát
1. **Tìm tập xác định** của hàm số.
2. **Khảo sát sự biến thiên**:
   * Tính đạo hàm $y' = f'(x)$. Tìm các điểm tại đó $y' = 0$ hoặc không xác định.
   * Xét dấu $y'$ để chỉ ra các khoảng đồng biến, nghịch biến.
   * Tìm cực trị của hàm số.
   * Tìm các giới hạn tại vô cực, giới hạn một bên và xác định các đường tiệm cận (nếu có).
   * Lập bảng biến thiên (tổng kết mọi thông tin trên một bảng).
3. **Vẽ đồ thị**:
   * Xác định các điểm đặc biệt: giao điểm với trục hoành ($y = 0$), giao điểm với trục tung ($x = 0$), các điểm cực trị.
   * Vẽ các đường tiệm cận (nếu có).
   * Vẽ đường cong đồ thị dựa vào bảng biến thiên, chú ý tính đối xứng.

### B. Ba dạng hàm số trọng tâm trong SGK 2018
1. **Hàm đa thức bậc ba $y = ax^3 + bx^2 + cx + d$ ($a \neq 0$)**:
   * Không có tiệm cận.
   * Luôn có **tâm đối xứng** là điểm uốn $I(x_0; y_0)$ với hoành độ là nghiệm của phương trình $y'' = 0 \Leftrightarrow x_0 = -\frac{b}{3a}$.
2. **Hàm phân thức bậc nhất trên bậc nhất $y = \frac{ax+b}{cx+d}$ ($c \neq 0, ad - bc \neq 0$)**:
   * Tiệm cận đứng $x = -\frac{d}{c}$, tiệm cận ngang $y = \frac{a}{c}$.
   * **Tâm đối xứng** là giao điểm của hai đường tiệm cận: $I\left(-\frac{d}{c}; \frac{a}{c}\right)$.
   * Hai trục đối xứng là hai đường phân giác của các góc tạo bởi hai đường tiệm cận.
3. **Hàm phân thức bậc hai trên bậc nhất $y = \frac{ax^2+bx+c}{px+q}$ ($a \neq 0, p \neq 0$, đa thức tử không chia hết cho mẫu)**:
   * Tiệm cận đứng $x = -\frac{q}{p}$.
   * Tiệm cận xiên $y = \frac{a}{p}x + \frac{b - a \frac{q}{p}}{p}$ (tìm bằng cách chia đa thức).
   * **Tâm đối xứng** là giao điểm của tiệm cận đứng và tiệm cận xiên.

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống chi phí sản xuất trung bình**:
  * Tổng chi phí sản xuất $x$ sản phẩm: $C(x) = 2x + 45$ (triệu đồng).
  * Chi phí trung bình cho mỗi đơn vị sản phẩm: $\overline{C}(x) = \frac{C(x)}{x} = 2 + \frac{45}{x}$.
  * Khi số lượng sản phẩm $x$ tăng vọt lên rất lớn ($x \to +\infty$), chi phí trung bình giảm dần nhưng luôn lớn hơn 2 triệu đồng/sản phẩm (tiệm cận ngang $y = 2$).
* **Tình huống pha dung dịch nồng độ hóa chất**: Nồng độ chất khử trùng trong bể nước theo thời gian $t$: đồ thị hàm phân thức thể hiện nồng độ tăng dần nhưng tiệm cận tới mức tối đa an toàn $0{,}5\text{ gam/lít}$.

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **Vẽ nhánh đồ thị vượt qua tiệm cận đứng**: Đồ thị không bao giờ cắt qua tiệm cận đứng.
2. **Tính đối xứng của đồ thị**: Nhắc nhở người xem về tâm đối xứng giúp hình dung và vẽ hai nhánh đối xứng nhau chính xác qua một điểm trung tâm.
