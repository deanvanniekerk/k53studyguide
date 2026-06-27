import type { QuestionData, QuestionItem } from "../data";

export type QuestionAnswer = {
  question: QuestionItem;
  answer: string | null;
};

export type SuccessfullyAnsweredDates = Record<string, string>;

export type BuildQuizQuestionAnswersInput = {
  questionData: QuestionData;
  targetNavigationKey: string;
  maxQuestions: number;
  successfullyAnsweredDates: SuccessfullyAnsweredDates;
  shuffle?: <T>(items: T[]) => T[];
};

export type CompleteQuizSessionInput = {
  questionAnswers: QuestionAnswer[];
  successfullyAnsweredDates: SuccessfullyAnsweredDates;
  completedAt?: Date;
};

export type QuizCompletion = {
  completedAt: string;
  experienceGained: number;
  successfullyAnsweredDates: SuccessfullyAnsweredDates;
};

const defaultShuffle = <T>(array: T[]): T[] => {
  const clone = [...array];

  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = clone[i];
    clone[i] = clone[j];
    clone[j] = temp;
  }

  return clone;
};

export const buildQuizQuestionAnswers = ({
  questionData,
  targetNavigationKey,
  maxQuestions,
  successfullyAnsweredDates,
  shuffle = defaultShuffle,
}: BuildQuizQuestionAnswersInput): QuestionAnswer[] => {
  let bank: QuestionItem[] = [];
  const keys = Object.keys(questionData);

  keys.forEach((key) => {
    if (key.startsWith(targetNavigationKey)) bank.push(...questionData[key]);
  });

  bank = shuffle<QuestionItem>(bank);

  bank.sort((itemA: QuestionItem, itemB: QuestionItem) => {
    const minDate = new Date(0);

    const dateA = successfullyAnsweredDates[itemA.id] ? new Date(successfullyAnsweredDates[itemA.id]) : minDate;
    const dateB = successfullyAnsweredDates[itemB.id] ? new Date(successfullyAnsweredDates[itemB.id]) : minDate;

    if (dateA < dateB) return -1;

    if (dateA > dateB) return 1;

    return 0;
  });

  if (bank.length > maxQuestions) {
    bank = bank.slice(0, maxQuestions);
  }

  return bank.map((question) => ({
    answer: null,
    question,
  }));
};

export const completeQuizSession = ({
  questionAnswers,
  successfullyAnsweredDates,
  completedAt = new Date(),
}: CompleteQuizSessionInput): QuizCompletion => {
  const completedAtIso = completedAt.toISOString();
  let experienceGained = 0;
  const nextSuccessfullyAnsweredDates = { ...successfullyAnsweredDates };

  questionAnswers.forEach((questionAnswer) => {
    if (questionAnswer.answer !== questionAnswer.question.answer) return;

    if (!successfullyAnsweredDates[questionAnswer.question.id]) experienceGained++;
    nextSuccessfullyAnsweredDates[questionAnswer.question.id] = completedAtIso;
  });

  return {
    completedAt: completedAtIso,
    experienceGained,
    successfullyAnsweredDates: nextSuccessfullyAnsweredDates,
  };
};
