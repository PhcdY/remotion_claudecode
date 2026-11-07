// Bundle project Remotion cho các script (storyboard, check-layout, stills, export-captions)
// và tự xóa bản bundle tạm khi script thoát — kể cả khi lỗi hay bị ngắt.
// Lý do (25/10/2026): mỗi lần chạy để lại một thư mục remotion-webpack-bundle-* trong Temp;
// tích lại 116 thư mục, 5,2 GB, ổ C đầy và render hỏng ở bước trộn audio.
import { bundle } from "@remotion/bundler";
import { rmSync } from "node:fs";
import path from "node:path";

export const bundleProject = async (root) => {
  const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "public") });
  let done = false;
  const cleanup = () => {
    if (done) return;
    done = true;
    try {
      rmSync(serveUrl, { recursive: true, force: true });
    } catch {
      // không xóa được (file đang bị khóa) thì thôi, không làm hỏng kết quả của script
    }
  };
  process.on("exit", cleanup);
  for (const sig of ["SIGINT", "SIGTERM"]) {
    process.on(sig, () => {
      cleanup();
      process.exit(130);
    });
  }
  return serveUrl;
};
