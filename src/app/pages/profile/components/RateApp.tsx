import { HorizontalRule } from '@/app/components';
import { useAnalytics } from '@/app/hooks/useAnalytics';
import { useAppRate } from '@/app/hooks/useAppRate';
import { IonButton, IonCol, IonGrid, IonRow, IonText } from '@ionic/react';
import React from 'react';
import { Translate } from 'react-translated';
import styled from 'styled-components';

const RateApp: React.FC = () => {
  const appRate = useAppRate();
  const { logEvent } = useAnalytics();
  return (
    <Grid>
      <FullRow>
        <TitleCol>
          <Title>
            <Translate text="app" />
          </Title>
        </TitleCol>
      </FullRow>
      <FullRow>
        <Col>
          <Info>
            <Translate text="rateAppRequest" />
          </Info>
        </Col>
      </FullRow>
      <FullRow>
        <Col>
          <IonButton
            color="dark"
            shape="round"
            fill="solid"
            onClick={() => {
              logEvent('RATE_APP');
              appRate.navigateToAppStore();
            }}
          >
            <Translate text="rateApp" />
          </IonButton>
        </Col>
      </FullRow>
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

const Col = styled(IonCol)`
  padding-bottom: 5px;
`;

const LineBreak = <HorizontalRule leftMargin={0} rightMargin={0} paddingBottom={0} paddingTop={0} />;

export { RateApp };
