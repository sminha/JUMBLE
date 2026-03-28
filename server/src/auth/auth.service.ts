import qs from "qs";
import axios from "axios";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.ts";

export const AuthService = {
  fetchKakaoToken: async (code: string) => {
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

  fetchKakaoUser: async (kakaoToken: string) => {
    const { data } = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${kakaoToken}` },
    });

    return data;
  },

  kakaoLogin: async (kakaoUser: any) => {
    const user = await prisma.user.upsert({
      where: { kakao_id: kakaoUser.id },
      update: {
        name: kakaoUser.kakao_account?.profile?.nickname,
        profile_image_url:
          kakaoUser.kakao_account?.profile?.thumbnail_image_url,
        refresh_token: "",
      },
      create: {
        kakao_id: kakaoUser.id,
        name: kakaoUser.kakao_account?.profile?.nickname,
        profile_image_url:
          kakaoUser.kakao_account?.profile?.thumbnail_image_url,
        refresh_token: "",
      },
    });

    const payload = { userId: user.id.toString() };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: "14d",
    });

    prisma.user
      .update({
        where: { id: user.id },
        data: { refresh_token: refreshToken },
      })
      .catch((error) => console.error("토큰 저장 실패:", error));

    return { user, accessToken, refreshToken };
  },
};
