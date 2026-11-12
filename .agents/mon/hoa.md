# Gói môn — Hóa học

Đọc kèm skill `viet-kich-ban` (B1), `tao-audio` (B2), `dung-video` (B3). Luật ở đây **thêm vào** luật chung cho video Hóa học (`"subject": "hoa"`): siết thêm, ví dụ và component riêng của Hóa. Chỉ dòng nào trong mục **"Thay luật chung"** dưới đây mới thay luật chung (skill `viet-kich-ban` › mục 0 › Ba tầng luật).
Bài học kinh nghiệm đã gặp kèm ngày: `.agents/lessons.md`. Component Hóa: `src/components/chemistry/` (xem chạy thử: composition `hoa-thanh-phan`).
File máy đọc của gói: `.agents/mon/hoa.json` (bảng thuật ngữ chốt mục 2.2–2.3 cho `check_script`). Sửa bảng thuật ngữ → sửa cả hai, rồi chạy `py scripts/check_script.py --goi hoa`.

> **Cách đọc file này**: đọc sáu phép thử chung (`viet-kich-ban` › mục 0) rồi **mục 0** dưới đây trước mỗi bước (B1, B3). Mỗi luật ở mục 0 có ví dụ SAI/ĐÚNG và chỉ tới mục chi tiết.
> Gặp tình huống file này không nói tới → **hỏi người dùng**, không tự đặt luật. Sai kiến thức là lỗi nặng nhất.

## Thay luật chung
Không có — gói Hóa chỉ thêm vào luật chung, không thay luật nào.

---

## 0. 14 luật bắt buộc (đọc trước B1 và B3)

Luật 1, 2, 3, 10, 11, 12, 13 nay là phép thử chung (P2, P3, P0) và luật chung của hai skill; giữ ở đây vì có ví dụ Hóa.

