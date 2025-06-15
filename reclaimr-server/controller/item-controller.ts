import { Request, Response } from "express";
import { ApiResponse } from "../class/api-class";
import { ITEMS_SERVICE_LOGS, ItemsDatabaseService, ItemsService } from "../service/items-service";
import { NewItem } from "../db/types";

export const uploadFoundItem = (req: Request, res: Response) => {

  const files: Express.Multer.File[] | undefined =  req.files as Express.Multer.File[];
  if(files === undefined) {
    res.status(500).json(new ApiResponse('No files uploaded!', undefined, false));
  }

  const newItem = {
    item_name: req.body.item_name,
    item_category: req.body.item_category,
    found_latitude: req.body.coordinates.latitude,
    found_longitude: req.body.coordinates.longitude,
    found_by_anonymous: false,
    is_returned: false,
    found_by_user: 99
  } satisfies NewItem;

  const itemUploadResult = ItemsDatabaseService.uploadItemToDatabase(newItem);

  if(!itemUploadResult) {
    new ApiResponse(
      ITEMS_SERVICE_LOGS.ERROR_IMAGE_UPLOAD, 
      undefined, 
      false
    ).error(res);
  }

  const r2UploadResult = ItemsService.uploadObjectCommand(files, "users");

  if(!r2UploadResult) {
    new ApiResponse(
      ITEMS_SERVICE_LOGS.ERROR_IMAGE_UPLOAD, 
      undefined, 
      false
    ).error(res);
  }

  new ApiResponse('qweqwe!', true, true).success(res);
}