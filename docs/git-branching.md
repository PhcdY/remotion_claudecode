# Quy định Đặt tên Nhánh, Quản lý Git & Phát hành Phiên bản (Git Branching & Release Guide)

> [!IMPORTANT]
> **Triết lý Dự án: Engine / Framework chứ không phải Kho chứa Video**
> - Repo này là **bộ khung công cụ (Engine / Framework)** sản xuất video: core components, scripts, skills, rules và gói môn.
> - **Làm video mới KHÔNG CẦN chia nhánh Git**: Creator/User chỉ cần clone nhánh chính hoặc checkout bản Release ổn định về, tạo kịch bản, render ra file MP4 rồi tự lưu trữ vào máy cá nhân. Video thành phẩm (`out/`) không phải là tính năng của repo và không đưa lên Git.
> - **Nhánh Git CHỈ TẠO KHI**: Phát triển, nâng cấp hoặc sửa đổi chính bộ công cụ/hệ thống (thêm component dùng chung, bổ sung skill mới, sửa lỗi script tự động, đóng gói release hoặc nâng cấp quy chuẩn môn học).

---

## 1. Cấu trúc Tên Nhánh (Naming Convention)

Tên nhánh phải tuân theo cấu trúc 3 phần:

```text
[môn]_[tag]_[describe]
```
*(Hoặc có thể dùng cú pháp phân cấp thư mục Git `[môn]/[tag]/[describe]` để GitHub và VS Code tự động nhóm nhánh vào folder).*

### 1.1. Mã môn (`[môn]`)
- **Môn học cụ thể**: `toan`, `ly`, `hoa`, `sinh`, `su`, `dia`, `van`, `ktpl`, `anh`... (khi thay đổi gói quy chuẩn môn hoặc component đặc thù của môn đó).
- **Khung chung toàn dự án**: `all` (áp dụng cho core components, Remotion config, skills, agents, scripts, rules, styles).

### 1.2. Phân loại công việc (`[tag]`)
Chỉ sử dụng các tag chuẩn sau (viết thường):

| Tag | Ý nghĩa | Khi nào dùng? (Chỉ cho quá trình phát triển Engine) |
| :--- | :--- | :--- |
| `feature` | Tính năng mới cho hệ thống | Thêm component dùng chung mới (ví dụ: đồ thị 3D, thanh thước đo), thêm skill mới, thêm gói môn mới |
| `fix` | Sửa lỗi hệ thống / core | Sửa lỗi component dùng chung (lỗi nhãn đè nhau trong `AutoLabels`, lỗi tràn thẻ `SectionCard`), sửa script TTS/alignment |
| `refactor` | Tái cấu trúc mã nguồn | Gom component trùng lặp vào `src/components/`, tối ưu code SVG, dọn dẹp import (không đổi giao diện) |
| `test` | Thử nghiệm kỹ thuật | Thử nghiệm hiệu ứng Remotion mới, benchmark tốc độ render, test model TTS mới |
| `release` | Chuẩn bị phát hành phiên bản mới | Đóng gói một mốc phiên bản ổn định (v1.0.0), kiểm thử toàn diện toàn bộ pipeline trước khi gắn Git Tag chính thức |
| `docs` | Tài liệu & Quy định | Cập nhật hướng dẫn sử dụng, sửa quy chuẩn gói môn `.gemini/mon/`, bổ sung tài liệu SGK |

> [!NOTE]
> Lưu ý chính tả: Luôn dùng `refactor` (không dùng *refractor*).

### 1.3. Mô tả ngắn (`[describe]`)
- **Bắt buộc**: Viết bằng **tiếng Việt không dấu** hoặc **tiếng Anh**, nối nhau bằng dấu gạch ngang `-` (`kebab-case`).
- **Tuyệt đối không**:
  - Không dùng tiếng Việt có dấu (`sua-loi`, KHÔNG dùng `sửa-lỗi`).
  - Không chứa khoảng trắng (dấu cách).
  - Không dùng ký tự đặc biệt (`!@#$%^&*()_+`).

---

## 2. Bảng Ví dụ Mẫu Chuẩn

| Mục tiêu phát triển hệ thống | Tên nhánh chuẩn (`_`) | Tên nhánh dạng Folder (`/`) |
| :--- | :--- | :--- |
| Thêm component vẽ trục không gian 3D cho Toán | `toan_feature_truc-khong-gian-3d` | `toan/feature/truc-khong-gian-3d` |
| Sửa lỗi chữ bị đè trong nhãn tự động (`AutoLabels`) | `all_fix_de-nhan-autolabels` | `all/fix/de-nhan-autolabels` |
| Tái cấu trúc bộ component `plot.tsx` | `all_refactor_plot-components` | `all/refactor/plot-components` |
| Thử nghiệm tích hợp Remotion Three | `all_test_remotion-three` | `all/test/remotion-three` |
| Đóng gói và chuẩn bị phát hành phiên bản v1.0.0 | `all_release_v1.0.0` | `all/release/v1.0.0` |
| Bổ sung quy chuẩn gói môn Hoá học | `hoa_docs_goi-mon-hoa-hoc` | `hoa/docs/goi-mon-hoa-hoc` |
| Bổ sung gói môn Tiếng Anh và 5 Archetypes | `anh_feature_goi-mon-anh` | `anh/feature/goi-mon-anh` |
| Khởi tạo gói môn Kinh tế và Pháp luật | `ktpl_feature_goi-mon-ktpl` | `ktpl/feature/goi-mon-ktpl` |
| Cập nhật hướng dẫn người dùng và quy chuẩn PR | `all_docs_cap-nhat-huong-dan-pr` | `all/docs/cap-nhat-huong-dan-pr` |
| Sửa script `vivibe_tts.py` hỗ trợ multi-voice | `all_fix_vivibe-multi-voice` | `all/fix/vivibe-multi-voice` |

