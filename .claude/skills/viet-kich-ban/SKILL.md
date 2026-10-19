---
name: viet-kich-ban
description: Viết kịch bản video giải thích bản chất toán (B1 của pipeline) thành src/videos/<slug>/script.json. Dùng khi người dùng đưa một chủ đề toán + ý bản chất muốn nói và cần kịch bản video, hoặc gõ /viet-kich-ban.
---

# B1 — Viết kịch bản video bản chất toán

Pipeline: **B1 kịch bản (skill này)** → B2 audio (skill `tao-audio`) → B3 dựng Remotion.
Output duy nhất của skill này là `src/videos/<slug>/script.json`. Không tạo audio, không viết code Remotion.

## Bối cảnh

- Người xem: học sinh ôn thi **THPTQG, TSA, HSA** (và các kỳ ĐGNL tương tự). Video đăng trên web 9Study.
- Mục tiêu: hiểu **vì sao** công thức/quy tắc đúng, để làm được cả bài lạ, không chỉ bài quen.
- Video ngang 16:9, **2 phút 30 – 3 phút**. Ưu tiên số một là **dễ hiểu**: thà ít ý mà hiểu chắc. Không đủ thời gian giải thích thong thả thì **cắt ý**, không nói nhanh hơn.
- Người xem phải luôn biết **mình đang xem cái gì** và thấy được video gắn với toán đang học, không chỉ "thấy hay" mà mông lung.

## Đầu vào

Người dùng đưa: **chủ đề** + **ý bản chất muốn nói**. Có thể kèm: kỳ thi nhắm tới, độ dài, ghi chú.

Nếu thiếu ý bản chất → đề xuất 2–3 góc bản chất khả dĩ và hỏi chọn, không tự chốt.
Nếu ý bản chất người dùng đưa **sai hoặc thiếu chính xác về toán** → nói rõ chỗ sai và đề xuất cách phát biểu đúng trước khi làm tiếp.

## Quy trình

### Bước 1 — Dàn ý (dừng lại chờ duyệt)
Trình bày ngắn gọn:
- slug (chữ thường không dấu, số, `-`), tiêu đề
- **hiện tượng mở đầu** (yêu cầu 1): mô tả 1–2 câu, **nguồn kiểm chứng** (link/tài liệu), và lời giải sẽ trình bày ở beat `GIẢI ĐÁP`
- danh sách beat: `section` · ý chính 1 câu · hình định dùng
- **đường hiểu**: người xem cần biết gì từ trước (tiền đề) → các bậc hiểu lần lượt → sau video làm được gì (một câu cụ thể, gắn với dạng bài nào)
- ví dụ trực quan / đời thường sẽ dùng, và các điểm hài định cài
- **hàm ví dụ** dùng để nối sang dạng bài (xem yêu cầu 4)
- ước lượng thời lượng
- **những ý đã cắt** và lý do (để người dùng biết, có thể làm video khác). Chủ đề rộng (vd. cả chương) → chọn một ý bản chất cốt lõi, phần còn lại ghi vào đây.

**Chờ người dùng duyệt** rồi mới viết đầy đủ.

### Bước 2 — Viết `script.json`
Theo schema và quy tắc bên dưới, lưu vào `src/videos/<slug>/script.json`.
Nếu file đã tồn tại → hỏi trước khi ghi đè.

### Bước 3 — Tự kiểm tra rồi báo cáo
Chạy hết checklist cuối file. Báo: số beat, số ký tự `speak`, thời lượng ước tính, và **mọi chỗ còn nghi ngờ**.

## Schema

```jsonc
{
  "slug": "dao-ham-tiep-tuyen",
  "title": "Đạo hàm là hệ số góc tiếp tuyến",
  "exams": ["THPTQG", "TSA", "HSA"],      // kỳ thi liên quan
  "beats": [
    {
      "id": "b01",                          // b01, b02, ... liên tục
      "section": "CÂU HỎI",                 // chọn từ danh sách nhãn bên dưới
      "keyword": "Nhưng vì sao?",           // câu chốt của beat, ≤ 6 từ, được dùng $...$ — hiện to trên hình lúc đọc dòng cuối
      "visual": "mô tả hình cụ thể",        // để B3 dựng, xem quy tắc visual
      "lines": [
        { "text": "chữ hiện trên màn hình, toán trong $...$", "speak": "lời đọc, toán viết bằng chữ" }
      ]
    }
  ]
}
```

