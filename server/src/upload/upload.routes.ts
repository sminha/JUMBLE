import { Router } from 'express';
import { UploadController } from './upload.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/presigned-url', authMiddleware, UploadController.getPresignedUrl);

export default router;
