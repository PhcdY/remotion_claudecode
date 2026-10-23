---
name: viet-kich-ban
description: Viết kịch bản video giải thích bản chất (Toán, Lý, Hóa, Sinh, Sử, Địa… — B1 của pipeline) thành src/videos/<slug>/script.json. Dùng khi người dùng đưa một chủ đề + ý bản chất muốn nói và cần kịch bản video, hoặc gõ /viet-kich-ban.
---

# B1 — Viết kịch bản video giải thích bản chất

Pipeline: **B1 kịch bản (skill này)** → B2 audio (`tao-audio`) → B3 dựng Remotion (`dung-video`).
Output duy nhất: `src/videos/<slug>/script.json`. Không tạo audio, không viết code Remotion.

**Mục tiêu duy nhất là trải nghiệm người xem**: xem một lần là hiểu, không lạc, thấy hay. Mọi luật dưới đây phục vụ điều đó; luật nào làm video sượng hơn trong một trường hợp cụ thể thì báo người dùng thay vì cố theo.

**Gói môn**: đọc `.claude/mon/<mon>.md` (Toán: `toan.md`) trước khi làm — phạm vi kiến thức, mẫu dựng khái niệm, đơn vị, cách đọc ký hiệu của môn đó. Chưa có gói → tạo từ `.claude/mon/_mau.md` cùng người dùng.
Lý do và lời góp ý gốc của từng luật: `.claude/lessons.md`.

## Bối cảnh

- Người xem: học sinh THPT ôn **THPTQG, TSA, HSA** (và các kỳ ĐGNL tương tự). Video đăng trên web 9Study.
- Mục tiêu: hiểu **vì sao**, để làm được cả bài lạ.
- Video ngang 16:9, **2:30 – 4:00**. Bước khó cần thêm thời gian thì thêm; vẫn không đủ thì **cắt ý phụ**, không nói nhanh hơn.
- **Không nhảy bước — điều kiện tiên quyết.** Mỗi bước chỉ dựa trên thứ người xem *đã* hiểu. Ký hiệu, hình, khái niệm nào cũng được giải thích riêng và có thời gian nhìn trước khi đem ghép.
- **"Dễ theo" chưa phải "hiểu".** Video giảng trơn tru làm người xem *tưởng* đã hiểu (nghiên cứu của Derek Muller, Veritasium). Vì vậy video cần chỗ để người xem tự nghĩ (câu hỏi đoán) và chỗ chạm vào cách hiểu sai — xem "Phần nên có".

## Đầu vào

Người dùng đưa: **chủ đề** + **ý bản chất muốn nói** (+ kỳ thi, độ dài, ghi chú nếu có).
- Thiếu ý bản chất → đề xuất 2–3 góc bản chất, hỏi chọn.
- Ý bản chất sai/thiếu chính xác → nói rõ chỗ sai, đề xuất phát biểu đúng trước khi làm tiếp.
- Video nằm trong chuỗi → xác định **bài trước đã dạy gì** (đọc `script.json` video trước) và **ý để dành bài sau**.

## Quy trình

### Bước 0 — Tìm ý (trước dàn ý)

1. **Nghĩ 6–8 hiện tượng mở đầu**, chấm từng cái (0–2 mỗi tiêu chí): đúng thật, có nguồn · gây tò mò, nêu được thành câu hỏi trong 15–20 s · qua ba phép thử của yêu cầu 1 · có hình cụ thể để dựng · kết được bằng một đáp án cụ thể (con số, kết luận nhìn thấy) · khớp lời hứa của tiêu đề. Chọn cái cao điểm nhất; giữ 2 phương án dự phòng.
2. **Chốt hình trung tâm và khoảnh khắc "à ra thế"**: một hình mang được ý bản chất (vd. kính lúp quanh điểm, dấu của tử và mẫu) và khoảnh khắc người xem *thấy* ra lý do. Thiết kế ngược từ khoảnh khắc này: mọi beat trước nó chuẩn bị đủ thứ để nó "nổ".
3. **Cách hiểu sai phổ biến** của chủ đề (nếu có): học sinh hay nghĩ gì, đề thi hay bẫy gì.

### Bước 1 — Dàn ý (dừng lại chờ duyệt)

Phần lớn lỗi người dùng bắt được là lỗi dàn ý; viết xong lời mới phát hiện thì phải làm lại B1–B3. Dàn ý bày đủ:

