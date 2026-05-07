import { IonContent, IonPage } from "@ionic/react";
import type React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { PageHeader, PageHeaderInfoIcon } from "@/app/components";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import type { RootState } from "@/state";
import { notificationsSelector, recieveRecieveNotificationState } from "@/state/notifications";
import { loadQuestionAnswers, testInProgressSelector } from "@/state/test/session";
import { Header } from "./components";
import { TestInfoModal } from "./TestInfoModal";
import { TestWatermark } from "./TestWatermark";

type Props = PropsFromState & PropsFromDispatch;

const TestPage: React.FC<Props> = (props) => {
  const history = useHistory();

  const { logEvent } = useAnalytics("TestPage");

  const [infoModalVisible, setInfoModalVisible] = useState(false);

  useEffect(() => {
    if (!props.infoSeen) {
      showInfoModal();
    }
  }, [props.infoSeen]);

  const showInfoModal = () => {
    setInfoModalVisible(true);
    props.recieveRecieveNotificationState("testInfo", { seen: true });
  };

  const onStartTestClicked = () => {
    logEvent(props.testInProgress ? "CONTINUE_TEST" : "START_TEST");

    //If no test exists, load one, else continue with previous
    if (!props.testInProgress) props.loadQuestionAnswers();

    history.push(`/test/session`);
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
        <Header onStartTestClicked={onStartTestClicked} />
      </Content>
    </Page>
  );
};

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
