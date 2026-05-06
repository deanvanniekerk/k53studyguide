import { IonContent, IonPage } from "@ionic/react";
import { arrowUp } from "ionicons/icons";
import type React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { BackButton } from "@/app/components";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import type { RootState } from "@/state";
import { navigateUp, recieveTargetNavigationKey, targetNavigationKeySelector } from "@/state/dojo/navigation";
import { loadQuestionAnswers } from "@/state/dojo/test";
import { ROOT_NAVIGATION_KEY } from "@/state/study/navigation";
import { DojoWatermark } from "../DojoWatermark";
import { Header, Navigator } from "./components";
import { TestNavigatorPageHeader } from "./TestNavigatorPageHeader";

type Props = PropsFromState & PropsFromDispatch;

const TestNavigatorPage: React.FC<Props> = (props) => {
  const history = useHistory();
  const { logEvent } = useAnalytics();

  const navigateToDojo = () => {
    history.replace("/dojo");
  };

  const onBackClicked = () => {
    if (props.targetNavigationKey === ROOT_NAVIGATION_KEY) {
      navigateToDojo();
      return;
    }
    props.navigateUp();
  };

  const selectTargetNavigationItem = () => {
    props.loadQuestionAnswers();
    history.push(`/test-dojo`);
  };

  const onNavigationItemClicked = (key: string) => {
    logEvent("NAVIGATE", { key: key, component: "QuizPage:TestNavigatorPage" });
    props.recieveTargetNavigationKey(key);
  };

  return (
    <Page>
      <TestNavigatorPageHeader />
      <DojoWatermark />
      <Content>
        <BackButton onClick={onBackClicked} icon={arrowUp} />
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
  background: #FAFAF7;
  --page-header-bg: var(--dojo-header-gradient);
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
    ...bindActionCreators({ loadQuestionAnswers, navigateUp, recieveTargetNavigationKey }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestNavigatorPage);
