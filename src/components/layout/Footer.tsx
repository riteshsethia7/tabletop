import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Dices,
  Coins,
  Users,
  ListOrdered,
  Timer as TimerIcon,
  Trophy,
  Gamepad2,
  ArrowDownUp,
  Gauge,
} from 'lucide-react';

const features = [
  { to: '/who-goes-first', icon: Gamepad2, label: 'Who Goes First' },
  { to: '/teams', icon: Users, label: 'Team Builder' },
  { to: '/turn-order', icon: ArrowDownUp, label: 'Turn Order' },
  { to: '/scores', icon: ListOrdered, label: 'Score Tracker' },
  { to: '/arena', icon: Trophy, label: 'Arena Mode' },
  { to: '/timer', icon: TimerIcon, label: 'Timer' },
  { to: '/dice', icon: Dices, label: 'Dice Roller' },
  { to: '/wheel', icon: Gauge, label: 'Spin Wheel' },
  { to: '/coin', icon: Coins, label: 'Coin Flip' },
];

export function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show footer after scrolling down 250px
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 250);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render anything if not visible
  if (!isVisible) return null;

  return (
    <footer className="bg-surface border-t-2 border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* App Info */}
          <div>
            <h3 className="font-bold text-lg mb-3">PlayFlow</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              Your offline board game companion with 9 essential tools for game nights, tournaments, and RPG sessions.
            </p>
            <p className="text-xs text-text-secondary">
              Free, offline-first, no accounts required.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-text-secondary hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-secondary hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/how-to-use" className="text-text-secondary hover:text-primary transition-colors">
                  How to Use
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-text-secondary hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-text-secondary hover:text-primary transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-3">Features</h4>
            <ul className="space-y-2 text-sm">
              {features.slice(0, 5).map((feature) => (
                <li key={feature.to}>
                  <Link
                    to={feature.to}
                    className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <feature.icon className="w-3 h-3" />
                    {feature.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Features & Legal */}
          <div>
            <h4 className="font-semibold mb-3">More Features</h4>
            <ul className="space-y-2 text-sm mb-4">
              {features.slice(5).map((feature) => (
                <li key={feature.to}>
                  <Link
                    to={feature.to}
                    className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <feature.icon className="w-3 h-3" />
                    {feature.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-semibold mb-3 mt-6">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-text-secondary hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-text-secondary hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} PlayFlow. All rights reserved.
          </p>
          <p className="text-xs text-text-secondary mt-2">
            Made with ❤️ for board game enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}