1. **slug**, **tiêu đề**, **môn** (`subject`).
2. **Vị trí trong chuỗi**: bài trước đã dạy gì (chỉ nhắc một dòng) · khái niệm mới · ý để dành bài sau.
3. **Hiện tượng**: bảng chấm 3 ý tốt nhất ở Bước 0 (ý chọn + 2 dự phòng), nguồn kiểm chứng, đáp án sẽ đưa ở `GIẢI ĐÁP`, kết quả ba phép thử (mỗi phép một câu).
4. **Hình trung tâm + khoảnh khắc "à ra thế"** (beat nào).
5. **Ví dụ xuyên suốt** và danh sách **cảnh** (≤ ~3): cảnh sau nối từ cảnh trước bằng bước nào; có đổi sang mô hình không.
6. **Đường hiểu**: tiền đề → các bậc hiểu lần lượt → sau video làm được gì (một câu, gắn với dạng bài nào). Đánh dấu **bước khó**.
7. **Chuỗi "vì sao"**: từng mắt xích, mỗi mắt xích một dòng, xuất phát từ thứ học sinh nhớ.
8. **Giải phẫu định nghĩa/công thức trên hình**: cụm nào ↔ thứ gì trên hình.
9. **Cách hiểu sai / câu hỏi đoán**: có hay không, đặt ở đâu (Phần nên có).
10. **Phần đề thi** (yêu cầu 11): có hay không + lý do; nếu có: ví dụ và các bước cầu.
11. **Danh sách beat**: `section` · ý chính 1 câu · hình định dùng · câu nối với beat trước ("nên…" / "nhưng…").
12. **Ước lượng thời lượng**; **ý đã cắt** và lý do.

**Chờ người dùng duyệt** rồi mới viết đầy đủ. Người dùng bảo làm luôn → vẫn viết dàn ý ra trước (đầu báo cáo) và đi theo nó.

### Bước 2 — Viết `script.json`

Theo schema và quy tắc bên dưới. File đã tồn tại → hỏi trước khi ghi đè.
- **Sửa một phần kịch bản** → beat giữ nguyên cũng rà lại theo quy tắc hiện tại và theo những gì beat mới đã (hoặc chưa) dạy.
- **Rút thời lượng** → cắt ý phụ; không cắt bước giải thích của ý chính, không cắt hình so sánh.

### Bước 3 — Gọt, kiểm, báo cáo

1. **Vòng gọt**: đọc lại từng dòng, bỏ từ thừa, câu nhắc lại không kèm hình mới, ý phụ; mục tiêu gọn ~10% số ký tự `speak`. Không cắt mắt xích "vì sao", không cắt hình so sánh.
2. **Đọc mạch**: đọc liên tiếp câu đầu của mọi beat — phải nghe thành một mạch nhân quả.
3. **Theo dõi người xem**: đi từng dòng, ghi "lúc này người xem đang nhìn gì, đã hiểu gì, đang thắc mắc gì, hình trả lời thế nào". Dòng nào dùng thứ chưa giải thích → chèn bước thiếu.
4. `python scripts/check_script.py <slug>` — **lỗi phải bằng 0**; từng cảnh báo hoặc sửa, hoặc ghi lý do giữ.
4b. **Học sinh ảo**: gọi agent `hoc-sinh-ao` (Agent tool, `subagent_type: "hoc-sinh-ao"`), đưa đường dẫn `script.json` và **tiền đề** (học sinh đã học gì, bài trước dạy gì, chưa học gì). Agent đọc độc lập, không thấy dàn ý. Sửa mọi chỗ mức *nặng* và *vừa*; chỗ giữ nguyên thì ghi lý do trong báo cáo. Đoạn "giải thích lại ý chính" của agent mà lệch ý bản chất → video chưa dạy được ý đó, quay lại chuỗi "vì sao". Sửa nhiều thì gọi lại một lần nữa.
5. Chạy checklist cuối file (phần máy không kiểm được).
6. Báo: số beat, số ký tự `speak`, thời lượng ước tính, **danh sách dòng cần nghe thử** (script in sẵn) và **mọi chỗ còn nghi ngờ**.

Người dùng chốt kịch bản → sang **B3 bản nháp + storyboard** (skill `dung-video` › Bước 2b), duyệt hình xong mới tạo audio (B2). Góp ý ở storyboard về chữ/lời/nhịp sửa ở đây, chưa tốn credit giọng đọc.

## Schema