| # | Luật | SAI (đã gặp) | ĐÚNG | Chi tiết |
|---|---|---|---|---|
| 1 | **Định hướng trước, thí nghiệm sau**: thứ ghi trong tiêu đề phải hiện ngay đầu video | Vào thẳng 2 cốc nước, 15 s sau mới thấy bảng | Dòng 1: bảng tuần hoàn, sáng 1 hàng rồi 1 cột → dòng 2: "vì sao Li và Na cùng cột?" → thí nghiệm | 1.4 |
| 2 | **Vật thật phải tự nói**: tắt tiếng vẫn biết đây là chất gì | 2 hình chữ nhật xám trong 2 cốc, không tên | Thẻ tên "Lithium (Li)", ký hiệu trên miếng kim loại, cốc có thành/vạch | 6.2 |
| 3 | **Lời nói khác → hình khác.** Lời nói "giống" ở điểm nào thì hình giống đúng điểm đó, còn lại phải khác | Li và Na vẽ y hệt nhau | Cùng sủi bọt + cùng hồng (giống: cùng kiểu phản ứng); Na chảy tròn, chạy nhanh, sủi mạnh (khác: mức độ) | 1.5, 6.2 |
| 4 | **Không vẽ tay bảng tuần hoàn / ô nguyên tố** — dùng `PeriodicTable`, `ElementTile` | Ô 25 px, chữ "Na" to hơn ô, tràn viền | Component tự tính cỡ chữ theo hai giới hạn: vừa ô và ≥ 28px; ô quá nhỏ thì tên đặt cạnh ô, ngoài lưới chữ. Nhấn bằng tô nền + viền | 6.3, 6.4 |
| 5 | **Một hệ tên duy nhất: IUPAC tiếng Anh** cho mọi nguyên tố, chất | Lúc "Sodium", lúc "natri"; "axit" | sodium, potassium, iron, acid, base, oxide… (cả trên hình và lời đọc) | 2.2 |
| 6 | **Gọi nhóm theo SGK THPT: IA…VIIIA, IB…VIIIB** | Trục ghi 1–18, rồi lại giải thích "1 ↔ IA" | Trục ghi IA, IIA, IIIB…; lời đọc "nhóm một A". Không bao giờ "nhóm 1" | 2.3 |
| 7 | **Số liệu lấy từ `elements.ts`**, không gõ theo trí nhớ | Tự gõ khối lượng, Z | `ElementTile symbol="Na"` tự lấy 11, Sodium, 22,99 | 2.5 |
| 8 | **Hạt trước, ký hiệu sau — cho từng khái niệm** (P1): ký hiệu/quy tắc chỉ hiện sau khi đã thấy thứ nó gọi tên | Phương trình hiện từ đầu, chưa thấy hạt nào đổi | Electron chạy từ Fe sang $\ce{Cu^2+}$ → rồi mới "số oxi hoá". Không hạn mức thời lượng cho phần ký hiệu | 1.1 |
| 9 | **Sân khấu ≥ 75% khung**: hình chính rộng ≥ 1500 px | Bảng tuần hoàn 450 px trong một thẻ trắng | `PeriodicTable width={1560}` | 6.3 + `AGENTS.md` |
| 10 | **Soát bằng mắt trước khi báo xong**: chạy `check_script`, xuất stills, làm *phép thử tắt tiếng*, điền checklist mục 7 | Báo xong khi lint sạch | Dán checklist mục 7 (có/không + frame) vào báo cáo | 7 |
| 11 | **Nội dung do người dùng duyệt**: agent không tự thu hẹp hay bỏ ý; trình *Bảng nội dung* (thẻ bài học → beat → hình) ở bước dàn ý | Prompt "phản ứng oxi hoá – khử" → video thành "Đồng từ đâu ra?", thiếu quy tắc số oxi hoá, thiếu ion | Bảng K1–K10 ↔ beat; mục nào bỏ là do người dùng chọn, ghi `boQuaDaDuyet` | 1.6, 2.6 |
| 12 | **Video bài học: tiêu đề là tên bài**, hook chỉ là cửa vào ≤ 20 s | Tiêu đề = câu hỏi của hook | `title` bắt đầu bằng "Phản ứng oxi hoá – khử" (thumb `BrandIntro` chung hiện đúng dòng này) | 1.6 |
| 13 | **Khái niệm mới → hình mới** (không chỉ thêm chữ lên hình cũ) — P3 | 70 s chỉ hai quả cầu Fe, Cu²⁺; khái niệm sau chỉ thêm dòng chữ | Số oxi hoá → `OxidationFormula`; tên gọi chéo → `RedoxRoleTable`; electron nhường = nhận → `ElectronBalance` | 6.7 |
| 14 | **Không đổi font; ion/công thức viết `$\ce{...}$`, không dùng ký tự mũ Unicode** | "Cu²⁺" gõ tay hiện vỡ thành "Cu²·" | `$\ce{Cu^2+}$` | 6.9 |

---

## 1. Tư duy kể chuyện & Trải nghiệm người xem (B1)

### 1.1. Tam giác Johnstone (Vĩ mô ↔ Vi mô ↔ Tượng trưng)
Hóa học là khoa học về **sự biến đổi của vật chất**; đừng biến nó thành "môn giải mol". Mọi kịch bản đi qua 3 đỉnh:
1. **Vĩ mô (Macroscopic)**: hiện tượng mắt thấy (đổi màu, sủi bọt, kết tủa, lửa, tỏa nhiệt).
2. **Vi mô (Submicroscopic)**: tầng hạt (nguyên tử, electron, liên kết đứt/tạo).
3. **Tượng trưng (Symbolic)**: công thức, phương trình $\ce{A + B -> C}$, cấu hình electron.

