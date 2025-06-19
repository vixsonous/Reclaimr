import { UserResponse } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import { LogsService } from "./logs-service";

export const AUTH_SERVICE_LOGS = {
  NOT_AUTHENTICATED: "The user is not authenticated!",
  AUTHENTICATED: "The user is authenticated!"
}

export class AuthService {
  static async isAuthenticated(accessToken: string): Promise<UserResponse | null> {
    try {
      const isAuth = await supabase.auth.getUser(accessToken);

      if(isAuth.error) {
        throw new Error(isAuth.error.message);
      }

      LogsService.log(AUTH_SERVICE_LOGS.AUTHENTICATED);
      return isAuth;
    } catch (error) {
      LogsService.error(AUTH_SERVICE_LOGS.NOT_AUTHENTICATED)
      console.log(error);
      return null;
    }
  }

  static async signinWithGoogle() {
    
  }
}