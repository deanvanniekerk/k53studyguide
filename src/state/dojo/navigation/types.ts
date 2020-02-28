export type CorrectlyAnsweredQuestionsTotals = {
    [key: string]: CorrectlyAnsweredQuestionsTotal;
};

export type CorrectlyAnsweredQuestionsTotal = {
    correctlyAnswered: number;
    total: number;
};
