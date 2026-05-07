import { CreateAnimation, IonAlert, IonButton, IonIcon, useIonViewWillEnter } from "@ionic/react";
import { caretForward, checkmarkCircle, lockClosedOutline } from "ionicons/icons";
import type React from "react";
import { useRef, useState } from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { PrimaryButton } from "@/app/components";
import { TestPenIcon } from "@/app/components/icons";
import PurchaseModal from "@/app/modals/PurchaseModal";
import type { RootState } from "@/state";
import { testsPassedSelector } from "@/state/arena/log";
import { recieveCurrentSection, recieveQuestionAnswers, testInProgressSelector } from "@/state/arena/test";
import { canPurchaseSelector, ownedSelector } from "@/state/purchase";

type Props = {
  onStartTestClicked: () => void;
} & PropsFromState &
  PropsFromDispatch;

const HeaderComponent: React.FC<Props> = (props) => {
  const animationIcon = useRef<CreateAnimation>(null);
  const animationCounter = useRef<CreateAnimation>(null);

  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [showResetTestAlert, setShowResetTestAlert] = useState(false);

  useIonViewWillEnter(() => {
    if (animationIcon.current) animationIcon.current.animation.play();
    if (animationCounter.current) animationCounter.current.animation.play();
  });

  return (
    <Wrapper className="app-page-content-offset">
      <IntroText>
        <Translate text="arenaIntro" />
      </IntroText>
      <CreateAnimation
        play={false}
        ref={animationIcon}
        duration={600}
        delay={100}
        easing="ease"
        keyframes={[
          { offset: 0, transform: "scale(0)" },
          { offset: 0.8, transform: "scale(1.08)" },
          { offset: 1, transform: "scale(1)" },
        ]}
      >
        <IllustrationPanel>
          <TestPenIcon />
        </IllustrationPanel>
      </CreateAnimation>

      <PrimaryText>{props.hasFullAccess ? "Tests Passed" : "Test Locked"}</PrimaryText>
      {props.hasFullAccess && (
        <MetricArea>
          <CreateAnimation
            play={false}
            ref={animationCounter}
            delay={100}
            duration={500}
            easing="ease"
            fromTo={{
              property: "transform",
              fromValue: "translateY(85px)",
              toValue: "translateY(0px)",
            }}
          >
            <Counter>{props.testsPassed}</Counter>
          </CreateAnimation>
        </MetricArea>
      )}

      {props.hasFullAccess && (
        <>
          <MasteryText>
            Pass 3 in a row to <strong>master the test</strong>
          </MasteryText>
          <ActionButtonWrap>
            <PrimaryButton
              section="arena"
              text={props.testInProgress ? "continueTest" : "enterArena"}
              rightIcon={caretForward}
              onClick={() => props.onStartTestClicked()}
            />
          </ActionButtonWrap>
          {props.testInProgress && (
            <ResetButton fill="clear" onClick={() => setShowResetTestAlert(true)}>
              <Translate text="resetCurrentTest" />
            </ResetButton>
          )}
        </>
      )}
      {!props.hasFullAccess && (
        <>
          <UnlockCard>
            <UnlockIcon>
              <IonIcon icon={lockClosedOutline} />
            </UnlockIcon>
            <UnlockTitle>
              <Translate text="arenaLockedTitle" />
            </UnlockTitle>
            <UnlockText>
              <Translate text="arenaLockedInfo" />
            </UnlockText>
            <BenefitList>
              <BenefitRow>
                <BenefitIcon icon={checkmarkCircle} />
                <BenefitText>
                  <Translate text="arenaLockedBenefitStructure" />
                </BenefitText>
              </BenefitRow>
              <BenefitRow>
                <BenefitIcon icon={checkmarkCircle} />
                <BenefitText>
                  <Translate text="arenaLockedBenefitScoring" />
                </BenefitText>
              </BenefitRow>
              <BenefitRow>
                <BenefitIcon icon={checkmarkCircle} />
                <BenefitText>
                  <Translate text="arenaLockedBenefitMastery" />
                </BenefitText>
              </BenefitRow>
            </BenefitList>
          </UnlockCard>
          <ActionButtonWrap $locked>
            <PrimaryButton
              section="arena"
              text="goPremium"
              disabled={!props.canPurchase}
              onClick={() => setPurchaseModalVisible(true)}
            />
          </ActionButtonWrap>
        </>
      )}
      <PurchaseModal
        isOpen={purchaseModalVisible}
        onDidDismiss={() => {
          setPurchaseModalVisible(false);
        }}
      />
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
  min-height: calc(100vh - var(--app-page-content-top) - 120px);
  flex-direction: column;
  align-items: center;
  padding: 10px var(--app-padding) 36px;
  text-align: center;
`;

const IntroText = styled.div`
  max-width: 320px;
  color: var(--app-text-primary);
  font-size: var(--app-font-size-xl);
  font-weight: 700;
  line-height: 1.35;
`;

const IllustrationPanel = styled.div`
  display: grid;
  place-items: center;
  width: min(42vw, 172px);
  aspect-ratio: 1;
  margin-top: 44px;
  border: 2px solid var(--app-arena-illustration-border);
  border-radius: 28px;
  background: var(--app-arena-illustration-background);

  svg {
    width: 54%;
    height: 54%;
  }
`;

const PrimaryText = styled.div`
  margin-top: 34px;
  color: var(--app-question-accent);
  font-size: var(--app-font-size-xxl);
  font-family: var(--ion-font-family-bold);
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const MetricArea = styled.div`
  display: grid;
  min-height: 94px;
  place-items: center;
  overflow: hidden;
`;

const Counter = styled.div`
  color: var(--app-arena-accent);
  font-size: 4.8rem;
  font-family: var(--ion-font-family-bold);
  font-weight: 900;
  line-height: 1;
`;

const MasteryText = styled.div`
  color: var(--app-text-muted);
  font-size: var(--app-font-size-xl);
  font-weight: 700;
  line-height: 1.35;

  strong {
    color: var(--app-text-primary);
    font-family: var(--ion-font-family-bold);
    font-weight: 900;
  }
`;

const UnlockCard = styled.div`
  width: 100%;
  max-width: 380px;
  margin-top: 22px;
  padding: 22px 20px;
  border: var(--app-card-border);
  border-radius: 24px;
  background: var(--app-card-background);
  box-shadow: var(--app-card-shadow);
`;

const UnlockIcon = styled.div`
  display: grid;
  width: 56px;
  height: 56px;
  margin: 0 auto 14px;
  place-items: center;
  border-radius: 18px;
  background: var(--app-premium-benefit-background);
  color: var(--app-arena-accent);

  ion-icon {
    font-size: var(--app-font-size-xxl);
  }
`;

const UnlockTitle = styled.div`
  color: var(--app-text-primary);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-xl);
  font-weight: 900;
  line-height: 1.2;
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
  color: var(--app-arena-accent);
  font-size: var(--app-font-size-xl);
`;

const BenefitText = styled.div`
  color: var(--app-text-primary);
  font-size: var(--app-font-size-sm);
  font-weight: 800;
  line-height: 1.35;
`;

const ActionButtonWrap = styled.div<{ $locked?: boolean }>`
  width: 100%;
  margin: ${(props) => (props.$locked ? "18px" : "44px")} 0 0;
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
    canPurchase: canPurchaseSelector(state),
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
