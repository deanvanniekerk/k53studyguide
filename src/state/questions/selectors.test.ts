import { QuestionData } from '@/data';
import { QuestionState } from './';
import * as selectors from './selectors';

describe('state > questions > selectors', () => {
  //Setup Data --------------------------------------------
  const questionData: QuestionData = {
    'nav.rulesOfTheRoad.theDriver.learnerDrivers': [
      {
        id: '1',
        answer: 'C',
        text: "When you only have a learner's licence you are not allowed to:",
        option: [
          {
            id: 'A',
            value: 'Carry passengers in your car.',
          },
          {
            id: 'B',
            value: 'Drive faster than 100km/h.',
          },
          {
            id: 'C',
            value: 'Drive without having your licence with you.',
          },
        ],
      },
      {
        id: '2',
        answer: 'A',
        text: "Once you have your learner's licence you must:",
        option: [
          {
            id: 'A',
            value: 'Only drive when you have a supervisor with a licence for the class of vehicle you are driving.',
          },
          {
            id: 'B',
            value: 'Stay off freeways.',
          },
          {
            id: 'C',
            value: "Apply for your driver's licence within 12 months.",
          },
        ],
      },
    ],
  };

  const defaultState: QuestionState = {
    questionData: questionData,
  };
  //-----------------------------------------------------------

  it('questionDataSelector', () => {
    const actual = selectors.questionDataSelector.resultFunc(defaultState);

    expect(actual).toEqual(defaultState.questionData);
  });
});
