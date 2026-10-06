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

## Provider catalog and sandbox API

The Next.js runtime now also includes `/providers`, `/live`, and `/slots`: 76 verified official game pages (34 live), provider/category/name filters, pagination, and eight provider portfolio links. Official public pages open externally; availability and age/country checks remain with the provider.

A server-side SoftAggregator adapter is connected to Next.js routes `/api/providers/status`, `/api/providers/games`, and `/api/providers/launch`. It imports the full approved account catalog and allows only explicitly demo-supported games through `getGameDemo`. Unsupported live games remain visible but cannot launch. No real-money API method or wallet callback is enabled.

**No sandbox account or API credentials have been issued, and no live provider session has been launched in this work.** SoftAggregator advertises a free sandbox and 200+ providers / 40,000+ games. Its docs require `api_login` and `api_password` from an approved operator backend. Its site differs on whether issuance is instant or follows approval; confirm sandbox scope during onboarding.

Visit https://softaggregator.com/ to request operator sandbox access. Add `SOFTAGGREGATOR_API_LOGIN`, `SOFTAGGREGATOR_API_PASSWORD`, `SOFTAGGREGATOR_CURRENCY`, and `PUBLIC_ORIGIN` as server environment variables (see `.env.example`). Credentials stay server-side. The provider pages switch to the full account catalog only after an actual successful API response.

Among the suppliers checked, EveryMatrix reports 45,000+ games and previously reported 350+ suppliers; SOFTSWISS reports 40,000+ titles and 300+ providers. Free self-service API sandboxes were not confirmed for either. SoftAggregator is the implemented free-sandbox candidate, not a claim of the largest overall library.

Official references:
- https://softaggregator.com/docs.html
- https://softaggregator.com/
- https://www.softswiss.com/game-aggregator/
- https://everymatrix.com/news/introducing-a-new-era-with-casino-consolidation/
- https://everymatrix.com/news/everymatrix-signs-largest-ever-content-aggregation-deal-with-bet365/

Validation: `npm test`, `npm run check`, `npm run build`. The earlier standalone prototype remains available via `node server.mjs`; it is separate from the primary Next.js eight-game lobby.
