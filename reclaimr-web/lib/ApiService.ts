import { ICoordinates } from '@/types/map-types';
import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';
import { FieldValues } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`;

export interface ApiResponse<T> {
  message: string;
  data: T;
  success: boolean;
}

export interface UploadFoundItemBody {
  item_name: string;
  item_images: FileList;
  coordinates: Partial<ICoordinates>;
}

export class ItemApiService {
  static UPLOAD_FOUND_ITEM = `${BASE_URL}/api/upload-found-item`;

  static async get<T>(url: string, requestConfig?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return axios.get(url, requestConfig)
      .then(res => res.data)
      .catch((err: AxiosError) => {
        toast.error("There was an error!", {
          description: (err.response?.data as ApiResponse<T>).message
        });

        return undefined;
      });
  }

  static async post<T>(url: string, body: T, requestConfig?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return axios.post(url, body, requestConfig)
      .then(res => res.data)
      .catch((err: AxiosError) => {
        toast.error("There was an error!", {
          description: (err.response?.data as ApiResponse<T>).message
        });

        return undefined;
      });
  }
  static async uploadFoundItem(data: UploadFoundItemBody): Promise<boolean> {
    const UploadFoundItemResponseSchema = z.object({
      message: z.string(),
      data: z.boolean(),
      success: z.boolean(),
    });
    const response: ApiResponse<UploadFoundItemBody> = 
      await this.post<UploadFoundItemBody>(
        this.UPLOAD_FOUND_ITEM, 
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
    if(!response) return false;

    const parseResult = UploadFoundItemResponseSchema.safeParse(response);
    if(!parseResult.success) {
      toast.error("There was an error!", {
        description: "Incorrect API response!",
      });
      for(let i = 0; i < parseResult.error.errors.length; i++) {
        console.error(parseResult.error.errors[i].message);
      }

      return false;
    }
    return true;
  }
}