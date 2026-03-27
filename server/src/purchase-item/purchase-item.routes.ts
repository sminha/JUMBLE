import express, { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { PurchaseItemController } from "./purchase-item.controller.ts";

const router: Router = express.Router();

router.get("/", authMiddleware, PurchaseItemController.getPurchaseItems);
router.get("/:id", authMiddleware, PurchaseItemController.getPurchaseItem);

export default router;