---

## 3. Vòng đời Nhánh & Quản lý Nhánh (Branch Lifecycle)

### 3.1. Nhánh chính (`gemini` / `main`)
- Là nguồn chân lý (Source of Truth) và nhánh tích hợp liên tục (CI) của toàn bộ dự án.
- Code trên nhánh chính luôn phải qua kiểm tra:
  - `py scripts/check_script.py <slug>`: 0 lỗi.
  - `npm run lint`: 0 lỗi.
  - Không có file rác chưa commit.

### 3.2. Nhánh phát hành (`[môn]_release_[describe]`)
- Nhánh tạm thời dùng để đóng băng (feature freeze), kiểm thử lần cuối toàn diện (lint, render thử, đối soát kịch bản) và chuẩn bị ghi chú phát hành trước khi gắn Git Tag.
- Sau khi gắn Git Tag và merge vào nhánh chính, nhánh release có thể xoá hoặc chuyển vào lưu trữ.

### 3.3. Nhánh lưu trữ cũ (`archive/*`)
- Các nhánh thử nghiệm cũ hoặc phiên bản lịch sử không còn phát triển tiếp nhưng cần giữ lại tham khảo sẽ được gom vào tiền tố `archive/`:
  - Ví dụ: `archive/main-cu`, `archive/commit-dau`, `archive/test-chia-model`.
- **Cách lưu trữ nhanh bằng Tag**:
  - Gắn tag vĩnh viễn: `git tag archive/<ten-nhanh> <branch>`
  - Sau đó có thể xoá nhánh làm việc trên GitHub để giữ danh sách nhánh luôn gọn gàng.

---

## 4. Quy trình Phát hành Phiên bản & Thử nghiệm Tính năng (Release & Testing Guide)

### 4.1. Phân biệt Nhánh Tích hợp (`gemini`/`main`) vs Bản Phát hành (`release` / Git Tag)

| Tiêu chí | Nhánh Chính (`gemini` / `main`) | Bản Phát hành (`release` / Git Tag) |
| :--- | :--- | :--- |
| **Bản chất** | Nhánh làm việc liên tục (Living branch), nơi tích hợp các PR tính năng và sửa lỗi mới nhất. | Cột mốc đóng băng (Snapshot) được đánh số cụ thể (VD: `v1.0.0`), không thay đổi mã nguồn. |
| **Mục đích** | Phục vụ lập trình viên tiếp tục phát triển framework. | Phục vụ người làm video, cộng tác viên sản xuất nội dung với độ ổn định tuyệt đối. |
| **Khuyến nghị sử dụng** | Khi cần code tính năng mới, tạo nhánh từ đây. | Khi làm video hàng ngày, checkout về tag release này. |

### 4.2. Quy tắc Đánh số Phiên bản (Semantic Versioning - SemVer)
Áp dụng định dạng chuẩn `vMAJOR.MINOR.PATCH`:
- **MAJOR** (`v1.0.0` $\to$ `v2.0.0`): Thay đổi kiến trúc lớn, phá vỡ tính tương thích ngược (breaking change) của engine, layout core hoặc schema kịch bản `script.json`.
- **MINOR** (`v1.0.0` $\to$ `v1.1.0`): Bổ sung tính năng mới, gói môn học mới, hoặc thêm bộ component dùng chung lớn mà không làm hỏng các video cũ.
- **PATCH** (`v1.0.0` $\to$ `v1.0.1`): Sửa lỗi vặt, tinh chỉnh script TTS/Alignment, tối ưu font/style hoặc cập nhật tài liệu SGK.
- **Pre-release (Thử nghiệm diện rộng)**: `v1.1.0-beta.1`, `v1.1.0-rc.1` (khi muốn đưa cộng tác viên trải nghiệm trước khi phát hành chính thức).

### 4.3. Quy trình Thử nghiệm Tính năng Mới (Feature Testing)
Khi bạn muốn thêm một tính năng hoặc thử nghiệm kỹ thuật mới:

1. **Người phát triển**: Tạo nhánh theo quy ước (VD: `toan_feature_truc-khong-gian-3d` hoặc `all_test_remotion-three`), commit code và push lên GitHub.
2. **Người muốn trải nghiệm**: Không cần đợi merge vào `gemini`/`main`, chỉ cần kéo nhánh đó về máy:
   ```bash
   git fetch origin
   git checkout toan_feature_truc-khong-gian-3d
   npm run dev
   ```
