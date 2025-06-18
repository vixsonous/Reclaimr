import { ApiService, BASE_URL } from "@/lib/ApiService";
import SearchClient from "./Search";
import axios from "axios";
import {UserResponse} from '@supabase/supabase-js'

export default async function Search() {
  const axiosResponse = await axios.get(BASE_URL +"/api/is-authenticated");
  return (
    <div>
      Looking for an item?
      <SearchClient userResponse={axiosResponse.data.data} />
    </div>
  )
}