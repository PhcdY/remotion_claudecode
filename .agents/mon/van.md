# Gói môn — Ngữ văn (ĐGNL & GDPT 2018)

Đọc kèm skill `viet-kich-ban` (B1), `tao-audio` (B2), `dung-video` (B3). Tài liệu này là **quy chuẩn cốt lõi** kết nối giữa **Biên kịch Văn (Non-tech)** và **Hệ thống Dựng Video (Tech Builder)**.
Bài học kinh nghiệm thực tế ghi tại: `.agents/lessons.md`.
Gói **thêm vào** luật chung; chỉ dòng nào trong mục **"Thay luật chung"** mới thay luật chung (skill `viet-kich-ban` › mục 0 › Ba tầng luật).

## 0. Thay luật chung

Chỉ áp cho video Văn. Giọng đọc giữ nguyên luật chung (trung tính, không xưng hô): độ cuốn của video Văn đến từ **hình và cách truyền tải**. Cách viết câu của lời giảng có luật riêng ở mục 1 › Hành văn.

| Luật chung | Gói thay thành | Áp cho | Lý do · ai chốt · ngày |
|---|---|---|---|
| `viet-kich-ban` › ≤ ~3 cảnh | ≤ 6 cảnh; **đổi cảnh khi đổi ý lớn**. Vẫn một ngữ liệu xuyên suốt, cảnh sau là cách nhìn khác của cùng ngữ liệu | mọi video | Video "Phân biệt tự sự, biểu cảm và miêu tả" dùng một tranh suốt 3:09, người xem chán · người dùng · 23/11/2026 |
| `dung-video` › quy tắc 9 (một thay đổi mỗi dòng) | Từ được bôi và phản ứng của tranh tính là **một** thay đổi. Một hành động có thể chạy qua nhiều dòng; `show` ghi điểm bắt đầu và lúc dừng | mọi video | Hình phải diễn cùng lời · người dùng · 23/11/2026 |
| `viet-kich-ban` › Câu hỏi đoán 1–2 lần | 2–3 lần, trả lời bằng thao tác trên hình (mục 1 › Hình kể chuyện, ý 4) | mọi video | Thêm chỗ cho người xem tự nghĩ · người dùng · 23/11/2026 |
| `viet-kich-ban` › Độ dài 2:30–4:00 (video hiện tượng) | 2:30–6:00 cho **mọi** video Văn (≈ 2700–6500 ký tự `speak`). Thời gian thêm dành cho đọc – bình – đọc lại và khoảng lặng sau câu trích, không dành cho ý phụ; vượt 6:00 thì đề xuất tách video | mọi video | Lời bình cần chỗ để câu chữ thấm, khoảng lặng và đọc lại làm video dài ra · người dùng · 27/11/2026 |
| `viet-kich-ban` › `pauseAfter` chỉ sau câu hỏi đoán | Dòng đọc nguyên văn ngữ liệu (có `quoteSource`) được `pauseAfter` 0,8–1,5 s | mọi video | Câu thơ cần một khoảng lặng để thấm trước khi phân tích · người dùng · 27/11/2026 |

Ngưỡng số cảnh, thời lượng, số ký tự ghi ở `.agents/mon/van.json`.

---

## 1. Tư duy kể chuyện & Trải nghiệm người xem (B1)

> [!IMPORTANT]
> **Video Văn không phải slide chữ, cũng không phải một tấm tranh zoom ra zoom vào.** Người xem thật (10/11/2026) chê video Văn "toàn thẻ chữ, như đọc bài giảng, đọc slide". Người dùng (23/11/2026) chê bản một tranh "zoom ra zoom vào, quá chán". Mỗi **ý lớn** cần một hình trung tâm: một vật hoặc một cách nhìn để ý đó gắn vào, biến đổi theo lời giảng.
> Cảm xúc vẫn do câu chữ của tác giả và giọng đọc gánh vác. Hình giúp người xem **thấy** cấu trúc, mạch ý và hình ảnh của tác phẩm.

### Hình kể chuyện (chốt 23/11/2026)

