import { combineReducers } from 'redux';
import user from './user_reducer';
import feed from './feed_reducer';
import follow from './follow_reducer';
import trend from './trend_reducer';
import chat from './chat_reducer';
import { persistReducer } from 'redux-persist';	
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  user, feed, follow, trend, chat
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;

// export default rootReducer;