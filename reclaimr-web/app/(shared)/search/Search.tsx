"use client";

import { store } from "@/store/redux-store/store";
import { Provider, useDispatch } from "react-redux";
import MapClient from "./Map";
import { UserResponse } from "@supabase/supabase-js";
import { setUserAuth } from "@/store/redux-slice/user-auth-slice";
import SetAuth from "@/components/auth/set-auth";

export default function SearchClient({
  userResponse
}: {
  userResponse: UserResponse | null
}) {
  return (
    <Provider store={store}>
      <SetAuth userResponse={userResponse}/>
      <MapClient />
    </Provider>
  )
}