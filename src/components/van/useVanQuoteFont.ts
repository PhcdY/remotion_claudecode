import { useEffect, useState } from "react";
import { staticFile, useDelayRender } from "remotion";

/** Font trích dẫn của môn Văn: Lora có đủ dấu tiếng Việt, nạp từ public/van (giấy phép OFL cùng thư mục). */
export const fontQuote = "Lora Van";

let ready: Promise<FontFace> | undefined;

const loadQuoteFont = () => {
  ready ??= new FontFace(fontQuote, `url("${staticFile("van/lora.ttf")}")`, { weight: "400 700" })
    .load()
    .then((face) => {
      document.fonts.add(face);
      return face;
    })
    .catch((error: unknown) => {
      ready = undefined;
      throw error;
    });
  return ready;
};

/** Giữ render tới khi font trích dẫn nạp xong, tránh frame đầu bị lỗi dấu. */
export const useVanQuoteFont = () => {
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Đang nạp font trích dẫn môn Văn"));
  useEffect(() => {
    let active = true;
    loadQuoteFont().then(
      () => {
        if (active) continueRender(handle);
      },
      (error: Error) => {
        if (active) cancelRender(error);
      },
    );
    return () => {
      active = false;
      continueRender(handle);
    };
  }, [cancelRender, continueRender, handle]);
};