1. **Hình diễn theo lời.** Lời nói một hành động thì nhân vật làm hành động đó ("nắm tay" thì hai bàn tay nắm lại, "dẫn đi" thì hai người bước). Khoanh tròn hay zoom vào vật không tính là diễn.
2. **Đổi cách nhìn khi đổi ý.** Mỗi ý lớn có một khung hình riêng: toàn cảnh, đi ngang theo nhân vật, cận vật, góc nhìn nhân vật, sơ đồ. Chuyển bằng thứ có trong tác phẩm khi được (sương, gió, dòng nước), không dùng hiệu ứng lạ mắt. Camera zoom chỉ là một trong các cách, không dùng làm cách duy nhất.
3. **Không để hình đứng yên quá lâu.** Mục tiêu: khoảng 8–10 giây có một thay đổi **mang nghĩa** (vật làm gì, từ được bôi, cảnh đổi). Chuyển động nền nhỏ (gió, sương, lá) giữ cảnh sống nhưng không tính là thay đổi và không được giành mắt khỏi chỗ đang giảng. Không thêm chuyển động chỉ để cho vui.
4. **Tương tác bằng hình.** Câu hỏi đoán có các lựa chọn nằm ngay trên hình; trong `pauseAfter` các lựa chọn sáng lần lượt, không lộ đáp án; đáp án được **làm** trên hình (cụm đúng bay vào đúng vật, cảnh phản ứng), không chỉ đổi màu thẻ.
5. **Cảm xúc thể hiện qua cảnh vật.** Vẫn không vẽ mặt. Dùng màu cảnh, ánh sáng, nhịp chuyển động, dáng người (khựng lại, ngoái nhìn), khoảng cách giữa các vật.

**Mẫu được khen — "ngôi đền nghị luận"** (bài: ba yếu tố của văn nghị luận):
- Mái đền ghi "Bài văn nghị luận" lơ lửng, chưa có gì đỡ. Ba khung cột trống, đánh số 1–2–3, hiện ra.
- Từng cột dựng lên **đúng lúc giọng đọc gọi tên**: Luận điểm (biểu tượng tâm bia), Lí lẽ (mắt xích), Dẫn chứng (tờ tài liệu có dấu tích).
- Đủ ba cột thì mái hạ xuống, đặt vững, hiện nhãn "Vững ✓". Đó là khoảnh khắc "à ra thế": thiếu một cột thì bài văn đổ.
- Chữ chỉ là nhãn dán lên bộ phận của vật (tên cột, tính chất), không có thẻ chữ đứng riêng.

### Ba loại hình, chọn theo việc cần giải thích

1. **Hình tượng trưng cho khái niệm, cấu trúc** (dùng nhiều nhất): biến thứ trừu tượng (bố cục bài, quan hệ giữa các ý, mạch cảm xúc) thành một **vật quen thuộc có bộ phận**.
   - Gợi ý: ngôi nhà/đền (móng, cột, mái), cây (gốc → thân → cành), cầu thang (các bậc tăng dần), cán cân (hai vế đối lập), dòng sông (mạch chảy, khúc rẽ), xích/bánh răng (ý này kéo theo ý kia), la bàn/tấm bản đồ (hướng đi của bài).
   - **Mỗi bộ phận = đúng một ý**; bộ phận hiện ra đúng lúc lời gọi tên; khi đủ ý thì vật "đứng vững / chạy được / tới nơi", đó là câu chốt.
   - Theo loại 1 của skill `viet-kich-ban` › Hình và số tượng trưng: không gọi là "mô hình", không chú giải.
