import { useState, useEffect } from 'react';
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
  Download,
  Share,
  X,
  MoreVertical,
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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showSafariInstructions, setShowSafariInstructions] = useState(false);
  const [showAndroidInstructions, setShowAndroidInstructions] = useState(false);

  // Check if device is iOS or Android
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isChromeIOS = isIOS && /crios/i.test(navigator.userAgent);
  const isAndroid = /android/i.test(navigator.userAgent);

  useEffect(() => {
    // Check if already installed/running as PWA
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isInstalled);

    console.log('[PWA] Install status check:', {
      isInstalled,
      protocol: window.location.protocol,
      isSecure: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
      userAgent: navigator.userAgent,
      serviceWorker: 'serviceWorker' in navigator,
      displayMode: window.matchMedia('(display-mode: standalone)').matches
    });

    const handler = (e: Event) => {
      console.log('[PWA] ✅ beforeinstallprompt event fired! Install prompt available.');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
      // Cache for later use
      (window as any).deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if event was already fired before component mounted
    if ((window as any).deferredPrompt) {
      console.log('[PWA] Using cached deferred prompt');
      setDeferredPrompt((window as any).deferredPrompt);
      setShowInstallButton(true);
    }

    // Log if event doesn't fire after 5 seconds
    const timeout = setTimeout(() => {
      if (!deferredPrompt) {
        console.log('[PWA] ⚠️  beforeinstallprompt event did not fire. Requirements:', {
          'HTTPS or localhost': window.location.protocol === 'https:' || window.location.hostname === 'localhost',
          'Valid manifest': 'Check browser DevTools',
          'Service Worker': 'serviceWorker' in navigator,
          'Not already installed': !isInstalled
        });
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timeout);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Automatic install available
      console.log('[PWA] Showing install prompt');
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log('[PWA] User choice:', outcome);
      if (outcome === 'accepted') {
        setShowInstallButton(false);
      }

      setDeferredPrompt(null);
    } else if (isAndroid) {
      // Fallback for Android - show manual instructions
      setShowAndroidInstructions(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to PlayFlow</h1>
        <p className="text-text-secondary">
          Your offline board game companion. Choose a feature to get started!
        </p>
        {isStandalone ? (
          <p className="mt-3 inline-flex items-center gap-2 text-green-600 text-sm font-medium">
            <Download className="w-4 h-4" />
            App is installed!
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {(showInstallButton || isAndroid) && !isIOS && (
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Add PlayFlow to home screen
              </button>
            )}
            {isIOS && (
              <button
                onClick={() => setShowSafariInstructions(true)}
                className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
              >
                <Share className="w-4 h-4" />
                How to install on iPhone (use Safari)
              </button>
            )}
            {isChromeIOS && (
              <p className="text-xs text-text-secondary">
                Note: Chrome on iOS doesn't support app installation. Please open this page in Safari.
              </p>
            )}
          </div>
        )}
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

      {/* Safari Install Instructions Modal */}
      {showSafariInstructions && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowSafariInstructions(false)}
        >
          <div
            className="bg-surface rounded-xl max-w-md w-full p-6 border-2 border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Install on Safari</h2>
              <button
                onClick={() => setShowSafariInstructions(false)}
                className="p-2 hover:bg-background rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <p>Tap the <Share className="w-4 h-4 inline" /> <strong>Share</strong> button at the bottom of Safari</p>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <p>Scroll down in the share menu</p>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <p>Tap <strong>"Add to Home Screen"</strong></p>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <p>Tap <strong>"Add"</strong> to confirm</p>
              </div>
            </div>

            <button
              onClick={() => setShowSafariInstructions(false)}
              className="w-full mt-6 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 active:scale-95 transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Android Install Instructions Modal */}
      {showAndroidInstructions && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAndroidInstructions(false)}
        >
          <div
            className="bg-surface rounded-xl max-w-md w-full p-6 border-2 border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Install on Android</h2>
              <button
                onClick={() => setShowAndroidInstructions(false)}
                className="p-2 hover:bg-background rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <p>Open Chrome browser on your Android device</p>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <p>Tap the <MoreVertical className="w-4 h-4 inline" /> <strong>menu</strong> icon (three dots) in the top right</p>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <p>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></p>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <p>Tap <strong>"Add"</strong> or <strong>"Install"</strong> to confirm</p>
              </div>
            </div>

            <button
              onClick={() => setShowAndroidInstructions(false)}
              className="w-full mt-6 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 active:scale-95 transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
