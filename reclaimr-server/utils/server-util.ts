import { Request } from "express";

export const getAccessToken = (req: Request): string | undefined => {
  return req.cookies['supabase-access-token']
}