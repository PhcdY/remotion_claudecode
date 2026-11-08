import React from "react";
import { MyComposition } from "./Composition";
import { BrandPreviewComposition } from "./components/BrandPreview";
import { BanChatDaoHamComposition } from "./videos/ban-chat-dao-ham/Video";
import { CucTriComposition } from "./videos/cuc-tri-gtln-gtnn/Video";
import { DonDieuComposition } from "./videos/don-dieu/Video";
import { LabComposition } from "./videos/lab-thanh-phan/Video";
import { DemoGiaiDoan2Composition } from "./videos/demo-giai-doan-2/Video";
import { TiemCanComposition } from "./videos/tiem-can/Video";
import { KhaoSatBacBaComposition } from "./videos/khao-sat-bac-ba/Video";
import { KhaoSatPhanThucComposition } from "./videos/khao-sat-phan-thuc/Video";
import { TiemCanXienComposition } from "./videos/tiem-can-xien/Video";
import { VectoKhongGianComposition } from "./videos/vecto-khong-gian/Video";
import { ToiUuLonNhomComposition } from "./videos/toi-uu-lon-nhom/Video";
import { TichVoHuongComposition } from "./videos/tich-vo-huong/Video";
import { HeTrucToaDoKhongGianComposition } from "./videos/he-truc-toa-do-khong-gian/Video";
import { BieuThucToaDoPhepToanVectoComposition } from "./videos/bieu-thuc-toa-do-phep-toan-vecto/Video";
import { PhysicsShowcaseComposition } from "./videos/physics-showcase/Video";
import { PhysicsShowcase2Composition } from "./videos/physics-showcase-2/Video";
import { ChemistryShowcaseComposition } from "./videos/chemistry-showcase/Video";

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
      <KhaoSatPhanThucComposition />
      <TiemCanXienComposition />
      <VectoKhongGianComposition />
      <ToiUuLonNhomComposition />
      <TichVoHuongComposition />
      <HeTrucToaDoKhongGianComposition />
      <BieuThucToaDoPhepToanVectoComposition />
      <PhysicsShowcaseComposition />
      <PhysicsShowcase2Composition />
      <ChemistryShowcaseComposition />
    </>
  );
};
