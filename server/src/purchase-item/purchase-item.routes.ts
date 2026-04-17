import express, { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { PurchaseItemController } from './purchase-item.controller';

const router: Router = express.Router();

router.get('/', authMiddleware, PurchaseItemController.getPurchaseItems);

export default router;
