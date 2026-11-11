# Gói môn — Hóa học

Đọc kèm skill `viet-kich-ban` (B1), `tao-audio` (B2), `dung-video` (B3). Luật ở đây **thêm vào hoặc thay** luật chung cho video Hóa học (`"subject": "hoa"`).
Bài học kinh nghiệm đã gặp kèm ngày: `.agents/lessons.md`. Component Hóa: `src/components/chemistry/` (xem chạy thử: composition `hoa-thanh-phan`).

> **Cách đọc file này**: đọc **mục 0** trước mỗi bước (B1, B3). Mỗi luật ở mục 0 có ví dụ SAI/ĐÚNG và chỉ tới mục chi tiết.
> Gặp tình huống file này không nói tới → **hỏi người dùng**, không tự đặt luật. Sai kiến thức là lỗi nặng nhất.

---

## 0. 16 luật bắt buộc (đọc trước B1 và B3)

| # | Luật | SAI (đã gặp) | ĐÚNG | Chi tiết |
|---|---|---|---|---|
| 1 | **Thumb có hình chính của đúng thứ trong tiêu đề** | Logo + 1 dòng chữ, không hình | Tiêu đề "bảng tuần hoàn" → thumb có bảng tuần hoàn, tô 1 hàng + 1 cột | 6.1 |
| 2 | **Thumb có 1–2 từ khóa nổi bật** (màu khác + to hơn) | Cả câu cùng màu navy, cùng cỡ | "Vì sao có **hàng** và **cột**?" — "hàng" cam, "cột" chàm, to hơn 18% | 6.1 |
| 3 | **Định hướng trước, thí nghiệm sau**: thứ ghi trong tiêu đề phải hiện ngay đầu video | Vào thẳng 2 cốc nước, 15 s sau mới thấy bảng | Dòng 1: bảng tuần hoàn, sáng 1 hàng rồi 1 cột → dòng 2: "vì sao Li và Na cùng cột?" → thí nghiệm | 1.4 |
| 4 | **Vật thật phải tự nói**: tắt tiếng vẫn biết đây là chất gì | 2 hình chữ nhật xám trong 2 cốc, không tên | Thẻ tên "Lithium (Li)", ký hiệu trên miếng kim loại, cốc có thành/vạch | 6.2 |
| 5 | **Lời nói khác → hình khác.** Lời nói "giống" ở điểm nào thì hình giống đúng điểm đó, còn lại phải khác | Li và Na vẽ y hệt nhau | Cùng sủi bọt + cùng hồng (giống: cùng kiểu phản ứng); Na chảy tròn, chạy nhanh, sủi mạnh (khác: mức độ) | 1.5, 6.2 |
| 6 | **Không vẽ tay bảng tuần hoàn / ô nguyên tố** — dùng `PeriodicTable`, `ElementTile` | Ô 25 px, chữ "Na" to hơn ô, tràn viền | Component tự tính cỡ chữ ≤ 42% cạnh ô; nhấn bằng tô nền + viền | 6.3, 6.4 |
| 7 | **Một hệ tên duy nhất: IUPAC tiếng Anh** cho mọi nguyên tố, chất | Lúc "Sodium", lúc "natri"; "axit" | sodium, potassium, iron, acid, base, oxide… (cả trên hình và lời đọc) | 2.2 |
| 8 | **Gọi nhóm theo SGK THPT: IA…VIIIA, IB…VIIIB** | Trục ghi 1–18, rồi lại giải thích "1 ↔ IA" | Trục ghi IA, IIA, IIIB…; lời đọc "nhóm một A". Không bao giờ "nhóm 1" | 2.3 |
| 9 | **Số liệu lấy từ `elements.ts`**, không gõ theo trí nhớ | Tự gõ khối lượng, Z | `ElementTile symbol="Na"` tự lấy 11, Sodium, 22,99 | 2.5 |
| 10 | **Macro → Micro → Symbolic**: hiện tượng và hạt trước, công thức sau | Phương trình hiện từ đầu | Video hiện tượng: phương trình ở ~20% cuối. Video bài học: ký hiệu được chiếm phần lớn, nhưng sau hiện tượng + hạt | 1.1 |
| 11 | **Sân khấu ≥ 75% khung**: hình chính rộng ≥ 1500 px | Bảng tuần hoàn 450 px trong một thẻ trắng | `PeriodicTable width={1560}` | 6.3 + `AGENTS.md` |
| 12 | **Soát bằng mắt trước khi báo xong**: chạy `check_script`, xuất stills, làm *phép thử tắt tiếng*, điền checklist mục 7 | Báo xong khi lint sạch | Dán checklist mục 7 (có/không + frame) vào báo cáo | 7 |
| 13 | **Nội dung do người dùng duyệt**: agent không tự thu hẹp hay bỏ ý; trình *Bảng nội dung* (thẻ bài học → beat → hình) ở bước dàn ý | Prompt "phản ứng oxi hoá – khử" → video thành "Đồng từ đâu ra?", thiếu quy tắc số oxi hoá, thiếu ion | Bảng K1–K10 ↔ beat; mục nào bỏ là do người dùng chọn, ghi `boQuaDaDuyet` | 1.6, 2.6 |
| 14 | **Video bài học: tiêu đề là tên bài**, hook chỉ là cửa vào ≤ 20 s | Tiêu đề = câu hỏi của hook | `kicker` "Phản ứng oxi hoá – khử", `title` câu hỏi ngắn | 1.6 |
| 15 | **Khái niệm mới → hình mới** (không thêm chữ lên hình cũ); một kiểu hình ≤ ~40% thời lượng | 70 s chỉ hai quả cầu Fe, Cu²⁺; khái niệm sau chỉ thêm dòng chữ | Số oxi hoá → `OxidationFormula`; tên gọi chéo → `RedoxRoleTable`; electron nhường = nhận → `ElectronBalance` | 6.7 |
| 16 | **Không đổi font; ion/công thức viết `$\ce{...}$`, không dùng ký tự mũ Unicode** | "Cu²⁺" gõ tay hiện vỡ thành "Cu²·" | `$\ce{Cu^2+}$` | 6.9 |

