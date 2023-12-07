import { NotificationsState, reducer } from './reducer';

describe('state > notifications > reducer', () => {
  const defaultState: NotificationsState = {
    notifications: {
      studyInfo: {
        seen: false,
      },
      dojoInfo: {
        seen: false,
      },
      arenaInfo: {
        seen: false,
      },
    },
  };

  it('should handle NOTIFICATION_RECIEVE_NOTIFICATION_STATE', () => {
    const actualState = reducer(defaultState, {
      type: 'NOTIFICATION_RECIEVE_NOTIFICATION_STATE',
      payload: {
        name: 'studyInfo',
        state: {
          seen: true,
        },
      },
    });

    const expectedState = {
      ...defaultState,
      notifications: {
        ...defaultState.notifications,
        studyInfo: {
          seen: true,
        },
      },
    };

    expect(actualState).toEqual(expectedState);
  });
});
