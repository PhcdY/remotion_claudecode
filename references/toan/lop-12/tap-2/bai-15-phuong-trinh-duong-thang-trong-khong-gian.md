# Bài 15. Phương trình đường thẳng trong không gian
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 2) | **Chương V**: Phương pháp toạ độ trong không gian

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Vectơ chỉ phương (VTCP), phương trình tham số của đường thẳng, tham số $t$, phương trình chính tắc của đường thẳng, vị trí tương đối giữa hai đường thẳng (song song, trùng nhau, cắt nhau, chéo nhau), hai đường thẳng vuông góc.
* **Ký hiệu**:
  * Đường thẳng: $\Delta, d, d'$.
  * Vectơ chỉ phương: $\vec{u} = (a; b; c)$ với $a^2 + b^2 + c^2 > 0$.
  * Điểm đi qua: $M_0(x_0; y_0; z_0)$.
  * Tham số: $t \in \mathbb{R}$.

---

## 2. Khái niệm cốt lõi & Công thức quan trọng

### A. Định nghĩa vectơ chỉ phương
* Vectơ $\vec{u} \neq \vec{0}$ được gọi là **vectơ chỉ phương** của đường thẳng $\Delta$ nếu giá của $\vec{u}$ song song hoặc trùng với $\Delta$.
* Nếu $\vec{u}$ là một VTCP của $\Delta$ thì $k\vec{u}$ ($k \neq 0$) cũng là một VTCP của $\Delta$.

### B. Phương trình đường thẳng
1. **Phương trình tham số**: Đường thẳng $\Delta$ đi qua điểm $M_0(x_0; y_0; z_0)$ và có VTCP $\vec{u} = (a; b; c)$:
   $$\begin{cases} x = x_0 + at \\ y = y_0 + bt \\ z = z_0 + ct \end{cases} \quad (t \in \mathbb{R})$$
   * Mỗi giá trị cụ thể của $t$ cho ta tọa độ của một điểm duy nhất thuộc đường thẳng $\Delta$.
2. **Phương trình chính tắc**: Nếu $a, b, c$ đều khác $0$:
   $$\frac{x - x_0}{a} = \frac{y - y_0}{b} = \frac{z - z_0}{c}$$

### C. Vị trí tương đối giữa hai đường thẳng
Cho đường thẳng $d$ đi qua $A$ có VTCP $\vec{u}$, đường thẳng $d'$ đi qua $A'$ có VTCP $\vec{u}'$:
* **Cùng phương**: Nếu $\vec{u}$ và $\vec{u}'$ cùng phương ($\vec{u} = k\vec{u}'$):
  * **Trùng nhau**: $A \in d'$.
  * **Song song**: $A \notin d'$.
* **Không cùng phương**: Nếu $\vec{u}$ và $\vec{u}'$ không cùng phương:
  * **Cắt nhau**: Hệ phương trình tọa độ giao điểm giữa $d$ và $d'$ có nghiệm duy nhất (tương đương $[\vec{u}, \vec{u}'] \cdot \vec{AA'} = 0$).
  * **Chéo nhau**: Hệ phương trình vô nghiệm (tương đương $[\vec{u}, \vec{u}'] \cdot \vec{AA'} \neq 0$, tức $\vec{u}, \vec{u}', \vec{AA'}$ không đồng phẳng).
* **Điều kiện vuông góc**:
  $$d \perp d' \Leftrightarrow \vec{u} \cdot \vec{u}' = 0 \Leftrightarrow aa' + bb' + cc' = 0$$

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống tia sáng và tấm bìa chắn tầm nhìn**:
  * Trong không gian $Oxyz$, mắt người quan sát đặt tại $M(2; 3; -4)$, ngắm nhìn vật thể tại $N(-1; 0; 8)$.
  * Tia nhìn là đường thẳng đi qua $M$ và $N$. Phương trình tia sáng được viết dưới dạng tham số.
  * Một tấm bìa tròn chắn tâm tại gốc tọa độ $O$ nằm trên mặt phẳng $(Oxy)$ bán kính $R=3$. Giao điểm của đường thẳng $MN$ với mặt phẳng $(Oxy)$ ($z = 0$) có tọa độ $(1; 2; 0)$ với khoảng cách tới gốc $O$ là $\sqrt{1^2 + 2^2} = \sqrt{5} < 3$.
  * *Kết luận thực tế*: Tia nhìn bị tấm bìa che khuất, người quan sát không thể nhìn thấy vật thể.
* **Tình huống quỹ đạo bay của hai máy bay**:
  * Hai máy bay thương mại bay theo hai đường thẳng trong không gian. Kiểm tra xem quỹ đạo có cắt nhau hay chéo nhau để điều phối viên không lưu phân luồng độ cao an toàn.

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **Phân biệt phẳng và không gian**: Trong mặt phẳng, hai đường thẳng không song song thì chắc chắn cắt nhau. Nhưng trong không gian 3D, **hai đường thẳng không song song vẫn có thể chéo nhau** (không có điểm chung và không cùng nằm trong một mặt phẳng).
2. **Bẫy dùng chung một tham số $t$ khi giải hệ giao điểm**: Khi xét giao điểm của $d$ và $d'$, BẮT BUỘC dùng hai tham số khác nhau: $t$ cho $d$ và $t'$ (hoặc $s$) cho $d'$. Dùng chung $t$ là sai bản chất nghiêm trọng!
3. **Phương trình chính tắc khi có thành phần tọa độ bằng 0**: Nếu $a = 0$, không tồn tại phương trình chính tắc dạng tỉ lệ chia cho 0, mà phải biểu diễn bằng dạng hỗn hợp hoặc giữ nguyên phương trình tham số.
