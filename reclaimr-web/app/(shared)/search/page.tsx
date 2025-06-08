import { Provider } from "react-redux";
import MapClient from "./Map";
import { store } from "@/store/redux-store/store";
import SearchClient from "./Search";

export default function Search() {
  return (
    <div>
      Looking for an item?
      <SearchClient />
    </div>
  )
}