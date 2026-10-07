# Royal lobby visual assets

The original user screenshot defines the black/gold palette, dense lobby hierarchy, six tilted hero cards, two ten-card rows, promotion banners and provider strip.

Artwork was regenerated with the built-in ImageGen tool rather than enlarging screenshot crops. `public/royal/hd` contains 20 portrait fantasy illustrations, four live/table illustrations and a 1983px-wide palace background. The fantasy atlas cells are approximately 324 × 486 pixels, suitable for lobby thumbnails and portrait hero cards. Assets are WebP; no text, navigation or buttons are baked into them.

Illustrations and wordmarks are presentation assets. Provider catalog titles retain their original metadata; play still uses local simulation engines. No licensed provider implementation or real-money payment integration was added.

## Generation prompts

- Popular atlas: ten equal cells; candy princess, Greek thunder god, bass fisherman, red dragon, Egyptian queen, crowned corgi, rainbow candy, buffalo, pharaoh and fruit. Match the supplied illustration style; no text or UI.
- New atlas: ten equal cells; crystal wolf, golden temple, panda, golden bull, fantasy queen, cowboy, fire dragon, cat, samurai and blue sorceress. No text or UI.
- Palace background: panoramic ancient royal temples, black obsidian foreground, gold coins and amber sunset; dark left area for HTML copy. No characters, lettering or UI.
- Live atlas: four equal cells; roulette, blackjack dealer, baccarat and prize wheel in a black and gold studio. No logos or UI.

The grid atlases were sliced into individual assets without enlarging their native resolution. All consuming paths point to repository-owned assets.

## Verification

- TypeScript check, production Next.js build and 15 existing engine/provider tests pass.
- Playwright inspected compiled production pages at 1672px and 390px widths. No horizontal page overflow, broken lobby images or browser JavaScript errors were observed.
- Checked six-card carousel, both featured rows, global search and empty results, provider filter, pagination, MN/EN, all three category routes, demo dialog, Escape/focus restore and Trust Center.
- The production page was served through request interception from compiled HTML/static artifacts because shell sessions have isolated loopback networks. This validates client rendering and interaction, not external hosting.
