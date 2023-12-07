import { QuestionItem } from '@/data';

export type TestSection = 'A' | 'B' | 'C';

export type QuestionAnswer = {
  section: TestSection;
  answer: string | null;
  question: QuestionItem;
};

export type TestResults = {
  [key in TestSection]: TestResult;
};

export type TestResult = {
  correct: number;
  total: number;
  answered: number;
  minimumPass: number;
};
