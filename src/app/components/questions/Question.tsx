import { HorizontalRule } from '@/app/components';
import { QuestionItem, QuestionOption } from '@/data';
import React from 'react';
import { Translate } from 'react-translated';
import styled from 'styled-components';
import { ImageList, OptionList, QuestionText } from './';

type Props = {
  question: QuestionItem;
  answer: string | null;
  questionNumber: number;
  showResult?: boolean;
  onOptionClicked?: (questionId: string, option: QuestionOption) => void;
};

const Question: React.FC<Props> = ({ question, answer, questionNumber, showResult, onOptionClicked }) => {
  return (
    <Container>
      <Header>
        <Translate text="question" />: {questionNumber}
      </Header>
      <QuestionText question={question} />
      <ImageList question={question} />
      <HorizontalRule leftMargin={20} rightMargin={36} paddingBottom={0} paddingTop={20} />
      <OptionList question={question} answer={answer} showResult={showResult} onOptionClicked={onOptionClicked} />
    </Container>
  );
};

const Container = styled.div`
  border-radius: var(--ic-corner-radius);
  border: var(--ic-border);
  padding: var(--ic-padding);
  width: 100%;
  height: 100%;
  line-height: var(--line-height);
  font-size: var(--ion-font-size-md);
`;

const Header = styled.div`
  font-weight: bold;
  padding-top: 8px;
  padding-bottom: 10px;
`;

export { Question };
