import { MyComposition } from "./Composition";
import { BrandPreviewComposition } from "./components/BrandPreview";
import { BanChatDaoHamComposition } from "./videos/ban-chat-dao-ham/Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <BanChatDaoHamComposition />
      <BrandPreviewComposition />
    </>
  );
};
