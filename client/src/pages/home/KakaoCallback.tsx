import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { STORAGE_KEYS } from '@/constants/storage';
import { PATHS } from '@/router';
import Home from './Home';

export default function KakaoCallback() {
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/kakao/callback?code=${code}`)
      .then((res) => res.json())
      .then(({ accessToken, refreshToken, userId, name, profile }) => {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('name', name);
        localStorage.setItem('profile', profile);
        navigate(PATHS.PURCHASELIST);
      });
  }, []);

  return <Home />;
}
