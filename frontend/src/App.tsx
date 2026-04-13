import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { CallbackHandler } from './components/auth/CallbackHandler';
import { LandingPage } from './components/landing/LandingPage';
import { BrowsePage } from './components/browse/BrowsePage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/toaster';
import { useAuth } from './context/AuthContext';

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-muted-foreground">404 — Page not found</p>
    </div>
  );
}

function HomePage() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? (
    <ErrorBoundary>
      <BrowsePage />
    </ErrorBoundary>
  ) : (
    <LandingPage />
  );
}

export default function App() {
  const { isLoggedIn } = useAuth();

  return (
    <div className={`min-h-screen bg-background text-foreground${isLoggedIn ? ' dark' : ''}`}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/callback" element={<CallbackHandler />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}
