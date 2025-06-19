import { CompleteMultipartUploadCommandOutput } from "@aws-sdk/client-s3";
import { ItemImagesService, ITEMS_SERVICE_LOGS } from "../service/items-service";
import { ApiResponse } from "../utils/api-class";
import { InsertItemImageReturn } from "../db/types";
import { LogsService } from "../service/logs-service";

export class ItemImage {
  private _files: Express.Multer.File[];
  private _item_id: number;
  private _user_id: string;
  constructor(files: Express.Multer.File[], item_id: number, user_id: string) {
    this._files = files;
    this._item_id = item_id;
    this._user_id = user_id;
  }

  async create(): Promise<InsertItemImageReturn[] | null> {
    try {
      const directory = "users/"+this._user_id+"/item/"+ this._item_id;
      const r2UploadResult = await ItemImagesService.uploadObjectCommand(this._files, directory);
      
      if(r2UploadResult === null) {
        throw new Error(ITEMS_SERVICE_LOGS.ERROR_IMAGE_CLOUD_UPLOAD);
      }

      const newItemImages = await ItemImagesService.convertR2UploadOutputToNewItemImages(r2UploadResult, this._item_id, this._user_id);

      if(newItemImages === null) {
        throw new Error(ITEMS_SERVICE_LOGS.ERROR_IMAGE_DB_UPLOAD);
      }

      const insertedItemImages = await ItemImagesService.uploadItemImagesToDatabase(newItemImages);
      
      return insertedItemImages;

    } catch (error) {
      LogsService.error(error);
      console.log(error);
      return null;
    }
  }

}