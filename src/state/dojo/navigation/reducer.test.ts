import { NavigationState, reducer } from './reducer';

describe('state > dojo > navigation > reducer', () => {
  const defaultState: NavigationState = {
    targetNavigationKey: 'nav',
  };

  it('should handle DOJO_NAV_RECIEVE_TARGET_NAVIGATION_KEY', () => {
    const state: NavigationState = {
      ...defaultState,
      targetNavigationKey: 'oldKey',
    };

    const actualState = reducer(state, {
      type: 'DOJO_NAV_RECIEVE_TARGET_NAVIGATION_KEY',
      payload: 'newKey',
    });

    const expectedState = {
      ...defaultState,
      targetNavigationKey: 'newKey',
    };

    expect(actualState).toEqual(expectedState);
  });
});