---

## 1. Tư duy kể chuyện & Trải nghiệm người xem (B1)

### 1.1. Tam giác Johnstone (Vĩ mô ↔ Vi mô ↔ Tượng trưng)
Hóa học là khoa học về **sự biến đổi của vật chất**; đừng biến nó thành "môn giải mol". Mọi kịch bản đi qua 3 đỉnh:
1. **Vĩ mô (Macroscopic)**: hiện tượng mắt thấy (đổi màu, sủi bọt, kết tủa, lửa, tỏa nhiệt).
2. **Vi mô (Submicroscopic)**: tầng hạt (nguyên tử, electron, liên kết đứt/tạo).
3. **Tượng trưng (Symbolic)**: công thức, phương trình $\ce{A + B -> C}$, cấu hình electron.

> [!IMPORTANT]
> **Thứ tự hiển thị**: không đưa công thức/phương trình ra trước khi người xem đã thấy hiện tượng và bản chất hạt. Công thức chỉ xuất hiện ở ~20% cuối để "đặt tên khoa học" cho thứ vừa thấy.
> Ngoại lệ duy nhất: **thứ ghi trong tiêu đề** (bảng tuần hoàn, pin, phân tử…) được và phải hiện ngay đầu — xem 1.4.
> **Video bài học** (1.6) có phần ký hiệu là kiến thức chính (số oxi hoá, cân bằng phương trình…): vẫn hiện tượng + hạt trước, nhưng phần ký hiệu được chiếm phần lớn thời lượng. "~20% cuối" chỉ áp cho *video hiện tượng*. Không vì luật này mà rút gọn phần đề thi.

### 1.2. Hình thể hạt & cơ chế trực quan
Mỗi quá trình trừu tượng gán cho một **chuyển động thị giác cụ thể của hạt**:
- **Nguyên tử & phân tử**: hạt cầu màu CPK (mục 6.5), ký hiệu nằm gọn trong hạt.
- **Liên kết cộng hóa trị**: cặp chấm electron chung giữa hai hạt; phản ứng: liên kết cũ rung, giãn, đứt → mảnh nguyên tử gắn lại kèm chớp sáng.
- **Oxi hoá – khử**: viên bi $e^-$ phát sáng bắn từ chất khử sang chất oxi hoá; số oxi hoá đổi số + đổi màu ngay khoảnh khắc đó.
- **Acid – base (Brønsted–Lowry)**: chấm $\ce{H+}$ tách khỏi acid, bay sang base.
- **Tốc độ phản ứng**: chỉ va chạm đúng hướng + đủ năng lượng ($E_a$) mới chớp sáng thành chất mới; va chạm yếu bật nảy ra.
- **Cân bằng**: hai dòng hạt thuận/nghịch chạy cùng lúc; số hạt mỗi loại trong khung giữ nguyên.
- **Pin, điện phân**: $e^-$ chạy trong dây; ion âm/dương trong dung dịch đi ngược chiều nhau.

### 1.3. Mở đầu bằng hiện tượng bất ngờ (Hook)
Hiện tượng thị giác gây tò mò (giọt không màu làm cả bình hồng rực; đinh iron trong dung dịch xanh lam bị bọc lớp copper đỏ). Câu hỏi: *"ở thế giới hạt, chuyện gì đang xảy ra?"*

### 1.4. Định hướng trước, thí nghiệm sau (luật 0.3)
Người xem bấm vào video vì tiêu đề. **3–6 giây đầu phải cho họ thấy đúng thứ tiêu đề nói tới**, rồi mới vào thí nghiệm làm bằng chứng.
- Thumb (6.1) đã có hình chính → **dòng 1 của b01** nhắc lại hình đó trên sân khấu lớn, sáng đúng chỗ câu hỏi nhắm tới.
- Ví dụ bài "Cấu tạo bảng tuần hoàn — vì sao có hàng và cột?":
  - b01-l01 `show`: "bảng tuần hoàn đầy đủ (PeriodicTable width 1560); chu kì 3 sáng lên" — `speak`: "Một trăm mười tám nguyên tố, xếp thành hàng ngang và cột dọc."
  - b01-l02 `show`: "nhóm IA sáng lên; Li và Na được khoanh" — `speak`: "Vì sao lithium và sodium lại đứng chung một cột?"
  - b01-l03 trở đi: thí nghiệm Li, Na thả vào nước (MetalInWater) — bằng chứng "giống nhau".
- SAI: mở bằng 2 cốc nước không tên, 15 giây sau mới thấy bảng → người xem không biết đang xem cái gì.

### 1.5. Lời nói so sánh → hình so sánh (luật 0.5)
Mỗi khi `speak` có **giống / khác / mạnh hơn / nhanh hơn / tương tự / cùng / khác nhau**, viết rõ trong `visual`/`show`:
1. **Giống ở điểm nào** → hình giống đúng điểm đó (vd. cùng sủi bọt khí, cùng hóa hồng với phenolphthalein).
2. **Khác ở điểm nào** → ít nhất **2 dấu hiệu thị giác khác nhau** (tốc độ, kích thước, màu, hình dạng, ngọn lửa).
3. Không bao giờ dùng **cùng một hình y hệt** cho hai chất khác nhau. Nếu chưa biết thực tế chúng khác ra sao → tra bảng 6.2 hoặc hỏi người dùng, không đoán.
4. Lời đọc không được ngầm nói "giống hệt": viết "**cùng kiểu** phản ứng, nhưng sodium phản ứng **mạnh hơn**".

### 1.6. Nội dung video: agent đề xuất, người dùng duyệt (luật 0.13, 0.14)
Agent **không tự quyết** video nói gì, bỏ gì. Agent **nêu rõ** để người dùng duyệt, rồi làm đúng cái đã duyệt.

