import { deepClone } from '@/utils';
import { QuestionAnswer } from './';
import { reducer, TestState } from './reducer';

describe('state > arena > test > reducer', () => {
  const defaultState: TestState = {
    questionAnswers: [],
    currentSection: 'A',
  };

  it('should handle ARENA_TEST_RECIEVE_QUESTION_ANSWERS', () => {
    const questionAnswers: QuestionAnswer[] = [
      {
        section: 'A',
        answer: null,
        question: {
          id: '1',
          answer: 'B',
          text: 'Question 1:',
          option: [
            {
              id: 'A',
              value: 'Option 1.',
            },
            {
              id: 'B',
              value: 'Option 2.',
            },
          ],
        },
      },
    ];

    const actualState = reducer(defaultState, {
      type: 'ARENA_TEST_RECIEVE_QUESTION_ANSWERS',
      payload: questionAnswers,
    });

    const expectedState = {
      ...defaultState,
      questionAnswers: questionAnswers,
    };

    expect(actualState).toEqual(expectedState);
  });

  it('should handle ARENA_TEST_RECIEVE_CURRENT_SECTION', () => {
    const actualState = reducer(defaultState, {
      type: 'ARENA_TEST_RECIEVE_CURRENT_SECTION',
      payload: 'C',
    });

    const expectedState = {
      ...defaultState,
      currentSection: 'C',
    };

    expect(actualState).toEqual(expectedState);
  });

  it('should handle ARENA_TEST_RECIEVE_QUESTION_ANSWERS', () => {
    const questionAnswers: QuestionAnswer[] = [
      {
        section: 'A',
        answer: 'A',
        question: {
          id: '4',
          answer: 'B',
          text: 'Question 1:',
          option: [
            {
              id: 'A',
              value: 'Option 1.',
            },
            {
              id: 'B',
              value: 'Option 2.',
            },
            {
              id: 'C',
              value: 'Option 3.',
            },
          ],
        },
      },
      {
        section: 'B',
        answer: null,
        question: {
          id: '3',
          answer: 'B',
          text: 'Question 1:',
          option: [
            {
              id: 'A',
              value: 'Option 1.',
            },
            {
              id: 'B',
              value: 'Option 2.',
            },
            {
              id: 'C',
              value: 'Option 3.',
            },
          ],
        },
      },
      {
        section: 'C',
        answer: null,
        question: {
          id: '2',
          answer: 'B',
          text: 'Question 1:',
          option: [
            {
              id: 'A',
              value: 'Option 1.',
            },
            {
              id: 'B',
              value: 'Option 2.',
            },
            {
              id: 'C',
              value: 'Option 3.',
            },
          ],
        },
      },
      {
        section: 'C',
        answer: 'C',
        question: {
          id: '1',
          answer: 'B',
          text: 'Question 1:',
          option: [
            {
              id: 'A',
              value: 'Option 1.',
            },
            {
              id: 'B',
              value: 'Option 2.',
            },
            {
              id: 'C',
              value: 'Option 3.',
            },
          ],
        },
      },
    ];

    const initalState = { ...defaultState, questionAnswers };

    const actualState = reducer(initalState, {
      type: 'ARENA_TEST_RECIEVE_ANSWER',
      payload: {
        questionId: '2',
        answer: 'B',
      },
    });

    //Deep clone
    const expectedState = deepClone(initalState);

    expectedState.questionAnswers[2].answer = 'B';

    expect(actualState).toEqual(expectedState);
  });
});
