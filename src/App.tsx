import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Home } from './pages/Home';
import { useTheme } from './hooks/useTheme';

// Lazy load feature components for code splitting
const WhoGoesFirst = lazy(() => import('./features/who-goes-first').then(m => ({ default: m.WhoGoesFirst })));
const TeamBuilder = lazy(() => import('./features/team-builder').then(m => ({ default: m.TeamBuilder })));
const TurnOrder = lazy(() => import('./features/turn-order').then(m => ({ default: m.TurnOrder })));
const ScoreTracker = lazy(() => import('./features/score-tracker').then(m => ({ default: m.ScoreTracker })));
const Timer = lazy(() => import('./features/timer').then(m => ({ default: m.Timer })));
const Dice = lazy(() => import('./features/dice').then(m => ({ default: m.Dice })));
const Coin = lazy(() => import('./features/coin').then(m => ({ default: m.Coin })));
const SpinWheel = lazy(() => import('./features/spin-wheel').then(m => ({ default: m.SpinWheel })));
const Arena = lazy(() => import('./features/arena').then(m => ({ default: m.Arena })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-secondary">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  useTheme();

  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/who-goes-first" element={<WhoGoesFirst />} />
            <Route path="/teams" element={<TeamBuilder />} />
            <Route path="/turn-order" element={<TurnOrder />} />
            <Route path="/scores" element={<ScoreTracker />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/dice" element={<Dice />} />
            <Route path="/coin" element={<Coin />} />
            <Route path="/wheel" element={<SpinWheel />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
