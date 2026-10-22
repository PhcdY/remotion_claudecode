---
name: viet-kich-ban
description: Viết kịch bản video giải thích bản chất toán (B1 của pipeline) thành src/videos/<slug>/script.json. Dùng khi người dùng đưa một chủ đề toán + ý bản chất muốn nói và cần kịch bản video, hoặc gõ /viet-kich-ban.
---

# B1 — Viết kịch bản video bản chất toán

Pipeline: **B1 kịch bản (skill này)** → B2 audio (skill `tao-audio`) → B3 dựng Remotion (skill `dung-video`).
Output duy nhất của skill này là `src/videos/<slug>/script.json`. Không tạo audio, không viết code Remotion.

Các quy tắc dưới đây phần lớn rút từ góp ý thật (ghi "đã gặp" kèm ngày). Lịch sử đầy đủ: `src/videos/*/FEEDBACK.md`.

## Bối cảnh

- Người xem: học sinh ôn thi **THPTQG, TSA, HSA** (và các kỳ ĐGNL tương tự). Video đăng trên web 9Study.
- Mục tiêu: hiểu **vì sao** công thức/quy tắc đúng, để làm được cả bài lạ, không chỉ bài quen.
- Video ngang 16:9, **2 phút 30 – 4 phút**. Ưu tiên số một là **dễ hiểu**: người xem không bị lạc, lúc nào cũng biết hình đang nói gì và vì sao. Thời lượng là hệ quả: bước khó cần thêm thời gian thì thêm; vẫn không đủ thì **cắt ý phụ**, không nói nhanh hơn, không rút gọn lời giải thích.
- **Không nhảy bước — điều kiện tiên quyết.** Mỗi bước chỉ dựa trên những thứ người xem *đã* hiểu. Ký hiệu, hình, khái niệm nào cũng phải được giải thích riêng và người xem có thời gian nhìn nó trước khi đem ghép. Nhảy một bước là người xem mất dấu tới hết video.
- Người xem phải luôn biết **mình đang xem cái gì** và thấy video gắn với toán đang học, không chỉ "thấy hay" mà mông lung.

## Đầu vào

Người dùng đưa: **chủ đề** + **ý bản chất muốn nói**. Có thể kèm: kỳ thi nhắm tới, độ dài, ghi chú.

- Thiếu ý bản chất → đề xuất 2–3 góc bản chất khả dĩ và hỏi chọn, không tự chốt.
- Ý bản chất **sai hoặc thiếu chính xác về toán** → nói rõ chỗ sai, đề xuất cách phát biểu đúng trước khi làm tiếp.
- Video nằm trong một chuỗi (vd. đạo hàm → đơn điệu → cực trị) → xác định **bài trước đã dạy gì** (đọc `script.json` của video trước nếu có) và **ý nào để dành bài sau**. Hai thứ này quyết định cái gì chỉ được nhắc một dòng, cái gì phải dạy (yêu cầu 7).

## Quy trình

### Bước 1 — Dàn ý (dừng lại chờ duyệt)

Phần lớn lỗi người dùng bắt được là **lỗi dàn ý** (hiện tượng sai bậc khái niệm, toán không cần thiết, giảng lại bài trước, dạy công cụ bài khác, phần "vì sao" quá nhanh, phần đề thi nhảy bước). Viết xong lời rồi mới phát hiện thì phải làm lại cả B1–B3. Vì vậy dàn ý phải bày ra đủ các mục dưới đây để người dùng bắt lỗi ngay:

