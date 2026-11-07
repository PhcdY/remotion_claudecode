# Bài 11. Nguyên hàm
**Môn**: Toán 12 | **Bộ sách**: Kết nối tri thức với cuộc sống (Tập 2) | **Chương IV**: Nguyên hàm và tích phân

---

## 1. Thuật ngữ & Ký hiệu chuẩn SGK 2018
* **Thuật ngữ**: Nguyên hàm, họ các nguyên hàm, hằng số cộng ($C$), bảng nguyên hàm cơ bản, tích phân bất định.
* **Ký hiệu**:
  * Hàm số $F(x)$, $f(x)$ liên tục trên khoảng $K$.
  * Ký hiệu họ nguyên hàm: $\int f(x)\,\mathrm{d}x = F(x) + C$.
  * Vi phân: $\mathrm{d}x$.

---

## 2. Khái niệm cốt lõi & Định lý quan trọng

### A. Khái niệm nguyên hàm
* **Định nghĩa**: Cho hàm số $f(x)$ xác định trên một khoảng hay một đoạn $K$. Hàm số $F(x)$ được gọi là một **nguyên hàm** của hàm số $f(x)$ trên $K$ nếu:
  $$F'(x) = f(x) \quad \forall x \in K$$
* **Định lý về họ các nguyên hàm**:
  * Nếu $F(x)$ là một nguyên hàm của $f(x)$ trên $K$ thì với mỗi hằng số $C$, hàm số $F(x) + C$ cũng là một nguyên hàm của $f(x)$ trên $K$.
  * Ngược lại, mọi nguyên hàm của $f(x)$ trên $K$ đều có dạng $F(x) + C$, với $C$ là hằng số.
  * Ta viết: $\int f(x)\,\mathrm{d}x = F(x) + C$.

### B. Các tính chất cơ bản của nguyên hàm
1. $\left(\int f(x)\,\mathrm{d}x\right)' = f(x)$ và $\int F'(x)\,\mathrm{d}x = F(x) + C$.
2. $\int k f(x)\,\mathrm{d}x = k \int f(x)\,\mathrm{d}x$ ($k$ là hằng số khác $0$).
3. $\int [f(x) \pm g(x)]\,\mathrm{d}x = \int f(x)\,\mathrm{d}x \pm \int g(x)\,\mathrm{d}x$.

### C. Bảng nguyên hàm của các hàm số thường gặp
| Hàm số $f(x)$ | Nguyên hàm $\int f(x)\,\mathrm{d}x$ | Điều kiện |
| :--- | :--- | :--- |
| $0$ | $C$ | |
| $1$ | $x + C$ | |
| $x^\alpha$ | $\frac{x^{\alpha+1}}{\alpha+1} + C$ | $\alpha \neq -1$ |
| $\frac{1}{x}$ | $\ln |x| + C$ | $x \neq 0$ |
| $e^x$ | $e^x + C$ | |
| $a^x$ | $\frac{a^x}{\ln a} + C$ | $0 < a \neq 1$ |
| $\cos x$ | $\sin x + C$ | |
| $\sin x$ | $-\cos x + C$ | |
| $\frac{1}{\cos^2 x}$ | $\tan x + C$ | $x \neq \frac{\pi}{2} + k\pi$ |
| $\frac{1}{\sin^2 x}$ | $-\cot x + C$ | $x \neq k\pi$ |

---

## 3. Tình huống mở đầu & Ví dụ thực tế SGK
* **Tình huống máy bay chạy đà cất cánh**:
  * Một máy bay di chuyển ra đến đường băng và bắt đầu chạy đà. Vận tốc của máy bay tăng dần theo hàm thời gian $v(t) = 5 + 3t$ (m/s).
  * Sau 30 giây chạy đà, máy bay nhấc bánh rời mặt đất. Hỏi quãng đường máy bay đã lăn bánh là bao nhiêu mét?
  * *Bản chất toán học*: Biết $v(t) = S'(t)$, bài toán đòi hỏi tìm hàm vị trí $S(t)$ có đạo hàm bằng $v(t)$, tức là tìm nguyên hàm:
    $$S(t) = \int (5 + 3t)\,\mathrm{d}t = 5t + \frac{3}{2}t^2 + C$$
    Vì tại thời điểm bắt đầu $t = 0$ thì $S(0) = 0 \Rightarrow C = 0$.
    Quãng đường cất cánh: $S(30) = 5(30) + 1{,}5(30)^2 = 1.500\text{ m}$.
* **Tình huống doanh thu biên trong kinh tế**:
  * Doanh thu $R(x)$ từ việc bán linh kiện vi xử lý khi biết tốc độ biến động doanh thu biên $R'(x) = M_R(x) = 300 - 0{,}1x$.

---

## 4. Bẫy tư duy & Lưu ý sư phạm
1. **Bẫy quên hằng số $C$**: Nguyên hàm là một họ vô số hàm số song song với nhau trên trục tung, không bao giờ được quên $+ C$ khi viết kết quả nguyên hàm bất định.
2. **Bẫy nguyên hàm của $\frac{1}{x}$**: BẮT BUỘC có dấu giá trị tuyệt đối $\ln |x| + C$, không được viết $\ln(x) + C$ vì $x$ có thể nhận giá trị âm.
3. **Bẫy dấu trong nguyên hàm lượng giác**: Rất nhiều học sinh nhầm giữa đạo hàm và nguyên hàm:
   * $(\sin x)' = \cos x \Rightarrow \int \cos x\,\mathrm{d}x = \sin x + C$ (không có dấu âm).
   * $(\cos x)' = -\sin x \Rightarrow \int \sin x\,\mathrm{d}x = -\cos x + C$ (có dấu âm).
