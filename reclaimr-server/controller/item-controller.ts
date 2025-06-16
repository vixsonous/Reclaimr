import { Request, Response } from "express";
import { ApiResponse } from "../class/api-class";
import { ITEMS_SERVICE_LOGS, ItemsService, ItemImagesService } from "../service/items-service";
import { InsertItemReturn, NewItem } from "../db/types";
import { CompleteMultipartUploadCommandOutput } from "@aws-sdk/client-s3";

export const uploadFoundItem = async (req: Request, res: Response) => {

  const files: Express.Multer.File[] | undefined =  req.files as Express.Multer.File[];
  if(files === undefined) {
    res.status(500).json(new ApiResponse('No files uploaded!', undefined, false));
  }

  const user_id = 9189;

  const newItem = {
    item_name: req.body.item_name,
    item_category: req.body.item_category,
    found_latitude: req.body.coordinates.latitude,
    found_longitude: req.body.coordinates.longitude,
    found_by_anonymous: false,
    is_returned: false,
    found_by_user: 99
  } satisfies NewItem;

  const itemUploadResult = await ItemsService.uploadItemToDatabase(newItem);

  if(!itemUploadResult) {
    new ApiResponse(
      ITEMS_SERVICE_LOGS.ERROR_ITEM_UPLOAD, 
      undefined, 
      false
    ).error(res);
  }

  const item_id = (itemUploadResult as InsertItemReturn).id;
  const directory = "users/"+user_id+"/item/"+ item_id;

  const r2UploadResult = await ItemImagesService.uploadObjectCommand(files, directory);

  if(r2UploadResult === null) {
    new ApiResponse(
      ITEMS_SERVICE_LOGS.ERROR_IMAGE_CLOUD_UPLOAD, 
      undefined, 
      false
    ).error(res);
    return;
  }

  const newItemImages = await ItemImagesService.convertR2UploadOutputToNewItemImages(r2UploadResult, item_id, user_id);

  if(newItemImages === null) {
    new ApiResponse(
      ITEMS_SERVICE_LOGS.ERROR_IMAGE_DB_UPLOAD, 
      undefined, 
      false
    ).error(res);
    return;
  }
  
  const insertedItemImages = await ItemImagesService.uploadItemImagesToDatabase(newItemImages);

  if(insertedItemImages === null) {
    new ApiResponse(
      ITEMS_SERVICE_LOGS.ERROR_IMAGE_DB_UPLOAD, 
      undefined, 
      false
    ).error(res);
    return;
  }
  
  new ApiResponse('qweqwe!', true, true).success(res);
}