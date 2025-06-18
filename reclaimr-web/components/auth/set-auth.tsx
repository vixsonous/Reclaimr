"use client";

import { setUserAuth } from "@/store/redux-slice/user-auth-slice";
import { UserResponse } from "@supabase/supabase-js";
import { useDispatch } from "react-redux";

export default function SetAuth({
  userResponse
}: {
  userResponse: UserResponse | null
}) {
  const dispatch = useDispatch();
  dispatch(setUserAuth(userResponse));
  return <></>
}