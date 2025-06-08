"use client";

import { store } from "@/store/redux-store/store";
import { Provider } from "react-redux";
import MapClient from "./Map";

export default function SearchClient() {
  return (
    <Provider store={store}>
      <MapClient />
    </Provider>
  )
}