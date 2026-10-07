import { IonContent, IonFooter, IonPage } from "@ionic/react";
import { Translate } from "@k53studyguide/shared/translation";
import { caretForward } from "ionicons/icons";
import type React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { PageHeader, PageHeaderInfoIcon } from "@/app/components";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import { usePremiumOffer } from "@/app/hooks/usePremiumOffer";
import PurchaseModal from "@/app/modals/PurchaseModal";
import type { RootState } from "@/state";
import { notificationsSelector, recieveRecieveNotificationState } from "@/state/notifications";
import { loadQuestionAnswers, testInProgressSelector } from "@/state/test/session";
import { Header } from "./components";
import { TestInfoModal } from "./TestInfoModal";
import { TestWatermark } from "./TestWatermark";

type Props = PropsFromState & PropsFromDispatch;

const TestPage: React.FC<Props> = (props) => {
  const navigate = useNavigate();

  const { analytics, logEvent } = useAnalytics("TestPage");

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const offer = usePremiumOffer("mock_test", props.infoSeen && !infoModalVisible);

  useEffect(() => {
    if (!props.infoSeen) {
      showInfoModal();
    }
  }, [props.infoSeen]);

  const showInfoModal = () => {
    analytics.trackOnboardingInfoView({ screen_name: "TestPage" });
    setInfoModalVisible(true);
    props.recieveRecieveNotificationState("testInfo", { seen: true });
  };

  const onStartTestClicked = () => {
    analytics.trackMockTestStart({
      quiz_mode: props.testInProgress ? "continue" : "new",
    });
    logEvent(props.testInProgress ? "CONTINUE_TEST" : "START_TEST");

    //If no test exists, load one, else continue with previous
    if (!props.testInProgress) props.loadQuestionAnswers();

    navigate(`/test/session`);
  };

  return (
    <Page>
      <TestInfoModal
        isOpen={infoModalVisible}
        onDidDismiss={() => {
          setInfoModalVisible(false);
        }}
      />
      <PageHeader title="test" page="test" rightSection={<PageHeaderInfoIcon onClick={() => showInfoModal()} />} />
      <TestWatermark />
      <Content>
        <Header />
      </Content>
      <Actions className="ion-no-border">
        <ActionContent ref={offer.invitationRef}>
          {!offer.purchase.owned && (
            <ActionNote>
              <Translate text="premiumOneTime" />
            </ActionNote>
          )}
          <PrimaryButton
            section="test"
            text={offer.purchase.owned ? (props.testInProgress ? "continueTest" : "enterTest") : "unlockMockTests"}
            rightIcon={caretForward}
            onClick={offer.purchase.owned ? onStartTestClicked : offer.open}
          />
        </ActionContent>
      </Actions>
      <PurchaseModal origin="mock_test" isOpen={offer.isOpen} onDidDismiss={offer.dismiss} />
    </Page>
  );
};

const Actions = styled(IonFooter)`
  flex-shrink: 0;
  background: var(--app-card-background);
  border-top: var(--app-card-border);
  /* The tab bar owns the bottom safe-area inset. This footer sits above it. */
  padding: 12px var(--app-padding) 16px;
`;
const ActionContent = styled.div`
  max-width: var(--app-readable-content-max-width);
  margin: auto;
`;
const ActionNote = styled.p`
  margin: 0 0 10px;
  text-align: center;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-sm);
`;

const Content = styled(IonContent)`
  --background: transparent;
`;

const Page = styled(IonPage)`
  background: var(--app-test-background);
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    testInProgress: testInProgressSelector(state),
    infoSeen: notificationsSelector(state).testInfo.seen,
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ loadQuestionAnswers, recieveRecieveNotificationState }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestPage);