1. **slug** (chữ thường không dấu, số, `-`), **tiêu đề**.
2. **Vị trí trong chuỗi**: bài trước đã dạy gì (chỉ nhắc một dòng) · khái niệm mới của video này · ý để dành bài sau.
3. **Hiện tượng mở đầu** (yêu cầu 1): mô tả 1–2 câu, **nguồn kiểm chứng**, đáp án cụ thể sẽ đưa ra ở `GIẢI ĐÁP`, và **kết quả ba phép thử** của yêu cầu 1 (đúng bậc khái niệm · toán cần thiết · đại lượng hiển nhiên), mỗi phép thử một câu.
4. **Ví dụ xuyên suốt** (yêu cầu 11) và danh sách **cảnh** (≤ ~3): cảnh sau nối từ cảnh trước bằng bước nào, có đổi sang mô hình không, beat nào dành cho việc đó; các điểm hài định cài.
5. **Đường hiểu**: tiền đề → các bậc hiểu lần lượt, **không bỏ bậc nào** → sau video làm được gì (một câu cụ thể, gắn với dạng bài nào). Đánh dấu các **bước khó**.
6. **Chuỗi "vì sao"** (phần "Câu trả lời vì sao" bên dưới): viết ra từng mắt xích, mỗi mắt xích sẽ thành một dòng, xuất phát từ công thức học sinh nhớ.
7. **Giải phẫu công thức trên hình** (yêu cầu 8): cụm ký hiệu nào ↔ thứ gì trên hình.
8. **Phần đề thi** (yêu cầu 4): có hay không (video chỉ nêu bản chất → không, ghi lý do); nếu có: hàm ví dụ, và các bước cầu sẽ có (một số → một hàm, đổi hàm, giá trị âm, từ $f'$ sang $f$ có hình).
9. **Danh sách beat**: `section` · ý chính 1 câu · hình định dùng.
10. **Ước lượng thời lượng**; **những ý đã cắt** và lý do (chủ đề rộng → chọn một ý cốt lõi, phần còn lại ghi vào đây).

**Chờ người dùng duyệt** rồi mới viết đầy đủ. Người dùng bảo làm luôn ("làm đi", "cho xem demo") → được bỏ bước chờ, nhưng vẫn viết dàn ý ra trước (đầu báo cáo) và đi theo nó.

### Bước 2 — Viết `script.json`

Theo schema và quy tắc bên dưới, lưu vào `src/videos/<slug>/script.json`. File đã tồn tại → hỏi trước khi ghi đè.

**Sửa một phần kịch bản** (vd. viết lại phần giữa theo góp ý) → beat giữ nguyên cũng phải **rà lại theo quy tắc hiện tại** và theo những gì các beat mới đã (hoặc chưa) dạy. Đã gặp (20/10): viết lại b03–b13 nhưng giữ phần đề thi cũ, phần này dùng "đồ thị $f'$" và "vận tốc âm" mà phần mới chưa hề dạy.

**Rút thời lượng** → cắt ý phụ, không cắt bước giải thích của ý chính, không cắt hình so sánh ($f'$ → $f$, so sánh hai điểm…). Đã gặp (22/10): cắt dòng "vẽ con đường thật để đối chiếu" → người dùng: "đồng biến cụ thể là như nào, so sánh đi chứ".

### Bước 3 — Tự kiểm tra rồi báo cáo

Chạy hết checklist cuối file. Báo: số beat, số ký tự `speak`, thời lượng ước tính, **danh sách dòng có đọc ký hiệu/chữ cái** (để B2 nghe thử) và **mọi chỗ còn nghi ngờ**.

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
      "speed": 1.0,                         // TUỲ CHỌN, gần như không dùng: tốc độ đọc riêng của beat — chỉ khi người dùng yêu cầu rõ
      "lineGap": 0.5,                       // TUỲ CHỌN: nghỉ giữa các dòng của beat, giây (mặc định 0,25) — cho chuỗi "vì sao"
      "lines": [
        { "text": "chữ hiện trên màn hình, toán trong $...$", "speak": "lời đọc, toán viết bằng chữ" }
      ]
    }
  ]
}
```

`lineGap` (≤ 0,5) chỉ dùng cho **beat khó nhất** (chuỗi "vì sao") để mỗi bước có nhịp dừng. **Không dùng `speed` để làm chậm đoạn giải thích**: đã thử `speed: 0.85` (22/10) → "trời ơi đừng thay đổi tốc độ nói thuần, cần thay đổi nhịp, giải thích nhanh quá thì tìm cách giải thích chậm lại chứ không phải cùng một câu nói rề rà". Không dùng `lineGap` để kéo dài video cho đủ thời lượng.

## Khung nội dung — linh hoạt nhưng có yêu cầu

Thứ tự và số phần tuỳ chủ đề, nhưng **bắt buộc có** (số thứ tự được skill khác dẫn tới, giữ nguyên):

1. **Mở bằng một hiện tượng thật chưa có lời giải** (beat `HIỆN TƯỢNG`, ≤ 20 giây):
   - một hiện tượng, ứng dụng hay fun fact trong đời sống/khoa học/công nghệ mà chính ý bản chất của video giải thích được ở mức THPT; nêu thành **câu hỏi** và **giữ đáp án đến cuối video** ("Vì sao…?", "Làm sao… biết được…?");
   - phải **đúng thật**: kiểm bằng nguồn tin cậy, ghi nguồn trong dàn ý. Không bịa, không phóng đại, không gán cho toán vai trò nó không có trong thực tế (vd. đừng nói "camera bắn tốc độ dùng đạo hàm" nếu thật ra nó đo trung bình hay dùng Doppler). Không tìm được hiện tượng đúng thì báo người dùng, không ép;
   - qua đủ **ba phép thử** (ghi kết quả vào dàn ý):
     - **Đúng bậc khái niệm**: câu hỏi nằm đúng ở khái niệm đang dạy, không ở bậc trên. Phép thử: lời giải có phải nói "đạo hàm đang tăng/giảm" (tức đạo hàm bậc hai) trong khi video chỉ dạy dấu $f'$ không? Có → đổi. Đã gặp (22/10): dân số Việt Nam "tốc độ tăng giảm dần mà vẫn tăng" → người dùng thấy lẫn đạo hàm với đạo hàm bậc hai.
     - **Toán cần thiết**: bỏ toán của video đi, người xem có tự trả lời được bằng lẽ thường không? Còn → đổi. Đã gặp (22/10): "cắm sạc mà pin vẫn tụt" → "vì tiêu nhiều hơn nạp", người xem thấy "chả liên quan".
     - **Đại lượng hiển nhiên là đạo hàm**: đại lượng gán cho $f'$ phải là độ dốc đồ thị của chính đại lượng đó, đo được trực tiếp, không phải đi qua một định luật chưa dạy. Đã gặp (22/10): "$P'$ = nạp − tiêu" (đúng nhờ bảo toàn năng lượng) → "$P'$ đâu phải nạp − tiêu".
   - không mở bằng "Hôm nay chúng ta học…".
2. **Trực giác trước, công thức sau**: công thức chỉ xuất hiện sau khi đã có hình hoặc ví dụ dẫn tới nó (trừ công thức bài trước, hiện ngay làm mốc — yêu cầu 7).
3. **Ít nhất một hình/ví dụ trực quan** làm lộ ra bản chất (đồ thị, hình học, chuyển động, đếm…).
4. **Liên hệ đề thi bằng một hàm ví dụ cụ thể**, không cần bài tập đầy đủ — **chỉ khi dạng bài dùng đúng khái niệm của video**:
   - **video chỉ nêu bản chất một khái niệm** (vd. "đạo hàm thật ra đo cái gì") → **không có phần đề thi**: đi thẳng từ công thức sang `GIẢI ĐÁP`. Không mượn dạng bài của bài khác (cực trị, đơn điệu…) chỉ để có phần đề thi — đó là dạy công cụ bài khác. Dàn ý mục 8 ghi "không có phần đề thi" + lý do. Đã gặp (22/10): video bản chất đạo hàm có b14–b15 đọc đồ thị $f'$ → cực trị, người dùng bảo xoá vì video chỉ để nêu bản chất;
   - dùng một hàm cụ thể để cho thấy bản chất vừa học giúp đọc/suy ra điều gì trong dạng câu hỏi hay gặp (vd. nhìn đồ thị $f'$ → suy ra khoảng đồng biến, cực trị của $f$); nói rõ *bản chất nào* dẫn tới kết luận;
   - **vẫn trong ví dụ xuyên suốt** (yêu cầu 11): dạng bài kể lại bằng chính nhân vật/vật của video ("đồ thị $f'$" = vận tốc của người chạy, "$f$ đổi chiều biến thiên" = người chạy quay đầu). Hình đồ thị và hình ví dụ hiện cùng lúc, chuyển động của nhân vật do hàm điều khiển;
   - **chuyển sang phần đề thi là một bước khó.** Phần này hay dùng thứ phần trước chưa dạy; mỗi thứ cần dòng (hoặc beat) riêng trước khi dùng:
     - **từ một con số sang một hàm**: phần trước thường chỉ dạy $f'(x_0)$ là *một số*. Đồ thị $f'$ là hàm mới → cần bước "làm phép đo đó tại mọi thời điểm, ghi lại → được một hàm mới, gọi là $f'$", cho thấy trên chính ví dụ đã có (vd. với $s=t^2$: vận tốc lúc 1 s, 2 s, 3 s… chấm thành đồ thị $v = 2t$);
     - **đổi hàm** (đề dùng hàm khác ví dụ chính) = đổi mô hình: nói rõ "giờ là một người chạy khác / một đề bài";
     - **giá trị âm, đổi dấu**: "vận tốc âm nghĩa là chạy lùi" phải được cho thấy (nhân vật quay mặt, đi ngược) ở dòng riêng trước khi suy ra "$f$ giảm";
     - **từ $f'$ sang $f$ phải có hình, so sánh cụ thể**: đọc dấu $f'$ xong thì vẽ $f$ (hoặc cho nhân vật chạy) ngay cạnh, từng khoảng: $f'$ trên trục ↔ đoạn $f$ đi lên (chỉ hai điểm: sau cao hơn trước), dưới trục ↔ đi xuống. Bố cục hai tầng $f$ trên, $f'$ dưới, cùng trục ngang (người dùng đã khen, 22/10). Không chỉ đọc "đồng biến trên…" bằng lời, **không cắt bước này để bù thời lượng**;
   - không liệt kê nhiều dạng bài trong một câu. Không bịa đề thật, không ghi năm/mã đề.
5. **Kết bằng giải đáp rồi câu chốt**:
   - beat `GIẢI ĐÁP` (gần cuối): quay lại đúng hiện tượng mở đầu (cùng hình), giải nó bằng kiến thức vừa giảng, nói rõ **bước nào dùng ý nào** của video — người xem thấy "à, ra là vì thế";
   - **trả lời thẳng câu hỏi mở đầu bằng một đáp án cụ thể**: hỏi "nhanh bao nhiêu?" thì kết bằng con số thật (có nguồn), rồi gọi tên nó bằng toán vừa học ("con số đó chính là đạo hàm $s'(t)$"). Không kết bằng giải thích chung chung;
   - số liệu mở và kết **nhất quán** (vd. vận tốc trung bình một đoạn không lớn hơn tốc độ tức thời lớn nhất). Hai nguồn lệch → chọn số không mâu thuẫn hoặc bỏ bớt, báo người dùng;
   - **kết phải nghe như kết**: dòng cuối là câu kết luận ngắn (≤ ~15 từ), khẳng định, mở bằng từ khép lại ("Vậy…", "Nói gọn lại…", "Đó là lý do…"), đáp lại đúng câu hỏi mở đầu. Không thêm ý mới, không câu hỏi, không "tiếp theo", không bỏ lửng. Có thể dùng `...` trước cụm chốt;
   - **ý để dành bài sau** (vd. $f'=0$ trong video đơn điệu → cực trị): nói qua trong một beat ngắn (≤ ~15 giây) **trước** phần đề thi/giải đáp, ngay chỗ nó tự xuất hiện trên hình (điểm $f'$ chạm trục trên đồ thị), chỉ nêu hiện tượng trên hình + tên gọi, rồi một câu "bài sau sẽ nói rõ". Không giải thích dở dang, không đặt ở dòng cuối video;
   - sau đó một câu chốt dễ nhớ (trong `GIẢI ĐÁP` hoặc beat `TỔNG KẾT`) — chính là câu kết luận ở trên nếu gọn được.
6. **Cầu nối ví dụ → toán**, bắt buộc mỗi khi chuyển từ đời thường sang ký hiệu:
   - đặt tương ứng tường minh trên màn hình, vd. "quãng đường ↔ $f(x)$, thời gian ↔ $x$, vận tốc ↔ $f'(x)$";
   - mỗi ký hiệu mới được giải thích bằng chính ví dụ đó: nó là con số nào, đại lượng nào;
   - thay số của ví dụ vào công thức, ra đúng kết quả người xem đã thấy, **rồi** mới phát biểu tổng quát;
   - mỗi **dòng** tối đa một ký hiệu mới; mỗi **beat** tối đa một khái niệm mới (các ký hiệu của cùng một khái niệm, vd. $x_0$, $f(x_0)$, $x$, $f(x)$, được ở bốn dòng của một beat).
7. **Tiền đề — nhắc đúng mức**:
   - kiến thức **bài trước trong chuỗi** đã dạy (định nghĩa đạo hàm, tỉ số, giới hạn, cách tính đạo hàm tại một điểm…) chỉ nhắc **một dòng**, công thức **hiện trên màn hình** làm mốc; không dựng lại, không tính lại bằng bảng số. Đã gặp (22/10, video đơn điệu): 4 beat dựng lại tỉ số, tính $h'(2)$ bằng bảng → "lòng vòng quá, nói ở bài trước rồi";
   - kiến thức cũ hơn không có video riêng (vd. giới hạn khi dạy đạo hàm lần đầu) → nhắc ngắn bằng trực giác ngay trước khi dùng, không giả định người xem nhớ.
8. **Không bỏ qua bản chất toán — định nghĩa phải xuất hiện** (áp dụng cho khái niệm **mới** của video; định nghĩa bài trước theo yêu cầu 7):
   - đi từ ví dụ → khái niệm (hoặc ngược lại) nhưng phải **đi tới nơi**: định nghĩa (định lý, công thức) chính thức hiện trên màn hình với ký hiệu chuẩn, rồi từng phần được gắn lại với ví dụ ("tử số là quãng đường rơi thêm…");
   - **giải phẫu công thức trên hình**: sau khi công thức hiện, quay lại hình và chỉ từng cụm ký hiệu là *thứ gì nhìn thấy được*, **mỗi dòng một cụm**, cụm trên công thức và thứ tương ứng trên hình sáng cùng màu, cùng lúc. Công thức nào không chỉ được lên hình thì chưa được giải thích;
   - **từng ký hiệu đơn trước, rồi mới tới phép tính trên chúng.** Hiệu, tổng, thương chỉ được nhắc khi **mọi thành phần đã được giải thích riêng** (nghĩa trong ví dụ + vị trí trên hình + một con số). Ngay cả ký hiệu hàm cũng cần dòng riêng: "$f(5) = 25$ nghĩa là lúc 5 giây, người chạy ở mét 25". Đã gặp (20/10): chỉ đoạn $f(x)-f(x_0)$ khi người xem chưa hiểu $f(x)$, $f(x_0)$ → mất dấu;
   - **dựng theo đúng phép tính, từ phần tử đến kết quả**, không hiện kết quả "giữa trời". Mẫu cho định nghĩa đạo hàm, mỗi bước ít nhất một dòng: $x_0$ = một điểm trên trục ngang → $f(x_0)$ = **cột dọc** từ trục lên đồ thị tại $x_0$ (kèm số) → $x$ = điểm thứ hai → $f(x)$ = **cột dọc thứ hai** → $f(x)-f(x_0)$: kẻ ngang từ đỉnh cột thấp, **phần chênh** ở đầu cột cao sáng lên → $x-x_0$ = khoảng giữa hai chân cột → thương = độ dốc cát tuyến = vận tốc trung bình → $\lim$: cho $x$ trượt về $x_0$;
   - không cần nói video thuộc bài nào, lớp mấy; phát biểu toán đúng như học sinh gặp trên lớp.
9. **Người xem luôn biết đang xem gì**: khi chuyển sang hình, bảng, công thức hay bước mới, câu đầu của beat nói rõ đó là gì và để làm gì ("Giờ thử rút ngắn khoảng thời gian.", "Đây là định nghĩa đạo hàm."). Không để hình mới hiện lên mà lời đọc chưa giới thiệu.
10. **Chú thích đầy đủ nhưng ít chữ** — xem quy tắc `text` và `visual`. Phép thử: tắt tiếng, chỉ nhìn màn hình, vẫn biết mỗi con số, ký hiệu, hình là gì. Chú thích *một lần* (tên trục, tiêu đề cột, chú giải ký hiệu), sau đó chỉ ký hiệu/số.
11. **Một ví dụ xuyên suốt từ đầu đến cuối**:
    - chọn **một** nhân vật/vật (người chạy, flycam trên đồi…) mang được cả hiện tượng mở đầu, số liệu, công thức, đề thi và giải đáp. Mỗi lần đổi ví dụ, người xem phải dựng lại bối cảnh mới — đó là chỗ họ lạc. Đã gặp (20/10): Bolt → bóng rơi → trục số → $x^3-3x$ → đồ thị $f'$;
    - hiện tượng thật không có công thức (vd. số liệu Bolt) thì ví dụ tính toán là **mô hình của chính vật đó** ("giả sử người chạy có quãng đường $s = \dots$");
    - **đổi sang mô hình là một bước khó — dành hẳn một beat, nói chậm**. Đã gặp: thấy $s=t^2$ ngay sau Bolt, người xem tưởng đó là Bolt. Beat này: (1) nói vì sao cần đổi ("số liệu thật chỉ có từng 10 m, muốn co khoảng thời gian nhỏ tuỳ ý thì cần một công thức"); (2) nói thẳng **đây không phải Bolt**, đổi hình nhân vật (màu, tên), giữ nhãn "mô hình" trên hình suốt phần dùng nó; (3) cho cảm nhận công thức bằng vài con số trước (1 s → 1 m, 2 s → 4 m, 3 s → 9 m) rồi mới viết công thức; (4) có một dòng "thở";
    - mỗi hình biểu diễn mới (đồ thị, bảng) phải **nối với hình cũ bằng bước người xem tự hiểu**, như học sinh vẫn làm trên lớp: lấy vài số từ hình cũ → bảng nhỏ → chấm từng điểm lên hệ trục → nối thành đồ thị, lời đọc nói rõ "mỗi điểm trên đồ thị nghĩa là…";
    - **không dùng phép biến hình lạ mắt** (xoay đường chạy thành trục, người chạy nằm dọc trục, gập/cuộn hình…). Đã gặp (20/10): "siêu lạ mắt, không hiểu gì". Trục, đồ thị, nhân vật luôn ở **tư thế quen thuộc**;
    - cả video **tối đa ~3 cảnh**. Nhân vật trang trí không gắn với ví dụ (người leo núi trên đồ thị, đèn giao thông…) → bỏ.
12. **Khái niệm mới phải được định nghĩa bằng hình trước khi dùng**: mỗi khái niệm/thuật ngữ mới (cát tuyến, tiếp tuyến, độ dốc, đồng biến…) có dòng riêng nói *nó là gì* và hình chỉ ra đúng nó, rồi mới nói nó *bằng gì* hay *dùng để làm gì*. Mọi câu "A chính là B" phải được **cho thấy** trên hình (độ dốc = đi ngang bao nhiêu thì lên bao nhiêu → tam giác ngang 1 s, lên 11 m → 11 m mỗi giây → đó là vận tốc trung bình).
    - **Tiếp tuyến dạy bằng kính lúp**: phóng to quanh điểm, đồ thị trông gần như thẳng; đường thẳng đồ thị "giống" khi phóng thật to là tiếp tuyến. Không định nghĩa tiếp tuyến bằng một câu nói suông.
    - **Đồng biến/nghịch biến** định nghĩa bằng so sánh hai điểm trên hình (điểm sau cao hơn điểm trước), không chỉ đọc định nghĩa.
13. **Nhịp hình chậm, mỗi thay đổi đều được giải thích**: mỗi dòng **tối đa một thay đổi trên hình**, và thay đổi đó là *nguyên nhân* nhìn thấy được của con số/kết luận dòng đó nói (đoạn tô co lại → vận tốc trung bình nhảy số; người chạy dừng → $f'=0$). Không để số, điểm, hàng bảng tự hiện liên tiếp mà hình không làm gì. Đã gặp (20/10): trục số với 15 / 10,5 / 10,05 tự hiện liên tục → khó hiểu.

### Bước khó và câu trả lời "vì sao"

**Bước khó** (đổi mô hình, khái niệm mới, giải phẫu công thức, chuyển ví dụ → ký hiệu, chuyển sang đề thi) được thêm thời gian: tách thành nhiều dòng, mỗi dòng một ý, sau ý nặng nhất có một dòng ngắn để người xem kịp nạp (nhắc lại bằng lời thường, hoặc "Để ý cột màu xanh."). Đánh dấu "BƯỚC KHÓ" trong dàn ý và trong `visual`.

**Câu trả lời "vì sao" của ý bản chất là bước khó nhất, phải chậm nhất**:
- không chỉ nêu kết luận ("đạo hàm dương nên bên phải cao hơn"): **mỗi mắt xích suy luận một dòng**, có con số hoặc dấu cụ thể nhìn thấy trên hình, rồi một dòng nói lại bằng lời thường;
- dành **ít nhất 2 beat**, cắt ý khác để bù;
- **"chậm" nghĩa là chia nhỏ nhịp, không phải nói chậm**: thêm dòng, mỗi dòng **một mắt xích ngắn** (≤ ~12 từ, 0–1 chỗ ngắt), giới thiệu từng thành phần riêng trước khi dùng ("Tử là độ cao chênh lệch giữa hai điểm." / "Mẫu là khoảng cách ngang giữa hai điểm."), có câu hỏi dẫn ("Còn điểm ở ngay bên trái thì sao?"), có câu chốt nói lại bằng lời thường; mỗi dòng hình đổi đúng một thứ. Có thể đặt `lineGap` ≤ 0,5 cho các beat này; **không đặt `speed`**;
- lập luận **đi thẳng từ công thức** học sinh nhớ (công thức hiện trên màn hình), không vòng qua con số trung gian; cụm đang nói sáng trên công thức và trên hình cùng lúc.

Mẫu người dùng đã chốt (đơn điệu, vì sao $f'>0$ thì đi lên): đạo hàm là $\lim \frac{f(x)-f(x_0)}{x-x_0}$ → đạo hàm dương thì khi $x$ đủ sát, phân số dương → lấy $x$ bên phải: mẫu dương → phân số dương mà mẫu dương thì tử dương → tử dương nghĩa là $f(x) > f(x_0)$: bên phải cao hơn → bên trái: mẫu âm nên tử âm, bên trái thấp hơn → nói gọn. Mỗi mũi tên một dòng, kính lúp quanh điểm.
Đã bị loại (22/10): gói trong 3 dòng "kính lúp, đạo hàm bằng 3, tỉ số dồn về số dương nên bên phải cao hơn" → "nói nhanh quá, chỉ nêu ra chứ giải thích chả hiểu gì, đấy là phần quan trọng nhất"; rồi "đạo hàm bằng 3 nên sang phải 0,1 thì lên 0,3" → "tự nhiên đạo hàm = 3 xong lại sang 0,1 lên 0,3", không nối với công thức.

### Phần nên có

- Nếu còn thời lượng: một câu hỏi ngắn để người xem tự nghĩ trước phần kết (hiện câu hỏi, một dòng tạo khoảng lặng như "Thử nghĩ xem.", rồi giải).
- Khi phù hợp: lý do học sinh hay hiểu sai (`GỐC RỄ`), bẫy thường gặp.
- **`GỐC RỄ` / cách làm ngây thơ: kể đúng như học sinh vẫn làm, bằng lời thường.** Vd. đơn điệu: "tính vài điểm rồi nối lại theo cảm nhận, nhưng ở giữa đoạn tự nối ấy, nhỡ đường lồi lên thì sao? Muốn chắc thì phải biết cả hình." Không đóng khung bằng thuật ngữ kỹ thuật ("đo / không đo", "điểm đo", "lấy mẫu"). Đã gặp (22/10): "cho máy biết độ cao tại vài điểm… cái gờ không ai đo" → khó hiểu.

### Nhãn `section`

Viết hoa, chọn theo nội dung:
`HIỆN TƯỢNG` · `CÂU HỎI` · `GỐC RỄ` · `TRỰC GIÁC` · `BẢN CHẤT` · `ĐỊNH NGHĨA` · `CÔNG THỨC` · `VÍ DỤ` · `TRONG ĐỀ THI` · `BẪY THƯỜNG GẶP` · `GIẢI ĐÁP` · `TỔNG KẾT`

Nhãn chủ yếu để cấu trúc kịch bản. Trên video **chỉ** `TRONG ĐỀ THI`, `BẪY THƯỜNG GẶP` và `GIẢI ĐÁP` hiện cho người xem (thẻ mở beat ~1 giây).

## Phạm vi kiến thức

- Thuật ngữ và ký hiệu **theo SGK chương trình 2018** (Kết nối tri thức).
- **Không dùng kiến thức ngoài chương trình THPT, kể cả "để hiểu"** (vd. định lý Lagrange để giải thích vì sao $f'>0$ thì đồng biến — đã bị loại 22/10). Định lý SGK thừa nhận không chứng minh thì cho trực giác bằng công cụ trong chương trình, nói rõ là trực giác.
- **Nối bản chất với công thức học sinh nhớ**, không chỉ với hình ảnh: học sinh nhớ định nghĩa đạo hàm là $\lim \frac{f(x)-f(x_0)}{x-x_0}$, không nhớ "độ dốc". Công thức đó **hiện trên màn hình** làm mốc khi nối, hình ảnh độ dốc chỉ đi kèm.
- **Không giảng lại bài trước** (yêu cầu 7).
- **Không dạy công cụ của bài khác.** Kỹ thuật thuộc bài khác (bảng xét dấu, bảng biến thiên, quy tắc tính đạo hàm…) không giới thiệu cách làm; chỉ nói kết quả ("giải ra thì đạo hàm âm trên khoảng này, dương trên khoảng kia") và cho thấy kết quả đó trên hình (tô màu trên đồ thị). Đã gặp (22/10): lập bảng xét dấu trong video đơn điệu → "đấy là kiến thức bài khác".

## Style — 6 tiêu chí (ưu tiên theo thứ tự khi xung đột)

1. **Bản chất**: mỗi video trả lời được "vì sao". Câu chốt phải là *lý do*, không phải công thức lặp lại.
2. **Dễ hiểu**: học sinh trung bình xem một lần là hiểu. Mỗi beat chỉ một ý mới. Thuật ngữ mới giải thích ngay lần đầu.
3. **Minh họa để giải thích, không để trưng**: **beat nào cũng có hình**, không beat nào chỉ chữ. Ưu tiên hình *chuyển động/biến đổi* hơn hình tĩnh — nhưng **ít thay đổi, mỗi thay đổi chậm và có nghĩa** (yêu cầu 13). Hình nói, chữ chỉ ghi chú.
4. **Thực tế**: mở và kết bằng hiện tượng thật (yêu cầu 1, 5); giữa video neo khái niệm vào **chính ví dụ xuyên suốt** (yêu cầu 11), không kéo thêm ví dụ đời thường khác. Ví dụ đời thường đi trước, toán đi sau.
5. **Funny**: 1–3 điểm hài mỗi video, đến từ *tình huống hoặc so sánh bất ngờ* (vd. "Tiếp tuyến: đường thẳng chỉ chạm đồ thị một cái rồi đi luôn, không lưu luyến"; người chạy dừng buộc dây giày đúng lúc $f'=0$). Hình có thể góp phần hài. Không meme theo trend, không chế giễu học sinh, không đùa làm sai lệch toán.
6. **Không lan man, nhưng không vội**:
   - mỗi beat phục vụ ý bản chất. Tự hỏi "bỏ beat này thì người xem có hiểu kém đi không?" — không thì cắt. Không mở bài dài;
   - mọi bước suy luận nói ra thành lời; mọi chỗ chuyển từ ví dụ sang toán có cầu nối (yêu cầu 6);
   - sau một ý then chốt được thêm một beat "dừng lại": nói lại ý đó bằng lời thường và một hình khác — không tính là nhắc lại thừa;
   - đặt mình vào chỗ học sinh trung bình xem lần đầu: chỗ nào phải tua lại mới hiểu là chỗ đó đang vội → chậm lại, cắt ý khác bù;
   - một video chỉ đủ cho **một ý bản chất chính** cùng 1–2 hệ quả. Nhiều hơn là đang nhồi.

Giọng văn:
- **Trung tính, không xưng hô**: không "bạn", "các em", "mình", "chúng ta", "tôi". Dùng câu khẳng định hoặc câu hỏi không chủ ngữ ("Vì sao lại như vậy?").
- Giọng **giảng bài mang tính tài liệu**: điềm tĩnh, rõ ràng, **có nhấn nhá** — như phim tài liệu khoa học kể cho người đang tò mò. Không dồn dập, không giọng quảng cáo; hài nhẹ, nằm ở hình hoặc so sánh. Câu ngắn nhưng đủ ý. Không rào đón, không "rất dễ thôi", không cảm thán thừa.

## Quy tắc từng trường

### `text` — ghi chú kiểu bảng đen, không phải bản chép lời đọc

- Chỉ ghi điều cần nhớ của dòng, ưu tiên **ký hiệu, số, mũi tên**: "0,81 s → 44 km/h", "$\Delta t \to 0$", "$f' < 0$: giảm". Không viết lại câu của `speak`.
- ≤ ~35 ký tự (dòng chỉ có công thức được dài hơn). Không cần câu đầy đủ, không dấu chấm.
- **Không lặp thứ hình đã cho thấy**: đoạn đã tô trên thước có số thì `text` không ghi lại; nhãn trên hình đã ghi số thì `text` không ghi lại. Một thông tin chỉ nằm **một chỗ** trên màn hình.
- **Mũi tên → chỉ dùng đúng nghĩa toán** (dồn về, suy ra, đổi thành). Không dùng → cho "để dành bài sau", "tức là"… vì người xem đọc thành "dẫn tới". Đã gặp (22/10): "Cực trị → bài sau" → người dùng sửa thành "Cực trị, bài sau sẽ nói rõ".
- Được để `""` khi hình đã nói đủ (dòng chỉ để nhìn chuyển động, dòng nhắc lại công thức đã hiện).
- **Đơn vị: ít và đơn giản.** Video học toán: mô hình toán dùng **số trơn, không đơn vị** cũng được ("$x$ từ 0 đến 4", "độ cao bằng 4"). Không dùng đơn vị ghép/đổi đơn vị (trăm m, km/h↔m/s…) chỉ để số đẹp. Chỉ giữ đơn vị cho số liệu thật (hiện tượng, giải đáp), khi đó dùng đơn vị quen thuộc. Đã gặp (22/10): "$x$ (km), $f(x)$ (trăm m)" → "hạn chế đơn vị phức tạp, thậm chí không dùng đơn vị cũng được, học toán mà".
- **Tên đại lượng chú thích một lần** ở chỗ cố định (tên trục, tiêu đề cột, chú giải ký hiệu, hoặc lần đầu số xuất hiện), các lần sau dùng ký hiệu đã chú giải ($v$, $\Delta t$…). Chú giải viết thành cụm đọc lên có nghĩa: "quãng đường $s$ (m)". **Không** dùng chú giải viết tắt kiểu "$s$: m · $t$: s" (đã gặp 20/10: không biết để làm gì).
- Công thức trong `$...$` (KaTeX). 2–5 dòng mỗi beat.

### `speak` — lời cho TTS đọc

Nội dung tương đương `text`, đọc tự nhiên; được thêm từ nối cho trôi. **Không chứa ký hiệu toán** (`$ \ ^ _ { } = + / ' √`…) — script B2 sẽ chặn.

