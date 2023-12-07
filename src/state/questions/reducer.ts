import { QuestionData, questionData } from '@/data';

export type QuestionState = {
  readonly questionData: QuestionData;
};

export const defaultState: QuestionState = {
  questionData: questionData,
};

export const reducer = (state: QuestionState = defaultState): QuestionState => {
  return state;
};
