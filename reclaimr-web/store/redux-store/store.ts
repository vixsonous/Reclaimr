import { configureStore } from "@reduxjs/toolkit";
import mapItemSlice from '../redux-slice/map-items-slice';
import userAuthSlice from '../redux-slice/user-auth-slice';

export const store = configureStore({
  reducer: {
    mapItems: mapItemSlice,
    user: userAuthSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;