**Đọc ký hiệu — theo thứ tự ưu tiên:**
1. **Mặc định: nói theo nghĩa, không đọc chữ cái.** "độ cao tại điểm đó", "hàm số", "đạo hàm tại điểm đang xét", "tại giây thứ năm". Ký hiệu chỉ để trên màn hình. Lý do: Vivibe đọc chữ cái không ổn định, mỗi lần tạo một khác — bản demo 22/10 nghe "f(x)" thừa âm cuối dù câu nghe thử trước đó ổn.
2. Buộc phải đọc chữ cái (không có cách nói khác):
   - tên hàm đặt là $f$, viết **"f của x"** (nghe thử 22/10, giọng nữ - c Nhi: tốt nhất). Không đặt tên hàm là $h$ (Vivibe đọc "hắc", "h của hai" dính một cụm); buộc dùng $h$ thì viết **"hát của ích"**. Chữ cái khác chưa nghe thử → không dùng làm tên hàm;
   - ký hiệu có chỉ số viết liền bằng phiên âm + gạch nối: **"ích-không"** ($x_0$) — viết "x không" thì engine đọc tách "x" … "không" (20/10, giọng nam - c Bình);
   - **cụm chứa chữ "không" phải đứng cuối vế**, ngay sau là `,` `.` `?` hoặc một danh từ, vì "không" dính sang động từ/tính từ phía sau và nghe thành phủ định: "ích-không **ứng với**" → "không ứng", "ích-không **bằng** mười" → "không bằng" (cũng xảy ra với số "không"). Đảo câu: "Tại ích-không, đạo hàm bằng mười." (đã nghe xác nhận đúng 20/10);
   - liệt kê mọi dòng loại này trong báo cáo để B2 nghe thử, và nghe lại đúng file trong bài sau khi tạo cả bài.

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