3. **Thử nghiệm an toàn tại Phòng Lab**:
   - Mở composition `LabThanhPhan` (`src/videos/lab-thanh-phan/`) trên Remotion Studio để xem tương tác đồ hoạ và chuyển động.
   - Góp ý hoặc báo lỗi trực tiếp cho người phát triển. Nhánh chính (`gemini`) hoàn toàn không bị ảnh hưởng.
4. **Sau khi hoàn thiện & kiểm thử đạt chuẩn**: Tạo Pull Request để merge vào nhánh chính.

### 4.4. Quy trình 3 Bước Đóng gói & Phát hành Release
Mỗi khi hệ thống tích lũy đủ các tính năng quan trọng và đạt mốc ổn định cao:

* **Bước 1: Tạo nhánh phát hành**
  ```bash
  git checkout gemini
  git pull origin gemini
  git checkout -b all_release_v1.0.0
  ```
* **Bước 2: Thẩm định toàn diện (Verification Gate)**
  - Chạy `npm run lint`: Phải đạt 0 lỗi.
  - Chạy `py scripts/check_script.py <slug>` trên các video mẫu.
  - Render thử nghiệm 1 video hoàn chỉnh để đảm bảo âm thanh Vivibe, subtitle và font chữ KaTeX render trơn tru.
* **Bước 3: Gắn Git Tag & Đẩy lên GitHub**
  ```bash
  git tag -a v1.0.0 -m "Release v1.0.0: Phien ban on dinh dau tien cua Engine Video AI"
  git push origin v1.0.0
  git push -u origin all_release_v1.0.0
  ```
  Tạo Pull Request merge nhánh `all_release_v1.0.0` vào `gemini` để hoàn tất chu trình.

### 4.5. Hướng dẫn Dành cho Người làm Video (Creator)
- **Để có môi trường làm việc ổn định nhất**:
  ```bash
  git checkout v1.0.0
  ```
- **Khi đội ngũ thông báo có bản release mới**:
  ```bash
  git fetch --tags
  git checkout v1.1.0
  ```

---

## 5. Quy chuẩn Soạn Mô tả Pull Request (PR Standard)

> [!IMPORTANT]
> **Quy chuẩn Giao tiếp khi Push Git**:
> Mỗi khi hoàn thành công việc trên một nhánh và push lên GitHub, AI/Lập trình viên **BẮT BUỘC** soạn sẵn nội dung Pull Request hoàn chỉnh theo mẫu dưới đây ngay trong khung chat để người dùng chỉ việc copy-paste vào giao diện tạo PR trên GitHub.

### Mẫu Định dạng PR Chuẩn:

```markdown
## 🎯 Mục tiêu (Objective)
- [Tóm tắt 1-2 câu về mục tiêu của PR: tính năng mới, sửa lỗi, nâng cấp tài liệu hay refactor]

## 🛠️ Thay đổi Chính (Key Changes)
- **Core / Scripts / Docs**: [Liệt kê các module hoặc component được tạo mới / chỉnh sửa]
- **Tính năng / Cải tiến**: [Mô tả chi tiết những điểm nổi bật]
- **Quy chuẩn mới**: [Bổ sung vào .gemini/lessons.md hoặc gói môn nếu có]

## 🧪 Kiểm tra Thực tế (Verification)
- [x] `py scripts/check_script.py <slug>`: 0 lỗi (nếu có chỉnh sửa kịch bản)
- [x] `npm run lint`: 0 lỗi TypeScript / ESLint
- [x] Đã đối chiếu các liên kết markdown tương đối (relative links), không dùng link tuyệt đối `file:///`
- [x] Đã kiểm tra giao diện hoặc render thử nghiệm (nếu có thay đổi component)

## 📌 Ghi chú Thêm (Notes)
- [Ghi chú về biến môi trường mới, lưu ý khi merge hoặc hướng phát triển tiếp theo]
```

---

## 6. Cheat-sheet Lệnh Git Thường Dùng

```bash
# --- Làm việc với Tính năng & Nhánh ---
# 1. Tạo nhánh mới từ nhánh chính và chuyển sang nhánh đó
git checkout gemini   # hoặc main
git pull origin gemini
git checkout -b toan_feature_bai-moi

# 2. Kiểm tra trạng thái code trước khi commit
git status

# 3. Commit theo chuẩn Conventional Commits
git add .
git commit -m "feat(toan): mo ta ngan gon cong viec"

# 4. Đẩy nhánh mới lên GitHub
git push -u origin toan_feature_bai-moi

# --- Thử nghiệm Tính năng từ người khác ---
git fetch origin
git checkout toan_feature_bai-moi
npm run dev

# --- Phát hành Phiên bản (Release Tag) ---
# Tạo và đẩy tag release lên GitHub
git tag -a v1.0.0 -m "Release v1.0.0: Phien ban on dinh dau tien"
git push origin v1.0.0

# Kéo tag mới nhất về và checkout
git fetch --tags
git checkout v1.0.0

# --- Lưu trữ Nhánh cũ ---
git tag archive/ten-nhanh-cu ten-nhanh-cu
git push origin --tags
```
