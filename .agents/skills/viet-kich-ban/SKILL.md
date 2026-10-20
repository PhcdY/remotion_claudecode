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
- Video ngang 16:9, **2 phút 30 – 4 phút**. Ưu tiên số một là **dễ hiểu**: người xem không bị lạc, lúc nào cũng biết hình đang nói gì, đồ thị đang nói gì, và vì sao. Thời lượng là hệ quả, không phải ràng buộc: bước khó cần thêm thời gian thì thêm; vẫn không đủ thì **cắt ý phụ**, không nói nhanh hơn, không rút gọn lời giải thích.
- **Không nhảy bước — điều kiện tiên quyết.** Người xem chỉ theo được khi mỗi bước dựa trên những thứ *đã* hiểu. Trước khi dùng một ký hiệu, một hình, một khái niệm trong bước kế tiếp, nó phải đã được giải thích riêng và người xem đã có thời gian nhìn nó. Nhảy một bước là người xem mất dấu cho tới hết video.
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
- **đường hiểu**: người xem cần biết gì từ trước (tiền đề) → các bậc hiểu lần lượt, **không bỏ bậc nào** (mỗi bậc chỉ dùng những gì bậc trước đã cho) → sau video làm được gì (một câu cụ thể, gắn với dạng bài nào); đánh dấu các **bước khó** sẽ được thêm thời gian
- **ví dụ xuyên suốt** (yêu cầu 11) và danh sách **cảnh** (≤ ~3), mỗi cảnh nối từ cảnh trước bằng bước nào (bảng số → chấm điểm…), có đổi sang mô hình không và beat nào dành cho việc đó; các điểm hài định cài
- công thức chính sẽ được **giải phẫu trên hình** thế nào: cụm ký hiệu nào ↔ thứ gì trên hình (yêu cầu 8)
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
   - **Vẫn trong ví dụ xuyên suốt** (yêu cầu 11): dạng bài được kể lại bằng chính nhân vật/vật của video, vd. "đồ thị $f'$" = đồ thị vận tốc của người chạy, "$f$ đổi chiều biến thiên" = người chạy quay đầu. Hình đồ thị và hình ví dụ hiện cùng lúc, chuyển động của nhân vật do hàm điều khiển.
   - Không liệt kê nhiều dạng bài trong một câu. Không bịa đề thật, không ghi năm/mã đề.
5. **Kết bằng giải đáp rồi câu chốt**:
   - beat `GIẢI ĐÁP` (gần cuối): quay lại đúng hiện tượng mở đầu (cùng hình), giải nó bằng kiến thức vừa giảng, nói rõ **bước nào dùng ý nào** của video. Người xem phải thấy "à, ra là vì thế" — cảm giác toán dùng được thật;
   - **trả lời thẳng câu hỏi mở đầu bằng một đáp án cụ thể**: hỏi "nhanh bao nhiêu?" thì kết bằng con số thật (có nguồn, ghi trong dàn ý), rồi gọi tên nó bằng toán vừa học ("con số đó chính là đạo hàm $s'(t)$"). Không kết bằng một giải thích chung chung mà người xem vẫn chưa biết đáp án;
   - số liệu mở và kết phải **nhất quán** với nhau (vd. vận tốc trung bình một đoạn không được lớn hơn tốc độ tức thời lớn nhất). Hai nguồn lệch nhau → chọn số không mâu thuẫn hoặc bỏ bớt một số, báo người dùng;
   - **kết phải nghe như kết**: dòng cuối là một câu kết luận ngắn (≤ ~15 từ), khẳng định, mở bằng từ khép lại ("Vậy…", "Nói gọn lại…", "Đó là lý do…"), đáp lại đúng câu hỏi mở đầu. Không thêm ý mới, không câu hỏi, không "tiếp theo", không bỏ lửng kiểu còn định nói tiếp. Có thể dùng `...` trước cụm chốt;
   - sau đó một câu chốt dễ nhớ (nằm luôn trong `GIẢI ĐÁP` hoặc ở beat `TỔNG KẾT`) — chính là câu kết luận ở trên nếu gọn được.
