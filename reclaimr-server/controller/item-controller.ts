import { Request, Response } from "express";
import { ApiResponse } from "../class/api-class";
import { ItemsService } from "../service/items-service";

export const uploadFoundItem = (req: Request, res: Response) => {

  const files: Express.Multer.File[] | undefined =  req.files as Express.Multer.File[];
  if(files === undefined) {
    res.status(500).json(new ApiResponse('No files uploaded!', undefined, false));
  }

  ItemsService.uploadObjectCommand(files, "users");
  res.status(200).json(new ApiResponse('qweqwe!', true, true));
}