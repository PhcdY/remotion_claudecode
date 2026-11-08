# Bài 16. Công thức tính góc trong không gian
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 2) | **Chương V**: Phương pháp toạ độ trong không gian

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Góc giữa hai đường thẳng, góc giữa đường thẳng và mặt phẳng, góc giữa hai mặt phẳng, côsin của góc, sin của góc, góc không tù ($0^\circ \leq \varphi \leq 90^\circ$).
* **Ký hiệu**:
  * Góc giữa hai đường thẳng: $(\Delta, \Delta')$ hoặc $(d, d')$.
  * Góc giữa đường thẳng và mặt phẳng: $(d, (P))$.
  * Góc giữa hai mặt phẳng: $((P), (Q))$.
  * VTCP: $\vec{u} = (a; b; c)$. VTPT: $\vec{n} = (A; B; C)$.

---

## 2. Khái niệm cốt lõi & Ba công thức lượng giác nền tảng

> [!IMPORTANT]
> Góc hình học giữa hai đường thẳng, giữa đường thẳng và mặt phẳng, hay giữa hai mặt phẳng đều có số đo thuộc đoạn $[0^\circ; 90^\circ]$. Do đó, giá trị lượng giác ($\cos$ hoặc $\sin$) luôn **không âm** (phải có dấu giá trị tuyệt đối ở tử số).

### A. Góc giữa hai đường thẳng
* Cho hai đường thẳng $\Delta$ và $\Delta'$ lần lượt có VTCP $\vec{u} = (a; b; c)$ và $\vec{u}' = (a'; b'; c')$:
  $$\cos(\Delta, \Delta') = |\cos(\vec{u}, \vec{u}')| = \frac{|\vec{u} \cdot \vec{u}'|}{|\vec{u}| \cdot |\vec{u}'|} = \frac{|a a' + b b' + c c'|}{\sqrt{a^2 + b^2 + c^2} \cdot \sqrt{a'^2 + b'^2 + c'^2}}$$
* **Điều kiện vuông góc**:
  $$\Delta \perp \Delta' \Leftrightarrow a a' + b b' + c c' = 0$$

### B. Góc giữa đường thẳng và mặt phẳng
* Cho đường thẳng $\Delta$ có VTCP $\vec{u} = (a; b; c)$ và mặt phẳng $(P)$ có VTPT $\vec{n} = (A; B; C)$.
* Góc giữa đường thẳng và mặt phẳng là góc giữa đường thẳng đó và hình chiếu vuông góc của nó lên mặt phẳng. Vì $\vec{n}$ vuông góc với $(P)$ nên góc giữa $\vec{u}$ và $\vec{n}$ phụ với góc giữa $\Delta$ và $(P)$.
* Công thức tính qua hàm **$\sin$**:
  $$\sin(\Delta, (P)) = |\cos(\vec{u}, \vec{n})| = \frac{|\vec{u} \cdot \vec{n}|}{|\vec{u}| \cdot |\vec{n}|} = \frac{|a A + b B + c C|}{\sqrt{a^2 + b^2 + c^2} \cdot \sqrt{A^2 + B^2 + C^2}}$$
* **Điều kiện song song hoặc nằm trong**: $\Delta \parallel (P)$ hoặc $\Delta \subset (P) \Leftrightarrow \vec{u} \cdot \vec{n} = 0$.
* **Điều kiện vuông góc**: $\Delta \perp (P) \Leftrightarrow \vec{u}$ cùng phương với $\vec{n}$.

### C. Góc giữa hai mặt phẳng
* Cho hai mặt phẳng $(P)$ và $(Q)$ lần lượt có VTPT $\vec{n} = (A; B; C)$ và $\vec{n}' = (A'; B'; C')$:
  $$\cos((P), (Q)) = |\cos(\vec{n}, \vec{n}')| = \frac{|\vec{n} \cdot \vec{n}'|}{|\vec{n}| \cdot |\vec{n}'|} = \frac{|A A' + B B' + C C'|}{\sqrt{A^2 + B^2 + C^2} \cdot \sqrt{A'^2 + B'^2 + C'^2}}$$
* **Điều kiện vuông góc**:
  $$(P) \perp (Q) \Leftrightarrow \vec{n} \cdot \vec{n}' = 0 \Leftrightarrow A A' + B B' + C C' = 0$$

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống độ dốc mái nhà hình tròn trên 3 cột trụ**:
  * Một mái nhà bê tông tròn đặt nghiêng trên 3 cây cột thẳng đứng vuông góc với sàn nhà $Oxy$.
  * Độ cao của 3 cột lần lượt là $7\text{ m}, 6\text{ m}, 5\text{ m}$. Chân của 3 cột tạo thành tam giác đều cạnh $4\text{ m}$.
  * Hỏi mái nhà nghiêng so với sàn nhà một góc bao nhiêu độ?
  * *Bản chất*: Thiết lập hệ tọa độ $Oxyz$, xác định tọa độ đỉnh 3 cột trụ $A, B, C$ $\Rightarrow$ viết VTPT của mặt phẳng mái nhà $(ABC)$ $\Rightarrow$ tính góc giữa mặt phẳng mái $(ABC)$ và mặt phẳng sàn $(Oxy)$ qua công thức côsin góc giữa hai mặt phẳng.
* **Tình huống góc dốc pin năng lượng mặt trời**:
  * Điều chỉnh tấm pin tạo góc tối ưu so với phương ngang để đón bức xạ mặt trời vuông góc lớn nhất theo mùa.

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **BẪY CỰC KỲ NGUY HIỂM: Nhầm giữa $\cos$ và $\sin$**:
   * Góc giữa **2 đối tượng cùng loại** (Đường - Đường, Mặt - Mặt): Dùng **$\cos$**.
   * Góc giữa **2 đối tượng khác loại** (Đường - Mặt): BẮT BUỘC dùng **$\sin$**!
2. **Bẫy quên dấu giá trị tuyệt đối trên tử**: Tích vô hướng $\vec{u} \cdot \vec{v}$ có thể âm, nhưng $\cos$ hoặc $\sin$ của góc hình học không bao giờ âm (do góc nằm trong $[0^\circ; 90^\circ]$). Quên trị tuyệt đối sẽ ra góc tù $> 90^\circ$ là sai định nghĩa.
