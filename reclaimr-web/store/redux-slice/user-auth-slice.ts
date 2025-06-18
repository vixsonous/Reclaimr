import { createSlice } from "@reduxjs/toolkit";
import { UserResponse } from "@supabase/supabase-js";

type SetUserAuthAction = {
  payload: UserResponse | null;
  type: string;
}

type InitialState = {
  userSession: UserResponse | null;
}

const userAuthSlice = createSlice({
  name: 'User Auth',
  initialState: {
    userSession: null as UserResponse | null
  } satisfies InitialState,
  reducers: {
    setUserAuth(state, action: SetUserAuthAction) {
      state.userSession = action.payload;
    }
  }
});

export const { setUserAuth } = userAuthSlice.actions; 
export default userAuthSlice.reducer;