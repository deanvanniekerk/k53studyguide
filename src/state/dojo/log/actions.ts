export const DOJO_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE =
  'DOJO_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE';
export const DOJO_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES =
  'DOJO_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES';

export interface RecieveQuesionSuccesfullyAnsweredDateAction {
  type: typeof DOJO_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE;
  payload: {
    questionId: string;
    date: string;
  };
}

export interface ClearQuesionSuccesfullyAnsweredDatesAction {
  type: typeof DOJO_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES;
}

export type LogActions = RecieveQuesionSuccesfullyAnsweredDateAction | ClearQuesionSuccesfullyAnsweredDatesAction;

export const recieveQuesionSuccesfullyAnsweredDate = (
  questionId: string,
  date: string,
): RecieveQuesionSuccesfullyAnsweredDateAction => ({
  type: DOJO_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE,
  payload: {
    questionId,
    date,
  },
});

export const clearQuesionSuccesfullyAnsweredDates = (): ClearQuesionSuccesfullyAnsweredDatesAction => ({
  type: DOJO_LOG_CLEAR_QUESTION_SUCCESSFULLY_ANSWERED_DATES,
});
