import { Router } from "express";
import { uploadFoundItem } from "./controller/item-controller";

const router = Router();

router.post('/upload-found-item', uploadFoundItem);

export default router;