Công thức dài: **diễn giải bằng lời** ("tử là phần độ cao thay đổi, mẫu là phần đi ngang"). Bắt buộc đọc nguyên công thức thì đọc theo cụm, dấu phẩy ở ranh giới cụm.

**Viết cho tai nghe** (quyết định giọng có giống người hay không):
- **Ít chỗ ngắt.** Mỗi `,` `.` `:` `?` `...` giữa dòng làm giọng dừng ≈ 0,3–0,4 s; dòng 4–5 giây mà dừng 3 lần là nghe vấp. Mỗi dòng **tối đa 2 chỗ ngắt, nên là 1**. Một câu 15–20 từ có một dấu phẩy đọc mượt hơn hai câu 7 từ.
- Tối đa ~20 từ mỗi câu; mỗi dòng thường là **một câu**, hai vế nối bằng một dấu phẩy hoặc từ nối ("thì", "nên", "rồi", "tức là").
- Dấu phẩy chỉ ở **ranh giới cụm nghĩa lớn nhất** (giữa vế dẫn và vế chốt, sau trạng ngữ dài), ngay trước phần quan trọng nhất của dòng. Không tách danh từ khỏi phần bổ nghĩa, số khỏi đơn vị, "đạo hàm" khỏi "của f".
- Không mở câu bằng "Và", "Mà", "Còn" ngay sau một câu hỏi trong cùng dòng (giọng dừng hẳn rồi nhấn chữ "Và"). Gộp thành một câu.
- **Dấu `...` để ngắt rồi nhấn — tối đa 1 lần mỗi beat**, cho điểm nhấn quan trọng nhất (số kết quả, thuật ngữ mới, câu đùa). Đặt **trước cả một cụm trọn nghĩa** hoặc sau từ chuyển ý: "Tức là... vận tốc trung bình mười lăm mét một giây.". **Không** đặt giữa cụm chặt: "đo... kiểu gì" ✗, "hết... chín giây" ✗, "khoảng... bốn mươi" ✗.
- Từ chuyển ý ("Vậy thì", "Nhưng", "Tức là", "Để ý", "Đó là lý do") để các câu dính thành mạch — câu đầu của một dòng nối được với dòng trước. Chúng cũng tính là chỗ ngắt.
- Số và đơn vị viết theo cách nói: "bốn mươi ki-lô-mét một giờ", "không phẩy không một giây".
- Không chèn thẻ điều khiển (`<break>`…): Vivibe đọc sai. Nhịp chỉ đến từ dấu câu và cách viết.
- Đọc nhẩm từng câu: chỗ nào phải lấy hơi giữa một cụm là câu quá dài hoặc dấu câu đặt sai.