**Bước 1 — Xác định loại video** (không chắc → hỏi):
- *Video bài học*: prompt nêu tên một bài/chủ đề SGK ("phản ứng oxi hoá – khử", "cấu tạo bảng tuần hoàn"). Nội dung = thẻ bài học (2.6).
- *Video hiện tượng*: prompt nêu một câu hỏi/hiện tượng cụ thể ("vì sao đinh iron đổi màu trong dung dịch xanh?"). Nội dung = phần kiến thức đủ để trả lời câu hỏi đó — vẫn trình Bảng nội dung.

**Bước 2 — Trình *Bảng nội dung*** ngay đầu bước dàn ý, trước mọi thứ khác, đúng mẫu:
```
Loại video: bài học — Hóa 10, Bài 13 (thẻ: references/hoa/lop-10/bai-13-phan-ung-oxi-hoa-khu.md)
Xoay quanh: <một câu — ý bản chất, vd. "phản ứng oxi hoá – khử là sự chuyển electron, theo dõi bằng số oxi hoá">
Hook: <hiện tượng mở đầu, ≤ 20 s>

| Mục thẻ | Sẽ nói gì (1 câu) | Beat | Hình (component) | ~giây |
|---|---|---|---|---|
| K1 | Số oxi hoá là … | b03 | OxidationFormula H2O | 15 |
| …  | … | … | … | … |
| Bẫy: tên gọi chéo | … | b09 | RedoxRoleTable, tô cam | 20 |

Không có trong video (cần bạn duyệt): K10 — lý do …
Ví dụ dùng (thẻ mục 3): …
Ước tính tổng: 3:45
Chỗ còn nghi ngờ: …
```
- **Mọi mục** ở *Kiến thức lõi* và *Bẫy thi* của thẻ phải có một dòng trong bảng — hoặc nằm ở "Không có trong video" kèm lý do. Không âm thầm bỏ.
- Ước tính > 4:00 → không tự cắt; đề xuất cách tách ở thẻ mục 5 (thẻ chưa có thì tự đề xuất), người dùng chọn.
- Người dùng duyệt xong mới viết `script.json`. Mục được duyệt bỏ → ghi tên mục vào `"boQuaDaDuyet": ["K10"]` (chỉ ghi khi người dùng đã đồng ý). `check_script` báo lỗi mục thiếu mà không có trong danh sách này.

**Bước 3 — Viết theo bảng đã duyệt**:
- Video bài học: thumb `kicker` = tên bài, `title` = câu hỏi ngắn; `script.json` › `title` bắt đầu bằng tên bài. Hook ≤ 20 s rồi vào bài — hook không thay chủ đề.
- Mỗi mục *Bẫy thi* = một beat riêng (`TRONG ĐỀ THI` hoặc `BẪY THƯỜNG GẶP`) có hình riêng; không gộp thành một dòng chữ nhỏ.
- Thời lượng video bài học: tới 4:00.

---

## 2. Kiến thức, thuật ngữ & danh pháp (B1)

### 2.1. Nguồn
- Chương trình **SGK GDPT 2018** (*Kết nối tri thức*, *Cánh diều*). Tra `references/hoa/` trước khi viết.
- **Bảng chốt ở mục 2.2–2.3 là chuẩn của dự án.** Thuật ngữ nào không có ở đây và không chắc SGK dùng thế nào → ghi vào "chỗ còn nghi ngờ" khi báo dàn ý, hỏi người dùng.

### 2.2. Danh pháp — MỘT hệ duy nhất: IUPAC tiếng Anh (luật 0.7)
Áp dụng cho `title`, `keyword`, `text`, `caption`, nhãn trên hình **và** `speak` (viết phiên âm của tên tiếng Anh). Không trộn tên Việt cũ, không ghi kèm tên Việt trong ngoặc.

| Nhóm | Dùng (IUPAC) | KHÔNG dùng |
|---|---|---|
| Kim loại kiềm, kiềm thổ | lithium, sodium, potassium, magnesium, calcium, barium | liti, natri, kali, magie, canxi, bari |
| Kim loại quen | iron, copper, aluminium, zinc, silver, gold, lead, tin, mercury | sắt, đồng, nhôm, kẽm, bạc, vàng, chì, thiếc, thủy ngân (khi là tên nguyên tố) |
| Phi kim | hydrogen, oxygen, nitrogen, carbon, phosphorus, sulfur, chlorine, fluorine, bromine, iodine, silicon | hiđro, oxi, nitơ, cacbon, photpho, lưu huỳnh, clo, flo, brom, iot, silic |
| Loại chất | acid, base, oxide, hydroxide, salt → "muối" giữ tiếng Việt | axit, bazơ, oxit, hiđroxit |
| Gốc/hợp chất | chloride, sulfate, nitrate, carbonate, sodium hydroxide, acetic acid, ethanol, methane | clorua, sunfat, nitrat, cacbonat, natri hiđroxit, axit axetic, ancol etylic, metan |

- **Giữ tiếng Việt**: từ thường không phải danh pháp — *nước, muối ăn, khí, dung dịch, kết tủa, oxi hoá, khử, chu kì, nhóm, ô nguyên tố*. ("oxi hoá – khử" là thuật ngữ SGK, giữ nguyên.)
- `py scripts/check_script.py <slug>` **báo lỗi** tên cũ (natri, axit, hiđro…) và **cảnh báo** tên Việt quen (sắt, nhôm…). Cảnh báo "sắt/đồng…" mà đúng là tên nguyên tố → sửa sang tên tiếng Anh; nếu là từ thường (vd. "đồng thời") thì bỏ qua.

### 2.3. Bảng tuần hoàn — thuật ngữ chốt (luật 0.8)
| Khái niệm | Viết trên hình | Lời đọc (`speak`) | Ghi chú |
|---|---|---|---|
| Hàng ngang | chu kì 1 … chu kì 7 | "chu kì ba" | SGK viết **chu kì** (không "chu kỳ") |
| Cột dọc | nhóm IA … VIIIA (nhóm A); IIIB … VIIIB, IB, IIB (nhóm B) | "nhóm một A", "nhóm tám B" | VIIIB gồm 3 cột. **Không dùng "nhóm 1…18"** ở bất cứ đâu |
| Số cột | "18 cột" (chỉ khi đếm) | "mười tám cột" | Được nói bảng có 18 cột, **không** gọi tên nhóm bằng số cột |
| Ô | ô nguyên tố | "ô nguyên tố" | |
| Z | số hiệu nguyên tử $Z$ | "số hiệu nguyên tử" | $Z$ = số proton = số electron (nguyên tử trung hoà) |
| Khối | khối s, p, d, f | "khối ét", "khối pê" | Nguyên tố nhóm A = khối s + p; nhóm B = khối d + f |
| Lớp ngoài | lớp electron ngoài cùng, electron hoá trị | | Nhóm A: số thứ tự nhóm = số electron lớp ngoài cùng (trừ He: 2 e, nhóm VIIIA) |

