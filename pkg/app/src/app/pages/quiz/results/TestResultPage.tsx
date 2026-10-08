import { IonPage, useIonViewWillEnter } from "@ionic/react";
import { Translate } from "@k53studyguide/shared/translation";
import type React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { PageContent, PageHeader } from "@/app/components";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import type { RootState } from "@/state";
import { questionAnswersSelector, recieveQuestionAnswers } from "@/state/quiz/session";
import { QuizQuestionCard } from "../components";
import { QuizWatermark } from "../QuizWatermark";
import { Header } from "./components";
import { Footer } from "./components/Footer";

type Props = PropsFromState & PropsFromDispatch;

const TestResultPage: React.FC<Props> = ({ questionAnswers, recieveQuestionAnswers }) => {
  const navigate = useNavigate();

  useAnalytics("QuizPage:TestResultPage");

  // Ionic restores cached result routes on tab return; leaving a tab must not clear its data.
  useIonViewWillEnter(() => {
    if (questionAnswers.length === 0) navigate("/quiz", { replace: true });
  }, [questionAnswers.length, navigate]);

  const onBackClicked = () => {
    recieveQuestionAnswers([]);
    navigate("/quiz", { replace: true });
  };

  return (
    <Page>
      <PageHeader title="quiz" page="quiz" onBackClick={onBackClicked} />
      <QuizWatermark />
      <Content scrollHint>
        <Header />
        <ResultList>
          {questionAnswers.map((questionAnswer, index) => (
            <ResultItem key={questionAnswer.question.id}>
              <QuestionNumber>
                <Translate text="questionNumber" data={{ number: index + 1 }} />
              </QuestionNumber>
              <QuizQuestionCard question={questionAnswer.question} answer={questionAnswer.answer} showResult={true} />
            </ResultItem>
          ))}
        </ResultList>
        <Footer />
      </Content>
    </Page>
  );
};

const Content = styled(PageContent)`
  --background: transparent;
  --padding-bottom: var(--app-scroll-fade-height);
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
  margin: 0 var(--app-padding) var(--app-element-gap);
  color: var(--app-text-muted);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-section-title);
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