### `keyword`

≤ 6 từ, là điều cần nhớ của beat; không lặp nguyên văn một dòng `text`. B3 hiện nó thành **câu chốt** to trên hình lúc đọc dòng cuối, nên phải là *kết luận* của beat, không phải tên chủ đề (beat hook được phép là câu hỏi).

### `visual` — đủ cụ thể để dựng mà không phải đoán

- Mở đầu bằng tên cảnh ("CẢNH 2 — …" lần đầu, "Giữ CẢNH 2." các beat sau) và đánh dấu "BƯỚC KHÓ" ở beat khó.
- Hàm số cụ thể, khoảng vẽ trục, toạ độ điểm, giá trị tham số.
- Gắn từng thay đổi với dòng ("Dòng 2: …"). **Mỗi dòng tối đa một thay đổi trên hình**, ghi rõ thay đổi đó *gây ra* con số/kết luận nào. Bảng/nhãn đổi số thì hình đổi tương ứng cùng lúc (hàng "0,1 s" vào bảng ⇔ vạch "rơi thêm" co lại). Hai hàng bảng mới → hai dòng.
- Màu ghi theo **vai trò** ("màu nhấn", "màu leo/hạ", "màu tử/mẫu"), không ghi mã màu — màu do `style.md` quyết định.
- **Chú thích của từng thành phần**, ghi rõ chữ sẽ hiện: trục (tên đại lượng, đơn vị nếu dùng), mỗi điểm/vật, mỗi đoạn tô màu hay mũi tên, tiêu đề bảng đủ đại lượng ("Vận tốc trung bình (m/s)", không chỉ "Trung bình"), công thức kèm chú giải ký hiệu lần đầu.
- **Nhãn trên hình ≤ ~5 từ**, ưu tiên ký hiệu/số ("0,81 s · 44 km/h", không phải "đoạn 60 → 70 m: 0,81 s · tốc độ ≈ 44 km/h"). Câu chú thích dài → rút còn biểu tượng + số, hoặc bỏ.
- **Thông tin hết vai trò thì gỡ**: ghi khi nào nhãn/badge mờ đi.
- Vật trùng hoặc quá gần nhau → ghi cách tách (bỏ bớt mốc, dàn ngang), không để chồng.
- **Nhân vật/vật minh hoạ có vai trò toán**: ghi nó biểu diễn đại lượng nào, chuyển động theo hàm nào ("vị trí = $f(x)$; nhanh khi $f'$ lớn, dừng khi $f' = 0$, quay đầu khi $f'$ đổi dấu"). Không có vai trò → không đưa vào.
- **Giải phẫu công thức** (yêu cầu 8): mỗi dòng ghi cụm ký hiệu nào sáng lên và thứ gì trên hình sáng cùng màu.
- Chuyển cảnh bằng bước giải thích được (bảng số → chấm điểm → nối đồ thị), không bằng phép biến hình; nhân vật, trục ở tư thế quen thuộc.
- Phóng to: mô tả theo kiểu **kính lúp** (hình gốc giữ nguyên, khung soi co dần quanh điểm, ô phóng to bên cạnh có vạch chia), không viết chung chung "zoom vào đồ thị".
- Không thêm thẻ/tag trang trí; mọi thứ trên hình giúp người xem hiểu ý của beat.
- Mọi số liệu trong `visual` phải đúng toán (kiểm ở checklist).

