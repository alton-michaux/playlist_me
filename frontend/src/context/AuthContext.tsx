import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import type { SpotifyUserProfile } from '../types/spotify';
import { setAuthHandlers } from '../api/client';
import { refreshToken as apiRefreshToken } from '../api/auth';

// ─── State ────────────────────────────────────────────────────────────────────

interface AuthState {
  user: SpotifyUserProfile | null;
  accessToken: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoggedIn: false,
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type AuthAction =
  | { type: 'LOGIN'; payload: { user: SpotifyUserProfile; accessToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_TOKEN'; payload: { accessToken: string } };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isLoggedIn: true,
      };
    case 'LOGOUT':
      return initialState;
    case 'SET_TOKEN':
      return { ...state, accessToken: action.payload.accessToken };
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AuthContextValue extends AuthState {
  dispatch: React.Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Register axios refresh/logout handlers whenever auth state changes.
  // The handlers close over the current state so they always have the latest userId.
  useEffect(() => {
    const userId = state.user?.id ?? null;

    setAuthHandlers(
      async () => {
        if (!userId) throw new Error('No user logged in');
        const { access_token } = await apiRefreshToken(userId);
        dispatch({ type: 'SET_TOKEN', payload: { accessToken: access_token } });
        return access_token;
      },
      () => {
        dispatch({ type: 'LOGOUT' });
      }
    );
  }, [state.user?.id]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
