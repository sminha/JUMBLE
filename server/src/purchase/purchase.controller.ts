import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { PurchaseService } from './purchase.service';
import {
  Purchase,
  purchaseSchema,
  productSchema,
  updateBackorderSchema,
  productIdsSchema,
  PurchaseDetail,
  ProductDetail,
  GetPurchaseDetailResponse,
  GetProductDetailResponse,
  UpdatePurchaseResponse,
  UpdateProductResponse,
  UpdateBackorderResponse,
  DeletePurchaseResponse,
  DeleteProductResponse,
  DeleteProductsResponse,
} from '@jumble/shared';

export const PurchaseController = {
  // 사입내역 추가 API
  createPurchase: async (req: Request, res: Response) => {
    try {
      const data = purchaseSchema.parse(req.body);
      const userId = req.user.id;

      const newPurchase = await PurchaseService.createPurchase(userId, data);

      return res.status(201).json({
        success: true,
        status: 201,
        message: '사입내역 추가에 성공했습니다.',
        id: newPurchase.id,
      });
    } catch (error) {
      console.error('🚨 서버 에러 발생:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // 외래키 제약 위반
        if (error.code === 'P2003') {
          return res.status(400).json({
            success: false,
            status: 400,
            message: '유효하지 않은 참조 값입니다.',
          });
        }
        // 유니크 제약 위반
        if (error.code === 'P2002') {
          return res.status(409).json({
            success: false,
            status: 409,
            message: '이미 존재하는 데이터입니다.',
          });
        }
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

  // 사입내역 상세조회 API
  getPurchase: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const rawPurchaseId = req.params.id as string;

      if (!/^\d+$/.test(rawPurchaseId)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: 'id는 정수여야 합니다.',
        });
      }

      const purchaseId = BigInt(rawPurchaseId);
      const purchase: PurchaseDetail | null = await PurchaseService.getPurchase(userId, purchaseId);

      if (!purchase) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: '사입내역을 찾을 수 없습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: '사입내역 상세 조회에 성공했습니다.',
        data: purchase,
      } satisfies GetPurchaseDetailResponse);
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

  // 상품사입내역 상세조회 API
  getProduct: async (req: Request, res: Response) => {
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
      const item: ProductDetail | null = await PurchaseService.getProduct(userId, itemId);

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

  // 사입내역 수정 API
  updatePurchase: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const rawPurchaseId = req.params.id as string;

      if (!/^\d+$/.test(rawPurchaseId)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: 'id는 정수여야 합니다.',
        });
      }

      const data: Purchase = purchaseSchema.parse(req.body);
      const purchaseId = BigInt(rawPurchaseId);
      const found = await PurchaseService.updatePurchase(userId, purchaseId, data);

      if (!found) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: '사입내역을 찾을 수 없습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: '사입내역 수정에 성공했습니다.',
      } satisfies UpdatePurchaseResponse);
    } catch (error) {
      console.error('🚨 서버 에러 발생:', error);

      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: error.issues[0].message,
        });
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          return res.status(400).json({
            success: false,
            status: 400,
            message: '유효하지 않은 참조 값입니다.',
          });
        }
      }

      return res.status(500).json({
        success: false,
        status: 500,
        message: '서버 오류가 발생했습니다.',
      });
    }
  },

  // 상품사입내역 수정 API
  updateProduct: async (req: Request, res: Response) => {
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
      const found = await PurchaseService.updateProduct(userId, itemId, result.data);

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
      } satisfies UpdateProductResponse);
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

  // 미송수량 수정 API
  updateBackorder: async (req: Request, res: Response) => {
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

      const result = updateBackorderSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: result.error.issues[0].message,
        });
      }

      const itemId = BigInt(rawItemId);
      let found: boolean | null;
      try {
        found = await PurchaseService.updateBackorder(
          userId,
          itemId,
          result.data.backorderQuantity,
        );
      } catch (e) {
        if (e instanceof Error) {
          return res.status(400).json({ success: false, status: 400, message: e.message });
        }
        throw e;
      }

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
        message: '미송수량 수정에 성공했습니다.',
      } satisfies UpdateBackorderResponse);
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

  // 사입내역 삭제 API
  deletePurchase: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const rawPurchaseId = req.params.id as string;

      if (!/^\d+$/.test(rawPurchaseId)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: 'id는 정수여야 합니다.',
        });
      }

      const purchaseId = BigInt(rawPurchaseId);
      const found = await PurchaseService.deletePurchase(userId, purchaseId);

      if (!found) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: '사입내역을 찾을 수 없습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: '사입내역 삭제에 성공했습니다.',
      } satisfies DeletePurchaseResponse);
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

  // 선택삭제 API
  deleteProducts: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;

      const result = productIdsSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: result.error.issues[0].message,
        });
      }

      const productIds = result.data.productIds.map((id) => BigInt(id));
      await PurchaseService.deleteProducts(userId, productIds);

      return res.status(200).json({
        success: true,
        status: 200,
        message: '상품 사입내역 삭제에 성공했습니다.',
      } satisfies DeleteProductsResponse);
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

  // 상품사입내역 삭제 API
  deleteProduct: async (req: Request, res: Response) => {
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
      const found = await PurchaseService.deleteProduct(userId, itemId);

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
        message: '상품 사입내역 삭제에 성공했습니다.',
      } satisfies DeleteProductResponse);
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

  getPurchaseReceipt: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const rawPurchaseId = req.params.id as string;

      if (!/^\d+$/.test(rawPurchaseId)) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: 'id는 정수여야 합니다.',
        });
      }

      const purchaseId = BigInt(rawPurchaseId);
      const receipt = await PurchaseService.getPurchaseReceipt(userId, purchaseId);

      if (!receipt) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: '사입내역을 찾을 수 없습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: '영수증 조회에 성공했습니다.',
        ...receipt,
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

      return res.status(500).json({
        success: false,
        status: 500,
        message: '서버 오류가 발생했습니다.',
      });
    }
  },
};