## Khung nội dung — linh hoạt nhưng có yêu cầu

Thứ tự và số phần tùy chủ đề, nhưng **bắt buộc có**:
1. **Mở bằng một hiện tượng thật chưa có lời giải** (beat `HIỆN TƯỢNG`, ≤ 20 giây):
   - một hiện tượng, ứng dụng hay fun fact trong đời sống/khoa học/công nghệ mà chính ý bản chất của video giải thích được ở mức THPT; nêu thành **câu hỏi** và **giữ đáp án đến cuối video** ("Vì sao…?", "Làm sao… biết được…?");
   - phải **đúng thật**: kiểm bằng nguồn tin cậy, ghi nguồn trong dàn ý. Không bịa, không phóng đại, không gán cho toán một vai trò nó không có trong thực tế (vd. đừng nói "camera bắn tốc độ dùng đạo hàm" nếu thật ra nó đo trung bình hay dùng Doppler). Không tìm được hiện tượng đúng thì báo người dùng, không ép;
   - không mở bằng "Hôm nay chúng ta học…".
2. **Trực giác trước, công thức sau**: công thức chỉ xuất hiện sau khi đã có hình hoặc ví dụ dẫn tới nó.
3. **Ít nhất một hình/ví dụ trực quan** làm lộ ra bản chất (đồ thị, hình học, chuyển động, đếm…).
4. **Liên hệ đề thi bằng một hàm ví dụ cụ thể**, không cần bài tập đầy đủ:
   - Dùng một hàm cụ thể để cho thấy bản chất vừa học giúp đọc/suy ra điều gì trong dạng câu hỏi hay gặp (vd. nhìn đồ thị $f'$ của một hàm → suy ra khoảng đồng biến, cực trị của $f$).
   - Nói rõ *bản chất nào* dẫn tới kết luận, không chỉ nêu kết quả.
   - Không liệt kê nhiều dạng bài trong một câu. Không bịa đề thật, không ghi năm/mã đề.
5. **Kết bằng giải đáp rồi câu chốt**:
   - beat `GIẢI ĐÁP` (gần cuối): quay lại đúng hiện tượng mở đầu (cùng hình), giải nó bằng kiến thức vừa giảng, nói rõ **bước nào dùng ý nào** của video. Người xem phải thấy "à, ra là vì thế" — cảm giác toán dùng được thật;
   - sau đó một câu chốt dễ nhớ (nằm luôn trong `GIẢI ĐÁP` hoặc ở beat `TỔNG KẾT`).
6. **Cầu nối ví dụ → toán**, bắt buộc mỗi khi chuyển từ đời thường sang ký hiệu:
   - đặt tương ứng tường minh trên màn hình, vd. "quãng đường ↔ $f(x)$, thời gian ↔ $x$, vận tốc ↔ $f'(x)$";
   - mỗi ký hiệu mới được giải thích bằng chính ví dụ đó: nó là con số nào, đại lượng nào trong ví dụ;
   - thay số của ví dụ vào công thức, ra đúng kết quả người xem đã thấy trước đó, **rồi** mới phát biểu tổng quát;
   - mỗi beat tối đa một ký hiệu hoặc khái niệm mới.
7. **Tiền đề**: kiến thức cũ cần dùng (vd. giới hạn khi nói về đạo hàm) được nhắc lại ngắn bằng trực giác ngay trước khi dùng. Không giả định người xem nhớ.
8. **Không bỏ qua bản chất toán — định nghĩa phải xuất hiện**:
   - đi từ ví dụ → khái niệm, hoặc khái niệm → ví dụ, nhưng phải **đi tới nơi**: định nghĩa (hoặc định lý, công thức) chính thức hiện trên màn hình với ký hiệu chuẩn, rồi từng phần của nó được gắn lại với ví dụ ("tử số là quãng đường rơi thêm…");
   - không cần nói video thuộc bài nào, lớp mấy; chỉ cần phát biểu toán đúng như học sinh gặp trên lớp để các em nhận ra.
9. **Người xem luôn biết đang xem gì**: khi chuyển sang hình, bảng, công thức hay bước mới, câu đầu của beat nói rõ đó là gì và để làm gì ("Giờ thử rút ngắn khoảng thời gian.", "Đây là định nghĩa đạo hàm."). Không để hình mới hiện lên mà lời đọc chưa giới thiệu.
10. **Chú thích đầy đủ** — xem quy tắc `text` và `visual`. Phép thử: tắt tiếng, chỉ nhìn màn hình, vẫn biết mỗi con số, ký hiệu, hình là gì.

Nên có nếu còn thời lượng: một câu hỏi ngắn để người xem tự nghĩ trước phần kết (hiện câu hỏi, một dòng tạo khoảng lặng như "Thử nghĩ xem.", rồi giải).

Nên có khi phù hợp: lý do học sinh hay hiểu sai (`GỐC RỄ`), bẫy thường gặp.

Nhãn `section` được dùng (viết hoa, chọn theo nội dung):
`HIỆN TƯỢNG` · `CÂU HỎI` · `GỐC RỄ` · `TRỰC GIÁC` · `BẢN CHẤT` · `ĐỊNH NGHĨA` · `CÔNG THỨC` · `VÍ DỤ` · `TRONG ĐỀ THI` · `BẪY THƯỜNG GẶP` · `GIẢI ĐÁP` · `TỔNG KẾT`

Nhãn chủ yếu để cấu trúc kịch bản. Trên video **chỉ** `TRONG ĐỀ THI`, `BẪY THƯỜNG GẶP` và `GIẢI ĐÁP` hiện cho người xem (thẻ mở beat ~1 giây); các nhãn khác không hiện.

## Style — 6 tiêu chí (ưu tiên theo thứ tự khi xung đột)

1. **Bản chất**: mỗi video trả lời được "vì sao". Câu chốt phải là *lý do*, không phải công thức lặp lại.
2. **Dễ hiểu**: học sinh trung bình xem một lần là hiểu. Mỗi beat chỉ một ý mới. Thuật ngữ mới giải thích ngay lần đầu.
3. **Minh họa nhiều**: **beat nào cũng có hình**, không có beat chỉ chữ. Ưu tiên hình *chuyển động/biến đổi* (điểm chạy, đồ thị co giãn, hình tách ghép) hơn hình tĩnh. Chữ trên màn hình chỉ là phụ đề cho hình.
4. **Thực tế**: mở và kết bằng hiện tượng thật (yêu cầu 1, 5); giữa video neo khái niệm vào thứ học sinh đã gặp — đồng hồ tốc độ xe máy, giá trà sữa, pin điện thoại, dốc đường, xếp hàng, lãi ngân hàng… Ví dụ đời thường đi trước, toán đi sau.
5. **Funny**: 1–3 điểm hài mỗi video, đến từ *tình huống hoặc so sánh bất ngờ* (vd. "Tiếp tuyến: đường thẳng chỉ chạm đồ thị một cái rồi đi luôn, không lưu luyến"). Hình có thể góp phần hài (biểu cảm, phóng đại). Không meme theo trend, không chế giễu học sinh, không đùa làm sai lệch toán.
6. **Không lan man, nhưng không vội**:
   - Mỗi beat phải phục vụ ý bản chất. Tự hỏi "bỏ beat này thì người xem có hiểu kém đi không?" — không thì cắt. Không mở bài dài.
   - **Không nhảy cóc**: mọi bước suy luận nói ra thành lời; mọi chỗ chuyển từ ví dụ sang toán có cầu nối (yêu cầu 6).
   - Sau một ý then chốt, được phép thêm một beat "dừng lại": nói lại ý đó bằng lời thường và một hình khác. Đây không tính là nhắc lại thừa.
   - Đặt mình vào chỗ học sinh trung bình xem lần đầu: chỗ nào phải tua lại mới hiểu là chỗ đó đang vội → giải thích chậm lại, và cắt ý khác để bù thời lượng.
   - 2–3 phút chỉ đủ cho **một ý bản chất chính** cùng 1–2 hệ quả của nó. Nhiều hơn là đang nhồi.

Giọng văn:
- **Trung tính, không xưng hô**: không "bạn", "các em", "mình", "chúng ta", "tôi". Dùng câu khẳng định hoặc câu hỏi không chủ ngữ ("Vì sao lại như vậy?"). Hài vẫn được, chỉ không xưng hô.
- Giọng **giảng bài mang tính tài liệu**: điềm tĩnh, rõ ràng, **có nhấn nhá** — như một phim tài liệu khoa học kể cho người đang tò mò, không đều đều. Không dồn dập, không giọng quảng cáo hay quá vui; hài (nếu có) nhẹ và nằm ở hình hoặc so sánh, không ở giọng điệu. Câu ngắn nhưng đủ ý. Không rào đón, không "rất dễ thôi", không cảm thán thừa.
- Thuật ngữ và ký hiệu **theo SGK chương trình 2018** (Kết nối tri thức).
- Không đưa kiến thức ngoài chương trình, trừ khi chỉ để làm rõ trực giác — khi đó nói rõ là "để hiểu", không phải "để thi".

## Quy tắc từng trường

**`text`** (chữ trên màn hình)
- ≤ 12 từ hoặc ≤ ~60 ký tự. Dài hơn thì tách dòng.
- **Mỗi con số đi kèm tên đại lượng và đơn vị** ở lần đầu nhắc trong beat: "vận tốc trung bình: 15 m/s", không phải "tức 15 m/s"; "rơi thêm 15 m", không phải "15".
- **Ký hiệu mới có chú giải** ở dòng nó xuất hiện hoặc dòng kế tiếp: "$s = 5t^2$ ($s$: quãng đường, m; $t$: thời gian, s)". Thiếu chỗ thì chú giải nằm trong `visual` (nhãn cạnh công thức), nhưng không được bỏ.
- Công thức trong `$...$` (KaTeX). Một dòng chỉ chứa công thức thì để nguyên `$...$`.
- 2–4 dòng mỗi beat.

**`speak`** (TTS đọc)
- Nội dung tương đương `text`, đọc tự nhiên; được thêm từ nối cho trôi.
- **Không chứa ký hiệu toán** (`$ \ ^ _ { } = + / ' √`…). Viết bằng chữ:

| Ký hiệu | Đọc |
|---|---|
| $x^2$, $x^3$, $x^n$ | x bình phương, x lập phương, x mũ n |
| $\sqrt{x}$, $\sqrt[3]{x}$ | căn x, căn bậc ba của x |
| $f'(x)$, $f''(x)$ | lần đầu: đạo hàm của f tại x, đạo hàm cấp hai của f; sau khi đã giới thiệu: f phẩy x, f hai phẩy x |
| $x_0$, $a_n$ | x không, a n |
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

- Công thức dài: **diễn giải bằng lời** thay vì đọc từng ký hiệu ("tử là phần f thay đổi, mẫu là phần x thay đổi"). Bắt buộc đọc nguyên công thức thì đọc theo cụm, có dấu phẩy ở ranh giới cụm.

**Viết `speak` cho tai nghe** (quyết định giọng đọc có giống người hay không):
- **Ít chỗ ngắt — mượt hơn nhiều chỗ ngắt.** Mỗi dấu `,` `.` `:` `?` `...` giữa dòng làm giọng dừng ≈ 0,3–0,4 s; một dòng 4–5 giây mà dừng 3 lần là nghe vấp, buồn ngủ. Mỗi dòng **tối đa 2 chỗ ngắt, nên là 1**. Một câu 15–20 từ có một dấu phẩy ở giữa đọc mượt hơn hai câu 7 từ.
- Tối đa ~20 từ mỗi câu; mỗi dòng thường là **một câu**, hai vế nối bằng một dấu phẩy hoặc từ nối ("thì", "nên", "rồi", "tức là") thay cho dấu chấm.
- Dấu phẩy chỉ đặt ở **ranh giới cụm nghĩa lớn nhất** của câu (giữa vế dẫn và vế chốt, sau trạng ngữ dài). Không đặt giữa danh từ và phần bổ nghĩa của nó, không tách số khỏi đơn vị, không tách "đạo hàm" khỏi "của f".
- **Ngắt đúng chỗ cần ngắt**: chỗ ngắt duy nhất của dòng nên rơi ngay trước phần quan trọng nhất (kết quả, kết luận), để tai kịp chờ.
- Không mở câu mới bằng "Và", "Mà", "Còn" ngay sau một câu hỏi trong cùng dòng: giọng sẽ dừng hẳn rồi nhấn mạnh chữ "Và". Gộp thành một câu ("…nhanh bao nhiêu và đo bằng cách nào?").
- Có từ chuyển ý ("Vậy thì", "Nhưng", "Để ý") và câu hỏi tu từ để giọng có nhịp giải thích, nhưng chúng cũng tính là chỗ ngắt.
- Số và đơn vị viết theo cách nói: "bốn mươi ki-lô-mét một giờ", "không phẩy không một giây".
- Đọc nhẩm từng câu: chỗ nào phải lấy hơi giữa một cụm từ là câu quá dài hoặc dấu câu đặt sai.
- **Dấu ba chấm `...` để ngắt rồi nhấn — dùng hiếm**: **tối đa 1 lần mỗi beat**, dành cho điểm nhấn quan trọng nhất của beat (con số kết quả, thuật ngữ mới, câu đùa). Đặt **trước cả một cụm trọn nghĩa** hoặc sau từ chuyển ý: "Tức là... vận tốc trung bình mười lăm mét một giây.", "gọi là... giới hạn". **Không** đặt `...` giữa một cụm chặt: động từ với bổ ngữ ("đo... kiểu gì" ✗), "hết... chín giây" ✗, phó từ với số ("khoảng... bốn mươi" ✗), số với đơn vị.
- **Từ nối đúng chỗ** để các câu dính thành mạch: "Vậy thì", "Nhưng", "Tức là", "Nói cách khác", "Đó là lý do". Câu đầu của một dòng phải nối được với dòng trước.
- Không chèn thẻ điều khiển của engine TTS (như `<break>`): đã thử, Vivibe đọc sai. Nhịp chỉ đến từ dấu câu (`.` `,` `...`) và cách viết.

**`keyword`**: ≤ 6 từ, là điều cần nhớ của beat; không lặp nguyên văn một dòng `text`. B3 hiện nó thành **câu chốt** to trên hình lúc đọc dòng cuối của beat, nên phải là *kết luận* của beat, không phải tên chủ đề (beat hook được phép là câu hỏi).

**`visual`**: mô tả đủ cụ thể để dựng mà không phải đoán:
- hàm số cụ thể, khoảng vẽ trục, toạ độ điểm, giá trị tham số;
- thứ tự xuất hiện / chuyển động gắn với dòng nào ("khi đọc dòng 2: vẽ tiếp tuyến");
- màu ghi theo **vai trò** ("màu nhấn", "màu cảnh báo"), không ghi mã màu — màu do style.md quyết định.
- **chú thích của từng thành phần**, ghi rõ chữ sẽ hiện: trục (tên đại lượng + đơn vị, vd. "trục dọc: quãng đường $s$ (m)"), mỗi điểm/vật (vd. "bóng lúc $t = 1$ s"), mỗi đoạn tô màu hay mũi tên (vd. "vạch tím: quãng rơi thêm 15 m trong 1 s"), tiêu đề bảng ghi đủ đại lượng (vd. "Vận tốc trung bình (m/s)", không chỉ "Trung bình"), công thức kèm chú giải ký hiệu lần đầu.
- vật trùng hoặc quá gần nhau (vd. hai vị trí bóng cách 1,25 m trên thước 20 m) thì ghi cách tách ra (bỏ bớt mốc, hoặc dàn ngang), không để chồng.
- phóng to: mô tả theo kiểu **kính lúp** (hình gốc giữ nguyên, khung soi co dần quanh điểm, ô phóng to bên cạnh có vạch chia), không viết chung chung "zoom vào đồ thị".
- không thêm thẻ/tag trang trí; mọi thứ trên hình phải giúp người xem hiểu ý của beat.
- Mọi số liệu trong visual phải đúng toán (kiểm ở checklist).

## Độ dài

- **2 phút 30 – 3 phút** (tính cả intro/outro), tự cân đối nội dung trong khung này. Ngắn hơn 2:30 là đang vội — thêm giải thích cho chỗ khó, không thêm ý mới.
- Ước lượng theo giọng Vivibe (đo thật 19/10/2026: ≈ 20 ký tự/giây sau khi cắt lặng; 2899 ký tự, 10 beat → video 2:43): nhắm **≈ 2700–3200 ký tự `speak`**. Chỉ để ước lượng: thời lượng thật đo sau B2, lệch khung thì quay lại B1.
- 8–11 beat. `HIỆN TƯỢNG` ≤ 20 giây, `GIẢI ĐÁP` 15–30 giây; không beat nào > 35 giây.
- Vượt khung → cắt ý (ghi vào "những ý đã cắt" ở dàn ý), không rút gọn lời giải thích của ý chính.
- Người dùng yêu cầu độ dài khác → theo người dùng.

## Checklist trước khi báo xong

- [ ] Toán đúng: mọi mệnh đề, công thức, số liệu trong `text` và `visual`. Có tính toán thì **kiểm bằng Python/sympy**, không tính nhẩm.
- [ ] Hình trong `visual` khớp số: điểm thật sự nằm trên đồ thị, hệ số góc đúng, nghiệm đúng…
- [ ] Đủ 10 yêu cầu bắt buộc của khung nội dung.
- [ ] Hiện tượng mở đầu đúng thật, có nguồn; beat `GIẢI ĐÁP` giải đúng hiện tượng đó bằng kiến thức của video, nói rõ bước nào dùng ý nào.
- [ ] Định nghĩa/công thức chính thức có xuất hiện và được gắn lại với ví dụ.
- [ ] Phép thử tắt tiếng: mỗi con số trên màn hình có tên đại lượng + đơn vị, mỗi ký hiệu có chú giải lần đầu, mỗi thành phần trong `visual` có chú thích.
- [ ] Mỗi chỗ chuyển ví dụ → toán có bảng tương ứng trên màn hình và có bước thay số khớp kết quả cũ.
- [ ] Không có chỗ nhảy cóc: đọc lại trong vai học sinh trung bình xem lần đầu. Chỗ nào vội → giải thích chậm lại, cắt ý khác bù.
- [ ] Chỉ một ý bản chất chính; các ý đã cắt được liệt kê trong dàn ý.
- [ ] Beat nào cũng có `visual` là hình thật (không phải "hiện chữ"); có ít nhất 1 ví dụ đời thường và 1–3 điểm hài.
- [ ] Không beat nào thừa (đã thử bỏ từng beat).
- [ ] Không có từ xưng hô.
- [ ] `speak` không còn ký hiệu toán; `text` mỗi dòng ≤ ~60 ký tự.
- [ ] Đọc nhẩm mọi `speak`: không câu nào quá ~20 từ, không dấu phẩy chen giữa cụm nghĩa, ký hiệu lần đầu được đọc theo nghĩa; mỗi dòng ≤ 2 chỗ ngắt (đếm `,` `.` `:` `?` `...` giữa dòng); `...` ≤ 1 lần mỗi beat, không chen giữa cụm chặt; không có "Và/Mà/Còn" mở câu ngay sau câu hỏi.
- [ ] Tổng ký tự `speak` khớp thời lượng đã duyệt ở dàn ý (≈ 2700–3200).
- [ ] JSON hợp lệ; `slug` và `id` chỉ gồm `a-z 0-9 - _`; `id` liên tục.
- [ ] Ký hiệu, thuật ngữ khớp SGK 2018.