- **Một video chỉ một cách gọi nhóm.** Không có beat "đối chiếu 1 ↔ IA" — đó là thêm một hệ thứ hai để người xem phải nhớ.
- `check_script.py` báo lỗi "nhóm 1"…"nhóm 18" và lời đọc "nhóm một" thiếu A/B.

### 2.4. Bẻ gãy ngộ nhận kinh điển
- "Chất phản ứng xong là biến mất" → nguyên tử không mất, chỉ sắp xếp lại (bảo toàn khối lượng).
- "Chất khử là chất bị giảm số oxi hoá" → chất khử **cho** electron, số oxi hoá **tăng** ("khử cho – O nhận").
- "Cân bằng thì phản ứng dừng" → cân bằng động: thuận và nghịch vẫn chạy, tốc độ bằng nhau.
- "Xúc tác làm tăng lượng sản phẩm" → chỉ mở đường tắt $E_a$ thấp hơn, không đổi lượng tối đa.
- "Cùng nhóm thì phản ứng mạnh như nhau" → cùng **kiểu** phản ứng, mức độ đổi theo chu kì (vd. Li < Na < K với nước).
- "Chất khử thì bị khử" → **tên gọi chéo**: chất khử *bị oxi hoá* (quá trình oxi hoá), chất oxi hoá *bị khử* (quá trình khử). Luôn dựng bằng `RedoxRoleTable`.
- "Số oxi hoá +2 và điện tích 2+ là một cách viết" → số oxi hoá: dấu trước ($+2$, đặt trên ký hiệu); điện tích ion: dấu sau ($\ce{Cu^2+}$).

### 2.5. Số liệu và sự thật — không lấy từ trí nhớ (luật 0.9)
- Z, ký hiệu, tên, nhóm, chu kì, khối lượng: lấy từ `src/components/chemistry/elements.ts` (`element("Na")`). Thiếu khối lượng một nguyên tố → tra SGK, thêm vào `ATOMIC_MASS`, báo người dùng.
- Màu chất, màu lửa, kết tủa, hành vi thí nghiệm: bảng 6.2. Không có trong bảng → hỏi người dùng.
- Cấu hình electron, số electron từng lớp: tự tính lại một lần (điền theo thứ tự 1s 2s 2p 3s 3p 4s 3d…), ghi phép tính vào báo cáo.

### 2.6. Thẻ bài học — nguồn nội dung của video bài học
- Vị trí: `references/hoa/lop-<lớp>/bai-<NN>-<ten>.md` (NN hai chữ số, khớp `"bai": "Bài 13. …"` trong `script.json`). Đã có: Hóa 10 Bài 5 (cấu tạo bảng tuần hoàn), Bài 13 (phản ứng oxi hoá – khử).
- Mỗi thẻ gồm: (1) Kiến thức lõi K1, K2…; (2) Bẫy thi; (3) Ví dụ đã kiểm số; (4) Hiện tượng mở đầu gợi ý; (5) Gợi ý chia video; mục cuối "Từ khóa kiểm tra" cho `check_script`.
- **Chưa có thẻ cho bài cần làm** → agent soạn thẻ mới theo đúng cấu trúc hai thẻ có sẵn, dựa trên SGK, ghi "Trạng thái: chờ duyệt", **đưa người dùng duyệt trước** rồi mới làm Bảng nội dung. Số liệu trong ví dụ phải tự kiểm (cộng số oxi hoá, đếm electron) và ghi phép kiểm.
- Thẻ là chuẩn chung của dự án: agent không sửa thẻ khi đang làm một video; thấy thẻ sai → báo người dùng.

---

## 3. Mẫu dựng khái niệm (B1 + B3)

### 3.1. Chuỗi 4 bước diễn hoạt phản ứng (không nhảy bước)
1. **Sân khấu chất tham gia**: phân tử chất đầu đủ màu CPK, rung nhẹ (chuyển động nhiệt).
2. **Va chạm & kích hoạt**: tác nhân (nhiệt, xúc tác) làm các phân tử lao vào nhau.
3. **Bẻ gãy & tái tổ hợp**: liên kết cũ đứt → sắp xếp lại → liên kết mới + chớp sáng.
4. **Chốt công thức**: phương trình $\ce{A + B -> C}$ hiện cùng nhãn tên IUPAC.

### 3.2. Dụng cụ thí nghiệm & hiệu ứng vĩ mô
- Ống nghiệm, beaker, bình nón: `LabGlassware` (`type`, `liquidColor`, `bubbles`, `precipitate`…). Kim loại kiềm + nước: `MetalInWater` (6.2). Đinh iron trong dung dịch copper(II) sulfate: `NailInCopperSulfate` (6.7).
- Sủi bọt từ điểm tiếp xúc; kết tủa: mây hạt li ti rồi lắng xuống đáy; đổi màu bằng `interpolateColors`, không giật.
- **Mỗi dụng cụ có thẻ tên chất** (tên IUPAC + ký hiệu/công thức) và chữ dưới cốc nói trong cốc có gì (vd. "nước + phenolphthalein").

### 3.3. Cửa sổ soi vi mô
Vòng tròn kính lúp (`ZoomInset`) nối nét đứt từ chỗ phản ứng trong cốc ra khung vi mô có các hạt.

---

