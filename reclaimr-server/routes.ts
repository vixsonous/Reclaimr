import { Router } from "express";
import { uploadFoundItem } from "./controller/item-controller";
import multer from 'multer';
import { isUserAuthenticated, signinWithGoogle, signinWithGoogleCallback } from "./controller/auth-controller";
const upload = multer({dest: 'uploads/', storage: multer.memoryStorage()});

const router = Router();

router.post('/upload-found-item', upload.array('item_images[]'), uploadFoundItem);
router.get('/is-authenticated', isUserAuthenticated);
router.get('/auth/google/login', signinWithGoogle);
router.get('/auth/callback', signinWithGoogleCallback);

export default router;