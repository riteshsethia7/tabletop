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
  Wifi,
  Shield,
  Smartphone,
  Zap,
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { SEO_DATA } from '../utils/seo';
import { generateSoftwareApplicationSchema, generateFAQSchema } from '../utils/structuredData';

const features = [
  {
    icon: Gamepad2,
    name: 'Who Goes First',
    path: '/who-goes-first',
    description: 'Never argue about who starts the game again! Our innovative Who Goes First feature uses touch detection technology to fairly determine the starting player. Simply have all players place their finger on the screen simultaneously, and our physics-based algorithm randomly selects the first player. Perfect for any board game that needs an impartial way to determine turn order, from classic family games to competitive strategy titles.',
    bestFor: 'Family games, competitive board games, party games, any game requiring fair player selection',
  },
  {
    icon: Users,
    name: 'Team Builder',
    path: '/teams',
    description: 'Create balanced teams effortlessly with our intelligent Team Builder. Simply enter player names and the number of teams you need, and our smart allocation system automatically distributes players evenly. Each team gets a unique color for easy identification during gameplay. Great for team-based strategy games, party games, or organizing tournament brackets. No more manual team assignment or accusations of unfair team composition!',
    bestFor: 'Team-based strategy games, party games like Codenames, sports board games, cooperative games',
  },
  {
    icon: ArrowDownUp,
    name: 'Turn Order Tracker',
    path: '/turn-order',
    description: 'Keep track of complex turn sequences with our Turn Order Tracker. Perfect for games with variable turn order, initiative systems, or rotating player sequences. Add players, customize their order, and get clear visual indicators showing whose turn it is. The tracker highlights the current player and makes it easy to advance to the next turn. Essential for RPGs, war games, and any strategy game with intricate turn mechanics.',
    bestFor: 'RPGs with initiative, war games, complex strategy games, games with variable turn order',
  },
  {
    icon: ListOrdered,
    name: 'Score Tracker',
    path: '/scores',
    description: 'Never lose track of scores again with our comprehensive Score Tracker. Track multiple players across unlimited rounds, with automatic summation showing total scores. Each round is saved with persistent storage, so you can take breaks without losing progress. Perfect for tournament play, campaign games, or any scoring-based game. View individual round scores or total points at a glance, and easily add or modify scores as the game progresses.',
    bestFor: 'Tournament play, scoring-based games like Catan or Ticket to Ride, campaign games, multi-session games',
  },
  {
    icon: Trophy,
    name: 'Arena Mode',
    path: '/arena',
    description: 'Host competitive gaming sessions with our Arena Mode tournament tracker. Record head-to-head matches, track wins and losses, and maintain a live leaderboard showing player rankings. Perfect for organizing tournaments, game night competitions, or tracking long-term rivalries. The leaderboard automatically updates based on match results, showing win rates and total victories. Transform any game into a competitive esport-style experience!',
    bestFor: 'Tournaments, competitive game nights, league play, tracking player statistics over multiple sessions',
  },
  {
    icon: TimerIcon,
    name: 'Multi-Clock Timer',
    path: '/timer',
    description: 'Add time pressure to your games with our chess-style Multi-Clock Timer. Each player gets an individual countdown timer, perfect for games where turn time matters. The timer automatically advances to the next player when a turn ends, or use manual mode for more control. Great for speed chess variants, timed strategy games, or adding urgency to traditional board games. Supports 2-8 players with customizable time limits per player.',
    bestFor: 'Speed chess, timed strategy games, competitive play, teaching turn efficiency, adding challenge to familiar games',
  },
  {
    icon: Dices,
    name: 'Dice Roller',
    path: '/dice',
    description: 'Roll virtual dice with our comprehensive Dice Roller featuring every die type from D2 to D100. Perfect for RPGs like Dungeons & Dragons, Pathfinder, or any tabletop game requiring dice. Our cryptographically secure random number generation ensures truly fair rolls every time. Roll single dice or multiple dice simultaneously, with automatic calculation of totals. Never forget your dice bag at home again - your phone is now your complete dice collection!',
    bestFor: 'RPGs (D&D, Pathfinder), dice-based board games, probability experiments, replacing lost or missing dice',
  },
  {
    icon: Gauge,
    name: 'Spin Wheel',
    path: '/wheel',
    description: 'Make random decisions exciting with our Customizable Spin Wheel. Create custom segments with your own options, then spin the wheel with realistic physics-based animation. Perfect for random event selection in games, choosing between options, or adding an element of chance to any activity. The wheel remembers your custom segments, making it easy to reuse for repeated decisions. Watch the anticipation build as the wheel spins and slows to reveal the result!',
    bestFor: 'Random event selection, choosing between options, game show-style decisions, adding excitement to choices',
  },
  {
    icon: Coins,
    name: 'Coin Flip',
    path: '/coin',
    description: 'Sometimes you just need a simple 50/50 decision. Our Coin Flip provides quick, fair heads-or-tails results with a satisfying flip animation. Perfect for tie-breakers, binary decisions, or games that require coin flips. The virtual coin uses true random generation to ensure completely fair results. Flip once or multiple times - it\'s the digital equivalent of always having a coin in your pocket.',
    bestFor: 'Tie-breakers, binary decisions, games requiring coin flips, quick random choices',
  },
];