## 4. Số, đại lượng và đơn vị
- Luôn có đơn vị: $n$ (mol); $m$ (g), $M$ (g/mol); $V$ (L, mL); $C_M$ (M hoặc mol/L); $\Delta_r H^\circ_{298}$ (kJ); $p$ (bar); $E^\circ$ (V); $K_C$.
- Số thập phân viết dấu phẩy: 22,99 (`formatMass`). ≤ 5 con số trong cả video.

---

## 5. Lời đọc tên chất (B1 viết `speak`, B2 nghe thử)
- Trên hình (`text`, `caption`, nhãn): tên IUPAC tiếng Anh viết chuẩn.
- Trong `speak`: **phiên âm tiếng Việt của tên tiếng Anh** để giọng Vivibe đọc trơn. Dòng nào có phiên âm → thêm `caption` viết chuẩn và đưa vào danh sách nghe thử.
- Cột "Đã nghe thử": chỉ điền "đạt" sau khi B2 nghe thật. Dòng "chưa" → bắt buộc nằm trong danh sách nghe thử.

| Trên hình | `speak` | Đã nghe thử |
|---|---|---|
| lithium (Li) | li-thi-um | chưa |
| sodium (Na) | xô-đi-um | chưa |
| potassium (K) | pô-tát-xi-um | chưa |
| magnesium (Mg) | mác-nhê-xi-um | chưa |
| calcium (Ca) | can-xi-um | chưa |
| aluminium (Al) | a-lu-mi-ni-um | chưa |
| iron (Fe) | ai-ơn | chưa |
| copper (Cu) | cóp-pơ | chưa |
| zinc (Zn) | din | chưa |
| silver (Ag) | xiu-vơ | chưa |
| gold (Au) | gâu | chưa |
| hydrogen, khí $\ce{H2}$ | hai-đờ-rô-giần / khí hắt hai | chưa |
| oxygen, $\ce{O2}$ | óc-xi-giần / khí ô hai | chưa |
| chlorine | clo-rin | chưa |
| $\ce{H2O}$ | nước / hắt hai ô | |
| $\ce{CO2}$ | xê ô hai / các-bon đi-ô-xít | |
| $\ce{NaCl}$ | xô-đi-um clo-rai / muối ăn | |
| $\ce{NaOH}$ | xô-đi-um hy-đrô-xít | |
| $\ce{HCl}$ | hy-đrô-clo-rích a-xít | |
| $\ce{H2SO4}$ | sun-phu-rích a-xít | |
| $\ce{HNO3}$ | ni-trích a-xít | |
| $\ce{CH4}$, $\ce{C2H4}$, $\ce{C2H2}$ | mê-than, ê-thi-len, a-xê-ti-len | |
| $\ce{C2H5OH}$ | ê-tha-non | |
| $\ce{CH3COOH}$ | a-xê-tích a-xít | |
| $\ce{CuSO4}$, $\ce{AgNO3}$ | cóp-pơ sun-phát, xiu-vơ ni-trát | |
| phenolphthalein | phê-nol-ph-ta-lê-in | chưa |
| nhóm IA, VIIIB | nhóm một A, nhóm tám B | chưa |
| $e^-$ | e-léc-tron | |
| $\Delta_r H^\circ_{298}$ | biến thiên en-tan-pi chuẩn | |

---

## 6. Dựng hình Remotion (B3)

### 6.1. Thumb — ảnh mở đầu `ChemIntro` (luật 0.1, 0.2)
Video Hóa **không dùng `BrandIntro`** (logo + một dòng chữ một màu). Truyền `intro` cho `ExplainerVideo`:

```tsx
import { ChemIntro, HERO_STACK } from "../../components/chemistry/ChemIntro";
import { PeriodicTable } from "../../components/chemistry/PeriodicTable";
import { colors } from "../../components/theme";

<ExplainerVideo script={script} timeline={timeline} beats={beats} draft={draft}
  intro={
    <ChemIntro
      kicker="Bảng tuần hoàn"                 // tên chủ đề, nhỏ, xám (≤ 30 ký tự)
      title="Vì sao có hàng và cột?"          // câu hỏi ngắn (≤ 40 ký tự, ≤ 8 từ)
      highlight={["hàng", "cột"]}             // 1–2 cụm NẰM NGUYÊN VĂN trong title
      hero={
        <PeriodicTable left={HERO_STACK.left + 170} top={HERO_STACK.top + 20} width={1400}
          showFBlock={false} symbols="highlighted"
          highlights={[{ period: 3, color: colors.warn }, { group: "IA", color: colors.brandIndigo }]} />
      }
    />
  }
/>
```

Quy cách:
1. **Hình chính (`hero`) là đúng vật trong tiêu đề**, chiếm vùng `HERO_STACK` (1740 × 620) hoặc `HERO_SIDE`. Bảng tuần hoàn → `PeriodicTable`; phản ứng → `LabGlassware`/`MetalInWater` đang phản ứng rõ nhất; phân tử → `Atom` + `ChemicalBond` cỡ lớn. Hình phải **đang ở trạng thái gợi câu hỏi** (hàng + cột đang sáng; cốc đang sủi, đang đổi màu).
2. **Từ khóa**: chọn 1–2 từ mang câu hỏi (danh từ chính hoặc chữ "vì sao"/"mạnh hơn"…), không chọn từ phụ. Màu mặc định cam + chàm; được dùng màu nổi khác (`colors.c2`, `colors.increase`) — **nền và logo đã mang thương hiệu, từ khóa không bắt buộc màu xanh brand**. Màu từ khóa nên trùng màu chỗ được tô trên hình (từ "hàng" cam ↔ chu kì tô cam).
3. Không fade-in: thumb hiện đủ **ngay frame 0** (nền tảng thường lấy frame đầu làm ảnh bìa). `ChemIntro` đã làm sẵn.
4. Soát: `node scripts/stills.mjs <id> 0` → nhìn ảnh ở cỡ nhỏ (thu còn 320 px): vẫn đọc được từ khóa và nhận ra hình chính.