2. **Minh họa hình ảnh trong tác phẩm**: khi phân tích ngữ liệu có hình ảnh cụ thể (con thuyền, vầng trăng, dòng sông, ngọn đèn, mái tóc mẹ…).
   - Vẽ **chính hình ảnh đó** theo kiểu **tranh phẳng nhiều chi tiết**, đặt cạnh câu thơ chứa nó. Người xem thật (10/11/2026) chê bản icon trơn (thuyền = một hình bán nguyệt, người = khối tròn) là "quá đơn giản"; bản được duyệt có:
     - **chất liệu đọc được**: gỗ có vân/ván ghép, tre có nan đan, lá nón có gân, vải có nếp/hoa văn; mỗi vật 2–3 sắc độ cùng màu (sáng/vừa/tối), không đổ bóng hiện thực;
     - **chi tiết nhận diện văn hoá**: con đò có mui tre và mái chèo, bến có cọc và dây buộc, áo cánh – quần xắn – tay nải, áo dài có tà trước/tà sau, nón lá có quai, tóc dài;
     - **chuyển động nhỏ có nghĩa**: thuyền nhấp nhô, chèo khua khi thuyền đi, tà áo bay, bước chân; dừng khi vật đứng yên;
     - **người không vẽ mặt** (không mắt, mũi, miệng): đầu màu da + tóc/nón, dáng người và hướng nhìn kể chuyện (người ở lại quay về phía thuyền đi);
     - màu áo/viền của nhân vật là màu vai trò của vật tượng trưng cho họ (thuyền ↔ người ra đi cùng màu), để nối hai tầng nghĩa.
     - Mẫu: `src/videos/demo-van-an-du/Video.tsx` (ẩn dụ "Thuyền về có nhớ bến chăng"; thành phần `Boat`, `Dock`, `Boy`, `Girl`).
   - Từ trong câu và chi tiết trên hình **sáng cùng lúc, cùng màu** ("trăng" sáng ↔ vầng trăng hiện ra).
   - Hình đổi theo nghĩa: thuyền nhỏ dần khi đọc "xa", trăng khuyết dần thành tròn, đèn tắt khi câu thơ nói sự mất mát.
   - **Tránh**: người có khuôn mặt, biểu cảm chi tiết, phong cảnh tả thực nhiều lớp. Vẽ những thứ này bằng code dễ thành ngô nghê. Cần cảnh như thật (chân dung tác giả, tranh minh họa) thì dùng ảnh có sẵn do người dùng gửi (có quyền dùng), đặt trong `public/`, kèm nhãn nhỏ "Ảnh minh họa" (loại 2).
3. **Mổ xẻ trên câu chữ**: vệt highlight, tách vế, khung ngữ pháp (mục 3.1). Dùng khi chính câu chữ là bài học (biện pháp tu từ, phép đối, lỗi câu).
   - Kể cả khi đó, câu văn là **một phần của cảnh**, không phải cả màn hình là thẻ chữ: ghép với hình ảnh của từ đang phân tích (loại 2) hoặc với hình trung tâm (loại 1). Cách hiện và bôi: mục 3.4.

### Phép thử "slide chữ" và "một tranh"
- Chụp ảnh giữa một beat bất kỳ, tắt tiếng: nếu chỉ thấy các khối chữ xếp hàng thì **chưa đạt**. Phải có ít nhất một vật/hình mà chữ gắn vào.
- Xếp ảnh giữa các beat cạnh nhau: nếu mọi ảnh là cùng một tranh, chỉ khác độ zoom hoặc vòng khoanh thì **chưa đạt**.
- Ngữ liệu trên màn hình: tối đa 1–2 câu thơ/vế câu cùng lúc (mục 2).

### Hành văn: lời bình, không lời phân loại (chốt 27/11/2026)

Luật `speak` chung (văn nói, ≤ 2 chỗ ngắt, câu ≤ ~20 từ, không xưng hô) vẫn giữ. Mục này thêm cái riêng của Văn: người xem phải **nghe ra chỗ hay của câu chữ**, không chỉ biết nó tên là gì.
Nguồn tham khảo: Poetry Unbound (đọc – bình – đọc lại), hướng dẫn viết cho radio của CBC (nối câu bằng hình ảnh, không sến), Wikipedia "Signs of AI writing" và skill `viet-nhu-nguoi` (cụm sáo, khen chung).

1. **Cảm trước, giải thích sau, gọi tên cuối.** Thứ tự cho mỗi chỗ phân tích: đọc ngữ liệu → để người xem tự cảm (câu hỏi đoán hoặc một nhận xét về cảm giác) → chỉ ra chữ tạo nên cảm giác đó (bôi, mục 3.4) → nói vì sao chữ đó làm được thế → gọi tên biện pháp hay thuật ngữ nếu bài cần. **Câu chốt nói câu văn làm được gì**, không dừng ở tên biện pháp.
   - Không đạt: "Ở đây tác giả dùng phép điểm xuyết."
   - Đạt: "Nền xanh trải rộng, vài chấm trắng kéo mắt về gần. Chỉ thế thôi, bức tranh đã có xa, có gần." (`demo-van-canh-xuan`)
