export const DOJO_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE =
    "DOJO_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE";

export interface RecieveQuesionSuccesfullyAnsweredDateAction {
    type: typeof DOJO_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE;
    payload: {
        questionId: string;
        date: Date;
    };
}

export type LogActions = RecieveQuesionSuccesfullyAnsweredDateAction;

export const recieveQuesionSuccesfullyAnsweredDate = (
    questionId: string,
    date: Date
): RecieveQuesionSuccesfullyAnsweredDateAction => ({
    type: DOJO_LOG_RECIEVE_QUESTION_SUCCESSFULLY_ANSWERED_DATE,
    payload: {
        questionId,
        date,
    },
});
