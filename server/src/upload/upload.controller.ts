import { Request, Response } from "express";
import { UploadService } from "./upload.service.ts";

export const UploadController = {
  getPresignedUrl: async (req: Request, res: Response) => {
    try {
      const { fileName, contentType } = req.body;

      if (!fileName || !contentType) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "fileName과 contentType은 필수입니다.",
        });
      }

      if (!contentType.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "이미지 파일만 업로드 가능합니다.",
        });
      }

      const { presignedUrl, imageUrl } = await UploadService.getPresignedUrl(
        fileName,
        contentType,
      );

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Presigned URL이 생성되었습니다.",
        presignedUrl,
        imageUrl,
      });
    } catch (error) {
      console.error("🚨 Presigned URL 생성 실패:", error);

      return res.status(500).json({
        success: false,
        status: 500,
        message: "서버 오류가 발생했습니다.",
      });
    }
  },
};