6. **Cầu nối ví dụ → toán**, bắt buộc mỗi khi chuyển từ đời thường sang ký hiệu:
   - đặt tương ứng tường minh trên màn hình, vd. "quãng đường ↔ $f(x)$, thời gian ↔ $x$, vận tốc ↔ $f'(x)$";
   - mỗi ký hiệu mới được giải thích bằng chính ví dụ đó: nó là con số nào, đại lượng nào trong ví dụ;
   - thay số của ví dụ vào công thức, ra đúng kết quả người xem đã thấy trước đó, **rồi** mới phát biểu tổng quát;
   - mỗi beat tối đa một ký hiệu hoặc khái niệm mới.
7. **Tiền đề**: kiến thức cũ cần dùng (vd. giới hạn khi nói về đạo hàm) được nhắc lại ngắn bằng trực giác ngay trước khi dùng. Không giả định người xem nhớ.
8. **Không bỏ qua bản chất toán — định nghĩa phải xuất hiện**:
   - đi từ ví dụ → khái niệm, hoặc khái niệm → ví dụ, nhưng phải **đi tới nơi**: định nghĩa (hoặc định lý, công thức) chính thức hiện trên màn hình với ký hiệu chuẩn, rồi từng phần của nó được gắn lại với ví dụ ("tử số là quãng đường rơi thêm…");
   - **giải phẫu công thức trên hình**: sau khi công thức hiện, quay lại hình (đồ thị/cảnh ví dụ) và chỉ từng cụm ký hiệu là *thứ gì nhìn thấy được*, **mỗi dòng một cụm**, cụm trên công thức và thứ tương ứng trên hình sáng cùng màu, cùng lúc. Công thức nào không chỉ được lên hình thì chưa được giải thích;
   - **từng ký hiệu đơn trước, rồi mới tới phép tính trên chúng — không nhảy bước**. Một hiệu, tổng, thương chỉ được nhắc khi **mọi thành phần của nó đã được giải thích riêng** (nghĩa trong ví dụ + vị trí trên hình + một con số cụ thể). Đã gặp (20/10/2026): chỉ ra đoạn $f(x)-f(x_0)$ khi người xem chưa hiểu $f(x)$ và $f(x_0)$ là gì → mất dấu. Ngay cả ký hiệu hàm $f(\cdot)$ cũng cần một dòng riêng: "$f(5) = 25$ nghĩa là lúc 5 giây, người chạy ở mét 25".
   - **dựng theo đúng phép tính, từ phần tử đến kết quả**, không hiện thẳng kết quả "giữa trời". Thứ tự cho định nghĩa đạo hàm, mỗi bước ít nhất một dòng: $x_0$ = một thời điểm, một điểm trên trục ngang → $f(x_0)$ = quãng đường lúc đó, **cột dọc** từ trục lên đồ thị tại $x_0$ (kèm số) → $x$ = một thời điểm khác, điểm thứ hai trên trục → $f(x)$ = **cột dọc thứ hai** (kèm số) → $f(x)-f(x_0)$ = cột cao trừ cột thấp: kẻ ngang từ đỉnh cột thấp sang, **phần chênh** ở đầu cột cao sáng lên = quãng chạy thêm → $x-x_0$ = khoảng cách giữa hai chân cột trên trục ngang = thời gian trôi qua → thương = chia hai số đó = độ dốc cát tuyến = vận tốc trung bình → $\lim$: cho $x$ trượt về $x_0$;
   - không cần nói video thuộc bài nào, lớp mấy; chỉ cần phát biểu toán đúng như học sinh gặp trên lớp để các em nhận ra.
