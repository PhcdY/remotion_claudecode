# Bài 7. Hệ trục toạ độ trong không gian
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 1) | **Chương II**: Vectơ và hệ trục toạ độ trong không gian

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Hệ trục toạ độ Descartes vuông góc trong không gian ($Oxyz$), gốc toạ độ $O$, trục hoành $Ox$, trục tung $Oy$, trục cao $Oz$, các mặt phẳng toạ độ $(Oxy), (Oyz), (Ozx)$, vectơ đơn vị ($\vec{i}, \vec{j}, \vec{k}$), toạ độ của điểm $M(x; y; z)$, toạ độ của vectơ $\vec{u} = (x; y; z)$, hình chiếu vuông góc.
* **Ký hiệu**:
  * Gốc: $O(0; 0; 0)$
  * Vectơ đơn vị: $\vec{i} = (1; 0; 0)$, $\vec{j} = (0; 1; 0)$, $\vec{k} = (0; 0; 1)$ với $|\vec{i}| = |\vec{j}| = |\vec{k}| = 1$ đôi một vuông góc.
  * Phân tích vectơ: $\vec{OM} = x\vec{i} + y\vec{j} + z\vec{k} \Leftrightarrow M(x; y; z)$
  * Phân tích vectơ tự do: $\vec{u} = x\vec{i} + y\vec{j} + z\vec{k} \Leftrightarrow \vec{u} = (x; y; z)$

---

## 2. Khái niệm cốt lõi & Quy tắc toạ độ

### A. Định nghĩa toạ độ điểm và toạ độ vectơ
* Trong không gian $Oxyz$, với mỗi điểm $M$, tồn tại duy nhất bộ ba số $(x; y; z)$ sao cho:
  $$\vec{OM} = x\vec{i} + y\vec{j} + z\vec{k}$$
  Khi đó ta viết $M(x; y; z)$ hoặc $M = (x; y; z)$.
  * $x$: hoành độ (bước đi dọc trục $Ox$).
  * $y$: tung độ (bước đi dọc trục $Oy$).
  * $z$: cao độ (bước đi dọc trục thẳng đứng $Oz$).

### B. Hình chiếu vuông góc của điểm $M(x; y; z)$
* **Lên các mặt phẳng toạ độ**:
  * Chiếu lên $(Oxy)$ $\to M_{xy}(x; y; 0)$ *(mất cao độ $z$)*.
  * Chiếu lên $(Oyz)$ $\to M_{yz}(0; y; z)$ *(mất hoành độ $x$)*.
  * Chiếu lên $(Ozx)$ $\to M_{zx}(x; 0; z)$ *(mất tung độ $y$)*.
* **Lên các trục toạ độ**:
  * Chiếu lên trục $Ox \to M_x(x; 0; 0)$.
  * Chiếu lên trục $Oy \to M_y(0; y; 0)$.
  * Chiếu lên trục $Oz \to M_z(0; 0; z)$.

### C. Toạ độ vectơ nối hai điểm
* Cho $A(x_A; y_A; z_A)$ và $B(x_B; y_B; z_B)$:
  $$\vec{AB} = (x_B - x_A; y_B - y_A; z_B - z_A)$$
  *(Lấy toạ độ điểm ngọn trừ toạ độ điểm gốc).*

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống bóng đèn trong phòng**:
  * Một chiếc bóng đèn treo cách sàn nhà $2\text{ m}$, cách hai bức tường vuông góc lần lượt là $1\text{ m}$ và $1{,}5\text{ m}$.
  * Chọn góc phòng nơi hai bức tường gặp sàn nhà làm gốc toạ độ $O$, hai chân tường là trục $Ox, Oy$, mép góc tường thẳng đứng là $Oz$.
  * Vị trí bóng đèn được xác định gọn gàng chính xác bằng bộ ba số toạ độ: $(1; 1{,}5; 2)$.
* **Tình huống trạm kiểm soát không lưu radar**:
  * Trung tâm radar đặt tại gốc $O$. Mặt phẳng mặt đất là $(Oxy)$ với trục $Ox$ hướng về phía Tây, $Oy$ hướng về phía Nam, $Oz$ hướng thẳng đứng lên trời.
  * Vị trí máy bay bay trên bầu trời được radar xác định bằng toạ độ $(x; y; z)$ (đơn vị km) để tránh va chạm.

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **Bẫy chiếu lên trục vs chiếu lên mặt phẳng**:
   * Chiếu lên **mặt phẳng** $(Oxy)$: chỉ có $z = 0$, hai toạ độ kia giữ nguyên $\to (x; y; 0)$.
   * Chiếu lên **trục** $Ox$: cả hai toạ độ $y, z$ đều bằng $0 \to (x; 0; 0)$.
2. **Quy tắc bàn tay phải và hướng trục $Oz$**: Ba trục $Ox, Oy, Oz$ tạo thành tam diện thuận (theo quy ước SGK, $Oz$ luôn hướng thẳng đứng lên trên).
