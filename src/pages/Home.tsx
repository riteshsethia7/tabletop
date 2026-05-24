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
  { to: '/who-goes-first', icon: Gamepad2, label: 'Who Goes First', color: 'bg-blue-500' },
  { to: '/teams', icon: Users, label: 'Team Builder', color: 'bg-green-500' },
  { to: '/turn-order', icon: ArrowDownUp, label: 'Turn Order', color: 'bg-purple-500' },
  { to: '/scores', icon: ListOrdered, label: 'Score Tracker', color: 'bg-indigo-500' },
  { to: '/arena', icon: Trophy, label: 'Arena Mode', color: 'bg-pink-500' },
  { to: '/timer', icon: TimerIcon, label: 'Multi-Clock Timer', color: 'bg-orange-500' },
  { to: '/dice', icon: Dices, label: 'Dice Roller', color: 'bg-red-500' },
  { to: '/wheel', icon: Gauge, label: 'Spin Wheel', color: 'bg-teal-500' },
  { to: '/coin', icon: Coins, label: 'Coin Flip', color: 'bg-amber-500' },
];

export function Home() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to TableTop</h1>
        <p className="text-text-secondary">
          Your offline board game companion. Choose a feature to get started!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {features.map(({ to, icon: Icon, label, color }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center justify-center p-6 bg-surface rounded-xl border border-border hover:border-primary transition-all hover:scale-105 active:scale-95"
          >
            <div className={`${color} p-4 rounded-full mb-3`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <span className="text-center text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
