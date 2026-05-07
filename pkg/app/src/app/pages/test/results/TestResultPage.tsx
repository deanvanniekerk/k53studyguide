import { IonContent, IonPage, useIonViewWillLeave } from "@ionic/react";
import type React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { PageHeader } from "@/app/components";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import { QuizQuestionCard } from "@/app/pages/quiz/components";
import type { RootState } from "@/state";
import { currentSectionQuestionsSelector, recieveCurrentSection, recieveQuestionAnswers } from "@/state/test/session";
import { Tabs } from "../components";
import { TestWatermark } from "../TestWatermark";
import { Header } from "./components";

type Props = PropsFromState & PropsFromDispatch;

const TestResultPage: React.FC<Props> = ({ questionAnswers, recieveCurrentSection, recieveQuestionAnswers }) => {
  const history = useHistory();

  useAnalytics("TestPage:TestResultPage");

  useEffect(() => {
    recieveCurrentSection("A");
  }, [recieveCurrentSection]);

  useIonViewWillLeave(() => {
    recieveQuestionAnswers([]); //Clear test
  });

  const onBackClicked = () => {
    history.replace("/test");
  };

  return (
    <Page>
      <PageHeader title="results" page="test" onBackClick={onBackClicked} />
      <TestWatermark />
      <Content>
        <Header />
        <Tabs hideInfo={true} />
        <ResultList>
          {questionAnswers.map((questionAnswer, index) => (
            <ResultItem key={questionAnswer.question.id}>
              <QuestionNumber>Question {index + 1}</QuestionNumber>
              <QuizQuestionCard question={questionAnswer.question} answer={questionAnswer.answer} showResult={true} />
            </ResultItem>
          ))}
        </ResultList>
      </Content>
    </Page>
  );
};

const Content = styled(IonContent)`
  --background: transparent;
`;

const Page = styled(IonPage)`
  --app-question-accent: var(--app-test-accent);
  --app-question-accent-rgb: var(--app-test-accent-rgb);
  --app-question-image-background: var(--app-test-background);

  background: var(--app-test-background);
`;

const ResultList = styled.div`
  padding-top: 0;
`;

const ResultItem = styled.div`
  overflow: hidden;
`;

const QuestionNumber = styled.div`
  margin: 0 var(--app-padding) 12px;
  color: var(--app-text-muted);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 900;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    questionAnswers: currentSectionQuestionsSelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ recieveCurrentSection, recieveQuestionAnswers }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestResultPage);