> [!IMPORTANT]
> **Hạt trước, ký hiệu sau — áp cho từng khái niệm, không cho cả video** (phép thử chung P1). Ký hiệu hay quy tắc mới chỉ hiện sau khi người xem đã thấy thứ nó gọi tên (hiện tượng, hạt, hoặc ví dụ đang có trên hình). Không có hạn mức thời lượng cho phần ký hiệu: thời lượng mỗi phần lấy theo Bảng nội dung đã duyệt. Phần ký hiệu vẫn dựng bằng hình (`OxidationFormula`, `ElectronBalance`…), không thành slide công thức.
> Ví dụ bài oxi hoá – khử: hook đinh iron (~20 s) → hạt: electron chạy từ Fe sang $\ce{Cu^2+}$ → K1 số oxi hoá, định nghĩa trên chính cú chuyển electron vừa thấy → K2–K5 dựng bằng `OxidationFormula`.
> **Thứ ghi trong tiêu đề** (bảng tuần hoàn, pin, phân tử…) được và phải hiện ngay đầu — xem 1.4 (P2).

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

### 1.4. Định hướng trước, thí nghiệm sau (luật 0.1)
Người xem bấm vào video vì tiêu đề. **3–6 giây đầu phải cho họ thấy đúng thứ tiêu đề nói tới**, rồi mới vào thí nghiệm làm bằng chứng.
- **Dòng 1 của b01** đưa thứ trong tiêu đề lên sân khấu lớn, sáng đúng chỗ câu hỏi nhắm tới.
- Ví dụ bài "Cấu tạo bảng tuần hoàn — vì sao có hàng và cột?":
  - b01-l01 `show`: "bảng tuần hoàn đầy đủ (PeriodicTable width 1560); chu kì 3 sáng lên" — `speak`: "Một trăm mười tám nguyên tố, xếp thành hàng ngang và cột dọc."
  - b01-l02 `show`: "nhóm IA sáng lên; Li và Na được khoanh" — `speak`: "Vì sao lithium và sodium lại đứng chung một cột?"
  - b01-l03 trở đi: thí nghiệm Li, Na thả vào nước (MetalInWater) — bằng chứng "giống nhau".
- SAI: mở bằng 2 cốc nước không tên, 15 giây sau mới thấy bảng → người xem không biết đang xem cái gì.

### 1.5. Lời nói so sánh → hình so sánh (luật 0.3)
Luật chung: phép thử P3 (`viet-kich-ban` › mục 0, `dung-video` › mục 0) — giống ở đâu thì hình giống đúng ở đó, khác ở đâu thì nhìn thấy khác ở đó; `check_script` liệt kê các dòng có lời so sánh để soát. Riêng Hóa:
- Ví dụ: Li và Na **cùng** sủi bọt khí, **cùng** hóa hồng với phenolphthalein (giống: cùng kiểu phản ứng); Na chảy tròn, chạy nhanh, sủi mạnh (khác: mức độ).
- Chưa biết thực tế hai chất khác nhau ra sao → tra bảng 6.2 hoặc hỏi người dùng, không đoán.
- Lời đọc không được ngầm nói "giống hệt": viết "**cùng kiểu** phản ứng, nhưng sodium phản ứng **mạnh hơn**".

### 1.6. Nội dung video: agent đề xuất, người dùng duyệt (luật 0.11, 0.12)
Luật chung (mọi môn): loại video `"loai"`, *Bảng nội dung* theo mẫu cố định, thẻ bài học, `boQuaDaDuyet`/`daPhuDaDuyet` — skill `viet-kich-ban` › Đầu vào, Thẻ bài học, Bước 1. Riêng Hóa:
- Phần "người xem sẽ thấy gì" của Bảng nội dung nêu hình Hóa tương ứng (mục 6.7: công thức ghi số oxi hoá, bảng hai cột chất khử/chất oxi hoá, cái cân electron…).
- Video bài học: `title` của `script.json` bắt đầu bằng tên bài; thumb là `BrandIntro` chung (6.1).

---

## 2. Kiến thức, thuật ngữ & danh pháp (B1)

### 2.1. Nguồn
- Chương trình **SGK GDPT 2018** (*Kết nối tri thức*, *Cánh diều*). Tra `references/hoa/` trước khi viết.
- **Bảng chốt ở mục 2.2–2.3 là chuẩn của dự án.** Thuật ngữ nào không có ở đây và không chắc SGK dùng thế nào → ghi vào "chỗ còn nghi ngờ" khi báo dàn ý, hỏi người dùng.

