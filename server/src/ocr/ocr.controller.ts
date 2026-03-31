import { Request, Response } from "express";
import { OcrService } from "./ocr.service.ts";

export const OcrController = {
  parseReceipt: async (req: Request, res: Response) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "이미지 파일이 필요합니다.",
        });
      }

      const result = await OcrService.parseReceipt(file.buffer, file.mimetype);

      return res.status(200).json({
        success: true,
        status: 200,
        message: "영수증 분석에 성공했습니다.",
        data: result,
      });
    } catch (error) {
      console.error("🚨 OCR 에러 발생:", error);

      return res.status(500).json({
        success: false,
        status: 500,
        message: "영수증 분석 중 오류가 발생했습니다.",
      });
    }
  },
};