## Độ dài

- **2 phút 30 – 4 phút** (tính cả intro/outro). Ngắn hơn 2:30 là đang vội. Vượt 4 phút → báo người dùng kèm đề xuất ý phụ có thể cắt, không tự rút gọn lời giải thích. Người dùng yêu cầu độ dài khác → theo người dùng.
- Ước lượng theo giọng Vivibe (đo thật 19–22/10/2026, cả giọng nam c Bình và nữ c Nhi: ≈ 20 ký tự/giây sau khi cắt lặng; 3069 ký tự, 11 beat → 2:49; 4231 ký tự, 16 beat → 3:53–3:56): **≈ 2700–4300 ký tự `speak`**. Thời lượng thật đo sau B2.
- 8–16 beat. `HIỆN TƯỢNG` ≤ 20 giây, `GIẢI ĐÁP` 15–30 giây; không beat nào > 40 giây (dài hơn thì tách beat).

## Checklist trước khi báo xong

**Toán**
- [ ] Mọi mệnh đề, công thức, số liệu trong `text` và `visual` đúng; có tính toán thì **kiểm bằng Python/sympy**, không tính nhẩm.
- [ ] Hình trong `visual` khớp số: điểm thật sự nằm trên đồ thị, hệ số góc, nghiệm, dấu trên từng khoảng đúng.
- [ ] Không kiến thức ngoài chương trình; không dạy công cụ bài khác; không giảng lại bài trước (chỉ một dòng + công thức). Ký hiệu, thuật ngữ khớp SGK 2018.

