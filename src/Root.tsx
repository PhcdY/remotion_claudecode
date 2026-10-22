import { MyComposition } from "./Composition";
import { BrandPreviewComposition } from "./components/BrandPreview";
import { BanChatDaoHamComposition } from "./videos/ban-chat-dao-ham/Video";
import { CucTriComposition } from "./videos/cuc-tri-gtln-gtnn/Video";
import { DonDieuComposition } from "./videos/don-dieu/Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <BanChatDaoHamComposition />
      <DonDieuComposition />
      <CucTriComposition />
      <BrandPreviewComposition />
    </>
  );
};