### 6.2. Vật thật phải tự nói (luật 0.4, 0.5)
**Phép thử tắt tiếng**: xem storyboard/stills không có tiếng. Với mỗi cảnh, trả lời được 3 câu: *đây là chất/dụng cụ gì? đang xảy ra gì? (nếu có 2 vật) chúng khác nhau ở đâu?* — câu nào không trả lời được → sửa hình, không sửa lời.

Mỗi vật thật cần:
- **Hình dạng đặc trưng**: cốc có thành dày, miệng loe, mặt nước; kim loại có ánh bạc + vệt sáng; khí là bọt tròn nổi lên.
- **Tên trên vật**: thẻ tên "Sodium (Na)" + ký hiệu trên chính miếng chất. Hai cốc giống nhau mà không tên = lỗi.
- **Dấu hiệu thật của hiện tượng** (bảng dưới). Không có trong bảng → hỏi người dùng.

| Hiện tượng thật | Dấu hiệu phải vẽ |
|---|---|
| Li + nước | nổi, giữ hình miếng, sủi bọt đều **chậm**, trôi chậm; phenolphthalein hồng **chậm** |
| Na + nước | nổi, **chảy thành giọt tròn** bóng, **chạy nhanh** trên mặt nước, sủi **mạnh**, có làn hơi; hồng nhanh |
| K + nước | như Na nhưng mạnh hơn, **bốc cháy lửa tím hồng (lilac)**; hồng rất nhanh |
| Màu lửa | Li đỏ tía · Na vàng · K tím hồng · Ca đỏ cam · Ba lục vàng · Cu xanh lục |
| Halogen (đơn chất) | $\ce{F2}$ khí lục nhạt · $\ce{Cl2}$ khí vàng lục · $\ce{Br2}$ lỏng nâu đỏ · $\ce{I2}$ rắn tím đen |
| Kết tủa | AgCl trắng · AgBr vàng nhạt · AgI vàng · $\ce{BaSO4}$ trắng · $\ce{Cu(OH)2}$ xanh lam · $\ce{Fe(OH)3}$ nâu đỏ |
| Dung dịch | $\ce{CuSO4}$ xanh lam · $\ce{FeCl3}$ vàng nâu · $\ce{KMnO4}$ tím |
| Chất chỉ thị | phenolphthalein: không màu → hồng trong base · quỳ tím: đỏ trong acid, xanh trong base |

Kim loại kiềm + nước dùng sẵn component (đã có đủ dấu hiệu trên, so sánh đặt 2–3 cốc cạnh nhau, cùng `start`):
```tsx
<MetalInWater metal="Li" left={190} top={230} width={440} start={L[2]} indicator liquidLabel="nước + phenolphthalein" />
<MetalInWater metal="Na" left={740} top={230} width={440} start={L[2]} indicator liquidLabel="nước + phenolphthalein" />
```
Cần neo nhãn vào miếng kim loại đang chạy → `metalInWaterAnchor(props, frame, fps)`.

### 6.3. Bảng tuần hoàn — `PeriodicTable` (luật 0.6, 0.11)
**Cấm tự vẽ bảng bằng div/SVG.** Component đã đúng hình dạng SGK (H và He ở hai đầu, khoảng trống chu kì 1–3, hai hàng lanthanide/actinide tách riêng, VIIIB gộp 3 cột).

```tsx
const T = { left: 180, top: 150, width: 1560 };            // bảng là sân khấu chính
<PeriodicTable {...T} dimOthers={0.55}
  highlights={[
    { period: 3, color: role.focus, opacity: fadeIn(fr, L[1]) },    // sáng chu kì 3 đúng dòng 2
    { group: "IA", color: colors.warn, opacity: fadeIn(fr, L[2]) }, // sáng nhóm IA đúng dòng 3
    { cells: ["Li", "Na"], color: role.focus },
  ]} />
const na = periodicCell("Na", T);   // { x, y, size, cx, cy } để đặt vòng khoanh, mũi tên, AutoLabels
```

| Muốn | Đặt |
|---|---|
| Bảng là nhân vật chính của cảnh | `width` 1500–1600 (ô ≈ 75 px, ký hiệu 32 px) |
| Bảng nhỏ chỉ để định vị, cạnh hình khác | `width` 700–1000, `symbols="highlighted"`, nhãn đặt ngoài bằng AutoLabels (tên nhóm tự ẩn khi ô < 56 px) |
| Hiện số hiệu Z trong ô | `showZ` — chỉ có tác dụng khi ô ≥ 86 px (width ≥ ~1700); nhỏ hơn thì dùng `ElementTile` |
| Dồn mắt vào ô được tô | `dimOthers={0.35–0.55}` |
| Không cần hàng f | `showFBlock={false}` |

Quy tắc:
- **Nhấn mạnh bằng tô nền + viền**, không phóng to chữ, không đổi cỡ ô.
- Chữ trong ô luôn ≤ 42% cạnh ô — đừng sửa `fontSize` trong component để "cho to".
- Mỗi dòng lời đọc sáng **một** thứ (một chu kì, hoặc một nhóm, hoặc vài ô) — dùng `opacity: fadeIn(fr, L[i])`.
- Bảng giữ **nguyên vị trí và kích thước** suốt các beat cùng cảnh; thông tin phụ (sơ đồ lớp electron, ô phóng to) đặt ở vùng trống phía trên khối d (giữa nhóm IIA và IIIA, chu kì 1–3) hoặc dưới hàng f — không co bảng lại để nhường chỗ.

### 6.4. Ô nguyên tố phóng to — `ElementTile`
```tsx
<ElementTile symbol="Na" left={160} top={250} size={320} show={{ name: fadeIn(fr, L[1]), mass: fadeIn(fr, L[2]) }} focus="z" />
```
- Số liệu tự lấy từ `elements.ts`; `focus` tô phần đang được nói (`"z" | "symbol" | "name" | "mass"`).
- `size` 220–340. Tên dài (Phosphorus) tự thu nhỏ; không sửa.

### 6.5. Bảng màu nguyên tử CPK
H trắng `#FFFFFF` (viền `#CBD5E1`) · C xám than `#334155` · O đỏ san hô `#EF4444` · N xanh lam `#3B82F6` · Cl xanh lục `#22C55E` · Na tím nhạt `#A855F7` · S vàng `#EAB308` (chữ tối) · Fe cam đất `#F97316` · Cu nâu đồng `#D97706` · Ag bạc `#94A3B8` (chữ tối). Dữ liệu ở `CPK.ts`.

