# Gói môn — Toán

Đọc kèm skill `viet-kich-ban` (B1), `tao-audio` (B2), `dung-video` (B3). Luật ở đây **thêm vào hoặc thay** luật chung cho video Toán.
Bài học đã gặp kèm ngày: `.claude/lessons.md`.

## Phạm vi kiến thức (B1)

- Thuật ngữ và ký hiệu theo **SGK chương trình 2018 (Kết nối tri thức)**. Không cần nói video thuộc bài nào, lớp mấy.
- **Không dùng kiến thức ngoài chương trình THPT, kể cả "để hiểu"** (vd. định lý Lagrange để giải thích vì sao $f'>0$ thì đồng biến). Định lý SGK thừa nhận không chứng minh thì cho trực giác bằng công cụ trong chương trình và nói rõ đó là trực giác.
- **Nối bản chất với công thức học sinh nhớ**, không chỉ với hình: học sinh nhớ $\lim \frac{f(x)-f(x_0)}{x-x_0}$, không nhớ "độ dốc". Công thức đó hiện trên màn hình làm mốc; hình độ dốc đi kèm.
- **Công cụ của bài khác** (bảng xét dấu, bảng biến thiên, quy tắc tính đạo hàm…): không dạy cách làm, chỉ nói kết quả ("giải ra thì đạo hàm âm trên khoảng này") và cho thấy kết quả trên hình (tô màu trên đồ thị).

## Mẫu dựng khái niệm (B1 + B3)

- **Định nghĩa đạo hàm, từ thành phần đến kết quả**, mỗi bước ít nhất một dòng: $x_0$ = một điểm trên trục ngang → $f(x_0)$ = **cột dọc** từ trục lên đồ thị (kèm số; dòng riêng "$f(5) = 25$ nghĩa là…") → $x$ = điểm thứ hai → $f(x)$ = cột dọc thứ hai → $f(x)-f(x_0)$: kẻ ngang từ đỉnh cột thấp, phần chênh ở đầu cột cao sáng lên → $x-x_0$ = khoảng giữa hai chân cột → thương = độ dốc cát tuyến → $\lim$: cho $x$ trượt về $x_0$. Không vẽ đoạn $f(x)-f(x_0)$ "giữa trời".
- **Cát tuyến**: hai điểm sáng lên trước, rồi đường qua chúng. **Độ dốc**: tam giác ngang–dọc có số (ngang 1, lên 11 → 11 mỗi đơn vị).
- **Tiếp tuyến, giới hạn, "rất gần" → kính lúp** (`ZoomInset`): hình gốc giữ nguyên, khung soi co dần quanh điểm, ô phóng cố định nối bằng hai đường dẫn, trong ô có lưới + vạch chia có số đổi theo mức phóng (2 → 2,1 → 2,01), mức phóng ghi sát ô. Không zoom bằng cách đổi miền vẽ mà bỏ trục.
- **Đồng biến / nghịch biến**: so sánh hai điểm trên hình (điểm sau cao hơn điểm trước), không chỉ đọc định nghĩa.
- **Một số → một hàm**: $f'(x_0)$ là một số; đồ thị $f'$ là hàm mới → dòng "làm phép đo đó tại mọi điểm, chấm lại → được hàm $f'$", cho thấy trên ví dụ đã có (vd. với $s=t^2$: 2, 4, 6… chấm thành $v=2t$).
- **Giá trị âm, đổi dấu**: "vận tốc âm = chạy lùi" cho thấy bằng nhân vật quay mặt, đi ngược, ở dòng riêng trước khi suy ra "$f$ giảm".
- **Từ $f'$ sang $f$ phải có hình**: hai tầng, $f$ trên, $f'$ dưới, cùng tỉ lệ trục ngang, thẳng hàng dọc; mỗi khoảng: đoạn $f'$ trên/dưới trục và đoạn $f$ tương ứng sáng cùng màu (leo/hạ), trên đoạn $f$ hai điểm so sánh. Người dùng đã khen bố cục này (22/10). Không cắt bước này để bù thời lượng.
- **Nhân vật do hàm điều khiển**: vị trí = $f(x)$ (qua `makeScale`), tốc độ tỉ lệ $f'$, $f'=0$ → đứng yên, $f'$ đổi dấu → quay đầu; $f'$ chạm trục không đổi dấu → dừng mà không quay đầu.

### Mẫu chuỗi "vì sao" đã được chốt

Video `don-dieu` b06–b07 (`lineGap` 0,5) — vì sao $f'>0$ thì đi lên. Mỗi dòng một mắt xích, dấu (+)/(−) sáng trên công thức và trong kính lúp cùng lúc:

| Dòng | Lời đọc |
|---|---|
| b06·1 | Vậy vì sao đạo hàm dương thì đường đi lên? |
| b06·2 | Nhắc lại bài trước, đạo hàm là giới hạn của phân số này. |
| b06·3 | Tử là độ cao chênh lệch giữa hai điểm. |
| b06·4 | Mẫu là khoảng cách theo chiều ngang giữa hai điểm. |
| b06·5 | Đạo hàm dương, nên khi hai điểm đủ sát nhau thì phân số này cũng dương. |
| b07·1–2 | Giờ lấy điểm thứ hai ở ngay bên phải. / Đi sang phải thì mẫu dương. |
| b07·3–4 | Phân số dương mà mẫu dương, nên tử cũng phải dương. / Tử dương nghĩa là điểm bên phải cao hơn. |
| b07·5–7 | Còn điểm ở ngay bên trái thì sao? / Đi sang trái thì mẫu âm, nên tử cũng âm. / Tử âm nghĩa là điểm bên trái thấp hơn. |
| b07·8 | Bên trái thấp và bên phải cao, vậy tại đó đường đang đi lên. |

Đã bị loại: gói cả chuỗi trong 3 dòng ("nói nhanh quá, chỉ nêu ra"); "đạo hàm bằng 3 nên sang phải 0,1 lên 0,3" (không nối với công thức).

## Số và đơn vị (thay luật chung ở điểm sau)

- **Mô hình trừu tượng** (đồ thị $f(x) = -x^3 + 6x^2 - \dots$ không gắn vật thật) → **số trơn**, trục chỉ ghi ký hiệu/tên đại lượng ("$x$", "độ cao $f(x)$").
- **Mô hình của một vật thật** (người chạy, flycam) → được gắn đơn vị **khi số của mô hình hợp lý với đơn vị thật** (flycam cao 22 m, người chạy 10 m trong 2 s). Ghi đơn vị **một lần, kiểu SGK**: "($t$ tính bằng giây, $s$ tính bằng mét)" cạnh công thức, hoặc ở tên trục "$t$ (s)". Số của mô hình không hợp với đơn vị nào quen thuộc → số trơn, không bịa đơn vị.
- **Không bao giờ** dùng bội số tự chế ("trăm m", "chục mét") hay đổi đơn vị chỉ để số đẹp. Đã gặp (22/10): "$x$ (km), $f(x)$ (trăm m)" → người dùng: ngoài đời không ai dùng thế.

## Đọc ký hiệu (B1 viết `speak`, B2 nghe thử)

Mặc định **nói theo nghĩa, không đọc chữ cái**: "độ cao tại điểm đó", "hàm số", "đạo hàm tại điểm đang xét". Vivibe đọc chữ cái không ổn định, mỗi lần tạo một khác.

Buộc phải đọc chữ cái:
- tên hàm đặt là $f$, viết **"f của x"** (nghe thử 22/10, giọng nữ - c Nhi: tốt nhất). Không đặt tên hàm $h$ (Vivibe đọc "hắc"); buộc dùng thì viết "hát của ích". Chữ cái khác chưa nghe thử → không dùng làm tên hàm;
- ký hiệu có chỉ số viết liền bằng phiên âm + gạch nối: **"ích-không"** ($x_0$);
- **chữ "x" không đứng cuối câu** (ngay trước `.` `?`): giọng nữ - c Nhi đọc "x" cuối câu lệch thành "xích" (26/10, "trùng khít đường y bằng x."). Đảo để sau "x" còn một từ: "đường y bằng x trùng khít đồ thị.";
- **không dùng cụm lạ, ít gặp khi nói** như "vị trí ngang": Vivibe đọc lỗi chữ "ngang" trong cụm này (26/10), trong khi "trục ngang", "nằm ngang", "tiệm cận ngang" đọc đúng. Nói bằng cụm quen: "điểm ngay bên dưới", "cùng chỗ trên trục ngang";
- **cụm chứa chữ "không" đứng cuối vế**, ngay sau là `,` `.` `?` hoặc một danh từ — "không" dính sang động từ sau nghe thành phủ định ("ích-không ứng với" → "không ứng"). Viết "Tại ích-không, đạo hàm bằng mười." (đã nghe đúng 20/10). Cũng áp dụng cho số "không";
- dòng nào đọc chữ cái/ký hiệu → thêm `caption` (phụ đề viết bằng ký hiệu thường, vd. "Tại x₀, đạo hàm bằng 10.") và liệt kê trong báo cáo để B2 nghe thử.

| Ký hiệu | Đọc (khi buộc phải đọc) |
|---|---|
| $x^2$, $x^3$, $x^n$ | x bình phương, x lập phương, x mũ n |
| $\sqrt{x}$, $\sqrt[3]{x}$ | căn x, căn bậc ba của x |
| $f'(x)$, $f''(x)$ | đạo hàm (tại điểm đó), đạo hàm cấp hai — ưu tiên hơn "f phẩy x" |
| $x_0$, $a_n$ | ích-không, a-n (đặt cuối vế) |
| $\frac{a}{b}$ | a trên b |
| $\log_a b$, $\ln x$ | lô-ga-rít cơ số a của b, lốc nê x |
| $e^x$ | e mũ x |
| $\sin, \cos, \tan, \cot$ | sin, côsin, tang, côtang |
| $\lim_{x \to a}$ | giới hạn khi x dần tới a |
| $\int_a^b$ | tích phân từ a đến b |
| $\geq, \leq, \neq$ | lớn hơn hoặc bằng, nhỏ hơn hoặc bằng, khác |
| $\Delta, \pi, \infty$ | đen-ta, pi, vô cực |
| $(a; b)$ | khoảng a, b |
| $-3$ | âm ba |

Công thức dài: diễn giải bằng lời ("tử là phần độ cao thay đổi, mẫu là phần đi ngang"); buộc đọc nguyên công thức thì đọc theo cụm, dấu phẩy ở ranh giới cụm.

## Dựng hình (B3)

- Đồ thị vẽ bằng SVG qua `makeScale` (`src/components/plot.tsx`: `Plot`, `Axes`, `FunctionPlot`, `Point`, `Segment`, `TangentLine`, `PlotLabel`, `CurveArrow`); không hardcode pixel cho điểm trên đồ thị.
- Công thức KaTeX (`MathText`, `Tex`), chờ font KaTeX load xong trước khi render.
- Nhãn không đè số trên trục: điểm nằm trên trục che số vạch chia → dời số sang phía kia hoặc ẩn số đó.
- Đã có sẵn: `ZoomInset` (kính lúp), `Drone` (flycam), người chạy/đường chạy/đồng hồ (`ban-chat-dao-ham/parts.tsx`), đồ thị mô hình + cát tuyến + tam giác độ dốc (`ban-chat-dao-ham/graph.tsx`), đồi + đồ thị hai tầng + cột dọc + mũi tên dọc đường cong (`don-dieu/scene.tsx`).
- Bảng xét dấu, bảng biến thiên không dựng; dấu của $f'$ thể hiện bằng tô màu trên đồ thị.
