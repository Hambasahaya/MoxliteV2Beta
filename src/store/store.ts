import { configureStore } from "@reduxjs/toolkit";
import stageReducer from "./stageSlice";

export const store = configureStore({
  reducer: {
    stage: stageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
