import { Link } from 'react-router-dom';
import { Book, Download, Smartphone, Wifi, HelpCircle } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { SEO_DATA } from '../utils/seo';
import { generateFAQSchema } from '../utils/structuredData';

const faqData = [
  {
    question: 'How do I install PlayFlow on my iPhone or iPad?',
    answer: 'Open playflow.in in Safari (not Chrome), tap the Share button at the bottom, scroll down and select "Add to Home Screen", then tap "Add". The PlayFlow icon will appear on your home screen like a native app.',
  },
  {
    question: 'How do I install PlayFlow on my Android phone?',
    answer: 'Open playflow.in in Chrome browser, tap the menu icon (three dots) in the top right, select "Add to Home screen" or "Install app", then tap "Add" or "Install". PlayFlow will be added to your app drawer.',
  },
  {
    question: 'Can I use PlayFlow without installing it?',
    answer: 'Yes! You can use PlayFlow directly in your web browser without installing. However, installing it as a PWA provides offline access, a better full-screen experience, and quicker access from your home screen.',
  },
  {
    question: 'Do I need to be online to use PlayFlow?',
    answer: 'No. After the first visit, PlayFlow works completely offline. All features function without internet connection. Your data is stored locally on your device.',
  },
];

export function HowToUse() {
  const seo = useSEO({
    title: SEO_DATA.howToUse.title,
    description: SEO_DATA.howToUse.description,
    keywords: SEO_DATA.howToUse.keywords,
    canonicalPath: '/how-to-use',
    structuredData: generateFAQSchema(faqData),
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {seo}

      <h1 className="text-4xl font-bold mb-6 flex items-center gap-3">
        <Book className="w-10 h-10 text-primary" />
        How to Use PlayFlow
      </h1>
      <p className="text-lg text-text-secondary mb-8">
        Complete guide to installing PlayFlow and using all nine features to enhance your board game experience.
      </p>

      {/* Installation Guide */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Download className="w-7 h-7 text-primary" />
          Getting Started: Installation
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* iOS Installation */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold">iOS (iPhone/iPad)</h3>
            </div>
            <ol className="space-y-3 text-text-secondary">
              <li className="flex gap-3">
                <span className="font-bold text-primary flex-shrink-0">1.</span>
                <span>Open <strong>playflow.in</strong> in <strong>Safari browser</strong> (Chrome on iOS doesn't support PWA installation)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary flex-shrink-0">2.</span>
                <span>Tap the <strong>Share button</strong> (square with arrow pointing up) at the bottom of Safari</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary flex-shrink-0">3.</span>
                <span>Scroll down in the share menu and select <strong>"Add to Home Screen"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary flex-shrink-0">4.</span>
                <span>Tap <strong>"Add"</strong> in the top right to confirm</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary flex-shrink-0">5.</span>
                <span>PlayFlow icon will appear on your home screen - tap it to launch!</span>
              </li>
            </ol>
          </div>

          {/* Android Installation */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold">Android</h3>
            </div>
            <ol className="space-y-3 text-text-secondary">
              <li className="flex gap-3">
                <span className="font-bold text-primary flex-shrink-0">1.</span>
                <span>Open <strong>playflow.in</strong> in <strong>Chrome browser</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary flex-shrink-0">2.</span>
                <span>You may see an install banner at the bottom - tap <strong>"Install"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary flex-shrink-0">3.</span>
                <span>Or tap the <strong>menu icon</strong> (three dots) in the top right corner</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary flex-shrink-0">4.</span>
                <span>Select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary flex-shrink-0">5.</span>
                <span>Tap <strong>"Add"</strong> or <strong>"Install"</strong> to confirm</span>
              </li>
            </ol>
          </div>
        </div>

        <div className="bg-primary/10 border-2 border-primary/20 rounded-lg p-4">
          <p className="text-sm text-text-secondary">
            <strong className="text-primary">Pro Tip:</strong> Once installed, PlayFlow works offline! You can use it on airplanes, camping trips, or anywhere without WiFi.
          </p>
        </div>
      </section>

      {/* Feature Tutorials */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Feature Guides</h2>

        <div className="space-y-6">
          {/* Who Goes First */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-2xl font-bold mb-3">
              <Link to="/who-goes-first" className="hover:text-primary transition-colors">
                Who Goes First
              </Link>
            </h3>
            <p className="text-text-secondary mb-4">
              Fairly determine the starting player using touch detection. Perfect for any board game that needs an impartial way to choose who goes first.
            </p>
            <h4 className="font-semibold mb-2">How to Use:</h4>
            <ol className="list-decimal list-inside text-text-secondary space-y-1 mb-4">
              <li>Navigate to the "Who Goes First" feature from the home screen</li>
              <li>Have all players place one finger on the screen simultaneously</li>
              <li>Keep fingers still for a moment while the app detects touches</li>
              <li>The app will randomly select one player as the winner</li>
              <li>The selected player goes first!</li>
            </ol>
            <p className="text-sm text-text-secondary">
              <strong>Tips:</strong> Works best with 2-4 players on phones, up to 6-8 on tablets. Make sure all players touch the screen at the same time.
            </p>
          </div>

          {/* Team Builder */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-2xl font-bold mb-3">
              <Link to="/teams" className="hover:text-primary transition-colors">
                Team Builder
              </Link>
            </h3>
            <p className="text-text-secondary mb-4">
              Automatically create balanced teams for team-based games with color-coded player assignments.
            </p>
            <h4 className="font-semibold mb-2">How to Use:</h4>
            <ol className="list-decimal list-inside text-text-secondary space-y-1 mb-4">
              <li>Enter the names of all players (or just use numbers like "Player 1")</li>
              <li>Select how many teams you want to create</li>
              <li>Tap "Build Teams" to automatically distribute players evenly</li>
              <li>Each team gets a unique color for easy identification</li>
              <li>Shuffle and rebuild if you want different team compositions</li>
            </ol>
            <p className="text-sm text-text-secondary">
              <strong>Best for:</strong> Codenames, Pictionary, team-based strategy games, any game with 4+ players forming teams.
            </p>
          </div>

          {/* Turn Order */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-2xl font-bold mb-3">
              <Link to="/turn-order" className="hover:text-primary transition-colors">
                Turn Order Tracker
              </Link>
            </h3>
            <p className="text-text-secondary mb-4">
              Track complex turn sequences and never lose track of whose turn it is in multi-player games.
            </p>
            <h4 className="font-semibold mb-2">How to Use:</h4>
            <ol className="list-decimal list-inside text-text-secondary space-y-1 mb-4">
              <li>Add players in the desired turn order</li>
              <li>The current player is highlighted</li>
              <li>Tap "Next Turn" to advance to the next player</li>
              <li>Reorder players by dragging if turn order changes mid-game</li>
              <li>Remove or add players as needed during gameplay</li>
            </ol>
            <p className="text-sm text-text-secondary">
              <strong>Best for:</strong> RPGs with initiative systems, war games, any game with rotating or complex turn order.
            </p>
          </div>

          {/* Score Tracker */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-2xl font-bold mb-3">
              <Link to="/scores" className="hover:text-primary transition-colors">
                Score Tracker
              </Link>
            </h3>
            <p className="text-text-secondary mb-4">
              Keep accurate scores across multiple rounds with automatic totaling and persistent storage.
            </p>
            <h4 className="font-semibold mb-2">How to Use:</h4>
            <ol className="list-decimal list-inside text-text-secondary space-y-1 mb-4">
              <li>Add all players to the scoreboard</li>
              <li>Enter scores for each player after each round</li>
              <li>Tap "Add Round" to start scoring a new round</li>
              <li>Total scores are calculated automatically and displayed prominently</li>
              <li>View individual round scores or just the totals</li>
              <li>Scores are saved automatically - take breaks without losing progress!</li>
            </ol>
            <p className="text-sm text-text-secondary">
              <strong>Best for:</strong> Catan, Ticket to Ride, any scoring-based game, tournament play across multiple games.
            </p>
          </div>

          {/* Arena Mode */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-2xl font-bold mb-3">
              <Link to="/arena" className="hover:text-primary transition-colors">
                Arena Mode
              </Link>
            </h3>
            <p className="text-text-secondary mb-4">
              Run tournaments with head-to-head match recording and live leaderboards showing player rankings.
            </p>
            <h4 className="font-semibold mb-2">How to Use:</h4>
            <ol className="list-decimal list-inside text-text-secondary space-y-1 mb-4">
              <li>Add all tournament participants</li>
              <li>After each match, record the winner</li>
              <li>The leaderboard updates automatically with wins, losses, and win rates</li>
              <li>View match history to see all recorded games</li>
              <li>Perfect for tracking statistics over multiple game nights</li>
            </ol>
            <p className="text-sm text-text-secondary">
              <strong>Best for:</strong> Competitive gaming sessions, tracking rivalries, league play, tournament organization.
            </p>
          </div>

          {/* Timer */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-2xl font-bold mb-3">
              <Link to="/timer" className="hover:text-primary transition-colors">
                Multi-Clock Timer
              </Link>
            </h3>
            <p className="text-text-secondary mb-4">
              Chess-style timer for 2-8 players with individual countdown clocks and auto-advance functionality.
            </p>
            <h4 className="font-semibold mb-2">How to Use:</h4>
            <ol className="list-decimal list-inside text-text-secondary space-y-1 mb-4">
              <li>Set the number of players (2-8)</li>
              <li>Set time limit per player (e.g., 5 minutes each)</li>
              <li>Tap a player's clock to start their timer</li>
              <li>When a turn ends, tap the next player's clock to switch</li>
              <li>Enable auto-advance to automatically move to the next player</li>
              <li>Timer alerts when any player runs out of time</li>
            </ol>
            <p className="text-sm text-text-secondary">
              <strong>Best for:</strong> Speed chess, timed strategy games, teaching turn efficiency, adding challenge to any game.
            </p>
          </div>

          {/* Dice Roller */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-2xl font-bold mb-3">
              <Link to="/dice" className="hover:text-primary transition-colors">
                Dice Roller
              </Link>
            </h3>
            <p className="text-text-secondary mb-4">
              Complete virtual dice set from D2 to D100 with secure random generation for fair, unpredictable rolls.
            </p>
            <h4 className="font-semibold mb-2">How to Use:</h4>
            <ol className="list-decimal list-inside text-text-secondary space-y-1 mb-4">
              <li>Select the type of die you need (D4, D6, D8, D10, D12, D20, D100)</li>
              <li>Choose how many dice to roll (1-10)</li>
              <li>Tap the "Roll" button</li>
              <li>Results are displayed with individual die values and total</li>
              <li>Roll history shows previous rolls for reference</li>
            </ol>
            <p className="text-sm text-text-secondary">
              <strong>Best for:</strong> D&D, Pathfinder, any RPG, dice-based board games, replacing lost or forgotten dice.
            </p>
          </div>

          {/* Spin Wheel */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-2xl font-bold mb-3">
              <Link to="/wheel" className="hover:text-primary transition-colors">
                Spin Wheel
              </Link>
            </h3>
            <p className="text-text-secondary mb-4">
              Customizable decision wheel with physics-based spinning for exciting random selection.
            </p>
            <h4 className="font-semibold mb-2">How to Use:</h4>
            <ol className="list-decimal list-inside text-text-secondary space-y-1 mb-4">
              <li>Add custom segments (options) to the wheel</li>
              <li>Each segment can have different text</li>
              <li>Tap or drag the wheel to spin it</li>
              <li>Watch the wheel slow down with realistic physics</li>
              <li>The pointer indicates the winning segment when it stops</li>
              <li>Segments are saved for easy reuse in future spins</li>
            </ol>
            <p className="text-sm text-text-secondary">
              <strong>Best for:</strong> Choosing between options, random event selection, game show-style decisions.
            </p>
          </div>

          {/* Coin Flip */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-2xl font-bold mb-3">
              <Link to="/coin" className="hover:text-primary transition-colors">
                Coin Flip
              </Link>
            </h3>
            <p className="text-text-secondary mb-4">
              Simple, fair virtual coin flip with satisfying animation for quick 50/50 decisions.
            </p>
            <h4 className="font-semibold mb-2">How to Use:</h4>
            <ol className="list-decimal list-inside text-text-secondary space-y-1 mb-4">
              <li>Tap the "Flip Coin" button</li>
              <li>Watch the animated coin flip</li>
              <li>Result shows as either Heads or Tails</li>
              <li>Flip again as many times as needed</li>
              <li>Flip history shows recent results</li>
            </ol>
            <p className="text-sm text-text-secondary">
              <strong>Best for:</strong> Tie-breakers, binary decisions, games requiring coin flips, quick random choices.
            </p>
          </div>
        </div>
      </section>

      {/* Offline Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Wifi className="w-6 h-6 text-primary" />
          Using PlayFlow Offline
        </h2>
        <div className="bg-surface rounded-xl border border-border p-6">
          <p className="text-text-secondary mb-4">
            PlayFlow is built as a Progressive Web App (PWA), which means it works perfectly offline once you've visited it the first time. Here's what you need to know:
          </p>
          <ul className="space-y-2 text-text-secondary">
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span><strong>First Visit:</strong> You need internet connection for the initial load to cache the app files</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span><strong>After Installation:</strong> All features work completely offline, no internet required</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span><strong>Your Data:</strong> Scores, teams, and settings are stored locally on your device</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span><strong>Updates:</strong> When you go online again, the app may update to the latest version automatically</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" />
          Troubleshooting
        </h2>
        <div className="space-y-4">
          <div className="bg-surface rounded-lg border border-border p-4">
            <h3 className="font-semibold mb-2">App won't install on iOS</h3>
            <p className="text-sm text-text-secondary">
              Make sure you're using Safari browser (not Chrome or other browsers). Chrome on iOS doesn't support PWA installation.
            </p>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4">
            <h3 className="font-semibold mb-2">Data is missing after clearing browser cache</h3>
            <p className="text-sm text-text-secondary">
              PlayFlow stores data locally in your browser. Clearing browser data will erase your saved scores and settings. Be cautious when clearing browsing data.
            </p>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4">
            <h3 className="font-semibold mb-2">Features not working offline</h3>
            <p className="text-sm text-text-secondary">
              Make sure you've visited the site at least once while online to cache the necessary files. If problems persist, try reinstalling the app.
            </p>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4">
            <h3 className="font-semibold mb-2">Touch detection not working on "Who Goes First"</h3>
            <p className="text-sm text-text-secondary">
              Make sure all players touch the screen simultaneously and hold for about a second. Remove any screen protectors that might interfere with multi-touch. Works best with 2-6 players.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-surface rounded-lg border border-border p-5">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-text-secondary text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Need More Help */}
      <div className="text-center bg-primary/10 rounded-xl p-8 border-2 border-primary/20">
        <h2 className="text-2xl font-bold mb-3">Need More Help?</h2>
        <p className="text-text-secondary mb-6">
          Can't find what you're looking for? We're here to help!
        </p>
        <Link
          to="/contact"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all active:scale-95"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}

export default HowToUse;
