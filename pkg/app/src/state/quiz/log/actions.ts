export const QUIZ_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE =
  "QUIZ_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE";
export const QUIZ_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES =
  "QUIZ_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES";

export interface RecieveQuesionSuccesfullyAnsweredDateAction {
  type: typeof QUIZ_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE;
  payload: {
    questionId: string;
    date: string;
  };
}

export interface ClearQuesionSuccesfullyAnsweredDatesAction {
  type: typeof QUIZ_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES;
}

export type LogActions = RecieveQuesionSuccesfullyAnsweredDateAction | ClearQuesionSuccesfullyAnsweredDatesAction;

export const recieveQuesionSuccesfullyAnsweredDate = (
  questionId: string,
  date: string,
): RecieveQuesionSuccesfullyAnsweredDateAction => ({
  type: QUIZ_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE,
  payload: {
    questionId,
    date,
  },
});

export const clearQuesionSuccesfullyAnsweredDates = (): ClearQuesionSuccesfullyAnsweredDatesAction => ({
  type: QUIZ_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES,
});
