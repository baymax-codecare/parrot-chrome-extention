import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistStore, persistReducer } from "redux-persist";
import chromeReducer from "../slices/chrome";
import notificationReducer from "../slices/notification";
import meApiStatusReducer from "../slices/me-api-status";

const rootReducer = combineReducers({
  chrome: chromeReducer,
  notification: notificationReducer,
  meApiStatus: meApiStatusReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
});

export const persister = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export default store;
