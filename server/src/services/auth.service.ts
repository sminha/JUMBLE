import qs from "qs";
import axios from "axios";
import prisma from "../lib/prisma.ts";

export const AuthService = {
  getKakaoToken: async (code: string) => {
    const response = await axios({
      method: "POST",
      url: "https://kauth.kakao.com/oauth/token",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        client_secret: process.env.KAKAO_CLIENT_SECRET,
        code,
      }),
    });

    return response.data.access_token;
  },

  getKakaoUser: async (kakaoToken: string) => {
    const { data } = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${kakaoToken}` },
    });
    return data;
  },

  upsertKakaoUser: async (kakaoUser: any, refreshToken: string) => {
    return await prisma.user.upsert({
      where: { kakao_id: kakaoUser.id },
      update: {
        name: kakaoUser.kakao_account?.profile?.nickname,
        profile_image_url:
          kakaoUser.kakao_account?.profile?.thumbnail_image_url,
        refresh_token: refreshToken,
      },
      create: {
        kakao_id: kakaoUser.id,
        name: kakaoUser.kakao_account?.profile?.nickname,
        profile_image_url:
          kakaoUser.kakao_account?.profile?.thumbnail_image_url,
        refresh_token: refreshToken,
      },
    });
  },
};
