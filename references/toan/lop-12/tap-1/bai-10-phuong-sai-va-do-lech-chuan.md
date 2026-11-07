# Bài 10. Phương sai và độ lệch chuẩn của mẫu số liệu ghép nhóm
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 1) | **Chương III**: Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Giá trị đại diện của nhóm, số trung bình, phương sai, độ lệch chuẩn, mức độ đồng đều (độ ổn định), mẫu hiệu chỉnh.
* **Ký hiệu**:
  * Giá trị đại diện của nhóm $[a_i; a_{i+1})$: $x_i = \frac{a_i + a_{i+1}}{2}$.
  * Cỡ mẫu: $n = \sum_{i=1}^k m_i$.
  * Số trung bình của mẫu ghép nhóm: $\overline{x}$.
  * Phương sai mẫu: $s^2$.
  * Độ lệch chuẩn mẫu: $s = \sqrt{s^2}$.
  * Phương sai và độ lệch chuẩn hiệu chỉnh: $\hat{s}^2$, $\hat{s}$.

---

## 2. Khái niệm cốt lõi & Công thức tính toán

### A. Giá trị đại diện và Số trung bình
* **Giá trị đại diện** của nhóm $[a_i; a_{i+1})$ là trung điểm:
  $$x_i = \frac{a_i + a_{i+1}}{2}$$
* **Số trung bình** của mẫu số liệu ghép nhóm:
  $$\overline{x} = \frac{m_1 x_1 + m_2 x_2 + \dots + m_k x_k}{n} = \frac{1}{n}\sum_{i=1}^k m_i x_i$$

### B. Phương sai & Độ lệch chuẩn
* **Định nghĩa phương sai ($s^2$)**:
  $$s^2 = \frac{m_1 (x_1 - \overline{x})^2 + m_2 (x_2 - \overline{x})^2 + \dots + m_k (x_k - \overline{x})^2}{n} = \frac{1}{n}\sum_{i=1}^k m_i (x_i - \overline{x})^2$$
* **Công thức tính nhanh phương sai**:
  $$s^2 = \frac{1}{n}\sum_{i=1}^k m_i x_i^2 - (\overline{x})^2$$
* **Độ lệch chuẩn ($s$)**:
  $$s = \sqrt{s^2}$$
* **Phương sai hiệu chỉnh (mở rộng SGK)**:
  $$\hat{s}^2 = \frac{n}{n - 1} s^2 = \frac{1}{n - 1}\sum_{i=1}^k m_i (x_i - \overline{x})^2, \quad \hat{s} = \sqrt{\hat{s}^2}$$

### C. Ý nghĩa thống kê & Bản chất
* Phương sai và độ lệch chuẩn phản ánh **mức độ phân tán của các số liệu xung quanh giá trị trung bình**.
* **Độ lệch chuẩn $s$ cùng đơn vị đo** với số liệu gốc (trong khi phương sai có đơn vị là bình phương đơn vị số liệu).
* Độ lệch chuẩn càng nhỏ $\Rightarrow$ các giá trị tập trung càng sát số trung bình $\Rightarrow$ mẫu số liệu càng đồng đều, máy móc sản xuất càng ổn định, rủi ro càng thấp.

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống kiểm định máy đo độ ẩm không khí**:
  * Để xác định độ ổn định của máy đo độ ẩm không khí, kỹ thuật viên đo 20 lần thử nghiệm.
  * Tiêu chuẩn chất lượng: Nếu độ lệch chuẩn $s > 0{,}15\%$ thì phải đưa máy đi hiệu chuẩn và sửa chữa. Tính độ lệch chuẩn từ bảng ghép nhóm để đưa ra quyết định kỹ thuật chính xác.
* **Tình huống so sánh hiệu quả chế độ ăn kiêng**:
  * Theo dõi sự thay đổi cân nặng sau 3 tháng của nhóm nam và nhóm nữ.
  * Dù cân nặng giảm trung bình của cả hai nhóm là như nhau ($\overline{x} = 1{,}5\text{ kg}$), nhưng độ lệch chuẩn của nam lớn hơn nữ $\Rightarrow$ mức độ giảm cân ở nữ đồng đều hơn, ít biến động hơn.
* **Tình huống kiểm soát sai số sản xuất đinh ốc / linh kiện**:
  * Chiều dài trung bình đạt chuẩn 50mm, nhưng nhà máy nào có độ lệch chuẩn nhỏ hơn thì quy trình dập khuôn chính xác và ít phế phẩm hơn.

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **Bẫy đơn vị**: Phương sai mang đơn vị bình phương (ví dụ: $\text{cm}^2$, $\text{kg}^2$), còn độ lệch chuẩn mang cùng đơn vị với số liệu ($\text{cm}$, $\text{kg}$). Khi so sánh mức độ phân tán với số trung bình, luôn dùng **độ lệch chuẩn**.
2. **Bẫy nhầm lẫn giữa giá trị đại diện và khoảng chia**: Khi tính phải dùng $x_i = \frac{a_i + a_{i+1}}{2}$, không được lấy nhầm đầu mút trái $a_i$ hoặc độ dài khoảng chia $(a_{i+1} - a_i)$.
3. **Ý nghĩa sư phạm**: Giải thích trực quan phương sai chính là "trung bình cộng bình phương các khoảng cách từ từng điểm dữ liệu đến điểm trung tâm".
