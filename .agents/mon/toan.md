# Gói môn — Toán

Đọc kèm skill `viet-kich-ban` (B1), `tao-audio` (B2), `dung-video` (B3). Luật ở đây **thêm vào** luật chung cho video Toán. Chỉ dòng nào trong mục **"Thay luật chung"** mới thay luật chung (skill `viet-kich-ban` › mục 0 › Ba tầng luật).
Bài học đã gặp kèm ngày: `.agents/lessons.md`.

## Thay luật chung
| Luật chung | Gói thay thành | Áp cho | Lý do · ai chốt · ngày |
|---|---|---|---|
| `viet-kich-ban` › Số và đơn vị | mục "Số và đơn vị" dưới đây (mô hình trừu tượng dùng số trơn…) | mọi video Toán | người dùng, 22–23/10/2026 |

## Tư duy kể chuyện & Trải nghiệm người xem (B1)

Không áp dụng một khung bài hay theme cứng nhắc cho mọi video. Tùy thuộc vào bản chất từng bài Toán, tự do lựa chọn góc tiếp cận tự nhiên và hấp dẫn nhất. Kim chỉ nam duy nhất là **trải nghiệm người xem: dễ hiểu, hay, cuốn hút, tạo được cảm giác "wow / à ra thế"**:
- **Góc tiếp cận mở**:
  - *Bài gắn với chuyển động/đo lường* (Đạo hàm, Tích phân, Tối ưu): Hook bằng hiện tượng thực tế, tình huống đời sống sinh động.
  - *Bài trừu tượng/hình học/đại số* (Vectơ, Mặt phẳng Oxyz, Số phức): Hook bằng một bài toán định vị, một câu hỏi tò mò về không gian, hoặc một sự đối xứng/nghịch lý thị giác bất ngờ khiến người xem tự hỏi "tại sao lại như vậy?".
  - *Bài tính chất/định lý*: Hook bằng một bẫy tư duy mà 90% học sinh hay nhầm lẫn để người xem giật mình muốn tìm hiểu gốc rễ.
- **Trực giác đi trước, công thức theo sau**: Để người xem *nhìn thấy* và *hiểu trước bằng mắt*, rồi mới gắn công thức vào như một kết luận hiển nhiên. Không đưa công thức khô khan ra dọa người xem.
- **Nhịp điệu linh hoạt**: Đoạn mở đầu tò mò, đoạn giải thích từng bước mạch lạc không nhảy cóc, đoạn chốt tạo được khoảnh khắc sáng tỏ ("À, hóa ra bản chất nó là thế!").

## Phạm vi kiến thức & Tài liệu tham khảo (B1)

- **Tài liệu tham khảo SGK chuẩn**: Lưu tại `references/toan/lop-<lop>/tap-<tap>/` (ví dụ: `references/toan/lop-12/tap-1/bai-08-bieu-thuc-toa-do-cac-phep-toan-vecto.md`). Khi viết kịch bản, AI BẮT BUỘC tra cứu file bài học tương ứng trong thư mục này trước để nắm vững định nghĩa, hoạt động khám phá, ví dụ và ký hiệu chuẩn SGK.
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
- **Vật thật áp lên hệ trục** (máy bay, tàu, vệ tinh trên Oxy/Oxyz): cứ lấy **toạ độ đẹp, số trơn** (vd. $A(40; 60; 100)$), không giải thích, không nhãn "mô hình". Cần nói độ cao/khoảng cách thật thì nói thẳng bằng đơn vị thật ("cao 10.000 m") ở dòng riêng, **không** dựng quy đổi "(đơn vị: 100 m)" (đã gặp ở `he-truc-toa-do-khong-gian` b08). Luật chung: skill `viet-kich-ban` › Hình và số tượng trưng.

## Đọc ký hiệu (B1 viết `speak`, B2 nghe thử)

Mặc định **nói theo nghĩa, không đọc chữ cái**: "độ cao tại điểm đó", "hàm số", "đạo hàm tại điểm đang xét". Vivibe đọc chữ cái không ổn định, mỗi lần tạo một khác.

