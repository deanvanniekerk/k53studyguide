import { ContentData, NavigationData } from '@/data';
import { NavigationState, NavigationTreeItem } from './';
import * as selectors from './selectors';

describe('state > navigation > selectors', () => {
  //Setup Data --------------------------------------------

  const navigationData: NavigationData = {
    nav: ['nav.child1', 'nav.child2'],
    'nav.child1': ['nav.child1.child1', 'nav.child1.child2'],
  };

  const contentData: ContentData = {
    'nav.child1.child1': [
      {
        imageName: 'rules-of-the-road/vehicleControls.png',
        heading: '1',
        description: 'description 1',
      },
    ],
    'nav.child1.child2': [
      {
        imageName: '',
        heading: '1',
        description: 'description 1',
      },
      {
        imageName: '',
        heading: '2',
        description: 'description 2',
      },
      {
        imageName: '',
        heading: '3',
        description: 'description 3',
      },
    ],
    'nav.child2': [
      {
        imageName: '',
        heading: '1',
        description: 'description 1',
      },
      {
        imageName: '',
        heading: '2',
        description: 'description 2',
      },
    ],
  };

  const defaultState: NavigationState = {
    navigationData: {},
  };
  //-----------------------------------------------------------

  it('navigationDataSelector', () => {
    const actual = selectors.navigationDataSelector.resultFunc(defaultState);

    expect(actual).toEqual(defaultState.navigationData);
  });

  it('rootNavigationChildrenSelector', () => {
    const actual = selectors.rootNavigationChildrenSelector.resultFunc(navigationData);

    expect(actual).toEqual(['nav.child1', 'nav.child2']);
  });

  it('navigationTreeSelector', () => {
    const actual = selectors.navigationTreeSelector.resultFunc(navigationData, contentData);

    const expected: NavigationTreeItem = {
      key: 'nav',
      children: [
        {
          key: 'nav.child1',
          children: [
            {
              key: 'nav.child1.child1',
              children: [
                {
                  key: 'nav.child1.child1.1',
                  children: [],
                },
              ],
            },
            {
              key: 'nav.child1.child2',
              children: [
                {
                  key: 'nav.child1.child2.1',
                  children: [],
                },
                {
                  key: 'nav.child1.child2.2',
                  children: [],
                },
                {
                  key: 'nav.child1.child2.3',
                  children: [],
                },
              ],
            },
          ],
        },
        {
          key: 'nav.child2',
          children: [
            {
              key: 'nav.child2.1',
              children: [],
            },
            {
              key: 'nav.child2.2',
              children: [],
            },
          ],
        },
      ],
    };

    expect(actual).toEqual(expected);
  });
});
