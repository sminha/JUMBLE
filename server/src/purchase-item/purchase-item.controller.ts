import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { PurchaseItemService } from './purchase-item.service';
import { querySchema } from './query.schema';
import { deleteProductsSchema } from '@jumble/shared';

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

  // 미송수량 일괄 변경 API
  resetBackorderQuantities: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const result = deleteProductsSchema.safeParse(req.body);

      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, status: 400, message: result.error.issues[0].message });
      }

      const count = await PurchaseItemService.resetBackorderQuantities(
        userId,
        result.data.productIds,
      );

      return res.status(200).json({
        success: true,
        status: 200,
        message: `${count}개 상품의 미송수량이 0으로 변경되었습니다.`,
      });
    } catch (error) {
      console.error('🚨 서버 에러 발생:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(400).json({ success: false, status: 400, message: '잘못된 요청입니다.' });
      }

      return res
        .status(500)
        .json({ success: false, status: 500, message: '서버 오류가 발생했습니다.' });
    }
  },

  // 엑셀 다운로드 API
  exportPurchaseItems: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const result = querySchema.safeParse(req.query);

      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, status: 400, message: result.error.issues[0].message });
      }

      const buffer = await PurchaseItemService.exportPurchaseItems(userId, result.data);
      const filename = encodeURIComponent('사입내역.xlsx');

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${filename}`);

      return res.send(buffer);
    } catch (error) {
      console.error('🚨 서버 에러 발생:', error);

      return res.status(500).json({
        success: false,
        status: 500,
        message: '서버 오류가 발생했습니다.',
      });
    }
  },
};