9. **Người xem luôn biết đang xem gì**: khi chuyển sang hình, bảng, công thức hay bước mới, câu đầu của beat nói rõ đó là gì và để làm gì ("Giờ thử rút ngắn khoảng thời gian.", "Đây là định nghĩa đạo hàm."). Không để hình mới hiện lên mà lời đọc chưa giới thiệu.
10. **Chú thích đầy đủ nhưng ít chữ** — xem quy tắc `text` và `visual`. Phép thử: tắt tiếng, chỉ nhìn màn hình, vẫn biết mỗi con số, ký hiệu, hình là gì. Chú thích *một lần* (tên trục, tiêu đề cột, chú giải ký hiệu), sau đó chỉ cần ký hiệu/số + đơn vị, không viết lại câu.
11. **Một ví dụ xuyên suốt từ đầu đến cuối**:
    - chọn **một** nhân vật/vật (người chạy, quả bóng…) mang được cả hiện tượng mở đầu, phần số liệu, công thức, phần đề thi và giải đáp. Mỗi lần đổi sang ví dụ khác, người xem phải dựng lại trong đầu một bối cảnh mới — đó là chỗ họ lạc;
    - hiện tượng thật không có công thức (vd. số liệu Bolt) thì ví dụ tính toán là **mô hình của chính vật đó** ("giả sử người chạy có quãng đường $s = \dots$"), không chuyển sang vật khác;
    - **đổi sang mô hình là một bước khó — dành hẳn một beat, nói chậm**. Người xem dễ tưởng công thức mô hình là số liệu thật (đã gặp: thấy $s=t^2$ ngay sau Bolt, người xem tưởng đó là Bolt). Beat này phải: (1) nói vì sao cần đổi ("số liệu thật chỉ có từng 10 m, muốn co khoảng thời gian nhỏ tuỳ ý thì cần một công thức"); (2) nói thẳng **đây không phải Bolt**, là một người chạy tưởng tượng, đổi cả hình nhân vật (màu, tên) và giữ nhãn "mô hình" trên hình suốt phần dùng nó; (3) cho người xem cảm nhận công thức bằng vài con số trước (1 s → 1 m, 2 s → 4 m, 3 s → 9 m: càng chạy càng nhanh) rồi mới viết công thức; (4) có một dòng "thở" để người xem kịp nạp trước khi tính tiếp;
    - mỗi hình biểu diễn mới (đồ thị, bảng, trục số) phải **nối với hình cũ bằng một bước người xem tự hiểu được**, không hiện ra như một cảnh mới không liên quan. Cầu nối tốt là cách học sinh vẫn làm trên lớp: lấy vài số liệu từ hình cũ (lúc 1 s ở mét 1, lúc 2 s ở mét 4…) → ghi thành bảng nhỏ → chấm từng điểm lên hệ trục → nối thành đồ thị, và lời đọc nói rõ "mỗi điểm trên đồ thị nghĩa là…";
    - **không dùng phép biến hình lạ mắt** để chuyển cảnh (xoay đường chạy thành trục, người chạy nằm ngang dọc trục, gập/cuộn hình…). Đã thử (20/10/2026): người xem không hiểu gì. Trục, đồ thị, nhân vật luôn ở **tư thế quen thuộc** (trục ngang nằm ngang, người đứng thẳng);
    - cả video **tối đa ~3 cảnh** (vd. đường chạy · đồ thị $s(t)$ đặt trên đường chạy · công thức). Nhân vật trang trí không gắn với ví dụ (người leo núi trên đồ thị, đèn giao thông…) → bỏ.
12. **Khái niệm mới phải được định nghĩa bằng hình trước khi dùng**: mỗi khái niệm hình học/thuật ngữ mới (cát tuyến, tiếp tuyến, độ dốc, giới hạn…) có dòng riêng nói *nó là gì* và hình chỉ ra đúng nó, rồi mới nói nó *bằng gì* hay *dùng để làm gì*. Mọi câu "A chính là B" (vd. "độ dốc cát tuyến chính là vận tốc trung bình") phải được **cho thấy** trên hình, không chỉ khẳng định: độ dốc = đi ngang bao nhiêu thì lên bao nhiêu → chỉ trên tam giác: ngang 1 s, lên 11 m → 11 m mỗi giây → đó là vận tốc trung bình.
    - **Tiếp tuyến dạy bằng kính lúp (phóng to)**: phóng to quanh điểm, đồ thị trông gần như thẳng; đường thẳng mà đồ thị "giống" khi phóng thật to chính là tiếp tuyến. Cát tuyến qua hai điểm càng gần nhau thì trong ô phóng càng trùng với đoạn đồ thị ấy. Không định nghĩa tiếp tuyến bằng một câu nói suông.
