import { IonPage, useIonViewWillEnter } from "@ionic/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { PageContent, PageHeader } from "@/app/components";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import type { QuestionOption } from "@/data";
import type { RootState } from "@/state";
import { questionAnswersSelector, recieveAnswer, submitTest } from "@/state/quiz/session";
import { QuizQuestionCard } from "../components";
import { QuizWatermark } from "../QuizWatermark";
import { Footer, Header } from "./components";

type Props = PropsFromState & PropsFromDispatch;

const TestPage: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const content = useRef<HTMLIonContentElement>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { analytics } = useAnalytics("QuizPage:TestPage");

  useIonViewWillEnter(() => {
    scrollTop();
  });

  useEffect(() => {
    if (currentQuestionIndex > props.questionAnswers.length - 1) {
      setCurrentQuestionIndex(Math.max(props.questionAnswers.length - 1, 0));
    }
  }, [currentQuestionIndex, props.questionAnswers.length]);

  const onBackClicked = () => {
    navigate("/quiz", { replace: true });
  };

  const onSubmitClicked = () => {
    props.submitTest();
    navigate("/quiz/results", { replace: true });
  };

  const onOptionClicked = (questionId: string, option: QuestionOption) => {
    analytics.trackQuizAnswer({
      question_id: questionId,
      answer_id: option.id,
      question_index: currentQuestionIndex + 1,
    });
    props.recieveAnswer(questionId, option.id);
  };

  const onNextClicked = () => {
    const nextUnansweredIndex = props.questionAnswers.findIndex(
      (qa, index) => index > currentQuestionIndex && !qa.answer,
    );
    const nextIndex = nextUnansweredIndex >= 0 ? nextUnansweredIndex : currentQuestionIndex + 1;
    setCurrentQuestionIndex(Math.min(nextIndex, props.questionAnswers.length - 1));
    scrollTop();
  };

  const scrollTop = () => {
    if (content.current) {
      content.current.scrollToTop(0);
    }
  };

  const currentQuestionAnswer = props.questionAnswers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === props.questionAnswers.length - 1;

  return (
    <Page>
      <PageHeader title="quiz" page="quiz" onBackClick={onBackClicked} />
      <QuizWatermark />
      <Content ref={content} scrollHint>
        <Header currentQuestionIndex={currentQuestionIndex} />
        {currentQuestionAnswer && (
          <QuizQuestionCard
            question={currentQuestionAnswer.question}
            answer={currentQuestionAnswer.answer}
            onOptionClicked={onOptionClicked}
          />
        )}
        <Footer
          hasAnswer={Boolean(currentQuestionAnswer?.answer)}
          isLastQuestion={isLastQuestion}
          onNextClicked={onNextClicked}
          onSubmitClicked={onSubmitClicked}
        />
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

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    questionAnswers: questionAnswersSelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ submitTest, recieveAnswer }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestPage);
