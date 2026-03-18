import axios from "axios";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.ts";

export const AuthController = {
  kakaoLogin: async (req: Request, res: Response) => {
    const { code } = req.query;
    if (!code) return res.status(400).send("코드가 없습니다.");

    try {
      const kakaoToken = await AuthService.getKakaoToken(code as string);
      const kakaoUser = await AuthService.getKakaoUser(kakaoToken);

      const accessToken = jwt.sign(
        { userId: kakaoUser.id.toString() },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: "1h" },
      );

      const refreshToken = jwt.sign(
        { userId: kakaoUser.id.toString() },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "14d" },
      );

      const user = await AuthService.upsertKakaoUser(kakaoUser, refreshToken);

      res.json({ accessToken, refreshToken, user: serializeUser(user) });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("카카오 에러 응답:", error.response?.data);
        res.status(error.response?.status || 500).json({
          message: "카카오 로그인 통신 오류",
          detail: error.response?.data,
        });
      } else {
        const err = error as Error;
        console.error("일반 에러:", err.message);
        res.status(500).send("서버 내부 오류");
      }
    }
  },
};

// 유저 객체에서 BigInt를 문자열로 변환해주는 유틸 함수
const serializeUser = (user: any) => {
  return JSON.parse(
    JSON.stringify(user, (key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
};
