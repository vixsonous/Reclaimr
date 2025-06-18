import { Request, Response } from "express";
import { AUTH_SERVICE_LOGS, AuthService } from "../service/auth-service";
import { ApiResponse } from "../utils/api-class";
import { supabase } from "../utils/supabase";

export const isUserAuthenticated = async (req: Request, res: Response) => {
  
  const user = await AuthService.isAuthenticated();

  new ApiResponse("Success!", user).success(res);
}

export const signinWithGoogle = async (req: Request, res: Response) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3001/api/auth/callback'
    }
  });

  console.log(data);

  new ApiResponse().success(res);
}

export const signinWithGoogleCallback = async (req: Request, res: Response) => {
  const code = req.query;

  console.log(code);
  res.status(200).send("Success!");
}