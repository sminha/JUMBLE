import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { PurchaseService } from "./purchase.service.ts";
import { CreatePurchaseDto, CATEGORIES } from "@jumble/shared";

const VALID_CATEGORIES = CATEGORIES;

export const PurchaseController = {
  createPurchase: async (req: Request, res: Response) => {
    try {
      const data: CreatePurchaseDto = req.body;
      const userId = req.user.id;

      // 필수 필드 검증
      if (!data.vendorName || !data.purchasedDate || !data.receipt) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "vendorName, purchasedDate, receipt는 필수 값입니다.",
        });
      }

      // items 검증
      if (!Array.isArray(data.items) || data.items.length === 0) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "items는 1개 이상이어야 합니다.",
        });
      }

      // items 내 필수 필드 및 category enum 검증
      for (const item of data.items) {
        if (
          !item.productName ||
          item.unitPrice == null ||
          item.quantity == null
        ) {
          return res.status(400).json({
            success: false,
            status: 400,
            message:
              "각 item에 productName, unitPrice, quantity는 필수 값입니다.",
          });
        }

        if (!VALID_CATEGORIES.includes(item.category)) {
          return res.status(400).json({
            success: false,
            status: 400,
            message: `category는 다음 값 중 하나여야 합니다: ${VALID_CATEGORIES.join(", ")}`,
          });
        }
      }

      const newPurchase = await PurchaseService.createPurchase(userId, data);

      return res.status(201).json({
        success: true,
        status: 201,
        message: "사입내역 추가에 성공했습니다.",
        id: newPurchase.id,
      });
    } catch (error) {
      console.error("🚨 서버 에러 발생:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // 외래키 제약 위반
        if (error.code === "P2003") {
          return res.status(400).json({
            success: false,
            status: 400,
            message: "유효하지 않은 참조 값입니다.",
          });
        }
        // 유니크 제약 위반
        if (error.code === "P2002") {
          return res.status(409).json({
            success: false,
            status: 409,
            message: "이미 존재하는 데이터입니다.",
          });
        }
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "요청 데이터 형식이 올바르지 않습니다.",
        });
      }

      return res.status(500).json({
        success: false,
        status: 500,
        message: "서버 오류가 발생했습니다.",
      });
    }
  },

  getPurchases: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (page < 1 || limit < 1) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "page와 limit은 1 이상이어야 합니다.",
        });
      }

      const { purchases, total } = await PurchaseService.getPurchases(
        userId,
        page,
        limit,
      );

      return res.status(200).json({
        success: true,
        status: 200,
        message: "사입내역 조회에 성공했습니다.",
        purchases,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("🚨 서버 에러 발생:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "잘못된 요청입니다.",
        });
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "요청 데이터 형식이 올바르지 않습니다.",
        });
      }

      return res.status(500).json({
        success: false,
        status: 500,
        message: "서버 오류가 발생했습니다.",
      });
    }
  },

  getPurchase: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const rawPurchaseId = req.params.id as string;

      if (!/^\d+$/.test(rawPurchaseId)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "id는 정수여야 합니다.",
        });
      }

      const purchaseId = BigInt(rawPurchaseId);
      const purchase = await PurchaseService.getPurchase(userId, purchaseId);

      if (!purchase) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "사입내역을 찾을 수 없습니다.",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "사입내역 상세 조회에 성공했습니다.",
        purchase,
      });
    } catch (error) {
      console.error("🚨 서버 에러 발생:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "잘못된 요청입니다.",
        });
      }

      return res.status(500).json({
        success: false,
        status: 500,
        message: "서버 오류가 발생했습니다.",
      });
    }
  },

  getPurchaseReceipt: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const rawPurchaseId = req.params.id as string;

      if (!/^\d+$/.test(rawPurchaseId)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "id는 정수여야 합니다.",
        });
      }

      const purchaseId = BigInt(rawPurchaseId);
      const receipt = await PurchaseService.getPurchaseReceipt(
        userId,
        purchaseId,
      );

      if (!receipt) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "사입내역을 찾을 수 없습니다.",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "영수증 조회에 성공했습니다.",
        ...receipt,
      });
    } catch (error) {
      console.error("🚨 서버 에러 발생:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "잘못된 요청입니다.",
        });
      }

      return res.status(500).json({
        success: false,
        status: 500,
        message: "서버 오류가 발생했습니다.",
      });
    }
  },
};