### 6.6. Vai trò màu (`role`)
`main` chất chính · `focus` liên kết đang đổi / $e^-$ / thứ đang nói tới · `pairA`–`pairB` chất oxi hoá–chất khử, acid–base · `warn` bẫy, năng lượng hoạt hoá cản trở · `dim` dung môi, khung nền. ≤ 5 màu nhấn mỗi cảnh.

### 6.7. Loại khái niệm → hình bắt buộc (luật 0.15)
Hình nghèo không phải do thiếu "sáng tạo" mà do dùng một hình cho mọi khái niệm. Mỗi khái niệm mới có **hình của chính nó**:

| Loại khái niệm | Hình | Component |
|---|---|---|
| Quy tắc có nhiều trường hợp (số oxi hoá: đơn chất / phân tử / ion) | ≥ 3 ví dụ **khác loại** đặt cạnh nhau, dòng phép cộng kiểm tra dưới mỗi ví dụ | `OxidationFormula` |
| Cặp tên gọi dễ nhầm (chất khử ↔ bị oxi hoá…) | bảng hai cột, hiện từng hàng theo lời đọc, tô cam hàng dễ nhầm | `RedoxRoleTable` |
| Bảo toàn (electron nhường = nhận) | cái cân: đĩa trái hiện trước → lệch; đĩa phải hiện → thăng bằng | `ElectronBalance` |
| Hiện tượng thật | dụng cụ + dấu hiệu thật (6.2), có thẻ tên | `NailInCopperSulfate`, `MetalInWater`, `LabGlassware` |
| Vị trí nguyên tố | bảng tuần hoàn / ô phóng to | `PeriodicTable`, `ElementTile` |
| Cơ chế hạt (electron chuyển) | hạt + mũi tên electron (1.2) | `Atom`, `ChemicalBond` |

- **Một kiểu hình ≤ ~40% thời lượng video.** Khái niệm mới mà hình chỉ thêm một dòng chữ → sai luật.
- Không ghi nhãn kiểu "Mô hình giản lược", "Mô hình minh hoạ" lên sân khấu (người xem tự hiểu — `lessons.md` 10/11/2026).

```tsx
// Số oxi hoá — component tự cộng, sai tổng là báo lỗi ngay
<OxidationFormula left={200} top={170} parts={[{ el: "O", n: 2, ox: 0 }]} show={{ ox: fadeIn(fr, L[1]), sum: fadeIn(fr, L[2]) }} />
<OxidationFormula left={900} top={170} parts={[{ el: "H", n: 2, ox: 1 }, { el: "S", ox: 6 }, { el: "O", n: 4, ox: -2 }]} focus={["S"]} show={…} />
<OxidationFormula left={200} top={600} parts={[{ el: "S", ox: 6 }, { el: "O", n: 4, ox: -2 }]} charge={-2} show={…} />   // ion SO4 2−

// Tên gọi chéo — hiện từng hàng đúng dòng lời đọc, tô cam khi nói tới chỗ dễ nhầm
<RedoxRoleTable left={360} top={170} reducer="$\ce{Fe}$" oxidant="$\ce{Cu^2+}$"
  rows={[1, fadeIn(fr, L[1]), fadeIn(fr, L[2]), fadeIn(fr, L[3]), fadeIn(fr, L[4])]} trap={fr >= L[5]} />

// Electron nhường = electron nhận
<ElectronBalance left={460} top={260} give={6} take={6} giveLabel="$\ce{CO}$ nhường" takeLabel="$\ce{Fe2O3}$ nhận"
  show={{ give: fadeIn(fr, L[1]), take: fadeIn(fr, L[2]) }} />

// Hiện tượng: lớp copper bám dần, dung dịch nhạt dần
<NailInCopperSulfate left={260} top={170} width={520} progress={interpolate(fr, [L[1], L[3]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
```
Xem tất cả chạy thật: composition `hoa-thanh-phan` (frame 600–1080).

### 6.8. Kích thước
Các component trên đã có cỡ chữ ≥ 36 px; đặt chúng **to** (bảng vai trò rộng ≥ 1100, cân ≥ 900, công thức `fontSize` 100–130). Sân khấu ≥ 75% khung (luật 0.11).

### 6.9. Font và cách viết ký hiệu (luật 0.16)
- **Không đổi font, không thêm font, không sửa `fontFamily`** trong component. Chữ dùng font chung của dự án (component Hóa đã đặt sẵn).
- Ion, công thức trong `text`/`keyword`/nhãn: viết `$\ce{Cu^2+}$`, `$\ce{SO4^2-}$`, `$\ce{H2SO4}$`. **Cấm ký tự mũ/chỉ số Unicode** (²⁺, ₄): font không có glyph, hiện vỡ. `check_script` báo lỗi.
- `\ce` cần extension mhchem: tự nạp khi video import bất kỳ thứ gì từ `components/chemistry`. Video Hóa luôn import (ít nhất `ChemIntro`); `check_script` báo lỗi nếu script có `\ce` mà video không import.
- Số oxi hoá (dấu trước, trên ký hiệu) chỉ vẽ bằng `OxidationFormula`, không gõ tay.

---

## 7. Checklist trước khi báo xong (B3) — dán vào báo cáo, mỗi dòng "có/không + frame"

**Lệnh** (đều phải chạy):
```bash
py scripts/check_script.py <slug>
```
```bash
npm run lint
```
```bash
node scripts/check-layout.mjs <slug>
```
```bash
node scripts/stills.mjs <compositionId> 0 <frame giữa mỗi beat...>
```

