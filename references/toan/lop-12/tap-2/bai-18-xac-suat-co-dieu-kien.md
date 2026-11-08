# Bài 18. Xác suất có điều kiện
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 2) | **Chương VI**: Xác suất có điều kiện

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Biến cố, xác suất có điều kiện, công thức nhân xác suất, biến cố độc lập, bảng dữ liệu thống kê $2 \times 2$.
* **Ký hiệu**:
  * Xác suất có điều kiện của biến cố $A$ khi biết biến cố $B$ đã xảy ra: $P(A \mid B)$.
  * Tích hai biến cố (biến cố giao): $AB$ hoặc $A \cap B$.
  * Biến cố đối: $\overline{A}$.

---

## 2. Khái niệm cốt lõi & Định lý quan trọng

### A. Định nghĩa xác suất có điều kiện
* Cho hai biến cố $A$ và $B$ trong cùng một phép thử, với $P(B) > 0$.
* Xác suất của biến cố $A$ với điều kiện biến cố $B$ đã xảy ra được gọi là **xác suất có điều kiện** của $A$ khi biết $B$, kí hiệu là $P(A \mid B)$.
* **Công thức định nghĩa**:
  $$P(A \mid B) = \frac{P(AB)}{P(B)}$$
  (Nếu các kết quả đồng khả năng: $P(A \mid B) = \frac{n(AB)}{n(B)}$).

### B. Công thức nhân xác suất
* Từ công thức định nghĩa, ta có công thức nhân xác suất cho hai biến cố bất kỳ:
  $$P(AB) = P(B) \cdot P(A \mid B) = P(A) \cdot P(B \mid A)$$
* **Trường hợp hai biến cố độc lập**:
  * Hai biến cố $A$ và $B$ là độc lập khi và chỉ khi:
    $$P(A \mid B) = P(A) \quad \text{hoặc} \quad P(B \mid A) = P(B)$$
  * Khi đó:
    $$P(AB) = P(A) \cdot P(B)$$
  * *Mở rộng SGK*: Nếu $A$ và $B$ độc lập thì các cặp biến cố sau cũng độc lập: $A$ và $\overline{B}$; $\overline{A}$ và $B$; $\overline{A}$ và $\overline{B}$.

### C. Bảng dữ liệu thống kê $2 \times 2$
* Dùng để phân tích mối tương quan thực tế giữa hai yếu tố (ví dụ: thắt dây an toàn vs tử vong do tai nạn; hút thuốc lá vs ung thư phổi).
* Cho phép tính toán trực tiếp xác suất có điều kiện dựa trên tần số quan sát thực tế:
  $$P(A \mid B) = \frac{\text{Số người thỏa mãn cả } A \text{ và } B}{\text{Tổng số người trong nhóm } B}$$

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống Nghịch lý Monty Hall ("Ô cửa bí mật" - Let's Make a Deal)**:
  * Trò chơi truyền hình kinh điển: Có 3 cánh cửa đóng kín. Phía sau 1 cánh cửa là ô tô đắt tiền, 2 cánh cửa còn lại là 2 con lừa.
  * Người chơi chọn ngẫu nhiên Cánh cửa số 1 (xác suất trúng ô tô ban đầu là $1/3$).
  * Người dẫn chương trình (biết rõ ô tô ở đâu) mở tiếp Cánh cửa số 3 ra, cho thấy một con lừa. Sau đó, MC hỏi: "Bạn có muốn đổi sang Cánh cửa số 2 không?".
  * *Bản chất xác suất có điều kiện*:
    * Nếu giữ nguyên cửa 1: xác suất trúng ô tô vẫn chỉ là $\frac{1}{3}$.
    * Nếu **đổi sang cửa 2**: xác suất trúng ô tô tăng vọt lên **$\frac{2}{3}$**!
    * Việc MC mở cửa lừa đã bổ sung thêm thông tin điều kiện, thu hẹp không gian mẫu và dồn toàn bộ xác suất còn lại vào cánh cửa số 2.
* **Tình huống khảo sát thắt dây an toàn trong tai nạn giao thông**:
  * Nghiên cứu trên 577.006 vụ tai nạn giao thông xe ô tô.
  * Tỉ lệ tử vong ở người không thắt dây an toàn cao gấp nhiều lần so với người có thắt dây an toàn khi tính xác suất có điều kiện $P(\text{Tử vong} \mid \text{Không thắt dây})$.

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **BẪY NGUY HIỂM NHẤT: Đảo thứ tự điều kiện**:
   * $P(A \mid B)$ và $P(B \mid A)$ là hai khái niệm hoàn toàn khác biệt!
   * Ví dụ: $P(\text{Trời mưa} \mid \text{Có sấm chớp}) \approx 0{,}9$ (nghe sấm thì khả năng mưa rất cao), nhưng $P(\text{Có sấm chớp} \mid \text{Trời mưa}) \approx 0{,}1$ (mưa lâm râm thì chưa chắc có sấm). Tuyệt đối không được hoán đổi vai trò điều kiện.
2. **Bẫy biến cố độc lập**: Không được nhầm lẫn giữa *hai biến cố độc lập* ($P(AB) = P(A)P(B)$) và *hai biến cố xung khắc* ($A \cap B = \emptyset \Rightarrow P(AB) = 0$).
