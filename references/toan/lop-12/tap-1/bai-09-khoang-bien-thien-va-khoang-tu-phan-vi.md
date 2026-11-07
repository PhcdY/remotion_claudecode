# Bài 9. Khoảng biến thiên và khoảng tứ phân vị của mẫu số liệu ghép nhóm
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 1) | **Chương III**: Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Mẫu số liệu ghép nhóm, mức độ phân tán, khoảng biến thiên, khoảng tứ phân vị, tứ phân vị thứ nhất ($Q_1$), tứ phân vị thứ hai ($Q_2$ hay trung vị $M_e$), tứ phân vị thứ ba ($Q_3$), giá trị ngoại lai (giá trị bất thường).
* **Ký hiệu**:
  * Nhóm số liệu: $[a_i; a_{i+1})$ với tần số $m_i$. Cỡ mẫu $n = m_1 + m_2 + \dots + m_k$.
  * Khoảng biến thiên: $R$.
  * Khoảng tứ phân vị: $\Delta_Q = Q_3 - Q_1$.

---

## 2. Khái niệm cốt lõi & Công thức tính toán

### A. Khoảng biến thiên của mẫu số liệu ghép nhóm
* **Định nghĩa**: Cho mẫu số liệu ghép nhóm gồm $k$ nhóm $[a_1; a_2), \dots, [a_k; a_{k+1})$. Khoảng biến thiên của mẫu số liệu ghép nhóm, kí hiệu là $R$, là hiệu giữa đầu mút phải của nhóm cuối cùng và đầu mút trái của nhóm đầu tiên:
  $$R = a_{k+1} - a_1$$
* **Ý nghĩa & Bản chất**:
  * Khoảng biến thiên $R$ xấp xỉ cho khoảng biến thiên của mẫu số liệu gốc (hiệu số giữa giá trị lớn nhất và nhỏ nhất).
  * $R$ càng lớn thì số liệu càng phân tán; $R$ càng nhỏ thì số liệu càng tập trung quanh một miền giá trị hẹp.
  * *Hạn chế*: Rất nhạy cảm với các giá trị bất thường (outliers) hoặc các nhóm ngoại biên cực lớn/cực nhỏ.

### B. Khoảng tứ phân vị của mẫu số liệu ghép nhóm
* **Tứ phân vị thứ $r$ ($r \in \{1, 2, 3\}$)**:
  $$Q_r = a_p + \frac{\frac{r \cdot n}{4} - (m_1 + \dots + m_{p-1})}{m_p}(a_{p+1} - a_p)$$
  Trong đó:
  * $[a_p; a_{p+1})$ là nhóm chứa tứ phân vị thứ $r$ (nhóm đầu tiên có tần số tích lũy lớn hơn hoặc bằng $\frac{r \cdot n}{4}$).
  * $m_p$ là tần số của nhóm $[a_p; a_{p+1})$.
  * $m_1 + \dots + m_{p-1}$ là tổng tần số của các nhóm đứng trước nhóm thứ $p$ (quy ước bằng $0$ nếu $p = 1$).
* **Khoảng tứ phân vị**:
  $$\Delta_Q = Q_3 - Q_1$$
* **Ý nghĩa & Ưu điểm vượt trội**:
  * Đo khoảng phân tán của **50% số liệu ở chính giữa**.
  * **Không bị ảnh hưởng bởi các giá trị bất thường** ở hai đầu biên. Do đó, khi mẫu số liệu có giá trị ngoại lai, khoảng tứ phân vị là thước đo tin cậy hơn khoảng biến thiên.

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống so sánh nhiệt độ tháng Sáu tại Hà Nội (2021 vs 2022)**:
  * Người ta thống kê số ngày theo nhiệt độ cao nhất trong ngày của tháng 6 năm 2021 và tháng 6 năm 2022.
  * Đặt câu hỏi: Tháng 6 năm nào nhiệt độ có mức độ biến động (phân tán) nhiều hơn? Không thể chỉ nhìn trung bình (vì trung bình có thể bằng nhau), mà cần đo độ phân tán bằng khoảng biến thiên và khoảng tứ phân vị.
* **Tình huống thời gian sử dụng mạng xã hội của học sinh**:
  * So sánh thời gian dùng mạng xã hội của Tổ 1 và Tổ 2 lớp 12A để đánh giá tổ nào có độ phân tán thói quen cao hơn.
* **Tình huống thời gian chờ khám bệnh tại phòng khám**:
  * Đánh giá chất lượng dịch vụ: một bệnh viện có thời gian chờ trung bình 10 phút nhưng khoảng tứ phân vị nhỏ chứng tỏ quy trình làm việc đều đặn, ổn định hơn phòng khám có độ phân tán lớn.

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **Bẫy nhầm lẫn giữa khoảng biến thiên số liệu ghép nhóm và số liệu gốc**:
   * Với số liệu ghép nhóm, $R = a_{k+1} - a_1$ (lấy biên nhóm), thường lớn hơn hoặc bằng khoảng biến thiên thực tế của các giá trị cá thể trong mẫu số liệu gốc.
2. **Bẫy xác định sai nhóm chứa tứ phân vị**:
   * Khi tìm $Q_1$, phải lập bảng tần số tích lũy (cf) và tìm nhóm đầu tiên thỏa mãn $cf \geq \frac{n}{4}$. Nhiều học sinh nhầm lẫn lấy nhóm có tần số $m_i$ cao nhất thay vì nhóm chứa tích lũy $\frac{n}{4}$ hoặc $\frac{3n}{4}$.
3. **Ý nghĩa so sánh**: Khoảng biến thiên hoặc khoảng tứ phân vị càng nhỏ chứng tỏ chất lượng sản phẩm càng đồng đều, thời gian làm việc càng ổn định.
