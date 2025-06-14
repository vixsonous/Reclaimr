import { Router } from "express";
import { uploadFoundItem } from "./controller/item-controller";
import multer from 'multer';
const upload = multer({dest: 'uploads/', storage: multer.memoryStorage()});

const router = Router();

router.post('/upload-found-item', upload.array('item_images[]'), uploadFoundItem);

export default router;