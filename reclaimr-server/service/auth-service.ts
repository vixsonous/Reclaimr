import { UserResponse } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import { LogsService } from "./logs-service";

export const AUTH_SERVICE_LOGS = {
  NOT_AUTHENTICATED: "The user is not authenticated!"
}

export class AuthService {
  static async isAuthenticated(): Promise<UserResponse | null> {
    try {
      const isAuth = await supabase.auth.getUser();

      console.log(isAuth.error);

      return isAuth;
    } catch (error) {
      LogsService.error(AUTH_SERVICE_LOGS.NOT_AUTHENTICATED)
      console.log(error);
      return null;
    }
  }
}