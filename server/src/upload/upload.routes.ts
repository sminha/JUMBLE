import { Router } from 'express';
import { UploadController } from './upload.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = Router();

router.post('/presigned-url', authMiddleware, UploadController.getPresignedUrl);

export default router;