### 2.2. Danh pháp — MỘT hệ duy nhất: IUPAC tiếng Anh (luật 0.5)
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

### 2.3. Bảng tuần hoàn — thuật ngữ chốt (luật 0.6)
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

### 2.5. Số liệu và sự thật — không lấy từ trí nhớ (luật 0.7)
- Z, ký hiệu, tên, nhóm, chu kì, khối lượng: lấy từ `src/components/chemistry/elements.ts` (`element("Na")`). Thiếu khối lượng một nguyên tố → tra SGK, thêm vào `ATOMIC_MASS`, báo người dùng.
- Màu chất, màu lửa, kết tủa, hành vi thí nghiệm: bảng 6.2. Không có trong bảng → hỏi người dùng.
- Cấu hình electron, số electron từng lớp: tự tính lại một lần (điền theo thứ tự 1s 2s 2p 3s 3p 4s 3d…), ghi phép tính vào báo cáo.

### 2.6. Thẻ bài học — nguồn nội dung của video bài học
- Luật chung và mẫu: skill `viet-kich-ban` › Thẻ bài học, `references/_mau-the-bai-hoc.md`.
- Thẻ Hóa đã có: `references/hoa/lop-10/` Bài 5 (cấu tạo bảng tuần hoàn), Bài 13 (phản ứng oxi hoá – khử).
- Soạn thẻ Hóa mới: số liệu trong ví dụ tự kiểm (cộng số oxi hoá, đếm electron, lấy Z/khối lượng từ `elements.ts`) và ghi phép kiểm.

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

### 6.1. Thumb — dùng `BrandIntro` chung như mọi môn
Video Hóa dùng ảnh mở đầu chung `BrandIntro` (logo + `title` của `script.json`) mà `ExplainerVideo` tự đặt. **Không làm thumb riêng cho Hóa** (hình chính, từ khóa đổi màu…): người dùng chốt ngày 12/11/2026 mọi môn dùng một thumb. Thấy cần thumb khác → nêu ở storyboard, người dùng chọn (lối thoát của `AGENTS.md`).

### 6.2. Vật thật phải tự nói (luật 0.2, 0.3)
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

### 6.3. Bảng tuần hoàn — `PeriodicTable` (luật 0.4, 0.9)
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
| Bảng nhỏ chỉ để định vị, cạnh hình khác | `width` 700–1000, `symbols="highlighted"`. Ô quá nhỏ cho chữ 28px (bảng < ~1340) → component **tự** ghi ký hiệu của ô tô riêng (`cells`) cạnh ô, "nhóm IA" / "chu kì 3" cho nhóm/chu kì đang tô; không cần tự đặt nhãn. Chừa chỗ ~60px quanh bảng cho các tên này |
| Hiện số hiệu Z trong ô | `showZ` — chỉ hiện khi ô chứa được cả Z và ký hiệu ở cỡ đọc được (width ≳ 1700); nhỏ hơn thì dùng `ElementTile` |
| Dồn mắt vào ô được tô | `dimOthers={0.35–0.55}` |
| Không cần hàng f | `showFBlock={false}` |

Quy tắc:
- **Nhấn mạnh bằng tô nền + viền**, không phóng to chữ, không đổi cỡ ô.
- Chữ theo hai giới hạn (`fitFont`, `MIN_FONT` — `dung-video` quy tắc 4): không sửa `fontSize` trong component để "cho to" hay "cho vừa". Kiểm tra trước khi chia bố cục: `periodicSymbolsFit(width)`.
- Mỗi dòng lời đọc sáng **một** thứ (một chu kì, hoặc một nhóm, hoặc vài ô) — dùng `opacity: fadeIn(fr, L[i])`.
- Bảng giữ **nguyên vị trí và kích thước** suốt các beat cùng cảnh; thông tin phụ (sơ đồ lớp electron, ô phóng to) đặt ở vùng trống phía trên khối d (giữa nhóm IIA và IIIA, chu kì 1–3) hoặc dưới hàng f — không co bảng lại để nhường chỗ.

