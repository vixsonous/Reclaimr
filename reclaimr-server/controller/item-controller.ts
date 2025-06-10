import { Request, Response } from "express";
import { ApiResponse } from "../class/api-class";

export const uploadFoundItem = (req: Request, res: Response) => {

  console.log(req.body);
  res.status(200).json(new ApiResponse('qweqwe!', true, true));
}