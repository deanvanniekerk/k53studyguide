import { IonContent, IonPage, useIonViewWillLeave } from "@ionic/react";
import type React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { PageHeader } from "@/app/components";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import type { RootState } from "@/state";
import { questionAnswersSelector, recieveQuestionAnswers } from "@/state/quiz/session";
import { QuizQuestionCard } from "../components";
import { QuizWatermark } from "../QuizWatermark";
import { Header } from "./components";
import { Footer } from "./components/Footer";

type Props = PropsFromState & PropsFromDispatch;

const TestResultPage: React.FC<Props> = ({ questionAnswers, recieveQuestionAnswers }) => {
  const history = useHistory();

  useAnalytics("QuizPage:TestResultPage");

  useIonViewWillLeave(() => {
    recieveQuestionAnswers([]); //Clear test
  });

  const onBackClicked = () => {
    history.replace("/quiz");
  };

  return (
    <Page>
      <PageHeader title="quiz" page="quiz" onBackClick={onBackClicked} />
      <QuizWatermark />
      <Content>
        <Header />
        <ResultList>
          {questionAnswers.map((questionAnswer, index) => (
            <ResultItem key={questionAnswer.question.id}>
              <QuestionNumber>Question {index + 1}</QuestionNumber>
              <QuizQuestionCard question={questionAnswer.question} answer={questionAnswer.answer} showResult={true} />
            </ResultItem>
          ))}
        </ResultList>
        <Footer />
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
    questionAnswers: questionAnswersSelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ recieveQuestionAnswers }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestResultPage);
