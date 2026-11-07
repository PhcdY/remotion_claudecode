# Bài 17. Phương trình mặt cầu
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 2) | **Chương V**: Phương pháp toạ độ trong không gian

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Mặt cầu, tâm mặt cầu, bán kính mặt cầu ($R > 0$), điểm nằm trong mặt cầu, điểm nằm ngoài mặt cầu, phương trình chính tắc của mặt cầu, phương trình khai triển, vị trí tương đối giữa mặt cầu và mặt phẳng (tiếp xúc, cắt nhau theo đường tròn giao tuyến, không cắt nhau).
* **Ký hiệu**:
  * Mặt cầu: $(S)$.
  * Tâm: $I(a; b; c)$.
  * Bán kính: $R$.
  * Khoảng cách từ tâm đến mặt phẳng: $d = d(I, (P))$.

---

## 2. Khái niệm cốt lõi & Công thức quan trọng

### A. Định nghĩa mặt cầu
* Mặt cầu tâm $I$, bán kính $R$ ($R > 0$) là tập hợp tất cả các điểm $M$ trong không gian cách điểm $I$ một khoảng bằng $R$:
  $$(S) = \{M \mid IM = R\}$$
* Điểm $M$ nằm trong mặt cầu nếu $IM < R$.
* Điểm $M$ nằm ngoài mặt cầu nếu $IM > R$.

### B. Phương trình của mặt cầu
1. **Dạng chính tắc (tâm và bán kính)**:
   Mặt cầu $(S)$ tâm $I(a; b; c)$ bán kính $R$ có phương trình:
   $$(x - a)^2 + (y - b)^2 + (z - c)^2 = R^2$$
2. **Dạng khai triển**:
   Phương trình dạng:
   $$x^2 + y^2 + z^2 - 2ax - 2by - 2cz + d = 0$$
   là phương trình của một mặt cầu khi và chỉ khi:
   $$a^2 + b^2 + c^2 - d > 0$$
   Khi đó, mặt cầu có:
   * **Tâm**: $I(a; b; c)$ (chia hệ số của $x, y, z$ cho $-2$).
   * **Bán kính**: $R = \sqrt{a^2 + b^2 + c^2 - d}$.

### C. Vị trí tương đối giữa mặt phẳng $(P)$ và mặt cầu $(S)$
Cho mặt cầu $(S)$ tâm $I$, bán kính $R$ và mặt phẳng $(P)$. Gọi $d = d(I, (P))$:
* **$d > R$**: Mặt phẳng $(P)$ không cắt mặt cầu $(S)$ (không có điểm chung).
* **$d = R$**: Mặt phẳng $(P)$ **tiếp xúc** với mặt cầu $(S)$ tại điểm $H$ ($H$ là hình chiếu vuông góc của $I$ lên $(P)$). Khi đó $(P)$ được gọi là tiếp diện của mặt cầu.
* **$d < R$**: Mặt phẳng $(P)$ **cắt mặt cầu theo giao tuyến là một đường tròn**.
  * Tâm của đường tròn giao tuyến là hình chiếu vuông góc $H$ của $I$ lên $(P)$.
  * Bán kính đường tròn giao tuyến: $r = \sqrt{R^2 - d^2}$.

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống đo khoảng cách trên bề mặt Trái Đất qua Google Maps**:
  * Trái Đất có dạng gần hình cầu với bán kính xấp xỉ $R \approx 6.371\text{ km}$.
  * Một thuật toán bản đồ số (Google Maps) cần tính khoảng cách ngắn nhất giữa hai thành phố (ví dụ từ tọa độ $10^\circ\text{N}, 15^\circ\text{E}$ đến $80^\circ\text{N}, 70^\circ\text{E}$).
  * Khoảng cách đo được theo cung đường tròn lớn (Great-circle distance) dựa trên hệ phương trình mặt cầu 3D trong tọa độ cầu địa tâm.
* **Tình huống trạm phát sóng radar / vệ tinh GPS**:
  * Vùng phủ sóng của vệ tinh tạo thành một mặt cầu tín hiệu trong không gian. Giao diện giữa vùng phủ sóng và mặt đất là một đường tròn giao tuyến.

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **Bẫy điều kiện bán kính thực tế**: Phương trình bậc hai $x^2+y^2+z^2-2ax-2by-2cz+d=0$ CHƯA CHẮC là mặt cầu nếu biểu thức $a^2+b^2+c^2-d \leq 0$. Nếu bằng 0 thì nó chỉ là một điểm $I$; nếu âm thì tập nghiệm là rỗng.
2. **Bẫy hệ số của $x^2, y^2, z^2$**: Trước khi xác định tâm và bán kính, phải đảm bảo hệ số trước $x^2, y^2, z^2$ bằng nhau và phải chia cả 2 vế để đưa về hệ số $1$ (ví dụ: $2x^2+2y^2+2z^2-4x+...=0$ phải chia cho $2$).
3. **Bẫy tích chéo $xy, yz, zx$**: Nếu trong phương trình xuất hiện các số hạng tích hai biến như $xy, yz, zx$ thì đó **không bao giờ** là phương trình mặt cầu!
