import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { PageHeader } from "@/app/components";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import type { QuestionOption } from "@/data";
import type { RootState } from "@/state";
import { questionAnswersSelector, recieveAnswer, submitTest } from "@/state/dojo/test";
import { QuizQuestionCard } from "../components";
import { DojoWatermark } from "../DojoWatermark";
import { Footer, Header } from "./components";

type Props = PropsFromState & PropsFromDispatch;

const TestPage: React.FC<Props> = (props) => {
  const history = useHistory();
  const content = useRef<HTMLIonContentElement>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useAnalytics("QuizPage:TestPage");

  useIonViewWillEnter(() => {
    scrollTop();
  });

  useEffect(() => {
    if (currentQuestionIndex > props.questionAnswers.length - 1) {
      setCurrentQuestionIndex(Math.max(props.questionAnswers.length - 1, 0));
    }
  }, [currentQuestionIndex, props.questionAnswers.length]);

  const onBackClicked = () => {
    history.replace("/dojo");
  };

  const onSubmitClicked = () => {
    props.submitTest();
    history.replace("/test-result-dojo");
  };

  const onOptionClicked = (questionId: string, option: QuestionOption) => {
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
      <PageHeader title="dojo" page="dojo" onBackClick={onBackClicked} />
      <DojoWatermark />
      <Content ref={content}>
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

const Content = styled(IonContent)`
  --background: transparent;
`;

const Page = styled(IonPage)`
  background: var(--app-dojo-background);
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