```jsonc
{
  "slug": "don-dieu",                    // chữ thường, số, '-'
  "title": "…",
  "subject": "toan",                     // tên gói môn trong .claude/mon/ (thiếu = "toan")
  "exams": ["THPTQG", "TSA", "HSA"],
  "beats": [
    {
      "id": "b01",                       // b01, b02, … liên tục
      "scene": 1,                        // số cảnh; beat liền nhau cùng cảnh thì hình nối liền, không nháy
      "section": "HIỆN TƯỢNG",           // nhãn bên dưới
      "keyword": "Nhưng vì sao?",        // câu chốt của beat, ≤ 6 từ, được dùng $...$
      "visual": "cảnh, bố cục, thành phần lúc beat bắt đầu", // quy tắc `visual`
      "lineGap": 0.5,                    // TUỲ CHỌN: nghỉ giữa các dòng (giây, ≤ 0,5), chỉ cho chuỗi "vì sao"
      "lines": [
        {
          "show": "MỘT thay đổi trên hình ở dòng này, vd. 'tô đoạn (1; 3) màu tăng'; không đổi: 'giữ nguyên'",
          "cue": "TUỲ CHỌN: cụm nguyên văn trong speak — thay đổi vào đúng lúc giọng nói tới cụm này",
          "text": "chữ mới hiện trên hình ở dòng này, $...$ cho toán; \"\" nếu không có",
          "at": "vật mà text gắn vào, vd. 'đỉnh (3; 6)' — bắt buộc khi có text",
          "speak": "lời đọc, không ký hiệu",
          "caption": "TUỲ CHỌN: phụ đề khi `speak` có phiên âm ký hiệu",
          "pauseAfter": 1.5              // TUỲ CHỌN: nghỉ thêm sau dòng (giây, ≤ 2), chỉ sau câu hỏi đoán
        }
      ]
    }
  ]
}
```

`speed` (tốc độ đọc riêng của beat) **không dùng**: làm chậm bằng cách chia nhỏ dòng, không bằng đọc rề rà.

## Khung nội dung — bắt buộc

Thứ tự và số phần tuỳ chủ đề, nhưng **bắt buộc có** (số thứ tự được skill khác dẫn tới, giữ nguyên):

1. **Mở bằng một hiện tượng thật chưa có lời giải** (beat `HIỆN TƯỢNG`, ≤ 20 s): hiện tượng, ứng dụng, fun fact trong đời sống/khoa học/lịch sử mà chính ý bản chất của video giải thích được ở mức THPT; nêu thành **câu hỏi**, giữ đáp án tới cuối.
   - **Đúng thật**: kiểm bằng nguồn tin cậy, ghi nguồn trong dàn ý. Không bịa, không phóng đại, không gán cho kiến thức vai trò nó không có ngoài thực tế. Không tìm được → báo người dùng.
   - **Ba phép thử**: *đúng bậc khái niệm* (lời giải không cần kiến thức bậc trên cái đang dạy) · *kiến thức cần thiết* (bỏ kiến thức của video đi, người xem không tự trả lời được bằng lẽ thường) · *đại lượng hiển nhiên* (thứ gán cho khái niệm đúng là nó một cách trực tiếp, không phải đi qua một định luật chưa dạy).
   - Lý do người xem cần quan tâm phải rõ trong **30 giây đầu**. Không mở bằng "Hôm nay chúng ta học…".
2. **Trực giác trước, định nghĩa/công thức sau** (trừ công thức bài trước, hiện ngay làm mốc — yêu cầu 5).
3. **Một ví dụ xuyên suốt**:
   - **một** nhân vật/vật mang được hiện tượng, số liệu, định nghĩa, đề thi và giải đáp; cả video ≤ ~3 cảnh; không nhân vật trang trí;
   - hiện tượng thật không có công thức → dùng **mô hình của chính vật đó**. **Đổi sang mô hình là bước khó, có beat riêng**: nói vì sao cần mô hình; nói thẳng "đây không phải số liệu thật", đổi hình nhân vật, giữ nhãn "mô hình"; cho vài con số trước rồi mới tới công thức; có một dòng "thở";
   - hình biểu diễn mới nối với hình cũ bằng bước người xem tự hiểu (lấy số từ hình cũ → bảng nhỏ → chấm điểm → nối đồ thị);
   - **không phép biến hình lạ mắt** (xoay, gập, cuộn hình); trục, nhân vật luôn ở tư thế quen thuộc.
