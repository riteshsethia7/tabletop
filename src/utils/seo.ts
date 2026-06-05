// SEO utility constants and functions

export const SITE_URL = 'https://playflow.in';
export const SITE_NAME = 'PlayFlow';
export const DEFAULT_TITLE = 'PlayFlow - Board Game Companion App';
export const DEFAULT_DESCRIPTION = 'Free offline board game companion with 9 essential tools: dice roller, score tracker, team builder, timer, turn order, arena mode, spin wheel, coin flip, and who goes first selector. Perfect for game nights!';
export const DEFAULT_OG_IMAGE = '/og-image.png';

// Page-specific SEO data
export const SEO_DATA = {
  home: {
    title: 'PlayFlow - Board Game Companion App',
    description: 'Free offline board game companion with 9 essential tools: dice roller, score tracker, team builder, timer, turn order, arena mode, spin wheel, coin flip, and who goes first selector. Perfect for game nights!',
    keywords: ['board game companion app', 'offline board game tools', 'game night utilities', 'PWA board game app', 'dice roller', 'score tracker'],
  },
  about: {
    title: 'About PlayFlow - Board Game Companion Tools',
    description: 'Learn about PlayFlow\'s 9 essential board game tools designed for game nights, tournaments, and RPG sessions. Offline-first PWA with no accounts required.',
    keywords: ['board game companion', 'game night app', 'board game tools', 'offline board game utilities', 'PlayFlow features'],
  },
  privacy: {
    title: 'Privacy Policy | PlayFlow',
    description: 'PlayFlow privacy policy: Learn how we protect your data with local-first storage, no servers, and transparent cookie usage for AdSense.',
    keywords: ['PlayFlow privacy policy', 'board game app privacy', 'data privacy'],
  },
  terms: {
    title: 'Terms of Service | PlayFlow',
    description: 'PlayFlow terms of service: Free board game companion app terms, disclaimers, acceptable use policy, and user agreement.',
    keywords: ['PlayFlow terms of service', 'user agreement', 'terms and conditions'],
  },
  howToUse: {
    title: 'How to Use PlayFlow - Complete User Guide',
    description: 'Complete guide to using PlayFlow board game companion: installation, feature tutorials, tips, troubleshooting, and best practices for game nights.',
    keywords: ['how to use PlayFlow', 'board game app tutorial', 'game night app guide', 'PlayFlow user guide'],
  },
  contact: {
    title: 'Contact PlayFlow - Support & Feedback',
    description: 'Get help with PlayFlow board game companion. Report bugs, request features, or contact our support team.',
    keywords: ['PlayFlow support', 'contact PlayFlow', 'PlayFlow help'],
  },
  whoGoesFirst: {
    title: 'Who Goes First - Random Starting Player Selector | PlayFlow',
    description: 'Fair random starting player selection for board games using touch detection. Perfect for determining who goes first in any tabletop game.',
    keywords: ['random starting player selector', 'who goes first board game', 'fair player selection', 'starting player picker'],
  },
  teams: {
    title: 'Team Builder - Automatic Team Balancer | PlayFlow',
    description: 'Create balanced teams for board games automatically. Smart team allocation with color coding for party games and team-based strategy games.',
    keywords: ['team builder board game', 'automatic team balancer', 'balanced teams', 'team assignment tool'],
  },
  turnOrder: {
    title: 'Turn Order Tracker - Player Sequence Manager | PlayFlow',
    description: 'Manage and display turn sequence for complex board games. Customizable player order with visual indicators.',
    keywords: ['turn order tracker', 'turn sequence tracker', 'player order manager', 'board game turn management'],
  },
  scores: {
    title: 'Score Tracker - Multi-Round Game Score Keeper | PlayFlow',
    description: 'Track scores across multiple rounds with automatic summation. Persistent score storage with history for tournaments and game nights.',
    keywords: ['score tracker board game', 'game score keeper', 'multi-round scoring app', 'points calculator'],
  },
  arena: {
    title: 'Arena Mode - Board Game Tournament Tracker | PlayFlow',
    description: 'Tournament bracket and competitive win tracking. Head-to-head match recording with leaderboard for gaming sessions.',
    keywords: ['board game tournament tracker', 'arena mode', 'competitive gaming leaderboard', 'tournament bracket'],
  },
  timer: {
    title: 'Multi-Clock Timer - Chess Timer for Board Games | PlayFlow',
    description: 'Chess-style timer for multiple players. Individual timers with auto-advance option for timed strategy games and speed variants.',
    keywords: ['chess clock app', 'multi-player timer', 'game clock', 'chess timer'],
  },
  dice: {
    title: 'Dice Roller - Virtual RPG Dice (D2-D100) | PlayFlow',
    description: 'Virtual dice roller with multiple die types (D2-D100). Cryptographically secure random generation for RPGs and dice-based games.',
    keywords: ['virtual dice roller', 'RPG dice', 'random dice generator', 'D20 dice roller', 'online dice'],
  },
  wheel: {
    title: 'Spin Wheel - Customizable Decision Wheel | PlayFlow',
    description: 'Customizable decision wheel with physics-based spinning. Create custom segments for random selection and game mechanics.',
    keywords: ['spin wheel', 'decision wheel app', 'custom spinner online', 'random selector wheel'],
  },
  coin: {
    title: 'Coin Flip - Virtual Coin Toss | PlayFlow',
    description: 'Virtual coin flip with 50/50 random heads or tails. Perfect for quick binary decisions and tie-breakers.',
    keywords: ['coin flip', 'virtual coin toss', 'heads or tails app', 'random coin flip'],
  },
  settings: {
    title: 'Settings | PlayFlow',
    description: 'Customize your PlayFlow experience with theme settings, haptic feedback, and app preferences.',
    keywords: ['PlayFlow settings', 'app preferences'],
  },
};

export function generatePageTitle(page: keyof typeof SEO_DATA): string {
  return SEO_DATA[page]?.title || DEFAULT_TITLE;
}

export function generateDescription(page: keyof typeof SEO_DATA): string {
  return SEO_DATA[page]?.description || DEFAULT_DESCRIPTION;
}

export function generateKeywords(page: keyof typeof SEO_DATA): string[] {
  return SEO_DATA[page]?.keywords || [];
}

export function generateCanonicalUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