### 6.4. Ô nguyên tố phóng to — `ElementTile`
```tsx
<ElementTile symbol="Na" left={160} top={250} size={320} show={{ name: fadeIn(fr, L[1]), mass: fadeIn(fr, L[2]) }} focus="z" />
```
- Số liệu tự lấy từ `elements.ts`; `focus` tô phần đang được nói (`"z" | "symbol" | "name" | "mass"`).
- `size` 220–340. Các dòng xếp theo chiều cao chữ thật; tên dài (Praseodymium, Rutherfordium) cần ô to hơn → ô **tự nới** tới `elementTileMinSize(symbol)`, dùng hàm này khi chia bố cục. Không đủ chỗ cho 4 dòng → tự bỏ dòng khối lượng (hoặc `showMass={false}`).

### 6.5. Bảng màu nguyên tử CPK
H trắng `#FFFFFF` (viền `#CBD5E1`) · C xám than `#334155` · O đỏ san hô `#EF4444` · N xanh lam `#3B82F6` · Cl xanh lục `#22C55E` · Na tím nhạt `#A855F7` · S vàng `#EAB308` (chữ tối) · Fe cam đất `#F97316` · Cu nâu đồng `#D97706` · Ag bạc `#94A3B8` (chữ tối). Dữ liệu ở `CPK.ts`.

### 6.6. Vai trò màu (`role`)
`main` chất chính · `focus` liên kết đang đổi / $e^-$ / thứ đang nói tới · `pairA`–`pairB` chất oxi hoá–chất khử, acid–base · `warn` bẫy, năng lượng hoạt hoá cản trở · `dim` dung môi, khung nền. ≤ 5 màu nhấn mỗi cảnh.

### 6.7. Loại khái niệm → hình (luật 0.13)
Luật chung: P3 "khái niệm mới → hình mới" và thực đơn hình (`dung-video` › mục 0). Hình nghèo không phải do thiếu "sáng tạo" mà do dùng một hình cho mọi khái niệm. Component Hóa cho từng loại (dùng, hoặc đề xuất cách khác ở storyboard):

| Loại khái niệm | Hình | Component |
|---|---|---|
| Quy tắc có nhiều trường hợp (số oxi hoá: đơn chất / phân tử / ion) | ≥ 3 ví dụ **khác loại** đặt cạnh nhau, dòng phép cộng kiểm tra dưới mỗi ví dụ | `OxidationFormula` |
| Cặp tên gọi dễ nhầm (chất khử ↔ bị oxi hoá…) | bảng hai cột, hiện từng hàng theo lời đọc, tô cam hàng dễ nhầm | `RedoxRoleTable` |
| Bảo toàn (electron nhường = nhận) | cái cân: đĩa trái hiện trước → lệch; đĩa phải hiện → thăng bằng | `ElectronBalance` |
| Hiện tượng thật | dụng cụ + dấu hiệu thật (6.2), có thẻ tên | `NailInCopperSulfate`, `MetalInWater`, `LabGlassware` |
| Vị trí nguyên tố | bảng tuần hoàn / ô phóng to | `PeriodicTable`, `ElementTile` |
| Cơ chế hạt (electron chuyển) | hạt + mũi tên electron (1.2) | `Atom`, `ChemicalBond` |

- Khái niệm mới mà hình chỉ thêm một dòng chữ → trượt phép thử P3.
- Không ghi nhãn kiểu "Mô hình giản lược", "Mô hình minh hoạ" lên sân khấu (người xem tự hiểu — `lessons.md` 10/11/2026; `check-layout` báo lỗi).

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
Xem tất cả chạy thật: composition `hoa-thanh-phan` (frame 600–1080); thử cỡ nhỏ nhất / lớn nhất: frame 1080–1229.

### 6.8. Kích thước
Các component trên đã có cỡ chữ ≥ 36 px; đặt chúng **to** (bảng vai trò rộng ≥ 1100, cân ≥ 900, công thức `fontSize` 100–130). Sân khấu ≥ 75% khung (luật 0.9).

