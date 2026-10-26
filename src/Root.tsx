import { MyComposition } from "./Composition";
import { BrandPreviewComposition } from "./components/BrandPreview";
import { BanChatDaoHamComposition } from "./videos/ban-chat-dao-ham/Video";
import { CucTriComposition } from "./videos/cuc-tri-gtln-gtnn/Video";
import { DonDieuComposition } from "./videos/don-dieu/Video";
import { LabComposition } from "./videos/lab-thanh-phan/Video";
import { DemoGiaiDoan2Composition } from "./videos/demo-giai-doan-2/Video";
import { TiemCanComposition } from "./videos/tiem-can/Video";
import { KhaoSatBacBaComposition } from "./videos/khao-sat-bac-ba/Video";
import { TiemCanXienComposition } from "./videos/tiem-can-xien/Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <BanChatDaoHamComposition />
      <DonDieuComposition />
      <CucTriComposition />
      <BrandPreviewComposition />
      <LabComposition />
      <DemoGiaiDoan2Composition />
      <TiemCanComposition />
      <KhaoSatBacBaComposition />
      <TiemCanXienComposition />
    </>
  );
};
