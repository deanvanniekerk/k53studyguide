import { NotificationName, NotificationState } from './';

export const NOTIFICATION_RECIEVE_NOTIFICATION_STATE = 'NOTIFICATION_RECIEVE_NOTIFICATION_STATE';

export interface RecieveNotificationStateAction {
  type: typeof NOTIFICATION_RECIEVE_NOTIFICATION_STATE;
  payload: {
    name: NotificationName;
    state: NotificationState;
  };
}

export type NotifictionActions = RecieveNotificationStateAction;

export const recieveRecieveNotificationState = (
  name: NotificationName,
  state: NotificationState,
): RecieveNotificationStateAction => ({
  type: NOTIFICATION_RECIEVE_NOTIFICATION_STATE,
  payload: {
    name,
    state,
  },
});
