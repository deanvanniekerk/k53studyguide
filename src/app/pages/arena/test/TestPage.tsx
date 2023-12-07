import { BackButton, QuestionInfo, QuestionList } from '@/app/components';
import { useAnalytics } from '@/app/hooks/useAnalytics';
import { QuestionOption } from '@/data';
import { RootState } from '@/state';
import {
  currentSectionQuestionsSelector,
  QuestionAnswer,
  recieveAnswer,
  recieveCurrentSection,
  submitTest,
} from '@/state/arena/test';
import { IonContent, IonPage, useIonViewWillEnter } from '@ionic/react';
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import { ArenaWatermark } from '../ArenaWatermark';
import { Tabs } from '../components';
import { Footer, Header } from './components';
import { TestPageHeader } from './TestPageHeader';

type Props = PropsFromState & PropsFromDispatch;

const TestPage: React.FC<Props> = (props) => {
  const history = useHistory();
  const content = useRef<HTMLIonContentElement>(null);

  useAnalytics('TestPage:TestPage');

  useIonViewWillEnter(() => {
    onScrollTop(0);
  });

  const onBackClicked = () => {
    history.replace('/arena');
  };

  const onSubmitClicked = () => {
    props.submitTest();
    props.recieveCurrentSection('A');
    history.replace('/test-result-arena');
  };

  const onOptionClicked = (questionId: string, option: QuestionOption) => {
    props.recieveAnswer(questionId, option.id);
  };

  const mapToQuestionInfo = (questionAnswer: QuestionAnswer): QuestionInfo => {
    return {
      question: questionAnswer.question,
      answer: questionAnswer.answer,
    };
  };

  const onScrollTop = (duration = 500) => {
    if (content.current) {
      content.current.scrollToTop(duration);
    }
  };

  const questions = props.questionAnswers.map<QuestionInfo>(mapToQuestionInfo);

  return (
    <Page>
      <TestPageHeader />
      <ArenaWatermark />
      <Content ref={content}>
        <BackButton onClick={onBackClicked} />
        <Header />
        <Tabs />
        <QuestionList questions={questions} onOptionClicked={onOptionClicked} />
        <Footer onSubmitClicked={onSubmitClicked} onScrollTop={onScrollTop} />
      </Content>
    </Page>
  );
};

const Content = styled(IonContent)`
  --background: transparent;
`;

const Page = styled(IonPage)`
  background: var(--arena-background);
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
    ...bindActionCreators({ recieveAnswer, recieveCurrentSection, submitTest }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestPage);
