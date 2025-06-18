import Button from "@/app/_components/Button";
import { supabase } from "@/lib/supabase";
import axios from "axios";
import React from "react";

export default function Signin() {
  const signinWithGoogle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const data = await axios.get("http://localhost:3001/api/auth/google/login");
    console.log(data);
  }
  return (
    <Button onClick={signinWithGoogle} role="none">
      Google signin
    </Button>
  )
}