import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Home } from './pages/Home';
import { useTheme } from './hooks/useTheme';
import { HelmetProvider } from './contexts/HelmetProvider';

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

// Lazy load content pages
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Privacy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })));
const HowToUse = lazy(() => import('./pages/HowToUse').then(m => ({ default: m.HowToUse })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));

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
    <HelmetProvider>
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
              {/* Content Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/how-to-use" element={<HowToUse />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </AppShell>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
