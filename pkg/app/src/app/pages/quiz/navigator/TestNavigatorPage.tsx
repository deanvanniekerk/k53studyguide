import { IonContent, IonPage } from "@ionic/react";
import type React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { PageHeader } from "@/app/components";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import type { RootState } from "@/state";
import { navigateUp, recieveTargetNavigationKey, targetNavigationKeySelector } from "@/state/quiz/navigation";
import { ROOT_NAVIGATION_KEY } from "@/state/study/navigation";
import { QuizWatermark } from "../QuizWatermark";
import { Header, Navigator } from "./components";

type Props = PropsFromState & PropsFromDispatch;

const TestNavigatorPage: React.FC<Props> = (props) => {
  const history = useHistory();
  const { logEvent } = useAnalytics();

  const navigateToQuiz = () => {
    history.replace("/quiz");
  };

  const onBackClicked = () => {
    if (props.targetNavigationKey === ROOT_NAVIGATION_KEY) {
      navigateToQuiz();
      return;
    }
    props.navigateUp();
  };

  const selectTargetNavigationItem = () => {
    history.replace("/quiz");
  };

  const onNavigationItemClicked = (key: string) => {
    logEvent("NAVIGATE", { key: key, component: "QuizPage:TestNavigatorPage" });
    props.recieveTargetNavigationKey(key);
  };

  return (
    <Page>
      <PageHeader title="selectSection" page="quiz" onBackClick={onBackClicked} />
      <QuizWatermark />
      <Content>
        <Header selectTargetNavigationItem={selectTargetNavigationItem} />
        <Navigator onNavigationItemClicked={onNavigationItemClicked} />
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
    targetNavigationKey: targetNavigationKeySelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ navigateUp, recieveTargetNavigationKey }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestNavigatorPage);
