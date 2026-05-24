import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">
          PlayFlow
        </Link>
        <Link
          to="/settings"
          className="p-2 rounded-lg hover:bg-background transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}
