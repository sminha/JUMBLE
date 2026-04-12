async function reissue() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/refresh`);
  const { accessToken, refreshToken } = await res.json();

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export async function fetchWithAuth(url: string, options: RequestInit) {
  const accessToken = localStorage.getItem('accessToken');

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) {
    await reissue();
    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return res;
}
