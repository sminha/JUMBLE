import { STORAGE_KEYS } from '@/constants/storage';

async function reissue() {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('profile');
    window.location.href = '/';
    throw new Error('토큰 재발급 실패');
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await res.json();

  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
}

export async function fetchWithAuth(url: string, options: RequestInit) {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) {
    await reissue();

    const newAccessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
  }

  return res;
}
