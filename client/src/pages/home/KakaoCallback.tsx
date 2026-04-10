import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PATHS } from '@/router';
import Home from './Home';

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/kakao/callback?code=${code}`)
      .then((res) => res.json())
      .then(({ accessToken, refreshToken, userId, name, profile }) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('name', name);
        localStorage.setItem('profile', profile);
        navigate(PATHS.PURCHASELIST);
      });
  }, []);

  return <Home />;
}
