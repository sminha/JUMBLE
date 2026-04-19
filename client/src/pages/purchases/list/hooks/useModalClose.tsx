import { useLocation, useNavigate } from 'react-router';

export function useModalClose(fallback: string) {
  const navigate = useNavigate();
  const location = useLocation();
  const background = (location.state as { background?: unknown } | null)?.background;

  return () => {
    if (background) navigate(-1);
    else navigate(fallback);
  };
}
