import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { CallbackHandler } from './components/auth/CallbackHandler';
import { useAuth } from './context/AuthContext';

// Pages (implemented in Phase 5 — placeholders for now)
function LandingPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <h1 className="text-4xl font-bold">playlist_me</h1>
      <p className="text-muted-foreground text-lg max-w-md">
        Browse Spotify playlists by genre, preview tracks, and save your favourites.
      </p>
    </div>
  );
}

function BrowsePlaceholder() {
  return (
    <div className="p-6">
      <p className="text-muted-foreground">Browse page — coming in Phase 5</p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-muted-foreground">404 — Page not found</p>
    </div>
  );
}

function HomePage() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <BrowsePlaceholder /> : <LandingPlaceholder />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/callback" element={<CallbackHandler />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
