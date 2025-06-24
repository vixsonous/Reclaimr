import { Request, Response } from "express";
import { ApiResponse } from "../utils/api-class";
import { ITEMS_SERVICE_LOGS } from "../service/items-service";
import { AUTH_SERVICE_LOGS, AuthService } from "../service/auth-service";
import { Item } from "../model/item";
import { ItemImage } from "../model/item-image";
import { getAccessToken } from "../utils/server-util";
import { ItemSearchFields } from "../repository/items-repository";

export const uploadFoundItem = async (req: Request, res: Response) => {

  const files: Express.Multer.File[] | undefined =  req.files as Express.Multer.File[];
  if(files === undefined) {
    new ApiResponse('No files uploaded!', false).error(res);
    return;
  }

  const accessToken = getAccessToken(req);

  if(accessToken === undefined) {
    new ApiResponse(AUTH_SERVICE_LOGS.NOT_AUTHENTICATED, false).unauthorized(res);
    return;
  } 

  const userData = await AuthService.isAuthenticated(accessToken);

  if(userData === null) {
    new ApiResponse(AUTH_SERVICE_LOGS.NOT_AUTHENTICATED, false).unauthorized(res);
    return;
  }

  if(userData.data.user === null) {
    new ApiResponse(AUTH_SERVICE_LOGS.NOT_AUTHENTICATED, false).unauthorized(res);
    return;
  }

  const user_id = userData.data.user.id;

  const itemUploadResult = await new Item(
    req.body.item_name,
    req.body.item_category,
    req.body.item_description,
    req.body.coordinates.latitude,
    req.body.coordinates.longitude,
    false,
    false,
    user_id
  ).create();

  if(itemUploadResult === null) {
    new ApiResponse(ITEMS_SERVICE_LOGS.ERROR_ITEM_UPLOAD, false).error(res);
    return;
  }

  const item_id = itemUploadResult.id;

  const insertedItemImages = await new ItemImage(files, item_id, user_id).create();

  if(insertedItemImages === null) {
    new ApiResponse(ITEMS_SERVICE_LOGS.ERROR_IMAGE_DB_UPLOAD, false).error(res);
    return;
  }
  
  new ApiResponse('Successfully submitted lost item!', true).success(res);
}

export const searchFoundItem = async (req: Request, res: Response) => {

  const searchFields = {
    item_name: req.body.item_name,
    item_category: req.body.item_category,
    item_description: req.body.item_description,
  } satisfies ItemSearchFields;
  const resultItem = await Item.findWithSearchFields(searchFields);
  new ApiResponse('Success!', resultItem).success(res);
}