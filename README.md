# MONGOLZ

A polished Mongolian / English casino-style **free-play demo**, with six playable original games. Virtual credits only. No real deposits, withdrawals, prizes, third-party game licenses are included.

## Run

Node.js 20 or newer, no dependencies and no API keys required.

```sh
npm start
# http://localhost:3000
npm test
npm run check
```

`PORT` can be supplied by the hosting environment. The app can also be served from any static host using the project root (ES modules require HTTP, rather than opening index.html as a local file).

## Included

- Responsive burgundy / gold lobby, mobile navigation, keyboard-accessible controls
- Complete MN / EN interface, searchable categories and favorites
- Golden Steppe slots, European roulette, simplified blackjack, mines, dice and crash
- 10,000 starting credits, local balance and the latest 100 settled plays
- Demo cashier with crypto and Visa / Mastercard presentation; no card entry or payment collection
- Local daily loss limit and a 24-hour play pause
- Cryptographic browser randomness; rules and gross payout multipliers shown per game

## Important implementation boundaries

All data and game logic run locally in the browser. Storage is device-specific, editable and removable, and is not an account, financial ledger, certified RNG or compliance system. An interrupted round retains its deducted stake but does not resume. Daily loss limits use UTC days and sum losing rounds, without offsetting winnings. Resetting credits does not clear history or limits; the latest 100 history rows are not a durable enforcement system.

Blackjack stands on soft 17 and deliberately excludes splits, doubles and natural-blackjack bonuses. Crash automatically collects at 20×. Card and crypto buttons are previews only; virtual credits have no cash value.

A real-money service would require a separate secured backend, durable accounting, approved payment integration and webhook validation, provider contracts, KYC/AML, licensing and server-enforced country restrictions. This demo does not claim any of those are active. It is not connected to Evolution, Pragmatic, Hacksaw or SoftAggregator.

## Official provider demos

The Provider Hub links to seven verified Pragmatic Play public demo pages and the official Hacksaw game catalog. These open externally; they do not use the local Mongolz wallet. External availability, age gates, languages and territory checks remain under provider control.

For **in-site** provider demos, a server-side SoftAggregator adapter implements `getGameList`, `createPlayer`, and **only** `getGameDemo` from the official documentation: https://softaggregator.com/docs.html. Only catalog entries with `play_for_fun_supported: true` can launch. Real-money launch methods and wallet callbacks are not exposed. Credentials stay server-side; missing credentials show an explicit unavailable state. Provider iframe blocking can be handled via the accompanying external launch link.

Configure the variables in `.env.example` in your hosting dashboard or shell (the server does not auto-load .env files). Use keys approved for your domain and set `PUBLIC_ORIGIN` to your actual HTTPS origin. No provider credentials were present or provisioned during implementation, so live API launches have **not** been verified. The adapter tests use mocked responses. No Evolution connection is claimed.

### Large catalogs

After valid provider credentials are configured, the Provider Hub retrieves the entire catalog, keeps only explicitly demo-supported games, and offers name search, studio/category filters, and 36-game pagination. All filtered pages are reachable; there is no 100-game truncation. Only one page renders at a time and thumbnails load lazily. Catalog results are cached server-side for five minutes. The actual count and available providers come from your approved account, not a hardcoded promise.