2. **Không lặp một khuôn gọi tên.** Khuôn "…, đó là X" / "…, gọi là X" dùng **tối đa 2 lần mỗi video** (`check_script` cảnh báo `[van:khuon-goi-ten]`). Các lần khác: tên khái niệm hiện bằng nhãn `MarginNote` còn lời nói việc câu văn đang làm, hoặc gọi tên ở đầu câu, hoặc nối tên vào lý do. Mỗi thuật ngữ của bài vẫn được **nói thành lời ít nhất một lần** (P0), các lần sau mới để nhãn gánh.
   | Khuôn lặp (đã gặp, `demo-van-doc-boi-rut`) | Cách khác |
   |---|---|
   | "Câu văn đang kể việc, đó là tự sự." | "Việc này nối tiếp việc kia. Kể việc như thế, người ta gọi là tự sự." |
   | "Không có việc gì xảy ra, chỉ có dáng vẻ của cảnh, đó là miêu tả." | "Không có việc gì xảy ra. Câu văn chỉ dừng lại để ngắm con đường." (nhãn *miêu tả* hiện cạnh con đường) |
   | "Cảnh không đổi, lòng người đổi, đó là biểu cảm." | "Con đường vẫn thế. Cái lạ nằm trong lòng đứa trẻ." (nhãn *biểu cảm*) |
   | Câu kết đọc lại cả bảng: "kể là tự sự, tả là miêu tả, bộc lộ là biểu cảm." | Một câu trả lời hook; ba nhãn đã có trên hình tự làm phần tổng kết. |
3. **Đọc – bình – đọc lại.** Ngữ liệu chính được đọc nguyên văn trọn câu trước khi phân tích, và **đọc lại một lần** sau khi đã phân tích xong ý lớn đó (hoặc ở GIẢI ĐÁP). Lần đọc lại, các vệt bôi và nhãn đã có trên hình, người xem nghe ra điều lần đầu chưa thấy. Mỗi video đọc lại tối đa 2 chỗ. Dòng đọc lại giữ nguyên `speak`, `text`, `quoteSource` của lần đầu.
4. **Câu trích có khoảng lặng.** Dòng đọc nguyên văn ngữ liệu có `pauseAfter` 0,8–1,5 s (mục 0); câu thơ ngắt theo nhịp thơ (mục 5). Lời giảng không chung một dòng với câu trích: câu trích một dòng, lời bình dòng sau.
5. **Nối câu bằng thứ câu trước để lại.** Câu sau mở bằng chữ hoặc hình ảnh mà câu trước vừa nói tới ("…con đường làng dài và hẹp." → "Con đường dài, kéo tít về phía xa."). Đó là mạch của bài bình. Không mở bằng "Tiếp theo", "Ngoài ra", "Bên cạnh đó".
6. **Nói cụ thể, không khen chung.** Phép thử: thay tên một tác phẩm khác vào câu mà câu vẫn đúng → câu rỗng, viết lại bằng chữ, hình ảnh có thật trong bài. Cụm sáo kiểu văn mẫu (`check_script` cảnh báo `[van:cum-sao]`):
   | Không nói | Nói thay bằng |
   |---|---|
   | "thể hiện sâu sắc", "khắc họa thành công", "góp phần làm nổi bật" | việc chữ đó làm: "làm con đường như dài ra", "kéo mắt về gần" |
   | "nghệ thuật đặc sắc", "độc đáo", "tinh tế", "tài tình" | chỉ ra chỗ khác thường: "chỉ một chữ *điểm* mà…" |
   | "giá trị nhân văn sâu sắc", "để lại ấn tượng sâu sắc" | điều người đọc nhận ra: "người đọc thương đứa trẻ hơn" |
   | "qua đó", "có thể nói", "nhìn chung" | "vậy", "tức là", hoặc bỏ |
7. **Không sến.** Cảm xúc do câu chữ của tác giả và hình gánh. Lời giảng không tự cảm thán ("thật xúc động", "đẹp biết bao", "ôi") và không chồng tính từ.
8. **Thử đổi chữ** (khi giải thích một chữ đắt). Đặt chữ của tác giả cạnh một chữ thường hơn, hình đổi theo chữ thay rồi trở lại ("điểm một vài bông hoa" → thử "có một vài bông hoa": các chấm trắng nhòe vào nền, mắt không còn chỗ dừng → trả lại chữ "điểm"). Chữ thay hiện rõ là bản thử (gạch ngang, mờ, nhãn "thử đổi") để không lẫn với ngữ liệu (P0). Tối đa 1–2 lần mỗi video.
9. **Câu bình có nhịp nhờ cặp vế, không nhờ dấu phẩy.** Muốn câu có nhịp mà vẫn ≤ 2 chỗ ngắt: "không phải… mà là…", "càng… càng…", "vẫn… nhưng…", hai câu ngắn đặt cạnh nhau ("Cảnh không đổi. Lòng người đổi.").

