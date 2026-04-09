import { configureStore } from '@reduxjs/toolkit';
import schedulerReducer from './features/scheduler/schedulerSlice';

export const store = configureStore({
  reducer: {
    scheduler: schedulerReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
