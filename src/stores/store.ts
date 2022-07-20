import { configureStore, combineReducers } from "@reduxjs/toolkit";

import chromeReducer from "../slices/chrome";

const rootReducer = combineReducers({
  chrome: chromeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;

export default store;
