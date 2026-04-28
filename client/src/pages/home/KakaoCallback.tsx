import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { STORAGE_KEYS } from '@/constants/storage';
import { PATHS } from '@/router';
import Home from './Home';
import { useToast } from '@/components';

export default function KakaoCallback() {
  const navigate = useNavigate();
  const called = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/kakao/callback?code=${code}`)
      .then((res) => {
        if (!res.ok) throw new Error(`카카오 로그인 요청 실패: ${res.status}`);
        return res.json();
      })
      .then(({ accessToken, refreshToken, userId, name, profile }) => {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('name', name);
        localStorage.setItem('profile', profile);
        navigate(PATHS.PURCHASE_LIST);
      })
      .catch((error) => {
        toast.error('로그인에 실패했습니다.');
        console.error(error);
        navigate(PATHS.HOME);
      });
  }, []);

  return <Home />;
}
