"use client";

import { ApiService } from "@/lib/ApiService";
import { MINUTE } from "@/lib/time";
import { setUserAuth } from "@/store/redux-slice/user-auth-slice";
import { UserResponse } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export default function SetAuth() {
  const dispatch = useDispatch();
  useQuery({
    queryFn: () => ApiService.get("/api/is-authenticated", {withCredentials: true})
      .then(res => {
        dispatch(setUserAuth(res.data as UserResponse));
        return null;
      }),
    queryKey: ["is-auth"],
    staleTime: MINUTE * 5
  });

  
  return <></>
}