import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Translate } from "react-translated";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { PageHeader } from "@/app/components";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import { QuizQuestionCard } from "@/app/pages/dojo/components";
import type { QuestionOption } from "@/data";
import type { RootState } from "@/state";
import {
  currentSectionSelector,
  type QuestionAnswer,
  questionAnswersSelector,
  recieveAnswer,
  recieveCurrentSection,
  recieveQuestionAnswers,
  submitTest,
  type TestSection,
} from "@/state/arena/test";
import { ArenaWatermark } from "../ArenaWatermark";
import { Tabs } from "../components";
import { Footer, Header } from "./components";

type Props = PropsFromState & PropsFromDispatch;

const TestPage: React.FC<Props> = (props) => {
  const history = useHistory();
  const content = useRef<HTMLIonContentElement>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useAnalytics("TestPage:TestPage");

  useIonViewWillEnter(() => {
    onScrollTop(0);
  });

  useEffect(() => {
    if (currentQuestionIndex > props.questionAnswers.length - 1) {
      setCurrentQuestionIndex(Math.max(props.questionAnswers.length - 1, 0));
    }
  }, [currentQuestionIndex, props.questionAnswers.length]);

  useEffect(() => {
    const currentQuestionAnswer = props.questionAnswers[currentQuestionIndex];
    if (currentQuestionAnswer && currentQuestionAnswer.section !== props.currentSection) {
      props.recieveCurrentSection(currentQuestionAnswer.section);
    }
  }, [currentQuestionIndex, props.currentSection, props.questionAnswers, props.recieveCurrentSection]);

  const onBackClicked = () => {
    history.replace("/arena");
  };

  const onSubmitClicked = () => {
    props.submitTest();
    props.recieveCurrentSection("A");
    history.replace("/test-result-arena");
  };

  const onEndTestClicked = () => {
    props.submitTest();
    props.recieveCurrentSection("A");
    history.replace("/test-result-arena");
  };

  const onOptionClicked = (questionId: string, option: QuestionOption) => {
    props.recieveAnswer(questionId, option.id);
  };

  const onSectionClicked = (section: TestSection) => {
    props.recieveCurrentSection(section);
    setCurrentQuestionIndex(getFirstQuestionIndexForSection(section));
    onScrollTop();
  };

  const onQuestionBackClicked = () => {
    setCurrentQuestionIndex((index) => Math.max(index - 1, 0));
    onScrollTop();
  };

  const onNextClicked = () => {
    const nextUnansweredIndex = props.questionAnswers.findIndex(
      (qa, index) => index > currentQuestionIndex && !qa.answer,
    );
    const nextIndex = nextUnansweredIndex >= 0 ? nextUnansweredIndex : currentQuestionIndex + 1;
    setCurrentQuestionIndex(Math.min(nextIndex, props.questionAnswers.length - 1));
    onScrollTop();
  };

  const getFirstQuestionIndexForSection = (section: TestSection) => {
    const firstUnansweredIndex = props.questionAnswers.findIndex((qa) => qa.section === section && !qa.answer);
    if (firstUnansweredIndex >= 0) return firstUnansweredIndex;

    const firstSectionIndex = props.questionAnswers.findIndex((qa) => qa.section === section);
    return Math.max(firstSectionIndex, 0);
  };

  const getSectionQuestionNumber = (questionAnswer: QuestionAnswer) => {
    const sectionQuestions = props.questionAnswers.filter((qa) => qa.section === questionAnswer.section);
    return sectionQuestions.findIndex((qa) => qa.question.id === questionAnswer.question.id) + 1;
  };

  const onScrollTop = (duration = 500) => {
    if (content.current) {
      content.current.scrollToTop(duration);
    }
  };

  const currentQuestionAnswer = props.questionAnswers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === props.questionAnswers.length - 1;

  return (
    <Page>
      <PageHeader title="arena" page="arena" onBackClick={onBackClicked} />
      <ArenaWatermark />
      <Content ref={content}>
        <Header />
        <Tabs onSectionClicked={onSectionClicked} />
        {currentQuestionAnswer && (
          <QuestionShell>
            <QuestionMeta>
              <QuestionLabel>
                <Translate text="question" /> {getSectionQuestionNumber(currentQuestionAnswer)}
              </QuestionLabel>
              <QuestionPosition>
                {getSectionQuestionNumber(currentQuestionAnswer)} of{" "}
                {props.questionAnswers.filter((qa) => qa.section === currentQuestionAnswer.section).length}
              </QuestionPosition>
            </QuestionMeta>
            <QuizQuestionCard
              question={currentQuestionAnswer.question}
              answer={currentQuestionAnswer.answer}
              onOptionClicked={onOptionClicked}
            />
          </QuestionShell>
        )}
        <Footer
          canGoBack={currentQuestionIndex > 0}
          hasAnswer={Boolean(currentQuestionAnswer?.answer)}
          isLastQuestion={isLastQuestion}
          onBackClicked={onQuestionBackClicked}
          onEndTestClicked={onEndTestClicked}
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
  --app-question-accent: var(--app-arena-accent);
  --app-question-accent-rgb: var(--app-arena-accent-rgb);

  background: var(--app-arena-background);
`;

const QuestionShell = styled.div`
  margin-bottom: 8px;
`;

const QuestionMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 0 var(--app-padding) 12px;
`;

const QuestionLabel = styled.div`
  color: var(--app-question-accent);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
`;

const QuestionPosition = styled.div`
  color: var(--app-text-muted);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 700;
  white-space: nowrap;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    currentSection: currentSectionSelector(state),
    questionAnswers: questionAnswersSelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ recieveAnswer, recieveCurrentSection, recieveQuestionAnswers, submitTest }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestPage);
