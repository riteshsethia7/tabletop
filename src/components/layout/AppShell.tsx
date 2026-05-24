import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { AdBanner } from './AdBanner';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      <AdBanner />
      <BottomNav />
    </div>
  );
}
