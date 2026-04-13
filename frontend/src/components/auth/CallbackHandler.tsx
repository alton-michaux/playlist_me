import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { callbackExchange } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export function CallbackHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useAuth();
  const called = useRef(false);

  useEffect(() => {
    // Guard against StrictMode double-invoke and re-renders
    if (called.current) return;
    called.current = true;

    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (!code || !state) {
      navigate('/', { replace: true });
      return;
    }

    callbackExchange(code, state)
      .then(({ user, access_token }) => {
        dispatch({ type: 'LOGIN', payload: { user, accessToken: access_token } });
        // Clear the code/state from the URL without triggering a page reload
        window.history.replaceState({}, document.title, '/');
        navigate('/', { replace: true });
      })
      .catch((err: unknown) => {
        console.error('OAuth callback failed:', err);
        navigate('/', { replace: true });
      });
  }, [dispatch, location.search, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Logging you in…</p>
    </div>
  );
}