13. **Nhịp hình chậm, mỗi thay đổi đều được giải thích**: mỗi dòng **tối đa một thay đổi trên hình**, và thay đổi đó phải là *nguyên nhân* nhìn thấy được của con số/kết luận dòng đó đang nói (đoạn tô co lại → vận tốc trung bình nhảy số; người chạy dừng → $f'=0$). Không để số, điểm, hàng bảng tự hiện ra liên tiếp mà hình không làm gì.

**Bước khó** (đổi mô hình, khái niệm mới, giải phẫu công thức, chuyển ví dụ → ký hiệu) được thêm thời gian: tách thành nhiều dòng, mỗi dòng một ý, và sau ý nặng nhất có một dòng ngắn để người xem kịp nạp (nhắc lại bằng lời thường, hoặc "Để ý cột màu xanh."). Trong dàn ý, đánh dấu các bước khó.

Nên có nếu còn thời lượng: một câu hỏi ngắn để người xem tự nghĩ trước phần kết (hiện câu hỏi, một dòng tạo khoảng lặng như "Thử nghĩ xem.", rồi giải).

Nên có khi phù hợp: lý do học sinh hay hiểu sai (`GỐC RỄ`), bẫy thường gặp.

Nhãn `section` được dùng (viết hoa, chọn theo nội dung):
`HIỆN TƯỢNG` · `CÂU HỎI` · `GỐC RỄ` · `TRỰC GIÁC` · `BẢN CHẤT` · `ĐỊNH NGHĨA` · `CÔNG THỨC` · `VÍ DỤ` · `TRONG ĐỀ THI` · `BẪY THƯỜNG GẶP` · `GIẢI ĐÁP` · `TỔNG KẾT`

Nhãn chủ yếu để cấu trúc kịch bản. Trên video **chỉ** `TRONG ĐỀ THI`, `BẪY THƯỜNG GẶP` và `GIẢI ĐÁP` hiện cho người xem (thẻ mở beat ~1 giây); các nhãn khác không hiện.

## Style — 6 tiêu chí (ưu tiên theo thứ tự khi xung đột)

1. **Bản chất**: mỗi video trả lời được "vì sao". Câu chốt phải là *lý do*, không phải công thức lặp lại.
2. **Dễ hiểu**: học sinh trung bình xem một lần là hiểu. Mỗi beat chỉ một ý mới. Thuật ngữ mới giải thích ngay lần đầu.
3. **Minh họa để giải thích, không để trưng**: **beat nào cũng có hình**, không có beat chỉ chữ. Ưu tiên hình *chuyển động/biến đổi* (điểm chạy, đồ thị co giãn, hình tách ghép) hơn hình tĩnh — nhưng là **ít thay đổi, mỗi thay đổi chậm và có nghĩa** (yêu cầu 13), không phải nhiều thứ hiện liên tục. Người xem không phải đọc nhanh hay nghĩ nhanh. Hình nói, chữ chỉ ghi chú.
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

**`text`** (chữ trên màn hình) — **ghi chú kiểu bảng đen, không phải bản chép lời đọc**
- Chỉ ghi điều cần nhớ của dòng, ưu tiên **ký hiệu, số, mũi tên**: "0,81 s → 44 km/h", "$\Delta t \to 0$", "$f' < 0$: giảm". Không viết lại câu của `speak`.
- ≤ ~35 ký tự (dòng chỉ có công thức được dài hơn). Không cần câu đầy đủ, không cần dấu chấm.
- **Không lặp thứ hình đã cho thấy**: đoạn 60–70 m đã tô trên thước có số thì `text` không ghi lại "đoạn 60–70 m"; nhãn trên hình đã ghi số thì `text` không ghi lại số đó. Một thông tin chỉ nằm **một chỗ** trên màn hình.
- Được để `""` khi hình đã nói đủ (vd. dòng chỉ để người xem nhìn chuyển động).
- **Đơn vị luôn đi kèm số**; **tên đại lượng chú thích một lần** ở chỗ cố định (tên trục, tiêu đề cột, chú giải ký hiệu, hoặc lần đầu số đó xuất hiện), các lần sau dùng ký hiệu đã chú giải ($v$, $\Delta t$…) thay cho cả cụm chữ.
- **Ký hiệu mới có chú giải** ở lần đầu, viết thành cụm đọc lên có nghĩa: tên trục "quãng đường $s$ (m)", "thời gian $t$ (s)". **Không** dùng chú giải viết tắt kiểu "$s$: m · $t$: s": người xem không hiểu nó để làm gì (đã gặp 20/10/2026). Đơn vị đã nằm ở tên trục thì không thêm dòng chú giải riêng.
- Công thức trong `$...$` (KaTeX).
- 2–4 dòng mỗi beat.

**`speak`** (TTS đọc)
- Nội dung tương đương `text`, đọc tự nhiên; được thêm từ nối cho trôi.
- **Không chứa ký hiệu toán** (`$ \ ^ _ { } = + / ' √`…). Viết bằng chữ:

| Ký hiệu | Đọc |
|---|---|
| $x^2$, $x^3$, $x^n$ | x bình phương, x lập phương, x mũ n |
| $\sqrt{x}$, $\sqrt[3]{x}$ | căn x, căn bậc ba của x |
| $f'(x)$, $f''(x)$ | lần đầu: đạo hàm của f tại x, đạo hàm cấp hai của f; sau khi đã giới thiệu: f phẩy x, f hai phẩy x |
| $x_0$, $a_n$ | ích-không, a-n (xem lưu ý bên dưới) |
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

- **Ký hiệu có chỉ số phải nghe ra là một cụm, tách khỏi từ phía sau.** Đã nghe thử (20/10/2026, Vivibe, giọng nam - c Bình):
  - viết "x không" → engine đọc tách "x" … "không". Viết **"ích-không"** (phiên âm chữ cái + gạch nối) → "ích" và "không" đã liền nhau. Dùng cách này.
  - nhưng "không" lại dính sang từ phía sau: "tại ích-không ứng với…" nghe thành "ích / **không ứng** với…" (như phủ định), người nghe rối. Lỗi này xảy ra với mọi cụm có chữ "không" (ký hiệu chỉ số 0, số "không") đứng ngay trước một động từ/tính từ: "ích-không **bằng** mười" nghe thành "không bằng", "ích-không **là**", "**có**", "**đổi**", "**tăng**"…
  - Cách viết: cụm chứa "không" phải **đứng cuối vế**, ngay sau là dấu `,` `.` `?` hoặc một danh từ không thể ghép với "không". Đảo câu để được như vậy: "Tại thời điểm ích-không, vận tốc tức thời chính là đạo hàm của f tại ích-không." thay cho "Vận tốc tức thời tại ích-không ứng với đạo hàm…"; "Tại ích-không, đạo hàm bằng mười." thay cho "Đạo hàm tại ích-không bằng mười" (dính "không bằng").
  - Tốt nhất vẫn là hạn chế đọc ký hiệu, nói theo nghĩa của ví dụ ("tại thời điểm đang xét", "tại giây thứ nhất") — ký hiệu đã hiện trên màn hình rồi.
  - **Đã nghe xác nhận đúng** (20/10/2026): "Tại thời điểm ích-không, vận tốc tức thời chính là đạo hàm của f tại ích-không." và "Tại ích-không, đạo hàm bằng mười." — "ích-không" liền, tách rõ khỏi phần sau.
  - Mọi dòng có cụm "không" kiểu này vẫn nên nghe thử riêng ở B2 trước khi tạo cả bài.
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
- **nhãn trên hình ≤ ~5 từ**, ưu tiên ký hiệu/số + đơn vị ("0,81 s · 44 km/h", không phải "đoạn 60 → 70 m: 0,81 s · tốc độ ≈ 44 km/h"). Câu chú thích dài (vd. "xe đạp điện: tối đa 25 km/h") → rút còn biểu tượng + số ("25 km/h" sát xe) hoặc bỏ.
- **mỗi dòng tối đa một thay đổi trên hình**; ghi rõ thay đổi đó *gây ra* con số/kết luận nào. Bảng/nhãn đổi số thì hình phải đổi tương ứng cùng lúc (vd. hàng "0,1 s" vào bảng ⇔ vạch "rơi thêm" co lại còn 1,05 m). Hai hàng bảng mới → hai dòng.
- **thông tin hết vai trò thì gỡ**: ghi khi nào một nhãn/badge mờ đi (vd. "vận tốc trung bình cả bài" mờ khi chuyển sang đoạn 60–70 m).
- **nhân vật/vật minh hoạ có vai trò toán**: ghi nó biểu diễn đại lượng nào và chuyển động theo hàm nào (vd. "người chạy trên đường chạy dưới đồ thị, vị trí = $f(x)$; chạy nhanh khi $f'$ lớn, dừng khi $f' = 0$, quay đầu khi $f'$ đổi dấu"). Không có vai trò → không đưa vào.
- **giải phẫu công thức** (yêu cầu 8): mỗi dòng ghi cụm ký hiệu nào sáng lên và thứ gì trên hình sáng cùng màu.
- nhân vật, trục, đồ thị ở tư thế quen thuộc; chuyển từ cảnh này sang cảnh kia bằng bước giải thích được (bảng số → chấm điểm → nối đồ thị), không bằng phép biến hình (xoay, gập, cuộn).
- phóng to: mô tả theo kiểu **kính lúp** (hình gốc giữ nguyên, khung soi co dần quanh điểm, ô phóng to bên cạnh có vạch chia), không viết chung chung "zoom vào đồ thị".
- không thêm thẻ/tag trang trí; mọi thứ trên hình phải giúp người xem hiểu ý của beat.
- Mọi số liệu trong visual phải đúng toán (kiểm ở checklist).

## Độ dài

- **2 phút 30 – 4 phút** (tính cả intro/outro). Dễ hiểu đứng trên thời lượng: bước khó cần thêm thời gian thì thêm. Ngắn hơn 2:30 là đang vội. Vượt 4 phút → báo người dùng kèm đề xuất ý phụ có thể cắt, không tự rút gọn lời giải thích.
- Ước lượng theo giọng Vivibe (đo thật 19–20/10/2026: ≈ 20 ký tự/giây sau khi cắt lặng; 3069 ký tự, 11 beat → video 2:49): **≈ 2700–4300 ký tự `speak`**. Thời lượng thật đo sau B2.
- 8–16 beat. `HIỆN TƯỢNG` ≤ 20 giây, `GIẢI ĐÁP` 15–30 giây; không beat nào > 40 giây (dài hơn thì tách beat).
- Vượt khung → cắt ý (ghi vào "những ý đã cắt" ở dàn ý), không rút gọn lời giải thích của ý chính.
- Người dùng yêu cầu độ dài khác → theo người dùng.

## Checklist trước khi báo xong

- [ ] Toán đúng: mọi mệnh đề, công thức, số liệu trong `text` và `visual`. Có tính toán thì **kiểm bằng Python/sympy**, không tính nhẩm.
- [ ] Hình trong `visual` khớp số: điểm thật sự nằm trên đồ thị, hệ số góc đúng, nghiệm đúng…
- [ ] Đủ 13 yêu cầu bắt buộc của khung nội dung.
- [ ] **Không nhảy bước — theo dõi người xem**: đi từng dòng, ghi "lúc này người xem đang nhìn gì, đã hiểu những gì, đang thắc mắc gì, hình trả lời thế nào". Dòng nào dùng một thứ (ký hiệu, hình, khái niệm) chưa được giải thích ở dòng trước → chèn bước còn thiếu. Chỗ nào người xem phải tự đoán (cái này là gì? sao tự nhiên có cái này? sao lại bằng nhau?) → thêm dòng giải thích hoặc đổi hình.
- [ ] Đổi sang mô hình có beat riêng: lý do, "không phải số liệu thật", vài con số trước công thức, nhãn "mô hình" giữ trên hình.
- [ ] Mỗi khái niệm mới (cát tuyến, tiếp tuyến, độ dốc…) có dòng định nghĩa bằng hình trước khi dùng; tiếp tuyến dạy bằng kính lúp; mọi câu "A chính là B" được cho thấy trên hình.
- [ ] Mọi ký hiệu đơn ($x_0$, $f(x_0)$, $x$, $f(x)$…) được giải thích riêng (nghĩa + chỗ trên hình + con số) trước khi xuất hiện trong một phép tính; hiệu/thương dựng từ các thành phần (hai cột rồi mới tới phần chênh), không hiện kết quả giữa trời.
- [ ] Không phép biến hình lạ mắt; trục, nhân vật ở tư thế quen thuộc.
- [ ] Một ví dụ xuyên suốt: hiện tượng, số liệu, công thức, đề thi, giải đáp cùng một nhân vật/vật; ≤ ~3 cảnh, cảnh sau mọc ra từ cảnh trước; không nhân vật trang trí.
- [ ] Công thức chính được giải phẫu trên hình, mỗi cụm ký hiệu một dòng, cùng màu với thứ tương ứng trên hình.
- [ ] Đọc `visual` từng dòng: ≤ 1 thay đổi trên hình mỗi dòng; mọi con số mới đều có một thay đổi trên hình làm nguyên nhân; nhãn ≤ ~5 từ; nhãn hết vai trò có lúc gỡ.
- [ ] `text` là ghi chú ngắn (≤ ~35 ký tự, ký hiệu), không chép `speak`, không lặp thứ đã có trên hình.
- [ ] Hiện tượng mở đầu đúng thật, có nguồn; beat `GIẢI ĐÁP` giải đúng hiện tượng đó bằng kiến thức của video, nói rõ bước nào dùng ý nào.
- [ ] `GIẢI ĐÁP` đưa ra đáp án cụ thể (con số có nguồn) cho đúng câu hỏi mở đầu và gọi tên nó bằng toán; số mở và kết không mâu thuẫn.
- [ ] Dòng cuối video là câu kết luận ngắn, khép lại câu hỏi mở đầu; không ý mới, không câu hỏi, không bỏ lửng.
- [ ] Định nghĩa/công thức chính thức có xuất hiện và được gắn lại với ví dụ.
- [ ] Phép thử tắt tiếng: mỗi con số có đơn vị và tên đại lượng *đọc được ở đâu đó trên màn hình* (trục, tiêu đề cột, chú giải, ký hiệu đã chú giải), mỗi ký hiệu có chú giải lần đầu, mỗi thành phần trong `visual` có chú thích — nhưng không chú thích lặp lại.
- [ ] Mỗi chỗ chuyển ví dụ → toán có bảng tương ứng trên màn hình và có bước thay số khớp kết quả cũ.
- [ ] Không có chỗ nhảy cóc: đọc lại trong vai học sinh trung bình xem lần đầu. Chỗ nào vội → giải thích chậm lại, cắt ý khác bù.
- [ ] Chỉ một ý bản chất chính; các ý đã cắt được liệt kê trong dàn ý.
- [ ] Beat nào cũng có `visual` là hình thật (không phải "hiện chữ"); có ít nhất 1 ví dụ đời thường và 1–3 điểm hài.
- [ ] Không beat nào thừa (đã thử bỏ từng beat).
- [ ] Không có từ xưng hô.
- [ ] `speak` không còn ký hiệu toán; ký hiệu có chỉ số viết liền một cụm ("ích-không") hoặc nói theo nghĩa; mọi cụm có chữ "không" đứng cuối vế (sau nó là dấu câu, không phải động từ/tính từ); liệt kê các dòng này để B2 nghe thử trước.
- [ ] Đọc nhẩm mọi `speak`: không câu nào quá ~20 từ, không dấu phẩy chen giữa cụm nghĩa, ký hiệu lần đầu được đọc theo nghĩa; mỗi dòng ≤ 2 chỗ ngắt (đếm `,` `.` `:` `?` `...` giữa dòng); `...` ≤ 1 lần mỗi beat, không chen giữa cụm chặt; không có "Và/Mà/Còn" mở câu ngay sau câu hỏi.
- [ ] Tổng ký tự `speak` khớp thời lượng đã duyệt ở dàn ý (≈ 2700–4300).
- [ ] JSON hợp lệ; `slug` và `id` chỉ gồm `a-z 0-9 - _`; `id` liên tục.
- [ ] Ký hiệu, thuật ngữ khớp SGK 2018.