---

## 2. Phạm vi kiến thức & Tài liệu tham khảo (B1)

- **Tài liệu tham khảo chuẩn**: Lưu tại `references/van/` gồm SGK 2018 (Kết nối tri thức, Cánh diều, Chân trời sáng tạo) và Đề thi Đánh giá năng lực (HSA, VNUHCM, SPT).
- Khi viết kịch bản, AI và Biên kịch **BẮT BUỘC tra cứu ngữ liệu trong thư mục này** để đảm bảo trích dẫn chính xác 100% nguyên văn bản tác phẩm, không nhớ mang máng hay sai lệch câu chữ.
- Thư mục chưa có văn bản đó: tra nguồn ngoài, ghi vào `quoteSource`, và **báo người dùng đối chiếu SGK** ở bước duyệt dàn ý. Các bản in và trang web có thể lệch nhau từng chữ (đã gặp 23/11/2026: "tự nhiên thấy lạ" và "tự nhiên tôi thấy lạ").
- **Tranh không được trái câu gốc.** Đọc cả câu trước khi vẽ: câu tả "sương thu và gió lạnh" thì không vẽ nắng rực.
- **Quy chuẩn trích dẫn ngữ liệu**:
  - Mỗi dòng hiển thị trên màn hình chỉ chứa 1 câu thơ, 1 vế câu hoặc 1 cụm từ then chốt (≤ 35 ký tự).
  - Tuyệt đối không bê nguyên cả khổ thơ hay đoạn văn 5–7 dòng lên màn hình (gây quá tải thị giác).
  - Tác phẩm hoặc ngữ liệu lạ phải ghi rõ tác giả trong nhãn nhỏ.

### Lời giảng và định nghĩa: dễ hiểu trước, từ hay sau
Luật chung ở skill `viet-kich-ban` › Style › Lời định nghĩa. Riêng Văn dễ mắc vì từ ngữ văn chương hay, nhưng **câu định nghĩa phải hiểu ngay khi nghe một lần**.
- Thuật ngữ SGK (cấu tứ, thi pháp, ngữ liệu, nhãn tự, biền ngẫu, luận điểm…) là thứ cần dạy: nói nghĩa bằng lời thường **trước**, rồi mới gọi tên.
- Từ văn chương hiếm (dư ba, chằn chặn, chiêm nghiệm, tầng sâu, mạch ngầm, hàm súc…) được dùng khi phân tích, đọc tác phẩm; **không dùng trong câu định nghĩa** hay câu giải thích lần đầu một khái niệm.

| Không viết | Viết |
| :--- | :--- |
| "Cấu tứ là sự tổ chức nội tại mang tính chỉnh thể của tứ thơ." | "Cấu tứ là cách nhà thơ sắp xếp ý và hình ảnh để dẫn tới điều muốn nói." |
| "Phép đối tạo nên sự cân xứng chằn chặn." | "Phép đối đặt hai vế cạnh nhau, dài bằng nhau, ý tương ứng với nhau." |

---

## 3. Mẫu dựng khái niệm (B1 + B3)

Các thao tác dưới đây dùng **bên trong** một cảnh có hình trung tâm (mục 1), không thay cho nó.

### 3.1. Thao tác trên từ ngữ & câu
* **Vệt quét highlight**:
  - Khi giọng đọc phân tích một từ quan trọng (từ hay nhất của câu thơ, từ Hán Việt, từ dùng sai): làm theo mục 3.4 (`QuoteMarker`), nhãn ghi chú (`MarginNote`) nói nghĩa của nó. Từ có hình ảnh → chi tiết tương ứng trên hình phản ứng cùng lúc.
* **Tách vế & căn đối xứng**:
  - Dành cho *phép đối (thơ Đường luật, câu đối, văn biền ngẫu)*: câu thơ tách làm hai vế, trượt sang hai bên và gióng thẳng hàng từng chữ (4 ∥ 4) để thấy các từ đứng cặp với nhau.
* **Bóc tách tầng nghĩa**:
  - Dành cho *biện pháp tu từ (ẩn dụ, hoán dụ, tượng trưng)*: dưới từ ngữ gốc hiện nghĩa thứ hai (nghĩa ngầm). Mũi tên nối hai tầng, nhãn nói điểm giống nhau. Có thể vẽ cả hai vật (vd. "mặt trời" thật ↔ người con).