4. **Cầu nối ví dụ → ký hiệu/thuật ngữ**, mỗi khi chuyển từ đời thường sang ngôn ngữ môn học: tương ứng tường minh trên màn hình ("quãng đường ↔ $f(x)$"); mỗi ký hiệu mới giải thích bằng chính ví dụ; thay số của ví dụ vào, ra đúng kết quả người xem đã thấy, **rồi** mới phát biểu tổng quát. Mỗi dòng ≤ một ký hiệu mới; mỗi beat ≤ một khái niệm mới.
5. **Tiền đề — nhắc đúng mức**: kiến thức bài trước trong chuỗi chỉ nhắc **một dòng**, công thức hiện trên màn hình làm mốc, không dựng lại. Kiến thức cũ hơn không có video riêng → nhắc ngắn bằng trực giác ngay trước khi dùng. **Không dạy công cụ của bài khác**: chỉ nói kết quả và cho thấy trên hình. **Không dùng kiến thức ngoài chương trình**, kể cả "để hiểu".
6. **Định nghĩa phải xuất hiện, và được giải phẫu trên hình** (khái niệm mới của video):
   - đi tới nơi: định nghĩa/định luật chính thức hiện trên màn hình với ký hiệu chuẩn SGK;
   - sau đó quay lại hình và chỉ từng cụm là *thứ gì nhìn thấy được*, **mỗi dòng một cụm**, cụm trên công thức và thứ trên hình sáng cùng màu cùng lúc. Cụm nào không chỉ được lên hình thì chưa được giải thích;
   - **từng thành phần trước, rồi mới tới phép ghép**: hiệu, tổng, thương, quan hệ chỉ nhắc khi mọi thành phần đã có nghĩa + vị trí trên hình + một con số. Dựng theo đúng thứ tự phép tính (mẫu từng môn ở gói môn).
7. **Khái niệm mới định nghĩa bằng hình trước khi dùng**: dòng riêng nói *nó là gì* và hình chỉ đúng nó, rồi mới nói nó *bằng gì / dùng làm gì*. Mọi câu "A chính là B" phải được **cho thấy** trên hình.
8. **Người xem luôn biết đang xem gì**: hình, bảng, công thức hay bước mới → câu đầu của beat nói rõ đó là gì, để làm gì. Không để hình mới hiện mà lời chưa giới thiệu.
9. **Nhịp hình: mỗi dòng tối đa một thay đổi trên hình**, và thay đổi đó là *nguyên nhân* nhìn thấy được của con số/kết luận dòng đó nói. Không để số, điểm, hàng bảng tự hiện liên tiếp mà hình không làm gì.
10. **Chữ sống trong cảnh** — xem quy tắc `text`. Phép thử tắt tiếng: chỉ nhìn màn hình vẫn biết mỗi con số, ký hiệu, hình là gì.
11. **Liên hệ đề thi bằng một ví dụ cụ thể — chỉ khi dạng bài dùng đúng khái niệm của video.** Video chỉ nêu bản chất một khái niệm → không có phần đề thi, không mượn dạng bài của bài khác. Nếu có:
    - vẫn trong ví dụ xuyên suốt (dạng bài kể lại bằng chính nhân vật của video);
    - **chuyển sang đề thi là bước khó**: thứ phần trước chưa dạy (một số → một hàm, đổi ví dụ, giá trị âm…) cần dòng riêng trước khi dùng — mẫu ở gói môn;
    - kết luận rút ra phải có hình so sánh cụ thể, không chỉ đọc bằng lời; không liệt kê nhiều dạng bài; không bịa đề thật, không ghi năm/mã đề.
12. **Kết bằng giải đáp rồi câu chốt**:
    - beat `GIẢI ĐÁP` quay lại đúng hiện tượng mở đầu (cùng hình), giải bằng kiến thức vừa giảng, nói rõ bước nào dùng ý nào;
    - trả lời thẳng câu hỏi mở đầu bằng **đáp án cụ thể** (số có nguồn), rồi gọi tên nó bằng kiến thức vừa học; số mở và kết **nhất quán**;
    - **dòng cuối nghe như kết**: câu kết luận ≤ ~15 từ, khẳng định, mở bằng từ khép lại ("Vậy…", "Nói gọn lại…", "Đó là lý do…"); không ý mới, không câu hỏi, không "tiếp theo".

### Bước khó và chuỗi "vì sao"

**Bước khó** (đổi mô hình, khái niệm mới, giải phẫu định nghĩa, chuyển ví dụ → ký hiệu, chuyển sang đề thi): tách nhiều dòng, mỗi dòng một ý, sau ý nặng nhất một dòng ngắn để kịp nạp. Đánh dấu "BƯỚC KHÓ" trong dàn ý và `visual`.

