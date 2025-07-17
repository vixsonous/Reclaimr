import { Request, Response } from "express";
import { ApiResponse } from "../utils/api-class";

export const getImageSignedUrl = (req: Request, res: Response) => {
  console.log(req.query);
  
  new ApiResponse("Success", undefined).success(res);
}