import express, { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { PurchaseController } from "../controllers/purchase.controller.ts";

const router: Router = express.Router();

router.post("/", authMiddleware, PurchaseController.createPurchase);
router.get("/", authMiddleware, PurchaseController.getPurchases);
router.get("/items/:itemId", authMiddleware, PurchaseController.getPurchaseItem);
router.get("/:id", authMiddleware, PurchaseController.getPurchase);

export default router;