**Chuỗi "vì sao" là bước khó nhất, chậm nhất**:
- **mỗi mắt xích một dòng** (≤ ~12 từ, 0–1 chỗ ngắt), có con số hoặc dấu cụ thể nhìn thấy trên hình, rồi một dòng nói lại bằng lời thường;
- **ít nhất 2 beat**, cắt ý khác để bù;
- "chậm" = **chia nhỏ nhịp**, không phải nói chậm: thêm dòng, giới thiệu từng thành phần riêng, có câu hỏi dẫn ("Còn bên trái thì sao?"), có câu chốt; được đặt `lineGap` ≤ 0,5;
- lập luận **đi thẳng từ thứ học sinh nhớ** (công thức, định luật hiện trên màn hình), không vòng qua con số trung gian. Mẫu đã được chốt: gói môn.

## Phần nên có (khuyến nghị — dùng khi hợp, đừng ép)

- **Cách hiểu sai phổ biến** (`GỐC RỄ` hoặc `BẪY THƯỜNG GẶP`): khi chủ đề có cách nghĩ sai mà học sinh hay mắc. Đưa nó ra như một cách nghĩ hợp lý, kể bằng lời thường như học sinh vẫn nghĩ; cho thấy trên hình nó dẫn tới đâu; rồi cho nó vỡ bằng một phản ví dụ nhìn thấy được. Không chế giễu, không "nhiều bạn sai". Đây là cách có bằng chứng mạnh nhất để người xem hiểu thật, nhưng chỉ dùng khi cách hiểu sai có thật — không dựng một cách hiểu sai để có mà phá.
- **Câu hỏi đoán** (1–2 lần mỗi video), ngay trước khoảnh khắc "à ra thế" hoặc trước khi lật cách hiểu sai. Để không sượng:
  - hỏi **cụ thể, trả lời được bằng mắt** trên hình đang có, 2–3 khả năng hiện sẵn trên hình (hai điểm, hai đường): "Điểm nào cao hơn?", "Đi tiếp thì lên hay xuống?". Không hỏi mở ("Theo bạn thì sao?");
  - viết như người giảng tự đặt câu hỏi, không xưng hô, không câu mồi ("Câu trả lời sẽ khiến bạn bất ngờ");
  - dòng câu hỏi có `pauseAfter` 1–2 s; hình trong khoảng nghỉ chỉ làm sáng lần lượt các khả năng, không lộ đáp án;
  - đáp án tới **ngay dòng sau**, bằng hình trước, lời sau;
  - B2 nghe thử riêng dòng câu hỏi: giọng không lên ở cuối câu, nghe ngang → đổi thành câu dẫn khẳng định ("Để ý điểm bên phải.").
- **Ý để dành bài sau**: nói qua trong một beat ngắn (≤ ~15 s) **trước** phần đề thi/giải đáp, ngay chỗ nó tự xuất hiện trên hình: hiện tượng trên hình + tên gọi + "bài sau sẽ nói rõ". Không giải thích dở dang, không đặt ở dòng cuối.
- **Beat "dừng lại"** sau ý then chốt: nói lại ý đó bằng lời thường và một góc nhìn khác của cùng hình.

### Nhãn `section`

`HIỆN TƯỢNG` · `CÂU HỎI` · `GỐC RỄ` · `TRỰC GIÁC` · `BẢN CHẤT` · `ĐỊNH NGHĨA` · `CÔNG THỨC` · `VÍ DỤ` · `TRONG ĐỀ THI` · `BẪY THƯỜNG GẶP` · `GIẢI ĐÁP` · `TỔNG KẾT`
Chỉ `TRONG ĐỀ THI`, `BẪY THƯỜNG GẶP`, `GIẢI ĐÁP` hiện cho người xem (thẻ mở beat ~1 s); còn lại dùng nội bộ.

## Style

Ưu tiên khi xung đột:
1. **Bản chất**: trả lời được "vì sao"; câu chốt là *lý do*, không phải công thức lặp lại.
2. **Dễ hiểu**: học sinh trung bình xem một lần là hiểu; mỗi beat một ý mới; thuật ngữ giải thích ngay lần đầu.
3. **Minh hoạ để giải thích, không để trưng**: beat nào cũng có hình; ưu tiên hình chuyển động/biến đổi nhưng ít thay đổi, mỗi thay đổi chậm và có nghĩa. Hình nói, chữ chỉ ghi chú.
4. **Thực tế**: mở và kết bằng hiện tượng thật; giữa video neo vào chính ví dụ xuyên suốt.
5. **Không cố gây cười**: ví dụ đơn giản, nói thẳng; không câu đùa, so sánh bất ngờ, tình huống hài.
6. **Không lan man, nhưng không vội**: beat nào bỏ đi mà người xem không hiểu kém đi → cắt; mọi bước suy luận nói thành lời; một video chỉ **một ý bản chất chính** + 1–2 hệ quả.

