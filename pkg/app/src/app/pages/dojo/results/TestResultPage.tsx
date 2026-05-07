import { IonContent, IonPage, useIonViewWillLeave } from "@ionic/react";
import type React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { PageHeader } from "@/app/components";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import type { RootState } from "@/state";
import { questionAnswersSelector, recieveQuestionAnswers } from "@/state/dojo/test";
import { QuizQuestionCard } from "../components";
import { DojoWatermark } from "../DojoWatermark";
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
    history.replace("/dojo");
  };

  return (
    <Page>
      <PageHeader title="dojo" page="dojo" onBackClick={onBackClicked} />
      <DojoWatermark />
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
  background: var(--app-dojo-background);
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
