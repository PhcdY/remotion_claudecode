// Nạp extension mhchem cho KaTeX để `$\ce{...}$` hiển thị được (MathText để throwOnError: false,
// thiếu extension thì \ce hiện thành chữ lỗi đỏ mà không báo). Mọi file trong chemistry/ import file này;
// video Hóa chỉ cần import bất kỳ thứ gì từ "components/chemistry" là có \ce.
import "katex/contrib/mhchem";

export const MHCHEM_READY = true;
