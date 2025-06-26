import { configureStore } from "@reduxjs/toolkit";
import mapItemSlice from '../redux-slice/map-items-slice';
import userAuthSlice from '../redux-slice/user-auth-slice';
import mapValueSlice from '../redux-slice/map-values-slice';

export const store = configureStore({
  reducer: {
    mapItems: mapItemSlice,
    user: userAuthSlice,
    mapValues: mapValueSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;