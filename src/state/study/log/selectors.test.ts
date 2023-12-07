import { NavigationTreeItem } from '@/state/navigation';
import { LogState, SeenContentKeys } from './';
import * as selectors from './selectors';

describe('state > study > log > selectors', () => {
  //Setup Data --------------------------------------------

  const defaultState: LogState = {
    seenContentKeys: {},
    lastSeenParentContentKey: 'key1',
  };
  //-----------------------------------------------------------

  it('seenContentKeysSelector', () => {
    const actual = selectors.seenContentKeysSelector.resultFunc(defaultState);

    expect(actual).toEqual(defaultState.seenContentKeys);
  });

  it('seenContentKeysSelector', () => {
    const actual = selectors.lastSeenParentContentKeySelector.resultFunc(defaultState);

    expect(actual).toEqual(defaultState.lastSeenParentContentKey);
  });

  it('seenTotalsSelector', () => {
    const seenContentKeys: SeenContentKeys = {
      'nav.child1.child1.1': true,
      'nav.child1.child2.1': true,
      'nav.child1.child2.2': true,
      'nav.child2.1': true,
    };

    const navigationTreeItem: NavigationTreeItem = {
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

    const actual = selectors.seenTotalsSelector.resultFunc(seenContentKeys, navigationTreeItem);

    expect(actual).toEqual({
      'nav.child1.child1.1': { seen: 1, total: 1 },
      'nav.child1.child1': { seen: 1, total: 1 },
      'nav.child1.child2.1': { seen: 1, total: 1 },
      'nav.child1.child2.2': { seen: 1, total: 1 },
      'nav.child1.child2.3': { seen: 0, total: 1 },
      'nav.child1.child2': { seen: 2, total: 3 },
      'nav.child1': { seen: 3, total: 4 },
      'nav.child2.1': { seen: 1, total: 1 },
      'nav.child2.2': { seen: 0, total: 1 },
      'nav.child2': { seen: 1, total: 2 },
      nav: { seen: 4, total: 6 },
    });
  });
});