### 6.9. Font và cách viết ký hiệu (luật 0.14)
- **Không đổi font, không thêm font, không sửa `fontFamily`** trong component. Chữ dùng font chung của dự án (component Hóa đã đặt sẵn).
- Ion, công thức trong `text`/`keyword`/nhãn: viết `$\ce{Cu^2+}$`, `$\ce{SO4^2-}$`, `$\ce{H2SO4}$`. **Cấm ký tự mũ/chỉ số Unicode** (²⁺, ₄): font không có glyph, hiện vỡ. `check_script` báo lỗi.
- `\ce` cần extension mhchem: tự nạp khi video import bất kỳ thứ gì từ `components/chemistry`. Script có `\ce` mà video chưa dùng component Hóa nào → thêm `import "../../components/chemistry/mhchem";`. `check_script` báo lỗi nếu script có `\ce` mà video không import.
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
1. Frame 0 là thumb chung `BrandIntro` (logo + tiêu đề), không có thumb riêng?
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
14. Mỗi khái niệm mới có hình mới (không chỉ thêm chữ)?
15. Không ký tự mũ Unicode; mọi `\ce` hiển thị đúng (không có chữ đỏ)?

---

## 8. Lỗi đã gặp → luật (để nhận ra lỗi cùng họ trong bài khác)

| Ngày | Video | Lỗi | Họ lỗi | Chặn bằng |
|---|---|---|---|---|
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
| 12/11/2026 | hoa-thanh-phan | Sau khi chặn "chữ to hơn ô", số chu kì/tên nhóm còn 22px, ký hiệu bảng nhỏ 15px, nhãn cốc 30px, dòng trong ô nguyên tố dính nhau | Chữ không vừa hộp (chỉ chặn một phía) | `fitFont` hai giới hạn, tên ra cạnh ô khi ô nhỏ; đoạn thử cỡ nhỏ/lớn trong `hoa-thanh-phan` (frame 1080–1229) phải qua `check-layout` |
| 12/11/2026 | (gói Hóa) | Thêm thumb riêng `ChemIntro` cho Hóa, khác thumb chung của mọi môn | Gói môn tự làm khác luật chung mà người dùng chưa duyệt | Người dùng chốt mọi môn dùng `BrandIntro`; bỏ `ChemIntro` và prop `intro` của `ExplainerVideo` |
| 11/11/2026 | phan-ung-oxi-hoa-khu | "Cu²⁺" gõ ký tự mũ bị vỡ; `\ce` thiếu mhchem nên hiện chữ đỏ | Ký hiệu viết tay | Mục 6.9, `check_script`, chemistry tự nạp mhchem |

**Năm câu hỏi tổng quát** — tự hỏi ở mọi bài, kể cả bài chưa có trong bảng trên (nay là phép thử chung P0–P5, `viet-kich-ban` › mục 0):
0. **Video có dạy đúng và đủ thứ người dùng yêu cầu không?** (Bảng nội dung đã duyệt; không tự thu hẹp theo hook)
1. **Người xem có biết mình đang xem cái gì không?** (6 giây đầu cho thấy đúng chủ đề; mỗi vật có tên)
2. **Hình có nói đúng điều lời nói không?** (giống ↔ giống, khác ↔ khác, mạnh ↔ mạnh; tắt tiếng vẫn hiểu)
3. **Mỗi khái niệm chỉ có một tên?** (một hệ danh pháp, một cách gọi nhóm, một ký hiệu cho một đại lượng)
4. **Thứ gì đặt trong hộp có vừa hộp không?** (chữ trong ô, nhãn trong thẻ, hình trong khung — dùng component tính cỡ theo hộp, không gõ số px tay)

Gặp lỗi mới: thêm một dòng vào bảng trên + một dòng `.agents/lessons.md`, và nếu chặn được bằng component hay `check_script` thì làm ở đó (agent sau không cần nhớ luật nữa).
