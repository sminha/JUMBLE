import express, { Router } from 'express';
import { PurchaseController } from './purchase.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router: Router = express.Router();

router.post('/', authMiddleware, PurchaseController.createPurchase);
router.get('/products/:productId', authMiddleware, PurchaseController.getProduct);
router.put('/products/:productId', authMiddleware, PurchaseController.updateProduct);
router.patch(
  '/products/:productId/backorder',
  authMiddleware,
  PurchaseController.updateBackorderQuantity,
);
router.put('/:id', authMiddleware, PurchaseController.updatePurchase);
router.get('/:id/receipt', authMiddleware, PurchaseController.getPurchaseReceipt);
router.get('/:id', authMiddleware, PurchaseController.getPurchase);

export default router;
