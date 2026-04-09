import express, { Request, Response, Router } from 'express';
import { AuthController } from './auth.controller';

const router: Router = express.Router();

router.get('/kakao', (req: Request, res: Response) => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&response_type=code`;
  res.redirect(kakaoAuthUrl);
});

router.get('/kakao/callback', AuthController.kakaoLogin);

export default router;
