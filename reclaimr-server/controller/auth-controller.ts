import { Request, Response } from "express";
import { AuthService } from "../service/auth-service";
import { ApiResponse } from "../utils/api-class";
import { supabase } from "../utils/supabase";
import dotenv from 'dotenv';
import { getAccessToken } from "../utils/server-util";
dotenv.config();

export const isUserAuthenticated = async (req: Request, res: Response) => {
  
  const accessToken = getAccessToken(req);
  if(!accessToken) {
    new ApiResponse("Not Authorized!", null).success(res);
    return;
  }

  const user = await AuthService.isAuthenticated(accessToken);

  new ApiResponse("Success!", user).success(res);
}

export const signinWithGoogle = async (req: Request, res: Response) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3001/api/auth/callback'
    }
  });

  if(data.url) {
    new ApiResponse('Redirect', data.url).success(res);
  }
}

export const signinWithGoogleCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const next = req.query.next as string ?? `${process.env.FRONTEND_BASE_URL}:${process.env.FRONTEND_PORT}`;

  if(!code || code === '') {
    ApiResponse.redirect(res, `${next}/auth/error`);
    return;
  }

  const {data, error} = await supabase.auth.exchangeCodeForSession(code);

  const session = data.session;
  if(session === null) {
    ApiResponse.redirect(res, `${next}/auth/error`);
    return;
  }

  res.cookie('supabase-access-token', session.access_token, {
    httpOnly: true,
    maxAge: session.expires_in * 1000,
    path: '/'
  });

  res.cookie('supabase-refresh-token', session.refresh_token, {
    httpOnly: true,
    maxAge: 3600000 * 24 * 7,
    path: '/'
  });

  ApiResponse.redirect(res, next);
}