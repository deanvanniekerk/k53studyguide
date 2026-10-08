import { Browser } from "@capacitor/browser";
import { IonButton } from "@ionic/react";
import { Translate } from "@k53studyguide/shared/translation";
import type React from "react";
import styled from "styled-components";
import { GroupCard, Section, SectionTitle } from "./";

const PRIVACY_POLICY_URL = "https://k53studyguide.online/privacy.html";
const TERMS_OF_USE_URL = "https://k53studyguide.online/terms.html";

const openLegalUrl = (url: string) => {
  void Browser.open({ url });
};

const Legal: React.FC = () => {
  return (
    <Section>
      <SectionTitle>
        <Translate text="legal" />
      </SectionTitle>
      <GroupCard>
        <PanelContent>
          <Info>
            <Translate text="legalInfo" />
          </Info>
          <ButtonRow>
            <SecondaryButton shape="round" fill="outline" onClick={() => openLegalUrl(PRIVACY_POLICY_URL)}>
              <Translate text="privacyPolicy" />
            </SecondaryButton>
            <SecondaryButton shape="round" fill="outline" onClick={() => openLegalUrl(TERMS_OF_USE_URL)}>
              <Translate text="termsOfUse" />
            </SecondaryButton>
          </ButtonRow>
        </PanelContent>
      </GroupCard>
    </Section>
  );
};

const PanelContent = styled.div`
  padding: var(--app-card-padding);
`;

const Info = styled.div`
  color: var(--app-text-muted);
  font-size: var(--app-font-size-md);
  font-weight: 700;
  line-height: 1.45;
`;

const ButtonRow = styled.div`
  display: grid;
  gap: 8px;
  margin-top: var(--app-stack-gap);
`;

const SecondaryButton = styled(IonButton)`
  height: 48px;
  margin: 0;
  font-weight: 900;
  --border-color: var(--app-profile-card-border-color);
  --border-radius: 16px;
  --color: var(--app-text-primary);
`;

export { Legal };
