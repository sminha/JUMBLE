import axios from 'axios';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { serializeBigInt } from '../utils/serializeBigInt';

export const AuthController = {
  kakaoLogin: async (req: Request, res: Response) => {
    const { code } = req.query;
    if (!code || typeof code !== 'string') return res.status(400).send('코드가 존재하지 않습니다.');

    try {
      const kakaoToken = await AuthService.fetchKakaoToken(code);
      const kakaoUser = await AuthService.fetchKakaoUser(kakaoToken);
      const { user, accessToken, refreshToken } = await AuthService.kakaoLogin(kakaoUser);

      res.json(
        serializeBigInt({
          accessToken,
          refreshToken,
          userId: user.id,
          name: user.name,
          profile: user.profile_image_url,
        }),
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('카카오 에러 응답 : ', error.response?.data);
        res.status(error.response?.status || 500).json({
          message: '카카오 로그인 통신 오류',
          detail: error.response?.data,
        });
      } else {
        const err = error as Error;
        console.error('일반 에러 : ', err.message);
        res.status(500).send('서버 내부 오류');
      }
    }
  },
};