const faqs = [
  {
    question: 'How do I install PlayFlow on my device?',
    answer: 'On iOS (iPhone/iPad): Open playflow.in in Safari, tap the Share button, scroll down and select "Add to Home Screen". On Android: Open playflow.in in Chrome, tap the menu (three dots), and select "Add to Home screen" or "Install app". On desktop: Most modern browsers will show an install prompt in the address bar.',
  },
  {
    question: 'Does PlayFlow work offline?',
    answer: 'Yes! PlayFlow is a Progressive Web App (PWA) that works completely offline once installed. All features function without internet connection. Your data is stored locally on your device using IndexedDB, so you can use PlayFlow anywhere - perfect for game nights without WiFi.',
  },
  {
    question: 'Is my game data private and secure?',
    answer: 'Absolutely. PlayFlow uses local-first architecture, meaning all your data stays on your device. We don\'t have servers collecting your information, and we don\'t require accounts. Your scores, team configurations, and settings never leave your phone or computer. We only use Google AdSense for advertisements, which uses cookies as described in our Privacy Policy.',
  },
  {
    question: 'Which browsers and devices are supported?',
    answer: 'PlayFlow works on any modern browser including Chrome, Firefox, Safari, and Edge. It\'s optimized for mobile devices (iOS and Android) but works great on tablets and desktop computers too. For the best experience, we recommend installing it as a PWA on your device.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No account required! PlayFlow is designed to be instantly accessible. Just visit the website and start using any feature immediately. This also means your data stays completely private on your device.',
  },
  {
    question: 'Is PlayFlow free to use?',
    answer: 'Yes, PlayFlow is completely free! We support the app through non-intrusive advertisements. All features are available at no cost, with no premium tiers or in-app purchases.',
  },
];

export function About() {
  const seo = useSEO({
    title: SEO_DATA.about.title,
    description: SEO_DATA.about.description,
    keywords: SEO_DATA.about.keywords,
    canonicalPath: '/about',
    structuredData: [generateSoftwareApplicationSchema(), generateFAQSchema(faqs)],
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {seo}

      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">About PlayFlow</h1>
        <p className="text-lg text-text-secondary leading-relaxed mb-4">
          PlayFlow is the ultimate offline board game companion app, designed to enhance your tabletop gaming experience. Whether you're hosting a casual game night with friends, running a competitive tournament, or embarking on an epic RPG campaign, PlayFlow provides all the essential tools you need in one convenient, free application.
        </p>
        <p className="text-lg text-text-secondary leading-relaxed mb-4">
          Born from a love of board games and the frequent need for dice, timers, and scorekeeping, PlayFlow eliminates the hassle of juggling multiple apps or physical accessories. Our suite of nine carefully crafted tools covers everything from determining who goes first to tracking complex tournament brackets. Best of all, PlayFlow works completely offline as a Progressive Web App, so you can rely on it anywhere - no internet connection required.
        </p>
        <p className="text-lg text-text-secondary leading-relaxed">
          We believe gaming should be accessible and fun for everyone. That's why PlayFlow requires no account creation, keeps your data private on your device, and is completely free to use. Install it once on your phone or tablet, and you'll always have a complete game night toolkit in your pocket.
        </p>
      </div>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Our Features</h2>
        <div className="space-y-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.path}
                className="bg-surface rounded-xl border border-border p-6 hover:border-primary transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary p-3 rounded-lg flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      <Link to={feature.path} className="hover:text-primary transition-colors">
                        {feature.name}
                      </Link>
                    </h3>
                    <p className="text-text-secondary mb-3 leading-relaxed">{feature.description}</p>
                    <p className="text-sm text-text-secondary">
                      <strong className="text-text">Best for:</strong> {feature.bestFor}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology Section */}
      <div className="mb-12 bg-surface rounded-xl border border-border p-6">
        <h2 className="text-2xl font-bold mb-4">Technology & Privacy</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Wifi className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Works Offline</h3>
            </div>
            <p className="text-text-secondary text-sm">
              Progressive Web App technology means PlayFlow works perfectly without internet. Install once and use anywhere, anytime.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Privacy First</h3>
            </div>
            <p className="text-text-secondary text-sm">
              All data stays on your device. No servers, no accounts, no data collection. Your game sessions remain completely private.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Cross-Platform</h3>
            </div>
            <p className="text-text-secondary text-sm">
              Works on iOS, Android, tablets, and desktop computers. One app for all your devices with responsive design.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Lightning Fast</h3>
            </div>
            <p className="text-text-secondary text-sm">
              Optimized performance with instant loading. No lag, no waiting - just smooth, responsive tools when you need them.
            </p>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Perfect For</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-surface rounded-lg border border-border p-4">
            <h3 className="font-semibold mb-2">Game Nights</h3>
            <p className="text-sm text-text-secondary">
              Host memorable game nights with friends and family. All the tools you need for smooth gameplay and fair competition.
            </p>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4">
            <h3 className="font-semibold mb-2">Tournaments</h3>
            <p className="text-sm text-text-secondary">
              Organize and run board game tournaments with professional scorekeeping, brackets, and leaderboards.
            </p>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4">
            <h3 className="font-semibold mb-2">RPG Sessions</h3>
            <p className="text-sm text-text-secondary">
              Dungeon masters and players alike benefit from dice rolling, turn tracking, and timer features.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-surface rounded-lg border border-border p-5">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-primary/10 rounded-xl p-8 border-2 border-primary/20">
        <h2 className="text-2xl font-bold mb-3">Ready to Enhance Your Game Night?</h2>
        <p className="text-text-secondary mb-6">
          Start using PlayFlow today - no account, no download required. Just open and play!
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all active:scale-95"
        >
          Explore Features
        </Link>
      </div>
    </div>
  );
}

export default About;
