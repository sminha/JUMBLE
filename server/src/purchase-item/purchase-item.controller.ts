import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { PurchaseItemService } from "./purchase-item.service.ts";
import {
  DateType,
  SortOrder,
  PurchaseItemSortBy,
  DATE_TYPES,
  SORT_ORDERS,
  SORT_BY,
} from "./purchase-item.types.ts";

export const PurchaseItemController = {
  getPurchaseItems: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const dateType = (req.query.dateType as DateType) ?? "purchased";
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      const vendorName = req.query.vendorName as string | undefined;
      const backorderOnly = req.query.backorderOnly === "true";
      const sortBy = (req.query.sortBy as PurchaseItemSortBy) ?? "purchasedAt";
      const sortOrder = (req.query.sortOrder as SortOrder) ?? "desc";

      if (page < 1 || limit < 1) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "page와 limit은 1 이상이어야 합니다.",
        });
      }

      if (!DATE_TYPES.includes(dateType)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "dateType은 purchased 또는 created여야 합니다.",
        });
      }

      if (!SORT_BY.includes(sortBy)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: `sortBy는 다음 값 중 하나여야 합니다: ${SORT_BY.join(", ")}`,
        });
      }

      if (!SORT_ORDERS.includes(sortOrder)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "sortOrder는 asc 또는 desc여야 합니다.",
        });
      }

      const { items, total } = await PurchaseItemService.getPurchaseItems(
        userId,
        {
          page,
          limit,
          dateType,
          startDate,
          endDate,
          vendorName,
          backorderOnly,
          sortBy,
          sortOrder,
        },
      );

      return res.status(200).json({
        success: true,
        status: 200,
        message: "사입내역 조회에 성공했습니다.",
        items,
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

  getPurchaseItem: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const rawItemId = req.params.id as string;

      if (!/^\d+$/.test(rawItemId)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "id는 정수여야 합니다.",
        });
      }

      const itemId = BigInt(rawItemId);
      const item = await PurchaseItemService.getPurchaseItem(userId, itemId);

      if (!item) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "상품 사입내역을 찾을 수 없습니다.",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "상품 사입내역 상세 조회에 성공했습니다.",
        item,
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
