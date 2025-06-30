import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storageSession from "redux-persist/lib/storage/session";
import { persistReducer, persistStore } from "redux-persist";
import { thunk } from "redux-thunk";

import commonReducer from "./features/common";
import paymentsReducer from "./features/payments";
import accountsReducer from "./features/accounts";
import subscriptionReducer from "./features/subscription";
import settingsReducer from "./features/settings";
import authReducer from "./features/auth";
import onboardingReducer from "./features/onboardingFeatures";
import expenceReducer from "./features/expence";
import cardReducer from "./features/cards";

// Combine all reducers
const rootReducer = combineReducers({
  common: commonReducer,
  payments: paymentsReducer,
  accounts: accountsReducer,
  subscription: subscriptionReducer,
  settings: settingsReducer,
  auth: authReducer,
  onboarding: onboardingReducer,
  expence: expenceReducer,
  card : cardReducer
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage: storageSession,
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Create persistor
export const persistor = persistStore(store);

export default store;