**Mạch nhân quả giữa các beat**: mỗi beat mở bằng lý do nó tồn tại so với beat trước — "nên…", "nhưng…", "vậy thì…", "còn… thì sao?" — không "tiếp theo", "bây giờ ta sẽ".

**Giọng văn**: trung tính, không xưng hô ("bạn", "các em", "mình", "chúng ta", "tôi"); câu khẳng định hoặc câu hỏi không chủ ngữ. Giọng giảng mang tính tài liệu: điềm tĩnh, rõ, có nhấn nhá — như phim tài liệu khoa học kể cho người đang tò mò. Không dồn dập, không quảng cáo, không rào đón, không "rất dễ thôi".

## Quy tắc từng trường

### `text` — chữ mới hiện trên hình ở dòng này

Không có dải phụ đề ghi chú; chữ nằm **trong cảnh, cạnh thứ nó nói tới** (người xem học tốt hơn khi chữ đặt sát hình liên quan và khi màn hình không in lại câu đang đọc).
- Mỗi chữ phải **gắn với một vật trên hình**: nhãn kết quả cạnh thứ sinh ra nó ("$f'(2) = 3$" cạnh điểm), dấu/biến đổi trên công thức đang có, chú thích một thành phần. `visual` ghi rõ `text` dòng N gắn vào đâu.
- **Có `text` khi dòng chốt một kết quả nhìn được** (số, dấu, ký hiệu, kết luận); **`""`** khi dòng chỉ dẫn dắt, chuyển ý, hỏi, hoặc hình đã nói đủ. Dòng cuối beat: `keyword` hiện → `text` để `""`.
- Ưu tiên ký hiệu, số, mũi tên: "0,81 s → 44 km/h", "$\Delta t \to 0$". Không viết lại câu của `speak`. ≤ ~35 ký tự (dòng chỉ có công thức được dài hơn), không dấu chấm.
- **Một thông tin chỉ nằm một chỗ**: nhãn/trục đã có số thì `text` không ghi lại.
- **Mũi tên → chỉ đúng nghĩa** (dồn về, suy ra, đổi thành), không dùng cho "để dành bài sau", "tức là".
- Chữ hết vai trò thì gỡ (`visual` ghi lúc nào mờ đi). Mỗi frame, chữ mới ngoài câu chốt ≤ ~8 từ.
- Tên đại lượng chú thích **một lần** ở chỗ cố định (tên trục, tiêu đề cột, chú giải ký hiệu), sau đó chỉ dùng ký hiệu. Chú giải đọc lên có nghĩa ("quãng đường $s$ (m)"), không viết tắt kiểu "$s$: m · $t$: s".

### Số và đơn vị

Luật chung cho mọi môn; gói môn có thể thay (vd. Toán: mô hình trừu tượng dùng số trơn).
- **Số liệu thật** (hiện tượng, giải đáp, ví dụ đời thực) **luôn có đơn vị**, là đơn vị người ta dùng ngoài đời cho đúng thứ đó (tốc độ xe km/h, chiều cao m, quãng đường dài km, nhiệt độ °C).
- Chỉ dùng **đơn vị có thật**, chọn tiền tố để số gọn (≈ 0,1–1000): "5 km", không "5000 m". **Không bội số tự chế** ("trăm m", "chục giây"). Không đổi đơn vị qua lại để số đẹp; cần đổi để người xem cảm nhận (m/s → km/h) thì dòng riêng.
- **Đơn vị nói một lần ở chỗ cố định**: tên trục "thời gian $t$ (s)", tiêu đề cột bảng, hoặc câu kiểu SGK "($t$ tính bằng giây, $s$ tính bằng mét)" cạnh công thức. Sau đó số trên trục, nhãn sát trục, ô bảng **không lặp đơn vị**.
- Số đứng riêng, không có trục/tiêu đề nào chú thích (kết quả, đáp án, số liệu thật) → **luôn kèm đơn vị**, số và đơn vị đi liền.
- Cách ghi: ký hiệu đơn vị, không viết chữ ("12,3 m/s", không "12,3 mét/giây"); một khoảng trắng giữa số và đơn vị ("44 km/h", "30 °C"), trừ độ góc ("45°"); dấu phẩy thập phân; tránh số > 4 chữ số (đổi tiền tố hoặc làm tròn); ≤ 2 chữ số thập phân trừ khi chính chữ số đó là điểm cần thấy (10,05). Trong `text`, đơn vị đặt **ngoài** `$...$` ("$v = 12{,}3$ m/s") để cùng font, đứng thẳng.
- Một khung hình giữ tối đa ~3 con số có nghĩa cùng lúc.
- `speak` đọc đơn vị đầy đủ theo cách nói: "bốn mươi ki-lô-mét một giờ", "mười hai phẩy ba mét mỗi giây".

