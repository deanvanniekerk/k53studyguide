import { IonAlert, IonButton, IonIcon } from "@ionic/react";
import { Translate, Translator } from "@k53studyguide/shared/translation";
import { checkmarkCircle } from "ionicons/icons";
import type React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import type { RootState } from "@/state";
import { ownedSelector } from "@/state/purchase";
import { testsPassedSelector } from "@/state/test/log";
import { recieveCurrentSection, recieveQuestionAnswers, testInProgressSelector } from "@/state/test/session";

type Props = PropsFromState & PropsFromDispatch;

const HeaderComponent: React.FC<Props> = (props) => {
  const [showResetTestAlert, setShowResetTestAlert] = useState(false);

  return (
    <Wrapper>
      {props.hasFullAccess && (
        <PracticeCard>
          <OpenRoadIllustration
            src="/assets/images/premium/open-road.webp"
            alt=""
            width={1536}
            height={1024}
            decoding="async"
          />
          <PracticeTitle>
            <Translate text={props.testInProgress ? "testPracticeContinueTitle" : "testPracticeTitle"} />
          </PracticeTitle>
          <PracticeSummary>
            <MetricArea>
              <Counter>{props.testsPassed}</Counter>
              <MetricLabel>
                <Translate text="testsCompleted" />
              </MetricLabel>
            </MetricArea>
            <MasteryText>
              <Translate text={props.testsPassed >= 3 ? "testPracticeKeepGoing" : "testMasteryGoal"} />
            </MasteryText>
          </PracticeSummary>
          {props.testInProgress && (
            <ResetButton fill="clear" onClick={() => setShowResetTestAlert(true)}>
              <Translate text="resetCurrentTest" />
            </ResetButton>
          )}
        </PracticeCard>
      )}
      {!props.hasFullAccess && (
        <UnlockCard>
          <OpenRoadIllustration
            src="/assets/images/premium/open-road.webp"
            alt=""
            width={1536}
            height={1024}
            decoding="async"
          />
          <UnlockTitle>
            <Translate text="testLockedTitle" />
          </UnlockTitle>
          <UnlockText>
            <Translate text="testLockedInfo" />
          </UnlockText>
          <BenefitList>
            <BenefitRow>
              <BenefitIcon icon={checkmarkCircle} />
              <BenefitText>
                <Translate text="testLockedBenefitStructure" />
              </BenefitText>
            </BenefitRow>
            <BenefitRow>
              <BenefitIcon icon={checkmarkCircle} />
              <BenefitText>
                <Translate text="testLockedBenefitScoring" />
              </BenefitText>
            </BenefitRow>
            <BenefitRow>
              <BenefitIcon icon={checkmarkCircle} />
              <BenefitText>
                <Translate text="testLockedBenefitMastery" />
              </BenefitText>
            </BenefitRow>
          </BenefitList>
        </UnlockCard>
      )}
      <Translator>
        {({ translate }) => (
          <IonAlert
            isOpen={showResetTestAlert}
            onDidDismiss={() => setShowResetTestAlert(false)}
            message={translate({ text: "resetCurrentTestConfirm" })}
            buttons={[
              translate({ text: "cancel" }),
              {
                text: translate({ text: "resetCurrentTest" }),
                handler: () => {
                  props.recieveQuestionAnswers([]);
                  props.recieveCurrentSection("A");
                  setShowResetTestAlert(false);
                },
              },
            ]}
          />
        )}
      </Translator>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--app-page-content-top) var(--app-padding) 24px;
  text-align: center;
`;

const MetricArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 14px;
`;

const Counter = styled.div`
  color: var(--app-test-accent);
  font-size: 3rem;
  font-family: var(--ion-font-family-bold);
  font-weight: 900;
  line-height: 1;
`;

const MetricLabel = styled.div`
  color: var(--app-text-primary);
  font-size: var(--app-font-size-xl);
  font-weight: 800;
`;

const MasteryText = styled.div`
  color: var(--app-text-muted);
  font-size: var(--app-font-size-l);
  font-weight: 700;
  line-height: 1.45;
`;

const UnlockCard = styled.div`
  width: 100%;
  max-width: 520px;
  margin-top: 0;
  padding: 22px 20px;
  border: var(--app-card-border);
  border-radius: 24px;
  background: var(--app-card-background);
  box-shadow: var(--app-card-shadow);
`;

const PracticeCard = styled(UnlockCard)`
  padding: 22px 20px 20px;
`;

const PracticeSummary = styled.div`
  margin-top: 22px;
  padding: 16px;
  border: var(--app-card-border);
  border-radius: 18px;
  background: var(--app-premium-badge-background);
  text-align: left;
`;

const OpenRoadIllustration = styled.img`
  display: block;
  width: 100%;
  height: clamp(112px, 22vh, 184px);
  object-fit: contain;
  margin: -4px auto 16px;

  @media (max-height: 650px) {
    height: 96px;
    margin-bottom: 12px;
  }
`;

const UnlockTitle = styled.h1`
  margin: 0;
  color: var(--app-text-primary);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-xl);
  font-weight: 900;
  line-height: 1.2;
`;

const PracticeTitle = styled(UnlockTitle)`
  font-size: clamp(1.75rem, 7.5vw, 2rem);
  text-wrap: balance;
`;

const UnlockText = styled.div`
  margin: 8px auto 0;
  max-width: 310px;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-md);
  font-weight: 700;
  line-height: 1.45;
`;

const BenefitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 18px;
  text-align: left;
`;

const BenefitRow = styled.div`
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  align-items: start;
  gap: 10px;
`;

const BenefitIcon = styled(IonIcon)`
  color: var(--app-test-accent);
  font-size: var(--app-font-size-xl);
`;

const BenefitText = styled.div`
  color: var(--app-text-primary);
  font-size: var(--app-font-size-sm);
  font-weight: 800;
  line-height: 1.35;
`;

const ResetButton = styled(IonButton)`
  width: 100%;
  min-height: 42px;
  margin: 10px 0 0;
  color: var(--app-text-muted);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-md);
  font-weight: 900;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    hasFullAccess: ownedSelector(state),
    testsPassed: testsPassedSelector(state),
    testInProgress: testInProgressSelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ recieveCurrentSection, recieveQuestionAnswers }, dispatch),
  };
};

const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);

export { Header };
