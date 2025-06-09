import axios, { AxiosResponse } from 'axios';
import { toast } from 'sonner';
import z from 'zod';

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`;

export interface ApiResponse<T> {
  message: string;
  data: T;
  success: boolean;
}

export class ItemApiService {
  static UPLOAD_FOUND_ITEM = `${BASE_URL}/api/upload-found-item`;

  static handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> | undefined {
    console.log(response);
    if(response.status !== 200) {
      console.log("came here!");
      console.error(response.data.message);
      return undefined;
    }
    return response.data;
  }
  static async uploadFoundItem(): Promise<boolean> {
    const UploadFoundItemResponseSchema = z.object({
      message: z.string(),
      data: z.boolean(),
      success: z.boolean(),
    });
    toast("An event has created", {
      description: new Date().toDateString()
    })
    const response: ApiResponse<boolean> | undefined = this.handleResponse<boolean>(await axios.get(this.UPLOAD_FOUND_ITEM));

    if(!response) return false;

    const parseResult = UploadFoundItemResponseSchema.safeParse(response);
    if(!parseResult.success) {
      for(let i = 0; i < parseResult.error.errors.length; i++) {
        console.error(parseResult.error.errors[i].message);
      }

      return false;
    }
    return response.data;
  }
}