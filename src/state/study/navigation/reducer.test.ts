import { NavigationState, reducer } from './reducer';

describe('state > study > navigation > reducer', () => {
  const defaultState: NavigationState = {
    currentNavigationKey: 'nav',
  };

  it('should handle STUDY_NAV_RECIEVE_CURRENT_NAVIGATION_KEY', () => {
    const state: NavigationState = {
      ...defaultState,
      currentNavigationKey: 'oldKey',
    };

    const actualState = reducer(state, {
      type: 'STUDY_NAV_RECIEVE_CURRENT_NAVIGATION_KEY',
      payload: 'newKey',
    });

    const expectedState = {
      ...defaultState,
      currentNavigationKey: 'newKey',
    };

    expect(actualState).toEqual(expectedState);
  });
});