**Nhìn stills, trả lời từng câu** (một câu "không" = chưa xong):
1. Frame 0 có hình chính của đúng thứ trong tiêu đề, và 1–2 từ khóa khác màu, to hơn?
2. Trong 6 giây đầu, thứ trong tiêu đề hiện trên sân khấu lớn?
3. Tắt tiếng, mỗi cảnh: biết chất/dụng cụ gì, đang xảy ra gì?
4. Mỗi chỗ lời nói "giống/khác/mạnh hơn": hình giống/khác đúng điểm đó (≥ 2 dấu hiệu khác)?
5. Không có hai vật khác nhau vẽ y hệt nhau?
6. Bảng tuần hoàn/ô nguyên tố dùng component; không chữ nào chạm hay tràn viền ô?
7. Mọi tên chất là IUPAC tiếng Anh; không "natri/axit/sắt" ở bất cứ đâu (hình, phụ đề, lời đọc)?
8. Nhóm chỉ gọi IA…VIIIA / IB…VIIIB; không "nhóm 1…18", không beat đối chiếu hai cách gọi?
9. Mọi Z, khối lượng, cấu hình electron khớp `elements.ts` / phép tính đã ghi?
10. Hình chính rộng ≥ 1500 px (hoặc chiếm ≥ 75% vùng sân khấu)?
11. Công thức/phương trình chỉ xuất hiện sau khi đã thấy hiện tượng và hạt?
12. Bảng nội dung đã được người dùng duyệt; mọi mục của thẻ bài học có trong video hoặc trong `boQuaDaDuyet`?
13. Mỗi bẫy thi của thẻ có beat riêng + hình riêng (không chỉ là một dòng chữ)?
14. Không kiểu hình nào chiếm > ~40% thời lượng; mỗi khái niệm mới có hình mới?
15. Không ký tự mũ Unicode; mọi `\ce` hiển thị đúng (không có chữ đỏ)?

---

## 8. Lỗi đã gặp → luật (để nhận ra lỗi cùng họ trong bài khác)

| Ngày | Video | Lỗi | Họ lỗi | Chặn bằng |
|---|---|---|---|---|
| 11/11/2026 | cau-tao-bang-tuan-hoan | Thumb chỉ logo + chữ một màu | Thumb không có hình, không điểm nhấn | `ChemIntro`, luật 0.1–0.2, `check_script` cảnh báo khi Video.tsx thiếu ChemIntro |
| 11/11/2026 | cau-tao-bang-tuan-hoan | Vào thí nghiệm trước khi thấy bảng tuần hoàn | Không định hướng | Mục 1.4 |
| 11/11/2026 | cau-tao-bang-tuan-hoan | 2 hình chữ nhật trong 2 cốc, không tên | Vật không tự nói | Mục 6.2, `MetalInWater` (thẻ tên + ký hiệu) |
| 11/11/2026 | cau-tao-bang-tuan-hoan | Li và Na vẽ y hệt nhau dù tính chất khác mức độ | Lời khác – hình giống | Mục 1.5, bảng 6.2 |
| 11/11/2026 | cau-tao-bang-tuan-hoan | Chữ "Na", "He" to hơn ô bảng tuần hoàn | Chữ không theo cỡ hộp | `PeriodicTable`, `ElementTile` (cỡ chữ theo cỡ ô) + `check-layout` "tràn khỏi khung chứa" |
| 11/11/2026 | cau-tao-bang-tuan-hoan | Vừa "1–18" vừa "IA…VIIIA" | Hai hệ thuật ngữ | Mục 2.3, `check_script` |
| 11/11/2026 | cau-tao-bang-tuan-hoan | Lúc "Sodium", lúc tên Việt | Hai hệ danh pháp | Mục 2.2, `check_script` |
| 11/11/2026 | phan-ung-oxi-hoa-khu | Prompt nói về phản ứng oxi hoá – khử, video thành "đồng từ đâu ra" | Agent tự thu hẹp chủ đề theo hook | Mục 1.6 (Bảng nội dung để duyệt), thẻ bài học, `check_script` độ phủ |
| 11/11/2026 | phan-ung-oxi-hoa-khu | Thiếu quy tắc tổng số oxi hoá = 0, ion đa nguyên tử | Không có nguồn ghi bài SGK phải có gì | Thẻ bài học 2.6 + `check_script` |
| 11/11/2026 | phan-ung-oxi-hoa-khu | Tên gọi chéo, electron nhường = nhận chỉ lướt qua | Bẫy thi không có beat/hình riêng | Mục 1.6 bước 3, `RedoxRoleTable`, `ElectronBalance` |
| 11/11/2026 | phan-ung-oxi-hoa-khu | 70 s hai quả cầu; chỉ ví dụ Fe/Cu; không có hình số oxi hoá trong hợp chất | Một hình cho mọi khái niệm | Mục 6.7, `OxidationFormula` |
| 11/11/2026 | phan-ung-oxi-hoa-khu | "Cu²⁺" gõ ký tự mũ bị vỡ; `\ce` thiếu mhchem nên hiện chữ đỏ | Ký hiệu viết tay | Mục 6.9, `check_script`, chemistry tự nạp mhchem |

**Năm câu hỏi tổng quát** — tự hỏi ở mọi bài, kể cả bài chưa có trong bảng trên:
0. **Video có dạy đúng và đủ thứ người dùng yêu cầu không?** (Bảng nội dung đã duyệt; không tự thu hẹp theo hook)
1. **Người xem có biết mình đang xem cái gì không?** (thumb + 6 giây đầu cho thấy đúng chủ đề; mỗi vật có tên)
2. **Hình có nói đúng điều lời nói không?** (giống ↔ giống, khác ↔ khác, mạnh ↔ mạnh; tắt tiếng vẫn hiểu)
3. **Mỗi khái niệm chỉ có một tên?** (một hệ danh pháp, một cách gọi nhóm, một ký hiệu cho một đại lượng)
4. **Thứ gì đặt trong hộp có vừa hộp không?** (chữ trong ô, nhãn trong thẻ, hình trong khung — dùng component tính cỡ theo hộp, không gõ số px tay)

Gặp lỗi mới: thêm một dòng vào bảng trên + một dòng `.agents/lessons.md`, và nếu chặn được bằng component hay `check_script` thì làm ở đó (agent sau không cần nhớ luật nữa).
