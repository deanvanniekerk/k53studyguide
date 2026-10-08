import { IonPage } from "@ionic/react";
import type React from "react";
import styled from "styled-components";
import { PageContent, PageHeader } from "@/app/components";
import { SettingsOutlineIcon } from "@/app/components/icons";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import { watermarkStyle } from "@/app/styles";
import { isBrowserPreview } from "@/services/analytics/browserPreview";
import { Checklist, Debug, History, Legal, Purchase, RateApp, Settings } from "./components";
import { BrowserPurchasePreview } from "./components/BrowserPurchasePreview";

const ProfilePage: React.FC = () => {
  useAnalytics("ProfilePage");
  return (
    <Page>
      <PageHeader title="profile" page="profile" />
      <Watermark />
      <Content>
        {isBrowserPreview && <BrowserPurchasePreview />}
        <Checklist />
        <History />
        <Purchase />
        <Settings />
        <RateApp />
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
