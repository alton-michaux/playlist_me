import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getLoginUrl } from '../../api/auth';

export function Navbar() {
  const { isLoggedIn, user, dispatch } = useAuth();
  const [loginUrl, setLoginUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      getLoginUrl()
        .then(setLoginUrl)
        .catch(() => {
          // Backend may not be ready yet; silently ignore
        });
    }
  }, [isLoggedIn]);

  return (
    <nav className="flex justify-between items-center px-6 h-14 border-b bg-background sticky top-0 z-10">
      <img src="/playlist_me.svg" alt="playlist_me" className="h-8 block dark:hidden" />
      <img src="/playlist_me_logo-dark.svg" alt="playlist_me" className="h-8 hidden dark:block" />

      <div className="flex items-center gap-3">
        {isLoggedIn && user ? (
          <>
            {user.images[0]?.url && (
              <img
                src={user.images[0].url}
                alt={user.display_name}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span className="text-sm font-medium">{user.display_name}</span>
            <button
              onClick={() => dispatch({ type: 'LOGOUT' })}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          <a
            href={loginUrl ?? '#'}
            className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
          >
            Log in with Spotify
          </a>
        )}
      </div>
    </nav>
  );
}
