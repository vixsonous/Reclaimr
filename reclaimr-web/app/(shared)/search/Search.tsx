"use client";

import { store } from "@/store/redux-store/store";
import { Provider, useDispatch } from "react-redux";
import MapClient from "./Map";
import {QueryClientProvider} from '@tanstack/react-query';
import SetAuth from "@/components/auth/set-auth";
import axios from "axios";
import { queryClient } from "@/lib/utils";

export default function SearchClient() {
  
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SetAuth/>
        <MapClient />
      </QueryClientProvider>
    </Provider>
  )
}