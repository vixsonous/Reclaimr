import Button from "@/app/_components/Button";
import { ApiService } from "@/lib/ApiService";
import { useRouter } from "next/navigation";
import React from "react";

export default function Signin() {
  const signinWithGoogle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const data = await ApiService.get("/api/auth/google/login", {
      withCredentials: true,
    });
    window.location.href = data.data as string;
  }
  return (
    <Button onClick={signinWithGoogle} role="none">
      Google signin
    </Button>
  )
}