Buộc phải đọc chữ cái:
- tên hàm đặt là $f$, viết **"f của x"** (nghe thử 22/10, giọng nữ - c Nhi: tốt nhất). Không đặt tên hàm $h$ (Vivibe đọc "hắc"); buộc dùng thì viết "hát của ích". Chữ cái khác chưa nghe thử → không dùng làm tên hàm;
- ký hiệu có chỉ số viết liền bằng phiên âm + gạch nối: **"ích-không"** ($x_0$);
- **tên điểm ghép (vectơ, đoạn) và dấu phẩy**: phiên âm kiểu giáo viên Việt, nối bằng gạch: **"a-mờ"**, **"bê-nờ"**, **"mờ-nờ"**, **"a-a-phẩy"** ($\vec{AA'}$); chữ đơn cũng phiên âm cho thống nhất ("điểm nờ", "mờ là điểm cuối"); liệt kê đỉnh có phẩy: "a-phẩy, bê-phẩy, xê-phẩy, đê-phẩy". Viết chữ in rời ("A M", "M N", "A A phẩy") → Vivibe đọc kiểu tiếng Anh, lạ tai; "em-nờ", "M-N", "em-en", "A A-phẩy", "a, a phẩy" đều thua (nghe thử 26/10, giọng nữ - c Nhi, video vectơ không gian). Chữ chưa nghe thử (xê, đê, ích, y…) trong tên ghép → nghe thử trước;
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
| $\vec{OM}, \vec{AB}$ | **BẮT BUỘC gạch nối:** véc-tơ ô-mờ, véc-tơ a-bê (CẤM viết rời "vectơ O M" làm Vivibe đọc "O me") |
| $\vec{i}, \vec{j}, \vec{k}$ | véc-tơ i, **véc-tơ di** (CẤM viết "gi" hay "j" bị đọc thành "giây"), véc-tơ ca |
| $M', A'$ | **mờ-phẩy**, **a-phẩy** (CẤM viết "M phẩy" hay "M'" bị đọc thành "êm phẩy") |
| Điểm cuối câu | **BẮT BUỘC phiên âm:** "điểm mờ.", "điểm a." (CẤM để "điểm M." bị nuốt âm) |

Công thức dài: diễn giải bằng lời ("tử là phần độ cao thay đổi, mẫu là phần đi ngang"); buộc đọc nguyên công thức thì đọc theo cụm, dấu phẩy ở ranh giới cụm.
*(Ghi chú: Toàn bộ bảng quy chuẩn trên đã được cài đặt vào `scripts/check_script.py` — nếu vi phạm sẽ báo LỖI ngay lập tức ở B1).*

## Dựng hình (B3)

- Đồ thị vẽ bằng SVG qua `makeScale` (`src/components/plot.tsx`: `Plot`, `Axes`, `FunctionPlot`, `Point`, `Segment`, `TangentLine`, `PlotLabel`, `CurveArrow`); không hardcode pixel cho điểm trên đồ thị.
- Công thức KaTeX (`MathText`, `Tex`), chờ font KaTeX load xong trước khi render.
- Nhãn không đè số trên trục: điểm nằm trên trục che số vạch chia → dời số sang phía kia hoặc ẩn số đó.
- Đã có sẵn: `ZoomInset` (kính lúp), `Drone` (flycam), người chạy/đường chạy/đồng hồ (`ban-chat-dao-ham/parts.tsx`), đồ thị mô hình + cát tuyến + tam giác độ dốc (`ban-chat-dao-ham/graph.tsx`), đồi + đồ thị hai tầng + cột dọc + mũi tên dọc đường cong (`don-dieu/scene.tsx`).
- Bảng xét dấu, bảng biến thiên không dựng; dấu của $f'$ thể hiện bằng tô màu trên đồ thị.
- **Hình không gian** (hình chiếu song song kiểu SGK, mẫu: `vecto-khong-gian/scene.tsx`, hàm `P` 3D → px): chọn góc trục sâu sao cho mọi vectơ/đoạn chính trên hình **lệch hướng cạnh xiên ≥ 20° và cách đỉnh khác ≥ 40px**. Đã gặp 26/10: trục sâu 45°, vectơ dời nghiêng 53° → mũi tên AM gần chồng lên cạnh AD, người xem đọc thành "bay vào sâu", thước đo và nhãn đè tên đỉnh D; đổi trục sâu 30° thì hết. Tên đỉnh đặt phía không có cạnh/giá nào đi qua (tính cả giá kéo dài).
- **Hệ trục toạ độ không gian Oxyz**:
  - Gốc $O$ BẮT BUỘC đặt ở góc Tây Bắc (`prefer: ["sw", "w"]`), vectơ đơn vị $\vec{k}$ đặt ở BÊN PHẢI trục $Oz$ (`x > ox`); trục $Oz$ ngăn giữa, cấm đặt $\vec{k}$ đè $O$.
  - Ba trục toạ độ $Ox, Oy, Oz$ BẮT BUỘC phải đăng ký vào danh sách vật cản bằng `segmentObstacles(PO, P(axisEnd))` để thuật toán `AutoLabels` không bao giờ đẩy nhãn hoặc đường dóng cắt ngang qua trục chính.
  - Khi điểm/vectơ nằm ở phía Đông của $Oz$ (`x > ox`), nhãn tên và toạ độ BẮT BUỘC neo về hướng Đông/Đông Bắc, cấm để `AutoLabels` đẩy nhãn cắt ngang qua trục $Oz$ sang bên trái.
  - **Tách nhãn toạ độ dài và tên ngắn**: Toạ độ chi tiết $\vec{u}_1 = (x_1; y_1; z_1)$ chỉ hiện ở beat giới thiệu toạ độ (`phases: ["b03"]`), sau đó thu gọn thành nhãn tên ngắn $\vec{u}_1$ qua `steps` hoặc `phases` riêng để không chiếm chỗ của các đối tượng khác.
  - Mọi đoạn đi bộ/dời vị trí trong không gian BẮT BUỘC dùng `Arrow` có đầu mũi tên chỉ hướng ($O \to P_x \to M_{floor} \to M$), CẤM dùng đoạn thẳng trơn.
  - Công thức liên hệ $\vec{OM} = x\vec{i} + y\vec{j} + z\vec{k}$ đặt ở góc Đông Bắc của điểm đích (hướng ra ngoài), tránh để trục $Oz$ cắt ngang qua công thức.
  - Khi chuyển từ mô phỏng 2D (Radar Oxy) sang không gian 3D: làm mờ icon máy bay/vật thể lớn, chỉ giữ lại chấm giao điểm toạ độ tinh tế (bán kính 6–7px); nhãn toạ độ $(x; y)$ đặt ở góc Đông Bắc cách điểm $\ge 40\text{px}$ có viền halo.
- **Chuẩn hoá vẽ vectơ (2D & 3D)**:
  - Mọi vectơ trong môn Toán BẮT BUỘC dùng component chuẩn `<Arrow a={start} b={end} t={progress} color={role} />` từ `src/components/space.tsx`. Đầu mũi tên được tính tự động theo vector chỉ phương đơn vị và vector pháp tuyến. TUYỆT ĐỐI CẤM tự vẽ polygon mũi tên hardcode bằng tay (`points={`${tipX},${tipY} ...`}`).
  - Tại một thời điểm **tối đa 2 vectơ sáng cùng lúc** trên màn hình; vectơ cũ mờ dần (≤ 0.3) khi vectơ mới hiện ra.
  - Ký hiệu góc vuông giữa hai vectơ dùng `<RightMark v={p} d1={dir1} d2={dir2} />` từ `space.tsx`.
- **Hoạt hoạ tịnh tiến khi cộng vectơ (Translation Animation)**:
  - Minh hoạ quy tắc tam giác / cộng vectơ / dời vectơ chỉ phương: BẮT BUỘC dùng chuyển động trượt tịnh tiến từ gốc $O$ sang ngọn vectơ thứ nhất bằng `lerp3(origin, target, progress)` (hoặc `lerp`), kèm vệt nét đứt mờ dời vectơ. CẤM làm vectơ hiện đùng một cái tại ngọn với chấm tròn to.
- **Hình chiếu toạ độ 3D bám sát vectơ & không vẽ thừa**:
  - Toạ độ các đoạn gióng nét đứt bắt buộc nội suy trực tiếp từ toạ độ đỉnh vectơ đang xét (`P([x, y, 0])`, `P([x, 0, 0])`...).
  - Chỉ vẽ hình chiếu vuông góc xuống sàn $Oxy$ và đường gióng lên trục tương ứng. CẤM vẽ trọn 12 cạnh khung hộp nếu bài học không nói về thể tích/đường chéo hộp để tránh gây rối mắt.
- **Đồng bộ hướng vật thể chuyển động với vectơ vận tốc**:
  - Máy bay / phi cơ dùng `<Plane>` từ `space.tsx` (hoặc icon SVG chuẩn), góc xoay `deg` BẮT BUỘC phải tính theo hướng của vectơ vận tốc tức thời $\vec{v}$ (`Math.atan2(vy, vx) * 180 / Math.PI`). CẤM để máy bay chúc mũi lên trong khi vectơ vận tốc bay sang phải.
- **Quy chuẩn KaTeX cho Toán trong code TSX**:
  - Mọi chuỗi công thức trong code TSX bắt buộc escape đúng `$\vec{u}$`, `$\overrightarrow{AB}$` (double backslash). Tránh viết `\vec` trong string thường làm rụng thành Vertical Tab `\v` khiến KaTeX hiển thị lỗi `vecu`.
- Vectơ: viết `$\vec{AM}$` trong kịch bản; `Tex` tự đổi tên nhiều chữ sang `\overrightarrow` (mũi tên phủ hết tên như SGK — `\vec` của KaTeX chỉ vẽ mũi tên nhỏ giữa hai chữ).
