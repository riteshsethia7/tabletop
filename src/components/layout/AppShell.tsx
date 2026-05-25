import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { AdBanner } from './AdBanner';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();

  // Hide settings button on finger placement screens
  const hideSettingsButton = [
    '/who-goes-first',
    '/teams',
    '/turn-order'
  ].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 overflow-y-auto pb-[116px]">
        {children}
      </main>
      <AdBanner />

      {/* Floating Settings Button */}
      {!hideSettingsButton && (
        <Link
          to="/settings"
          className="fixed top-4 right-4 p-3 bg-primary text-white rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all z-50"
          aria-label="Settings"
        >
          <Settings className="w-6 h-6" />
        </Link>
      )}
    </div>
  );
}
