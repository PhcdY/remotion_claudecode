# Bài 14. Phương trình mặt phẳng
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 2) | **Chương V**: Phương pháp toạ độ trong không gian

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Vectơ pháp tuyến (VTPT), cặp vectơ chỉ phương, tích có hướng của hai vectơ, phương trình tổng quát của mặt phẳng, phương trình mặt phẳng theo đoạn chắn, hai mặt phẳng song song, trùng nhau, cắt nhau, vuông góc, khoảng cách từ một điểm đến mặt phẳng.
* **Ký hiệu**:
  * Mặt phẳng: $(\alpha), (P), (Q)$.
  * Vectơ pháp tuyến: $\vec{n} = (A; B; C)$ với $A^2 + B^2 + C^2 > 0$.
  * Tích có hướng: $[\vec{u}, \vec{v}]$.
  * Điểm $M_0(x_0; y_0; z_0)$.
  * Khoảng cách: $d(M_0, (P))$.

---

## 2. Khái niệm cốt lõi & Công thức quan trọng

### A. Vectơ pháp tuyến & Tích có hướng
* **Định nghĩa VTPT**: Vectơ $\vec{n} \neq \vec{0}$ được gọi là vectơ pháp tuyến của mặt phẳng $(\alpha)$ nếu giá của $\vec{n}$ vuông góc với $(\alpha)$.
  * Nếu $\vec{n}$ là một VTPT thì $k\vec{n}$ ($k \neq 0$) cũng là một VTPT của $(\alpha)$.
* **Cặp vectơ chỉ phương & Tích có hướng**:
  * Hai vectơ không cùng phương $\vec{u} = (a_1; a_2; a_3)$ và $\vec{v} = (b_1; b_2; b_3)$ có giá song song hoặc nằm trong $(\alpha)$ được gọi là cặp VTCP của $(\alpha)$.
  * Khi đó, vectơ tích có hướng $\vec{n} = [\vec{u}, \vec{v}]$ là một VTPT của $(\alpha)$:
    $$[\vec{u}, \vec{v}] = \left( \begin{vmatrix} a_2 & a_3 \\ b_2 & b_3 \end{vmatrix}; \begin{vmatrix} a_3 & a_1 \\ b_3 & b_1 \end{vmatrix}; \begin{vmatrix} a_1 & a_2 \\ b_1 & b_2 \end{vmatrix} \right) = (a_2 b_3 - a_3 b_2; a_3 b_1 - a_1 b_3; a_1 b_2 - a_2 b_1)$$

### B. Phương trình tổng quát của mặt phẳng
* Mặt phẳng $(\alpha)$ đi qua điểm $M_0(x_0; y_0; z_0)$ và nhận $\vec{n} = (A; B; C)$ làm VTPT có phương trình:
  $$A(x - x_0) + B(y - y_0) + C(z - z_0) = 0 \Leftrightarrow Ax + By + Cz + D = 0$$
  (với $D = -(Ax_0 + By_0 + Cz_0)$).
* **Phương trình đoạn chắn**: Nếu mặt phẳng cắt 3 trục tọa độ tại $A(a; 0; 0), B(0; b; 0), C(0; 0; c)$ với $abc \neq 0$:
  $$\frac{x}{a} + \frac{y}{b} + \frac{z}{c} = 1$$

### C. Vị trí tương đối & Khoảng cách
* **Hai mặt phẳng**: $(\alpha): Ax + By + Cz + D = 0$ và $(\beta): A'x + B'y + C'z + D' = 0$:
  * **Song song**: $(\alpha) \parallel (\beta) \Leftrightarrow \vec{n}_\alpha = k \vec{n}_\beta$ và $D \neq k D'$ ($\frac{A}{A'} = \frac{B}{B'} = \frac{C}{C'} \neq \frac{D}{D'}$).
  * **Trùng nhau**: $\frac{A}{A'} = \frac{B}{B'} = \frac{C}{C'} = \frac{D}{D'}$.
  * **Cắt nhau**: $\vec{n}_\alpha$ và $\vec{n}_\beta$ không cùng phương.
  * **Vuông góc**: $(\alpha) \perp (\beta) \Leftrightarrow \vec{n}_\alpha \cdot \vec{n}_\beta = 0 \Leftrightarrow AA' + BB' + CC' = 0$.
* **Khoảng cách từ điểm $M_0(x_0; y_0; z_0)$ đến mặt phẳng $(\alpha)$**:
  $$d(M_0, (\alpha)) = \frac{|Ax_0 + By_0 + Cz_0 + D|}{\sqrt{A^2 + B^2 + C^2}}$$

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống vật thể chuyển động trên mặt bàn**:
  * Khi đặt một vật trên mặt bàn phẳng, phản lực pháp tuyến $\vec{n}$ của mặt bàn luôn vuông góc với mặt phẳng đỡ.
  * Tọa độ chất điểm di chuyển theo thời gian $M(\cos t - \sin t; \cos t + \sin t; \cos t)$. Bằng cách kiểm tra hệ thức tọa độ, ta thấy tọa độ luôn thỏa mãn phương trình mặt phẳng cố định $x - y + 2z = 0$.
* **Tình huống trạm radar & Mặt phẳng bức xạ sóng**:
  * Bề mặt tấm pin năng lượng mặt trời hoặc mái hiên đón nắng nghiêng trong không gian. Xác định khoảng cách từ đỉnh cây cột anten tới mặt phẳng tấm thu sóng để đảm bảo vùng phủ sóng.

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **Bẫy quên hệ số tự do $D$ khi viết phương trình song song**: Mặt phẳng song song với $(\alpha): Ax+By+Cz+D=0$ có dạng $Ax+By+Cz+D'=0$ với điều kiện $D' \neq D$ (nếu $D'=D$ thì trùng nhau).
2. **Bẫy dấu trong tích có hướng**: Tọa độ thứ 2 (tung độ) của $[\vec{u}, \vec{v}]$ là $a_3 b_1 - a_1 b_3$ (hoặc đối dấu định thức $\begin{vmatrix} a_1 & a_3 \\ b_1 & b_3 \end{vmatrix}$). Học sinh rất hay đảo nhầm dấu phần này.
3. **Mặt phẳng đặc biệt**: Mặt phẳng tọa độ $(Oxy): z = 0$; $(Oyz): x = 0$; $(Ozx): y = 0$.
