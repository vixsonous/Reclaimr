import { Request, Response } from "express";
import { ApiResponse } from "../class/api-class";

export const uploadFoundItem = (req: Request, res: Response) => {

  res.status(400).json(new ApiResponse('qweqwe!', 'true', true));
}