import { configureStore } from "@reduxjs/toolkit";
import mapItemSlice from '../redux-slice/map-items-slice';

export const store = configureStore({
  reducer: {
    mapItems: mapItemSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;