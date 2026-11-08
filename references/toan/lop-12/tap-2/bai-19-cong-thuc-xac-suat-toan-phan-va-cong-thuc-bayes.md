# Bài 19. Công thức xác suất toàn phần và công thức Bayes
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 2) | **Chương VI**: Xác suất có điều kiện

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Công thức xác suất toàn phần, công thức Bayes (Thomas Bayes), sơ đồ hình cây (tree diagram), xác suất tiên nghiệm (prior probability), xác suất hậu nghiệm (posterior probability), dương tính giả (false positive), âm tính giả (false negative).
* **Ký hiệu**:
  * Biến cố $A$ và biến cố đối $\overline{A}$ (hệ đầy đủ gồm 2 biến cố: $A \cup \overline{A} = \Omega$ và $A \cap \overline{A} = \emptyset$).
  * Xác suất toàn phần: $P(B)$.
  * Xác suất Bayes: $P(A \mid B)$.

---

## 2. Khái niệm cốt lõi & Hai công thức trụ cột

### A. Công thức xác suất toàn phần
* Cho hai biến cố $A$ và $B$. Khi đó, biến cố $B$ có thể phân tách thành hai trường hợp xung khắc: $B = (B \cap A) \cup (B \cap \overline{A})$.
* Áp dụng quy tắc cộng và nhân xác suất, ta có **Công thức xác suất toàn phần**:
  $$P(B) = P(A) \cdot P(B \mid A) + P(\overline{A}) \cdot P(B \mid \overline{A})$$
* **Ý nghĩa & Phương pháp sơ đồ hình cây**:
  * Mỗi đường đi từ gốc đến ngọn của cây xác suất biểu diễn một kịch bản khả dĩ.
  * Xác suất của một nhánh là tích các xác suất trên nhánh đó.
  * Xác suất của biến cố mục tiêu $B$ là tổng các tích xác suất của tất cả các nhánh dẫn tới $B$.

### B. Công thức Bayes
* Cho hai biến cố $A$ và $B$ với $P(B) > 0$. Khi đó:
  $$P(A \mid B) = \frac{P(AB)}{P(B)} = \frac{P(A) \cdot P(B \mid A)}{P(A) \cdot P(B \mid A) + P(\overline{A}) \cdot P(B \mid \overline{A})}$$
* **Ý nghĩa triết học & Bản chất**:
  * $P(A)$ là **xác suất tiên nghiệm** (niềm tin hoặc tỉ lệ nền tảng ban đầu về biến cố $A$).
  * Khi biến cố $B$ xảy ra (ta nhận thêm một bằng chứng hoặc một kết quả xét nghiệm mới), công thức Bayes cho phép "cập nhật" niềm tin đó thành **xác suất hậu nghiệm** $P(A \mid B)$.
  * Đây là nền tảng cốt lõi của Trí tuệ Nhân tạo (Machine Learning), bộ lọc thư rác (Spam Filter) và chẩn đoán y khoa hiện đại.

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống hoảng loạn vì xét nghiệm y khoa dương tính**:
  * Ông M đi xét nghiệm một căn bệnh hiểm nghèo $X$ hiếm gặp (tỉ lệ mắc bệnh trong cộng đồng chỉ là $0{,}1\%$, tức $P(A) = 0{,}001$).
  * Độ chính xác của xét nghiệm rất cao:
    * Người có bệnh xét nghiệm dương tính đạt $95\%$ ($P(B \mid A) = 0{,}95$).
    * Người không có bệnh bị dương tính giả là $1\%$ ($P(B \mid \overline{A}) = 0{,}01$).
  * Khi nhận kết quả **Dương tính**, ông M hoảng loạn vì nghĩ mình có tới $95\%$ nguy cơ mắc bệnh hiểm nghèo!
  * *Bản chất toán học qua công thức Bayes*:
    * Xác suất toàn phần có kết quả dương tính:
      $$P(B) = 0{,}001 \times 0{,}95 + 0{,}999 \times 0{,}01 = 0{,}00095 + 0{,}00999 = 0{,}01094$$
    * Xác suất thực sự mắc bệnh khi đã dương tính:
      $$P(A \mid B) = \frac{0{,}00095}{0{,}01094} \approx 8{,}68\%!$$
    * *Kết luận gây chấn động*: Dù xét nghiệm dương tính, khả năng ông M thực sự mắc bệnh chỉ chưa đầy $9\%$, vì căn bệnh quá hiếm nên số ca dương tính giả từ đám đông áp đảo hoàn toàn số ca bệnh thật!
* **Tình huống bán vé buổi biểu diễn ca nhạc ngoài trời**:
  * Xác suất trời mưa $P(A) = 0{,}75$. Nếu không mưa bán hết vé với xác suất $0{,}9$; nếu mưa chỉ bán hết vé với xác suất $0{,}4$. Tính xác suất bán hết vé bằng công thức xác suất toàn phần.
* **Tình huống di truyền học Mendel**:
  * Xác định kiểu gene hạt trơn/hạt nhăn của cây con lai F1 trong quần thể đậu Hà Lan.

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **BẪY NGUY HIỂM: Nhầm lẫn độ nhạy xét nghiệm $P(B \mid A)$ với xác suất mắc bệnh $P(A \mid B)$**:
   * Đây là nghịch lý tâm lý phổ biến nhất của con người (Base rate fallacy - Bỏ qua tỉ lệ nền). Bác sĩ và bệnh nhân thường nhầm rằng máy xét nghiệm chính xác $95\%$ đồng nghĩa với việc người dương tính có $95\%$ mắc bệnh. Công thức Bayes lật ngược lại định kiến này.
2. **Bẫy tổng xác suất của hệ đầy đủ**: Luôn kiểm tra $P(A) + P(\overline{A}) = 1$ và $P(B \mid A) + P(\overline{B} \mid A) = 1$. Tuy nhiên, $P(B \mid A) + P(B \mid \overline{A})$ **không nhất thiết** bằng $1$.
