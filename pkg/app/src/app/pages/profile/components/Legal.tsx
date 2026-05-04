import { IonButton, IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import type React from "react";
import styled from "styled-components";
import { HorizontalRule } from "@/app/components";

const PRIVACY_POLICY_URL = "https://k53studyguide.online/privacy.html";
const TERMS_OF_USE_URL = "https://k53studyguide.online/terms.html";

const openLegalUrl = (url: string) => {
  window.open(url, "_system", "noopener,noreferrer");
};

const Legal: React.FC = () => {
  return (
    <Grid>
      <FullRow>
        <TitleCol>
          <Title>Legal</Title>
        </TitleCol>
      </FullRow>
      <FullRow>
        <Col>
          <Info>Review the policies that apply to K53 Study Guide.</Info>
        </Col>
      </FullRow>
      <ButtonRow>
        <ButtonCol>
          <IonButton color="dark" shape="round" fill="solid" onClick={() => openLegalUrl(PRIVACY_POLICY_URL)}>
            Privacy Policy
          </IonButton>
        </ButtonCol>
        <ButtonCol>
          <IonButton color="dark" shape="round" fill="outline" onClick={() => openLegalUrl(TERMS_OF_USE_URL)}>
            Terms of Use
          </IonButton>
        </ButtonCol>
      </ButtonRow>
      <FullRow>
        <IonCol>{LineBreak}</IonCol>
      </FullRow>
    </Grid>
  );
};

const Grid = styled(IonGrid)`
  padding: 0 16px;
  margin-top: 15px;
`;

const Title = styled(IonText)`
  opacity: 0.5;
  font-family: var(--ion-font-family-bold);
  font-weight: bold;
  text-transform: uppercase;
`;

const TitleCol = styled(IonCol)`
  padding-bottom: 5px;
`;

const Info = styled(IonText)`
  opacity: 0.8;
  font-size: var(--ion-font-size-md);
`;

const FullRow = styled(IonRow)`
  padding: 7px 0;
  align-items: center;
`;

const ButtonRow = styled(IonRow)`
  padding: 7px 0;
  align-items: center;
  gap: 8px;
`;

const Col = styled(IonCol)`
  padding-bottom: 5px;
`;

const ButtonCol = styled(IonCol)`
  flex: 0;
  white-space: nowrap;
`;

const LineBreak = <HorizontalRule leftMargin={0} rightMargin={0} paddingBottom={0} paddingTop={0} />;

export { Legal };
