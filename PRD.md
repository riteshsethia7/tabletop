# Offline Mobile Board Game Companion PWA
## Product Requirements Document (PRD)

Version: MVP v1.1  
Platform: Mobile-only Progressive Web App (PWA)

---

# 1. Product Vision

Build a mobile-first offline-capable Progressive Web App designed for board game players, tabletop groups, family game nights, and party games.

The application removes friction from common tabletop activities:

- Choosing who starts
- Creating balanced teams
- Randomizing player order
- Tracking scores
- Running multiple player timers
- Rolling dice
- Coin flips
- Spin wheels
- Tracking multi-game tournaments / championships

Primary interaction principle:

> Put phone on table → Everyone touches → App handles setup instantly.

The app should require:

- No account
- No internet after installation
- No backend for MVP
- Minimal setup time
- Fast launch (<2 seconds)

---

# 2. Goals

## Primary Goals

- Fully offline functionality
- Mobile-only optimized UX
- Touch-first interaction model
- Handle up to 12 simultaneous touches
- Fair randomness
- Fast performance
- Zero login friction
- Installable PWA

## Non Goals (MVP)

Not included initially:

- User accounts
- Cloud sync
- Multiplayer networking
- Social features
- Cross-device syncing
- AI recommendations
- Analytics

---

# 3. Target Users

## Primary Users

Board game players (2–12 players)

Examples:

- Family board game nights
- Friends gatherings
- Casual tabletop players

## Secondary Users

- Tabletop RPG groups
- Classroom activities
- Tournament organizers
- Party game groups

---

# 4. Core Features

---

# Feature 1 — Who Goes First?

## Problem

Groups waste time deciding who starts.

## User Flow

1. Open app
2. Tap "Who Goes First"
3. Players place fingers simultaneously
4. App detects touches
5. Lock phase begins (1–2 seconds)
6. Additional touches ignored
7. Fair random selection
8. Winner highlighted

Example:

4 fingers detected:

```

🟢 Finger 1
🔵 Finger 2
🟡 Finger 3
🔴 Finger 4

Winner → 🔵

```

## Requirements

Functional:

- Support 2–12 simultaneous touches
- Ignore late joins after lock
- Fair randomness
- Touch registration visualization

UX:

- Finger circles shown instantly
- Pulse animation before reveal
- Haptic feedback
- Winner glow animation

Technical:

Pointer Events API

Randomness:

```

crypto.getRandomValues()

```

NOT:

```

Math.random()

```

---

# Feature 2 — Team Builder

## Problem

Need balanced random teams.

## Updated Flow

1. Select number of teams FIRST

Example:

```

2 Teams
3 Teams
4 Teams
5 Teams
6 Teams

```

2. Players place fingers
3. App locks input
4. Teams generated
5. Color reveal animation

Example:

7 Players → 2 Teams

```

Team Blue

Player 1
Player 3
Player 5
Player 7

Team Red

Player 2
Player 4
Player 6

```

Requirements:

- Support 2–12 players
- Balanced distribution
- Fair shuffle
- Team colors accessible for colorblind users

Algorithm:

1. Collect touches
2. Fisher-Yates shuffle
3. Distribute round-robin

Example:

```

A B A B A B A

```

---

# Feature 3 — Turn Order Generator

## Problem

Need fair player sequence.

## Flow

1. Players place fingers
2. Touches lock
3. App generates order

Example:

```

Player 3 → Turn 1
Player 1 → Turn 2
Player 5 → Turn 3
Player 2 → Turn 4

```

Requirements:

- Support 2–12 touches
- Unique order assignment
- Animated reveal

Algorithm:

Fisher-Yates Shuffle

Complexity:

```

O(n)

```

---

# Feature 4 — Score Tracker

## Problem

Need lightweight score management.

## Flow

Create Game:

```

Player Names

Alex
John
Sarah
Emma

```

Round Entry:

Round 1:

```

Alex +10
John +7
Sarah +5
Emma +12

```

Round 2:

```

Alex +4
John +9
Sarah +3
Emma +6

```

Totals:

```

Emma — 18
Alex — 14
John — 16
Sarah — 8

```

Winner:

```

🏆 Emma Wins

```

Requirements:

Functional:

- Add players
- Remove players
- Edit previous rounds
- Undo last round
- Negative scores
- Tie detection

Persistence:

IndexedDB

Data Model:

```json
{
  "gameId":"uuid",
  "players":[
    {
      "id":"1",
      "name":"Alex"
    }
  ],
  "rounds":[
    {
      "scores":[10,5,7]
    }
  ],
  "winner":"player-id"
}
```

---

# Feature 5 — Multi Clock Timer

## Problem

Board games often need multiple timers.

Requirement expanded:

Support:

**2 → 12 timers**

Examples:

- Chess
- Team board games
- Tournament rounds

Setup:

```

Players: 6

Time Per Player:

10 Minutes

Auto Advance:

ON / OFF

```

Modes:

## Auto Mode

```

Player A Ends

↓

Player B Starts Immediately

```

## Manual Mode

```

Player A Ends

↓

Wait for Player B Tap

```

Features:

- Pause
- Resume
- Reset
- Undo accidental tap
- Auto next clock
- Manual next clock
- Clock history
- Background-safe timing

Undo Example:

```

Player 4 tapped wrong

↓

Undo

↓

Previous state restored

```

Performance Requirement:

Timer drift:

```

<100ms drift over 30 minutes

```

Technical:

Use:

```

performance.now()

```

NOT:

```

setInterval()

```

Reason:

Prevents timer drift.

Persistence:

Timer survives refresh.

---

# Feature 6 — Dice Roller

Supported Dice:

```

D2
D4
D6
D8
D10
D12
D20
D30
D100

```

Removed:

❌ D16

Flow:

Select:

```

Dice: D20

Count: 3

```

Output:

```

17
4
20

Total = 41

```

Features:

- Multiple dice
- Roll history
- Animation

Future:

```

3D6
2D20+5

```

---

# Feature 7 — Coin Flip

Simple fast decision maker.

Flow:

Press:

```

Flip Coin

```

Result:

```

HEADS

```

or

```

TAILS

```

Requirements:

- Fair randomness
- Coin animation
- Optional vibration

Uses:

```

crypto.getRandomValues()

```

---

# Feature 8 — Spin Wheel

Problem:

Need custom random selection.

Examples:

Wheel Items:

```

Pizza
Burger
Sushi
Pasta

```

Result:

```

Winner → Sushi

```

Requirements:

- 2–20 segments
- Save presets
- Custom labels
- Animation
- Haptic feedback

Use Cases:

- Random challenges
- Team picks
- Board game events

---

# Feature 9 — Arena Mode (Series / Championship Tracker)

## Problem

Groups often play multiple board games.

Need:

> "Who won game night overall?"

Inspired by board game session tracking communities.

Flow:

Create Arena:

```

Arena Name:

Friday Board Night

```

Players:

```

Alex
John
Sarah
Emma

```

Game 1:

```

Catan

Winner:

Alex

```

Game 2:

```

Uno

Winner:

Sarah

```

Game 3:

```

Chess

Winner:

Alex

```

Leaderboard:

```

Alex

Wins: 2

Sarah

Wins: 1

John

Wins: 0

Emma

Wins: 0

```

Champion:

```

🏆 Arena Champion

Alex

```

Optional Weighted Mode:

Example:

```

1st Place = 3 points

2nd Place = 2 points

Participation = 1 point

```

Additional Stats:

Track:

- Win %
- Games Played
- Longest Win Streak
- Favorite Game
- Average Placement

Example:

```

Alex

Games Played: 10

Wins: 5

Win Rate: 50%

Longest Streak: 3

```

Persistence:

IndexedDB

Future Expansion:

Arena history export

---

# 5. Offline Requirements

Everything must work offline:

✅ Team Builder  
✅ Turn Order  
✅ Who Goes First  
✅ Arena Mode  
✅ Score Tracker  
✅ Timer  
✅ Dice  
✅ Coin Flip  
✅ Spin Wheel

Storage:

IndexedDB

Caching:

Service Worker

Strategy:

```

Cache First

```

---

# 6. Performance Requirements

Cold Start:

```

<2 seconds

```

Finger Registration:

```

<50ms

```

Timer Accuracy:

```

<100ms drift over 30 mins

```

Lighthouse Goals:

```

Performance >90

Accessibility >90

PWA >95

```

---

# 7. Accessibility

Requirements:

- Haptic feedback
- High contrast mode
- Colorblind-safe colors
- Large touch targets (>48px)
- Reduced motion option

---

# 8. Security

No accounts

No analytics MVP

No backend MVP

No cloud dependency

Local-only data

---

# 9. Recommended Tech Stack

Frontend:

```

React

TypeScript

Vite

```

State:

```

Zustand

```

Storage:

```

IndexedDB

Dexie.js

```

PWA:

```

vite-plugin-pwa

```

Styling:

```

TailwindCSS

```

Animation:

```

Motion

```

Touch Detection:

```

Pointer Events API

```

Randomness:

```

crypto.getRandomValues()

```

Timing Engine:

```

performance.now()

```

Hosting:

```

Cloudflare Pages

```

Testing:

```

Vitest

Playwright

```

Lint:

```

ESLint

Prettier

```

---

# 10. Suggested Folder Structure

```

src/

features/
finger-touch/
who-goes-first/
team-builder/
turn-order/
score-tracker/
arena/
timer/
dice/
coin/
spin-wheel/

storage/
rng/
hooks/
components/
services/
workers/
db/
types/

```

---

# 11. Algorithms

Finger Selection:

```

Collect touches

↓

Lock phase

↓

Shuffle

↓

Pick first

```

Algorithm:

Fisher-Yates

Team Builder:

```

Shuffle

↓

Round Robin Distribution

```

Turn Order:

Fisher-Yates

Arena Leaderboard:

```

Win Counter

+

Weighted Optional Score

```

Randomness:

```

crypto.getRandomValues()

```

---

# 12. Future V2 Features

- Tournament brackets
- QR session sharing
- Player profiles
- Saved groups
- ELO ratings
- Arena history exports
- Voice announcements
- Tablet landscape mode
- Custom timer presets
- RPG dice parser

---

# Final Stack Recommendation

Frontend:

React + TypeScript + Vite

State:

Zustand

Storage:

Dexie + IndexedDB

Offline:

vite-plugin-pwa

Hosting:

Cloudflare Pages

Reason:

- Excellent offline support
- Strong mobile touch handling
- Fast performance
- Minimal backend complexity
- Scales well into V2

---

# 13. UI / UX Design Principles

## Design Philosophy

The application should feel:

- Fast
- Clean
- Minimal
- Touch-first
- Zero clutter
- Large tap targets
- Board-game table friendly

Primary goal:

> Open app → Tap once → Start playing.

Avoid:

- Complex menus
- Small buttons
- Overloaded screens
- Excessive animations

UI principles:

### Layout

Header:

```

Screen Title

Settings Icon

```

Main Content:

```

Feature Content

```

Footer:

```

Bottom Banner Ad Area

```

Navigation:

Use bottom navigation bar.

Example:

```

Home

Arena

Scores

Tools

Settings

```

Touch Target Requirements:

Minimum:

```

48px × 48px

```

Preferred:

```

56px × 56px

```

Animations:

- Fast (<300ms)
- Functional
- Optional reduced motion support

Typography:

Simple readable font.

Recommended:

```

Inter

```

Fallback:

```

System UI fonts

```

---

# 14. Settings System

Provide Settings screen accessible globally.

Top-right icon:

```

⚙ Settings

```

Settings options:

## Theme Mode

Options:

```

System Default

Light Mode

Dark Mode

```

Requirement:

App theme changes instantly.

Persist preference locally.

Storage:

```

IndexedDB

```

Fallback:

```

localStorage

```

---

## Accent Color Customization

Allow users to customize app accent color.

Examples:

```

Blue

Green

Orange

Purple

Red

Teal

Amber

```

Usage:

Accent color affects:

- Buttons
- Selected team colors
- Progress bars
- Timer highlights
- Winner animations

Requirement:

Color updates immediately.

Persist offline.

Future V2:

Custom color picker.

---

## Haptics Toggle

Option:

```

ON

OFF

```

Controls:

- Winner vibration
- Dice roll vibration
- Wheel spin vibration

---

## Sound Toggle

Option:

```

ON

OFF

```

Controls:

- Timer alerts
- Winner reveal sounds
- Coin flip sound

---

## Reduced Motion

Option:

```

ON

OFF

```

Accessibility support.

Disables:

- Heavy animations
- Large transitions

---

## Auto Lock Screen Prevent

Option:

```

Keep Screen Awake

ON / OFF

```

Useful during:

- Timers
- Arena sessions

Implementation:

```

Wake Lock API

```

---

# 15. Monetization (MVP)

Monetization Model:

Banner advertisements only.

Requirements:

Ads must NOT interrupt gameplay.

No:

❌ Full screen popup ads

❌ Mid-game interstitial ads

❌ Forced video ads

Allowed:

✅ Bottom banner only

---

## Banner Placement

Persistent bottom banner zone.

Layout:

```

---------------------------------

Header

---------------------------------

Feature Area

Feature Area

Feature Area

---------------------------------

Banner Ad Area

320x50

or

Adaptive Banner

---------------------------------

Bottom Navigation

---------------------------------

```

Banner requirements:

- Must never overlap gameplay UI
- Timer controls must remain accessible
- Touch interactions must not conflict

Suggested height:

```

50px

```

Tablet:

```

90px

```

---

## Ad Network Recommendation

For MVP:

```

Google AdMob

```

PWA consideration:

Use:

```

Google AdSense Auto Ads

```

Alternative future:

```

Carbon Ads

```

Premium V2 idea:

```

₹99 one-time purchase

Remove ads permanently

```

---

# 16. UI Technical Requirements

Theme System:

Recommended:

```

CSS Variables

```

Example:

```css
:root {
--primary: #2563eb;
--background: #ffffff;
--surface: #f8fafc;
--text: #111827;
}

.dark {
--background: #121212;
--surface: #1e1e1e;
--text: #ffffff;
}
```

State Management:

Theme state:

```

Zustand

```

Persist:

```

Dexie + IndexedDB

```

Preferred Architecture:

```

Settings Store

↓

Theme Provider

↓

UI Components

```

---

# 17. Future Monetization (V2)

Optional future:

- Remove ads purchase
- Premium themes
- Arena exports
- Tournament packs
- Advanced statistics

No pay-to-win features.

Core gameplay utilities remain free.

---