### `speak` — lời cho TTS đọc

Nội dung tương đương ý của dòng, đọc tự nhiên. **Không chứa ký hiệu** (`$ \ ^ _ { } = + / ' √ < >`) — script B2 chặn. Cách đọc ký hiệu, công thức, tên riêng: **gói môn**; mặc định nói theo nghĩa, không đọc chữ cái.

**Viết cho tai nghe**:
- **Ít chỗ ngắt**: mỗi `,` `.` `:` `?` `...` giữa dòng làm giọng dừng ≈ 0,3–0,4 s. Mỗi dòng **≤ 2 chỗ ngắt, nên là 1**; câu ≤ ~20 từ; mỗi dòng thường là một câu.
- Dấu phẩy chỉ ở ranh giới cụm nghĩa lớn nhất, ngay trước phần quan trọng nhất. Không tách danh từ khỏi phần bổ nghĩa, số khỏi đơn vị.
- Không mở câu bằng "Và", "Mà", "Còn" ngay sau một câu hỏi trong cùng dòng.
- **`...` để ngắt rồi nhấn — tối đa 1 lần mỗi beat**, trước cả một cụm trọn nghĩa hoặc sau từ chuyển ý ("Tức là... vận tốc trung bình mười lăm mét một giây."); không đặt giữa cụm chặt ("đo... kiểu gì" ✗).
- Từ chuyển ý ("Vậy thì", "Nhưng", "Tức là", "Để ý") để câu dính thành mạch; chúng cũng tính là chỗ ngắt.
- Không chèn thẻ điều khiển (`<break>`…). Nhịp chỉ đến từ dấu câu và cách viết.

### `caption` (tuỳ chọn)

Phụ đề đầy đủ xuất thành file riêng (`.srt`/`.vtt`) từ `speak`. Dòng nào `speak` có phiên âm ký hiệu ("ích-không", "f của x") → thêm `caption` viết như phụ đề thường ("Tại x₀, đạo hàm bằng 10."). `check_script.py` báo dòng thiếu.

### `keyword`

≤ 6 từ, là *kết luận* của beat (beat hook được là câu hỏi), không lặp nguyên văn một dòng `text`. B3 hiện nó thành câu chốt trong vùng hình lúc đọc dòng cuối.

### `scene`, `visual`, `show`, `at` — đủ cụ thể để dựng mà không phải đoán

- **`scene`**: số cảnh (1, 2, 3; ≤ ~3 cả video). Các beat liền nhau cùng cảnh được dựng như một sân khấu liền: vật ở lại và biến đổi, không xoá vẽ lại.
- **`visual`** (beat): mở bằng tên cảnh ("CẢNH 2 — …" lần đầu, "Giữ CẢNH 2." sau đó), rồi tả **trạng thái lúc beat bắt đầu**: bố cục, trục, hàm, thành phần, thứ gì từ beat trước còn ở lại / mờ đi. Đánh dấu "BƯỚC KHÓ". Thay đổi theo từng dòng **không** viết ở đây.
- **`show`** (dòng): **đúng một thay đổi** trên hình, viết ngắn, động từ + vật + vai trò màu ("điểm (2; 4) sáng màu tăng", "khung soi co về quanh đỉnh", "giữ nguyên"); thay đổi đó là *nguyên nhân* nhìn thấy được của con số/kết luận dòng đó nói. Có chữ "rồi", "đồng thời", ";" là đang gói hai thay đổi → tách dòng (`check_script.py` cảnh báo). Bảng/nhãn đổi số thì hình đổi tương ứng trong cùng `show`.
- **`cue`** (dòng, tuỳ chọn): cụm **nguyên văn** trong `speak` mà thay đổi của `show` phải vào đúng lúc giọng nói tới (vd. dòng "Vậy ba là điểm cực đại, còn sáu là giá trị cực đại." + `cue: "giá trị cực đại"` → nhãn đổi khi giọng nói cụm đó, không phải ngay đầu câu). Dùng khi chữ/hình quan trọng nằm ở **nửa sau** câu, hoặc câu nhắc tới hai thứ lần lượt; thiếu `cue` thì thay đổi vào đầu dòng. Hình và lời phải tới cùng lúc: hình vào trước lời thì người xem nhìn mà chưa biết nhìn gì, vào sau thì nghe mà chưa thấy.
- **`at`** (dòng): vật mà `text` gắn vào ("đỉnh (3; 6)", "cột $f(x_0)$", "công thức, dưới mẫu số"); bắt buộc khi có `text`.
- Số liệu cụ thể: hàm, khoảng vẽ trục, toạ độ, giá trị — đúng toán/khoa học (kiểm ở checklist).
- Màu ghi theo **vai trò** ("màu nhấn", "màu leo/hạ", "màu tử/mẫu"), không mã màu.
- Chú thích từng thành phần, ghi rõ chữ sẽ hiện; nhãn trên hình ≤ ~5 từ; thông tin hết vai trò thì ghi lúc gỡ; vật quá gần nhau → ghi cách tách.
- Nhân vật/vật minh hoạ phải có vai trò: ghi nó biểu diễn đại lượng nào, chuyển động theo quy luật nào.
- Giải phẫu định nghĩa: mỗi dòng ghi cụm nào sáng lên và thứ gì trên hình sáng cùng màu.
- Chuyển cảnh bằng bước giải thích được, không phép biến hình. Phóng to: kiểu **kính lúp** (hình gốc giữ nguyên, khung soi co dần, ô phóng cạnh bên có vạch chia).
- Không thẻ/tag trang trí.

