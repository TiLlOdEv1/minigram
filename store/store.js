// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

// Import reducers
import authReducer from './slices/authSlice';
import premiumReducer from './slices/premiumSlice';
import userReducer from './slices/userSlice';
import aiReducer from './slices/aiSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['auth', 'user', 'ui'], // Reducers to persist
  blacklist: ['premium', 'ai', 'notifications'], // Reducers not to persist
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  premium: premiumReducer,
  user: userReducer,
  ai: aiReducer,
  notifications: notificationReducer,
  ui: uiReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Persistor
export const persistor = persistStore(store);

// Type definitions
export const RootState = store.getState;
export const AppDispatch = store.dispatch;