import { createStorage } from '@/store/store';
import { combineReducers } from 'redux';
import { PersistConfig, persistReducer } from 'redux-persist';
import { reducer as arena } from './arena';
import { reducer as content } from './content';
import { reducer as dojo } from './dojo';
import { reducer as navigation } from './navigation';
import { NotificationsState, reducer as notifications } from './notifications';
import { PurchaseState, reducer as purchase } from './purchase';
import { reducer as questions } from './questions';
import { reducer as settings, SettingsState } from './settings';
import { reducer as study } from './study';
import { reducer as translations } from './translations';

const settingsConfig: PersistConfig<SettingsState> = {
  key: 'settings',
  storage: createStorage(),
};

const purchaseConfig: PersistConfig<PurchaseState> = {
  key: 'purchase',
  storage: createStorage(),
};

const notificationConfig: PersistConfig<NotificationsState> = {
  key: 'notifications',
  storage: createStorage(),
};

const rootReducer = combineReducers({
  study: study,
  translations: translations,
  navigation: navigation,
  content: content,
  questions: questions,
  dojo: dojo,
  arena: arena,
  settings: persistReducer(settingsConfig, settings),
  purchase: persistReducer(purchaseConfig, purchase),
  notifications: persistReducer(notificationConfig, notifications),
});

const createRootReducer = () => rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

export default createRootReducer;