## Độ dài

- **2:30 – 4:00** (cả intro/outro). Vượt 4:00 → báo kèm đề xuất ý phụ có thể cắt. Người dùng yêu cầu khác → theo người dùng.
- Giọng Vivibe ≈ 20 ký tự/giây (đo 19–22/10/2026) → **≈ 2700–4300 ký tự `speak`**. 8–16 beat; `HIỆN TƯỢNG` ≤ 20 s, `GIẢI ĐÁP` 15–30 s, không beat nào > 40 s. `check_script.py` ước lượng sẵn.

## Checklist (phần `check_script.py` không kiểm được)

**Nội dung**
- [ ] Mọi mệnh đề, công thức, số liệu trong `text` và `visual` đúng; có tính toán thì kiểm bằng Python/sympy, không tính nhẩm. Hình khớp số (điểm nằm trên đồ thị, dấu từng khoảng…).
- [ ] Không kiến thức ngoài chương trình; không dạy công cụ bài khác; không giảng lại bài trước. Thuật ngữ khớp SGK (gói môn).
- [ ] Hiện tượng đúng thật, có nguồn, qua ba phép thử; lý do quan tâm rõ trong 30 giây đầu.
- [ ] `GIẢI ĐÁP` giải đúng hiện tượng đó, đáp án cụ thể có nguồn, số mở–kết nhất quán; dòng cuối là câu kết luận khép lại câu hỏi mở đầu.
- [ ] Có hình trung tâm và khoảnh khắc "à ra thế"; các beat trước chuẩn bị đủ cho nó.

**Không nhảy bước**
- [ ] Đã theo dõi người xem từng dòng; không dòng nào dùng thứ chưa giải thích.
- [ ] Chuỗi "vì sao" ≥ 2 beat, mỗi mắt xích một dòng, đi từ thứ học sinh nhớ, có dòng nói lại bằng lời thường.
- [ ] Mọi thành phần giải thích riêng trước khi ghép; mỗi khái niệm mới định nghĩa bằng hình; "A chính là B" được cho thấy.
- [ ] Đổi sang mô hình có beat riêng; phần đề thi (nếu có) có đủ bước cầu và hình so sánh.

**Hình và chữ**
- [ ] Một ví dụ xuyên suốt, ≤ ~3 cảnh, không nhân vật trang trí, không phép biến hình lạ mắt.
- [ ] `show`: đúng một thay đổi mỗi dòng, số mới nào cũng có thay đổi trên hình làm nguyên nhân; `text` nào cũng có `at`; beat cùng cảnh nối liền nhau.
- [ ] Phép thử tắt tiếng: mỗi con số có tên đại lượng/đơn vị đọc được ở đâu đó trên màn hình, đúng một lần.

**Lời đọc**
- [ ] Đọc liền câu đầu các beat thành một mạch nhân quả; không câu đùa; giọng tài liệu, không xưng hô.
- [ ] Câu hỏi đoán (nếu có) cụ thể, trả lời được bằng mắt, có `pauseAfter`, đáp án ở dòng sau, đã đưa vào danh sách nghe thử.
