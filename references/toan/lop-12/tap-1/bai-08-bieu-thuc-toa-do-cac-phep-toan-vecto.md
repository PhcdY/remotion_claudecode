# Bài 8. Biểu thức toạ độ của các phép toán vectơ
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 1) | **Chương II**: Vectơ và hệ trục toạ độ trong không gian

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Biểu thức toạ độ của phép cộng, phép trừ, phép nhân với một số, toạ độ trung điểm đoạn thẳng, toạ độ trọng tâm tam giác, tích vô hướng theo toạ độ, độ dài vectơ, khoảng cách giữa hai điểm, góc giữa hai vectơ, điều kiện vuông góc, điều kiện cùng phương.
* **Ký hiệu**:
  * $\vec{a} = (x; y; z)$, $\vec{b} = (x'; y'; z')$
  * $k\vec{a} = (kx; ky; kz)$
  * Trung điểm $M$, trọng tâm $G$

---

## 2. Các công thức toạ độ cốt lõi

### A. Phép toán đại số với toạ độ
Cho $\vec{a} = (x; y; z)$ và $\vec{b} = (x'; y'; z')$ và số thực $k$:
* **Tổng & Hiệu**: $\vec{a} \pm \vec{b} = (x \pm x'; y \pm y'; z \pm z')$
* **Tích với một số**: $k\vec{a} = (kx; ky; kz)$
* **Hai vectơ cùng phương**: $\vec{a}$ và $\vec{b}$ ($\vec{b} \neq \vec{0}$) cùng phương $\Leftrightarrow \exists k \in \mathbb{R}: \vec{a} = k\vec{b} \Leftrightarrow \begin{cases} x = kx' \\ y = ky' \\ z = kz' \end{cases}$ (hoặc $\frac{x}{x'} = \frac{y}{y'} = \frac{z}{z'}$ nếu các mẫu khác 0).

### B. Toạ độ trung điểm và trọng tâm
* **Trung điểm $M$ của đoạn thẳng $AB$**:
  $$x_M = \frac{x_A + x_B}{2}, \quad y_M = \frac{y_A + y_B}{2}, \quad z_M = \frac{z_A + z_B}{2}$$
* **Trọng tâm $G$ của tam giác $ABC$**:
  $$x_G = \frac{x_A + x_B + x_C}{3}, \quad y_G = \frac{y_A + y_B + y_C}{3}, \quad z_G = \frac{z_A + z_B + z_C}{3}$$

### C. Tích vô hướng, độ dài & khoảng cách
* **Tích vô hướng**:
  $$\vec{a} \cdot \vec{b} = x \cdot x' + y \cdot y' + z \cdot z'$$
* **Độ dài của một vectơ**:
  $$|\vec{a}| = \sqrt{x^2 + y^2 + z^2}$$
* **Khoảng cách giữa hai điểm $A$ và $B$**:
  $$AB = |\vec{AB}| = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2 + (z_B - z_A)^2}$$
* **Côsin góc giữa hai vectơ**:
  $$\cos(\vec{a}, \vec{b}) = \frac{\vec{a} \cdot \vec{b}}{|\vec{a}| \cdot |\vec{b}|} = \frac{x x' + y y' + z z'}{\sqrt{x^2 + y^2 + z^2} \cdot \sqrt{x'^2 + y'^2 + z'^2}}$$
* **Điều kiện vuông góc**:
  $$\vec{a} \perp \vec{b} \Leftrightarrow x x' + y y' + z z' = 0$$

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống ngôi nhà gỗ**: Khung nhà gỗ hình lăng trụ đứng tam giác. Bằng cách gắn hệ trục toạ độ $Oxyz$, ta biết được toạ độ các đỉnh $\to$ tính được chính xác chiều dài các thanh xà, góc dốc của mái nhà mà không cần leo lên mái đo đạc thủ công.
* **Tình huống radar theo dõi đường bay máy bay**:
  * Radar phát hiện máy bay chuyển động thẳng đều từ $A(800; 500; 7)$ đến $B(940; 550; 8)$ trong 10 phút.
  * Sau 5 phút tiếp theo, máy bay đến vị trí $C$. Vì vận tốc không đổi nên $\vec{BC} = \frac{1}{2}\vec{AB}$.
  * Từ công thức toạ độ, ta tính ngay được vị trí $C(1010; 575; 8{,}5)$ trong tích tắc.
* **Tình huống khoảng cách giữa 2 khinh khí cầu**: Hai chiếc khinh khí cầu bay lơ lửng trên bầu trời ở 2 vị trí toạ độ khác nhau $\to$ áp dụng công thức khoảng cách 3D để biết khoảng cách an toàn.

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **Bẫy chia cho 0 khi xét cùng phương**: Không nên lạm dụng tỉ số $\frac{x}{x'} = \frac{y}{y'} = \frac{z}{z'}$ khi chưa biết mẫu số có khác 0 hay không. Luôn ưu tiên dùng hệ số $k$: $\vec{a} = k\vec{b}$.
2. **Nhầm dấu khi tính $\vec{AB}$**: Rất nhiều học sinh lấy $A - B$ thay vì $B - A$ (ngọn trừ gốc).
