import express, { Router } from 'express';
import { PurchaseController } from './purchase.controller';
import { PurchaseItemController } from '../purchase-item/purchase-item.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router: Router = express.Router();

router.post('/', authMiddleware, PurchaseController.createPurchase);
router.get('/', authMiddleware, PurchaseController.getPurchases);
router.get('/products/:productId', authMiddleware, PurchaseItemController.getPurchaseItem);
router.put('/products/:productId', authMiddleware, PurchaseItemController.updatePurchaseItem);
router.put('/:id', authMiddleware, PurchaseController.updatePurchase);
router.get('/:id/receipt', authMiddleware, PurchaseController.getPurchaseReceipt);
router.get('/:id', authMiddleware, PurchaseController.getPurchase);

export default router;
