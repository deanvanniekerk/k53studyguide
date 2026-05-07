import { IonContent, IonPage } from "@ionic/react";
import type React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { PageHeader, PageHeaderInfoIcon } from "@/app/components";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import type { RootState } from "@/state";
import { notificationsSelector, recieveRecieveNotificationState } from "@/state/notifications";
import { loadQuestionAnswers, testInProgressSelector } from "@/state/quiz/session";
import { Header, Settings } from "./components";
import { QuizInfoModal } from "./QuizInfoModal";
import { QuizWatermark } from "./QuizWatermark";

type Props = PropsFromState & PropsFromDispatch;

const QuizPage: React.FC<Props> = (props) => {
  const history = useHistory();

  const { logEvent } = useAnalytics("QuizPage");

  const [infoModalVisible, setInfoModalVisible] = useState(false);

  useEffect(() => {
    if (!props.infoSeen) {
      showInfoModal();
    }
  }, [props.infoSeen]);

  const showInfoModal = () => {
    setInfoModalVisible(true);
    props.recieveRecieveNotificationState("quizInfo", { seen: true });
  };

  const onStartTestClicked = () => {
    logEvent(props.testInProgress ? "CONTINUE_QUIZ" : "START_QUIZ");

    //If no test exists, load one, else continue with previous
    if (!props.testInProgress) props.loadQuestionAnswers();

    history.push(`/quiz/session`);
  };

  return (
    <Page>
      <QuizInfoModal
        isOpen={infoModalVisible}
        onDidDismiss={() => {
          setInfoModalVisible(false);
        }}
      />
      <PageHeader
        title="quiz"
        subTitle="quizIntro"
        page="quiz"
        rightSection={<PageHeaderInfoIcon onClick={() => showInfoModal()} />}
      />
      <QuizWatermark />
      <Content>
        <Header />
        <Settings onStartTestClicked={onStartTestClicked} />
      </Content>
    </Page>
  );
};

const Content = styled(IonContent)`
  --background: transparent;
`;

const Page = styled(IonPage)`
  background: var(--app-quiz-background);
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    testInProgress: testInProgressSelector(state),
    infoSeen: notificationsSelector(state).quizInfo.seen,
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ loadQuestionAnswers, recieveRecieveNotificationState }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizPage);
