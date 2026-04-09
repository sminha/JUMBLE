import multer from 'multer';
import express, { Router } from 'express';
import { OcrController } from './ocr.controller';
// import { authMiddleware } from '../middleware/auth.middleware';

const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/parse', upload.single('image'), OcrController.parseReceipt);

export default router;