* **Khung ngữ pháp**:
  - Dành cho *sửa lỗi câu, câu thiếu chủ – vị, lỗi quan hệ từ*: câu văn được đóng khung thành các khối nòng cốt ($S$ – $V$). Thành phần trạng ngữ ($TN$) thừa hoặc sai làm gãy câu hiện bằng màu cảnh báo.

### 3.2. Thao tác trên mạch ý & bố cục
* **Đường nối các từ khóa**:
  - Dành cho *cấu tứ bài thơ, phép liên kết câu/đoạn*: các câu thơ/câu văn đặt trên bố cục thoáng; đường nối mảnh hiện dần từ từ khóa câu 1 sang từ khóa câu 3, câu 4, để thấy các câu "móc" vào nhau thế nào.
* **Bốn phần của thơ Đường (Đề – Thực – Luận – Kết)**:
  - Bốn tầng, mỗi tầng một việc: Mở ra khung cảnh → Tả cận cảnh → Suy nghĩ rộng ra → Khép lại cảm xúc. Nên gắn lên hình trung tâm (bốn bậc thang, bốn đoạn đường…), không xếp thành bốn thẻ.
* **Bảng thuộc tính & loại trừ**:
  - Dành cho *dạng bài ĐGNL (chọn từ không cùng nhóm, tìm lỗi logic)*: 4 phương án xếp thành hàng hoặc lưới 2×2 cố định, dòng quét thuộc tính sáng lên, tích xanh các từ đạt, gạch đỏ từ lệch tiêu chí.

### 3.3. Liệt kê nhiều ý
Luật chung ở skill `dung-video` › quy tắc 3 (liệt kê). Với Văn: ưu tiên **gắn mỗi ý vào một bộ phận của hình trung tâm** (cột, bậc, cành). Không có hình phù hợp thì xếp hàng/cột cố định, chừa sẵn chỗ cho mọi ý, ý sau không đè lên ý trước.

### 3.4. Hiện và bôi keyword: đọc, bôi, rút (chốt 23/11/2026)

Muốn bôi thì trên hình phải có chữ để bôi: **B1 ghi rõ câu nào lên hình và cụm nào được bôi**, B3 không tự chọn.

1. **Đọc**: câu gốc hiện ở vùng sạch của cảnh trong lúc giọng đọc nguyên văn. Tranh giữ yên để mắt vào chữ.
2. **Bôi**: khi phân tích, phần còn lại của câu mờ đi, vệt màu chạy qua đúng cụm key theo `cue`, tranh phản ứng cùng lúc.
3. **Rút**: câu dài biến mất; cụm đã bôi còn lại thành **nhãn ghi chú** cạnh vật nó nói tới. Cuối phần chỉ còn các dấu hiệu cần nhớ.

| Việc | Quy định |
|---|---|
| Câu dài | Tối đa 2 dòng cùng lúc, mỗi dòng ≤ 35 ký tự. Dài hơn thì tách theo vế; vế cũ mờ rồi rút |
| Lượng bôi | Mỗi lần một cụm 2–6 từ, mỗi câu tối đa 2 cụm |
| Chỗ được bôi | Dấu hiệu nhận biết, từ đắt, chỗ dễ nhầm, đáp án. Không bôi từ nối, câu dẫn, tên tác phẩm |
| Màu | Mỗi màu một nghĩa suốt video; nhãn cuối dùng lại đúng màu của vệt bôi |
| Tiêu điểm | Lúc đang bôi, trong tranh chỉ một thứ chuyển động có nghĩa |
| Phần giảng không có câu gốc | Chỉ hiện từ khóa cạnh vật đang nói tới, không viết lại lời giảng lên hình |
| Không dùng | Bôi từng chữ theo giọng đọc (karaoke); cả câu đứng yên suốt đoạn; bôi cả thẻ |

**Nhãn ghi chú, không dùng thẻ/pill** (người dùng chê tag dạng viên thuốc "xấu, thô", 23/11/2026): chữ đặt thẳng trên vùng sạch của cảnh, kiểu ghi chú bên lề sách. Một đường dẫn mảnh cong từ vật tới chữ, tên khái niệm in Serif có màu, nét gạch tay mảnh dưới chữ vẽ dần. Không nền đặc, không viền hộp. Dùng `MarginNote`. Đường dẫn đi qua khoảng trống, không cắt ngang người hay chữ.

**Ghi ở dàn ý (B1)** để người dùng duyệt trước khi dựng, mỗi ý lớn một hàng:

