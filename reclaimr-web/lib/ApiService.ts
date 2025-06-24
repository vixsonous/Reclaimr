import { ICoordinates } from '@/types/map-types';
import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';
import { FieldValues } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

export const BASE_CLIENT_URL = `${process.env.NEXT_PUBLIC_BACKEND_BASE_CLIENT_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`;
export const BASE_SERVER_URL = `${process.env.NEXT_PUBLIC_BACKEND_BASE_SERVER_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`;

export interface ApiResponse<T> {
  message: string;
  data: T | undefined;
}

export interface UploadFoundItemBody {
  item_name: string;
  item_category: string;
  item_description: string;
  item_images: FileList;
  coordinates: Partial<ICoordinates>;
}

export interface SearchFoundItemBody {
  item_name?: string;
  item_category?: string;
  item_description?: string;
  location?: Partial<ICoordinates>;
}

export class ApiService {
  static async get<T>(url: string, requestConfig?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return axios.get(`${BASE_CLIENT_URL}${url}`, requestConfig)
    .then(res => res.data)
    .catch(err => console.log(err))
  }

  static async post<T>(url: string, body: T, requestConfig?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return axios.post(`${BASE_CLIENT_URL}${url}`, body, requestConfig).then(res => res.data);
  }
}

export class ItemApiService {
  private static _UPLOAD_FOUND_ITEM = `/api/upload-found-item`;
  private static _SEARCH_FOUND_ITEM = `/api/search-found-item`;

  static async searchFoundItem(data: SearchFoundItemBody): Promise<boolean> {
    const SearchFoundItemResponseSche = z.object({
      message: z.string(),
      data: z.boolean(),
    });

    const response: ApiResponse<SearchFoundItemBody> = await ApiService.post(
      this._SEARCH_FOUND_ITEM, 
      data, 
      {
        withCredentials: true
      }
    );

    if(!response) return false;
    console.log(response);
    return true;
  }
  
  static async uploadFoundItem(data: UploadFoundItemBody): Promise<boolean> {
    const UploadFoundItemResponseSchema = z.object({
      message: z.string(),
      data: z.boolean(),
    });
    const response: ApiResponse<UploadFoundItemBody> = 
      await ApiService.post<UploadFoundItemBody>(
        this._UPLOAD_FOUND_ITEM, 
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
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