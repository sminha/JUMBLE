import express, { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { PurchaseController } from "../controllers/purchase.controller.ts";

const router: Router = express.Router();

router.post("/", authMiddleware, PurchaseController.createPurchase);

export default router;
