# MONGOLZ Casino Demo

Premium Mongolian-first casino simulation UI built with Next.js, React and TypeScript.

## What is included

- Mongolian / English language switch
- Responsive desktop + mobile casino lobby
- Local demo balance starting at 10,000
- Local session history stored in browser localStorage
- Search and category filters
- Demo cashier UI for Visa, Mastercard, USDT, USDC, BTC and ETH
- Eight playable browser demo games:
  - Steppe Fortune / Талын Эрдэнэ — Slot
  - Golden Roulette / Алтан Рулет
  - Khan 21 / Хааны 21 — Blackjack
  - Steppe Baccarat / Талын Баккара
  - Sky Plinko / Тэнгэр Plinko
  - Gem Mines / Эрдэнийн Уурхай
  - Lucky Dice / Азын Шоо
  - Blue Sky Crash / Хөх Тэнгэр Crash

## Demo only

This repository does **not** process real money, card payments or cryptocurrency. The game engines use browser-side `Math.random()` for UI/demo simulation and are not certified or suitable for real-money gambling.

The repository may also contain earlier provider/API exploration files (`provider.mjs`, `server.mjs`, `src/`). They are preserved as integration scaffolding but are not used by the current Next.js demo runtime.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

## Deploy

The current app is a standard Next.js project and can be connected to Vercel or Railway from this GitHub repository.