| Ý lớn | Khung hình | Câu lên hình | Cụm bôi | Màu = nghĩa | Hình phản ứng |
|---|---|---|---|---|---|
| Tự sự | Đi ngang theo nhân vật | Mẹ tôi âu yếm nắm tay tôi dẫn đi | nắm tay tôi dẫn đi | vàng = hành động | Hai bàn tay nắm lại, hai người bước |
| Miêu tả | Nhìn dọc con đường | trên con đường làng dài và hẹp | con đường làng dài; và hẹp | xanh ngọc = đặc điểm | Lá đứng lại, đường vươn xa, hai mép khép vào |

**Ghi trong `script.json`** ở dòng bắt đầu bôi:

```json
{
  "show": "Vệt vàng chạy qua cụm nắm tay tôi dẫn đi, phần còn lại mờ đi",
  "cue": "nắm tay",
  "text": "Mẹ tôi âu yếm nắm tay tôi dẫn đi",
  "at": "phía trên hai mẹ con",
  "speak": "Bắt đầu từ nắm tay, dẫn đi.",
  "quoteSource": "Tác giả, tác phẩm, nguồn đã đối chiếu"
}
```

- `cue` nằm nguyên văn trong `speak`; cụm bôi nằm nguyên văn trong `text`. `QuoteMarker` báo lỗi khi cụm bôi không có trong câu.
- Dòng đọc nguyên văn hoặc nhắc tên tác phẩm có "tôi" sẽ bị `check_script` cảnh báo xưng hô. Cảnh báo này bỏ qua được khi "tôi" là chữ của tác giả; lời giảng của video vẫn không xưng hô.

---

## 4. Số và đơn vị

Môn Văn **không có đại lượng vật lý**, áp dụng các quy chuẩn sau:
- **Số đếm câu/dòng thơ**: Viết chữ số Ả Rập trong `text` và `caption` (vd: "câu 3 và 4", "nhịp 2/2/3"), trong `speak` viết rõ chữ ("câu ba và bốn", "nhịp hai hai ba").
- **Thế kỷ & Thời kỳ lịch sử**: Viết số La Mã trong `text` (vd: "Thế kỷ XX", "giai đoạn 1930–1945"), trong `speak` đọc thuần Việt ("thế kỷ hai mươi").
- **Năm sáng tác / Năm sinh mất**: Đặt trong ngoặc đơn nhỏ cạnh tên tác giả/tác phẩm (vd: *Nguyễn Du (1765–1820)*).

---

## 5. Đọc ký hiệu, tên riêng (B2)

1. **Ngắt nhịp thơ & nhịp câu**:
   - Bắt buộc dùng dấu phẩy `,` hoặc `...` để ép giọng đọc AI ngắt đúng nhịp thơ (2/2/3, 4/3, 3/3).
2. **Khoảng dừng (`pauseAfter`)**:
   - Thêm `"pauseAfter": 1.5` sau các câu hỏi tư duy hoặc trước khi công bố đáp án đúng.
3. **Phiên âm chuẩn xác**:
   - Tên tác giả nước ngoài, thuật ngữ phiên âm thuần Việt trong `speak` (để AI đọc đúng) và viết chuẩn trong `caption` (để học sinh xem):

| Tên / Thuật ngữ | Viết trong `text` / `caption` | Viết trong `speak` | Ghi chú |
| :--- | :--- | :--- | :--- |
| Shakespeare | Shakespeare | Sếch-xpia | Đã kiểm tra Vivibe |
| Victor Hugo | Victor Hugo | Huy-gô | Đọc quen thuộc |
| Chủ ngữ / Vị ngữ | $S$ / $V$ | chủ ngữ, vị ngữ | CẤM viết "ét", "vê" |
| Ẩn dụ chuyển đổi cảm giác | Ẩn dụ CĐCG | ẩn dụ chuyển đổi cảm giác | Đọc đầy đủ |

---

## 6. Dựng hình (B3)

- **Thành phần dùng chung cho Văn** ở `src/components/van/`:
  - `QuoteMarker`: câu gốc nhiều dòng theo mục 3.4, vệt bôi chạy theo mốc giọng đọc, phần còn lại mờ đi.
  - `MarginNote`: nhãn ghi chú có đường dẫn cong và nét gạch tay, thay cho tag dạng thẻ.
  - `useVanQuoteFont`: nạp font trích dẫn Lora có đủ dấu tiếng Việt trước khi render.
  - Mẫu dùng: `src/videos/demo-van-doc-boi-rut/`.
