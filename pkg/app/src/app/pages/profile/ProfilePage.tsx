import { Capacitor } from "@capacitor/core";
import { IonPage } from "@ionic/react";
import type React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { PageContent, PageHeader } from "@/app/components";
import { BrowserProgress } from "@/app/components/BrowserProgress";
import { SettingsOutlineIcon } from "@/app/components/icons";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import { watermarkStyle } from "@/app/styles";
import { isBrowserPreview } from "@/services/analytics/browserPreview";
import { accessModelSelector } from "@/state/access";
import { Checklist, Debug, History, Legal, Purchase, RateApp, Settings } from "./components";
import { BrowserPurchasePreview } from "./components/BrowserPurchasePreview";

const ProfilePage: React.FC = () => {
  useAnalytics("ProfilePage");
  const model = useSelector(accessModelSelector);
  return (
    <Page>
      <PageHeader title="profile" page="profile" />
      <Watermark />
      <Content>
        {isBrowserPreview && model === "mobile" && <BrowserPurchasePreview />}
        <BrowserProgress />
        <Checklist />
        <History />
        <Purchase />
        <Settings />
        {Capacitor.getPlatform() !== "web" && <RateApp />}
        <Legal />
        {__SHOW_DEBUG__ && !isBrowserPreview && <Debug />}
      </Content>
    </Page>
  );
};

const Watermark = styled(SettingsOutlineIcon)`
  ${watermarkStyle}
  fill: var(--app-text-primary);
  opacity: 0.06;
`;

const Content = styled(PageContent)`
  --background: transparent;
  --padding-bottom: var(--app-section-gap);
`;

const Page = styled(IonPage)`
  background: var(--app-profile-background);
`;

export default ProfilePage;