**Mở – kết**
- [ ] Hiện tượng đúng thật, có nguồn, qua cả ba phép thử (đúng bậc khái niệm, toán cần thiết, đại lượng hiển nhiên).
- [ ] `GIẢI ĐÁP` giải đúng hiện tượng đó, nói rõ bước nào dùng ý nào, đưa đáp án cụ thể (số có nguồn) và gọi tên nó bằng toán; số mở và kết không mâu thuẫn.
- [ ] Dòng cuối là câu kết luận ngắn khép lại câu hỏi mở đầu; ý để dành bài sau nằm trước phần đề thi/giải đáp, không ở cuối.

**Không nhảy bước**
- [ ] **Theo dõi người xem**: đi từng dòng, ghi "lúc này người xem đang nhìn gì, đã hiểu gì, đang thắc mắc gì, hình trả lời thế nào". Dòng nào dùng thứ chưa được giải thích → chèn bước thiếu. Chỗ nào người xem phải tự đoán ("cái này là gì? sao tự nhiên có cái này?") → thêm dòng hoặc đổi hình.
- [ ] Chuỗi "vì sao": ≥ 2 beat, mỗi mắt xích một dòng, đi từ công thức hiện trên màn hình, có dòng nói lại bằng lời thường.
- [ ] Mọi ký hiệu đơn được giải thích riêng (nghĩa + chỗ trên hình + con số) trước khi vào phép tính; hiệu/thương dựng từ thành phần.
- [ ] Mỗi khái niệm mới có dòng định nghĩa bằng hình trước khi dùng; mọi câu "A chính là B" được cho thấy trên hình.
- [ ] Đổi sang mô hình có beat riêng (lý do, "không phải số liệu thật", vài con số trước công thức, nhãn "mô hình").
- [ ] Phần đề thi chỉ có khi dạng bài dùng đúng khái niệm của video (video chỉ nêu bản chất → không có). Nếu có: có bước "một số → một hàm", đổi hàm được nói rõ, giá trị âm được cho thấy, $f'$ → $f$ có hình so sánh từng khoảng. Sửa một phần kịch bản → đã rà cả beat giữ nguyên.
- [ ] Mỗi chỗ chuyển ví dụ → toán có bảng tương ứng trên màn hình và bước thay số khớp kết quả cũ.

