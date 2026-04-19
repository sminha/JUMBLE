import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { PurchaseItemService } from './purchase-item.service';
import { querySchema } from './query.schema';
import {
  ProductDetail,
  GetProductDetailResponse,
  EditPurchaseItemResponse,
  productSchema,
} from '@jumble/shared';

export const PurchaseItemController = {
  // 사입내역 조회 API
  getPurchaseItems: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const result = querySchema.safeParse(req.query);

      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, status: 400, message: result.error.issues[0].message });
      }

      const { records, total } = await PurchaseItemService.getPurchaseItems(userId, result.data);

      return res.status(200).json({
        success: true,
        status: 200,
        message: '사입내역 조회에 성공했습니다.',
        records,
        pagination: {
          total,
          page: result.data.page,
          limit: result.data.limit,
          totalPages: Math.ceil(total / result.data.limit),
        },
      });
    } catch (error) {
      console.error('🚨 서버 에러 발생:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: '잘못된 요청입니다.',
        });
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: '요청 데이터 형식이 올바르지 않습니다.',
        });
      }

      return res.status(500).json({
        success: false,
        status: 500,
        message: '서버 오류가 발생했습니다.',
      });
    }
  },

  // 상품 사입내역 수정 API
  updatePurchaseItem: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const rawItemId = req.params.productId as string;

      if (!/^\d+$/.test(rawItemId)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: 'id는 정수여야 합니다.',
        });
      }

      const result = productSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: result.error.issues[0].message,
        });
      }

      const itemId = BigInt(rawItemId);
      const found = await PurchaseItemService.updatePurchaseItem(userId, itemId, result.data);

      if (!found) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: '상품 사입내역을 찾을 수 없습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: '상품 사입내역 수정에 성공했습니다.',
      } satisfies EditPurchaseItemResponse);
    } catch (error) {
      console.error('🚨 서버 에러 발생:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: '잘못된 요청입니다.',
        });
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: '요청 데이터 형식이 올바르지 않습니다.',
        });
      }

      return res.status(500).json({
        success: false,
        status: 500,
        message: '서버 오류가 발생했습니다.',
      });
    }
  },

  // 상품사입내역 상세조회 API
  getPurchaseItem: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const rawItemId = req.params.productId as string;

      if (!/^\d+$/.test(rawItemId)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: 'id는 정수여야 합니다.',
        });
      }

      const itemId = BigInt(rawItemId);
      const item: ProductDetail | null = await PurchaseItemService.getPurchaseItem(userId, itemId);

      if (!item) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: '상품 사입내역을 찾을 수 없습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: '상품 사입내역 상세 조회에 성공했습니다.',
        data: item,
      } satisfies GetProductDetailResponse);
    } catch (error) {
      console.error('🚨 서버 에러 발생:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: '잘못된 요청입니다.',
        });
      }

      return res.status(500).json({
        success: false,
        status: 500,
        message: '서버 오류가 발생했습니다.',
      });
    }
  },
};
