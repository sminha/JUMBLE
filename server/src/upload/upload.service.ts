import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../lib/s3.ts";

export const UploadService = {
  getPresignedUrl: async (fileName: string, contentType: string) => {
    const key = `receipts/${Date.now()}-${fileName}`;
    const bucket = process.env.AWS_S3_BUCKET_NAME!;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const imageUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return { presignedUrl, imageUrl };
  },
};
