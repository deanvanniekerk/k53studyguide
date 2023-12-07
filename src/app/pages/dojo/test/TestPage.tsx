import { BackButton, QuestionInfo, QuestionList } from '@/app/components';
import { useAnalytics } from '@/app/hooks/useAnalytics';
import { QuestionOption } from '@/data';
import { RootState } from '@/state';
import { questionAnswersSelector, recieveAnswer, submitTest } from '@/state/dojo/test';
import { IonContent, IonPage, useIonViewWillEnter } from '@ionic/react';
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import { DojoWatermark } from '../DojoWatermark';
import { Footer, Header } from './components';
import { TestPageHeader } from './TestPageHeader';

type Props = PropsFromState & PropsFromDispatch;

const TestPage: React.FC<Props> = (props) => {
  const history = useHistory();
  const content = useRef<HTMLIonContentElement>(null);

  useAnalytics('QuizPage:TestPage');

  useIonViewWillEnter(() => {
    scrollTop();
  });

  const onBackClicked = () => {
    history.replace('/dojo');
  };

  const onSubmitClicked = () => {
    props.submitTest();
    history.replace('/test-result-dojo');
  };

  const onOptionClicked = (questionId: string, option: QuestionOption) => {
    props.recieveAnswer(questionId, option.id);
  };

  const scrollTop = () => {
    if (content.current) {
      content.current.scrollToTop(0);
    }
  };

  const questions = props.questionAnswers.map<QuestionInfo>((q) => ({
    question: q.question,
    answer: q.answer,
  }));

  return (
    <Page>
      <TestPageHeader />
      <DojoWatermark />
      <Content ref={content}>
        <BackButton onClick={onBackClicked} />
        <Header />
        <QuestionList questions={questions} onOptionClicked={onOptionClicked} />
        <Footer onSubmitClicked={onSubmitClicked} />
      </Content>
    </Page>
  );
};

const Content = styled(IonContent)`
  --background: transparent;
`;

const Page = styled(IonPage)`
  background: var(--dojo-background);
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