**Hình**
- [ ] Một ví dụ xuyên suốt; ≤ ~3 cảnh, cảnh sau mọc từ cảnh trước; không nhân vật trang trí; không phép biến hình lạ mắt.
- [ ] Công thức chính giải phẫu trên hình, mỗi cụm một dòng, cùng màu với thứ tương ứng.
- [ ] Đọc `visual` từng dòng: ≤ 1 thay đổi mỗi dòng; mọi con số mới có một thay đổi trên hình làm nguyên nhân; nhãn ≤ ~5 từ; nhãn hết vai trò có lúc gỡ.
- [ ] Beat nào cũng có `visual` là hình thật (không phải "hiện chữ"); 1–3 điểm hài.

**Chữ trên màn hình**
- [ ] `text` là ghi chú ngắn (≤ ~35 ký tự, ký hiệu), không chép `speak`, không lặp thứ đã có trên hình; mũi tên chỉ dùng đúng nghĩa toán.
- [ ] Đơn vị ít và đơn giản (mô hình có thể số trơn); phép thử tắt tiếng: mỗi con số có tên đại lượng đọc được ở đâu đó trên màn hình, mỗi ký hiệu có chú giải lần đầu — không chú thích lặp lại.

**Lời đọc**
- [ ] Không xưng hô; `speak` không còn ký hiệu toán; chữ cái chỉ đọc khi không có cách nói khác; tên hàm là $f$; cụm có "không" đứng cuối vế.
- [ ] Mỗi dòng ≤ 2 chỗ ngắt, câu ≤ ~20 từ, dấu phẩy ở ranh giới cụm lớn; `...` ≤ 1 lần mỗi beat, không chen giữa cụm chặt; không "Và/Mà/Còn" mở câu ngay sau câu hỏi.
- [ ] Đã liệt kê các dòng đọc ký hiệu/chữ cái để B2 nghe thử.

**Tổng thể**
- [ ] Chỉ một ý bản chất chính; ý đã cắt được liệt kê; không beat nào thừa (đã thử bỏ từng beat).
- [ ] Tổng ký tự `speak` khớp thời lượng đã duyệt (≈ 2700–4300); `lineGap` chỉ ở beat khó nhất, không dùng `speed` để làm chậm.
- [ ] JSON hợp lệ; `slug` và `id` chỉ gồm `a-z 0-9 - _`; `id` liên tục.