- Thứ khác dựng ngay trong thư mục video; cần lần hai thì chuyển vào `src/components/van/` và ghi tên vào mục này. Ứng viên tiếp theo: con đò, bến nước, người ra đi, cô gái áo dài nón lá trong `src/videos/demo-van-an-du/`.
- Nhãn gắn vào vật đang chuyển động (thuyền trôi, người đi): neo `AutoLabels` theo **cả** dao động nhỏ của vật (nhấp nhô), và vật cản của vật đó cũng đi theo, để nhãn dính vào vật.
- Dùng lại: `MarginNote` (tên khái niệm, kết luận), `AutoLabels` (tên vật ngắn, nhãn bám vật chạy), `StagePanel`/`Card` (`src/components/Card.tsx`), `MathText` (mọi chữ hiển thị). `MarginNote` không tự né vật: tự chọn `from`, `to` rồi soát bằng `check-layout` và ảnh tĩnh.
- Hình trung tâm vẽ bằng SVG/khối phẳng, cỡ theo quy tắc 1 và 4 của `dung-video` (sân khấu toàn khung, vật chính ≥ 140px).
- **Chuyển cảnh**: beat khác `scene` tự mờ ở ranh giới. Khi tác phẩm có sương, gió, nước thì phủ lớp đó lên đúng đoạn mờ (mẫu `MistWipe` trong `demo-van-doc-boi-rut/scene.tsx`). Lớp phủ nằm trong khoảng nghỉ giữa beat, không che hình lúc giọng còn đang nói.
- **Đổi màu theo cảm xúc**: chỉ áp lên nền, giữ nhân vật nguyên màu để mắt vẫn bám vào người.
- Hai người đang nắm tay hoặc chạm nhau: gộp vào một nhóm `data-mark` để `check-layout` không báo chồng lấn.
- **Màu sắc & Typography**:
  - Nền theo brand như mọi môn (`style.md`): nền sáng, chữ navy. Không dùng nền tối toàn khung.
  - Màu nhấn theo vai trò `role` (`src/components/roles.ts`). Vệt bôi là nền màu nhạt dưới chữ, chữ vẫn navy để dễ đọc. Khi bài phân biệt nhiều khái niệm, mỗi khái niệm một sắc khác hẳn nhau (mẫu: vàng, xanh ngọc, hồng).
  - Font chữ: Plus Jakarta Sans làm chủ đạo; câu trích và tên khái niệm dùng Lora qua `useVanQuoteFont`.

---

## 7. Checklist nghiệm thu video Văn

- [ ] Dàn ý có bảng ý lớn, khung hình, câu lên hình, cụm bôi, màu, hình phản ứng.
- [ ] Mỗi chỗ phân tích đi theo thứ tự cảm → chữ → vì sao → tên; câu chốt nói câu văn làm được gì (mục 1 › Hành văn).
- [ ] Khuôn "…, đó là X" / "…, gọi là X" ≤ 2 lần; không cụm sáo, không câu thay tên tác phẩm khác vẫn đúng.
- [ ] Ngữ liệu chính được đọc lại sau khi phân tích; dòng trích có khoảng lặng; lời bình không chung dòng với câu trích.
- [ ] Ngữ liệu đã đối chiếu, `quoteSource` ghi nguồn, tranh không trái câu gốc.
- [ ] Mỗi ý lớn một khung hình; không có một tranh dùng suốt bài rồi chỉ zoom.
- [ ] Lời nói hành động nào, hình diễn hành động đó.
- [ ] Không đoạn nào quá khoảng 10 giây thiếu thay đổi mang nghĩa.
- [ ] Mỗi cụm bôi 2–6 từ, vào đúng lúc giọng đọc tới; không karaoke, không bôi cả thẻ.
- [ ] Tối đa 2 dòng câu gốc cùng lúc; câu dài rút đi trước khi sang ý sau.
- [ ] Nhãn khái niệm dùng `MarginNote`, không có tag dạng thẻ; đường dẫn không cắt người hay chữ.
- [ ] Có 2–3 câu hỏi đoán, lựa chọn nằm trên hình, đáp án được làm trên hình.
- [ ] Cảm xúc thể hiện qua cảnh vật và dáng người, không vẽ mặt.
- [ ] Chuyển cảnh nằm trong khoảng nghỉ, không che hình lúc đang nói.
