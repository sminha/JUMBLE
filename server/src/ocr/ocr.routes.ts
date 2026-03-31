import multer from "multer";
import express, { Router } from "express";
import { OcrController } from "./ocr.controller.ts";
// import { authMiddleware } from '../middleware/auth.middleware.ts';

const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/parse", upload.single("image"), OcrController.parseReceipt);

export default router;
