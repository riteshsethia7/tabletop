import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { AdBanner } from './AdBanner';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 overflow-y-auto pb-[66px]">
        {children}
      </main>
      <AdBanner />

      {/* Floating Settings Button */}
      <Link
        to="/settings"
        className="fixed bottom-[90px] right-6 p-4 bg-primary text-white rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all z-50"
        aria-label="Settings"
      >
        <Settings className="w-6 h-6" />
      </Link>
    </div>
  );
}
